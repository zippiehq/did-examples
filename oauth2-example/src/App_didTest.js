import React, { useEffect, useState } from 'react'

import { IAppData, PlatformError } from '@zippie/did-core'

import { SignInForm, SignUpForm, usePlatform } from '@zippie/did-react-components'

//
// Component which handles sign-up, sign-in, recovery, etc.
//
const SignInPage: React.FC = () => {
  // this sets the states for bot sign in and  sign up
  const [showSignUp, setShowSignUp] = useState(false)

// After sign in is complete and successful user profile is set
  const onSignInComplete = async (result: IAppData | PlatformError) => {
    console.info('sign-in-result:', result)
  }

// After sign up is complete and successful user profile is set
  const onSignUpComplete = (result: IAppData | PlatformError) => {
    console.info('sign-up-result:', result)
  }

  const onSignInButtonClick = () => setShowSignUp(false)
  const onSignUpClick = () => setShowSignUp(true)


  if (showSignUp)
    return <SignUpForm termsLink="" {...{ onSignInButtonClick, onSignUpComplete }} />
  return <SignInForm {...{ onSignInComplete,  onSignUpClick }} />
}

//
//   The default export of this file wraps this component in a PlatformProvider, which allows
// us to use the "usePlatform()" hook to start interacting with a users identity through the
// platform APIs.
//
const App = () => {
  const { isReady, isAppSignedIn, isUserSignedIn, platform } = usePlatform()
// declares and empty state for the user info
  const [pubKey, setPubKey] = useState({});
  const [userDetails, setUserDetails] = useState({});

// here when the user is signed in , user info is set
  useEffect(() => {
    if (!isAppSignedIn) return
    const fetchInfo = async () => {
      const response = await platform?.getDerivedKeyInfo('m/0/1');
      setPubKey(response);
      const appData = await platform?.getApplicationData();
      setUserDetails(appData.userDetails);
    }
    fetchInfo().catch(console.error)
  }, [isAppSignedIn, platform])

  if (!isReady) return <h4>Loading...</h4>
  if (!isAppSignedIn) return <SignInPage />

// This is how the user info is displayed after DID sign in/up is complete
  return <div>
  {isAppSignedIn ? <>
  <h3>First Name: {userDetails.firstName}</h3>
  <h3>Last Name: {userDetails.lastName}</h3>
  <h3>Email: {userDetails.email}</h3>
  <h3>Public Key: {pubKey.publicKey}</h3>
  </> : 'Loading'}
  </div>
}
export default App;
