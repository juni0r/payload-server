import { number, object, string, type infer as Infer } from 'zod'

export const ContactSchema = object({
  name: object({
    givenName: string().trim(),
    middleName: string().trim().nullable().optional(),
    familyName: string().trim(),
  }),
  phoneNumber: object({
    value: string().trim(),
  }),
  address: object({
    streetAddress: string().trim(),
    extendedAddress: string().trim().nullable().optional(),
    postalCode: string().trim(),
    city: string().trim(),
  }),
  birthday: object({
    date: object({
      year: number().int().gte(1920).lte(2020),
      month: number().int().gte(1).lte(12),
      day: number().int().gte(1).lte(31),
    }),
  }),
})

export type Contact = Infer<typeof ContactSchema>
