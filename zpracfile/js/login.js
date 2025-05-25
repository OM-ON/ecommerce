function validateLoginForm() {
    // Get input elements and error spans
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");
  
    // Clear previous error messages
    emailError.textContent = "";
    passwordError.textContent = "";
  
    let isValid = true;
  
    // Email validation: Basic regex for email format
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
    if (!emailRegex.test(emailValue)) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }
  
    // Password validation:
    // - At least 6 characters
    // - Must contain at least one letter (A-Z or a-z)
    // - Must contain at least one number (0-9)
    const passwordValue = passwordInput.value.trim();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Regex for the password
    if (!passwordRegex.test(passwordValue)) {
      passwordError.textContent =
        "Password must be at least 6 characters long, include at least one letter and one number.";
      isValid = false;
    }
  
    return isValid; // Prevent form submission if validation fails
  }
  