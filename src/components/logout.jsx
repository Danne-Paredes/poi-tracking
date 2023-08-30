import React from "react"
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';


const Logout = (props) => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
      try {
        await auth.signOut();
        navigate('/login');
      } catch (error) {
        // Handle error
        console.error(error);
      }
    };

  return (
    <button className='btn' onClick={handleSignOut}>
        Log Out
    </button>
  )
};

export default Logout;
