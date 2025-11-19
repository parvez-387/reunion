// Guest toggle
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

// Payment info
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
