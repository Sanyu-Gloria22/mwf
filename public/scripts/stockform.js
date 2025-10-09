document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Stock form validation loaded');

    const form = document.getElementById('stockForm');
    const submitBtn = document.getElementById('submitBtn');

    // Form elements
    const elements = {
        productType: document.getElementById('productType'),
        productName: document.getElementById('productName'),
        quantity: document.getElementById('quantity'),
        costPrice: document.getElementById('costPrice'),
        productPrice: document.getElementById('productPrice'),
        quality: document.getElementById('quality'),
        color: document.getElementById('color'),
        measurement: document.getElementById('measurement'),
        date: document.getElementById('date'),
        totalPrice: document.getElementById('totalPrice'),
        supplierName: document.getElementById('supplierName')
    };

    // Error messages
    const errorMessages = {
        productType: 'Please select a product type',
        productName: 'Product name is required and must be at least 2 characters long',
        quantity: 'Quantity is required and must be at least 1',
        costPrice: 'Cost price is required and must be greater than 0',
        productPrice: 'Selling price is required and must be greater than 0',
        quality: 'Please select a quality level',
        color: 'Please enter a valid color',
        measurement: 'Please select a measurement',
        date: 'Please select a valid date',
        totalPrice: 'Total price is required',
        supplierName: 'Supplier name is required and must be at least 2 characters long'
    };

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (elements.date) {
        elements.date.min = today;
        elements.date.value = today;
    }

    // Auto-calculate total price
    function calculateTotalPrice() {
        const quantity = parseFloat(elements.quantity.value) || 0;
        const costPrice = parseFloat(elements.costPrice.value) || 0;
        const total = quantity * costPrice;
        
        if (elements.totalPrice) {
            elements.totalPrice.value = total.toFixed(2);
        }
    }

    // Add event listeners for auto-calculation
    if (elements.quantity) {
        elements.quantity.addEventListener('input', calculateTotalPrice);
    }
    if (elements.costPrice) {
        elements.costPrice.addEventListener('input', calculateTotalPrice);
    }

    // Real-time validation
    Object.keys(elements).forEach(field => {
        if (elements[field]) {
            elements[field].addEventListener('blur', function() {
                validateField(field, this.value);
            });
            
            elements[field].addEventListener('input', function() {
                clearError(field);
            });
        }
    });

    // Field validation function
    function validateField(fieldName, value) {
        let isValid = true;
        let message = '';

        switch (fieldName) {
            case 'productType':
                isValid = value !== '';
                message = errorMessages.productType;
                break;
                
            case 'productName':
                isValid = value.trim().length >= 2;
                message = errorMessages.productName;
                break;
                
            case 'quantity':
                isValid = !isNaN(value) && parseFloat(value) >= 1;
                message = errorMessages.quantity;
                break;
                
            case 'costPrice':
                isValid = !isNaN(value) && parseFloat(value) > 0;
                message = errorMessages.costPrice;
                break;
                
            case 'productPrice':
                isValid = !isNaN(value) && parseFloat(value) > 0;
                message = errorMessages.productPrice;
                break;
                
            case 'quality':
                isValid = value !== '';
                message = errorMessages.quality;
                break;
                
            case 'color':
                isValid = value.trim() === '' || value.trim().length >= 2;
                message = errorMessages.color;
                break;
                
            case 'measurement':
                isValid = value !== '';
                message = errorMessages.measurement;
                break;
                
            case 'date':
                isValid = value !== '' && new Date(value) <= new Date();
                message = 'Please select a valid date (cannot be in the future)';
                break;
                
            case 'totalPrice':
                isValid = !isNaN(value) && parseFloat(value) > 0;
                message = errorMessages.totalPrice;
                break;
                
            case 'supplierName':
                isValid = value.trim().length >= 2;
                message = errorMessages.supplierName;
                break;
        }

        if (!isValid) {
            showError(fieldName, message);
        } else {
            clearError(fieldName);
        }

        return isValid;
    }

    // Show error function
    function showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = elements[fieldName];
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
        }
    }

    // Clear error function
    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = elements[fieldName];
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        }
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        Object.keys(elements).forEach(field => {
            if (elements[field] && elements[field].hasAttribute('required')) {
                if (!validateField(field, elements[field].value)) {
                    isValid = false;
                }
            }
        });

        // Additional business logic validation
        const costPrice = parseFloat(elements.costPrice.value) || 0;
        const sellingPrice = parseFloat(elements.productPrice.value) || 0;
        
        if (sellingPrice < costPrice) {
            showError('productPrice', 'Selling price should not be less than cost price');
            isValid = false;
        }

        return isValid;
    }

    // Modal functions
    function showModal(message, type = 'success') {
        const modal = document.getElementById('messageModal');
        const modalMessage = document.getElementById('modalMessage');
        
        if (modal && modalMessage) {
            modalMessage.textContent = message;
            modalMessage.className = type;
            modal.style.display = 'block';
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }

    // Close modal
    const closeBtn = document.querySelector('.close-btn');
    const modal = document.getElementById('messageModal');
    
    if (closeBtn && modal) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Adding Stock... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            
            // Submit the form after a brief delay to show loading state
            setTimeout(() => {
                form.submit();
            }, 1000);
        } else {
            showModal('Please fix the errors in the form before submitting.', 'error');
            
            // Scroll to first error
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Initial calculation
    calculateTotalPrice();
});