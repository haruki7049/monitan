import { GitHubStatusResponse } from "../startup.ts";

type Props = {
  database: Deno.Kv;
};

export async function Main({ database }: Props) {
  const latestStatus = await database.get<GitHubStatusResponse>([
    "github_status",
    "latest",
  ]);
  const statusData = latestStatus.value;
  const isAvailable = statusData?.status.indicator === "none";

  // Convert UTC string to JST
  const lastUpdated = statusData
    ? new Date(statusData.page.updated_at).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    })
    : null;

  return (
    <main>
      <h1>Monitan</h1>
      <p>This is a WIP web application</p>
      <p>Foo!!</p>

      <section>
        <h2>GitHub Status</h2>
        {statusData
          ? (
            <ul>
              <li>
                Last Updated: {/* Store UTC time in data attribute */}
                <time class="local-time" data-utc={statusData.page.updated_at}>
                  {statusData.page.updated_at}
                </time>
              </li>
              <li>Status: {statusData.status.description}</li>
              <li>Available: {isAvailable ? "Yes" : "No"}</li>
            </ul>
          )
          : <p>No data available yet.</p>}
      </section>

      <address>
        <p>
          <a href="https://haruki7049.dev">haruki7049.dev</a>
        </p>
        <p>
          <a href="https://github.com/haruki7049">github.com/haruki</a>
        </p>
        <p>
          Git Repository:{" "}
          <a href="https://github.com/haruki7049/monitan">
            github.com/haruki7049/monitan
          </a>
        </p>
      </address>
    </main>
  );
}
