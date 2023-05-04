export const randomBytes = (s: number): Uint8Array => {
  const result = new Uint8Array(s)
  self.crypto.getRandomValues(result)
  return result
}

export const u8btoa = (input: Uint8Array): string => {
  const decoder = new TextDecoder('utf8')
  return btoa(decoder.decode(input))
}
