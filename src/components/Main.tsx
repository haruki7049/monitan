type Props = {
  database: Deno.Kv;
};

export function Main({ database }: Props) {
  return (
    <main>
      <h1>Monitan</h1>
      <p>This is a WIP web application</p>
      <p>Foo!!</p>

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
