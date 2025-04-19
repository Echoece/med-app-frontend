import { jwtDecode } from 'jwt-decode';


export function jwtTokenDecode(token: string) {
    return jwtDecode(token);
}


export function validateToken(jwt: string) {
    const token = localStorage.getItem('token');

    if (!token) {
        return true; // No token = expired/invalid
    }

    try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert ms to seconds
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true; // Malformed token = treat as expired
    }
}
