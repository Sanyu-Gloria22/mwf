
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

  
    const customerName = form.customerName.value.trim();
    const productType = form.productType.value.trim();
    const productName = form.productName.value.trim();
    const quantity = form.quantity.value.trim();
    const unitPrice = form.unitPrice.value.trim();
    const saleDate = form.saleDate.value;
    const paymentType = form.paymentType.value;
    const agentName = form.agentName.value.trim();
    const transport = form.transport.checked;

    if (!customerName) return alert("Please enter customer name.");
    if (!productType) return alert("Please enter product type.");
    if (!productName) return alert("Please enter product name.");
    if (quantity <= 0) return alert("Quantity must be greater than 0.");
    if (unitPrice <= 0) return alert("Price per unit must be greater than 0.");
    if (!saleDate) return alert("Please select a sale date.");
    if (!agentName) return alert("Please enter sales agent name.");

    let totalPrice = quantity * unitPrice;
    if (transport) {
      totalPrice *= 1.05; 
    }

    alert(
      `Sale recorded!\n\nCustomer: ${customerName}\nProduct: ${productName}\nSales Agent Name: ${agentName}\nQuantity: ${quantity}\nTotal Price: ${totalPrice.toFixed(
        2
      )} UGX`
    );

    form.reset();
  });
});
