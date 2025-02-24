export interface Repo {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
}

export type RepoSearchError = {
  message: string;
  status: number;
};
