const express = require('express');
const { authorize } = require('../middleware/auth.middleware.js');
const {
	interviewController,
	getInterviewReportById,
	getAllInterviewReportsOfUser,
} = require('../controller/interview.controller.js');

const upload = require('../middleware/file.middlware.js');


const interviewRouter = express.Router();
//generate the interview report based on user self description, job description and resume
interviewRouter.post('/interview', authorize, upload.single("resume"), interviewController);


//  get interview  by interview id
interviewRouter.get('/interview/:interviewId', authorize, getInterviewReportById)

// get all interview reports of logged in user
interviewRouter.get('/interviews', authorize, getAllInterviewReportsOfUser)
module.exports = interviewRouter;