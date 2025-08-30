const selectedSlots = document.querySelectorAll(".slot");
const findButton = document.getElementById("find-button");

let selectedHeroes = [];

function addHero(imageUrl) {
  if (selectedHeroes.length >= 5) return;

  selectedHeroes.push(imageUrl);
  selectedSlots[selectedHeroes.length - 1].style.backgroundImage = `url('${imageUrl}')`;

  if (selectedHeroes.length === 5) {
    findButton.style.display = "inline-block";
  }
}

// потом сюда добавим генерацию кнопок персонажей
