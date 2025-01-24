import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiKeycloak } from 'src/boot/axios';
import localforage from 'localforage'

export const useSecurityStore = defineStore('security', () => {

    // Estado reactivo para el access_token
    const accessToken = ref(null);

    // Función para guardar el token en el almacenamiento seguro
    const saveToken = async(token) => {
        accessToken.value = token; // Actualiza el estado
        await localforage.setItem(
            'access_token', token
        );
    }

    // Función para obtener el token desde el almacenamiento seguro
    const getToken = async() => {
        const valueAT = await localforage.getItem('access_token');
        accessToken.value = valueAT; // Actualiza el estado

        return valueAT;
    }

    // Función para eliminar el token (logout)
    const clearToken = async() => {
        accessToken.value = null; // Limpia el estado
        await localforage.removeItem('access_token');
    }

    // Getter para verificar si el usuario está autenticado
    const isAuthenticated = () => !!accessToken.value;

    const isTokenExpired = async () => {
        const token = await getToken(); // Recupera el token actual
        
        if (!token) return true; // Si no hay token, se considera expirado
    
        const [, payloadBase64] = token.split('.'); // Decodifica el JWT
        const payload = JSON.parse(atob(payloadBase64)); // Decodifica el payload del token
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        
        //return payload.exp <= currentTime; // Retorna true si el token ha expirado
        return true
    }

    const refreshAccessToken = async () => {
        try {
            const refreshToken = await localforage.getItem('refresh_token'); // Recupera el refresh token
            const res = await apiKeycloak.post('/auth/realms/turboerp/protocol/openid-connect/token', new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: 'frontend',
                client_secret: '365fbe12-ec87-41a6-8ba9-eebdab456a49',
                refresh_token: refreshToken,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
    
            await saveToken(res.data.access_token);
            await localforage.setItem('refresh_token', res.data.refresh_token); // Guarda el nuevo refresh token
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            clearToken(); // Limpia el estado si falla el refresco
            router.push('/login'); // Redirige al login
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
            
            await saveToken(res.data.access_token);
            return res.status;
        } catch (error) {
            return error.status;
        }
    }

    return {
        accessToken,
        saveToken,
        getToken,
        clearToken,
        isAuthenticated,
        isTokenExpired,
        refreshAccessToken,
        postLogin
    }
  
})