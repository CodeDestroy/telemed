import React, {useContext, useEffect, useCallback, useLayoutEffect} from 'react'
import Jitsi from './Jitsi'
import Chat from './Chat'
import { Context } from "../..";
import socket from '../../socket'
import { useParams, useSearchParams } from "react-router-dom";
import Header from '../Header';
import { observer } from 'mobx-react-lite';

function Index() {
  const {roomId} = useParams();
  const {store} = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const jwt = searchParams.get('token')
  
  const joinRoom = useCallback((roomId) => {
    socket.emit('room:join', roomId, store.user.id, jwt)
  }, [roomId]);

  const loginByJWT = () => {
    socket.emit('user:login', jwt)
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
    socket.on('room:joined', (joined, roomName, user) => {
      console.log(`joined: ${joined} room: ${roomName}`)
    })
    socket.on('user:logined', (bool, user) => {
      console.log(user)
      if (!bool) {
        window.location.href=''; 
        return
      }
      store.setAuth(true)
      store.setUser(user) 
      joinRoom(roomId)
    })

  }, [store])

  return (
    <>
      <Header/>
      <Jitsi room={roomId} token={jwt}/>
      <Chat roomId={roomId} token={jwt}/>
    </>
    
  )
}

export default observer(Index)