import {useAuth} from '../hooks/useAuth'
import {useNavigate} from 'react-router-dom'
import {Navigate} from 'react-router-dom'


import React from 'react'


const Protected = ({children})=>{
    const navigate = useNavigate()
    const {loading,user} = useAuth()
    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
   return children
}

export default Protected
