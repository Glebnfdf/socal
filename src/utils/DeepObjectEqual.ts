// предполагается, что в объектах нет функций или Symbol
export default function DeepObjectEqual(object1: Record<string, unknown>, object2: Record<string, unknown>): boolean {
  const object1KeyArr: string[] = Object.keys(object1);
  const object2KeyArr: string[] = Object.keys(object2);

  if (object1KeyArr.length !== object2KeyArr.length) {
    return false;
  }

  for (const key of object1KeyArr) {
    const object1Value: unknown = object1[key];
    const object2Value: unknown = object2[key];

    if (typeof object1Value !== typeof object2Value) {
      return false;
    }

    if (typeof object1Value === "object") {
      if ((object1Value === null && object2Value !== null) || (object1Value !== null && object2Value === null)) {
        return false;
      }

      if (
        object1Value !== null &&
        !DeepObjectEqual(object1Value as Record<string, unknown>, object2Value as Record<string, unknown>)
      ) {
        return false;
      }
    }

    if (
      typeof object1Value === "boolean" ||
      typeof object1Value === "number" ||
      typeof object1Value === "bigint" ||
      typeof object1Value === "string"
    ) {
      if (object1Value !== object2Value) {
        return false;
      }
    }
  }

  return true;
}

