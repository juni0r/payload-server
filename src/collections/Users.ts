import { CollectionConfig } from 'payload/types'

export default <CollectionConfig>{
  slug: 'users',
  labels: {
    singular: {
      de: 'Konto',
      en: 'User',
    },
    plural: {
      de: 'Konten',
      en: 'Users',
    },
  },
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [{ name: 'name', type: 'text', required: true }],
}
