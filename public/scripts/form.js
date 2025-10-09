document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('submitBtn');

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s-()]{10,}$/,
        fullName: /^[a-zA-Z\s]{2,50}$/,
        userName: /^[a-zA-Z0-9_]{3,20}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    // Error messages
    const errorMessages = {
        fullName: 'Full name must be 2-50 characters long and contain only letters and spaces',
        email: 'Please enter a valid email address',
        userName: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
        gender: 'Please select a gender',
        role: 'Please select a role',
        phoneNumber: 'Please enter a valid phone number (at least 10 digits)',
        address: 'Please enter a valid address',
        date: 'Please select a date',
        status: 'Please select a status',
        password: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
    };

    // Real-time validation
    const inputs = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        userName: document.getElementById('userName'),
        gender: document.getElementById('gender'),
        role: document.getElementById('role'),
        phoneNumber: document.getElementById('phoneNumber'),
        address: document.getElementById('address'),
        date: document.getElementById('date'),
        status: document.getElementById('status'),
        password: document.getElementById('password')
    };

    // Add input event listeners for real-time validation
    Object.keys(inputs).forEach(field => {
        if (inputs[field]) {
            inputs[field].addEventListener('blur', function() {
                validateField(field, this.value);
            });
            
            inputs[field].addEventListener('input', function() {
                clearError(field);
            });
        }
    });

    // File validation for profile picture
    const profilePicture = document.getElementById('profilePicture');
    if (profilePicture) {
        profilePicture.addEventListener('change', function(e) {
            validateFile(this);
        });
    }

    function validateField(fieldName, value) {
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
                isValid = patterns.fullName.test(value.trim());
                errorMessage = errorMessages.fullName;
                break;
            case 'email':
                isValid = patterns.email.test(value.trim());
                errorMessage = errorMessages.email;
                break;
            case 'userName':
                isValid = patterns.userName.test(value.trim());
                errorMessage = errorMessages.userName;
                break;
            case 'gender':
                isValid = value !== '';
                errorMessage = errorMessages.gender;
                break;
            case 'role':
                isValid = value !== '';
                errorMessage = errorMessages.role;
                break;
            case 'phoneNumber':
                isValid = patterns.phone.test(value.replace(/\s/g, ''));
                errorMessage = errorMessages.phoneNumber;
                break;
            case 'address':
                isValid = value.trim().length >= 5;
                errorMessage = errorMessages.address;
                break;
            case 'date':
                isValid = value !== '';
                errorMessage = errorMessages.date;
                break;
            case 'status':
                isValid = value !== '';
                errorMessage = errorMessages.status;
                break;
            case 'password':
                isValid = patterns.password.test(value);
                errorMessage = errorMessages.password;
                break;
        }

        if (!isValid) {
            showError(fieldName, errorMessage);
        } else {
            clearError(fieldName);
        }

        return isValid;
    }

    function validateFile(fileInput) {
        const errorElement = document.getElementById('profilePictureError');
        const file = fileInput.files[0];
        
        if (!file) return true;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            showError('profilePicture', 'Please select a valid image file (JPEG, PNG, GIF)');
            fileInput.value = '';
            return false;
        }

        if (file.size > maxSize) {
            showError('profilePicture', 'Image size must be less than 5MB');
            fileInput.value = '';
            return false;
        }

        clearError('profilePicture');
        return true;
    }

    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    function validateForm() {
        let isValid = true;
        
        Object.keys(inputs).forEach(field => {
            if (inputs[field] && inputs[field].hasAttribute('required')) {
                if (!validateField(field, inputs[field].value)) {
                    isValid = false;
                }
            }
        });

        // Validate file if selected
        if (profilePicture && profilePicture.files.length > 0) {
            if (!validateFile(profilePicture)) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Registering... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            
            // Submit the form
            this.submit();
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Password toggle function
    window.togglePassword = function() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    };

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});