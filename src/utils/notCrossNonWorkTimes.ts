import { iTimeSlot } from "../APIInterfaces/iTechResponse";

export default function notCrossNonWorkTimes(
  techNonWorkingTimes: iTimeSlot[],
  orderBeginTime: Date,
  orderEndTime: Date
): boolean {
  for (let i = 0; i < techNonWorkingTimes.length; i++) {
    const techTmeSlotStart: Date = new Date(techNonWorkingTimes[i].start);
    const techTmeSlotEnd: Date = new Date(techNonWorkingTimes[i].finish);
    if (orderBeginTime.getTime() > techTmeSlotStart.getTime() && orderBeginTime.getTime() < techTmeSlotEnd.getTime() ||
        orderEndTime.getTime() > techTmeSlotStart.getTime() && orderEndTime.getTime() < techTmeSlotEnd.getTime() ||
        orderBeginTime.getTime() <= techTmeSlotStart.getTime() && orderEndTime.getTime() >= techTmeSlotEnd.getTime()
    ) {
      return false;
    }
  }
  return true;
}
