import { useContext } from "react";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf } from "../services/interview.api.js"
import { InterviewContext } from "../interview.context.jsx";

// custom hook bnaaya hai 
export const useInterview = () => {

    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

const {loading, setLoading, report, setReport, reports, setReports} = context;


const generateReport = async({selfDescription, jobDescription, resumeFile}) => {
setLoading(true);
    try{
    
    const response = await generateInterviewReport({selfDescription, jobDescription, resume:resumeFile});
    setReport(response);
    return response;


}catch(error){
    console.error("Error generating report:", error);
    throw error;
}finally{
    setLoading(false);
}

}


const getReportById = async(interviewId) => {
    setLoading(true);
    try{
        const response = await getInterviewReportById(interviewId);
        setReport(response);
        return response;

    }catch(error){
        console.error("Error fetching report by ID:", error);
        throw error;
    }finally{
        setLoading(false);
    }

}

const getAllReports = async() => {
    setLoading(true);
    try{
        const response = await getAllInterviewReports();
        setReports(response);
        return response;
    }catch(error){
        console.error("Error fetching all reports:", error);
        throw error;
    }finally{
        setLoading(false);
    }

}

const getResumePdf = async(interviewId)=>{
    try{
        const response = await generateResumePdf({interviewId});
       
        const blob = response instanceof Blob ? response : new Blob([response], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `resume_${interviewId}.pdf`);

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }catch(error){
        console.error("Error generating resume pdf:", error);
        throw error;
    }
}

return  {loading, report, reports, generateReport, getReportById, getAllReports,getResumePdf};

}

