import type { Job } from "../shared/base.js";
import mysql from "mysql2/promise";
import dbConfig from "../config/databaseConfig.js";
import cliProgress from "cli-progress";

const bar = new cliProgress.SingleBar(
  {
    format: "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  },
  cliProgress.Presets.shades_classic,
);

async function saveJobsToDatabase(jobs: Job[]) {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });

  const insertJobQuery = `
          INSERT IGNORE INTO jobs 
          ( url, title, company_name, 
            job_type, region_text, department, job_description, 
            preferred_qualifications, require_experience, 
            apply_start_date, apply_end_date, raw_jobs_text,
            is_public
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;
  bar.start(jobs.length, 0);
  let i = 0;
  for (const job of jobs) {
    bar.update(i++);
    const results = await connection.execute(insertJobQuery, [
      job.url,
      job.title,
      job.company,
      job.jobType,
      job.regionText,
      job.department,
      job.jobDescription,
      job.preferredQualifications,
      job.requireExperience,
      job.applyStartDate,
      job.applyEndDate,
      job.rawJobsText,
      0,
    ]);
  }
  bar.stop();
  await connection.end();
}

export default saveJobsToDatabase;
