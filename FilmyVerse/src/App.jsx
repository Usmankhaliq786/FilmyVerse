import React, { createContext,useEffect, useState } from 'react'
import "./index.css"
import Header from './components/Header'
import Cards from './components/Cards'
import AddMovies from './components/AddMovies'
import { Card } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Details from './components/Details'
import Login from './components/Login'
import Signup from './components/Signup'


const Appstate = createContext();

export default function() {
  const [login, setLogin] = useState(false);
  const[userName, setUserName] = useState("")

  
  return (
    <Appstate.Provider value={{login,userName, setLogin, setUserName }}>
    <div className=' relative'>
        <Header />
        <Routes>
          
         <Route path='/' element={<Cards/>} />
         <Route path='/Addmovies' element={<AddMovies/>} />
         <Route path='/Details/:id' element={<Details/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/signup' element={<Signup/>} />
        </Routes>
        
      
      </div>
      </Appstate.Provider>
  );
}
export {Appstate}