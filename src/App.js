import './App.css';
import { useState, useEffect, useRef } from "react";





const SettingLabel = ({id, defaultSetting, getSetting, getResetter, getIsRunning}) => {

  let incrementButtonID = id + "-increment";
  let decrementButtonID = id + "-decrement";
  let settingLabelID = id + "-length"

  const [setting, setSetting] = useState(defaultSetting);

  useEffect(() => {
    //setSetting(defaultSetting);
    // console.log("defaultSetting: " + defaultSetting);
    // console.log("setting: " + setting);
    getSetting(setting);

  }, [setting]);

  function handleIncrement() {

    if (setting < 60) {
      setSetting(setting+1);
      //getSetting(setting);
    }

  }

  function handleDecrement() {
    if (setting > 1) {
      setSetting(setting-1);
      //console.log("setting: " + setting);
      //getSetting(setting);
    }
  }

/* 
  function setter(m){
    ;
  }
 */
  //setMinutes(setSetting(m));

  function reset() {
    setSetting(defaultSetting);
  }


  getResetter(reset);
  


  return <>
    <span id={settingLabelID}>{setting}</span>
    
    <button id={incrementButtonID} onClick={handleIncrement}>Increment</button>
    <button id={decrementButtonID} onClick={handleDecrement}>Decrement</button>
  </>

  
}







const TimeLabel = ({startTime, autostart, getCurrentTime, getIsRunning}) => {


  const pause = useRef(!autostart);
  //console.log("pause.current: " + pause.current + ", autostart: " + autostart);


  const remainingTime = useRef(startTime);
  //console.log("startTime.m: " + startTime.m);

  //let m = remainingTime.current.m;
  //let s = remainingTime.current.s;
  //console.log("remainingTime.current.s: " + remainingTime.current.s)
  const remainingTotalSecs = useRef(0);
  const [rer, setRer] = useState(0);
  const [display, setDisplay] = useState("");

  const [rT, setRT] = useState(startTime)


  function timeToSeconds() {
    let result = remainingTime.current.m * 60 + remainingTime.current.s;
    return result;
  }

  remainingTotalSecs.current = timeToSeconds();

  function secondsToTime() {
    let secs = remainingTotalSecs.current;
    let r = secs % 60;
    let m = (secs-r) / 60;
    return {m:m, s:r};
  }

  function timeToSecondsToTime() {
    let secs = timeToSeconds();
    let time = secondsToTime();
  }

  function fixSecondOverflow() {
    let time = secondsToTime();
    remainingTime.current = (time); 
  }

  function decrementTime() {
    if (remainingTotalSecs.current != 0) {
      remainingTotalSecs.current--;
      let time = secondsToTime();
      remainingTime.current = (time);
      
      setDisplay(timeToString());
      //setRT(time);
      getCurrentTime(time);
      //console.log("decrementTime, time.m: "  + time.m + ", time.s: " + time.s);

    }
    //m = remainingTime.current.m;
    //s = remainingTime.current.s;
    //console.log(remainingTotalSecs.current);
  }



  const inter = useRef();



  function decrementTimeAferOneSecond() {
    setTimeout(decrementTime(), 1000);
    //decrementTimeAferOneSecond()
  }


  function startInterval() {
    const interval = setInterval(() => {
      //setRer(remainingTotalSecs.current);
      decrementTime();
    }, 1000);

    inter.current = interval;

    console.log("interval started");

    getIsRunning(true);
  }

  function stopInterval() {
    clearInterval(inter.current);
    setDisplay(timeToString());
    getIsRunning(false);
    console.log("interval stopped");
  }

  function syncIntervalToPause() {
    if (pause.current) {
      stopInterval()
      //console.log("handlePause stopInterval");

    } else {
      startInterval();
      //console.log("handlePause startInterval, pause.current: " + pause.current + ", autostart: " + autostart);
    }
    
  }


  useEffect(() => {
    remainingTime.current = startTime;
    pause.current = !autostart;
    console.log("autostart in TimeLabel in useEffect: " + autostart);
    console.log("startTime.m in useEffect: " + startTime.m);
    setDisplay(timeToString());
    syncIntervalToPause();
  /*   if (autostart) {
      startInterval();
      //console.log("autostart true, startInterval()");
    } else {
      //stopInterval();
    } */
    //handlePause();
    //return () => clearInterval(inter.current);

    return () => stopInterval();
  
  }, [startTime])  //startTime, autostart

  function timeToString() {
    let mString = (remainingTime.current.m<10) ? "0" + remainingTime.current.m : remainingTime.current.m;
    let sString = (remainingTime.current.s<10) ? "0" + remainingTime.current.s : remainingTime.current.s;
    return mString + ":" + sString;
  }

  


  //display = m + ":" + s;

  function handlePause() {
    //console.log("pause.current: " + pause.current + ", autostart: " + autostart);
    pause.current = !pause.current;
    syncIntervalToPause();


  }

  let pauseButton = <>
    <button onClick={handlePause}>Pause/Start</button>
  </>

  //console.log("fdsfd");
  // console.log(remainingTotalSecs.current)
  //console.log("display: " + display);
  return <>
  <span id="time-left">{display}</span>
  <br/>
  <span id="start_stop">{pauseButton}</span>
  
  </>;

}





