import { promises } from 'dns';
import mysql from 'mysql2/promise';

class mySqlHelper {
    pool: any
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost', // Database host
            user: 'root', // Database user
            password: '14404M060@mani',
            port: 3306, // Database port
            database: 'gallery_db', // Database name
            waitForConnections: true,
            connectionLimit: 10, // max concurrent connections
            queueLimit: 0        // no limit on queued connection requests
        })
    }

    public establishingConnection = async (): Promise<void> => {
        try {
            const connection = await this.pool.getConnection();
            console.log('DB Connected Successfully');
            connection.release(); // Always release the connection
        } catch (err) {
            console.log('DB Connection Failed:', err);
        }
    }

    public exicuteWithQueryParams = async (mySqlQuery: string, params: any): Promise<any> => {
        try {
            const connection = await this.pool.getConnection();
            try {
                const [rows] = await connection.query(mySqlQuery, params);
                console.log(rows);
                return rows;
            } finally {
                connection.release();
            }
        } catch (error) {
            throw error;
        }
    }

} export const mySqlHelpers = new mySqlHelper();