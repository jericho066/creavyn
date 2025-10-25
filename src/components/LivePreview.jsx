import { useState } from 'react';

export default function LivePreview({ portfolio, templateFunction }) {
  const [device, setDevice] = useState('desktop');

  const html = templateFunction(portfolio);

  const getIframeStyle = () => {
    if (device === 'mobile') {
      return { width: '355px', height: '812px' };

    } else if (device === 'tablet') {
      return { width: '768px', height: '924px' };
    }

    return { width: '100%', height: '100%' };
  };
  

  return (
    <div className="live-preview-container">
      <div className="device-toggle">
        <button
          onClick={() => setDevice('desktop')}
          className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
        >
          <i className="bi bi-pc-display-horizontal"></i> Desktop
        </button>

        <button
          onClick={() => setDevice('tablet')}
          className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
        >
          <i className="bi bi-tablet"></i> Tablet
        </button>

        <button
          onClick={() => setDevice('mobile')}
          className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
        >
          <i className="bi bi-phone"></i> Mobile
        </button>
      </div>

      <div className="preview-wrapper">
        <iframe
          srcDoc={html}
          style={{
            ...getIframeStyle(),
            border: 'none',
            borderRadius: '8px',
            margin: '0 auto',
            display: 'block'
          }}
          title="Portfolio Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}