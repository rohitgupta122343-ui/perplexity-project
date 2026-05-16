
import axios from 'axios'

const api = axios.create({
    baseURL : 'perplexity-project-production.up.railway.app',
    withCredentials : true
})

export async function register({username,email,password}) {
    
    const res = await api.post('/api/auth/register',{
        username,email,password
    })

    console.log(res.data);
    return res.data
}

export async function login({email,password}){

    const res = await api.post('/api/auth/login',{
        email,password
    })

    console.log(res.data);
    return res.data
}

export async function getMe() {
    
    const res = await api.get('/api/auth/get-me')
    return res.data
}

export async function logout() {
    
    const res = await api.get('/api/auth/logout')
    return res.data

}