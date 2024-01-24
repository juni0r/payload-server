import { google } from 'googleapis'
export { google }

const { isArray } = Array

export type FieldMask = string | string[] | Readonly<string[]>

export interface AuthOptions {
  clientEmail: string
  privateKey: string
  subject: string
  scopes: string[] | string
}

export const JWT = (auth: AuthOptions) =>
  new google.auth.JWT(
    auth.clientEmail,
    undefined,
    auth.privateKey,
    isArray(auth.scopes) ? auth.scopes : auth.scopes.split(/\s+/),
    auth.subject,
  )

export const fieldMask = (readMask: FieldMask) =>
  (Array.isArray(readMask) ? readMask.join(',') : readMask) as string
