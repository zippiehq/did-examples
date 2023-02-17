import React, { useEffect, useState } from 'react'

import { IAppData, PermissionDesc, PlatformAgentUri, PlatformError } from '@zippie/did-core'

import { PlatformProvider, RecoveryForm, SignInForm, SignUpForm, usePlatform } from '@zippie/did-react-components'

//
// Permissions that this application needs the user to grant.
//
const REQUESTED_PERMISSIONS = [PermissionDesc.READ_FULL_NAME, PermissionDesc.READ_EMAIL]

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
