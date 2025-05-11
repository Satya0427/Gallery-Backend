import express from 'express';   // Node.js framwork for routing,controllers
import cors from 'cors';         // To enable the cors origen
import helmet from 'helmet';     // Security middleware for HTTP headers
import morgan from 'morgan';     // HTTP request logger middlewaressre
import dotenv from 'dotenv';

import { router } from './router'; // Import the router


import {mySqlHelpers} from './helper/mysql-helper'; // MySQL helpers for database connection

dotenv.config();
const app = express(); // Create an instance of express
app.use(express.json()); // Parse JSON request bodies
const PORT = process.env.PORT || 3000; // Set the port for the server

app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Use helmet for security
app.use(morgan('dev')); // Use morgan for logging HTTP requests
app.use(express.json()); // Parse JSON request bodies

app.use('/api', router);
app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
  mySqlHelpers.establishingConnection(); // Establish MySQL connection
})

