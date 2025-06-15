import React from 'react'
import HeaderDashboard from './_components/header'
import Footer from './_components/footer  '


const Dashboardlayout = ({ children }) => {
  return (
    <div>
      <HeaderDashboard />
      <div className=' mt-4 mx-5 md:mx-20 lg:mx-36 '>
        {children}

      </div>
      <Footer />
    </div>
  )
}

export default Dashboardlayout