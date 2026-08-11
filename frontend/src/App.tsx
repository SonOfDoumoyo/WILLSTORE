import { useState } from 'react'
import { BrowserRouter as  Router, Routes, Route} from "react-router-dom";
import PublicPage from "./pages/publicpage"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<PublicPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
