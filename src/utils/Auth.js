const BASE_URL = "https://register.nomoreparties.co";

function checkResponse(response) {
  if (response === 200) {
    const data = response.json();
    return data;
  } else {
    throw new Error(`something went wrong. Status: ${response}`);
  }
}

export async function register(email, password) {
  console.log(JSON.stringify(email, password));
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email, password),
  });
  checkResponse();
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
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    checkResponse();
  }
}
