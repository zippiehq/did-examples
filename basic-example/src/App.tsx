import React, { useEffect, useState } from 'react'

import { IAppData, PermissionDesc, PlatformAgentUri, PlatformError } from '@zippie/did-core'

import { PlatformProvider, RecoveryForm, SignInForm, SignUpForm, usePlatform } from '@zippie/did-react-components'
import { backendCreateUser } from './mock-backend'

//
// Permissions that this application needs the user to grant.
//
const REQUESTED_PERMISSIONS = [PermissionDesc.READ_FULL_NAME, PermissionDesc.READ_EMAIL]

//
// Component which handles sign-up, sign-in, recovery, etc.
//
const SignInPage: React.FC<any> = ({ setShowAuthPage }) => {
  const [showSignUp, setShowSignUp] = useState<boolean>(false)
  const [showRecovery, setShowRecovery] = useState<boolean>(false)
  const [info, setInfo] = useState('')

  const onSignInComplete = async (result: IAppData | PlatformError) => {
    backendCreateUser((result as IAppData).publicKey)
    setShowAuthPage(false)
  }

  const onSignUpComplete = (result: IAppData | PlatformError) => {
    console.info('sign-up-result:', result)
    setShowAuthPage(false)
  }

  const onRecoveryComplete = (result: IAppData | PlatformError) => {
    console.info('recovery-result:', result)
    setShowAuthPage(false)
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
  const { isReady, platform } = usePlatform()
  const [token, setToken] = useState('')
  //variable to decide whether to show the sign-in flow
  const [showAuthPage, setShowAuthPage] = useState<boolean>(true)

  if (!isReady) return <h4>Loading...</h4>
  if (showAuthPage) return <SignInPage {...{ setShowAuthPage }} />
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
    agentUri={PlatformAgentUri.sandbox}
    permissions={REQUESTED_PERMISSIONS}
    config={{}}
  >
    <AppComponent />
  </PlatformProvider>
)
