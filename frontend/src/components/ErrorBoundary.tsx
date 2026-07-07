import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-6 text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-lg shadow-2xl">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">
              We encountered an unexpected error. Our engineering team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF9933] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
