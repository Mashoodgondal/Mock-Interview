"user client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'

const InterviewList = () => {
    const user = useUser()
    const [interviewList, setinterviewList] = useState([])
    useEffect(() => {
        user && GetIntervewList()
    }, [user])
    const GetIntervewList = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.email))
            .orderBy(desc(MockInterview.id))
        console.log(result);
        setinterviewList(result)

    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Previous Interviews</h2>
        </div>
    )
}

export default InterviewList