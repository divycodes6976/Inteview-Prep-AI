const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.routes.js');
const app=express();
const connectDB = require('./db.js');
const interviewRouter = require('./routes/interview.routes.js');

const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const port=3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

connectDB();

app.use("/api/interview",interviewRouter)

app.use("/api/auth",authRouter)

app.listen(port,()=>{   

    console.log(`Server is running on port ${port}`)    


})