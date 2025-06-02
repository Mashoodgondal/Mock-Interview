import React from 'react'
import NewInterview from './_components/addNewInterview'

const Dashboard = () => {
  return (
    <div className='p-10'>

      <h1 className='font-bold text-2xl'>Dashboard</h1>
      <h2 className='text-gray-700'>Create and start you AI Interview</h2>

      <div className=' mt-3 grid grid-cols-1 md:grid-cols-3'>

        <NewInterview />
      </div>


    </div>
  )
}

export default Dashboard