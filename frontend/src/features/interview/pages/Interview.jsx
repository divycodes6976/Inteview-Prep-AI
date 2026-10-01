import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview.js'
import '../style/interview.scss'

const Interview = () => {
	const [activeSection, setActiveSection] = useState('technical')
	const { interviewId } = useParams()
	const { loading, report, getReportById, getResumePdf } = useInterview()
	const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

	const handleDownloadResume = async () => {
		if (!interviewId || isGeneratingPdf) return
		try {
			setIsGeneratingPdf(true)
			await getResumePdf(interviewId)
		} catch (err) {
			alert('Failed to generate resume PDF. Please try again.')
		} finally {
			setIsGeneratingPdf(false)
		}
	}

	useEffect(() => {
		if (interviewId) getReportById(interviewId)
	}, [interviewId])

	if (loading || !report || (interviewId && report._id !== interviewId)) {
		return (
			<main className="interview-page">
				<section className="interview-shell is-skeleton" aria-busy="true" aria-label="Loading interview report">
					<aside className="interview-sidebar">
						<div className="report-brand">
							<span className="report-brand-mark">AI</span>
							<span>Interview plan</span>
						</div>

						<div className="skeleton-nav">
							<div className="skeleton-bar is-active" />
							<div className="skeleton-bar" />
							<div className="skeleton-bar" />
						</div>

						<div className="sidebar-footer">
							<div className="skeleton-score" />
							<div className="skeleton-btn" />
						</div>
					</aside>

					<section className="interview-content">
						<header className="content-header">
							<div>
								<div className="skeleton-pill" />
								<div className="skeleton-heading" />
							</div>
							<div className="skeleton-badge" />
						</header>

						<div className="content-list">
							<div className="skeleton-card" />
							<div className="skeleton-card" />
							<div className="skeleton-card" />
						</div>
					</section>

					<aside className="interview-insights">
						<div className="skeleton-card skeleton-score-card" />
						<div className="skeleton-card skeleton-skill-card" />
						<div className="skeleton-card skeleton-summary-card" />
					</aside>
				</section>
			</main>
		)
	}

	const questionGroups = {
		technical: { label: 'Technical questions', items: report.technicalQuestions ?? [] },
		behavioral: { label: 'Behavioral questions', items: report.behavioralQuestions ?? [] },
		roadmap: { label: 'Road Map', items: report.preparationPlan ?? [] },
	}
	const activeGroup = questionGroups[activeSection]

	return (
		<main className="interview-page">
			<section className="interview-shell">
				<aside className="interview-sidebar" aria-label="Interview report sections">
					<div className="report-brand">
						<span className="report-brand-mark">AI</span>
						<span>Interview plan</span>
					</div>

					<nav className="report-nav">
						{Object.entries(questionGroups).map(([key, group]) => (
							<button
								className={activeSection === key ? 'is-active' : ''}
								key={key}
								type="button"
								onClick={() => setActiveSection(key)}
							>
								{group.label}
							</button>
						))}
					</nav>

					<div className="sidebar-footer">
						<div className="sidebar-score">
							<span>Profile match</span>
							<strong>{report.matchScore}%</strong>
						</div>

						<button
							className="generate-pdf-btn"
							type="button"
							onClick={handleDownloadResume}
							disabled={isGeneratingPdf}
						>
							{isGeneratingPdf ? (
								<>
									<span className="pdf-spinner" aria-hidden="true" />
									<span>Generating PDF...</span>
								</>
							) : (
								<>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="7 10 12 15 17 10" />
										<line x1="12" y1="15" x2="12" y2="3" />
									</svg>
									<span>Generate Resume PDF</span>
								</>
							)}
						</button>
					</div>
				</aside>

				<section className="interview-content">
					<header className="content-header">
						<div>
							<span className="eyebrow">Personalized interview strategy</span>
							<h1>{activeGroup.label}</h1>
						</div>
						<span className="question-count">{activeGroup.items.length} items</span>
					</header>

					<div className="content-list">
						{activeSection === 'roadmap'
							? activeGroup.items.map((item) => (
									<article className="roadmap-card" key={item.day}>
										<span className="roadmap-day">Day {item.day}</span>
										<h2>{item.focus}</h2>
										<ul>
											{item.tasks.map((task) => <li key={task}>{task}</li>)}
										</ul>
									</article>
								))
							: activeGroup.items.map((item, index) => (
									<article className="question-card" key={item.question}>
										<div className="question-number">0{index + 1}</div>
										<div>
											<h2>{item.question}</h2>
											<p className="question-intention"><strong>What this tests</strong>{item.intention}</p>
											<p className="answer-label">Suggested answer</p>
											<p className="answer-text">{item.answer}</p>
										</div>
									</article>
								))}
					</div>
				</section>

				<aside className="interview-insights">
					<div className="score-card">
						<span>Match score</span>
						<strong>{report.matchScore}%</strong>
						<div className="score-track"><span style={{ width: `${report.matchScore}%` }} /></div>
						<small>Strong foundation for this role</small>
					</div>

					<section className="insight-section">
						<h2>Skill Gaps</h2>
						<div className="skill-list">
							{report.skillGaps.map((gap) => (
								<span className={`skill-tag ${gap.severity}`} key={gap.skill}>{gap.skill}</span>
							))}
						</div>
					</section>

					<section className="insight-section insight-summary">
						<h2>Preparation focus</h2>
						<p>Build confidence through practical testing, advanced state management, and security review.</p>
					</section>
				</aside>
			</section>
		</main>
	)
}

export default Interview
