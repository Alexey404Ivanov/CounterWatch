const findButton = document.getElementById("find-button");

let selectedTanks = [];
let selectedDps = [];
let selectedSupports = [];

let roleDict = {
  "Танк": selectedTanks,
  "Урон": selectedDps,
  "Поддержка": selectedSupports
}

document.querySelectorAll(".hero").forEach(btn => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    const roleName = btn.closest(".role").querySelector(".role-title").textContent;
    addHero(roleName, img.alt, img.src);
  });
});

document.querySelectorAll(".selected-role").forEach(roleBlock => {
  const roleName = roleBlock.id;
  roleBlock.querySelectorAll(".selected-hero").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      removeHero(roleName, index);
        findButton.style.display = "none";
    });
  });
});

function addHero(roleName, heroName, imageUrl) {
  const selectedHeroes = roleDict[roleName];
  if (selectedHeroes.includes(heroName)) return; // предотвращаем дублирование героев

  if (roleName !== "Танк" && selectedHeroes.length === 2) {
    alert("Роль уже набрана! Удалите героя, чтобы добавить нового.");
    return;
  }

  selectedHeroes.push(heroName);
  let heroes = document.getElementById(roleName).querySelectorAll(".selected-hero")
  for (let hero of heroes) {
    let img = hero.querySelector("img")
    if (!img) {
      img = document.createElement("img");
      hero.appendChild(img)
      img.src = imageUrl;
      break;
    }
  }
  let heroesCount = selectedTanks.length + selectedDps.length + selectedSupports.length;
  if (heroesCount === 5) findButton.style.display = "block";
}

function removeHero(roleName, idx) {
  const selectedHeroes = roleDict[roleName];
  let heroes = document.getElementById(roleName).querySelectorAll(".selected-hero")
  if (roleName === "Танк") {
    selectedHeroes.pop()
    heroes[0].removeChild(heroes[0].querySelector("img"))
    return;
  }
  if (idx === 0) {
    if (selectedHeroes.length === 2) {
      selectedHeroes.shift();
      heroes[0].querySelector("img").src = heroes[1].querySelector("img").src;
      heroes[1].removeChild(heroes[1].querySelector("img"))
    }
    else {
      selectedHeroes.pop()
      heroes[0].removeChild(heroes[0].querySelector("img"))
    }
  }

  else {
    selectedHeroes.pop();
    heroes[1].removeChild(heroes[1].querySelector("img"))
  }
}

async function showCounterPicks() {
    const response = await fetch("/get_counters", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heroes: selectedTanks.concat(selectedDps, selectedSupports)
        })
    });

    if (response.ok) {
        const dict = await response.json();

    } else {
        console.error("Ошибка при получении контрпиков");
    }
}