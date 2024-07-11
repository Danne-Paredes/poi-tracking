import  Nav  from './components/Nav';
import Login  from "./page/Login";
import PoiTracker from './page/PoiTracker'
import CasinoView from './page/CasinoView';
import Lookup from './page/Lookup';
import Roster from './page/Roster'

import { useEffect, useState } from 'react';
import { auth, getACL } from './config/firebase'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [aclUser, setACLUser] = useState(() => {
    const savedACLUser = sessionStorage.getItem('currentACLUser');
    return savedACLUser ? JSON.parse(savedACLUser) : null; // Ensure this is null if not set
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataVals = async (user) => {
      const data = await getACL();
      const currentUser =  data.find((currentUser)=>currentUser.email === user.email )
      // currentUser.location !== "Corp - Knighted Ventures" && sessionStorage.setItem("currentACLUser", JSON.stringify(currentUser));
      sessionStorage.setItem("currentACLUser", JSON.stringify(currentUser));
      setACLUser(currentUser)
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false);
      user && fetchDataVals(user)
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
      };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[url('./images/darkdenim3.png')] w-full bg-repeat min-h-screen py-5 px-3">
      <Router >
        {user && <Nav/>}
          <Routes>
            <Route path="/" element={user ? <PoiTracker user={aclUser} setACLUser={setACLUser} /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/casinoView" element={user ? <CasinoView user={aclUser}  /> : <Navigate to="/login" replace />}/>
            <Route path="/lookup" element={user ? <Lookup  /> : <Navigate to="/login" replace />}/>
            <Route path="/lookup/:id" element={user ? <Lookup  /> : <Navigate to="/login" replace />}/>
            <Route path="/roster" element={user ? <Roster  /> : <Navigate to="/login" replace />}/>
            {/* 
            <Route path="/test" element={user ? <PoiTrackerV2  /> : <Navigate to="/login" replace />}/>
             */}
          </Routes>
      </Router>
    </div>
  );
}

export default App;
