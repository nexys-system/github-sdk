interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: 'active' | 'inactive'; // assuming the state can be either 'active' or 'inactive'
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  url: string;
  html_url: string;
  badge_url: string;
}

interface WorkflowsResponse {
  total_count: number;
  workflows: Workflow[];
}

interface GithubWorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  path: string;
  display_title: string;
  run_number: number;
  event: string;
  status: string;
  conclusion: string;
  workflow_id: number;
  check_suite_id: number;
  check_suite_node_id: string;
  url: string;
  html_url: string;
  pull_requests: any[];
  created_at: string;
  updated_at: string;
  actor: GithubUser;
  run_attempt: number;
  referenced_workflows: any[];
  run_started_at: string;
  triggering_actor: GithubUser;
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  previous_attempt_url: null | string;
  workflow_url: string;
  head_commit: HeadCommit;
  repository: Repository;
  head_repository: Repository;
}

interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface HeadCommit {
  id: string;
  tree_id: string;
  message: string;
  timestamp: string;
  author: CommitUser;
  committer: CommitUser;
}

interface CommitUser {
  name: string;
  email: string;
}

interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: RepositoryOwner;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
}

interface RepositoryOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}


class GitHubWorkflowAPI {
  host: string;
  headers: {[k:string]: string};
  
  constructor(token: string) {
    this.host = "https://api.github.com";
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    };
  }

  async request({ path, method = "GET", data }:{path:string, method: 'GET' | 'POST', data?:any}) {
    const url = this.host + path;
    const body = data && JSON.stringify(data);

    const response = await fetch(url, {
      headers: this.headers,
      method,
      body,
    });

    return response;
  }

  async getWorkflows(owner:string, repo:string):Promise<WorkflowsResponse> {
    const path = `/repos/${owner}/${repo}/actions/workflows`;
    const response = await this.request({ path });
    return response.json();
  }

  async triggerWorkflow(owner, repo, workflow_id, branch_name, inputs) {
    const path = `/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
    const data = {
      ref: branch_name,
      inputs,
    };

    const response = await this.request({ path, method: "POST", data });
    return response.status === 204;
  }

  async workflowStatus(owner, repo):Promise<{total_count:number, workflow_runs:GithubWorkflowRun[]}> {
    const path = `/repos/${owner}/${repo}/actions/runs`;
    const response = await this.request({ path });
    return response.json();
  }
}

export default GithubWorkflowAPI;
