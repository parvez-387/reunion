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
    .then(() => showToast(`${paymentNumber.textContent} copied to clipboard!`, "info"))
    .catch(() => showToast("Failed to copy. Please try manually.", "danger"));
});

window.addEventListener("DOMContentLoaded", updatePaymentBox);

// ---------------------------
// Bootstrap Toast Helper
// ---------------------------
const toastEl = document.getElementById('toast');
const toastBody = document.getElementById('toast-body');
const toastBootstrap = new bootstrap.Toast(toastEl);

function showToast(message, type = "primary") {
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastBootstrap.show();
}

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

  // Leading zeros
  dd = dd < 10 ? '0' + dd : dd;
  mm = mm < 10 ? '0' + mm : mm;
  hh = hh < 10 ? '0' + hh : hh;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${sec} ${ampm}`;
}

// ---------------------------
// Supabase Registration Form
// ---------------------------

// Initialize Supabase
const supabaseUrl = "https://mmsfhjfjrjqyldkyfvgn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tc2ZoamZqcmpxeWxka3lmdmduIiwicm9uIjoiYW5vbiIsImlhdCI6MTc2MzY2ODc2NSwiZXhwIjoyMDc5MjQ0NzY1fQ.9QseOdGWaLLjCktb7wE6GAMQsdklOXK3A4seW6UqD3U";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const tableName = "registration";

// Form submit
document.getElementById("registrationForm").addEventListener("submit", async function(e){
    e.preventDefault(); // prevents refresh

    const btn = this.querySelector(".submit-btn");
    btn.disabled = true;
    btn.textContent = "Submitting...";

    const quantaaID = document.getElementById("quantaaID").value.trim();

    // Duplicate check
    const { data: existing, error: searchError } = await supabaseClient
      .from(tableName)
      .select("quantaaID")
      .eq("quantaaID", quantaaID);

    if(searchError){
        showToast("Error checking duplicates: "+searchError.message, "danger");
        btn.disabled=false; btn.textContent="Register"; return;
    }
    if(existing && existing.length>0){
        showToast("Quantaa ID already exists!", "danger");
        btn.disabled=false; btn.textContent="Register"; return;
    }

    // Collect form data
    const dataToInsert = {
        quantaaID,
        quantaaName: document.getElementById("quantaaName").value.trim(),
        quantaaPhone: document.getElementById("quantaaPhone").value.trim(),
        batchNo: document.getElementById("batchNo").value.trim(),
        fullAddress: document.getElementById("fullAddress").value.trim(),
        tshirtSize: document.getElementById("tshirtSize").value,
        bringGuest: document.getElementById("bringGuest").checked ? "Yes":"No",
        numGuests: document.getElementById("numGuests").value,
        guestName: document.getElementById("guestName").value.trim(),
        feeAmount: document.getElementById("feeAmount").value.trim(),
        paymentMethod: document.getElementById("paymentMethod").value,
        transactionID: document.getElementById("transactionID").value.trim(),
        suggestion: document.getElementById("suggestion").value.trim(),
        recordedBy:"Self",
        recordedOn:new Date().toISOString(),
        status:"Recorded"
    };

    const { data: insertedData, error: insertError } = await supabaseClient
      .from(tableName)
      .insert([dataToInsert]);

    if(insertError){
        showToast("Insert failed: "+insertError.message, "danger");
    } else {
        showToast("✔ Registration submitted successfully!", "success");
        this.reset();
        updatePaymentBox();
    }

    btn.disabled=false;
    btn.textContent="Register";
});

