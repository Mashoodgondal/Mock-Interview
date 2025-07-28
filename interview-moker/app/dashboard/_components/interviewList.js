import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect } from 'react'

const InterviewList = () => {
    useEffect(() => {
        user && GetIntervewList()
    }, [user])
    const user = useUser()
    const GetIntervewList = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.email))
            .orderBy(desc(MockInterview.id))
    }
    return (
        <div>
            <h2 className='text-2xl font-semibold'>Previous Interviews</h2>
        </div>
    )
}

export default InterviewList