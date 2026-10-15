import "dotenv/config";
import { Client } from "pg";

const BASE_URL =
  process.env.AUTH_TEST_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";
const ORIGIN = BASE_URL;

let failures = 0;

function check(name, condition, detail = "") {
  const passed = Boolean(condition);
  if (!passed) failures += 1;
  console.log(
    `${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`,
  );
}

function jsonHeaders() {
  return { "content-type": "application/json", origin: ORIGIN };
}

async function readBody(response) {
  const text = await response.clone().text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  console.log(`Running auth checks against ${BASE_URL}\n`);

  const okResponse = await fetch(`${BASE_URL}/api/auth/ok`);
  check(
    "GET /api/auth/ok returns 200",
    okResponse.status === 200,
    `status=${okResponse.status}`,
  );

  for (const [provider, host] of [
    ["google", "accounts.google.com"],
    ["github", "github.com"],
  ]) {
    const response = await fetch(`${BASE_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ provider, callbackURL: "/" }),
    });
    const body = await readBody(response);
    const url = typeof body === "object" ? body?.url : undefined;

    check(
      `POST /api/auth/sign-in/social (${provider}) returns 200`,
      response.status === 200,
      `status=${response.status} body=${JSON.stringify(body)}`,
    );
    check(
      `POST /api/auth/sign-in/social (${provider}) returns authorize URL to ${host}`,
      typeof url === "string" && url.includes(host),
      `url=${url}`,
    );
  }

  const email = `authtest+${Date.now()}@example.com`;
  const password = "Password123!";

  const signUpResponse = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({
      name: "Auth Test",
      email,
      password,
      callbackURL: "/",
    }),
  });
  const signUpBody = await readBody(signUpResponse);
  check(
    "POST /api/auth/sign-up/email returns 200",
    signUpResponse.status === 200,
    `status=${signUpResponse.status} body=${JSON.stringify(signUpBody)}`,
  );

  const signInResponse = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password, callbackURL: "/" }),
  });
  const signInBody = await readBody(signInResponse);
  check(
    "POST /api/auth/sign-in/email returns 200",
    signInResponse.status === 200,
    `status=${signInResponse.status} body=${JSON.stringify(signInBody)}`,
  );

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const userResult = await client.query(
    'SELECT id FROM "user" WHERE email = $1',
    [email.toLowerCase()],
  );
  check(
    'row created in "user" table',
    userResult.rowCount === 1,
    `rows=${userResult.rowCount}`,
  );

  const userId = userResult.rows[0]?.id;
  if (userId) {
    const sessionResult = await client.query(
      'SELECT id FROM session WHERE "userId" = $1',
      [userId],
    );
    check(
      'row created in "session" table',
      sessionResult.rowCount >= 1,
      `rows=${sessionResult.rowCount}`,
    );
  } else {
    check('row created in "session" table', false, "no user id to check");
  }

  await client.end();

  console.log(
    failures === 0
      ? "\nAll auth checks passed."
      : `\n${failures} auth check(s) failed.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Auth test run crashed:", error);
  process.exit(1);
});
