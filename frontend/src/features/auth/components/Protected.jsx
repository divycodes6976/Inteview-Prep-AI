import {useAuth} from '../hooks/useAuth'
import {useNavigate} from 'react-router-dom'
import {Navigate} from 'react-router-dom'


import React from 'react'


const Protected = ({children})=>{
    const navigate = useNavigate()
    const {loading, user} = useAuth()
    if(loading){
        return (
            <div className="auth-loading-screen" role="status" aria-label="Loading authentication">
                <div className="auth-loading-spinner" />
            </div>
        )
    }
    if(!user){
        return <Navigate to="/login" />
    }
   return children
}

export default Protected
