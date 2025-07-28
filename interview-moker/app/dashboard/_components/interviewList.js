


"use client";

import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewCard from './interviewCard';
// import { index } from 'drizzle-orm/gel-core';


const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(MockInterview.id));
        console.log(result);
        setInterviewList(result);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold">Previous Interviews</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-3'>
                {interviewList && interviewList.map((interview, index) => (

                    <InterviewCard
                        interview={interview}
                        key={index} />

                ))}
            </div>
            {/* You can loop interviewList here */}
        </div>
    );
};

export default InterviewList;