function App() {

  //const [remainingTime, setRemainingTime] = useState( {m:25, s:5});

  const defaultSessionMinutes = 25;
  const defaultBreakMinutes = 5;
  const defaultNextTime = {m: defaultSessionMinutes, s:0};

  //const sessionMinutes = useRef(defaultSessionMinutes);
  //const breakMinutes = useRef(defaultBreakMinutes);

  const [sessionMinutes, setSessionMinutes] = useState(defaultSessionMinutes);
  const [breakMinutes, setBreakMinutes] = useState(defaultBreakMinutes);

  const [nextTime, setNextTime] = useState(defaultNextTime);

  const [autostart, setAutostart] = useState(false);

  const nT = useRef(defaultNextTime);

  const [currentTime, setCurrentTime] = useState(nextTime);
  const cT = useRef(nT);

  //const isRunning = useRef(autostart);
  const [isRunning, setIsRunning] = useState(autostart);

  const sound = document.getElementById("beep");




  //console.log("nextTime.current.m: " + nextTime.current.m + ", nextTime.current.s: " + nextTime.current.s)

  const isBreak = useRef(false);

  function getSessionSetting(m) {
    //console.log("getSessionSetting");
    setSessionMinutes(m);
    updateTimeLive();
    //updateTime();
    /* if (!isBreak.current && false) {
      setNextTime({m: sessionMinutes, s:0});
    } */

    //console.log("sessionMinutes : " + m);
    //setNextTime({m: sessionMinutes, s:0});
  }

  function getBreakSetting(m) {
    console.log("getBreakSetting(m), breakMinutes before set: " + breakMinutes);
    setBreakMinutes(m);
    console.log("getBreakSetting(m), breakMinutes after set: " + breakMinutes);
    updateTimeLive();
    console.log("getBreakSetting(m), m: " + m);

    //updateTimeLive();
    //updateTime();
    /* if (isBreak.current && false) {
      setNextTime({m: breakMinutes, s:0});
    } */
    //console.log("breakMinutes : " + m);
  }

  function getCurrentTime(time) {
    cT.current = time;
    setCurrentTime(time);
    //console.log("App: time.m: "  + time.m + ", time.s: " + time.s);
    //console.log("getCurrentTime in App, currentTime.m: "  + currentTime.m + ", currentTime.s: " + currentTime.s);
    //console.log("getCurrentTime in App, cT.current.m: "  + cT.current.m + ", cT.current.s: " + cT.current.s);
  }

  const renderCount = useRef(0);

  function updateTime() {
    let m = isBreak.current ? breakMinutes : sessionMinutes;
    //autostart.current = true;
    console.log("m before set: " + m + ", nextTime.m before set: " + nextTime.m);
    //console.log("m before set: " + m + ", nT.current.m before set: " + nT.current.m);
    let time = {m: m, s: 0};
    setNextTime(time);
    nT.current = time;
  }
  
  
  function jumpToNext() {
    //console.log("isBreak.current: " + isBreak.current);
    isBreak.current = !isBreak.current;
    updateTime();
    //console.log("jumpToNext()");
    setAutostart(true);



  }

  
    function updateTimeLive() {
      if (!isRunning) {
        updateTime();
        console.log("updateTimeLive(), !isRunning.current == true");
        setAutostart(false);
      }
    }
  useEffect(() => {
    renderCount.current++;
    //return renderCount.current;
    //setCurrentTime(cT.current);
    //console.log("heeeeee");
    //updateTimeLive();
    
  });

  useEffect(() => {
    updateTimeLive();
  }, [breakMinutes, sessionMinutes])
  

  useEffect(() => {
    //setNextTime(nT.current);
    //console.log("useEffect in App, currentTime.m: "  + currentTime.m + ", currentTime.s: " + currentTime.s);
    //console.log("nextTime.m in useEffect: ", nextTime.m);
    //console.log("nT.current.m in useEffect: ", nT.current.m);
    console.log("hkdsfkdjfdf");   

    if (cT.current.m == 0 && cT.current.s == 0) {
      console.log("reached zero");
      jumpToNext();
      playAudio();
  
    } else {
      console.log("not zero yet");
    }
  }, [cT.current]);

  function playAudio() {
    document.getElementById("beep").play();

  }


    const resetBreak = useRef();
    const resetSession = useRef();

    function getBreakResetter(resetter) {
      resetBreak.current = resetter;
    }

    function getSessionResetter(resetter) {
      resetSession.current = resetter;
    }


    function reset() {
      console.log("reset() started, renderCount: " + renderCount.current);
      setNextTime(defaultNextTime);
      setSessionMinutes(defaultSessionMinutes);
      setBreakMinutes(defaultBreakMinutes);
      setAutostart(false);
      isBreak.current = false;
      updateTime();
      resetBreak.current();
      resetSession.current();
      //isRunning.current = false;
      setIsRunning(false);
      console.log("reset() ended, renderCount: " + renderCount.current);
      stopAudio();
    }



    function getIsRunning(boolean) {
      setIsRunning(boolean);
      //console.log("getIsRunning(boolean), boolean: " + boolean);
    
    }

    function sessionOrBreakString() {
      if (isBreak.current) {
        return "break";
      } else {
        return "session";
      }
    }

    function setTo0001() {
      setNextTime({m: 0, s: 1});
    }

    function stopAudio() {
      sound.pause();
      sound.currentTime = 0;
    }


 

  

  return (
    <div id="App">
      <p>The FreeCodeCamp Tester has incompatibilities with React, some test results do not represent this clock's actual behavior</p>
      <p id="timer-label">Timer<br/>Is running: {isRunning.toString()}<br/>{sessionOrBreakString()} initialized</p>
      <div>
        
        
      </div>
      

        <TimeLabel startTime={nextTime} autostart={autostart} getCurrentTime={getCurrentTime} getIsRunning={getIsRunning} />
        <button onClick={jumpToNext}>Jump to next</button>
        <button id="reset" onClick={reset}>Reset</button>

        <p></p>
        {/* {remainingTotalSecs.current} */}

      <div id="break-label">
        <p>Break Length:</p>
        <SettingLabel id="break" defaultSetting={defaultBreakMinutes} getSetting={getBreakSetting} getResetter={getBreakResetter} />

      </div>

      <div id="session-label">
        <p>Session Length:</p>

        <SettingLabel id="session" defaultSetting={defaultSessionMinutes} getSetting={getSessionSetting} getResetter={getSessionResetter} />

      </div>
      <br/>
      <br/>

      <audio id="beep" src="./beep.wav"></audio>

      <button onClick={playAudio}>Test Audio</button>
      <br/>
      <br/>
      <button onClick={setTo0001}>Set to 00:01</button>
      <br/>
      <p>Render count: {renderCount.current} </p>
      


  {/* <span id={"break-label"}>{setting}</span>
      <div>
      
      <button id={incrementButtonID} onClick={handleIncrement}>Increment</button>
      <button id={decrementButtonID} onClick={handleDecrement}>Decrement</button>

      </div>

      <span id={settingLabelID}>{setting}</span>
      
      <button id={incrementButtonID} onClick={handleIncrement}>Increment</button>
      <button id={decrementButtonID} onClick={handleDecrement}>Decrement</button>

  */}
      <br/>


    </div>
  );
}

export default App;
