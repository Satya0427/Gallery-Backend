"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Node.js framwork for routing,controllers
const cors_1 = __importDefault(require("cors")); // To enable the cors origen
const helmet_1 = __importDefault(require("helmet")); // Security middleware for HTTP headers
const morgan_1 = __importDefault(require("morgan")); // HTTP request logger middlewaressre
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = require("./router"); // Import the router
const mysql_helper_1 = require("./helper/mysql-helper"); // MySQL helpers for database connection
dotenv_1.default.config();
const app = (0, express_1.default)(); // Create an instance of express
app.use(express_1.default.json()); // Parse JSON request bodies
const PORT = process.env.PORT || 3000; // Set the port for the server
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use((0, helmet_1.default)()); // Use helmet for security
app.use((0, morgan_1.default)('dev')); // Use morgan for logging HTTP requests
app.use(express_1.default.json()); // Parse JSON request bodies
app.use('/api', router_1.router);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mysql_helper_1.mySqlHelpers.establishingConnection(); // Establish MySQL connection
});
//# sourceMappingURL=app.js.map