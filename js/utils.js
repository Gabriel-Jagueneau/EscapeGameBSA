function openFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.log(`Erreur plein écran: ${err.message}`);
        });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function resetGame() {
    clearInterval(timerInterval);
    clearTimeout(glitchTimeout);

    const stressAudio = document.getElementById('snd-stress');
    const bellAudio = document.getElementById('snd-bell');

    if (stressAudio) {
        stressAudio.pause();
        stressAudio.currentTime = 0;
    }
    if (bellAudio) {
        bellAudio.pause();
        bellAudio.currentTime = 0;
    }

    localStorage.removeItem(STORAGE_KEY_STATE);
    localStorage.removeItem(STORAGE_KEY_TIME);

    location.reload();
}

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.browser-content');
const addressBars = document.querySelectorAll('.addresses-bar .address');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        addressBars.forEach(bar => bar.classList.add('hidden'));
        if (addressBars[index]) {
            addressBars[index].classList.remove('hidden');
        }

        contents.forEach(content => content.classList.add('hidden'));
        if (contents[index]) {
            contents[index].classList.remove('hidden');
        }
    });
});