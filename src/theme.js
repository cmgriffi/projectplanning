// Enterprise UI theme configuration
export const lightTheme = {
  // Base colors
  background: '#f8f9fa',
  text: '#212529',
  textSecondary: '#6c757d',
  primaryColor: '#0d6efd',
  primaryColorDark: '#0b5ed7',
  secondaryColor: '#6c757d',
  successColor: '#198754',
  warningColor: '#ffc107',
  dangerColor: '#dc3545',
  infoColor: '#0dcaf0',
  
  // Table specific
  tableBackground: '#ffffff',
  tableHeaderBackground: '#f1f3f5',
  tableHeaderText: '#495057',
  rowHover: '#f8f9fa',
  borderColor: '#dee2e6',
  
  // Input and buttons
  inputBackground: '#ffffff',
  buttonBackground: '#0d6efd',
  buttonHover: '#0b5ed7',
  buttonText: '#ffffff',
  
  // Status colors
  newStatus: '#e9ecef',
  inProgressStatus: '#cfe2ff',
  underReviewStatus: '#fff3cd',
  completedStatus: '#d1e7dd',
  
  // Priority colors
  highPriority: '#f8d7da',
  mediumPriority: '#cfe2ff',
  lowPriority: '#d1e7dd',
  
  // Misc
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  isDark: false
};

export const darkTheme = {
  // Base colors
  background: '#212529',
  text: '#f8f9fa',
  textSecondary: '#adb5bd',
  primaryColor: '#0d6efd',
  primaryColorDark: '#0a58ca',
  secondaryColor: '#6c757d',
  successColor: '#198754',
  warningColor: '#ffc107',
  dangerColor: '#dc3545',
  infoColor: '#0dcaf0',
  
  // Table specific
  tableBackground: '#343a40',
  tableHeaderBackground: '#212529',
  tableHeaderText: '#f8f9fa',
  rowHover: '#495057',
  borderColor: '#495057',
  
  // Input and buttons
  inputBackground: '#343a40',
  buttonBackground: '#0d6efd',
  buttonHover: '#0a58ca',
  buttonText: '#ffffff',
  
  // Status colors
  newStatus: '#343a40',
  inProgressStatus: '#084298',
  underReviewStatus: '#664d03',
  completedStatus: '#0f5132',
  
  // Priority colors
  highPriority: '#842029',
  mediumPriority: '#084298',
  lowPriority: '#0f5132',
  
  // Misc
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.25)',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  isDark: true
};

export const GlobalStyle = `
  body {
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
    background-color: var(--background);
    color: var(--text);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  :root {
    --background: ${lightTheme.background};
    --text: ${lightTheme.text};
    --text-secondary: ${lightTheme.textSecondary};
    --primary-color: ${lightTheme.primaryColor};
    --primary-color-dark: ${lightTheme.primaryColorDark};
    --secondary-color: ${lightTheme.secondaryColor};
    --success-color: ${lightTheme.successColor};
    --warning-color: ${lightTheme.warningColor};
    --danger-color: ${lightTheme.dangerColor};
    --info-color: ${lightTheme.infoColor};
    --table-background: ${lightTheme.tableBackground};
    --table-header-background: ${lightTheme.tableHeaderBackground};
    --table-header-text: ${lightTheme.tableHeaderText};
    --row-hover: ${lightTheme.rowHover};
    --border-color: ${lightTheme.borderColor};
    --input-background: ${lightTheme.inputBackground};
    --button-background: ${lightTheme.buttonBackground};
    --button-hover: ${lightTheme.buttonHover};
    --button-text: ${lightTheme.buttonText};
    --box-shadow: ${lightTheme.boxShadow};
  }
  
  body.dark-theme {
    --background: ${darkTheme.background};
    --text: ${darkTheme.text};
    --text-secondary: ${darkTheme.textSecondary};
    --primary-color: ${darkTheme.primaryColor};
    --primary-color-dark: ${darkTheme.primaryColorDark};
    --secondary-color: ${darkTheme.secondaryColor};
    --success-color: ${darkTheme.successColor};
    --warning-color: ${darkTheme.warningColor};
    --danger-color: ${darkTheme.dangerColor};
    --info-color: ${darkTheme.infoColor};
    --table-background: ${darkTheme.tableBackground};
    --table-header-background: ${darkTheme.tableHeaderBackground};
    --table-header-text: ${darkTheme.tableHeaderText};
    --row-hover: ${darkTheme.rowHover};
    --border-color: ${darkTheme.borderColor};
    --input-background: ${darkTheme.inputBackground};
    --button-background: ${darkTheme.buttonBackground};
    --button-hover: ${darkTheme.buttonHover};
    --button-text: ${darkTheme.buttonText};
    --box-shadow: ${darkTheme.boxShadow};
  }
`;
