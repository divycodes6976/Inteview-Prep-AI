const {generatePDFFromHtml, geneateAIResponse,generateResumePdf} = require('../services/ai.service.js');
const interviewReportModel = require('../models/interviewReport.model.js');
const { PDFParse } = require('pdf-parse');

// controller to generate interview report based on user self description, job description and resume
const interviewController = async (req, res) => {
    try {
        // Your interview logic here

    const resumeContent = req.file
        ? await (new PDFParse(Uint8Array.from(req.file.buffer))).getText()
        : { text: '' };


        const {selfDescription, jobDescription} = req.body; // Access self-description and job description from the request body

        // Call the AI service to generate the interview report

        const interviewReportByAI = await geneateAIResponse({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
           user: req.user.id,
              resumeText: resumeContent.text,
              selfDescription,
              jobDescription,
              ...interviewReportByAI,
              technicalQuestions: interviewReportByAI.technicalquestions,
              behavioralQuestions: interviewReportByAI.behavioralquestions,


        })
    
        res.status(200).json({ message: 'Interview report generated successfully', interviewReport });


       
    } catch (error) {
        console.error('Error in interview controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

// controller to get interview report by interview id

const getInterviewReportById = async (req, res) => {
    try{
        const {interviewId}=req.params;


        const interviewReport= await interviewReportModel.findById({_id:interviewId})
      if(!interviewReport){
        return res.status(404).json({message:"Interview report not found"});

      }
      
        res.status(200).json({ message: 'Interview report retrieved successfully', interviewReport });

    }catch(err){
        console.error('Error in getInterviewReportById controller:', err);
        res.status(500).json({ message: 'Internal server error' });

    }



}

// controller to get all interview reports of logged in user

const getAllInterviewReportsOfUser = async (req, res) => {
    try{
        const userId=req.user.id;
        const interviewReports= await interviewReportModel.find({user:userId}).sort({createdAt:-1}).select("-resumeText -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");



        res.status(200).json({ message: 'Interview reports retrieved successfully', interviewReports });

    }catch(err){
        console.error('Error in getAllInterviewReportsOfUser controller:', err);
        res.status(500).json({ message: 'Internal server error' });
    }



    }


    // controller to generate pdf from html content
    const generatePdfFromHtmlController = async (req, res) => {
        try {
            const { interviewId } = req.params;

            const interviewReport = await interviewReportModel.findById({ _id: interviewId });
            if (!interviewReport) {
                return res.status(404).json({ message: "Interview report not found" });
            }

            const { resumeText, selfDescription, jobDescription } = interviewReport;

            const pdfBuffer = await generateResumePdf({ resume: resumeText, selfDescription, jobDescription });

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=resume.pdf',
            });
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error in generatePdfFromHtmlController:', error);
            res.status(500).json({ 
                message: 'Failed to generate PDF', 
                error: error.message 
            });
        }
    }


module.exports = {
    interviewController,
    getInterviewReportById,
    getAllInterviewReportsOfUser,
    generatePdfFromHtmlController,
};
