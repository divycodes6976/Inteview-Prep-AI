const ResumeDropzone = ({ fileName, onFileChange, onDrop }) => {
  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) onDrop?.(file)
  }

  return (
    <div className="resume-block">
      <label className="resume-label" htmlFor="resume">
        Upload Resume <span className="best-results">(Best Results)</span>
      </label>

      <label
        className="dropzone"
        htmlFor="resume"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
        />
        <span className="dropzone-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 16V7" />
            <path d="M8.5 10.5 12 7l3.5 3.5" />
            <path d="M5 16.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5" />
          </svg>
        </span>
        <strong>{fileName || 'Click to upload or drag & drop'}</strong>
        <span className="dropzone-hint">PDF or DOCX (Max 5MB)</span>
      </label>
    </div>
  )
}

export default ResumeDropzone
