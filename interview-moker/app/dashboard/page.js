import React from 'react'
import NewInterview from './_components/addNewInterview'
import InterviewList from './_components/interviewList'


const Dashboard = () => {
  return (

    <div className="p-10 bg-transparent min-h-screen">
      <h1 className="font-bold text-2xl text-white dark:text-amber-200">Dashboard</h1>
      <h2 className="text-white dark:text-amber-100">Create and start your AI Interview</h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3">
        <NewInterview />

      </div>
      <InterviewList />
    </div>


  )
}

export default Dashboard