export interface IOrderUpdateReqData {
  task_id: number,
  technician_id: number,
  second_technician_id?: number
  time_slot_from: string,
  time_slot_to: string
}
