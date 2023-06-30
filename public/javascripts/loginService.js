let loginService = {
  login: async function (username, password) {
    const data = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    };
    const response = await fetch("/login", data);
    if (response.token) {
      localStorage.setItem("token", token);
    }
    console.log(JSON.stringify(response));
    return await response.json();
  },
  goToPokedex: async function (token) {
    const data = {
      method: "GET",
      headers: {
        "Authorization": "Bearer: " + token,
      },
    };
    fetch("/views/pokedex", data)
    .then(() => {
        window.open("/views/pokedex", "_blank");
    });
    console.log(token);
  },  
};

export default loginService;
