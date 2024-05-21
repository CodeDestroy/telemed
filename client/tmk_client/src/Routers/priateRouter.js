import React, {useContext, useState, useLayoutEffect} from 'react'
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import { Navigate, Outlet } from 'react-router-dom';
export default function PriateRouter() {
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
        auth ? <Outlet/> : <Navigate to={'/login'} />
    )
}
