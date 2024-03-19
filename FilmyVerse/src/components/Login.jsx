import React, { useContext, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { where, getDocs, query } from 'firebase/firestore';
import { usersref } from './fireBase/fireBase';
import { Appstate } from '../App';
import swal from 'sweetalert';
import bcrypt from 'bcryptjs';

export default function Login() {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [form, setForm] = useState({
    mobileNo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loggedInMessage, setLoggedInMessage] = useState('');

  const login = async () => {
    setLoading(true);
    let isLoggedIn = false; // Flag to track if login is successful
    try {
      const usersQuery = query(usersref, where('mobile', '==', form.mobileNo));
      const querySnapshot = await getDocs(usersQuery);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const isPasswordCorrect = bcrypt.compareSync(form.password, userData.password);
        if (isPasswordCorrect) {
          isLoggedIn = true;
          useAppstate.setLogin(true);
          navigate('/');
          setLoggedInMessage("Logged In");
          setTimeout(() => {
            setLoggedInMessage('');
          }, 3000);
          swal({
            title: "Loggedin",
            icon: "success",
            buttons: false,
            timer: 3000
          });
        }
      });
      if (!isLoggedIn) {
        // If the loop finishes and no successful login occurred, show invalid credentials
        swal({
          title: "Invalid Credentials",
          icon: "error",
          buttons: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.log("error", error);
      swal({
        title: "Error",
        text: "An error occurred while processing your request",
        icon: "error",
        buttons: false,
        timer: 3000
      });
    }
    setLoading(false);
  };
  

  return (
    <div className='w-full flex flex-col items-center mt-8'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      {loggedInMessage && (
        <div className="mb-4">
          <p className="text-green-600">{loggedInMessage}</p>
        </div>
      )}
      <div className=" w-full md:w-1/3 mt-4">
        <div className="relative mb-4">
          <label htmlFor="mobileNo" className="leading-7 text-sm text-gray-600">Mobile No.</label>
          <input
            type="number"
            id="mobileNo"
            name="mobileNo"
            value={form.mobileNo}
            onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
            className="w-full bg-white rounded border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent h-12 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-white rounded border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent h-12 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button
          onClick={login}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? <TailSpin height={20} color="white" /> : 'Login'}
        </button>
      </div>
      <div className="mt-4">
        <p>
          Don't have an account?<Link to={'/signup'}> <span className='text-blue-500 cursor-pointer'>Sign up</span>
          </Link> </p>
      </div>
    </div>
  );
}
