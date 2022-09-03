export const request = async <A>(
  url: string,
  token: string,
  method: "GET" | "POST" | "PATCH",
  data?: any
): Promise<A> => {
  const body: string | undefined = data && JSON.stringify(data);
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + token,
  };

  const r = await fetch(url, {
    method,
    headers,
    body,
  });

  switch (r.status) {
    case 404:
      throw Error("page not found: " + JSON.stringify({ url, body, method }));
  }

  if (r.ok) {
    const j = await r.json();

    const { errors } = j;

    if (errors) {
      throw Error(
        "could not retrieve information from github: " + JSON.stringify(errors)
      );
    }

    return j;
  }

  return Promise.reject({ text: await r.text(), status: r.status });
};
