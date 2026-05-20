export interface Page {
  id: string;
  name: string;
  url: string;
  time_zone: string;
  updated_at: string;
}

export type Indicator = "none" | "minor" | "major" | "critical" | "maintenance";

export interface Status {
  indicator: Indicator;
  description: string;
}

export interface GitHubStatusResponse {
  page: Page;
  status: Status;
}

export interface Query {
  response: GitHubStatusResponse;
  fetchedAt: Date;
}

// Export the fetch function to use it as a fallback
export async function fetchAndSaveStatus(
  database: Deno.Kv,
): Promise<GitHubStatusResponse> {
  try {
    const url = "https://www.githubstatus.com/api/v2/status.json";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const githubResponse: GitHubStatusResponse = await response.json();
    const fetchedAt: Date = new Date();

    await database.set([
      "github_status",
      "history",
      githubResponse.page.updated_at,
    ], {
      response: githubResponse,
      fetchedAt: fetchedAt,
    });
    await database.set(["github_status", "latest"], {
      response: githubResponse,
      fetchedAt: fetchedAt,
    });

    return githubResponse;
  } catch (error) {
    console.error("Failed to fetch GitHub status:", error);
    throw error;
  }
}

export function startup(database: Deno.Kv) {
  Deno.cron("GitHub Status fetch", { minute: { every: 1 } }, async () => {
    await fetchAndSaveStatus(database);
  });
}
