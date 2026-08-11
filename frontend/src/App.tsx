import { useState } from 'react'
import { BrowserRouter, Router, Routes, Route} from "react-router-dom";
import PublicPage from "./pages/publicpage"
import SignIn from "./pages/signin"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<PublicPage/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
      </Routes>
    </Router>
  )
}

export default App
