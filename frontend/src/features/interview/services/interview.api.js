import axios from "axios"

const api = axios.create({

    baseURL: "http://localhost:3000/",
    withCredentials: true,

})
/**
 * 
 * @description This function generates an interview report based on the user's self-description, job description, and resume. It sends a POST request to the backend API with the provided data and returns the generated report.
 */

export const generateInterviewReport = async ({ selfDescription, jobDescription, resume }) => {

    try {

        const formData = new FormData();
        formData.append('selfDescription', selfDescription);
        formData.append('jobDescription', jobDescription);
        formData.append('resume', resume);

        const response = await api.post("/api/interview/interview", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.interviewReport ?? response.data;

    } catch (err) {
        console.error('Error in generateInterviewReport:', err);
        throw err;
    }



}
/**
 * 
 * @description This function retrieves an interview report by its ID. It sends a GET request to the backend API with the provided interview ID and returns the corresponding report.
 */

export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/interview/${interviewId}`);
        return response.data.interviewReport ?? response.data;
    } catch (err) {
        console.error('Error in getInterviewReportById:', err);
        throw err;
    }
}

/**
 * @description This function retrieves all interview reports for the logged-in user. It sends a GET request to the backend API and returns the list of reports.
 */

export const getAllInterviewReports = async () => {
    try {
        const response = await api.get("/api/interview/interviews");
        return response.data.interviewReports ?? response.data;
    } catch (err) {
        console.error('Error in getAllInterviewReports:', err);
        throw err;
    }
}