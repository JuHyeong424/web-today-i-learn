const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilItem = tilList.querySelector(".til-item");

tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const tilDate = document.getElementById("til-date").value;
  const tilTitle = document.getElementById("til-title").value;
  const tilContent = document.getElementById("til-content").value;

  const newTilItem = tilItem.cloneNode(true);
  
  newTilItem.querySelector("time").textContent = tilDate;
  newTilItem.querySelector("h3").textContent = tilTitle;
  newTilItem.querySelector("p").textContent = tilContent;

  tilList.prepend(newTilItem);

  tilForm.reset();
});

tilForm.addEventListener("reset", function (event) {
  tilForm.reset();
})
