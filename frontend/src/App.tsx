import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PublicPage from "./pages/publicpage"
import SignIn from "./pages/signin";
import AdminSignIn from "./pages/adminsign"
import { UserProvider } from "./contexts/userContext";
import SignUp from "./pages/signup";

function App() {

  return (
    <Router>
      <UserProvider>
      <Routes>
        <Route path='/' element={<PublicPage/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path="/create-account" element={<SignUp/>}/>
        <Route path='/admin/sign-in' element={<AdminSignIn/>}/>
      </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
