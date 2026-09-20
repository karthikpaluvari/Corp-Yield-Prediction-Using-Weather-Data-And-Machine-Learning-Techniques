import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffe6e6', color: '#990000', border: '1px solid #cc0000', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h2>Failed to load the React Application</h2>
          <p>The application crashed due to a runtime error. Here are the details:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: '10px', borderRadius: '5px' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Component Stack Trace</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
