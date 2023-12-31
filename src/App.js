import { Nav } from './components/nav';
import { useEffect, useState } from 'react';
import { auth, getACL } from './config/firebase'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PoiTracker from "./components/poiTracker";
import Login from "./components/login";
import Roster from "./components/roster";
import Lookup from './components/lookup';
import CasinoView from './components/casinoView';


function App() {
  const [user, setUser] = useState(null);
  const [aclUser, setACLUser] = useState(() => {
    const savedACLUser = sessionStorage.getItem('currentACLUser');
    // return []
    return savedACLUser ? JSON.parse(savedACLUser) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataVals = async (user) => {
      const data = await getACL();
      const currentUser =  data.find((currentUser)=>currentUser.email === user.email )
      currentUser.location !== "Corp - Knighted Ventures" && sessionStorage.setItem("currentACLUser", JSON.stringify(currentUser));
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
    <div className="bg-[url('./images/darkdenim3.png')] w-full bg-repeat min-h-screen">
      <Router >
        {user && <Nav/>}
          <Routes>
            <Route path="/" element={user ? <PoiTracker user={aclUser} /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/roster" element={user ? <Roster  /> : <Navigate to="/login" replace />}/>
            <Route path="/lookup" element={user ? <Lookup  /> : <Navigate to="/login" replace />}/>
            <Route path="/lookup/:id" element={user ? <Lookup  /> : <Navigate to="/login" replace />}/>
            <Route path="/casinoView" element={user ? <CasinoView  /> : <Navigate to="/login" replace />}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
