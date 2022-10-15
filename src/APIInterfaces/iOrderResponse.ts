export default interface iOrderResponse {
  id: number,
  time_slot_from: string,
  time_slot_to: string
  type: string,
  address: string,
  coords: string,
  main_contact_phone: string,
  main_contact_name: string,
  main_contact_email: string | null,
  appliance: string,
  description: string
}
