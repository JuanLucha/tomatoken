import React, { useEffect, useState } from "react";

import Display from "./Display";

const pomodoroTimeInSeconds = 1500;

const Pomodoro = () => {
  const [time, setTime] = useState(0);
  const [ongoing, setOngoing] = useState(false);

  useEffect(() => {
    let interval;
    if (ongoing) {
      time < pomodoroTimeInSeconds
        ? (interval = setTimeout(() => setTime((previous) => previous + 1), 1000))
        : clearTimeout(interval);
    }
    return () => clearTimeout(interval);
  }, [time, ongoing]);

  const startPomodoro = () => {
    setOngoing(true);
  };

  return (
    <div>
      {ongoing && <Display time={time}></Display>}
      <br></br>
      <button onClick={startPomodoro}>
        Start pomodoro{" "}
        <span role="img" aria-label="pomodoro">
          🍅
        </span>
      </button>
    </div>
  );
};

export default Pomodoro;
