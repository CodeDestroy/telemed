import React, {useEffect} from 'react';
import { useStopwatch  } from 'react-timer-hook';
import Index from '../Modals/ConferenceProtocol';
import socket from '../../socket';
import './timer.css'
const Timer = ({time, offsetTimestamp, run/* , onUpdateTotalSeconds */ }) => {
  
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    
    start,
    pause,
    reset,
  } = useStopwatch ({offsetTimestamp: time, /* expiryTimestamp, onExpire: () => console.warn('onExpire called'), */ autoStart: false });

  useEffect(() => {

    if (run && !isRunning) {
      /* const currentTime = Date.now(); */
    
    // Разница во времени между текущим временем и временем начала конференции
    /* const timeDifference = currentTime - offsetTimestamp; */
    
    // Установка времени таймера
      reset( time);
/*       setTime() */
      start()
    } else if (!run && isRunning) {
      pause()
    }

  }, [run, time]);

  /* useEffect(() => {
    onUpdateTotalSeconds(totalSeconds);
  }, [totalSeconds, onUpdateTotalSeconds]); */
  
  /* useEffect(()  =>  {
    console.log(`time on load: ${time}`)
  }, []); */

  return (
    <div id='timerDiv' style={{textAlign: 'center', zIndex: 2, position: 'relative', margin: '0 auto', top: '41vh'}}>
      {/* <p>Время</p> */}
      <div style={{fontSize: '30px'}}>
        <span className='black-stroke'>{hours}</span>:<span className='black-stroke'>{minutes}</span>:<span className='black-stroke'>{seconds}</span>
      </div>
      {/* <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Старт</button>
      <button onClick={pause}>Пауза</button>
      <button onClick={reset}>Перезапустить</button> */}
      {/* <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        reset(time)
      }}>Перезапуск</button> */}
    </div>
  );
}

export default Timer