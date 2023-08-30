import React, { useState, useRef, useEffect} from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Logout from './logout';
import { GiIronCross } from 'react-icons/gi'


export function Nav({}) {
  // allows you to navigate(path_you_want)
  const navigate = useNavigate();
  

  // controls if dropdown is open
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // sets dropdown open on click
  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }
  
  // defines reference for dropdown, allows us to close dropdown when we click outside
  const dropdownRef = useRef(null);
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  // on open, activates handleClickOutside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Logout button logic
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
    <nav className='pt-3'>
      <div className="flex justify-between items-center">
        <ul className="flex-1 flex justify-center items-center gap-3 sm:flex hidden">
          <li>
            <button className="btn">Input Engine</button>
          </li>
          <li>
            <button className='btn'>Individual Lookup</button>
          </li>
          <li>
            <button className='btn'>Roster</button>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
        <div className="sm:hidden block">
          <GiIronCross className='absolute right-0' size={32} onClick={handleDropdown} />
          {isDropdownOpen &&
            <ul ref={dropdownRef} className="absolute right-0 mt-8 bg-slate-gray border text-kv-gray  border-gray-200 rounded shadow-lg">
              <li>Input Engine</li>
              <li>Individual Lookup</li>
              <li>Roster</li>
              <li  className='hover:bg-kv-red' onClick={handleSignOut}>Logout</li>
            </ul>
          }
        </div>
      </div>
    </nav>
  );  
}
