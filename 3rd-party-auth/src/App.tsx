import React, { useState } from 'react'

import { IAppData, PermissionDesc, BrowserAgentLocation, PlatformError } from '@zippie/did-core'
import { PlatformProvider, RecoveryForm, SignInForm, SignUpForm, usePlatform } from '@zippie/did-react-components'
import { backendAuthUser, backendCreateUser } from './mock-backend'

// Permissions that this application needs the user to grant.
const REQUESTED_PERMISSIONS = [PermissionDesc.READ_FULL_NAME, PermissionDesc.READ_EMAIL]

//
// Component which handles sign-up, sign-in, recovery, flows.
//
const AuthPage: React.FC<any> = ({ onAppSignedIn }) => {
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [showRecovery, setShowRecovery] = useState<boolean>(false)

  const onSignUpComplete = async (result: IAppData | PlatformError) => {
    console.info('sign-up-result:', result)
    onAppSignedIn(true)
  }

  const onSignInComplete = async (result: IAppData | PlatformError) => {
    console.info('sign-in-result:', result)
    onAppSignedIn(false)
  }

  const onRecoveryComplete = (result: IAppData | PlatformError) => {
    console.info('recovery-result:', result)
    onAppSignedIn(false)
  }

  const onForgotPasswordClick = () => setShowRecovery(true)
  const onSignInButtonClick = () => setShowSignUp(false)
  const onSignUpClick = () => setShowSignUp(true)

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
const AppComponent: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const { isReady, platform } = usePlatform()
  const [token, setToken] = useState('')

  const [showAuthPage, setShowAuthPage] = useState<boolean>(true)

  // Handle DID application signed in
  const onAppSignedIn = async (isNewUser: boolean) => {
    // We're logged in so no need to display sign-in flow.
    setShowAuthPage(false)

    // Get JsonWebToken from DID
    const token = (await platform?.getJsonWebToken()) as string
    setToken(token || '')
    console.info(token)

    let sessionId

    // Get a new sessionId from backend service by either creating a new user or just authenticating
    if (isNewUser) {
      sessionId = await backendCreateUser(token)
    } else {
      sessionId = await backendAuthUser(token)
    }

    // Redirect to your app with sessionId, external app can then get user info stored under sessionId,
    // check JWT for expiration, etc.
    document.location = `${redirectTo}?sessionId=${sessionId}`
  }

  if (!isReady) return <h4>Loading...</h4>
  if (showAuthPage) return <AuthPage {...{ setToken, onAppSignedIn }} />
  return <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>{token ? token : 'Loading'}</div>
}

//
//   Every decentralized application needs an entry point, the PlatformProvider initializes
// and manages an instance of the BrowserPlatformApi, as well as binding it into a nice
// ReactJS interface with dynamic props and everything.
//
export default () => (
  <PlatformProvider
    clientId="ExampleApp"
    agentUri={BrowserAgentLocation.Sandbox}
    permissions={REQUESTED_PERMISSIONS}
    config={{}}
  >
    <AppComponent redirectTo={'http://localhost:3000'} />
  </PlatformProvider>
)
