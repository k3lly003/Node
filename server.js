import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Router from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Router2 from './Employee/Routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swagger from './docs/swagger.json' assert {type:"json"}
// import swagger2 from './docs/swagger2.json'assert{type:"json"}





// Initialize express app
const app = express();

const  corsOptions = {
    allowedHeaders: ["Authorization", "Content-Type" ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    origin: "*",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const filePath = path.join('C:', 'Users', 'lenovo', 'Documents', 'IRO-website-bn', 'client-index.html');
// console.log(path.resolve(__dirname, 'client-index.html'));
// console.log(filePath);

// Middleware
app.use(cors());
app.use(express.json()); 
app.use('/api/Inventory', Router);
app.use('/api/Employee', Router2);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger2));

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Check if MONGO_URI is defined
        if (!process.env.MONGO_URI) {
            throw new Error(`MONGO_URI environment variable is not defined`);
        }

        // Attempt to connect to MongoDB without deprecated options
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`\x1b[32m%s\x1b[0m`, `MongoDB connected successfully`);
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

connectDB();

// Serve static files or a home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client-index.html");
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// export default { io };
