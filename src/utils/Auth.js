const BASE_URL = "https://register.nomoreparties.co";

export async function register(email, password) {
  console.log(JSON.stringify(email, password));
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email, password),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(
      `something went wrong. Status: ${response.status}, ${response.statusText}`
    );
  }
}

export async function authorize(email, password) {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email, password),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("jwt", data.token);
    return data;
  } else {
    throw new Error(
      `something went wrong. Status: ${response.status}, ${response.statusText}`
    );
  }
}

export async function getContent(token) {
  if (token) {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      throw new Error("Authorization failed");
    } catch (err) {
      console.log(err);
    }
  }
}
