import iOrderResponse from "./iOrderResponse";

export default interface iTechResponse {
  id: number,
  name: string,
  main_queue: iOrderResponse[] | null,
  second_queue: iOrderResponse[] | null,
  avatar: string | null,
  nonWorkingTimes: TimeSlot[] | null
}

interface TimeSlot {
  time_slot_from: string,
  time_slot_to: string
}
