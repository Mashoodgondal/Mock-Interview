import { useRouter } from 'next/router'
import React from 'react'

const InterviewCard = ({ interview }) => {
    const router = useRouter()
    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId)
    }
    return (
        <div className='border border-gray-400 rounded-md p-3'>
            <h2>{interview?.jobPosition}</h2>
            <h2>{interview?.jobExperience} Years of Experience</h2>
            <h2>Created At {interview.createdAt}</h2>
            <div className='flex items-center justify-between gap-2'>
                <button className='border border-gray-200 w-full'>Feedback</button>
                <button onClick={onStart} className='border border-gray-200 w-full'>Start</button>

            </div>
        </div>
    )
}

export default InterviewCard