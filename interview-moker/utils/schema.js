// // import { primaryKey } from "drizzle-orm/gel-core";
// import { serial, varchar } from "drizzle-orm/mysql-core";
// import { pgTable } from "drizzle-orm/pg-core";
// import { text } from "stream/consumers";

// export const MockInterview = pgTable('mockInterview', {
//     id: serial('id').primaryKey(),
//     jsonMockResp: text('jsonMockResp').notNull(),
//     jobPosition: varchar('jobPosition').notNull(),
//     jobDesc: varchar('jobDesc').notNull(),
//     jobExperience: varchar('jobExperience').notNull(),
//     createdBy: varchar('createdBy').notNull(),
//     createdAt: varchar('createdAt').notNull(),
//     mockId: varchar('mockId').notNull()
// })

import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview',
    {
        id: serial('id').primaryKey(),
        jsonMockResp: text('jsonMockResp').notNull(),
        jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
        jobDesc: varchar('jobDesc', { length: 255 }).notNull(),
        jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
        createdBy: varchar('createdBy', { length: 255 }).notNull(),
        createdAt: varchar('createdAt', { length: 255 }).notNull(),
        mockId: varchar('mockId', { length: 255 }).notNull(),
    })

export const userAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId', { length: 255 }).notNull(),
    question: varchar('question'),
    correctAnswer: text('correctAnswer'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('uerEmail'),
    createdAt: varchar('createdAt'),
})