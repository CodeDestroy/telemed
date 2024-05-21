import { useLayoutEffect, useContext } from "react";
import Header from "./Components/Header";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import { observer } from 'mobx-react-lite';
import { Route, Routes , BrowserRouter } from 'react-router-dom';
import { Context } from './';
import './Assets/css/Main.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import socket from "./socket";
import mainRouter from './Routers/mainRouter'
function App() {
  
  const { store } = useContext(Context);

  useLayoutEffect (() => {
    async function checkAuth () {
        if (localStorage.getItem('token')) {
            try {
                const response = await store.checkAuth(); 
            }
            catch (e) {
                console.log(e)
            }
        }
    }
    checkAuth()
  }, [])

  /* const registerNew = () => {
    socket.emit('user:register', roomId, store.user.id, jwt)
  } */


  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if ((window.location.pathname.includes('room') && window.location.search.includes('token')) || store.isAuth || localStorage.getItem('token')) {
    /* if (!store.isAuth || !localStorage.getItem('token')) {
      registerNew()
    } */
    return (
      <RouterProvider router={mainRouter} />
    );
  }
  else {
    return (
      <Login/>
    )
  }
  
}

/* export default observer(App);
import { useLayoutEffect, useContext, useState } from "react";
import Header from "./Components/Header";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import { observer } from 'mobx-react-lite';
import { Route, Routes , BrowserRouter } from 'react-router-dom';
import { Context } from './';
import { Navigate, Outlet } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import mainRouter from './Routers/mainRouter'
function App() {
  const {store} = useContext(Context)
  const [auth, setAuth] = useState(false)
  useLayoutEffect (() => {
      if (localStorage.getItem('token')) {
        store.checkAuth()
        .then( () => {
          setAuth(true)
        })
        .catch((e) => {
          setAuth(false)
        })
      }
      
  }, [store])
  return (
      auth && !window.location.href == 'login' ? <RouterProvider router={mainRouter} /> : window.location.href = 'login'
  )  
}
*/
export default observer(App); 
