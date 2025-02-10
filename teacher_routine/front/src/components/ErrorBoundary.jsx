// teacher-routine-frontend/src/components/ErrorBoundary.jsx

import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="bg-red-200 text-red-700 p-4 rounded-lg">Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
