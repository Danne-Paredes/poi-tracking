import GoogleButton from 'react-google-button'
import {auth, provider} from '../config/firebase'
import logo from  '../images/KVLogo.png'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate();

  const signInWithGoogle = async (event) => {
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check the email domain
      if (result.user.email.endsWith('@knighted.com')) {
        console.log(result);
        const token = await result.user.getIdToken();
        sessionStorage.setItem('token', token);
        navigate('/');
      } else {
        // If the email domain is not 'knighted.com', sign out the user
        auth.signOut();
        alert('Please sign in with a @knighted.com email address.');
      }
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  }

  return (
      <div className='mx-auto bg-black px-5 max-w-md'>
        <img priority='false' className='mx-auto p-5' src={logo} alt="KV Logo" />
        <p className='text-kv-logo-gray primary text-center'>Please login with your Knighted Account</p>
        <GoogleButton onClick={signInWithGoogle} className='mx-auto my-4'/>
      </div>
  );
}

export default Login