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

// ---------------------------
// Helper: Get current timestamp in dd/mm/yyyy hh:mm:ss AM/PM
// ---------------------------
function getCurrentTimestamp() {
  const now = new Date();

  let dd = now.getDate();
  let mm = now.getMonth() + 1;
  let yyyy = now.getFullYear();

  let hh = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  const ampm = hh >= 12 ? "PM" : "AM";

  hh = hh % 12;
  hh = hh ? hh : 12;
  dd = dd < 10 ? '0' + dd : dd;
  mm = mm < 10 ? '0' + mm : mm;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${sec} ${ampm}`;
}

// ---------------------------
// SheetDB Form Submission
// ---------------------------

// Replace this with your SheetDB API URL
const sheetDB_API_URL = "https://sheetdb.io/api/v1/a29ixq1ixk4ob";

document.getElementById("registrationForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector(".submit-btn"); // make sure button has class="submit-btn"

  // 1️⃣ Temporarily disable the button
  btn.disabled = true;
  btn.textContent = "Submitting...";

  const quantaaID = document.getElementById("quantaaID").value.trim();

  // 2️⃣ Check for duplicate Quantaa ID
  try {
    const searchResp = await fetch(`${sheetDB_API_URL}/search?quantaaID=${encodeURIComponent(quantaaID)}`);
    const searchData = await searchResp.json();

    if (searchData.length > 0) {
      alert("❌ Quantaa ID already exists! Please use a different ID.");
      btn.disabled = false;
      btn.textContent = "Register";
      return;
    }
  } catch (err) {
    console.error("Error checking duplicates:", err);
    alert("❌ Unable to verify Quantaa ID. Please try again.");
    btn.disabled = false;
    btn.textContent = "Register";
    return;
  }

  // 3️⃣ Collect form data
  const data = {
    data: [
      {
        quantaaID: quantaaID,
        quantaaName: document.getElementById("quantaaName").value.trim(),
        quantaaPhone: document.getElementById("quantaaPhone").value.trim(),
        batchNo: document.getElementById("batchNo").value.trim(),
        fullAddress: document.getElementById("fullAddress").value.trim(),
        tshirtSize: document.getElementById("tshirtSize").value,
        bringGuest: document.getElementById("bringGuest").checked ? "Yes" : "No",
        numGuests: document.getElementById("numGuests").value,
        guestName: document.getElementById("guestName").value.trim(),
        feeAmount: document.getElementById("feeAmount").value.trim(),
        paymentMethod: document.getElementById("paymentMethod").value,
        transactionID: document.getElementById("transactionID").value.trim(),
        suggestion: document.getElementById("suggestion").value.trim(),
        recordedBy: "Self",
        recordedOn: getCurrentTimestamp(),
        status: "Recorded"
      }
    ]
  };

  // 4️⃣ Submit to SheetDB
  try {
    const resp = await fetch(sheetDB_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (resp.ok) {
      alert("✔ Registration submitted successfully!");
      form.reset();
      updatePaymentBox();
    } else {
      alert("❌ Error submitting data.");
      console.error(await resp.text());
    }
  } catch (err) {
    console.error(err);
    alert("❌ Network error. Please try again.");
  }

  // 5️⃣ Re-enable the button
  btn.disabled = false;
  btn.textContent = "Register";
});
