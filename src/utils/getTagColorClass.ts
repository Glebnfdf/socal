export default function getTagColorClass(orderType: string): string {
  switch (orderType.toLowerCase()) {
    case "recall":
      return "red";
    case "repair":
      return "orange";
    case "estimation":
      return "violet";
    default:
      return "unknown-tag";
  }
}
