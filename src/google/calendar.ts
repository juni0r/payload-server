/* eslint-disable camelcase */
import { calendar_v3 } from 'googleapis'
import { google, JWT, type AuthOptions, fieldMask } from '.'

export type CalendarApiV3 = calendar_v3.Calendar
export type Events = calendar_v3.Schema$Events
export type Event = calendar_v3.Schema$Event
export type GetEventParams = calendar_v3.Params$Resource$Events$Get
export type ListEventsParams = calendar_v3.Params$Resource$Events$List
export type PatchEventParams = calendar_v3.Params$Resource$Events$Patch

export type EventUpdate = PatchEventParams['requestBody']
export interface WatchEventsParams {
  id: string
  token: string
  address: string
  ttl?: number | string
}
export interface StopChannelParams {
  id: string
  resourceId: string | null | undefined
}

export default class Calendar {
  private api: CalendarApiV3

  constructor(auth: AuthOptions) {
    this.api = google.calendar({ version: 'v3', auth: JWT(auth) })
  }

  async getEvent({ fields, ...params }: GetEventParams) {
    fields &&= fieldMask(fields)
    const { data } = await this.api.events.get({ ...params, fields })
    return data
  }

  async listEvents({ fields, ...params }: ListEventsParams): Promise<Events> {
    fields &&= `items(${fieldMask(fields)})`
    const { data } = await this.api.events.list({ ...params, fields })
    return data
  }

  async patchEvent(params: PatchEventParams) {
    const { data } = await this.api.events.patch(params)
    return data
  }

  async watchEvents(
    calendarId: string,
    { id, token, address, ttl = 604_800 }: WatchEventsParams,
  ) {
    ttl = String(ttl)

    const { data } = await this.api.events.watch({
      calendarId,
      requestBody: {
        type: 'web_hook',
        id,
        token,
        address,
        params: { ttl },
      },
    })
    return data
  }

  async stopChannel({ id, resourceId }: StopChannelParams) {
    return await this.api.channels.stop({
      requestBody: { id, resourceId },
    })
  }
}
