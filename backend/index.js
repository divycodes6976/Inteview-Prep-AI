const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.routes.js');
const app=express();
const connectDB = require('./db.js');
const interviewRouter = require('./routes/interview.routes.js');

const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'https://inteview-prep-ai.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

connectDB();

app.use("/api/interview",interviewRouter)

app.use("/api/auth",authRouter)

app.listen(port,()=>{   

    console.log(`Server is running on port ${port}`)    


})