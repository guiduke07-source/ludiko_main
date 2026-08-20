import React from 'react'
import "./Login.css";

const Login = () => {
  return (
    <div className='container'>

      <div className='login-box'>

        <img
        src="/logo.png"
        alt="EducaKids"
        className="logo"
        />
      <form>
        <div className='input-box'>
          <input type="email" placeholder='Digite seu email'/>
          </div>

          <div className='input-box'>
            <input type="password" placeholder='CPF ou responsável'/>
            </div>
        <h1>Acesso</h1>

        <div clasName='input-box'>
          <input type="text" placeholder='senha'/>
          </div>
         
      <button type='submit'>
         Entrar </button>
      </form>
    </div>

    </div>
  )
}

export default Login
