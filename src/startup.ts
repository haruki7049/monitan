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

    await database.set([
      "github_status",
      "history",
      githubResponse.page.updated_at,
    ], githubResponse);
    await database.set(["github_status", "latest"], githubResponse);

    return githubResponse;
  } catch (error) {
    console.error("Failed to fetch GitHub status:", error);
    throw error;
  }
}

export function startup(database: Deno.Kv) {
  Deno.cron("GitHub Status fetch", { minute: { every: 5 } }, async () => {
    await fetchAndSaveStatus(database);
  });
}
