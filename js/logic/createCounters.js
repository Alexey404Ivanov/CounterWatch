const powerLevels = {
  1: "Слабый",
  2: "Средний",
  3: "Сильный",
};

function addPower(counterDict, name, power) {
  counterDict[name] = (counterDict[name] || 0) + power;
}

function createCounterPickDict(enemyTeam) {
  const counterTank = heroLibrary[enemyTeam[0]][0];

  let tankCountersPower = {};
  let dpsCountersPower = {};
  let supCountersPower = {};

  let countersLibrary = [];

  for (let enemyHeroName of enemyTeam) {
    const currentHero = heroLibrary[enemyHeroName];

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

  const topDps = Object.entries(dpsCountersPower)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const topSup = Object.entries(supCountersPower)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const ourTeamNames = [
    counterTank.name,
    topDps[0][0],
    topDps[1][0],
    topSup[0][0],
    topSup[1][0],
  ];

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


