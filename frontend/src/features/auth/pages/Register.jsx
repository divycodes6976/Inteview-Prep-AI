import React from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router-dom'
import {useState} from 'react'
import { useAuth } from '../hooks/useAuth'


const Register = () => {
  const navigate = useNavigate()
    const {loading,handleRegister} = useAuth()
    const [username, setUsername] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Handle registration logic here
        await handleRegister({ username, email, password })
        navigate('/')

 }
  return (
    <main className="auth-form">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div className="email-container">
          <label htmlFor="name">Name</label>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          type="text" name="name" id="name" placeholder="Enter your name" />
        </div>

        <div className="email-container">
          <label htmlFor="email">Email</label>
          <input
          
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email" name="email" id="email" placeholder="Enter your email" />
        </div>

        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
           type="password" name="password" id="password" placeholder="Create a password" />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account ? <Link to="/login">Login</Link></p>
    </main>
  )
}

export default Register
