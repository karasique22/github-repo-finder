import { useState, useCallback } from 'react';
import { debounce } from 'lodash-es';
import { useAppDispatch } from '../store/hooks';
import { fetchUserRepos, resetRepos } from '../store/slices/reposSlice';

const useSearchRepos = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(
    debounce((username: string) => {
      if (username) {
        dispatch(resetRepos());
        dispatch(fetchUserRepos({ username, page: 1 }));
      }
    }, 800),
    [dispatch]
  );

  const onSearch = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  return { searchTerm, handleSearch: onSearch };
};

export default useSearchRepos;
