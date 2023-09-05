import { Nav } from './components/nav';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PoiTracker from "./components/poiTracker";
import Login from "./components/login";
import Roster from "./components/roster";
import Lookup from './components/lookup';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[url('./images/darkdenim3.png')] w-full bg-repeat min-h-screen">
      <Router >
        {user && <Nav/>}
          <Routes>
            <Route path="/" element={user ? <PoiTracker  /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/roster" element={user ? <Roster  /> : <Navigate to="/login" replace />}/>
            <Route path="/lookup" element={user ? <Lookup  /> : <Navigate to="/login" replace />}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
