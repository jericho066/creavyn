import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { samplePortfolio, defaultPortfolio } from '../utils/dataModel';
import { saveDraft, exportJSON, importJSON } from '../utils/storage';
import { minimalTemplate } from '../templates/minimalTemplate';
import { boldTemplate } from '../templates/boldTemplate';
import { exportToHTML } from '../utils/exporter';
import { generateREADME } from '../utils/readmeGenerator';
import { validatePortfolio } from '../utils/validator';
import { HistoryManager } from '../utils/history'; 

import FormSection from './FormSection';
import LivePreview from './LivePreview';
import Toast from './Toast';
import ValidationModal from './ValidationModal';
import '../styles/Builder.css';
import logo from "../assets/logo.png"

export default function Builder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [toast, setToast] = useState(null);
  const [historyManager, setHistoryManager] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [ mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.state?.portfolioData) {
      const initialData = JSON.parse(JSON.stringify(location.state.portfolioData));
      setPortfolio(initialData);

      const manager = new HistoryManager(initialData);
      setHistoryManager(manager)

    } else {
      // If no template selected, load default and show templates again
      navigate('/');
    }
  }, [location, navigate]);



  //* autosave every 3 seconds
  useEffect(() => {
    if(!portfolio) {
      return;
    }

    const timer = setTimeout(() => {
      saveDraft(portfolio);
      setLastSaved(new Date().toLocaleTimeString());
    }, 3000)

    return () => clearTimeout(timer);
  }, [portfolio])


  const handleUpdatePortfolio = (section, field, value) => {
    setPortfolio(prev => {
      const updated = (() => {
        if (field === null) {
          //* For arrays like skills and projects
          return {
            ...prev,
            [section]: value
          }
        }

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          //* For nested objects like colors
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value
            }
          };
        }

        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }
      })();

      //* add to history
      if (historyManager) {
        historyManager.push(JSON.parse(JSON.stringify(updated)));
      }

      return updated;
    })
  }


  const handleUndo = useCallback(() => {
    if (historyManager && historyManager.canUndo()) {
      const previousState = historyManager.undo();
      if (previousState) {
        setPortfolio(JSON.parse(JSON.stringify(previousState))); // Deep clone
        showToast('Undone', 'info');
        setMobileMenuOpen(false);
      }
    }
  }, [historyManager]);

  const handleRedo = useCallback(() => {
    if (historyManager && historyManager.canRedo()) {
      const nextState = historyManager.redo();
      if (nextState) {
        setPortfolio(JSON.parse(JSON.stringify(nextState))); // Deep clone
        showToast('Redone', 'info');
        setMobileMenuOpen(false);
      }
    }
  }, [historyManager]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      //* Ctrl+Z / Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      //* Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y for Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);

  }, [handleUndo, handleRedo]);


  const getTemplateFunction = () => {
    return portfolio?.meta?.theme === "bold" ? boldTemplate : minimalTemplate;
  }


  const handleLoadDraft = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        const loadedData = await importJSON(file);
        setPortfolio(loadedData);
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        setLastSaved(timeStr);

      } catch (error) {
        alert('Failed to load draft: ' + error.message);
      }
    }

    input.click();
  }

  const handleExportConfirm = () => {
    
    exportToHTML(portfolio, getTemplateFunction());
    
    const readme = generateREADME(portfolio);
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
    
    setShowValidation(false);
    showToast("Portfolio and README exported successfully!");
  };


  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  if (!portfolio) {
    return <div>Loading...</div>;
  }

  return (
    <div className="builder">
      <header className="builder-header">
        <div className='logo'>
          <img src={logo} alt="" />
          <h1>
            reavyn
          </h1>
        </div>

        {/* Mobile menu button that only visible on a smaller screens */}
        <button
          className='mobile-menu-btn'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle menu'
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
        </button>


        {/* Desktop Actions */}
        <div className='header-actions desktop-only'>
          <span className='save-indicator'>{lastSaved ? `Saved at ${lastSaved}` : "Saving..."}</span>

          <div className='undo-redo-group'>
            <button
              onClick={handleUndo}
              className='btn-undo'
              disabled={!historyManager || !historyManager.canUndo()}
              title="Undo (Ctrl+Z)"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>

            <button
              onClick={handleRedo}
              className='btn-redo'
              disabled={!historyManager || !historyManager.canRedo()}
              title="Redo (Ctrl+Shift+Z)"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          <button
            onClick={() => setShowValidation(true)}
            className='btn-export'
          >
            <i className="bi bi-download"></i> Export HTML
          </button>

          <button
            onClick={() => exportJSON(portfolio, `${portfolio.meta.name}-draft.json`)}
            className='btn-save-draft'
          >
            <i className="bi bi-floppy"></i> Save Draft
          </button>

          <button
            onClick={handleLoadDraft}
            className="btn-load-draft"
          >
            <i className="bi bi-folder2-open"></i> Load Draft
          </button>

          <button onClick={() => navigate("/")} className='btn-back'>
            ← Back to Templates
          </button>
        </div>
      </header>


      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className='mobile-menu-overlay'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side bar */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className='mobile-menu-header'>
          <h3>Menu</h3>

          <button
            className='mobile-menu-close'
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>


        <div className='mobile-menu-content'>
        
          <button
            onClick={() => {
              setShowValidation(true);
              setMobileMenuOpen(false);
            }}
            className='btn-export mobile'
          >
            <i className="bi bi-download"></i> Export HTML
          </button>


          <button
            onClick={() => {
              exportJSON(portfolio, `${portfolio.meta.name}-draft.json`);
              setMobileMenuOpen(false);
            }}
            className='btn-save-draft mobile'
          >
            <i className="bi bi-floppy"></i> Save Draft
          </button>


          <button
            onClick={() => {
              handleLoadDraft();
              setMobileMenuOpen(false);
            }}
            className="btn-load-draft mobile"
          >
            <i className="bi bi-folder2-open"></i> Load Draft
          </button>

          <span className='save-indicator mobile'>{lastSaved ? `Saved at ${lastSaved}` : "Saving..."}</span>

          <div className='undo-redo-group mobile'>
            <button
              onClick={handleUndo}
              className='btn-undo mobile'
              disabled={!historyManager || !historyManager.canUndo()}
              title="Undo"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Undo</span>
            </button>

            <button
              onClick={handleRedo}
              className='btn-redo mobile'
              disabled={!historyManager || !historyManager.canRedo()}
              title="Redo"
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span>Redo</span>
            </button>
            
          </div>

          <button 
            onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }} 
            className='btn-back mobile'
          >
            ← Back to Templates
          </button>
        </div>
      </div>



      <div className="builder-container">
        <div className="builder-form">
          <FormSection portfolio={portfolio} onUpdate={handleUpdatePortfolio} />
        </div>

        <div className="builder-preview">
          <LivePreview portfolio={portfolio} templateFunction={getTemplateFunction()} />
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {showValidation && (
        <ValidationModal 
          portfolio={portfolio} 
          onConfirm={handleExportConfirm}
          onCancel={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}