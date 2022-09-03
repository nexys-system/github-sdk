import fetch, { Headers } from "node-fetch";

const expectedScopes = ["read:packages", "repo"];

const getScopes = (headers: Headers): string[] => {
  const oauthScopesRaw = headers.get("X-OAuth-Scopes");

  if (!oauthScopesRaw) {
    return [];
  }

  return oauthScopesRaw.split(/,\s/);
};

const getExpirationDate = (headers: Headers): Date | null => {
  const expirationDateRaw = headers.get(
    "github-authentication-token-expiration"
  );

  if (!expirationDateRaw) {
    return null;
  }

  return new Date(expirationDateRaw);
};

export const getTokenScopeAndValidity = async (token: string) => {
  const url = "https://api.github.com";

  const response = await fetch(url, {
    headers: { Authorization: "token " + token },
  });

  const scopes: string[] = getScopes(response.headers);
  const expirationDate: Date | null = getExpirationDate(response.headers);

  const scopesOk: boolean = expectedScopes
    .map((exepctedScope) => scopes.includes(exepctedScope))
    .reduce((a, b) => a && b);

  const dateValid: boolean = expirationDate
    ? expirationDate.getTime() > new Date().getTime()
    : false;

  const isOk: boolean = dateValid && scopesOk;

  return { scopes, expirationDate, dateValid, scopesOk, isOk, expectedScopes };
};
