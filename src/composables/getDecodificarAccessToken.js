import { jwtDecode } from 'jwt-decode';

export const useGetDecodificarAccessToken = () => {
    
    const decodificarAccessToken = (access_token) => {
        return jwtDecode(access_token)
    }

    return {
        decodificarAccessToken
    }
}