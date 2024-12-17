import { useState } from 'react'
import './App.css'
import Room from './pages/Room'
import LoginPage from './pages/LoginPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import RegisterUser from './pages/RegisterUser'

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
      
      <Routes>

        <Route path="/register" element={<RegisterUser/>} />
        <Route path="/login" element={<LoginPage/>} />

         {/* //Below are protected or private routes  */}
        <Route element={<PrivateRoutes/>}>
        <Route path="/" element={<Room />} />
        </Route>
        

      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
