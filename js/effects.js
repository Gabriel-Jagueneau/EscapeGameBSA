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

    const nextTick = Math.floor(Math.random() * (100 - 0 + 1)) + 50;
    setTimeout(addLine, nextTick);
}

addLine();