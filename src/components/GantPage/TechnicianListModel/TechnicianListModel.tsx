import * as React from "react";

interface iProps {
  children: React.ReactNode
}

export default function TechnicianListModel({children}: iProps): JSX.Element {
  return (
    <>{children}</>
  );
}
