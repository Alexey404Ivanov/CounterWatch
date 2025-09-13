import { heroLibrary } from "../data/heroLibrary.js";

const powerLevels = {
  1: "Слабый",
  2: "Средний",
  3: "Сильный",
};

// heroLibrary у тебя уже есть (мы его сделали ранее)

// утилита для суммирования в словаре
function addPower(counterDict, name, power) {
  counterDict[name] = (counterDict[name] || 0) + power;
}

// главная функция
export function createCounterPickDict(enemyTeam) {
  // берем самого первого врага и его топ-танк контрпик
  const counterTank = heroLibrary[enemyTeam[0]][0];

  // словари сил для каждой роли
  let tankCountersPower = {};
  let dpsCountersPower = {};
  let supCountersPower = {};

  // хранилище всех контрпиков (для последующего формирования result)
  let countersLibrary = [];

  // проходимся по всем врагам
  for (let enemyHeroName of enemyTeam) {
    const currentHero = heroLibrary[enemyHeroName];

    // одна универсальная функция чтобы не дублировать код
    function processCounters(counters, roleDict) {
      for (let counter of counters) {
        countersLibrary.push([
          enemyHeroName,
          counter.name,
          counter.power,
          counter.reason,
        ]);
        addPower(roleDict, counter.name, counter.power);
      }
    }

    processCounters(currentHero.slice(0, 3), tankCountersPower);
    processCounters(currentHero.slice(3, 6), dpsCountersPower);
    processCounters(currentHero.slice(6,), supCountersPower);
  }

  // берем топ-2 дпс и топ-2 саппорта по суммарной силе
  const topDps = Object.entries(dpsCountersPower)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const topSup = Object.entries(supCountersPower)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  // итоговая наша команда
  const ourTeamNames = [
    counterTank.name,
    topDps[0][0],
    topDps[1][0],
    topSup[0][0],
    topSup[1][0],
  ];

  // собираем словарь финального результата
  let resultDict = {};

  for (let heroName of ourTeamNames) {
    resultDict[heroName] = [];

    for (let [enemy, counterName, power, reason] of countersLibrary) {
      if (counterName === heroName) {
        resultDict[heroName].push([
          `${enemy} (${powerLevels[power]})`,
          reason,
        ]);
      }
    }
  }

  return resultDict;
}


