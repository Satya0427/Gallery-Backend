"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
class mySqlHelper {
    constructor() {
        this.establishingConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.pool.getConnection();
                console.log('DB Connected Successfully');
                connection.release(); // Always release the connection
            }
            catch (err) {
                console.log('DB Connection Failed:', err);
            }
        });
        this.exicuteWithQueryParams = (mySqlQuery, params, mySqlCallback) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.pool.getConnection();
                if (connection) {
                    connection.query(mySqlQuery, params, (err, result) => {
                        if (err) {
                            console.log('Error exicuting query');
                        }
                        else {
                            mySqlCallback(result);
                            connection.release();
                        }
                    });
                }
            }
            catch (error) {
                console.log('Catch block error in exicuteWithQueryParams() ', error);
            }
        });
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
}
