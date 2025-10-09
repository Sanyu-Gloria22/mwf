document.addEventListener("DOMContentLoaded", () => {
  console.log("Sales form JavaScript loaded successfully!");
  
  const form = document.getElementById("salesForm");
  const messageBox = document.getElementById("message-box");

  // Check if form exists
  if (!form) {
    console.error("Form not found!");
    return;
  }

  // Inputs with safety checks
  const inputs = {
    customerName: document.getElementById("customerName"),
    productType: document.getElementById("productType"),
    productName: document.getElementById("productName"),
    quantity: document.getElementById("quantity"),
    unitPrice: document.getElementById("unitPrice"),
    paymentMethod: document.getElementById("paymentMethod"),
    totalPrice: document.getElementById("totalPrice"),
    transport: document.getElementById("transportfee"),
    date: document.getElementById("salesDate"),
  };

  // Check if all inputs exist
  for (const [key, input] of Object.entries(inputs)) {
    if (!input && key !== 'transport') {
      console.error(`Input not found: ${key}`);
    }
  }

  // Set today's date
  const today = new Date().toISOString().split("T")[0];
  if (inputs.date) {
    inputs.date.value = today;
    inputs.date.readOnly = true;
    console.log("Date set to:", today);
  }

  // Use stock data from backend or fallback
  const availableStock = typeof stockItems !== "undefined" && stockItems.length > 0 ? stockItems : [
    { productName: "Timber", productType: "Wood", unitPrice: 10000, quantity: 8 },
    { productName: "Poles", productType: "Wood", unitPrice: 5000, quantity: 15 },
    { productName: "Chair", productType: "Furniture", unitPrice: 20000, quantity: 12 },
    { productName: "Table", productType: "Furniture", unitPrice: 25000, quantity: 4 },
  ];

  console.log("Available stock:", availableStock);
  let selectedProduct = null;

  //  Filter products by type
  if (inputs.productType) {
    inputs.productType.addEventListener("change", () => {
      console.log("Product type changed to:", inputs.productType.value);
      const selectedType = inputs.productType.value;
      const filteredProducts = availableStock.filter(
        item => item.productType === selectedType && item.quantity > 0
      );

      if (inputs.productName) {
        inputs.productName.innerHTML = '<option value="">-- Select Product --</option>';

        if (filteredProducts.length > 0) {
          filteredProducts.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.productName;
            opt.textContent = `${item.productName} (${item.quantity} left)`;
            opt.setAttribute('data-price', item.unitPrice);
            opt.setAttribute('data-quantity', item.quantity);
            inputs.productName.appendChild(opt);
          });
          inputs.productName.disabled = false;
        } else {
          const opt = document.createElement("option");
          opt.textContent = "No items available for this type";
          opt.disabled = true;
          inputs.productName.appendChild(opt);
          inputs.productName.disabled = true;
        }
        
        // Reset related fields when product type changes
        if (inputs.unitPrice) inputs.unitPrice.value = "";
        if (inputs.totalPrice) inputs.totalPrice.value = "";
        selectedProduct = null;
      }
    });
  }

  // Auto-fill price when selecting a product
  if (inputs.productName) {
    inputs.productName.addEventListener("change", () => {
      const selectedProductName = inputs.productName.value;
      selectedProduct = availableStock.find(
        item => item.productName === selectedProductName
      );
      console.log("Selected product:", selectedProduct);
      
      if (selectedProduct && inputs.unitPrice) {
        inputs.unitPrice.value = selectedProduct.unitPrice;
        calculateTotal();
      }
    });
  }

  //  Calculating total
  function calculateTotal() {
    if (!inputs.quantity || !inputs.unitPrice || !inputs.totalPrice) return;
    
    const quantity = parseFloat(inputs.quantity.value);
    const unitPrice = parseFloat(inputs.unitPrice.value);
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      let total = quantity * unitPrice;
      if (inputs.transport && inputs.transport.checked) total *= 1.05;
      inputs.totalPrice.value = total.toFixed(0);
    } else {
      inputs.totalPrice.value = "";
    }
  }

  // Add event listeners for calculation
  if (inputs.quantity) {
    inputs.quantity.addEventListener("input", calculateTotal);
  }
  if (inputs.unitPrice) {
    inputs.unitPrice.addEventListener("input", calculateTotal);
  }
  if (inputs.transport) {
    inputs.transport.addEventListener("change", calculateTotal);
  }

  //  Quantity validation
  if (inputs.quantity) {
    inputs.quantity.addEventListener("input", () => {
      const error = document.getElementById("quantityError");
      if (selectedProduct && inputs.quantity.value && error) {
        const entered = parseFloat(inputs.quantity.value);
        if (entered > selectedProduct.quantity) {
          error.textContent = `Only ${selectedProduct.quantity} items left in stock!`;
          error.style.color = "red";
          if (inputs.quantity) inputs.quantity.classList.add("error");
        } else {
          error.textContent = "";
          if (inputs.quantity) inputs.quantity.classList.remove("error");
        }
      }
    });
  }

  //  Modal setup
  const modal = document.getElementById("messageModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeBtn = document.querySelector(".close-btn");

  function showModal(message, type = "success") {
    if (modalMessage && modal) {
      modalMessage.textContent = message;
      modal.style.display = "flex";
      setTimeout(() => {
        if (modal) modal.style.display = "none";
      }, 3000);
    } else {
      alert(message); // Fallback if modal doesn't exist
    }
  }

  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      if (modal) modal.style.display = "none";
    };
    window.onclick = (e) => {
      if (e.target === modal && modal) modal.style.display = "none";
    };
  }

  // Form validation & submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(" Form submission started");

    let valid = true;
    const requiredFields = [
      "customerName",
      "productType",
      "productName",
      "quantity",
      "unitPrice",
      "paymentMethod"
    ];

    // Clear previous errors
    requiredFields.forEach(id => {
      const error = document.getElementById(id + "Error");
      if (error) {
        error.textContent = "";
      }
      if (inputs[id]) {
        inputs[id].classList.remove("error");
      }
    });

    // Validate required fields
    requiredFields.forEach(id => {
      const input = inputs[id];
      const error = document.getElementById(id + "Error");

      if (!input || !input.value.trim()) {
        valid = false;
        if (error) {
          error.textContent = "This field is required.";
        }
        if (input) {
          input.classList.add("error");
        }
      } else if (input.type === "number" && parseFloat(input.value) <= 0) {
        valid = false;
        if (error) {
          error.textContent = "Enter a valid number.";
        }
        if (input) {
          input.classList.add("error");
        }
      }
    });

    // Stock validation
    if (selectedProduct && inputs.quantity && parseFloat(inputs.quantity.value) > selectedProduct.quantity) {
      valid = false;
      const error = document.getElementById("quantityError");
      if (error) {
        error.textContent = `Cannot record sale. Only ${selectedProduct.quantity} items left.`;
        error.style.color = "red";
      }
    }

    if (!valid) {
      showModal("Please fill in all required fields correctly.", "error");
      return;
    }

    //  Success - submit the form
    console.log("All valid, submitting form...");
    showModal("Sale recorded successfully!", "success");

    // Submit the form after delay
    setTimeout(() => {
      form.submit();
    }, 1500);
  });

  console.log(" Sales form JavaScript initialized successfully!");
});