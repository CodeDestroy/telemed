'use client'

import React, { createContext, useContext } from 'react'
import Store from './store'

// 1. Создаём экземпляр стора
export const store = new Store()

// 2. Создаём и экспортируем контекст
export const StoreContext = createContext<Store | null>(null)

// 3. Провайдер
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
)

// 4. Хук для доступа к стору
export const useStore = (): Store => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore должен использоваться внутри <StoreProvider>')
  }
  return context
}
