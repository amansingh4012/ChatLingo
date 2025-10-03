
import { Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'



const App = () => {
  
  const {data : userData, isLoading, error} = useQuery({
    queryKey : ["authUser"],
    queryFn : async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry : 1
  });

 const authUser = userData?.user;



  return (
    <div className=" h-screen" data-theme="night">

    <Routes>

      <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/onboarding" element={<OnBoardingPage />} />
      <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
      <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />

      
    </Routes>
    <Toaster/>
    </div>
  )
}

export default App