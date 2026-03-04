const container = document.getElementById('scroll-engine');
const sectionner = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');
const watermarkContainer = document.getElementById('watermark-container');

// Créer les filigranes
sectionner.forEach((s, i) => {
    const img = s.querySelector('.visual-img');
    if(img) {
        const bg = document.createElement('img');
        bg.src = img.src; bg.className = 'bg-watermark-img';
        bg.id = `bg-${s.id}`;
        watermarkContainer.appendChild(bg);
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            sectionner.forEach(s => s.classList.remove('active'));
            entry.target.classList.add('active');
            document.body.className = `theme-${id}`;
            
            navItems.forEach(item => {
                item.classList.toggle('active', item.getAttribute('href').includes(id));
            });

            document.querySelectorAll('.bg-watermark-img').forEach(bg => {
                bg.classList.toggle('active', bg.id === `bg-${id}`);
            });
        }
    });
}, { root: container, threshold: 0.5 });

sectionner.forEach(s => observer.observe(s));