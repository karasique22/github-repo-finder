import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => (
  <div
    className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}
  >
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
