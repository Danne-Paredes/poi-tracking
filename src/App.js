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
    return savedACLUser ? JSON.parse(savedACLUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataVals = async (user) => {
      const data = await getACL();
      const currentUser = data.find((currentUser) => currentUser.email === user.email);
      
      if (currentUser && currentUser.location !== "Corp - Knighted Ventures") {
          sessionStorage.setItem("currentACLUser", JSON.stringify(currentUser));
          setACLUser(currentUser);
      } else {
          setACLUser(null);
      }
    }
  

      const unsubscribe = auth.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
          user && fetchDataVals(user);
      });

      // Cleanup subscription on unmount
      return () => {
          unsubscribe();
      };
  }, []);

  function ProtectedRoute({ component: Component, user, aclUser, ...props }) {
      if (user && aclUser !== null) {
          return <Component {...props} user={aclUser} />;
      }
      return <Navigate to="/login" replace />;
  }


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[url('./images/darkdenim3.png')] w-full bg-repeat min-h-screen">
        <Router>
            {user && aclUser !== null && <Nav />}
            <Routes>
              <Route path="/" element={<ProtectedRoute component={PoiTracker} user={user} aclUser={aclUser} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/roster" element={<ProtectedRoute component={Roster} user={user} aclUser={aclUser} />} />
              <Route path="/lookup" element={<ProtectedRoute component={Lookup} user={user} aclUser={aclUser} />} />
              <Route path="/lookup/:id" element={<ProtectedRoute component={Lookup} user={user} aclUser={aclUser} />} />
              <Route path="/casinoView" element={<ProtectedRoute component={CasinoView} user={user} aclUser={aclUser} />} />
            </Routes>
        </Router>
    </div>
);
}

export default App;
