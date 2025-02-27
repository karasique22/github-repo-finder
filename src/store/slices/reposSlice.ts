import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRepos } from '../../api/githubApi';
import { Repo, RepoSearchError } from '../../types/repo';

interface ReposState {
  repos: Repo[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: RepoSearchError | null;
  page: number;
  hasMore: boolean;
  currentUsername: string | null;
}

const initialState: ReposState = {
  repos: [],
  loading: 'idle',
  error: null,
  page: 1,
  hasMore: false,
  currentUsername: null,
};

export const fetchUserRepos = createAsyncThunk(
  'repos/fetchUserRepos',
  async (
    { username, page }: { username: string; page: number },
    { rejectWithValue, signal, getState }
  ) => {
    try {
      const { repos } = getState() as { repos: ReposState };

      if (repos.currentUsername !== username) {
        return [];
      }

      const response = await fetchRepos(username, page, signal);
      console.log(page);

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({ username, page }, { getState }) => {
      const { repos } = getState() as { repos: ReposState };

      if (repos.loading === 'pending') return false;
      if (repos.currentUsername === username && page <= repos.page)
        return false;

      return true;
    },
  }
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    resetRepos(state) {
      state.repos = [];
      state.page = 1;
      state.hasMore = false;
      state.error = null;
      state.currentUsername = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state, action) => {
        state.loading = 'pending';
        state.error = null;

        if (action.meta.arg.username !== state.currentUsername) {
          state.repos = [];
          state.page = 1;
          state.hasMore = false;
          state.currentUsername = action.meta.arg.username;
        }
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.loading = 'succeeded';

        if (action.meta.arg.username === state.currentUsername) {
          state.repos = [...state.repos, ...action.payload];
          state.page = action.meta.arg.page;
          state.hasMore = action.payload.length === 20;
        }
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loading = 'failed';

        if (action.meta.arg.username === state.currentUsername) {
          state.error = action.payload as RepoSearchError;
        }
      });
  },
});

export const { resetRepos } = reposSlice.actions;
export default reposSlice.reducer;
