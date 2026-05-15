// Define the page information
export interface Page {
  id: string;
  name: string;
  url: string;
  time_zone: string;
  updated_at: string;
}

// Define the status indicator types
export type Indicator = "none" | "minor" | "major" | "critical" | "maintenance";

// Define the current status
export interface Status {
  indicator: Indicator;
  description: string;
}

// Define the root response structure
export interface GitHubStatusResponse {
  page: Page;
  status: Status;
}

function startup(database: Deno.Kv) {
  Deno.cron("GitHub Status fetch", { minute: { every: 1 } }, async () => {
    const url: string = "https://www.githubstatus.com/api/v2/status.json";
    const response: Response = await fetch(url);
    const githubResponse: GitHubStatusResponse = await response.json();

    // Add history
    {
      const key = ["github_status", "history", githubResponse.page.updated_at];
      await database.set(key, githubResponse);
    }

    // Add latest state
    {
      const key = ["github_status", "latest"];
      await database.set(key, githubResponse);
    }
  });
}

export { startup };
