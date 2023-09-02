import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Logout from './logout';
import { GiIronCross } from 'react-icons/gi';

export function Nav({}) {
  const navigate = useNavigate();
  const menuIconRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !menuIconRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className='pt-3'>
      <div className="flex justify-between items-center">
        <ul className="flex-1 flex justify-center items-center gap-3 sm:flex hidden">
          <li>
            <button onClick={()=>navigate('/')} className="btn">Input Engine</button>
          </li>
          <li>
            <button className='btn' onClick={()=>navigate('/lookup')} >Individual Lookup</button>
          </li>
          <li>
            <button className='btn' onClick={()=>navigate('/roster')}>Roster</button>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
        <div className="sm:hidden block">
          <div ref={menuIconRef}>
            <GiIronCross className='absolute right-3' size={32} onClick={handleDropdown} />
          </div>
          {isDropdownOpen &&
            <ul ref={dropdownRef} className="absolute right-0 mt-8 bg-slate-gray border text-kv-gray border-gray-200 rounded shadow-lg z-50">
              <li onClick={()=>navigate('/')}>Input Engine</li>
              <li onClick={()=>navigate('/lookup')}>Individual Lookup</li>
              <li onClick={()=>navigate('/roster')}>Roster</li>
              <li className='hover:bg-kv-red' onClick={handleSignOut}>Logout</li>
            </ul>
          }
        </div>
      </div>
    </nav>
  );
}
