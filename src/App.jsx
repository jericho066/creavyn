import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TemplateGallery from './components/TemplateGallery';
import Builder from './components/Builder';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TemplateGallery />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
