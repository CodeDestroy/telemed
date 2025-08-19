'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import Header from './Header'
import Loader from './Loader'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, isLoading } = useStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function verify() {
      await checkAuth()
      setChecked(true)
    }
    verify()
  }, [checkAuth])

  if (!checked || isLoading) {
    // Пока проверяем авторизацию — показываем, например, лоадер
    return (
    <>
      <Header/>
      <div style={{top: '40%'}} className='relative text-center mt-5'>
        <Loader/>
      </div>
    </>)
  }

  return <>{children}</>
}
export default  AuthProvider

