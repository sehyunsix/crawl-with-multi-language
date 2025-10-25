import type { Job } from "./type.js";
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
          INSERT INTO jobs 
          ( url, title, company_name, 
            job_type, region_text, department, job_description, 
            preferred_qualifications, require_experience, 
            apply_start_date, apply_end_date, raw_jobs_text,
            requirements,
            favicon, is_public, job_valid_type
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          company_name = VALUES(company_name),
          job_type = VALUES(job_type),
          region_text = VALUES(region_text),
          department = VALUES(department),
          job_description = VALUES(job_description),
          job_valid_type= VALUES(job_valid_type),
          preferred_qualifications = VALUES(preferred_qualifications),
          require_experience = VALUES(require_experience),
          apply_start_date = VALUES(apply_start_date),
          apply_end_date = VALUES(apply_end_date),
          raw_jobs_text = VALUES(raw_jobs_text),
          requirements = VALUES(requirements),
          favicon = VALUES(favicon),
          is_public = VALUES(is_public),
          job_valid_type = VALUES(job_valid_type)
          `;

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
      job.requirements,
      job.favicon,
      1, // is_public
      0, // job_valid_type
    ]);
  }
  bar.stop();
  await connection.end();
}

export default saveJobsToDatabase;
