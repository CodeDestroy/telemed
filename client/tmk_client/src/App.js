import {  useContext, useEffect } from "react";

import Loading from './Components/Loading'
import { observer } from 'mobx-react-lite';
import { Context } from './';

import { RouterProvider } from "react-router-dom";
import mainRouter from './Routers/mainRouter'
import adminRouter from "./Routers/adminRouter";
import doctorRouter from "./Routers/doctorRouter";
import authRouter from './Routers/authRouter'
import superAdminRouter from "./Routers/superAdminRouter";
import operatorRouter from "./Routers/operatorRouter";
import selectProfileRouter from "./Routers/selectProfileRouter";
function App() {
  
  const { store } = useContext(Context);

  useEffect (() => {
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

  const html = document.querySelector('html')
  if (store.isLoading) {
    return <Loading/>
  }
  else {
    if ((window.location.pathname.includes('room') && window.location.search.includes('token'))) {
      /* if (!store.isAuth || !localStorage.getItem('token')) {
        registerNew()
      } */
      
      return (
        <RouterProvider router={mainRouter} />
      );
    }
    else if (store.isAuth || localStorage.getItem('token')) {
      
      html.style.removeProperty('font-size')
      if (store.mustSelect && !store.isSelected) {
        return (<RouterProvider router={selectProfileRouter} />)
      }
      /* console.log('try to login') */
      switch (store.user.accessLevel) {
        case 1: 
          return (<RouterProvider router={mainRouter} />)
        case 2: 
          return (<RouterProvider router={doctorRouter} />)
        case 3: 
          return (<RouterProvider router={adminRouter} />)
        case  4: 
          return (<RouterProvider router={superAdminRouter} />)
        case  5: 
          return (<RouterProvider router={superAdminRouter} />)
        default: 
          return (<RouterProvider router={operatorRouter} />)
      }
    }
    else {
      return (
        <RouterProvider router={authRouter} />
  
      )
    }
  }

  
  
}

export default observer(App); 
