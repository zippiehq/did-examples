import './App.css';
import React, { useState} from 'react';
import ReactDOM from "react-dom";

//import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { IAppData, PermissionDesc, PlatformAgentUri, PlatformError } from '@zippie/did-core'
import { PlatformProvider, RecoveryForm, SignInForm, SignUpForm, usePlatform } from '@zippie/did-react-components'
//import { profile } from 'console';

//
// Component which handles sign-up, sign-in, recovery, etc.
//
const SignInPage: React.FC = (props) => {
    const [showSignUp, setShowSignUp] = useState(false)
    const [showRecovery, setShowRecovery] = useState(false)
  
    const onSignInComplete = async (result: IAppData | PlatformError) => {
      //setProfile(result.userDetails);
      console.log('testing if console works');
      console.log('OnsignInComplete:', result);
      console.log('sign-in-result:', props.profile)
    }

    const onSignUpComplete = async (result: IAppData | PlatformError) => {
      console.log('testing if console works');
      console.log('OnsignUPComplete:', result);
      console.log('sign-UP-result:', props.profile)
    }
  
    const onForgotPasswordClick = () => setShowRecovery(true)
    const onSignInButtonClick = () => setShowSignUp(false)
    const onSignUpClick = () => setShowSignUp(true)
    const onRecoveryComplete = ()=>{};
   // const onSignUpComplete = ()=>{};
  
    if (showRecovery) return <RecoveryForm {...{ onRecoveryComplete }} />
    if (showSignUp)
      return <SignUpForm termsLink="" {...{ onSignInButtonClick, onSignUpComplete, onForgotPasswordClick }} />
    return <SignInForm {...{ onSignInComplete, onForgotPasswordClick, onSignUpClick }} />
  }
  
  //
  //   The default export of this file wraps this component in a PlatformProvider, which allows
  // us to use the "usePlatform()" hook to start interacting with a users identity through the
  // platform APIs.
  //
  /*const App: React.FC = () => {
    const { isReady, isAppSignedIn, isUserSignedIn, platform } = usePlatform()
    const [info, setInfo] = useState('')
  
    useEffect(() => {
      if (!isAppSignedIn) return
      const fetchInfo = async () => {
        const response = await platform?.getDerivedKeyInfo('m/0/1')
        setInfo(JSON.stringify(response, null, 2))
      }
      fetchInfo().catch(console.error)
    }, [isAppSignedIn])
  
    if (!isReady) return <h4>Loading...</h4>
    if (!isAppSignedIn) return <SignInPage />
  
    return <div>{info ? info : 'Loading'}</div>
  }
*/


function App() {

    const { isReady, isAppSignedIn, isUserSignedIn, platform } = usePlatform()
    const [ profile, setProfile ] = useState({});
    const [ userInfo, setUserInfo ] = useState({});
    /*const login = useGoogleLogin({
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
*/

    if (!isReady) return <h4>Loading...</h4>
    /*if (isAppSignedIn) {
      platform.getApplicationData().then((appData)=>{
       setUserInfo(appData.userDetails);
       console.log('User Info', appData);
      });
    }; */

  //  return <div>{info ? info : 'Loading'}</div>
    return (
        <div>
            <h2>React DID Login</h2>
            <br />
            <br />
            {isAppSignedIn?(
                <div>
                    <img src={''} alt="user" />
                    <h3>User Logged in</h3>
                    <p>Name: {userInfo.name}</p>
                    <p>Email Address: {userInfo.email}</p>
                    <p>User ID: {''}</p>
                    <br />
                    <br />
                </div>
            ) : (
                <SignInPage profile= { profile } setProfile = {setProfile} />
            )}
        </div>
       );
}
export default App;
