import ResumeDropzone from './ResumeDropzone.jsx'

const ProfilePanel = ({
  fileName,
  onFileChange,
  onDrop,
  selfDescription,
  onSelfDescriptionChange,
}) => {
  return (
    <section className="profile-panel">
      <div className="panel-heading">
        <div className="panel-title">
          <span className="panel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
            </svg>
          </span>
          <h2>Your Profile</h2>
        </div>
      </div>

      <ResumeDropzone
        fileName={fileName}
        onFileChange={onFileChange}
        onDrop={onDrop}
      />

      <div className="or-divider">
        <span>OR</span>
      </div>

      <div className="self-description">
        <label htmlFor="selfDescription">Quick Self-Description</label>
        <textarea
          id="selfDescription"
          name="selfDescription"
          value={selfDescription}
          onChange={onSelfDescriptionChange}
          placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
        />
      </div>

      <p className="profile-hint">
        <span className="hint-dot" aria-hidden="true" />
        <span>
          Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
          required to generate a personalized plan.
        </span>
      </p>
    </section>
  )
}

export default ProfilePanel
