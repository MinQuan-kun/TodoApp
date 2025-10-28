import express from 'express'
import taskRoute from './routes/taskRouters.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/tasks",taskRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log("server bat dau tren cong " + PORT);
    });
})
