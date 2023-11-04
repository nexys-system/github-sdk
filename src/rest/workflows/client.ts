import * as T from './type';

class GithubWorkflowAPI {
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

  async request({ path, method = "GET", data }:{path: string, method?: 'GET' | 'POST', data?:any}) {
    const url = this.host + path;
    const body = data && JSON.stringify(data);

    const response = await fetch(url, {
      headers: this.headers,
      method,
      body,
    });

    return response;
  }

  async getWorkflows(owner:string, repo:string):Promise<T.WorkflowsResponse> {
    const path = `/repos/${owner}/${repo}/actions/workflows`;
    const response = await this.request({ path });
    return response.json();
  }

  async triggerWorkflow(owner:string, repo:string, workflow_id:number, branch_name:string, inputs?:any):Promise<boolean> {
    const path = `/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
    const data = {
      ref: branch_name,
      inputs,
    };

    const response = await this.request({ path, method: "POST", data });
    return response.status === 204;
  }

  async workflowStatus(owner:string, repo:string):Promise<{total_count:number, workflow_runs:T.GithubWorkflowRun[]}> {
    const path = `/repos/${owner}/${repo}/actions/runs`;
    const response = await this.request({ path });
    return response.json();
  }
}

export default GithubWorkflowAPI;
