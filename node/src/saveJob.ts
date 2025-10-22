import mysql from 'mysql2/promise';
import { Job } from '../model/job.js';
import { DatabaseConfig } from '../config/databaseConfig.js';

export async function saveJobsToDatabase(jobs: Job[], dbConfig: DatabaseConfig) {
    const connection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    });

    const insertJobQuery = `
        INSERT INTO jobs 
        (title, company, job_type, region, department, job_description, preferred_qualifications, require_experience, apply_start_date, apply_end_date, raw_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const job of jobs) {
        await connection.execute(insertJobQuery, [
            job.title,
            job.company,
            job.jobType,
            job.region,
            job.department,
            job.jobDescription,
            job.preferredQualifications,
            job.requireExperience,
            job.applyStartDate,
            job.applyEndDate,
            job.rawJobsText,
        ]);
    }

    await connection.end();
}