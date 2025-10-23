import dotenv from 'dotenv';
dotenv.config();

class DatabaseConfig{
    host: string;
    user: string;
    password: string;
    database: string;

    constructor(){
        this.host = process.env.DB_HOST || 'localhost';
        this.user = process.env.DB_USER || 'root';
        this.password = process.env.DB_PASSWORD || '';
        this.database = process.env.DB_NAME ||'jobs_db';
    }

}

const databaseConfig = new DatabaseConfig();
export default databaseConfig