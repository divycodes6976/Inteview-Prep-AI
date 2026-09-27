import { useEffect, useState } from 'react'
import InterviewHero from '../components/InterviewHero.jsx'
import JobDescriptionPanel from '../components/JobDescriptionPanel.jsx'
import ProfilePanel from '../components/ProfilePanel.jsx'
import PlanCardFooter from '../components/PlanCardFooter.jsx'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import {useNavigate} from "react-router-dom"
const MAX_JOB_CHARS = 5000

const Home = () => {
    const{loading,generateReport,reports,getAllReports} = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [fileName, setFileName] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    getAllReports()
  }, [])

  const handleFile = (file) => {
    if (file) {
      setFileName(file.name)
      setResumeFile(file)
    }
  }

  const handleGenerateReport = async () => {
    if (!jobDescription || (!selfDescription && !resumeFile)) {
      alert('Please add a job description and either a resume or self-description.')
      return 
    }

    try {
      const data = await generateReport({ selfDescription, jobDescription, resumeFile })
      navigate(`/interview/${data._id}`)
    } catch (error) {
      alert('Unable to generate the interview plan. Please try again.')
    }

  }
  if(loading){
    return <div>Loading your interview Plan...</div>
  }

  return (
    <main className="home-page">
      <InterviewHero />

      <section className="plan-card">
        <div className="plan-grid">
          <JobDescriptionPanel
            value={jobDescription}
            maxLength={MAX_JOB_CHARS}
            onChange={(event) => setJobDescription(event.target.value)}
          />
          <ProfilePanel
            fileName={fileName}
            onFileChange={(event) => handleFile(event.target.files?.[0])}
            onDrop={handleFile}
            selfDescription={selfDescription}
            onSelfDescriptionChange={(event) => setSelfDescription(event.target.value)}
          />
        </div>
        
        <PlanCardFooter onGenerate={handleGenerateReport} loading={loading} />
         {/*recent report list*/}
        {reports.length > 0 && (
          <div className="recent-reports">
            <h2>Recent Reports</h2>
            <ul>
              {reports.map((report) => (
                <li key={report._id}>
                  <button onClick={() => navigate(`/interview/${report._id}`)}>
                    <span>{report.title || `Report ${report._id}`}</span>
                    <strong>{report.matchScore ?? 'N/A'}{report.matchScore != null && '%'}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
