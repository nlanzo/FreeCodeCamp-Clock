import { useState, useEffect } from 'react'
import './App.css'
import { DisplayState } from './helpers'
import TimeSetter from './TimeSetter'
import Display from './Display';
import AlarmSound from './assets/AlarmSound.mp3';


const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    isRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if (!displayState.isRunning) return;
    timerID = window.setInterval(decrementDisplayTime, 1000);

    return () => window.clearInterval(timerID);
  }, [displayState.isRunning]);

  useEffect(() => {
    if (displayState.time < 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.play();
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime,
      }));
    } 
  }, [displayState, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreakTime);
    setSessionTime(defaultSessionTime);
    setDisplayState({
      time: defaultSessionTime,
      timeType: "Session",
      isRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  }

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }

  const changeBreakTime = (newTime: number) => {
    if(displayState.isRunning) return;
    setBreakTime(newTime);
  }

  const decrementDisplayTime = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  }

  const changeSessionTime = (newTime: number) => {
    if(displayState.isRunning) return;
    setSessionTime(newTime);
    setDisplayState({
      time: newTime,
      timeType: "Session",
      isRunning: false,
    });
  }

  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <TimeSetter
            time={breakTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
      </div>
      <Display
        displayState={displayState}
        reset={reset}
        startStop={startStop}
      />
      <audio id="beep" src={AlarmSound} />
    </div>
  )
}


export default App;
