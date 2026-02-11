const STORAGE_KEY_STATE = 'plintzy_game_state_v4';
const STORAGE_KEY_TIME = 'plintzy_target_time_v4';
const TIMER_DURATION_MS = 45 * 60 * 1000; 

const contentDiv = document.getElementById('main-content');
const sections = {
    login: document.getElementById('section-login'),
    intro: document.getElementById('section-video-intro'),
    timer: document.getElementById('section-timer'),
    fail: document.getElementById('section-fail'),
    success: document.getElementById('section-success')
};
const timerDisplay = document.getElementById('timer-display');
let timerInterval;

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
    
    if (u.value === '' && p.value === '') {
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

        // On s'assure que la vidéo est visible et que le terminal ne la cache pas
        vid.style.display = 'block';

        vid.play();
        
        // Déclenche la suite UNIQUEMENT quand la vidéo est finie
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

    }, 250); // glitch
}

function startCountdownLogic() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const target = parseInt(localStorage.getItem(STORAGE_KEY_TIME));
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            triggerFail();
        } else {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function checkCode() {
    const code = document.getElementById('code-input').value;
    if (code === '') {
        triggerSuccess();
    } else {
        const inp = document.getElementById('code-input');
        inp.classList.add('shake');
        setTimeout(() => inp.classList.remove('shake'), 500);
    }
}

function triggerFail() {
    clearInterval(timerInterval);
    localStorage.setItem(STORAGE_KEY_STATE, 'fail');
    showSection('fail');
    activateGlitchMode(true); 
    setTimeout(() => activateGlitchMode(false), 500);

    const vid = document.getElementById('vid-fail');
    if (vid) {
        vid.play().catch(e => console.log("Lecture bloquée ou erreur :", e));
        vid.loop = false;
    }
}

function triggerSuccess() {
    clearInterval(timerInterval);
    localStorage.setItem(STORAGE_KEY_STATE, 'success');
    showSection('success');
    activateGlitchMode(false);

    const vid = document.getElementById('vid-success');
    if (vid) {
        vid.play().catch(e => console.log("Lecture bloquée ou erreur :", e));
        vid.loop = false;
    }
}

function activateGlitchMode(active) {
    if (active) contentDiv.classList.add('glitch-active');
    else contentDiv.classList.remove('glitch-active');
}

function resetGame() {
    localStorage.removeItem(STORAGE_KEY_STATE);
    localStorage.removeItem(STORAGE_KEY_TIME);
    location.reload();
}

function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.log(`Erreur plein écran: ${err.message}`);
        });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

init();

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 30);

const terminal = document.getElementById('terminal');
const longLogs = [
    'DEBUG: Initializing memory dump at 0x00401000... [ 48 89 E5 48 83 EC 20 48 8D 05 00 00 00 00 48 89 45 F8 ]',
    'NET: Established tunneling through relay node: /dev/nodes/prox-827-alpha/tun0/socket_id=99283746-x92',
    'FS: Scanning directory tree /var/www/plintzy/src/components/auth/middleware/internal/security/headers/',
    'AUTH: Token validation failed: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0',
    'SQL: EXEC sp_execute_external_script @language = N"Python", @script = N"import socket; s=socket.socket(); s.connect((\'10.0.0.1\', 4444))"',
    'SYS: Loading kernel modules: [ nf_conntrack_ipv4, nf_defrag_ipv4, xt_conntrack, nf_nat, iptable_nat, iptable_filter ]',
    'SEC: Intrusion detected from 185.122.45.10; Signature: {TYPE: "BUFFER_OVERFLOW", OFFSET: "0xAF22", PAYLOAD: "SHL-64-NOP"}',
    'DB: Sharding completed for cluster-001 [ Nodes: A-1, A-2, B-1, B-2 ] - Status: Optimal - Latency: 4ms',
    'ENV: Setting up build environment for PLINTZY-APP-V2 (NodeJS 20.x, React 18, Vite, PostgreSQL 15.2)',
    'HEX: 0x00000000  50 4B 03 04 14 00 00 00 08 00 05 54 59 52 1D 7B  PK.........TYR.{',
    'WIFI: WPA2-PSK crack attempt on "Corporate_Guest_5G" using wordlist /usr/share/wordlists/rockyou.txt (4% complete)',
    'SSH: Attempting connection to 10.0.8.254...',
    'AUTH: Password accepted for user "root"',
    'DB: Querying SELECT * FROM users_credentials...',
    'NET: Packet sniffed: TCP 443 -> 127.0.0.1',
    'FS: Mounting /dev/sda1 to /mnt/external',
    'SEC: Firewall rules updated: REJECT all',
    'SYS: Kernel 6.5.0-generic-amd64 loaded',
    'PROC: Terminating process ID 4092 (unresponsive)',
    'ENV: PATH set to /usr/local/sbin:/usr/local/bin:/usr/sbin',
    'SQL: Injecting payload into "id" parameter...',
    'MEM: Allocating 512MB heap memory',
    'IO: Writing to /var/log/syslog',
    'WIFI: Handshake captured for SSID "Freebox_827A"',
    'HTTP: 404 Not Found - /wp-admin/config.php',
    'BRUTE: Testing combination #4829...',
    'PROXY: Routing traffic through node 82.16.4.1',
    'DOCKER: Starting container "plintzy_backend"',
    'GIT: Fetching origin/main...',
    'NMAP: Scanning ports 1-1024...',
    'ROOT: Suid bit detected on /usr/bin/python3',
    'TCP: SYN flood detected on port 80',
    'DNS: Resolving hidden-service.onion...',
    'MAL: Payload "reverse_shell.sh" executed'
];

function addLine() {
    const line = document.createElement('div');
    line.className = 'line';
    
    const timestamp = (new Date()).toLocaleTimeString('fr-FR', { hour12: false }) + '.' + Math.floor(Math.random() * 999);
    const content = longLogs[Math.floor(Math.random() * longLogs.length)];
    
    let processedContent = content;
    if (content.includes('/')) {
        processedContent = content.replace(/\/[\/\w\.-]+/g, '<span class="path">$&</span>');
    }

    line.innerHTML = `<span class="prefix">[${timestamp}]</span> ${processedContent}`;
    terminal.appendChild(line);

    if (terminal.childNodes.length > 70) {
        terminal.removeChild(terminal.firstChild);
    }
    
    window.scrollTo(0, document.body.scrollHeight);

    // Calcul du prochain intervalle entre 50ms et 150ms
    const nextTick = Math.floor(Math.random() * (100 - 0 + 1)) + 50;
    setTimeout(addLine, nextTick);
}

// Lancement de la première ligne
addLine();