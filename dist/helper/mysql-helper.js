"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySqlHelpers = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class mySqlHelper {
    pool;
    constructor() {
        this.pool = promise_1.default.createPool({
            host: 'localhost', // Database host
            user: 'root', // Database user
            password: '14404M060@mani',
            port: 3306, // Database port
            database: 'gallery_db', // Database name
            waitForConnections: true,
            connectionLimit: 10, // max concurrent connections
            queueLimit: 0 // no limit on queued connection requests
        });
    }
    establishingConnection = async () => {
        try {
            const connection = await this.pool.getConnection();
            console.log('DB Connected Successfully');
            connection.release(); // Always release the connection
        }
        catch (err) {
            console.log('DB Connection Failed:', err);
        }
    };
    exicuteWithQueryParams = async (mySqlQuery, params) => {
        try {
            const connection = await this.pool.getConnection();
            try {
                const [rows] = await connection.query(mySqlQuery, params);
                console.log(rows);
                return rows;
            }
            finally {
                connection.release();
            }
        }
        catch (error) {
            throw error;
        }
    };
}
exports.mySqlHelpers = new mySqlHelper();
//# sourceMappingURL=mysql-helper.js.map