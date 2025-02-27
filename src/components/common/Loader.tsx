import React from 'react';

interface LoaderProps {
  classNames?: string;
}

const Loader: React.FC<LoaderProps> = ({ classNames = '' }) => {
  return (
    <div className={`flex p-5 justify-center ${classNames}`}>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
    </div>
  );
};

export default Loader;
