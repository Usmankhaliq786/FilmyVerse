import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Appstate } from '../App';
function Header() {
  const useAppstate = useContext(Appstate);


  return (
    <div className='  sticky z-10 header top-0 text-3xl flex justify-between items-center  text-red-500 
    font-bold p-3 border-b-2 border-gray'>
      
    <Link to={'/'}>  <span >Filmy <span className='text-white'> Verse</span></span></Link>
       {useAppstate.login ?
        
        <Link to={'/Addmovies'}> <h1 className='text-lg  flex cursor-pointer items-center'> 
        <Button > <AddIcon className='mr-1 ' color='secondary' /> <span className='text-white'> Add New </span> </Button> 
          
          </h1></Link>
          :
          <Link to={'/login'}> <h1 className='text-lg bg- bg-green-500  flex cursor-pointer items-center'> 
        <Button> <span className='text-white font-medium capitalize'> Login </span> </Button> 
          
          </h1></Link>
          }
      </div>
  )
}

export default Header