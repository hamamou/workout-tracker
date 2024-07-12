import {Component, ErrorInfo, ReactNode} from 'react';

interface ErrorBoundaryProps {
    fallback: ReactNode;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // Update state to indicate that an error has occurred
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI when there's an error
            return this.props.fallback;
        }

        // Render children normally when there's no error
        return this.props.children;
    }
}

export default ErrorBoundary;
