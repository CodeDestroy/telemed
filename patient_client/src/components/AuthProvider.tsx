'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
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
    return <div>Загрузка...</div>
  }

  return <>{children}</>
}
