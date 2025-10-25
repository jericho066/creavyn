import { useState } from 'react';
import '../styles/HelpTooltip.css';

export default function HelpTooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="help-tooltip-wrapper">
      <button
        type="button"
        className="help-icon"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
      >
        ?
      </button>
      {visible && (
        <div className="help-tooltip">
          {text}
        </div>
      )}
    </div>
  );
}

