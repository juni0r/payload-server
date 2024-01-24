import { CollectionAfterChangeHook } from 'payload/types'
import People, { mobilePhone, primaryItem } from '../../../google/people'

const {
  GOOGLE_AUTH_SUBJECT: subject,
  GOOGLE_AUTH_CLIENT_EMAIL: clientEmail,
  GOOGLE_AUTH_SCOPES: scopes,
  GOOGLE_AUTH_PRIVATE_KEY: privateKey,
} = process.env

const people = new People({ clientEmail, privateKey, subject, scopes })

export default (async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  const [person] = await people.searchByEmail(doc.email)
  if (!person) return doc

  const { givenName, familyName } = primaryItem(person.names) ?? {}

  return {
    ...doc,
    resourceName: person.resourceName,
    givenName,
    familyName,
    phoneNumber: mobilePhone(person.phoneNumbers)?.canonicalForm,
    photoUrl: primaryItem(person.photos)?.url,
  }
}) satisfies CollectionAfterChangeHook
