const state = {
  day: 1,
  time: 8,
  cash: 250,
  hunger: 75,
  energy: 80,
  mood: 68,
  health: 82,
  reputation: 0,
  log: [
    'You woke up with dreams, rent due soon, and barely enough change in your pocket.'
  ]
};

const MAX = {
  hunger: 100,
  energy: 100,
  mood: 100,
  health: 100
};

const ui = {
  dayValue: document.getElementById('dayValue'),
  cashValue: document.getElementById('cashValue'),
  hungerValue: document.getElementById('hungerValue'),
  energyValue: document.getElementById('energyValue'),
  moodValue: document.getElementById('moodValue'),
  healthValue: document.getElementById('healthValue'),
  timeValue: document.getElementById('timeValue'),
  sceneTitle: document.getElementById('sceneTitle'),
  sceneText: document.getElementById('sceneText'),
  logList: document.getElementById('logList')
};

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

function updateClock() {
  const suffix = state.time >= 12 ? 'PM' : 'AM';
  const hour = state.time % 12 === 0 ? 12 : state.time % 12;
  ui.timeValue.textContent = `${hour}:00 ${suffix}`;
  ui.dayValue.textContent = state.day;
}

function formatMoney(amount) {
  return `₦ ${Math.max(0, Math.round(amount)).toLocaleString()}`;
}

function updateStats() {
  ui.cashValue.textContent = formatMoney(state.cash);
  ui.hungerValue.textContent = `${state.hunger}%`;
  ui.energyValue.textContent = `${state.energy}%`;
  ui.moodValue.textContent = `${state.mood}%`;
  ui.healthValue.textContent = `${state.health}%`;
  updateClock();
}

function renderLog() {
  ui.logList.innerHTML = '';
  state.log.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    ui.logList.appendChild(item);
  });
}

function setScene(title, text) {
  ui.sceneTitle.textContent = title;
  ui.sceneText.textContent = text;
}

function advanceTime(hours = 2) {
  state.time += hours;

  if (state.time >= 24) {
    state.time -= 24;
    state.day += 1;
    addLog(`A new day begins. Day ${state.day} starts with hope and pressure.`);
  }

  state.hunger = clamp(state.hunger - 8);
  state.energy = clamp(state.energy - 6);
  state.mood = clamp(state.mood - 2);
  state.health = clamp(state.health - 1);

  if (state.hunger < 25) {
    state.health = clamp(state.health - 10);
    state.mood = clamp(state.mood - 8);
    addLog('You are getting weak from hunger. Eat before your body gives out.');
  }

  if (state.energy < 20) {
    state.mood = clamp(state.mood - 8);
    addLog('You are exhausted. A proper rest could save the day.');
  }

  if (state.cash < 0) {
    state.cash = 0;
  }
}

function checkEndState() {
  if (state.health <= 0 || state.hunger <= 0) {
    setScene('Game Over', 'You collapsed from neglect and the grind beat you. Try to balance work, food, and rest.');
    disableActions();
    return true;
  }

  if (state.cash >= 3000) {
    setScene('You Made It', 'You have enough cash to breathe. Survival is won — keep your hustle smart and your health intact.');
    disableActions();
    return true;
  }

  return false;
}

function disableActions() {
  document.querySelectorAll('.action-btn').forEach((button) => {
    button.disabled = true;
    button.style.opacity = '0.5';
  });
}

function doTurn(action, summary) {
  if (checkEndState()) {
    return;
  }

  let sceneTitle = 'Busy day';
  let sceneText = summary;

  switch (action) {
    case 'work':
      state.cash += 180;
      state.energy = clamp(state.energy - 22);
      state.hunger = clamp(state.hunger - 18);
      state.mood = clamp(state.mood - 5);
      sceneTitle = 'Shift over';
      sceneText = 'The workday was tiring, but your wallet has a little more breathing room.';
      break;
    case 'hustle':
      const jackpot = Math.random();
      if (jackpot > 0.6) {
        state.cash += 280;
        state.reputation += 1;
        sceneTitle = 'Smart hustle';
        sceneText = 'You found a side opportunity and the money came through fast.';
      } else {
        state.cash += 100;
        state.energy = clamp(state.energy - 18);
        state.mood = clamp(state.mood - 8);
        sceneTitle = 'Risky hustle';
        sceneText = 'The hustle paid, but it came with stress and lost time.';
      }
      break;
    case 'eat':
      state.cash = clamp(state.cash - 120, 0, 999999);
      state.hunger = clamp(state.hunger + 30);
      state.mood = clamp(state.mood + 12);
      sceneTitle = 'Meal time';
      sceneText = 'A hot meal steadied you and kept your head clear for the rest of the day.';
      break;
    case 'rest':
      state.energy = clamp(state.energy + 24);
      state.mood = clamp(state.mood + 10);
      state.health = clamp(state.health + 6);
      sceneTitle = 'Recovery break';
      sceneText = 'A little rest reset your body and your mood for the next push.';
      break;
    case 'study':
      state.reputation += 1;
      state.energy = clamp(state.energy - 14);
      state.mood = clamp(state.mood + 4);
      sceneTitle = 'Skills grow';
      sceneText = 'You sharpened your ability and opened up better opportunities later.';
      break;
    case 'exercise':
      state.health = clamp(state.health + 10);
      state.energy = clamp(state.energy - 12);
      state.mood = clamp(state.mood + 8);
      sceneTitle = 'Body reset';
      sceneText = 'You moved your body and felt stronger, calmer, and more ready to face the grind.';
      break;
    default:
      break;
  }

  advanceTime(2);

  if (state.cash < 0) {
    state.cash = 0;
  }

  state.health = clamp(state.health);
  state.energy = clamp(state.energy);
  state.hunger = clamp(state.hunger);
  state.mood = clamp(state.mood);

  setScene(sceneTitle, sceneText);
  addLog(summary);
  updateStats();
  renderLog();
  checkEndState();
}

document.querySelectorAll('.action-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const messages = {
      work: 'You worked a long shift and earned some money.',
      hustle: 'You chased a side opportunity and pushed for more cash.',
      eat: 'You bought food and took care of your body.',
      rest: 'You took a rest and regained some strength.',
      study: 'You spent time learning and improving yourself.',
      exercise: 'You exercised to keep your body and mind sharp.'
    };

    doTurn(action, messages[action]);
  });
});

updateStats();
renderLog();
setScene('Early morning hustle', 'You wake up in your room with a tight budget and a long day ahead.');
