// Check if notification is allowed, otherwise ask the user to allow the
// notifications.
const pomoduroNotifyCheck = () => {
    if (Notification.permission === 'granted') {
        console.log('Notifications: enabled');
    } else {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notifications: enabled');
            }
        });
    }
};

const pomoduroSoundNotify = () => new Audio('res/audio/notify.mp3').play();

const pomoduroNotifyMessage = (notifyMessage) => {
    new Notification('POMODURO', {
        // icon: 'res/icons/pomoDuro-white.png',
        icon: '🍅',
        body: notifyMessage,
    });
};

const pomoduroSendNotify = (notifyMessage) => {
    pomoduroNotifyMessage(notifyMessage);
    pomoduroSoundNotify();
};

// If the 'study' and 'break' in localStorage does not exist, set its value to
// '25' and '5', respectively.
const pomoduroStudyTime = localStorage.getItem('study') || '25';
const pomoduroBreakTime = localStorage.getItem('break') || '5';

let pomoduroTimer = document.getElementById('pomoduroTimer');
let timerControlButton = document.getElementById('timerControlButton');

pomoduroTimer.innerText =
    pomoduroStudyTime < 10
        ? pomoduroStudyTime + ':00'
        : pomoduroStudyTime + ':00';

let intervalID, countDown, minute;

const pomoduroReset = () => {
    countDown = pomoduroStudyTime * 60;
    document.title = '🍅 POMODURO';
    pomoduroTimer.innerText = pomoduroStudyTime + ':00';
};

// Start pomoDuro timer.
const pomoDuroStartTimer = () => {
    pomoduroSendNotify(
        pomoduroTimer.getAttribute('name') === 'study' ? '💻' : '☕'
    );
    timerControlButton.value = '⏸️ PAUSE';
    // timerControlButton.style.color = '#561981';
    // timerControlButton.style.backgroundColor = '#ffffff';
    timerControlButton.onclick = () => {
        pomoDuroPauseTimer();
    };

    countDown =
        pomoduroTimer.getAttribute('name') === 'study'
            ? pomoduroStudyTime * 60
            : pomoduroBreakTime * 60;

    intervalID = setInterval(() => {
        countDown--;
        minute = (countDown / 60) >> (countDown / 60) % 1;
        document.title = minute + ':' + (countDown % 60) + ' | 🍅 POMODURO';
        pomoduroTimer.innerText = minute + ':' + (countDown % 60);

        if (countDown === 0) {
            pomoDuroResetTimer();
            pomoduroReset();
        }
    }, 1000);
};

const pomoDuroPauseTimer = () => {
    updateButton();
    clearInterval(intervalID);
};

const pomoDuroResetTimer = () => {
    // timerControlButton.style.backgroundColor = 'transparent';
    // timerControlButton.style.color = '#ffffff';
    timerControlButton.style = 'hover';
    pomoduroSendNotify('☕');
    updateButton();
    clearInterval(intervalID);
    pomoduroReset();
};

const updateButton = () => {
    timerControlButton.value = '▶️ START';
    timerControlButton.onclick = () => {
        pomoDuroStartTimer();
    };
};

const pomoduroSwitchTimerMode = () => {
    let pomodoro_study = document.getElementById('pomodoro-study');
    let pomodoro_break = document.getElementById('pomodoro-break');
    let pomodoro_timer = document.getElementById('pomoduroTimer');

    // pomodoro_study.style = 'background-color: #561981';

    pomodoro_study.addEventListener('click', () => {
        pomodoro_study.style.backgroundColor = '#dbdcdd';
        pomodoro_study.style.color = '#121212';
        pomodoro_break.style = 'none';
        pomodoro_timer.setAttribute('name', 'study');
        pomodoro_timer.innerText = pomoduroStudyTime + ':00';
    });

    pomodoro_break.addEventListener('click', () => {
        pomodoro_break.style.backgroundColor = '#dbdcdd';
        pomodoro_break.style.color = '#121212';
        pomodoro_study.style.backgroundColor = 'transparent';
        pomodoro_study.style.color = '#121212';
        pomodoro_timer.setAttribute('name', 'break');
        pomodoro_timer.innerText = pomoduroBreakTime + ':00';
    });
};

pomoduroSwitchTimerMode();
pomoduroNotifyCheck();
