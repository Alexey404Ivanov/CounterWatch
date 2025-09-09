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
    const lastResult = document.getElementById("counters-container");
    lastResult.style.display = "none";
    const img = btn.querySelector("img");
    const roleName = btn.closest(".role").querySelector(".role-title").textContent;
    addRemoveHero(roleName, img.alt, img.src);
  });
});

// document.querySelectorAll(".selected-role").forEach(roleBlock => {
//   const roleName = roleBlock.id;
//   roleBlock.querySelectorAll(".selected-hero").forEach((btn, index) => {
//     btn.addEventListener("click", () => {
//       const img = btn.querySelector("img");
//       addRemoveHero(roleName, img.alt, img.src);
//     });
//   });
// });

function convertIconImage(imageUrl, toNormal) {
  return toNormal ? imageUrl.replace("/black-white/", "/normal/") : imageUrl.replace("/normal/", "/black-white/");
}

function addRemoveHero(roleName, heroName, imageUrl) {
  const selectedHeroes = roleDict[roleName];
  const heroButton = document.querySelector(`.hero img[alt="${heroName}"]`).closest('button');

  if (selectedHeroes.includes(heroName)) {
    const idx = selectedHeroes.indexOf(heroName);
    removeHero(roleName,idx);
    let currentImage = document.querySelector(`button.hero img[alt="${heroName}"]`);
    currentImage.src = convertIconImage(currentImage.src, true);
    findButton.style.display = "none";
    return;
  }

  if (roleName !== "Танк" && selectedHeroes.length === 2 || roleName === "Танк" && selectedHeroes.length === 1) {
    alert("Роль уже набрана! Удалите героя, чтобы добавить нового.");
    return;
  }
  let currentImage = document.querySelector(`button.hero img[alt="${heroName}"]`);
  currentImage.src = convertIconImage(imageUrl, false);
  selectedHeroes.push(heroName);
  let heroes = document.getElementById(roleName).querySelectorAll(".selected-hero")
  for (let hero of heroes) {
    let img = hero.querySelector("img")
    if (!img) {
      img = document.createElement("img");
      hero.appendChild(img)
      img.src = imageUrl;
      img.alt = heroName;
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

async function getCounterPicks() {
    const full_team = selectedTanks.concat(selectedDps, selectedSupports);
    const response = await fetch("http://127.0.0.1:8000/get_counters", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heroes: full_team
        })
    });

    if (response.ok) {
        const dict = await response.json();
        showCounterPicks(dict, full_team);
    } else {
        console.error("Ошибка при получении контрпиков");
    }
}

const iconMap = {
  "Ана": "ana.png",
  "Эш": "ashe.png",
  "Батист": "baptiste.png",
  "Бастион": "bastion.png",
  "Бригитта": "brig.png",
  "Кэссиди": "cassidy.png",
  "Кулак_Смерти": "doomfist.png",
  "D.Va": "dva.png",
  "Дзеньятта": "dzen.png",
  "Эхо": "echo.png",
  "Гэндзи": "genji.png",
  "Таран": "hammond.png",
  "Хандзо": "hanzo.png",
  "Азарт": "hazard.png",
  "Турбосвин": "hog.png",
  "Иллари": "illari.png",
  "Крысавчик": "junkrat.png",
  "Юнона": "juno.png",
  "Кирико": "kiriko.png",
  "Лусио": "lucio.png",
  "Мауга": "mauga.png",
  "Мэй": "mei.png",
  "Ангел": "mercy.png",
  "Мойра": "moira.png",
  "Ориса": "orisa.png",
  "Фарра": "pharah.png",
  "Королева_Стервятников": "queen.png",
  "Раматтра" : "ram.png",
  "Жнец": "reaper.png",
  "Райнхардт": "rein.png",
  "Сигма": "sigma.png",
  "Соджорн": "sojourn.png",
  "Солдат-76": "soldier.png",
  "Сомбра": "sombra.png",
  "Симметра": "sym.png",
  "Торбьорн": "torb.png",
  "Трейсер": "tracer.png",
  "Авентюра": "venture.png",
  "Ткач_Жизни": "weaver.png",
  "Роковая_Вдова": "widow.png",
  "Уинстон": "winston.png",
  "Заря": "zarya.png",
  };

function showCounterPicks(responseDict) {
  const container = document.getElementById("counters-container");
  container.innerHTML = ""; // очищаем старый вывод

  const countersObj = responseDict.counters;

  for (const [hero, counters] of Object.entries(countersObj)) {
    // Карточка героя
    const heroCard = document.createElement("div");
    heroCard.classList.add("counter-note");

    // Заголовок героя
    const header = document.createElement("div");
    header.classList.add("note-header");

    const heroIcon = document.createElement("img");
    heroIcon.src = `/static/mini-icons/${iconMap[hero]}`;
    heroIcon.alt = hero;
    heroIcon.classList.add("hero-icon");

    const heroName = document.createElement("h2");
    heroName.classList.add("hero-name");
    let isUnderLine = hero.indexOf('_') !== -1
    heroName.textContent = isUnderLine ? hero.replace('_', ' ') : hero;

    header.appendChild(heroIcon);
    header.appendChild(heroName);

    // Контент
    const content = document.createElement("div");
    content.classList.add("note-content");

    const counterBlock = document.createElement("div");
    counterBlock.classList.add("counter-block");

    // Контрящие герои
    counters.forEach(([counterName, description]) => {
      const counterItem = document.createElement("div");
      counterItem.classList.add("counter-item");

      const counterHeroName = counterName.split(" ")[0]; // берем имя без (Сильный/Слабый)
      const counterIcon = document.createElement("img");
      counterIcon.src = `/static/mini-icons/${iconMap[counterHeroName]}`;
      counterIcon.alt = counterHeroName;
      counterIcon.classList.add("counter-icon");

      const counterText = document.createElement("p");
      let isUnderLine = counterHeroName.indexOf('_') !== -1
      counterName = isUnderLine ? counterName.replace('_', ' ') : counterName;
      counterText.innerHTML = `<strong>${counterName}:</strong> ${description}`;

      counterItem.appendChild(counterIcon);
      counterItem.appendChild(counterText);
      counterBlock.appendChild(counterItem);
    });

    content.appendChild(counterBlock);
    heroCard.appendChild(header);
    heroCard.appendChild(content);

    container.appendChild(heroCard);

    container.style.display = "block";
    const scrollTarget = document.getElementById("counters-container");
    const topOffset = 0;
    const elementPosition = scrollTarget.getBoundingClientRect().top;
    const offsetPosition = elementPosition - topOffset;

    window.scrollBy({
        top: offsetPosition,
        behavior: "smooth"
    });
  }
}
