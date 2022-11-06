import twoDigitOutput from "./twoDigitsOutput";

export default function getDateWithSlash(date: Date): string {
  // dd/mm/yyyy
  return `${twoDigitOutput(date.getDate())}/${twoDigitOutput(date.getMonth() + 1)}/${date.getFullYear()}`
}
