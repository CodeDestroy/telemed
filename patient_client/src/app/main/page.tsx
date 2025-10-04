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

import Footer from "@/components/Footer"
import Header from "@/components/Header"

const Main = () => {
  return (
          <>
              <Header/>
              <div className="text-center mt-10">Main</div>
              <Footer/>
          </>
          
      )
}
export default Main