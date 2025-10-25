import '../styles/ValidationModal.css';
import { validatePortfolio, checkAccessibility } from '../utils/validator';

export default function ValidationModal({ portfolio, onConfirm, onCancel }) {
  
  const { errors, warnings } = validatePortfolio(portfolio);
  const a11yIssues = checkAccessibility(portfolio);

  const hasIssues = errors.length > 0 || warnings.length > 0 || a11yIssues.length > 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Pre-Export Checklist</h2>

        {errors.length > 0 && (
          <div className="validation-section error-section">
            <h3>❌ Errors (Fix before export)</h3>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="validation-section warning-section">
            <h3>⚠️ Warnings (Recommended)</h3>
            <ul>
              {warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {a11yIssues.length > 0 && (
          <div className="validation-section a11y-section">
            <h3>♿ Accessibility</h3>
            <ul>
              {a11yIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasIssues && (
          <div className="validation-section success-section">
            <h3>✅ All Good!</h3>
            <p>Your portfolio is ready to export.</p>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onCancel} className="btn-modal-cancel">
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="btn-modal-confirm"
            disabled={errors.length > 0}
          >
            {errors.length > 0 ? 'Fix Errors First' : 'Export Anyway'}
          </button>
        </div>
      </div>
    </div>
  );
}