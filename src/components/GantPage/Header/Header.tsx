import * as React from "react";
import "../../../../source/img/svgIcons/arrow-left.svg";
import "../../../../source/img/svgIcons/arrow-right.svg";
import "../../../../source/img/svgIcons/calendar-icon.svg";
import imgLogo from "../../../../source/img/logo/logo.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";
import Calendar from "react-calendar";
import "./header.scss";
import "../../../../source/scss/calendar/calendar.scss";

export default function Header(): JSX.Element {
  const [date, setDate]: [st: Date | null, set: (st: Date | null) => void] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const gantLoaderContext = useContext(GrantLoaderContext);
  const [calendarDate, setCalendarDate]: [st: Date, set: (st: Date) => void] = useState<Date>(new Date);
  const isShowCalendar: React.MutableRefObject<boolean> = useRef<boolean>(false);

  useEffect((): void => {
    setDate(gantLoaderContext.date);
    setCalendarDate(gantLoaderContext.date);
  }, [gantLoaderContext.date]);

  function getDate(): Date {
    return date ? new Date(date.toISOString()) : new Date();
  }

  function dateSubtraction(): Date {
    const newDate: Date = getDate();
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  }

  function dateAddition(): Date {
    const newDate: Date = getDate();
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  useEffect((): void => {
    if (showCalendar) {
      setShowCalendar(false);
      gantLoaderContext.changeDate(calendarDate);
    }
  }, [calendarDate]);

  useEffect((): () => void => {
    const closeCalendar = (event: MouseEvent): void => {
      if (isShowCalendar.current &&
        (event.target as HTMLElement).closest(".header .calendar") === null &&
        (event.target as HTMLElement).closest(".header .header-calendar") === null
      ) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("click", closeCalendar);

    return (): void => {
      document.removeEventListener("click", closeCalendar);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-blur header-blur-show"/>
      <nav className="nav container">
        <div className="left">
          <div className="logo">
            <img src={imgLogo} width={185} height={51} alt={"logo"} />
          </div>
        </div>
        <div className="title">
          {date && `${
            new Intl.DateTimeFormat("en-US", {weekday: "short"}).format(date)
          } ${new Intl.DateTimeFormat("en-US", {month: "short"}).format(date)
          } ${new Intl.DateTimeFormat("en-US", {day: "2-digit"}).format(date)
          }, ${date.getFullYear()}`}
          {/*Tue Sep 09, 2022*/}
        </div>
        <div className="right">
          <div className="arrow">
            <div className="left" onClick={(): void => {gantLoaderContext.changeDate(dateSubtraction())}}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                <use href="#arrow-left"/>
              </svg>
            </div>
            <div className="right" onClick={(): void => {gantLoaderContext.changeDate(dateAddition())}}>
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                <use href="#arrow-right"/>
              </svg>
            </div>
          </div>
          <div className="calendar" onClick={(): void => {
            if (!showCalendar) {
              isShowCalendar.current = true;
            }
            setShowCalendar(!showCalendar);
          }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <use href="#calendar-icon"/>
            </svg>
          </div>
        </div>
      </nav>
      <div className={"header-calendar" + (showCalendar ? "" : " hide")}>
        <Calendar calendarType={"US"} locale={"en"} value={calendarDate} onChange={setCalendarDate} />
      </div>
    </header>
  );
}
