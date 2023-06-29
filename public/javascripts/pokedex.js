import pokedexService from "./pokedexService.js";

window.addEventListener("load", function () {
  console.log("event listener");  
  document
    .querySelector("#pokemonRegister")
    .addEventListener("submit", async (evt) => {
      evt.preventDefault();

      let name = document.querySelector("#name").value;
      let typeOne = document.querySelector("#typeOne").value;
      let typeTwo = document.querySelector("#typeTwo").value;

      let resp = await pokedexService.createPokemon(name, typeOne, typeTwo);
      console.log(resp);

      if (resp.status == true) {
        document.querySelector("#name").value = "";
      } else {
        const element = document.querySelector("#pokemonRegister");
        const errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "pErrorMessage");
        const text = document.createTextNode(resp.message);
        errorMessage.appendChild(text);
        element.appendChild(errorMessage);
        let errorMessages = document.getElementsByClassName("pErrorMessage");
        while (errorMessages.length > 1) {
          errorMessages[1].remove();
        }
        console.log("Erro");
      }
    });
    
    document
    .querySelector("#pokemonUpdate")
    .addEventListener("submit", async (evt) => {
      evt.preventDefault();
      let id = document.querySelector("#idInput").value;
      let name = document.querySelector("#nameUp").value;
      let typeOne = document.querySelector("#typeOneUp").value;
      let typeTwo = document.querySelector("#typeTwoUp").value;
      console.log(typeTwo);

      let resp = await pokedexService.updatePokemon(id, name, typeOne, typeTwo);
      console.log(resp);

      if (resp.status == true) {
        document.querySelector("#nameUp").value = "";
      } else {
        const element = document.querySelector("#pokemonUpdate");
        const errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "pErrorMessage");
        const text = document.createTextNode(resp.message);
        errorMessage.appendChild(text);
        element.appendChild(errorMessage);
        let errorMessages = document.getElementsByClassName("pErrorMessage");
        while (errorMessages.length > 1) {
          errorMessages[1].remove();
        }
        console.log("Erro");
      }
    });
    
});
