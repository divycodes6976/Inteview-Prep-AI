import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const {loading,handleLogin} = useAuth()
   const navigate = useNavigate()
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')







    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
      }







  return (

    <main className="auth-form">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="email-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>Don't have an account ? <Link to="/register">Register</Link></p>
    </main>
  )
}

export default Login
