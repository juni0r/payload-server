import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { viteBundler } from '@payloadcms/bundler-vite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import Customers from './collections/Customers'

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  collections: [Users, Customers],
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    vite: (incomingViteConfig) => {
      const existingAliases = incomingViteConfig?.resolve?.alias || {}
      let alias: { find: string | RegExp; replacement: string }[] = []

      // Pass the existing Vite aliases
      if (Array.isArray(existingAliases)) {
        alias = existingAliases
      } else {
        alias = Object.values(existingAliases)
      }

      // Add your own aliases using the find and replacement keys
      alias.push({
        find: './hooks/populateFromGooglePeople',
        replacement: path.resolve(__dirname, './mock.js'),
      })

      return {
        ...incomingViteConfig,
        resolve: {
          ...(incomingViteConfig?.resolve || {}),
          alias,
        },
      }
    },
  },
  localization: {
    locales: [
      {
        code: 'en',
        label: {
          en: 'English',
          de: 'Englisch',
        },
      },
      {
        code: 'de',
        label: {
          en: 'German',
          de: 'Deutsch',
        },
      },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  email: {
    transportOptions: {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      port: Number(process.env.SMTP_HOST),
      secure: Number(process.env.SMTP_PORT) === 465,
      requireTLS: true,
    },
    fromName: 'Payload',
    fromAddress: 'mail@andreaskorth.de',
  },
})
