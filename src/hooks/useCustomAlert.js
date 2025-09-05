import { useState } from 'react';

const useCustomAlert = () => {
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'info',
  });

  const showAlert = ({ title, message, buttons = [], type = 'info' }) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
      type,
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const showSuccess = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'success' });
  };

  const showError = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'error' });
  };

  const showWarning = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'warning' });
  };

  const showInfo = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'info' });
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
