import React from 'react'
import HeaderDashboard from './_components/header'
import Footer from './_components/footer/page'
import MeshBackground from './_components/ventaWreper/page'



const Dashboardlayout = ({ children }) => {
  return (
    <div>
      <MeshBackground>
        <HeaderDashboard />
        <div className=' mt-4 mx-5 md:mx-20 lg:mx-36 '>
          {children}

        </div>
      </MeshBackground>
      <Footer />
    </div>
  )
}

export default Dashboardlayout