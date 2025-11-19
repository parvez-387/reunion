// ---------------------------
// Guest toggle
// ---------------------------
const bringGuest = document.getElementById("bringGuest");
const guestCountContainer = document.getElementById("guestCountContainer");
const guestInfo = document.getElementById("guestInfo");

bringGuest.addEventListener("change", function () {
  if (this.checked) {
    guestCountContainer.style.display = "block";
    guestInfo.style.display = "block";
  } else {
    guestCountContainer.style.display = "none";
    guestInfo.style.display = "none";
  }
});

// ---------------------------
// Payment Info
// ---------------------------
const paymentMethodSelect = document.getElementById("paymentMethod");
const paymentNumberBox = document.getElementById("paymentNumberBox");
const paymentNumber = document.getElementById("paymentNumber");
const paymentMethodLabel = document.getElementById("paymentMethodLabel");
const paymentNote = document.getElementById("paymentNote");
const copyPaymentBtn = document.getElementById("copyPaymentBtn");

const paymentData = {
  "bKash": { number: "01XXXXXXXXX", label: "bKash Payment Number", note: "Send your payment and enter the Transaction ID below.", color: "#d9006b" },
  "Nagad": { number: "017YYYYYYYY", label: "Nagad Payment Number", note: "Send your payment and enter the Transaction ID below.", color: "#ff6600" },
  "Rocket": { number: "018ZZZZZZZ", label: "Rocket Payment Number", note: "Send your payment and enter the Transaction ID below.", color: "#8D2F93" }
};

function updatePaymentBox() {
  const method = paymentMethodSelect.value;
  if (paymentData[method]) {
    const data = paymentData[method];
    paymentNumber.textContent = data.number;
    paymentMethodLabel.textContent = data.label;
    paymentNote.textContent = data.note;
    paymentNumberBox.style.display = "flex";
    paymentNumberBox.style.borderLeft = `4px solid ${data.color}`;
    paymentMethodLabel.style.color = data.color;
  } else {
    paymentNumberBox.style.display = "none";
  }
}

paymentMethodSelect.addEventListener("change", updatePaymentBox);

copyPaymentBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(paymentNumber.textContent)
    .then(() => alert(paymentNumber.textContent + " copied to clipboard!"))
    .catch(() => alert("Failed to copy. Please try manually."));
});

window.addEventListener("DOMContentLoaded", updatePaymentBox);


// -------------------------------------
// GOOGLE SHEET FORM SUBMISSION + DUPLICATE CHECK
// -------------------------------------

document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = document.getElementById("registrationForm");

  // Collect all form data manually into JSON
  const data = {
    quantaaID: document.getElementById("quantaaID").value.trim(),
    quantaaName: document.getElementById("quantaaName").value.trim(),
    quantaaPhone: document.getElementById("quantaaPhone").value.trim(),
    batchNo: document.getElementById("batchNo").value.trim(),
    fullAddress: document.getElementById("fullAddress").value.trim(),
    tshirtSize: document.getElementById("tshirtSize").value,
    bringGuest: document.getElementById("bringGuest").checked,
    numGuests: document.getElementById("numGuests").value,
    guestName: document.getElementById("guestName").value.trim(),
    feeAmount: document.getElementById("feeAmount").value.trim(),
    paymentMethod: document.getElementById("paymentMethod").value,
    transactionID: document.getElementById("transactionID").value.trim(),
    suggestion: document.getElementById("suggestion").value.trim()
  };

  // Your Apps Script Web App URL
  const scriptURL = "https://script.google.com/macros/s/AKfycby6IqjYXY8J0SSdKPlyYnsEUZYCo9QdR8pdFv00rtgPUFrUZJ21Mv75m2UvzP4hBe8u/exec";

  // Disable submit button while sending
  const btn = document.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = "Submitting...";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();

    if (result.result === "success") {
      alert("✔ Registration submitted successfully!");
      form.reset();
      updatePaymentBox();
    }

    else if (result.result === "duplicate") {
      alert("❌ Quantaa ID already exists! Please use a different ID.");
    }

    else {
      alert("❌ Error: " + (result.message || "Unknown error"));
    }

  } catch (err) {
    alert("❌ Network Error. Please try again.");
  }

  btn.disabled = false;
  btn.textContent = "Register";
});
