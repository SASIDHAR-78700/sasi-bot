import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF9F0 50%, #F5EDF5 100%)' }}
        >
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-royal shadow-premium flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#8B7BA8] mb-6">
              An unexpected error occurred. Reload the page to continue.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl text-white font-medium text-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
