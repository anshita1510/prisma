import { api } from "../lib/api";

export const login= async ( email: string, password: string) =>{
    const res = await api.post("/auth/login" , {
        email,
        password,
    });

    return res.data;
}

export const setPassword = async ( token: string, password: string) =>{
    const res = await api.post("/auth/set-password", {
        token, 
        password,
    });

    return res.data;
}