/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
'use client'

import Header from "@/components/Header"

export default function Main() {
  return (
          <>
              <Header/>
              <div className="text-center mt-10">Main</div>
          </>
          
      )
}
