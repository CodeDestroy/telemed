import React, {useContext, useEffect, useCallback, useLayoutEffect, useState, useRef} from 'react'
import Jitsi from './Jitsi'
import Chat from './Chat'
import { Context } from "../..";
import socket from '../../socket'
import { useParams, useSearchParams } from "react-router-dom";
import Header from '../Header';
import { observer } from 'mobx-react-lite';
import Timer from '../Timer';
import ModalChat from './Chat/ModalChat'

function Index() {
    const {roomId} = useParams();
    const {store} = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const headerRef = useRef(null);
    const jitsiRef = useRef(null);
    const timerRef = useRef(null);
    const chatRef = useRef(null);

    const jwt = searchParams.get('token')
    
    const joinRoom = useCallback((roomId) => {
      socket.emit('room:join', roomId, store.user.id, jwt)
    }, [roomId, store.user.id, jwt]);

    const loginByJWT = () => {
        socket.emit('user:login', jwt)
        console.log('login')
    }

    useLayoutEffect(() => {
        if (!store.isAuth || !localStorage.getItem('token')) {
            loginByJWT()
        }
    }, [])

    useEffect(() => {
        if (store.isAuth || localStorage.getItem('token')) {
            joinRoom(roomId)
        }
        
      

    }, [store])

    socket.on('room:joined', (joined, roomName, user) => {
        console.log('JOINED', roomName)
        if (!joined)  {
            window.location.href='/'; 
            return
        
        }
        console.log(`joined: ${joined} room: ${roomName}`)
    })

    socket.on('user:logined', (bool, user) => {
        console.log(bool, user)
        if (!bool) {
          /* console.log(bool, user) */
          /* window.location.href='/';  */
          /* return */
        }
        store.setAuth(true)
        store.setUser(user) 
        joinRoom(roomId)
    })


    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleConferenceJoin = (time = 0) => {
        if (time != 0) {
            const startedTime  = new Date(time);
            const currentTime = new Date();
            const seconds = Math.abs((currentTime - startedTime)/1000)
            
            
            currentTime.setSeconds(currentTime.getSeconds() + seconds)
            handleUpdateTotalSeconds(currentTime)
            setIsTimerRunning(true);
        }
        else {
            handleUpdateTotalSeconds(0)
            setIsTimerRunning(true);
            
        }
        /* const stopwatchOffset = new Date(); 
        stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);
        setIsTimerRunning(true);
        handleUpdateTotalSeconds(stopwatchOffset) */
    };

    const handleConferenceLeave = () => {
        setIsTimerRunning(false);
    };

    const [totalSeconds, setTotalSeconds] = useState(0);

    const handleUpdateTotalSeconds = (seconds = 0) => {
        setTotalSeconds(seconds);
    };

  
  
    const handleFullScreen =(event, jitsiRefActual, isFullScreen) => {
        const header = document.getElementsByTagName('header')[0];
        const chatContainer = document.getElementById('chatContainer')
        const timer = document.getElementById('timerDiv');
        if (!isFullScreen) {
              timer.classList.add('timer-fullscreen')
              jitsiRefActual.classList.add('fullscreen')
              chatContainer.style.display  =  'none'
              header.style.display  =  'none'
        }
        else {
            jitsiRefActual.classList.remove('fullscreen')
            timer.classList.remove('timer-fullscreen')
            header.style.display  =  'block'
            chatContainer.style.display  =  'block'
        }
    }

    const [modalChatShow, setModalChatShow] = React.useState(false);
    
    const hadleOpenModalChat = () => {
        setModalChatShow(true)
    }
  /* const time = new Date();
  time.setSeconds(time.getSeconds() + 600); */ // 10 minutes timer
    return (
      <>
        <Header/>
        <div id='container-for-selector'>

            <Jitsi openModalChat={hadleOpenModalChat} room={roomId} token={jwt} onFullScreen={handleFullScreen} onJoin={handleConferenceJoin} onLeave={handleConferenceLeave} timerSeconds={totalSeconds}/>
            <Timer time={totalSeconds} offsetTimestamp={totalSeconds} run={isTimerRunning}/*  onUpdateTotalSeconds={handleUpdateTotalSeconds} *//>
            <Chat roomId={roomId} token={jwt}  show={modalChatShow} onHide={() => setModalChatShow(false)}/>
          {/* <ModalChat show={modalChatShow} onHide={() => setModalChatShow(false)} roomId={roomId} token={jwt}/> */}
        </div>
        
      </>
    
  )
}

export default observer(Index)