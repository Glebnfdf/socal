import * as React from "react";

interface iProps {
  url: string | null,
  techName: string,
  bgColor: string
}

export default function TechAvatar({url, techName, bgColor}: iProps): JSX.Element {
  function getFirstLetter(name: string): string {
    return name[0].toUpperCase();
  }

  if (url) {
    return (
      <img src={url} alt="#" />
    );
  } else {
    return (
      <div className="tech-avatar-txt-cont" style={{backgroundColor: "#" + bgColor}}>{getFirstLetter(techName)}</div>
    );
  }
}
