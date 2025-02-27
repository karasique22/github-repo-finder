import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from './store/hooks';
import SearchInput from './components/SearchInput';
import RepoCard from './components/RepoCard';
import ErrorMessage from './components/common/Error';
import Loader from './components/common/Loader';
import useSearchRepos from './hooks/useSearchRepos';
import useLoadMoreRepos from './hooks/useLoadMoreRepos';
import { resetRepos } from './store/slices/reposSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { repos, loading, error, hasMore } = useAppSelector(
    (state) => state.repos
  );
  const { searchTerm, handleSearch } = useSearchRepos();
  const loadMore = useLoadMoreRepos(searchTerm);

  useEffect(() => {
    return () => {
      dispatch(resetRepos());
    };
  }, [dispatch]);

  return (
    <div className='container mx-auto px-4 py-8 overflow-hidden'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        GitHub Repository Search
      </h1>

      <SearchInput onSearch={handleSearch} isLoading={loading === 'pending'} />

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
              key={`${repo.id}-${repo.updated_at}`}
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
