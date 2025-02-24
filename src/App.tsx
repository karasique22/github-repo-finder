import React, { useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchUserRepos, resetRepos } from './store/slices/reposSlice';
import { debounce } from 'lodash-es';
import { useAppDispatch, useAppSelector } from './store/hooks';
import SearchInput from './components/SearchInput';
import RepoCard from './components/RepoCard';
import ErrorMessage from './components/common/Error';
import Loader from './components/common/Loader';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { repos, loading, error, hasMore, page } = useAppSelector(
    (state) => state.repos
  );
  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearch = useCallback(
    debounce((username: string) => {
      if (username) {
        dispatch(resetRepos());
        dispatch(fetchUserRepos({ username, page: 1 }));
      }
    }, 500),
    [dispatch]
  );

  const loadMore = useCallback(
    debounce(() => {
      if (hasMore && loading !== 'pending' && searchTerm) {
        dispatch(fetchUserRepos({ username: searchTerm, page: page + 1 }));
      }
    }, 300),
    [dispatch, hasMore, loading, searchTerm, page]
  );

  useEffect(() => {
    return () => {
      dispatch(resetRepos());
    };
  }, [dispatch]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        GitHub Repository Search
      </h1>

      <SearchInput
        onSearch={(term) => {
          setSearchTerm(term);
          handleSearch(term);
        }}
        isLoading={loading === 'pending'}
      />

      {error && <ErrorMessage message={error.message} className='my-4' />}

      <InfiniteScroll
        dataLength={repos.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Loader />}
        scrollThreshold='100px'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              full_name={repo.full_name}
              description={repo.description}
              stars={repo.stargazers_count}
              updatedAt={repo.updated_at}
              url={repo.html_url}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default App;
