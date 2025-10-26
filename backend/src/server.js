import express from 'express'
import taskRoute from './routes/taskRouters.js';

const app = express();

app.use("/api/tasks",taskRoute);

app.listen(5001, () => {
    console.log("Dang chay cong 5001")
});

