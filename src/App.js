import { Nav } from './components/nav';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PoiTracker from "./components/poiTracker";
import Login from "./components/login";


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
    <div className="bg-[url('./images/darkdenim3.png')] h-screen">
      <Router >
        {user && <Nav/>}
          <Routes>
            <Route path="/" element={user ? <PoiTracker  /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
