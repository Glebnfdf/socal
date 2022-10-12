import * as React from "react";

interface iProps {
  children: React.ReactNode
}

export default function OrderListModel({children}: iProps): JSX.Element {
  return (
    <>{children}</>
  );
}
