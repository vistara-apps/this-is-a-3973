import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-dark-card rounded-xl p-8 border border-dark-border text-center space-y-6 animate-scale-in">
            {/* Error Icon */}
            <div className="relative mx-auto w-16 h-16">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-error/30 rounded-full animate-pulse"></div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Oops! Something went wrong
              </h2>
              <p className="text-slate-400 text-sm">
                We encountered an unexpected error while processing your request. 
                Don't worry, our wildlife sounds are still safe! 🦜
              </p>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-dark-surface rounded-lg p-4 text-xs">
                <summary className="cursor-pointer text-slate-300 hover:text-white flex items-center space-x-2">
                  <Bug className="w-4 h-4" />
                  <span>Error Details (Dev Mode)</span>
                </summary>
                <div className="mt-3 space-y-2 text-slate-400">
                  <div>
                    <strong className="text-error">Error:</strong>
                    <pre className="mt-1 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-error">Stack Trace:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-nature-forest hover:bg-nature-moss text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-dark-surface hover:bg-dark-hover text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 border border-dark-border"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error fallback component for specific sections
export const ErrorFallback = ({ 
  error, 
  resetError, 
  title = "Something went wrong",
  description = "We encountered an error while loading this section."
}) => (
  <div className="bg-dark-card rounded-lg p-8 border border-dark-border text-center space-y-4 animate-fade-in">
    <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center mx-auto">
      <AlertTriangle className="w-6 h-6 text-error" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
    {resetError && (
      <button
        onClick={resetError}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-nature-forest hover:bg-nature-moss text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
);

// Network error component
export const NetworkError = ({ onRetry }) => (
  <div className="bg-dark-card rounded-lg p-8 border border-dark-border text-center space-y-4 animate-fade-in">
    <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto">
      <AlertTriangle className="w-6 h-6 text-warning" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-white">Connection Problem</h3>
      <p className="text-slate-400 text-sm">
        Unable to connect to our servers. Please check your internet connection and try again.
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-nature-forest hover:bg-nature-moss text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry</span>
      </button>
    )}
  </div>
);

// Empty state component
export const EmptyState = ({ 
  icon: Icon = Mic,
  title = "No data available",
  description = "There's nothing to show here yet.",
  actionLabel,
  onAction,
  children
}) => (
  <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center space-y-6 animate-fade-in">
    <div className="w-16 h-16 bg-nature-forest/20 rounded-full flex items-center justify-center mx-auto">
      <Icon className="w-8 h-8 text-nature-forest" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mx-auto">{description}</p>
    </div>
    {onAction && actionLabel && (
      <button
        onClick={onAction}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-nature-forest hover:bg-nature-moss text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
      >
        <span>{actionLabel}</span>
      </button>
    )}
    {children}
  </div>
);

export default ErrorBoundary;
