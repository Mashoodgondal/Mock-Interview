import React from 'react'
import NewInterview from './_components/addNewInterview'
import MeshBackground from './_components/ventaWreper/page'

const Dashboard = () => {
  return (

    <div className="p-10 bg-transparent min-h-screen">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Dashboard</h1>
      <h2 className="text-gray-700 dark:text-gray-300">Create and start your AI Interview</h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3">
        <NewInterview />
      </div>
    </div>


  )
}

export default Dashboard