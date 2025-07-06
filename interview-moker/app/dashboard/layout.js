import React from 'react'
import HeaderDashboard from './_components/header'
import Footer from './_components/footer/page'
// import MeshBackground from './_components/ventaWreper/page'



const Dashboardlayout = ({ children }) => {
  return (
    <div>
      {/* <MeshBackground> */}
      <HeaderDashboard />

      {children}


      <Footer />
      {/* </MeshBackground> */}
    </div>
  )
}

export default Dashboardlayout