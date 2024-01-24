import { mande, type MandeInstance } from 'mande'
import type { PaginatedDocs } from 'payload/database'
import type { SanitizedCollectionConfig } from 'payload/types'
import type { User, Customer } from '../payload-types'
// import type { MergeExclusive, Simplify } from 'type-fest'
// import { mix, Constructable } from 'mixwith.ts'

interface AuthCredentials {
  email: string
  password: string
}

// type ManagedFields = 'id' | 'updatedAt' | 'createdAt'
// type ManagedAuthFields =
//   | 'email'
//   | 'resetPasswordToken'
//   | 'resetPasswordExpiration'
//   | 'salt'
//   | 'hash'
//   | 'loginAttempts'
//   | 'lockUntil'
//   | 'password'

// type CreateProps<T> = Omit<T, ManagedFields | ManagedAuthFields>
// type UpdateProps<T> = Partial<CreateProps<T>>

export interface ClientConfig {
  base: string
}

export class Collection<T> {
  api: MandeInstance

  constructor(
    public base: string,
    public config: SanitizedCollectionConfig,
  ) {
    this.api = mande(`${base}/${config.slug}`)
  }

  // create(props: T) {}

  find() {
    return this.api.get<PaginatedDocs<T>>()
  }

  get(id: string) {
    return this.api.get<T>(id)
  }
}

export class AuthCollection<T = unknown> extends Collection<T> {
  login(credentials: AuthCredentials) {
    return this.api.post('login', credentials)
  }

  logout() {
    return this.api.post('logout')
  }
}

export class Users extends Collection<User> {}
export class Customers extends Collection<Customer> {}
