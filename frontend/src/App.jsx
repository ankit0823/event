import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import Dashboard from './pages/Dashboard'
import UserProtectWrapper from './pages/UserProtectWrapper'

import EditEvent from './components/EditEvent'
import DeleteEvent from './components/DeleteEvent'
import Logout from './pages/Logout'
import UserHome from './pages/UserHome'

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/" element={<UserLogin />} />
      <Route path="/dashboard" element={
          <UserProtectWrapper>
            <Dashboard />
          </UserProtectWrapper>
        } />
        <Route path="/logout" element={
          <UserProtectWrapper>
            <Logout />
          </UserProtectWrapper>
        } />

        <Route path="/userHome" element={
          <UserProtectWrapper>
            <UserHome />
          </UserProtectWrapper>
        } />

      </Routes>
    </div>
  )
}

export default App
