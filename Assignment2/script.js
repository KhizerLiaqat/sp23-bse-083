document.getElementById('contactForm').addEventListener('click', function (event) {
  event.preventDefault();
  let isValid = true;

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const addressField = document.getElementById('address');
  const cityField = document.getElementById('city');

  if (nameField.value.trim().length < 6 || nameField.value.trim().length > 9) {
    nameField.classList.add('is-invalid');
    isValid = false;
  } else {
    nameField.classList.remove('is-invalid');
    nameField.classList.add('is-valid');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailField.value.trim())) {
    emailField.classList.add('is-invalid');
    isValid = false;
  } else {
    emailField.classList.remove('is-invalid');
    emailField.classList.add('is-valid');
  }

  if (addressField.value.trim().length < 10) {
    addressField.classList.add('is-invalid');
    isValid = false;
  } else {
    addressField.classList.remove('is-invalid');
    addressField.classList.add('is-valid');
  }

  if (cityField.value.trim().length < 5) {
    cityField.classList.add('is-invalid');
    isValid = false;
  } else {
    cityField.classList.remove('is-invalid');
    cityField.classList.add('is-valid');
  }

  if (isValid) {
    alert('Form submitted successfully!');
  }
});
