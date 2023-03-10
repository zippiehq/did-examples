import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App_didTest';
import reportWebVitals from './reportWebVitals';
import { PermissionDesc, PlatformAgentUri} from '@zippie/did-core'
import { PlatformProvider } from '@zippie/did-react-components'

//import { GoogleOAuthProvider } from '@react-oauth/google';
/*index.js*/
const REQUESTED_PERMISSIONS = [PermissionDesc.READ_FULL_NAME, PermissionDesc.READ_EMAIL]

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<PlatformProvider
    clientId="ExampleApp"
    agentUri={PlatformAgentUri.sandbox}
    permissions={REQUESTED_PERMISSIONS}
    config={{}}>
    <App />
  </PlatformProvider>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
