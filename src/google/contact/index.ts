import merge from 'lodash.merge'
import type { Person, Field, Name, DeepOptional } from '../people'
import { primaryItem, forUpdate, writableProps } from '../people'
import { type Contact, ContactSchema } from './schema'

export { Person, Contact, ContactSchema }

export const contactFromPerson = ({
  names,
  addresses,
  phoneNumbers,
  birthdays,
}: Person): DeepOptional<Contact> => {
  return {
    name: writableProps(primaryItem(names)),
    address: writableProps(primaryItem(addresses)),
    phoneNumber: writableProps(primaryItem(phoneNumbers)),
    birthday: writableProps(primaryItem(birthdays)),
  }
}

export const mergeContact = (
  person: Person,
  { name, address, phoneNumber, birthday }: Contact,
): Person => {
  const { etag, names, addresses, phoneNumbers, birthdays } = forUpdate(person)

  merge(primaryItemOrAdd(names), withUnstructuredName(name))
  merge(primaryItemOrAdd(addresses), address)
  merge(primaryItemOrAdd(phoneNumbers), phoneNumber)
  merge(primaryItemOrAdd(birthdays), birthday)

  return {
    etag,
    names,
    addresses,
    phoneNumbers,
    birthdays,
  }
}

function primaryItemOrAdd<T extends Field>(fields: T[]) {
  let item = primaryItem(fields)
  if (!item) {
    item = {} as T
    fields.unshift(item)
  }
  return item
}

function withUnstructuredName(name: Name) {
  return {
    ...name,
    unstructuredName: [name.givenName, name.middleName, name.familyName]
      .filter((item) => !!item)
      .join(' '),
  }
}
