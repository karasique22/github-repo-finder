import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Repo, RepoSearchError } from '../types/repo';

const API_BASE_URL = 'https://api.github.com';

let cancelTokenSource: CancelTokenSource | null = null;

export const fetchRepos = async (
  username: string,
  page: number,
  signal?: AbortSignal
): Promise<Repo[]> => {
  try {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by new request');
    }
    cancelTokenSource = axios.CancelToken.source();

    const response = await axios.get<Repo[]>(
      `${API_BASE_URL}/users/${username}/repos`,
      {
        params: {
          page,
          per_page: 20,
          sort: 'updated',
        },
        cancelToken: cancelTokenSource.token,
        signal,
      }
    );

    return response.data.map((repo) => ({
      id: repo.id,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
    }));
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isCancel(error)) {
      throw { message: 'Request canceled', status: 0 };
    }

    const errorData: RepoSearchError = {
      message: 'Unknown error',
      status: 500,
    };

    if (axiosError.response) {
      errorData.status = axiosError.response.status;
      switch (axiosError.response.status) {
        case 404:
          errorData.message = 'User not found';
          break;
        case 403:
          errorData.message = 'API rate limit exceeded';
          break;
        default:
          errorData.message = axiosError.message;
      }
    }

    throw errorData;
  }
};
