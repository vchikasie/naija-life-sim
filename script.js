const state = {
  day: 1,
  time: 8,
  cash: 250,
  hunger: 75,
  energy: 80,
  mood: 68,
  health: 82,
  reputation: 0,
  currentLocation: 'home',
  log: [
    'Welcome to Naija Life. You woke up with dreams, rent due soon, and barely enough naira in your pocket.'
  ]
};

const locations = {
  home: { name: 'Home', desc: 'Your small room - a place to rest and think.' },
  office: { name: 'Office', desc: 'A regular 9-to-5 with decent pay and zero passion.' },
  street: { name: 'Street Hustle', desc: 'Where the real money moves but risks are high.' },
  market: { name: 'Market', desc: 'Buy food, resell goods, make quick cash.' },
  gym: { name: 'Gym', desc: 'Keep your body sharp and your mind clear.' },
  cafe: { name: 'Internet Café', desc: 'Learn skills, network, and find opportunities.' },
  casino: { name: 'Casino', desc: 'High risk, high reward. Luck is your only ally.' }
};

const ui = {
  dayValue: document.getElementById('dayValue'),
  cashValue: document.getElementById('cashValue'),
  hungerValue: document.getElementById('hungerValue'),
  energyValue: document.getElementById('energyValue'),
  moodValue: document.getElementById('moodValue'),
  healthValue: document.getElementById('healthValue'),
  timeValue: document.getElementById('timeValue'),
  reputationValue: document.getElementById('reputationValue'),
  sceneTitle: document.getElementById('sceneTitle'),
  sceneText: document.getElementById('sceneText'),
  logList: document.getElementById('logList'),
  locationName: document.getElementById('locationName'),
  locationDesc: document.getElementById('locationDesc'),
  resetBtn: document.getElementById('resetBtn')
};

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 12);
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
  ui.hungerValue.textContent = `${Math.round(state.hunger)}%`;
  ui.energyValue.textContent = `${Math.round(state.energy)}%`;
  ui.moodValue.textContent = `${Math.round(state.mood)}%`;
  ui.healthValue.textContent = `${Math.round(state.health)}%`;
  ui.reputationValue.textContent = `${state.reputation}⭐`;
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

function setLocation(locKey) {
  state.currentLocation = locKey;
  ui.locationName.textContent = locations[locKey].name;
  ui.locationDesc.textContent = locations[locKey].desc;
}

function advanceTime(hours = 2) {
  state.time += hours;

  if (state.time >= 24) {
    state.time -= 24;
    state.day += 1;
    addLog(`━━━ DAY ${state.day} BEGINS ━━━ A new sunrise, new hustle, new risks.`);
  }

  state.hunger = clamp(state.hunger - 8);
  state.energy = clamp(state.energy - 6);
  state.mood = clamp(state.mood - 2);
  state.health = clamp(state.health - 1);

  if (state.hunger < 30) {
    state.health = clamp(state.health - 12);
    state.mood = clamp(state.mood - 10);
    addLog('⚠️ WARNING: You are getting weak. Hunger is killing you.');
  }

  if (state.energy < 25) {
    state.mood = clamp(state.mood - 8);
    addLog('⚠️ WARNING: Exhaustion is setting in. Rest before you crash.');
  }

  if (state.cash < 0) {
    state.cash = 0;
  }
}

function checkEndState() {
  if (state.health <= 0) {
    setScene('💀 Game Over', 'Your health gave out. Rest was not optional. You learned too late.');
    disableActions();
    return true;
  }

  if (state.hunger <= 0) {
    setScene('💀 Game Over', 'You collapsed from starvation. In the hustle, you forgot to eat.');
    disableActions();
    return true;
  }

  if (state.cash >= 3000) {
    setScene('🏆 YOU WON', `You reached ₦${formatMoney(state.cash)}! Survival is won. Now the real game begins — how to keep it and grow it smart.`);
    disableActions();
    return true;
  }

  return false;
}

function disableActions() {
  document.querySelectorAll('.action-btn').forEach((button) => {
    button.disabled = true;
  });
}

