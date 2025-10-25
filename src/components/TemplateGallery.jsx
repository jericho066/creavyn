import { useNavigate } from 'react-router-dom';
import { samplePortfolio } from '../utils/dataModel';
import { minimalTemplate } from '../templates/minimalTemplate';
import { boldTemplate } from '../templates/boldTemplate';
import '../styles/TemplateGallery.css';


export default function TemplateGallery() {
  const navigate = useNavigate();

  

  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean, professional, and straightforward. Perfect for focusing on your projects.',
      preview: 'Light background with blue gradient header and card-based layout.',
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Modern, eye-catching, and sophisticated. Make a lasting impression.',
      preview: 'Full-height header with animated background, alternating project cards.',
    },
  ];

  const handleUseTemplate = (templateId) => {
    const portfolioData = {
      ...samplePortfolio,
      meta: {
        ...samplePortfolio.meta,
        theme: templateId,
      },
    };
    navigate('/builder', { state: { portfolioData } });
  };

  return (
    <div className="template-gallery">
      <div className="gallery-header">
        <h1>Build Your Portfolio with Creavyn</h1>
        <p>Pick a design that matches your style. You can customize colors, fonts, and layout later.</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">

            <div className={`template-preview preview-${template.id}`}>
              <div className='preview-content' onClick={() => handleUseTemplate(template.id)}>
                <div className='preview-header'>
                  <div className='preview-avatar'></div>
                  
                  <div className="preview-text-lines">
                    <div className="preview-line thick"></div>
                    <div className="preview-line"></div>
                  </div>
                </div>

                <div className="preview-body">
                  <div className="preview-section">
                    <div className="preview-pills">
                      <div className="preview-pill"></div>
                      <div className="preview-pill"></div>
                      <div className="preview-pill"></div>
                    </div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-card"></div>
                    <div className="preview-card"></div>
                  </div>
                </div>

              </div>
            </div>

            <div className="template-info">
              <h2>{template.name}</h2>
              <p>{template.description}</p>
              <button
                onClick={() => handleUseTemplate(template.id)}
                className="btn-use-template"
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}