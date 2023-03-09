import './App.css';
import React, { useState} from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {

    const [ profile, setProfile ] = useState({});

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
        await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
          ).then((res) => {
            setProfile(res.data);
        })
        .catch((err) => console.log(err));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile({});
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            {Object.keys(profile).length? (
                <div>
                    <img src={profile.picture} alt="user" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <p>User ID: {profile.sub}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
       );
}
export default App;
