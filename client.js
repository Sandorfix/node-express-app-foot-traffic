// client.js - Pure client-side version
document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS with your public key
  emailjs.init('ZIwDQ1nnE0mh_XGLl');

  // Form submission handler
  document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    emailjs.sendForm(
      'service_i84ghgi',    // Your service ID
      'template_ymava9c',   // Your template ID
      this                 // The form element
    )
    .then(() => alert('Message sent successfully!'))
    .catch(() => alert('Failed to send message'));
  });
});