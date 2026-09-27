const JobDescriptionPanel = ({ value, onChange, maxLength }) => {
  const count = value?.length ?? 0

  return (
    <section className="job-panel">
      <div className="panel-heading">
        <div className="panel-title">
          <span className="panel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </span>
          <h2>Target Job Description</h2>
        </div>
        <span className="required-badge">Required</span>
      </div>

      <div className="job-field">
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
        />
        <span className="char-count">
          {count} / {maxLength} chars
        </span>
      </div>
    </section>
  )
}

export default JobDescriptionPanel
