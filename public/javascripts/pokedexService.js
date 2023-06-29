let pokedexService = {
  createPokemon: async function (name, typeOne, typeTwo) {
    const data = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authorization": "Bearer: " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name: name, typeOne: typeOne, typeTwo: typeTwo }),
    };
    const response = await fetch("/views/pokedex", data);
    return await response.json();
  },
  updatePokemon: async function (id, name, typeOne, typeTwo) {
    const data = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "authorization": "Bearer: " + localStorage.getItem("token"),
      },
      body: JSON.stringify({id: id, name: name, typeOne: typeOne, typeTwo: typeTwo}),
    };
    const response = await fetch("/views/pokedex", data);
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

export default pokedexService;
