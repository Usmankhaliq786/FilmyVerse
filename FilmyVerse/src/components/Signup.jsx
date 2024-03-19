import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import app from './fireBase/fireBase';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { usersref } from './fireBase/fireBase';
import bcrypt, { hash } from 'bcryptjs';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobileNo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const [confirmationResult, setConfirmationResult] = useState();

  const auth = getAuth(app);

  const generateRecaptcha = () => {
    return new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        console.log('Recaptcha verified');
      }
    });
  }

  const requestOtp = () => {
    setLoading(true);
    const appVerifier = generateRecaptcha();
    signInWithPhoneNumber(auth, `+${form.mobileNo}`, appVerifier)
      .then(confirmationResult => {
        console.log('Confirmation result:', confirmationResult);
        setConfirmationResult(confirmationResult);
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error requesting OTP:', error);
        setLoading(false);
      });
  }
  
  const handleOtpVerification = () => {
    console.log('OTP:', OTP);
    console.log('Confirmation result:', confirmationResult);
    if (!confirmationResult) {
      console.error('Confirmation result is not defined.');
      return;
    }
  
    setLoading(true);
    confirmationResult.confirm(OTP)
      .then((result) => {
        console.log('OTP verification result:', result);
        uploadData();
        swal({
          text: "Successfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login')
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        setLoading(false);
      });
  }
  

  const uploadData = async () => {
    const saltRounds = 10; // Define the number of salt rounds
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(form.password, salt);
  
      await addDoc(usersref, {
        name: form.name,
        password: hashedPassword,
        mobile: form.mobileNo
      });
  
      console.log("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }
  

  

  return (
    <div className='w-full flex flex-col items-center mt-8'>
      <h1 className='text-2xl font-bold mb-4'>Sign up</h1>
      {otpSent ? (
        <>
          <div className='p-2 w-full md:w-1/3'>
            <div className="relative mb-4">
              <label htmlFor="otp" className="leading-7 text-sm text-gray-600">OTP</label>
              <input
                id="otp"
                name="otp"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-white rounded border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent h-12 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div className='p-2 w-full'>
            <button
              onClick={handleOtpVerification}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? <TailSpin height={20} color="white" /> : 'Confirm OTP'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full md:w-1/3 mt-4">
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent h-12 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
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
                type='password'
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent h-12 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={requestOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? <TailSpin height={20} color="white" /> : 'Request OTP'}
            </button>
          </div>
        </>
      )}
      <div className="mt-4">
        <p>
          Already have an account? <Link to={'/login'}><span className='text-blue-500 cursor-pointer'>Log in</span></Link>
        </p>
      </div>
      <div id='recaptcha-container'></div>
    </div>
  );
}
 