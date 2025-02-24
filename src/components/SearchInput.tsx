import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash-es';
import Loader from './common/Loader';

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      onSearch(searchValue.trim());
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className='relative mb-8 max-w-2xl mx-auto'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Введите имя пользователя GitHub...'
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 text-lg border-2 rounded-lg transition-all duration-200 focus:outline-none ${
            isFocused
              ? 'border-blue-500 shadow-lg'
              : 'border-gray-300 hover:border-gray-400'
          } ${isLoading ? 'pr-16' : 'pr-4'}`}
          disabled={isLoading}
        />

        {isLoading && <Loader />}
      </div>

      <div className='mt-2 text-sm text-gray-500 text-center'>
        Начните печатать для поиска
      </div>
    </div>
  );
};

export default React.memo(SearchInput);
