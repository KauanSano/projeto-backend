import loginService from "./loginService.js";

window.addEventListener("load", function () {
  console.log("event listener");
  document
    .querySelector(".LoginDiv")
    .addEventListener("submit", async (evt) => {
      evt.preventDefault();
      let username = document.querySelector("#name").value;
      let password = document.querySelector("#password").value;
      let resp = await loginService.login(username, password);
      if (resp.status) {
        document.querySelector("#name").value = "";
        document.querySelector("#password").value = "";
        localStorage.setItem("token", resp.token);
        loginService.goToPokedex(localStorage.getItem("token"));
        //window.open("/views/pokedex", "_blank");
      } else {
        const element = document.querySelector(".LoginDiv");
        const errorMessage = document.createElement("p");
        const text = document.createTextNode(resp.message);
        errorMessage.appendChild(text);
        element.appendChild(errorMessage);
        console.log("Erro");
      }
    });
});
