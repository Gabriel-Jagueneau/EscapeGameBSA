const code = '';
const password = '';
const username = '';

const STORAGE_KEY_STATE = 'game_state';
const STORAGE_KEY_TIME = 'target_time';
const TIMER_DURATION_MS = 45 * 60 * 1000; 

const contentDiv = document.getElementById('incubateur-login');
const sections = {
    login: document.getElementById('section-login'),
    intro: document.getElementById('section-video-intro'),
    timer: document.getElementById('section-timer'),
    fail: document.getElementById('section-fail'),
    success: document.getElementById('section-success')
};

const timerDisplay = document.getElementById('timer-display');
let timerInterval;

let glitchTimeout;
let isFinished = false;

function init() {
    const state = localStorage.getItem(STORAGE_KEY_STATE) || 'login';
    
    if (state === 'intro') {
        showSection('intro');
        setTimeout(transitionToTimer, 2000);
    } else if (state === 'timer') {
        showSection('timer');
        startCountdownLogic();
    } else if (state === 'fail') {
        showSection('fail');
        activateGlitchMode(true);
    } else if (state === 'success') {
        showSection('success');
    } else {
        showSection('login');
    }
}

function showSection(name) {
    Object.values(sections).forEach(el => el.classList.remove('active'));
    if (sections[name]) sections[name].classList.add('active');
}

function attemptLogin() {
    const u = document.getElementById('login-user');
    const p = document.getElementById('login-pass');
    
    if (u.value === username && p.value === password) {
        transitionToIntro();
    } else {
        u.classList.add('shake');
        p.classList.add('shake');
        setTimeout(() => {
            u.classList.remove('shake');
            p.classList.remove('shake');
            u.value = '';
            p.value = '';
        }, 500);
    }
}

// Étape 1 : Glitch -> Intro
function transitionToIntro() {
    contentDiv.classList.add('glitch-active');
    
    setTimeout(() => {
        contentDiv.classList.remove('glitch-active');
        localStorage.setItem(STORAGE_KEY_STATE, 'intro');
        showSection('intro');

        const vid = document.getElementById('vid-intro');
        vid.style.display = 'block';
        vid.play();
        vid.onended = () => {
            transitionToTimer();
        };

    }, 250); 
}

// Étape 2 : Intro -> Glitch -> Timer
function transitionToTimer() {
    contentDiv.classList.add('glitch-active');

    setTimeout(() => {
        contentDiv.classList.remove('glitch-active');
        
        let targetTime = localStorage.getItem(STORAGE_KEY_TIME);
        if (!targetTime) {
            targetTime = Date.now() + TIMER_DURATION_MS;
            localStorage.setItem(STORAGE_KEY_TIME, targetTime);
        }
        
        localStorage.setItem(STORAGE_KEY_STATE, 'timer');
        showSection('timer');
        
        startCountdownLogic();
        scheduleRandomGlitch();

    }, 250);
}

function startCountdownLogic() {
    clearInterval(timerInterval);
    const stressAudio = document.getElementById('snd-stress');
    const bellAudio = document.getElementById('snd-bell');
    const timerText = document.getElementById('timer-display');
    
    stressAudio.loop = false;
    stressAudio.volume = 0.15;

    bellAudio.volume = 1;

    timerInterval = setInterval(() => {
        const targetStr = localStorage.getItem(STORAGE_KEY_TIME);
        if (!targetStr) return;

        const target = parseInt(targetStr);
        const now = Date.now();
        const diff = target - now;
        const timeLeftInAudio = stressAudio.duration - stressAudio.currentTime;

        if (isFinished || diff <= 0) {
            if (!isFinished) {
                timerText.textContent = "00:00";
                timerText.classList.add('blink');
            }

            if (!isNaN(stressAudio.duration)) {
                if (timeLeftInAudio <= 2 || stressAudio.ended) {
                    clearInterval(timerInterval);
                    isFinished ? triggerSuccess() : triggerFail();
                    return;
                }
            }
        }

        if (!isFinished && diff > 0) {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if ((minutes === 30 || minutes === 15) && seconds === 0) {
                bellAudio.play().catch(() => {});
            }

            if (diff <= 5 * 60 * 1000) {
                timerText.style.color = "red";
                
                if (stressAudio.paused) {
                    const offset = (5 * 60) - (diff / 1000);

                    if (stressAudio.readyState >= 1) {
                        stressAudio.currentTime = offset;
                        stressAudio.play().catch(e => console.warn("Autoplay bloqué au refresh"));
                    } else {
                        stressAudio.addEventListener('loadedmetadata', () => {
                            stressAudio.currentTime = offset;
                            stressAudio.play().catch(() => {});
                        }, { once: true });
                    }
                }
            } else {
                timerText.style.color = "#fff";
            }
        }
    }, 1000);
}

function scheduleRandomGlitch() {
    const randomDelay = Math.floor(Math.random() * (25000 - 15000 + 1) + 15000);
    clearTimeout(glitchTimeout);

    glitchTimeout = setTimeout(() => {
        if (localStorage.getItem(STORAGE_KEY_STATE) === 'timer') {
            
            contentDiv.classList.add('glitch-active');
            setTimeout(() => {
                contentDiv.classList.remove('glitch-active');
                scheduleRandomGlitch();
            }, 200);
        }
    }, randomDelay);
}

function checkCode() {
    const codeEntered = document.getElementById('code-input').value;
    const stressAudio = document.getElementById('snd-stress');
    const timerText = document.getElementById('timer-display');

    if (codeEntered === code) {
        isFinished = true;
        
        timerText.style.color = "rgb(55, 212, 71)";
        timerText.classList.remove('blink');
        
        if (stressAudio.duration) {
            stressAudio.currentTime = stressAudio.duration - 11;
            stressAudio.play()
        }

    } else {
        const inp = document.getElementById('code-input');
        inp.classList.add('shake');
        setTimeout(() => {
            inp.classList.remove('shake');
            inp.value = '';
        }, 500);
    }
}

function triggerFail() {
    clearInterval(timerInterval);
    clearTimeout(glitchTimeout);
    document.getElementById('snd-stress').pause();
    
    localStorage.setItem(STORAGE_KEY_STATE, 'fail');
    showSection('fail');
    activateGlitchMode(true); 
    setTimeout(() => {
        activateGlitchMode(false);
    }, 250);
    
    const vid = document.getElementById('vid-fail');
    if (vid) { 
        vid.play(); 
    }
}

function triggerSuccess() {
    clearInterval(timerInterval);
    clearTimeout(glitchTimeout);
    document.getElementById('snd-stress').pause();

    localStorage.setItem(STORAGE_KEY_STATE, 'success');
    showSection('success');
    activateGlitchMode(false);
    
    const vid = document.getElementById('vid-success');
    if (vid) { 
        vid.play(); 
    }
}

function activateGlitchMode(active) {
    if (active) contentDiv.classList.add('glitch-active');
    else contentDiv.classList.remove('glitch-active');
}

init();

function doGlitchShort() {
    activateGlitchMode(true);
    setTimeout(() => {
        activateGlitchMode(false);
    }, 200);
}