const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const z = require("zod");
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score of candidate's profile suitability for the job, ranging from 0 to 100."),
    technicalquestions: z.array(z.object({
        question: z.string().describe("The technical question which can be asked by the interviewer in the interview."),
        intention: z.string().describe("The intention behind the technical question, explaining what the interviewer is trying to assess."),
        answer: z.string().describe("The candidate's answer to the technical question what points to covering the key concepts."),
    })).describe("An array of technical questions, each with its intention and the candidate's answer."),
    behavioralquestions: z.array(z.object({
        question: z.string().describe("The behavioral question which can be asked by the interviewer in the interview."),
        intention: z.string().describe("The intention behind the behavioral question, explaining what the interviewer is trying to assess."),
        answer: z.string().describe("The candidate's answer to the behavioral question."),
    })).describe("An array of behavioral questions, each with its intention and the candidate's answer."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill that the candidate is lacking or needs improvement in based on the job description."),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity level of the skill gap, indicating how critical it is for the candidate to improve this skill."),
    })).describe("An array of skill gaps identified in the candidate, each with its severity level."),
    preparationPlan: z.array(z.object({
        day: z.number().int().min(1).describe("The day number in the preparation plan, indicating the sequence of preparation."),
        focus: z.string().describe("The main focus or topic for the preparation on that specific day."),
        tasks: z.array(z.string()).describe("A list of specific tasks or activities that the candidate should undertake on that day to prepare for the interview."),



    })).describe("An array of preparation plan items, each detailing the day, focus, and tasks for the candidate's interview preparation."),
    title:z.string().describe("The title of the interview report, summarizing the overall assessment and recommendations for the candidate."),


})




async function geneateAIResponse({resume,selfDescription,jobDescription}){
   
     const prompt = `Based on the following information, generate an interview report:
     - Resume: ${resume}
     - Self Description: ${selfDescription}
     - Job Description: ${jobDescription}`;
       
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:prompt,
        config:{
                responseMimeType:"application/json",
                responseJsonSchema: z.toJSONSchema(interviewReportSchema),
        }
      })
    return JSON.parse(response.text);
}

module.exports = geneateAIResponse;