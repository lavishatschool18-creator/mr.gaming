let clickCount = 0;
let clickMultiplier = 1;
let autoclickerActive = false;
const clickButton = document.getElementById('click-button');
const scoreDisplay = document.getElementById('score-display');
const resetButton = document.getElementById('reset-button');
const STORAGE_KEY_COUNT = 'nilayClickerCount';
const STORAGE_KEY_MULTIPLIER = 'nilayClickerMultiplier';
const STORAGE_KEY_AUTOCLICKER = 'nilayClickerAutoclicker';

const UPGRADES = {
    'upgrade-2x': { cost: 100, multiplier: 2 },
    'upgrade-4x': { cost: 1000, multiplier: 4 },
    'upgrade-8x': { cost: 10000, multiplier: 8 },
    'upgrade-100x': { cost: 1000000, multiplier: 100 },
    'autoclicker': { cost: 20000, action: 'autoclick' }
};

function saveState() {
    localStorage.setItem(STORAGE_KEY_COUNT, clickCount);
    localStorage.setItem(STORAGE_KEY_MULTIPLIER, clickMultiplier);
    localStorage.setItem(STORAGE_KEY_AUTOCLICKER, autoclickerActive);
}

function loadState() {
    const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
    const savedMultiplier = localStorage.getItem(STORAGE_KEY_MULTIPLIER);
    const savedAutoclicker = localStorage.getItem(STORAGE_KEY_AUTOCLICKER);
    
    if (savedCount !== null) {
        clickCount = parseInt(savedCount, 10);
    }
    if (savedMultiplier !== null) {
        clickMultiplier = parseInt(savedMultiplier, 10);
    }
    if (savedAutoclicker === 'true') {
        autoclickerActive = true;
    }
}

function updateScore() {
    scoreDisplay.textContent = 'Clicks: ' + clickCount.toLocaleString();
    updateStoreButtons();
}

function updateStoreButtons() {
    for (const key in UPGRADES) {
        const button = document.getElementById(key);
        if (button) {
            const upgrade = UPGRADES[key];
            const isPurchased = (key === 'autoclicker' && autoclickerActive) || (upgrade.multiplier > 1 && upgrade.multiplier <= clickMultiplier);
            
            if (isPurchased) {
                button.disabled = true;
                button.textContent = (upgrade.action === 'autoclick' ? 'Autoclicker ACTIVE' : `x${upgrade.multiplier} ACTIVE`);
            } else {
                button.disabled = clickCount < upgrade.cost;
            }
        }
    }
}

function handleUpgrade(id) {
    const upgrade = UPGRADES[id];
    if (clickCount >= upgrade.cost) {
        clickCount -= upgrade.cost;
        if (upgrade.multiplier) {
            clickMultiplier = upgrade.multiplier;
        } else if (upgrade.action === 'autoclick') {
            autoclickerActive = true;
            startAutoclicker();
        }
        updateScore();
        saveState();
    }
}

function startAutoclicker() {
    if (autoclickerActive) {
        setInterval(() => {
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            clickButton.dispatchEvent(event);
        }, 1000);
    }
}

loadState();
updateScore();
clickButton.addEventListener('click', () => {
    clickCount += clickMultiplier;
    updateScore();
    saveState();
});

resetButton.addEventListener('click', () => {
    clickCount = 0;
    clickMultiplier = 1;
    autoclickerActive = false;
    updateScore();
    saveState();
    location.reload();
});
document.getElementById('upgrade-2x').addEventListener('click', () => handleUpgrade('upgrade-2x'));
document.getElementById('upgrade-4x').addEventListener('click', () => handleUpgrade('upgrade-4x'));
document.getElementById('upgrade-8x').addEventListener('click', () => handleUpgrade('upgrade-8x'));
document.getElementById('upgrade-100x').addEventListener('click', () => handleUpgrade('upgrade-100x'));
document.getElementById('autoclicker').addEventListener('click', () => handleUpgrade('autoclicker'));
if (autoclickerActive) {
    startAutoclicker();
}