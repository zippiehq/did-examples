import axios from 'axios'

const JWT_VERIFY_ENDPOINT = 'https://auditable-cryptor.sandbox.zippie.com/jwt_verify'

//
// This function should be implemented on the backend. Will throw an exception if not valid.
//
const verifyJwt = async (jwt: any) => {
  const verified = await axios.post(JWT_VERIFY_ENDPOINT, { jwt })
  console.info('verified JWT:', verified)
}

//
// This function should be implemented on the backend and replaced with an XHR
//
export const backendCreateUser = async (jwt: any) => {
  const sessionId = 'some-random-auth-token'

  await verifyJwt(jwt)

  // TODO: Here you should create the user in your database, provided the JsonWebToken is valid
  // the backend service should then return a sessionId which can be used by your application to
  // authenticate at a later time.
  return sessionId
}

//
// This function should be implemented on the backend and replaced with an XHR
//
export const backendAuthUser = async (jwt: any) => {
  const sessionId = 'some-random-auth-token'
  await verifyJwt(jwt)

  // TODO: Here you should validate the user is in your database, provided the JsonWebToken is valid
  // the backend service should then return a sessionId which can be used by your application to
  // authenticate at a later time.
  return sessionId
}
