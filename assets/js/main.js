// Initialize selectedLanguage
const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Language-specific messages
const messages = {
    en: {
        screenshot: "Please take a screenshot of this code.",
        success: 'Feedback sent successfully!',
        failure: 'Failed to send feedback. Please try again later.',
        chooseLanguage: 'Choose your language:'
    },
    es: {
        screenshot: "Por favor, toma una captura de pantalla de este código.",
        success: '¡Comentarios enviados con éxito!',
        failure: 'No se pudo enviar los comentarios. Por favor, inténtelo de nuevo más tarde.',
        chooseLanguage: 'Elige tu idioma:'
    },
    de: {
        screenshot: "Bitte machen Sie einen Screenshot dieses Codes.",
        success: 'Feedback erfolgreich gesendet!',
        failure: 'Feedback konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
        chooseLanguage: 'Wählen Sie Ihre Sprache:'
    },
    fr: {
        screenshot: "Veuillez prendre une capture d'écran de ce code.",
        success: 'Retour envoyé avec succès!',
        failure: 'Échec de l\'envoi des commentaires. Veuillez réessayer plus tard.',
        chooseLanguage: 'Choisissez votre langue:'
    },
    it: {
        screenshot: "Per favore, fai uno screenshot di questo codice.",
        success: 'Feedback inviato con successo!',
        failure: 'Invio del feedback non riuscito. Per favore riprova più tardi.',
        chooseLanguage: 'Scegli la tua lingua:'
    }
};

// Function to change the language
function changeLanguage() {
    const select = document.getElementById('language-select');
    const newLanguage = select.value;
    localStorage.setItem('selectedLanguage', newLanguage);
    updateContent(newLanguage);
    updateLanguageLabel(newLanguage);
}

// Function to update content based on selected language
function updateContent(language) {
    document.querySelectorAll(`[data-${language}]`).forEach(element => {
        const key = `data-${language}`;
        if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = element.getAttribute(key);
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = element.getAttribute(key);
        } else {
            element.innerHTML = element.getAttribute(key);
        }
    });

    const titleElement = document.querySelector('title');
    document.title = titleElement.getAttribute(`data-${language}`) || 'Default Title';
}

// Function to update the language label
function updateLanguageLabel(language) {
    const languageLabel = document.getElementById('language-label');
    languageLabel.textContent = messages[language].chooseLanguage;
}

// Photon script
(function ($) {
    var $window = $(window),
        $body = $('body');

    breakpoints({
        xlarge: ['1141px', '1680px'],
        large: ['981px', '1140px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['321px', '480px'],
        xxsmall: [null, '320px']
    });

    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 50);
    });

    $('.scrolly').scrolly();
})(jQuery);

// Function to initialize the carousel
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelector('.slides');
    const images = slides.querySelectorAll('img');

    images.forEach(img => {
        const clone = img.cloneNode(true);
        slides.appendChild(clone);
    });

    let currentIndex = 0;
    const totalImages = slides.children.length;
    const imageWidth = carousel.clientWidth;

    function nextSlide() {
        currentIndex++;
        slides.style.transition = 'transform 0.5s ease';
        slides.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

        if (currentIndex === totalImages / 2) {
            setTimeout(() => {
                slides.style.transition = 'none';
                currentIndex = 0;
                slides.style.transform = 'translateX(0)';
            }, 500);
        }
    }

    setInterval(nextSlide, 4000);
}

// Function to initialize the image slider
function initImageSlider() {
    let currentIndex = 0;
    const images = document.querySelectorAll('#image-slider .slider img');
    const totalImages = images.length;
    let intervalId;

    if (totalImages === 0) {
        console.error('No images found for the image slider.');
        return;
    }

    function showImage(index) {
        images[currentIndex].classList.remove('active');
        currentIndex = index;
        images[currentIndex].classList.add('active');
    }

    function showNextImage() {
        showImage((currentIndex + 1) % totalImages);
    }

    function showPrevImage() {
        showImage((currentIndex - 1 + totalImages) % totalImages);
    }

    function startSlideshow() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(showNextImage, 3000);
    }

    function stopSlideshow() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    showImage(0);
    startSlideshow();

    const slider = document.querySelector('#image-slider');

    slider.addEventListener('mouseenter', stopSlideshow);
    slider.addEventListener('mouseleave', startSlideshow);

    slider.addEventListener('click', (e) => {
        const sliderRect = slider.getBoundingClientRect();
        const clickX = e.clientX - sliderRect.left;

        if (clickX < sliderRect.width / 2) {
            showPrevImage();
        } else {
            showNextImage();
        }

        startSlideshow();
    });
}

// Function to generate random code
function generateCode() {
    const code = `Jackson ${Math.floor(100 + Math.random() * 900)}`;
    const codeModal = document.getElementById('codeModal');
    const codeDisplay = document.getElementById('generatedCode');
    const instructionDisplay = document.getElementById('screenshotInstruction');

    codeDisplay.innerHTML = code;
    instructionDisplay.innerHTML = messages[selectedLanguage].screenshot;
    codeModal.style.display = 'block';

    setTimeout(closeModal, 60000);
}

// Function to close the modal
function closeModal() {
    document.getElementById('codeModal').style.display = 'none';
}

// Function to fetch EmailJS configuration
function fetchEmailJSConfig() {
    return fetch('https://quintana7.com/api/emailjs-config')
        .then(response => response.json())
        .catch(error => {
            console.error('Failed to fetch EmailJS config:', error);
            throw error;
        });
}

// Function to handle form submission
function handleFormSubmission() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const userLang = selectedLanguage;
        const userMessages = messages[userLang] || messages['en'];

        const senderEmail = this.querySelector('input[name="email"]').value;
        const senderName = this.querySelector('input[name="name"]').value;
        const messageContent = this.querySelector('textarea[name="message"]').value;

        fetchEmailJSConfig().then(config => {
            emailjs.init(config.publicKey);
            const formData = new FormData(this);

            formData.append('from_email', senderEmail);
            formData.append('from_name', senderName);
            formData.append('message', messageContent);

            return emailjs.sendForm(config.serviceId, config.templateId, this);
        }).then(() => {
            alert(userMessages.success);
            document.getElementById('contact-form').reset();
        }).catch((error) => {
            alert(userMessages.failure);
            console.error('FAILED...', error);
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('language-select').value = savedLanguage;
    updateContent(savedLanguage);
    updateLanguageLabel(savedLanguage);

    initCarousel();
    initImageSlider();
    handleFormSubmission();
    closeModal();
});