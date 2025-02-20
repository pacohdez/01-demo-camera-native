import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { apiKeycloak } from 'src/boot/axios';
import { useGeneralStore } from 'src/boot/EvidenciasEquipos/general.js'
import { useGetPayloadToken } from 'src/composables/getPayloadToken.js'
import { useGetDecodificarAccessToken } from 'src/composables/getDecodificarAccessToken.js'
import { useGetBuscarValEnArray } from 'src/composables/getBuscarValEnArray.js'
import { useRouter } from 'vue-router'

export const useSecurityStore = defineStore('security', () => {

    const router = useRouter(); // Hook para acceder al router

    const useGeneral = useGeneralStore()
    const { getFechaServidor, getUsuarioPorNumero } = useGeneral
    const { fecha_servidor, obj_personal } = storeToRefs(useGeneral)

    const usePayloadToken = useGetPayloadToken()
    const { payloadToken } = usePayloadToken

    const useDecodificarAccessToken = useGetDecodificarAccessToken()
    const { decodificarAccessToken } = useDecodificarAccessToken

    const useBuscarValEnArray = useGetBuscarValEnArray()
    const { existeValEnArray } = useBuscarValEnArray

    // Estado reactivo para el access_token
    const accessToken = ref(null);
    const refreshToken = ref(null)

    const obj_session_user = ref({
        "id": '',
        "name": '',
        "employee_number": '',
    });

    // Función para guardar el token en el almacenamiento seguro
    const saveToken = async(token, refresh_token) => {
        accessToken.value = token; // Actualiza el estado
        refreshToken.value = refresh_token

        let payload = payloadToken(token)
        obj_session_user.value.name = payload.name
        obj_session_user.value.employee_number = payload.preferred_username
        await getUsuarioPorNumero(obj_session_user.value.employee_number)
        obj_session_user.value.id = obj_personal.value.id
    }

    // Función para obtener el token desde el almacenamiento seguro
    const getToken = async() => {
        return accessToken.value;
    }

    // Función para eliminar el token (logout)
    const cleanToken = async() => {
        accessToken.value = null
        refreshToken.value = null

        Object.assign(obj_session_user.value, {"id": '', "name": '', "employee_number": ''})
    }

    const isTokenExpired = async () => {
        const token = await getToken(); // Recupera el token actual
        let payload = null;

        if (!token) {
            console.log('No token found, considered expired.');
            return true; // Si no hay token, se considera expirado
        }
        
        try {
            payload = payloadToken(token)
            getFechaServidor()
            
            return payload.exp <= fecha_servidor.value;
        } catch (error) {
            console.error('Error decoding token or checking expiration:', error);
            return true;
        }
    }

    const refreshAccessToken = async () => {
        try {
            const res = await apiKeycloak.post('/auth/realms/turboerp/protocol/openid-connect/token', new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: 'frontend',
                client_secret: '365fbe12-ec87-41a6-8ba9-eebdab456a49',
                refresh_token: refreshToken.value,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
    
            await saveToken(res.data.access_token, res.data.refresh_token);
            return res.status;
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            cleanToken(); // Limpia el estado si falla el refresco
            router.push('/login'); // Redirige al login

            return error.status;
        }
    };
    

    //Consumir endpoint de autenticación de Keycloak
    const postLogin = async (username, password) => {
        try {
            const res = await apiKeycloak.post('/auth/realms/turboerp/protocol/openid-connect/token', new URLSearchParams({
                grant_type: 'password',
                client_id: 'frontend',
                client_secret: '365fbe12-ec87-41a6-8ba9-eebdab456a49',
                username,
                password
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Decodificar el token para extraer roles
            let dataAccessToken = decodificarAccessToken(res.data.access_token)
            if(existeValEnArray(dataAccessToken.realm_access.roles, 'ro_dg_capturar_evidencias_fotograficas_piezas')) {
                await saveToken(res.data.access_token, res.data.refresh_token);
                return res;
            } else {
                cleanToken();
                return {status: 0}
            }
        } catch (error) {
            return error;
        }
    }

    return {
        accessToken,
        obj_session_user,
        saveToken,
        getToken,
        cleanToken,
        isTokenExpired,
        refreshAccessToken,
        postLogin,
    }
  
})