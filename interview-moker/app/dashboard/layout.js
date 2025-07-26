import React from 'react'
import HeaderDashboard from './_components/header'
import Footer from './_components/footer/page'
import MeshBackground from './_components/ventaWreper/page'

import { Toaster } from 'react-hot-toast';

const Dashboardlayout = ({ children }) => {
  return (
    <div>
      <MeshBackground>
        <HeaderDashboard />

        {children}

        <Toaster position="top-right" />
        <Footer />
      </MeshBackground>
    </div>
  )
}

export default Dashboardlayout