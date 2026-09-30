const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const z = require("zod");
const puppeteer = require("puppeteer");
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
    title: z.string().describe("The title of the interview report, summarizing the overall assessment and recommendations for the candidate."),


})




async function geneateAIResponse({ resume, selfDescription, jobDescription }) {

    const prompt = `Based on the following information, generate an interview report:
     - Resume: ${resume}
     - Self Description: ${selfDescription}
     - Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema),
        }
    })
    return JSON.parse(response.text);
}



async function generatedPDFFromHtml(htmlContent) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--single-process'
            ]
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true 
        });

        return pdfBuffer;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// ai se html content create krrha rhe for puppeteer to generate pdf from html content
async function generateResumePdf({ resume, selfDescription, jobDescription }) {


    const resumePdfSchema = z.object({

        html: z.string().describe("The HTML content of the resume, which can be used to generate a PDF version of the resume with the help of puppeteer."),


    })

    const prompt = `
You are an expert professional resume designer and ATS-friendly HTML/CSS developer.

Generate a professional, realistic, single-page software engineering resume in HTML using the following dynamic inputs:

- Resume Content: ${resume}
- Self Description: ${selfDescription}
- Job Description: ${jobDescription}

IMPORTANT:
The provided Resume Content, Self Description, and Job Description are the ONLY sources for the resume content.

Do not hardcode, assume, invent, or copy any candidate-specific information into the HTML.

The resume will be converted into an A4 PDF using Puppeteer.

==================================================
DESIGN REFERENCE
==================================================

Use the structure and visual style of a modern professional software-engineering resume.

The desired format is:

- Clean single-column layout
- Professional and realistic
- Minimal and recruiter-friendly
- Strong typography hierarchy
- Compact header
- Clear section headings
- Thin subtle section dividers
- Consistent spacing
- Right-aligned dates where appropriate
- Compact technology stacks beside project names
- Clean bullet points
- Minimal visual decoration
- White background
- Dark professional text
- Subtle gray divider lines

The output should look like a real developer resume, NOT a portfolio website, dashboard, landing page, or AI-generated design.

Do not use:
- Profile photo
- Sidebar
- Cards
- Gradients
- Skill bars
- Progress bars
- Large colored sections
- Decorative graphics
- Excessive icons
- Large empty boxes
- Portfolio-style UI

==================================================
CONTENT STRUCTURE
==================================================

Determine the appropriate sections from the provided Resume Content.

Prefer this ordering when those sections exist:

1. Header / Contact Information
2. Education
3. Experience
4. Projects
5. Technical Skills
6. Achievements
7. Certifications

Do not create sections that have no relevant information.

Do not invent missing sections.

==================================================
HEADER
==================================================

Create a compact professional resume header.

Display the available information such as:

- Name
- Location
- Phone
- Email
- LinkedIn
- GitHub

The candidate name should be prominent but not oversized.

Use approximately 24px to 27px for the name.

Keep contact information compact and preferably on one line.

Use clickable links where URLs are available.

Do not invent URLs.

==================================================
EDUCATION
==================================================

Format education entries professionally.

Use a clean structure with:

Institution / Degree / Program / Academic details / Dates

Align dates to the right where appropriate.

Keep education compact and avoid unnecessary whitespace.

Preserve all academic information exactly from the provided Resume Content.

==================================================
EXPERIENCE
==================================================

For each experience entry show:

Role / Position
Company
Dates

Then use concise bullet points.

Use approximately 3 to 5 bullets when enough information exists.

Prioritize actual technical work, responsibilities, technologies, architecture, performance improvements, and measurable results present in the source.

Do not invent responsibilities or achievements.

==================================================
PROJECTS
==================================================

For each project show:

Project Name | Technology Stack

Place GitHub / Live links on the right when actual links are available.

Use 2 to 4 concise bullet points per project when enough information exists.

Keep project descriptions technical and realistic.

Do not turn project descriptions into marketing copy.

Do not invent GitHub or Live URLs.

==================================================
TECHNICAL SKILLS
==================================================

Create a compact ATS-friendly skills section.

Group skills into appropriate categories based ONLY on the provided Resume Content.

For example, categories may include:

Languages
Core CS
Frontend
Backend
Databases
Tools

Only use categories and technologies that are actually supported by the input.

Do not add skills from the Job Description unless the Resume Content or Self Description confirms that the candidate has them.

==================================================
JOB DESCRIPTION TAILORING
==================================================

Use the Job Description to determine which existing candidate skills, experiences, projects, and achievements should receive more emphasis.

You may:

- Reorder relevant content
- Improve wording
- Prioritize relevant technologies
- Make relevant experience more prominent
- Use relevant keywords when supported by the candidate's information

You must NOT:

- Invent experience
- Add unsupported technologies
- Add fake projects
- Add fake achievements
- Add fake metrics
- Claim experience only because a technology appears in the Job Description

==================================================
WRITING STYLE
==================================================

Write like a professional software engineer's resume.

Use concise, natural bullet points.

Prefer clear engineering verbs such as:

Built
Developed
Implemented
Designed
Integrated
Optimized
Tested
Deployed
Automated
Architected

Avoid exaggerated or artificial language.

Do not use unnecessary phrases such as:

"passionate developer"
"highly motivated"
"results-driven professional"
"dynamic individual"
"proven track record"

unless they are explicitly supported and useful.

Do not force metrics into every bullet.

==================================================
VISUAL STYLE
==================================================

Use a professional resume font stack:

Arial, Helvetica, Calibri, sans-serif

Recommended approximate sizes:

Name: 24px to 27px
Section headings: 13px to 15px
Experience/project titles: 10.5px to 12px
Body text: 9.5px to 10px
Dates: 9px to 9.5px

Use bold text for hierarchy.

Do not make the entire resume bold.

Use subtle horizontal rules below section headings.

Maintain consistent spacing throughout the document.

==================================================
A4 PAGE DESIGN
==================================================

The resume will be printed using Puppeteer.

Use:

@page {
    size: A4;
    margin: 0;
}

Create an A4-compatible resume container.

Use approximately:

- 15mm to 17mm horizontal padding
- 12mm to 15mm top padding

The resume should preferably fit on one A4 page.

Use the page efficiently.

Avoid:
- Excessive margins
- Excessive line spacing
- Large blank areas
- Unnecessary section spacing

At the same time, do not make the resume unnaturally compressed.

The final page should have balanced whitespace similar to a professionally typeset resume.

Do not add fake content just to fill space.

==================================================
ATS COMPATIBILITY
==================================================

Use:

- Normal HTML text
- Semantic headings
- Standard unordered lists
- Standard section names
- One-column structure
- Simple CSS

Avoid:

- Text inside images
- Canvas
- SVG text
- Complex tables for the main layout
- Important information represented only through icons
- Skill bars
- Progress indicators
- Decorative graphics

==================================================
PUPPETEER COMPATIBILITY
==================================================

The HTML must work directly with Puppeteer.

Include:

- A4 @page configuration
- box-sizing: border-box
- print-friendly CSS
- page-break-inside: avoid
- break-inside: avoid

Do not require:

- React
- Tailwind
- JavaScript
- External CSS frameworks
- External fonts
- External images

All important styling must be contained inside the HTML document.

==================================================
LINK HANDLING
==================================================

Use normal HTML anchor tags for available:

- Email
- Phone
- LinkedIn
- GitHub
- Project GitHub
- Live project

Only create links when the actual URL is present in the input.

Never invent URLs.

==================================================
HTML REQUIREMENTS
==================================================

Return a complete valid HTML document containing:

DOCTYPE
html
head
meta
style
body

The HTML must be directly usable by Puppeteer.

All HTML tags must be properly closed.

CSS must be valid.

==================================================
FINAL RESPONSE FORMAT
==================================================

Return ONLY a valid JSON object with exactly one property:

{
  "html": "complete HTML document"
}

Do not return Markdown.

Do not use Markdown code fences.

Do not add explanations outside the JSON.

Do not add additional JSON properties.

Before returning the result, verify internally that:

- The HTML is valid.
- All tags are closed.
- CSS is valid.
- The layout is A4 compatible.
- The resume is professional and realistic.
- The content comes only from the provided inputs.
- No candidate-specific information has been invented.
- The format is clean, compact, and ATS-friendly.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumePdfSchema),
        }
    })
    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatedPDFFromHtml(jsonContent.html);
    return pdfBuffer;
}





module.exports = { geneateAIResponse, generatedPDFFromHtml, generateResumePdf };