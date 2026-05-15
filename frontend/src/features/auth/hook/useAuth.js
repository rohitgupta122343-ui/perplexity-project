
import {useDispatch} from 'react-redux'
import { seterror,setuser,setloading } from '../auth.slice'

import { login,register,getMe,logout } from '../services/api.services'


export  function useAuth(){

    const dispatch = useDispatch()
    

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
             <Navigate to='/login'/>
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