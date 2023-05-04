import axios from 'axios'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { randomBytes } from '../utils/crypto'

interface OAuth2ProviderProps {
  authorizeUri: string
  clientId: string
  scope: string[]
}

export interface TokenData {
  tokenType: string
  accessToken: string
  idToken: string
  issuedAt: string
}

export interface OAuth2ContextT {
  token?: string

  isLoading: boolean
  isAuthorized: boolean

  authorize(): void
}

export const OAuth2Context = createContext<OAuth2ContextT>({ isLoading: true } as OAuth2ContextT)

export const useOAuth2 = (): OAuth2ContextT => useContext(OAuth2Context)

export const getIdTokenParts = (token: string) => {
  const parts = token.split('.').map((p) => p.replace(/-/g, '+').replace(/_/g, '/'))
  const [header, info] = parts
    .slice(0, 2)
    .map(atob)
    .map((p) => JSON.parse(p))

  return {
    header,
    info,
  }
}

/**
 * Callback component opened in new window/tab which handles oauth2 callback parameters.
 *
 * @returns React.FC
 */
export const OAuth2RedirectEndpoint: React.FC = () => {
  useEffect(() => {
    // XXX - Urgh, susceptable to logging as we can't use hash with twitter .. WTF?!
    //const hash = window.location.search;

    const search = new URLSearchParams(window.location.search)
    const result = {}

    for (const [k, v] of search.entries()) {
      result[k] = v
    }

    localStorage.setItem('oauth2:result', JSON.stringify(result))
    window.close()
  }, [])

  return <>TEST</>
}

/**
 *
 * @param props
 * @returns
 */
export const OAuth2Provider: React.FC<PropsWithChildren<OAuth2ProviderProps>> = ({
  clientId,
  authorizeUri: authorizeUri,
  scope,
  children,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false)

  const [token, setTokenData] = useState<string>()

  const authorize = () => {
    // Generate a random callback identifier to listen for.
    const callbackId = btoa(randomBytes(16).toString())
    const nonce = btoa(randomBytes(16).toString())

    // PostMessage event handler, for listening for incoming messages sent from the
    // OAuth2RedirectEndpoint openned in another window as a response to the oauth2
    // request.
    const onStorageEvent = (ev: StorageEvent) => {
      if (ev.newValue === null) return

      window.removeEventListener('storage', onStorageEvent)

      const response = JSON.parse(ev.newValue)
      setTokenData(response.code)
    }

    const loc = new URL(authorizeUri)

    // Setup OAuth2 authorization query parameters.
    const query = loc.searchParams
    query.set('response_type', 'code')
    query.set('client_id', clientId)
    query.set('redirect_uri', window.location.origin + '/oauth2/callback')
    query.set('scope', scope.join(' '))
    query.set('state', callbackId)
    query.set('code_challenge', 'challenge')
    query.set('code_challenge_method', 'plain')

    // Setup postMessage event handler.
    window.addEventListener('storage', onStorageEvent)

    // Open OAuth2 authenticator location.
    window.open(loc.toString(), '', 'popup')
  }

  const getAuthCode = async (code: string): Promise<any> => {
    const body = new URLSearchParams()
    body.append('code', code)
    body.append('grant_type', 'authorization_code')
    body.append('client_id', clientId)
    body.append('redirect_uri', window.location.origin + '/oauth2/callback')
    body.append('code_verifier', 'challenge')

    const init: RequestInit = {
      method: 'POST',
      mode: 'no-cors',
      body,
    }

    const req = new Request('https://api.twitter.com/2/oauth2/token', init)
    const res = await fetch(req)
      .then((r) => r.arrayBuffer())
      .then((d) => console.info(d))
  }

  return (
    <OAuth2Context.Provider
      value={{
        token,
        isLoading,
        isAuthorized: !isLoading && !!token,
        authorize,
      }}
    >
      <Routes>
        <Route path="/oauth2/callback" element={<OAuth2RedirectEndpoint />} />
      </Routes>

      {children}
    </OAuth2Context.Provider>
  )
}
