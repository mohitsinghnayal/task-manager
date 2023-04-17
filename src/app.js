require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require('express')
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express()

require('./db/mongoose')

const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')

app.use(
    cors({
        origin: "*",
    })
);
app.use(bodyparser.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/task', taskRouter);

module.exports = app