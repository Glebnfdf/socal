export default function twoDigitOutput(num: number): string {
  return num < 10 ? "0" + num.toString() : num.toString();
}
