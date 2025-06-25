function formatEuro(value) {
  return value.toFixed(3) + ' €';
}

let landingPrice = null;
let lastCalculatedSalesPrice = null;

function calculateLandingPrice() {
  const totalCost = parseFloat(document.getElementById("totalCost").value);
  const quantity = parseFloat(document.getElementById("quantity").value);

  if (isNaN(totalCost) || totalCost <= 0 || isNaN(quantity) || quantity <= 0) {
    document.getElementById("landingPrice").innerText = '-';
    landingPrice = null;
    return;
  }

  landingPrice = totalCost / quantity;
  document.getElementById("landingPrice").innerText = formatEuro(landingPrice);

  const takeover = document.getElementById("takeOverToggle").checked;
  const priceAInput = document.getElementById("priceA");

  if (takeover) {
    priceAInput.value = landingPrice.toFixed(2);
    priceAInput.readOnly = true;
    priceAInput.style.backgroundColor = '#e0e0e0';
  }

  calculate();
}

function calculate() {
  const A = parseFloat(document.getElementById("priceA").value);
  const F_percent = parseFloat(document.getElementById("discountF").value);
  const toggleOn = document.getElementById("takeOverToggle").checked;
  const dpCostSelection = document.getElementById("dpCostSelect").value;

  if (isNaN(A) || A <= 0 || isNaN(F_percent) || F_percent < 0) {
    document.getElementById("salesPriceInput").value = '';
    document.getElementById("pcost").innerText = '-';
    document.getElementById("profit").innerText = '-';
    document.getElementById("discountPrice").innerText = '-';
    return;
  }

  const F = F_percent / 100;
  const B = toggleOn ? A : A * 1.9;
  const C = B * 6;
  const baseC = (C < 6 ? 6 : C);

  let dpValue = 2.0;
  if (dpCostSelection === "1.1") {
    dpValue = 1.3;
  }

  const D = baseC + dpValue - (F * baseC);
  const G = dpValue + ((0.065 * D) + (0.04 * D) + 0.3 + 0.18);
  const E = D - B - G;
  const discountPrice = baseC * 0.70;

  lastCalculatedSalesPrice = D;
  document.getElementById("salesPriceInput").value = D.toFixed(2);
  document.getElementById("pcost").innerText = formatEuro(G);
  document.getElementById("profit").innerText = formatEuro(E);
  document.getElementById("discountPrice").innerText = formatEuro(discountPrice);
}

function reverseCalculateFromSalesPrice() {
  const salesPrice = parseFloat(document.getElementById("salesPriceInput").value);
  const A = parseFloat(document.getElementById("priceA").value);
  const F_percent = parseFloat(document.getElementById("discountF").value);
  const dpCostSelection = document.getElementById("dpCostSelect").value;

  if (isNaN(salesPrice) || isNaN(A) || isNaN(F_percent)) return;

  const F = F_percent / 100;
  let B = A;
  if (!document.getElementById("takeOverToggle").checked) {
    B = A * 1.9;
  }

  let dpValue = 2.0;
  if (dpCostSelection === "1.1") {
    dpValue = 1.3;
  }

  const D = salesPrice;
  const G = dpValue + ((0.065 * D) + (0.04 * D) + 0.3 + 0.18);
  const E = D - B - G;

  const baseC = (B * 6 < 6 ? 6 : B * 6);
  const discountPrice = baseC * 0.70;

  document.getElementById("pcost").innerText = formatEuro(G);
  document.getElementById("profit").innerText = formatEuro(E);
  document.getElementById("discountPrice").innerText = formatEuro(discountPrice);
}

// Event Listeners
document.getElementById("takeOverToggle").addEventListener("change", function () {
  const priceAInput = document.getElementById("priceA");
  if (this.checked && landingPrice !== null) {
    priceAInput.value = landingPrice.toFixed(2);
    priceAInput.readOnly = true;
    priceAInput.style.backgroundColor = '#e0e0e0';
  } else {
    priceAInput.readOnly = false;
    priceAInput.style.backgroundColor = '#ffffff';
  }
  calculate();
});

document.getElementById("dpCostSelect").addEventListener("change", function () {
  if (document.getElementById("salesPriceInput") === document.activeElement) {
    reverseCalculateFromSalesPrice();
  } else {
    calculate();
  }
});

document.getElementById("priceA").addEventListener("input", calculate);
document.getElementById("discountF").addEventListener("input", calculate);
document.getElementById("salesPriceInput").addEventListener("input", reverseCalculateFromSalesPrice);
