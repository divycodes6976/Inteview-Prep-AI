const PlanCardFooter = ({ onGenerate, loading }) => {
  return (
    <footer className="plan-footer">
      <p className="footer-note">AI-Powered Strategy Generation • Approx 30s</p>
      <button type="button" className="generate-btn" onClick={onGenerate} disabled={loading}>
        <span className="sparkle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l1.2 5.2L18 9.5l-4.8 1.3L12 16l-1.2-5.2L6 9.5l4.8-1.3L12 3z" />
            <path d="M18.5 14l.6 2.3 2.4.6-2.4.6-.6 2.3-.6-2.3-2.4-.6 2.4-.6.6-2.3z" />
          </svg>
        </span>
        {loading ? 'Generating...' : 'Generate My Interview Strategy'}
      </button>
    </footer>
  )
}

export default PlanCardFooter
