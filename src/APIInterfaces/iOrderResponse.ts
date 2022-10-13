export default interface iOrderResponse {
  id: number,
  time_slot_from: string,
  time_slot_to: string
  type: string,
  address: string,
  coords: string,
  main_contact_phone: string,
  main_contact_name: string,
  email: string | null,
  service: string,
  description: string
}
