// TODO: TIL 폼 등록 기능을 구현하세요
// 1. 폼 요소와 목록 요소를 querySelector로 선택합니다.
// 2. 폼의 submit 이벤트를 감지하여 새 TIL 항목을 목록에 추가합니다.

const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilItem = tilList.querySelector(".til-item");

tilForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // TODO: 입력값을 가져와서 새 TIL 항목을 만들어 목록에 추가하세요
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
