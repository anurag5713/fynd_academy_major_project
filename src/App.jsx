
import './App.css'
import Navbar from './components/common/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import EditorJoin from './pages/EditorJoin'
import EditorPage from './pages/EditorPage'
import VerifyEmail from './pages/VerifyEmail'
import UpdatePassword from './pages/UpdatePassword'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"
import Contact from './pages/Contact'
import Footer from "./components/common/Footer"
import PrivateRoute from "./components/core/Auth/PrivateRoute"

function App() {
  return (
    <div className='flex min-h-screen w-screen max-w-[100vw] flex-col font-inter'>
        <Navbar/>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/verify-email' element={<VerifyEmail/>} />
          <Route path='/update-password' element={<UpdatePassword/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/joinroom' element={<EditorJoin/>} />
          <Route path="/editor/:roomId" element={<EditorPage/>} />
          <Route element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }>
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />
          </Route>
          <Route path='*' element={<Error/>} />
        </Routes>
        <Footer/>
    </div>
  )
}

export default App
