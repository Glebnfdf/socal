export default function convertPhone2Num(rawPhoneNumber: string): string {
  const digits: RegExp = /\d/;
  let phoneNumber: string = "";
  for (let i = 0; i < rawPhoneNumber.length; i++) {
    if (digits.test(rawPhoneNumber[i])) {
      phoneNumber += rawPhoneNumber[i];
    }
  }

  return phoneNumber;
}
