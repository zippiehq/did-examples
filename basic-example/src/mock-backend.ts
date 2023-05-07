const myUsers: string[] = []
//
// This function should be implemented on the backend and replaced with an XHR
//
export const backendCreateUser = async (userKey: string) => {
  myUsers?.push(userKey)
  // TODO: Here you should create the user in your database
  console.info('new User ref:', userKey)
}