function doTurn(action) {
  if (checkEndState()) {
    return;
  }

  let sceneTitle = 'Busy';
  let sceneText = '';
  let logMsg = '';
  let location = 'home';

  switch (action) {
    case 'work':
      setLocation('office');
      state.cash += 200;
      state.energy = clamp(state.energy - 24);
      state.hunger = clamp(state.hunger - 20);
      state.mood = clamp(state.mood - 6);
      sceneTitle = '💼 Shift Complete';
      sceneText = 'The job is soul-draining, but your pocket is a little heavier.';
      logMsg = 'Worked a full shift at the office. Money in, energy out.';
      break;

    case 'hustle':
      setLocation('street');
      const hustleRoll = Math.random();
      if (hustleRoll > 0.5) {
        state.cash += 350;
        state.reputation += 1;
        sceneTitle = '🚀 Hustle Paid Off';
        sceneText = 'You spotted an opportunity and moved fast. The streets rewarded your speed.';
        logMsg = 'Big hustle move — found a solid opportunity and made real money!';
      } else if (hustleRoll > 0.2) {
        state.cash += 120;
        state.energy = clamp(state.energy - 16);
        state.mood = clamp(state.mood - 8);
        sceneTitle = '🚀 Hustle Struggle';
        sceneText = 'The hustle was tough but you made some cash. Risky but necessary.';
        logMsg = 'Street hustle came through but took a toll on your energy and mood.';
      } else {
        state.cash = clamp(state.cash - 50, 0, 999999);
        state.mood = clamp(state.mood - 15);
        state.energy = clamp(state.energy - 20);
        sceneTitle = '⚠️ Hustle Failed';
        sceneText = 'Not every move works out. You lost money and morale today.';
        logMsg = 'The hustle backfired. Lost cash and confidence.';
      }
      break;

    case 'eat':
      setLocation('market');
      state.cash = clamp(state.cash - 150, 0, 999999);
      state.hunger = clamp(state.hunger + 40);
      state.mood = clamp(state.mood + 15);
      sceneTitle = '🍜 Meal Satisfaction';
      sceneText = 'Hot jollof rice and cold drink. Life feels possible again.';
      logMsg = 'Had a proper meal at the market. Hunger solved, mood lifted.';
      break;

    case 'rest':
      setLocation('home');
      state.energy = clamp(state.energy + 30);
      state.mood = clamp(state.mood + 12);
      state.health = clamp(state.health + 8);
      sceneTitle = '😴 Well Rested';
      sceneText = 'A good sleep reset your body. You feel ready to take on the world again.';
      logMsg = 'Rested well. Energy and health restored.';
      break;

    case 'study':
      setLocation('cafe');
      state.reputation += 2;
      state.energy = clamp(state.energy - 16);
      state.mood = clamp(state.mood + 8);
      sceneTitle = '📚 Learning Path';
      sceneText = 'Knowledge is the real wealth. Every skill learned opens new doors.';
      logMsg = 'Studied hard. Your reputation grew — people are noticing you.';
      break;

    case 'exercise':
      setLocation('gym');
      state.health = clamp(state.health + 14);
      state.energy = clamp(state.energy - 14);
      state.mood = clamp(state.mood + 12);
      sceneTitle = '💪 Body Strength';
      sceneText = 'Sweat, pain, progress. Your body is your tool in this life.';
      logMsg = 'Hit the gym. Stronger body, clearer mind.';
      break;

    case 'visit-market':
      setLocation('market');
      const marketRoll = Math.random();
      if (marketRoll > 0.6) {
        state.cash += 280;
        state.reputation += 1;
        sceneTitle = '🏪 Market Win';
        sceneText = 'You spotted a resale opportunity. Quick thinking, quick profit.';
        logMsg = 'Found goods at the market and resold them for profit!';
      } else {
        state.cash += 80;
        state.mood = clamp(state.mood - 4);
        sceneTitle = '🏪 Market Hustle';
        sceneText = 'The market is unpredictable. Small win today.';
        logMsg = 'Made a little money from market trading.';
      }
      break;

    case 'network':
      setLocation('cafe');
      state.reputation += 2;
      state.mood = clamp(state.mood + 10);
      state.energy = clamp(state.energy - 10);
      state.hunger = clamp(state.hunger - 8);
      sceneTitle = '👥 Connection Made';
      sceneText = 'Relationships are currency. You made a valuable connection today.';
      logMsg = 'Networked and made new connections. Reputation grew.';
      break;

    case 'gamble':
      setLocation('casino');
      const gambleRoll = Math.random();
      if (gambleRoll > 0.7) {
        state.cash += 500;
        state.mood = clamp(state.mood + 20);
        sceneTitle = '🎲 JACKPOT!';
        sceneText = 'Lady Luck smiled on you today. Big win! But remember: luck runs out.';
        logMsg = 'WON BIG at the casino! Luck was on your side.';
      } else if (gambleRoll > 0.3) {
        state.cash = clamp(state.cash - 100, 0, 999999);
        state.mood = clamp(state.mood - 12);
        sceneTitle = '🎲 Gamble Loss';
        sceneText = 'The house always wins eventually. You lost money today.';
        logMsg = 'Lost money at the casino. Gambling is a losing game.';
      } else {
        state.cash = clamp(state.cash - 250, 0, 999999);
        state.mood = clamp(state.mood - 20);
        state.health = clamp(state.health - 5);
        sceneTitle = '🎲 Disaster';
        sceneText = 'You lost big. The rush became crushing despair. Gambling is a trap.';
        logMsg = 'LOST BIG at the casino. Never gamble with money you need to survive.';
      }
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
  addLog(logMsg);
  updateStats();
  renderLog();
  checkEndState();
}

function resetGame() {
  if (confirm('Are you sure? This will reset everything.')) {
    state.day = 1;
    state.time = 8;
    state.cash = 250;
    state.hunger = 75;
    state.energy = 80;
    state.mood = 68;
    state.health = 82;
    state.reputation = 0;
    state.currentLocation = 'home';
    state.log = [
      'Welcome to Naija Life. You woke up with dreams, rent due soon, and barely enough naira in your pocket.'
    ];

    document.querySelectorAll('.action-btn').forEach((button) => {
      button.disabled = false;
    });

    setLocation('home');
    setScene('Early morning hustle', 'You wake up in your room with a tight budget and a long day ahead.');
    updateStats();
    renderLog();
  }
}

// Event listeners
document.querySelectorAll('.action-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    doTurn(action);
  });
});

ui.resetBtn.addEventListener('click', resetGame);

// Initialize
updateStats();
renderLog();
setLocation('home');
