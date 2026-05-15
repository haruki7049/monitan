type GitHubStatus = {
  page: {
    id: string;
    name: string;
    url: URL;
    time_zone: string;
    updated_at: string;
  };
  status: {
    indecator: string;
    description: string;
  };
};

function startup(database: Deno.Kv) {
  Deno.cron("GitHub Status fetch", { minute: { every: 1 } }, async () => {
    const url: string = "https://www.githubstatus.com/api/v2/status.json";
    const response: Response = await fetch(url);
    const body: GitHubStatus = await response.json();
    console.log(body);
  });
}

export { startup };
