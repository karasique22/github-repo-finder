import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRepos } from '../../api/githubApi';
import { Repo, RepoSearchError } from '../../types/repo';

interface ReposState {
  repos: Repo[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: RepoSearchError | null;
  page: number;
  hasMore: boolean;
}

const initialState: ReposState = {
  repos: [],
  loading: 'idle',
  error: null,
  page: 1,
  hasMore: false,
};

export const fetchUserRepos = createAsyncThunk(
  'repos/fetchUserRepos',
  async (
    { username, page }: { username: string; page: number },
    { rejectWithValue, signal }
  ) => {
    try {
      const response = await fetchRepos(username, page, signal);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.repos = [...state.repos, ...action.payload];
        state.page += 1;
        state.hasMore = action.payload.length === 20;
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as RepoSearchError;
      });
  },
});

export const { resetRepos } = reposSlice.actions;
export default reposSlice.reducer;
