import { useState, useRef } from 'react';

const useCustomAlert = () => {
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'info',
  });
  const timeoutRef = useRef(null);

  const showAlert = ({ title, message, buttons = [], type = 'info', autoHide = true }) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAlertState({
      visible: true,
      title,
      message,
      buttons,
      type,
    });

    // Auto hide after 3 seconds if autoHide is true
    if (autoHide) {
      timeoutRef.current = setTimeout(() => {
        hideAlert();
      }, 3000);
    }
  };

  const hideAlert = () => {
    // Clear timeout when manually hiding
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const showSuccess = (title, message, buttons = [], autoHide = true) => {
    showAlert({ title, message, buttons, type: 'success', autoHide });
  };

  const showError = (title, message, buttons = [], autoHide = true) => {
    showAlert({ title, message, buttons, type: 'error', autoHide });
  };

  const showWarning = (title, message, buttons = [], autoHide = true) => {
    showAlert({ title, message, buttons, type: 'warning', autoHide });
  };

  const showInfo = (title, message, buttons = [], autoHide = true) => {
    showAlert({ title, message, buttons, type: 'info', autoHide });
  };

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useCustomAlert;
