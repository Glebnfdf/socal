import iOrderResponse from "./iOrderResponse";

export default interface iTechResponse {
  id: number,
  name: string,
  main_queue: iOrderResponse[] | null,
  second_queue: iOrderResponse[] | null,
  avatar: string | null,
  non_working_times: iTimeSlot[] | null
}

export interface iTimeSlot {
  start: string,
  finish: string
}

export interface iTechResponseRaw {
  data: iTechItemResponse
}

interface iTechItemResponse {
  items: iTechResponse[]
}
