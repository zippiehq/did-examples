import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { IAppData, PermissionDesc, PlatformAgentUri, PlatformError } from '@zippie/did-core'

import {
  ButtonActions,
  PlatformProvider,
  RecoveryForm,
  SecretButton,
  SignInForm,
  SignUpForm,
  usePlatform,
} from '@zippie/did-react-components'

import { OAuth2Provider, useOAuth2 } from './hooks/useOAuth2'

//
// Permissions that this application needs the user to grant.
//
const REQUESTED_PERMISSIONS = [PermissionDesc.READ_FULL_NAME]

//
// Component which handles sign-up, sign-in, recovery, etc.
//
const SignInPage: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [showRecovery, setShowRecovery] = useState<boolean>(false)

  const onSignInComplete = async (result: IAppData | PlatformError) => {
    console.info('sign-in-result:', result)
  }

  const onSignUpComplete = (result: IAppData | PlatformError) => {
    console.info('sign-up-result:', result)
  }

  const onRecoveryComplete = (result: IAppData | PlatformError) => {
    console.info('recovery-result:', result)
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
const AppComponent: React.FC = () => {
  const { isReady, isAppSignedIn, isUserSignedIn } = usePlatform()
  const { isLoading, isAuthorized, authorize, token } = useOAuth2()

  console.info({ isReady, isAppSignedIn, isUserSignedIn })
  console.info({ isLoading, isAuthorized })

  if (!isReady) return <h4>Loading...</h4>
  if (!isAppSignedIn) return <SignInPage />

  const signInToTwitter = () => {
    // Add popup / new-tab to twitter OAuth2 endpoint and get authToken
    authorize()
    // Post auth token to backend service.
  }

  return (
    <>
      <h1>Verify Twitter Account Example App</h1>
      <SecretButton name="signout-btn" action={ButtonActions.signOut} label="Sign Out" />
      {!isAuthorized && <button onClick={signInToTwitter}>Sign in to Twitter</button>}
      {isAuthorized && (
        <>
          <h4>Twitter Auth Token:</h4>
          <div style={{ fontFamily: 'monospace' }}>{token}</div>
        </>
      )}
    </>
  )
}

export const getPlatformAgentUri = (): string => {
  if (window.origin === 'http://localhost:3200') {
    return PlatformAgentUri.local
  }
  if (window.origin === 'https://did.dev.zippie.com') {
    return PlatformAgentUri.development
  }
  if (window.origin === 'https://did.test.zippie.com') {
    return PlatformAgentUri.testing
  }
  if (window.origin === 'https://did.sandbox.zippie.com') {
    return PlatformAgentUri.sandbox
  }
  if (window.origin === 'https://did.zippie.com') {
    return PlatformAgentUri.release
  }

  return PlatformAgentUri.development
}

//
//   Every decentralized application needs an entry point, the PlatformProvider initializes
// and manages an instance of the BrowserPlatformApi, as well as binding it into a nice
// ReactJS interface with dynamic props and everything.
//
export default () => (
  <PlatformProvider
    clientId="ExampleApp"
    agentUri={getPlatformAgentUri()}
    permissions={REQUESTED_PERMISSIONS}
    config={{}}
  >
    <BrowserRouter>
      <OAuth2Provider
        authorizeUri="https://twitter.com/i/oauth2/authorize"
        clientId="RWNjejBMRnN4WFRiLVpjZjUwVEo6MTpjaQ"
        scope={['tweet.read', 'users.read', 'offline.access']}
      >
        <AppComponent />
      </OAuth2Provider>
    </BrowserRouter>
  </PlatformProvider>
)
