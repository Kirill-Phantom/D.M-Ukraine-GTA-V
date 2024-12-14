document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('application-form');
    const pages = document.querySelectorAll('.page');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const clearBtns = document.querySelectorAll('.clear-btn');
    let currentPage = 0;

    function showPage(pageIndex) {
        pages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.display = 'block';
                animatePageElements(page);
            } else {
                page.style.display = 'none';
            }
        });
    }

    function animatePageElements(page) {
        anime({
            targets: page.querySelectorAll('.animated-text'),
            opacity: [0, 1],
            translateY: [20, 0],
            easing: 'easeOutExpo',
            duration: 1000,
            delay: anime.stagger(200)
        });

        anime({
            targets: page.querySelectorAll('.animated-input'),
            opacity: [0, 1],
            translateX: [-20, 0],
            easing: 'easeOutExpo',
            duration: 800,
            delay: anime.stagger(100)
        });

        anime({
            targets: page.querySelectorAll('.animated-button'),
            opacity: [0, 1],
            scale: [0.9, 1],
            easing: 'easeOutExpo',
            duration: 600,
            delay: anime.stagger(100)
        });
    }

    function setupRangeInputs() {
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            const valueDisplay = input.nextElementSibling;
            input.addEventListener('input', () => {
                valueDisplay.textContent = input.value;
            });
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    });

    clearBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Ви впевнені, що хочете очистити всю форму?')) {
                form.reset();
                currentPage = 0;
                showPage(currentPage);
                setupRangeInputs();
            }
        });
    });

    const hadBansRadios = document.querySelectorAll('input[name="hadBans"]');
    const banReasonField = document.getElementById('banReason');
    const banQuestion = document.querySelector('.ban-question');

    hadBansRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                banReasonField.style.display = 'block';
                banQuestion.classList.add('expanded');
            } else {
                banReasonField.style.display = 'none';
                banQuestion.classList.remove('expanded');
            }
        });
    });

    const hadExperienceRadios = document.querySelectorAll('input[name="hadExperience"]');
    const experienceReasonField = document.getElementById('experienceReason');
    const experienceQuestion = document.querySelector('.experience-question');

    hadExperienceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                experienceReasonField.style.display = 'block';
                experienceQuestion.classList.add('expanded');
            } else {
                experienceReasonField.style.display = 'none';
                experienceQuestion.classList.remove('expanded');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Створюємо об'єкт з даними форми
        const formData = new FormData(form);
        const data = {
            Email: formData.get('email'),
            ПІБ: formData.get('fullName'),
            Вік: formData.get('age'),
            Telegram: formData.get('telegram'),
            Discord: formData.get('discord'),
            Адекватність: formData.get('adequacy'),
            Стресостійкість: formData.get('stressResistance'),
            Швидкість_навчання: formData.get('learningSpeed'),
            Риси_характеру: formData.get('traits'),
            Блокування: formData.get('hadBans'),
            Причина_блокування: formData.get('banReason') || 'Немає',
            Досвід_модерації: formData.get('hadExperience'),
            Опис_досвіду: formData.get('experienceReason') || 'Немає',
            Командний_гравець: formData.get('isTeamPlayer'),
            Наявність_мікрофону: formData.get('hasMicrophone'),
            Години_на_модерацію: formData.get('hoursAvailable'),
            Згода_на_ЧС: formData.get('acceptBlacklist')
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwuBirpo62jRCwaMxUtK09leW5QeefX7EioDLhwAoObzCA0M6UDSPBwvoWkI4GUmzpK/exec', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            if (result.result === 'success') {
                alert('Заявка успішно відправлена!');
                form.reset();
                currentPage = 0;
                showPage(currentPage);
                setupRangeInputs();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Виникла помилка при відправці заявки. Будь ласка, спробуйте ще раз.');
        }
    });

    showPage(currentPage);
    setupRangeInputs();
});

