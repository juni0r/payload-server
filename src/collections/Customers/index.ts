import { CollectionConfig } from 'payload/types'
import populateFromGooglePeople from './hooks/populateFromGooglePeople'

export default <CollectionConfig>{
  slug: 'customers',
  labels: {
    singular: {
      de: 'Kunde',
      en: 'Customer',
    },
    plural: {
      de: 'Kunden',
      en: 'Customers',
    },
  },
  admin: {
    useAsTitle: 'givenName',
  },
  auth: {
    verify: true,
  },
  fields: [
    { name: 'resourceName', type: 'text' },
    { name: 'givenName', type: 'text' },
    { name: 'familyName', type: 'text' },
    { name: 'phoneNumber', type: 'text' },
    { name: 'photoUrl', type: 'text' },
    { name: 'enrolledAt', type: 'date' },
  ],
  access: {
    create: () => true,
  },
  hooks: {
    afterChange: [populateFromGooglePeople],
  },
}
