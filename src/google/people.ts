/* eslint-disable camelcase */
import { people_v1 } from 'googleapis'

import omit from 'lodash.omit'
import normalizeEmail from 'validator/lib/normalizeEmail'
import isMobilePhone from 'validator/lib/isMobilePhone'

import { google, JWT, AuthOptions, fieldMask, FieldMask } from '.'

export type PeopleApiV1 = people_v1.People

export type SearchResult = people_v1.Schema$SearchResult
export type Person = people_v1.Schema$Person
export type Name = people_v1.Schema$Name
export type PhoneNumber = people_v1.Schema$PhoneNumber
export type Field = { metadata?: people_v1.Schema$FieldMetadata }

export type DeepOptional<T> = {
  [P in keyof T]?: T[P] extends object ? DeepOptional<T[P]> : T[P] | null
}

export default class People {
  private api: PeopleApiV1

  constructor(auth: AuthOptions) {
    this.api = google.people({ version: 'v1', auth: JWT(auth) })
  }

  async get(resourceName: string) {
    const { data } = await this.api.people.get({
      resourceName,
      personFields: fieldMask(personFields),
    })
    return data
  }

  async create(
    person: Person,
    updateFields?: FieldMask,
    readFields?: FieldMask,
  ) {
    person = forUpdate(person)
    const { data } = await this.api.people.createContact({
      requestBody: person,
      ...fieldParamsFor(updateFields, readFields),
    })
    return data
  }

  async update(
    resourceName: string,
    person: Person,
    updateFields?: FieldMask,
    readFields?: FieldMask,
  ) {
    person = forUpdate(person)
    const { data } = await this.api.people.updateContact({
      resourceName,
      requestBody: person,
      ...fieldParamsFor(updateFields, readFields),
    })
    return data
  }

  async search(query: string) {
    const { data } = await this.api.people.searchContacts({
      query,
      readMask: fieldMask(personFields),
    })
    return (data.results ?? []).map(({ person }) => person) as Person[]
  }

  async searchByEmail(email: string) {
    let results: Person[] = []

    for (const query of [
      () => email,
      () => email.split('@')[0],
      () => email.substring(0, 3),
    ]) {
      results = filterByEmail(await this.search(query()), email)
      if (results.length) break
    }
    return results
  }
}

export const updatablePersonFields = [
  'names',
  'phoneNumbers',
  'addresses',
  'birthdays',
] as const

export const personFields = [
  ...updatablePersonFields,
  'emailAddresses',
  'photos',
] as const

export const readonlyProperties = [
  'metadata.primary',
  'displayName',
  'displayNameLastFirst',
  'formattedType',
  'formattedValue',
  'canonicalForm',
] as const

export function filterByEmail(results: Person[], email: string) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return []

  return results.filter(({ emailAddresses }) =>
    emailAddresses?.some(
      ({ value }) =>
        typeof value === 'string' && normalizeEmail(value) === normalizedEmail,
    ),
  )
}

export function primaryItem<T extends Field>(fields: T[] | undefined) {
  return fields?.find(({ metadata }) => metadata?.primary) || fields?.[0]
}

export function mobilePhone(numbers: PhoneNumber[] | undefined) {
  return numbers?.find(
    ({ canonicalForm: number }) => number && isMobilePhone(number),
  )
}

export function forUpdate({
  etag,
  names = [],
  addresses = [],
  phoneNumbers = [],
  birthdays = [],
}: Person) {
  return {
    etag,
    names: names.map(writableProps),
    addresses: addresses.map(writableProps),
    phoneNumbers: phoneNumbers.map(writableProps),
    birthdays: birthdays.map(writableProps),
  }
}

export function writableProps<T extends Field>(field: T | undefined) {
  return omit(field, readonlyProperties)
}

export const fieldParamsFor = (
  write: FieldMask = updatablePersonFields,
  read: FieldMask = personFields,
) => ({
  personFields: fieldMask(write),
  fields: fieldMask(read),
})
