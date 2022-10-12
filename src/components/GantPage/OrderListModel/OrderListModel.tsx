import * as React from "react";
import TechnicianListModel from "../TechnicianListModel/TechnicianListModel";

interface iProps {
  children: React.ReactNode
}

export default function OrderListModel({children}: iProps): JSX.Element {
  return (
    <TechnicianListModel>
      {children}
    </TechnicianListModel>
  );
}
