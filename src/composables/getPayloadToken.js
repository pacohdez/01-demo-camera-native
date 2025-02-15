export const useGetPayloadToken = () => {
    
    const payloadToken = (token) => {
        const [, payloadBase64] = token.split('.'); // Decodifica el JWT (segunda parte)
        // Decodifica el payload
        const payload = JSON.parse(atob(payloadBase64));
        return payload
    }

    return {
        payloadToken
    }
}