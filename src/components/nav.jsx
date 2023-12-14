import React, { useState, useRef, useEffect } from 'react';
import { auth } from '../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import Logout from './logout';
import { GiIronCross } from 'react-icons/gi';

export function Nav({}) {
  const navigate = useNavigate();
  const location = useLocation();

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
  
  const handleNavigate = (route) => () => {
    navigate(route);
    setIsDropdownOpen(false);
  };

  return (
    <nav className='pt-3 mb-10'>
      <div className="flex justify-between items-center">
        <ul className="flex-1 flex justify-center items-center gap-3 sm:flex hidden">
          <li>
            <button 
              onClick={handleNavigate('/')} 
              className={`btn ${location.pathname === '/' ? 'bg-kv-red-force' : 'bg-black'}`}>
              Input Engine
            </button>
          </li>
          <li>
            <button 
              className={`btn ${location.pathname === '/lookup' ? 'bg-kv-red-force' : 'bg-black'}`} 
              onClick={handleNavigate('/lookup')}>
              Individual Lookup
            </button>
          </li>
          <li>
            <button 
              className={`btn ${location.pathname === '/casinoView' ? 'bg-kv-red-force' : 'bg-black'}`} 
              onClick={handleNavigate('/casinoView')}>
              Casino View
            </button>
          </li>
          <li>
          <button 
              className={`btn ${location.pathname === '/roster' ? 'bg-kv-red-force' : 'bg-black'}`} 
              onClick={handleNavigate('/roster')}>
              Roster
            </button>
          </li>
          <li>
            <button className={`btn bg-black`}>
            <a 
              href="https://docs.google.com/document/d/1JV8VMKwvr_m6UiIXB04P4WZIL-B2jpqqpPRD5icJ6Zs/edit?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`btn bg-black`}>
              Help
            </a>
            </button>
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
            <ul ref={dropdownRef} className="absolute right-0 mt-8 w-64 bg-slate-gray border text-kv-gray border-gray-200 rounded shadow-lg z-50">
              <li className="text-xl py-2 px-4 hover:bg-kv-gray cursor-pointer" onClick={handleNavigate('/')}>Input Engine</li>
              <li className="text-xl py-2 px-4 hover:bg-kv-gray cursor-pointer" onClick={handleNavigate('/lookup')}>Individual Lookup</li>
              <li className="text-xl py-2 px-4 hover:bg-kv-gray cursor-pointer" onClick={handleNavigate('/casinoView')}>Casino View</li>
              <li className={`text-xl py-2 px-4 hover:bg-kv-gray cursor-pointer`} onClick={handleNavigate('/roster')}>Roster</li>
              <li className={`text-xl py-2 px-4 hover:bg-kv-gray cursor-pointer`}><a 
                    href="https://docs.google.com/document/d/1JV8VMKwvr_m6UiIXB04P4WZIL-B2jpqqpPRD5icJ6Zs/edit?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                  Help
                </a>
              </li>
              <li className="text-xl py-2 px-4 hover:bg-kv-red cursor-pointer" onClick={handleSignOut}>Logout</li>
            </ul>          
          }
        </div>
      </div>
    </nav>

  );
}
