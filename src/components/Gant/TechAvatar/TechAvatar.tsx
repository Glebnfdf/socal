import * as React from "react";

interface iProps {
  url: string | null,
  techName: string
}

export default function TechAvatar({url, techName}: iProps): JSX.Element {
  function getFirstLetter(name: string): string {
    return name[0].toUpperCase();
  }

  if (url) {
    return (
      <img src={url} alt="#" />
    );
  } else {
    return (
      <div className="tech-avatar-txt-cont">{getFirstLetter(techName)}</div>
    );
  }
}
