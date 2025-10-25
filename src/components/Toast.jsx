import { useState, useEffect } from 'react';
import '../styles/Toast.css';

export default function Toast({ message, type = 'success', duration = 3000 }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}