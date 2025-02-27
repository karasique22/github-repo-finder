import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserRepos } from '../store/slices/reposSlice';

const useLoadMoreRepos = (searchTerm: string) => {
  const dispatch = useAppDispatch();
  const { hasMore, loading, page } = useAppSelector((state) => state.repos);

  const loadMore = useCallback(() => {
    if (hasMore && loading !== 'pending' && searchTerm) {
      dispatch(
        fetchUserRepos({
          username: searchTerm,
          page: page + 1,
        })
      );
    }
  }, [dispatch, hasMore, loading, searchTerm, page]);

  return loadMore;
};

export default useLoadMoreRepos;
