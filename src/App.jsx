import { useState } from 'react'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './compontens/pages/Home'
import Login from './compontens/pages/user/Login.jsx'
import AuthCheckRoute from './compontens/partials/AuthCheckRoute'
import GuestCheckRoute from './compontens/partials/GuestCheckRoute'
import Logout from './compontens/pages/user/Logout.jsx'
import Register from './compontens/pages/user/Register.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-green-500'>Vite + React</h1>
      <div className="flex gap-2">

        <Link to='/' className='text-blue-500'>home</Link>
        <Link to='/login' className='text-blue-500'>login</Link>
        <Link to='/logout' className='text-blue-500'>logout</Link>
        <Link to='/register' className='text-blue-500'>register</Link>
      </div>
      <Routes>
        <Route path='/' element={<AuthCheckRoute><Home /></AuthCheckRoute>} />
        <Route path='/logout' element={<AuthCheckRoute><Logout /></AuthCheckRoute>} />

        <Route path='/login' element={<GuestCheckRoute><Login /></GuestCheckRoute>} />
        <Route path='/register' element={<GuestCheckRoute><Register /></GuestCheckRoute>} />
      </Routes>
    </>
  )
}

export default App
