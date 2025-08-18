'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = observer(({ children }: PrivateRouteProps) => {
  const router = useRouter()
  const store = useStore()

  useEffect(() => {
    if (!store.isLoading && !store.isAuth) {
      router.replace('/login') // редирект если не авторизован
    }
  }, [store.isAuth, store.isLoading, router])

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return null // или спиннер, пока редирект не произошел
  }

  return <>{children}</>
})

export default PrivateRoute
