import iOrderResponse from "./iOrderResponse";

export default interface iTechResponse {
  id: number,
  name: string,
  visits: iOrderResponse[] | null,
  visits_extra: iOrderResponse[] | null,
  avatar: string | null,
  nonWorkingTimes: TimeSlot[] | null
}

interface TimeSlot {
  time_slot_from: string,
  time_slot_to: string
}
