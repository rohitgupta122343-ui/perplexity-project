
import {useDispatch} from 'react-redux'
import { seterror,setuser,setloading } from '../auth.slice'

import { login,register,getMe,logout } from '../services/api.services'
import { useNavigate } from 'react-router-dom'

export  function useAuth(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleRegister({username,email,password}) {
        
        try {
            dispatch(setloading(true))
            const data = await register({username,email,password})

            
        } catch (err) {
            dispatch(seterror(err))
            throw err
        }
        finally{
            dispatch(setloading(false))
        }
    }

    async function handleLogin({email,password}) {
        try {
            
            dispatch(setloading(true))
            const data = await login({email,password})
            dispatch(setuser(data.user))

        } catch (err) {
            throw err
            dispatch(seterror(err))
            
        }
        finally{
            dispatch(setloading(false))
        }
    }

    async function handleGetMe() {
        
        try {
            
            dispatch(setloading(true))
            const data = await getMe()
            dispatch(setuser(data.user))

        } catch (error) {
            dispatch(seterror(error))
        }
        finally{
            dispatch(setloading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setloading(true))
            await logout()
            dispatch(setuser(null))
             navigate("/login", { replace: true })
        } catch (error) {
            dispatch(seterror(error))
        } finally {
            dispatch(setloading(false))
        }
    }

    return {
        handleLogin,
        handleRegister,
        handleGetMe,
        handleLogout
    }
}