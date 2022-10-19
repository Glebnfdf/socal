export default function isBeginTimeNotOld(): boolean {
  const timeInLS: string | null = localStorage.getItem("order-time-begin");
  if (!timeInLS) {
    return false;
  }

  if (timeInLS === "-1") {
    return false;
  }

  const dragOrderTime: Date = new Date(timeInLS);
  const todayDate: Date = new Date();
  return !(dragOrderTime.getFullYear() < todayDate.getFullYear() ||
           dragOrderTime.getMonth()    < todayDate.getMonth()    ||
           dragOrderTime.getDate()     < todayDate.getDate());
}
