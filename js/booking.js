/**
 * e-Paddy Portal: Slot Booking Wizard Module
 * Step-Based Booking Flow, Quota Checks, OTP & Token Generation
 */

let bookingStep = 1;
let selectedFarmer = null;
let selectedCentre = null;
let bookingData = {
  farmerId: "",
  farmerName: "",
  mobile: "",
  centreId: "",
  centreName: "",
  centreAddress: "",
  quantity: 25,
  variety: "Paddy Grade A",
  date: "",
  timeSlot: "",
  tokenNumber: ""
};

function initSlotBooking() {
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const currentUser = JSON.parse(localStorage.getItem("epaddy_current_user") || "null");

  if (currentUser && currentUser.role === "Farmer") {
    selectedFarmer = farmers.find((f) => f.id === currentUser.id) || farmers[0];
  } else if (farmers.length > 0) {
    selectedFarmer = farmers[0];
  }

  // Populate Centres dropdown
  populateBookingCentres();

  // Populate Dates (Next 14 working days)
  generateBookingDates();

  // Handle URL pre-selection of centre
  const params = new URLSearchParams(window.location.search);
  const urlCentreId = params.get("centre");
  if (urlCentreId) {
    const centreSelect = document.getElementById("booking-centre-select");
    if (centreSelect) {
      centreSelect.value = urlCentreId;
      onBookingCentreChanged(urlCentreId);
    }
  }

  // If farmer is verified, update step 1 view
  if (selectedFarmer) {
    updateFarmerVerificationBox(selectedFarmer);
  }

  bindBookingSteps();
}

function updateFarmerVerificationBox(farmer) {
  const box = document.getElementById("booking-farmer-verified-box");
  if (!box) return;

  bookingData.farmerId = farmer.id;
  bookingData.farmerName = farmer.name;
  bookingData.mobile = farmer.mobile;

  let totalAcres = 0;
  if (farmer.lands) {
    totalAcres = farmer.lands.reduce((sum, l) => sum + parseFloat(l.areaAcres || 0), 0);
  }
  const maxQuota = Math.round(totalAcres * 25); // 25 quintals per acre standard

  box.innerHTML = `
    <div class="alert alert-success" style="margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <strong style="font-size: 1.05rem; color: #166534;">${farmer.name}</strong>
          <span style="font-family: var(--font-mono); margin-left: 8px;">(${farmer.id})</span>
          <div style="font-size: 0.82rem; color: #166534; margin-top: 4px;">
            Linked Mobile: XXXX-XX-${farmer.mobile.slice(-4)} | Land: ${totalAcres.toFixed(2)} Acres
          </div>
        </div>
        <div>
          <span class="badge badge-success">Approved Quota: ${maxQuota} Quintals</span>
        </div>
      </div>
    </div>
  `;

  // Set default quantity input
  const qtyInput = document.getElementById("booking-quantity-input");
  if (qtyInput) {
    qtyInput.value = Math.min(25, maxQuota || 25);
    qtyInput.max = maxQuota || 50;
  }
}

function populateBookingCentres() {
  const select = document.getElementById("booking-centre-select");
  if (!select) return;

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  select.innerHTML = '<option value="">-- Choose Procurement Centre --</option>';

  centres.forEach((centre) => {
    const opt = document.createElement("option");
    opt.value = centre.id;
    opt.textContent = `${centre.name} - ${centre.mandal}, ${centre.district} (${centre.availableSlots} Qtl Slots Open)`;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    onBookingCentreChanged(e.target.value);
  });
}

function onBookingCentreChanged(centreId) {
  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  const centre = centres.find((c) => c.id === centreId);

  const preview = document.getElementById("booking-centre-preview");
  if (centre && preview) {
    selectedCentre = centre;
    bookingData.centreId = centre.id;
    bookingData.centreName = centre.name;
    bookingData.centreAddress = centre.address;

    preview.style.display = "block";
    document.getElementById("b-centre-name").textContent = centre.name;
    document.getElementById("b-centre-addr").textContent = centre.address;
    document.getElementById("b-centre-officer").textContent = `${centre.officerName} (${centre.officerPhone})`;
    document.getElementById("b-centre-capacity").textContent = `Available Capacity: ${centre.availableSlots} Quintals`;
  } else if (preview) {
    preview.style.display = "none";
  }
}

function generateBookingDates() {
  const dateContainer = document.getElementById("booking-date-buttons");
  if (!dateContainer) return;

  dateContainer.innerHTML = "";
  const today = new Date();
  let count = 0;
  let offset = 1;

  while (count < 8) {
    const d = new Date();
    d.setDate(today.getDate() + offset);

    // Skip Sundays
    if (d.getDay() !== 0) {
      const dateStr = d.toISOString().split("T")[0];
      const displayStr = d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn btn-secondary date-slot-btn ${count === 0 ? "selected-date" : ""}`;
      btn.textContent = displayStr;
      btn.setAttribute("data-date", dateStr);

      if (count === 0) {
        bookingData.date = dateStr;
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-secondary");
      }

      btn.addEventListener("click", () => {
        document.querySelectorAll(".date-slot-btn").forEach((b) => {
          b.classList.remove("btn-primary", "selected-date");
          b.classList.add("btn-secondary");
        });
        btn.classList.add("btn-primary", "selected-date");
        btn.classList.remove("btn-secondary");
        bookingData.date = dateStr;
      });

      dateContainer.appendChild(btn);
      count++;
    }
    offset++;
  }

  // Time slot selection handlers
  const timeBtns = document.querySelectorAll(".time-slot-btn");
  timeBtns.forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add("btn-primary");
      bookingData.timeSlot = btn.getAttribute("data-time");
    }
    btn.addEventListener("click", () => {
      timeBtns.forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      btn.classList.add("btn-primary");
      btn.classList.remove("btn-secondary");
      bookingData.timeSlot = btn.getAttribute("data-time");
    });
  });
}

function bindBookingSteps() {
  const nextBtn = document.getElementById("btn-booking-next");
  const prevBtn = document.getElementById("btn-booking-prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateCurrentBookingStep(bookingStep)) {
        if (bookingStep < 4) {
          setBookingStep(bookingStep + 1);
        } else if (bookingStep === 4) {
          // Open Mock OTP Modal for Booking Confirmation
          openBookingOtpModal();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (bookingStep > 1) {
        setBookingStep(bookingStep - 1);
      }
    });
  }
}

function validateCurrentBookingStep(step) {
  if (step === 1) {
    if (!bookingData.farmerId) {
      showToast("Farmer profile must be verified to proceed.", "danger");
      return false;
    }
  } else if (step === 2) {
    const centreId = document.getElementById("booking-centre-select")?.value;
    if (!centreId) {
      showToast("Please choose a procurement centre.", "danger");
      return false;
    }
  } else if (step === 3) {
    const qty = parseFloat(document.getElementById("booking-quantity-input")?.value);
    const variety = document.getElementById("booking-variety-select")?.value;

    if (isNaN(qty) || qty <= 0) {
      showToast("Please enter a valid paddy quantity in quintals.", "danger");
      return false;
    }

    bookingData.quantity = qty;
    bookingData.variety = variety || "Paddy Grade A";

    if (!bookingData.date || !bookingData.timeSlot) {
      showToast("Please pick a delivery date and time slot.", "danger");
      return false;
    }
  }

  return true;
}

function setBookingStep(step) {
  bookingStep = step;

  // Step indicator UI
  const indicators = document.querySelectorAll(".booking-step-indicator");
  indicators.forEach((ind, index) => {
    ind.classList.remove("active", "completed");
    if (index + 1 < step) ind.classList.add("completed");
    else if (index + 1 === step) ind.classList.add("active");
  });

  // Containers
  document.querySelectorAll(".booking-step-panel").forEach((panel) => {
    const pStep = parseInt(panel.getAttribute("data-step"), 10);
    panel.style.display = pStep === step ? "block" : "none";
  });

  const prevBtn = document.getElementById("btn-booking-prev");
  const nextBtn = document.getElementById("btn-booking-next");

  if (prevBtn) prevBtn.style.display = step > 1 ? "inline-flex" : "none";
  if (nextBtn) {
    nextBtn.textContent = step === 4 ? "Confirm & Generate Token" : "Next Step";
  }

  if (step === 4) {
    populateBookingReview();
  }
}

function populateBookingReview() {
  const reviewBox = document.getElementById("booking-review-details");
  if (!reviewBox) return;

  const mspRate = 2320; // 2026 Grade A rate
  const estAmount = bookingData.quantity * mspRate;

  reviewBox.innerHTML = `
    <div class="grid-2">
      <div>
        <span class="form-label">Farmer Particulars</span>
        <strong>${bookingData.farmerName}</strong> (${bookingData.farmerId})<br>
        <span class="text-muted">Mobile: XXXX-XX-${bookingData.mobile.slice(-4)}</span>
      </div>
      <div>
        <span class="form-label">Procurement Centre</span>
        <strong>${bookingData.centreName}</strong><br>
        <span class="text-muted">${bookingData.centreAddress}</span>
      </div>
    </div>
    <div class="grid-3 mt-2" style="border-top: 1px solid var(--border-color); padding-top: 12px;">
      <div>
        <span class="form-label">Scheduled Date</span>
        <strong>${bookingData.date}</strong>
      </div>
      <div>
        <span class="form-label">Time Slot</span>
        <strong>${bookingData.timeSlot}</strong>
      </div>
      <div>
        <span class="form-label">Commodity &amp; Quantity</span>
        <strong style="color: var(--agri-green-dark);">${bookingData.quantity} Qtl (${bookingData.variety})</strong>
      </div>
    </div>
    <div class="alert alert-info mt-2" style="margin-bottom: 0;">
      <strong>Estimated Value:</strong> ₹${estAmount.toLocaleString("en-IN")} (at Official MSP of ₹${mspRate}/Quintal). Payment will be credited via direct bank transfer within 24-48 hours of weighment.
    </div>
  `;
}

function openBookingOtpModal() {
  const phoneDisplay = document.getElementById("booking-otp-mobile");
  if (phoneDisplay && bookingData.mobile) {
    phoneDisplay.textContent = `XXXX-XX-${bookingData.mobile.slice(-4)}`;
  }
  openModal("booking-otp-modal");
  showToast("Mock OTP for booking sent to linked mobile. (Demo OTP: 123456)", "info");
}

function verifyBookingOtpAndConfirm() {
  const otp = document.getElementById("booking-otp-input")?.value.trim();
  if (!otp || (otp !== "123456" && otp.length !== 6)) {
    showToast("Invalid OTP. Enter 123456 to verify.", "danger");
    return;
  }

  closeModal("booking-otp-modal");

  // Generate Token Number
  const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
  const tokenNumber = `PPC-2026-${randomTokenNum}`;
  bookingData.tokenNumber = tokenNumber;

  // Create new schedule object
  const newSchedule = {
    tokenNumber,
    farmerId: bookingData.farmerId,
    farmerName: bookingData.farmerName,
    mobile: bookingData.mobile,
    centreId: bookingData.centreId,
    centreName: bookingData.centreName,
    centreAddress: bookingData.centreAddress,
    date: bookingData.date,
    timeSlot: bookingData.timeSlot,
    scheduledQuantity: bookingData.quantity,
    variety: bookingData.variety,
    status: "Scheduled",
    currentStage: 1,
    stages: {
      scheduled: { completed: true, timestamp: new Date().toLocaleString(), details: `Token ${tokenNumber} issued` },
      arrived: { completed: false, timestamp: null, details: "Awaiting arrival at PPC gate" },
      qualityChecked: { completed: false, timestamp: null, status: "Pending" },
      weighed: { completed: false, timestamp: null },
      procured: { completed: false, timestamp: null },
      receiptGenerated: { completed: false, timestamp: null },
      paymentInitiated: { completed: false, timestamp: null },
      paymentCompleted: { completed: false, timestamp: null }
    }
  };

  // Save to schedules in localStorage
  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  schedules.unshift(newSchedule);
  localStorage.setItem("epaddy_schedules", JSON.stringify(schedules));

  // Update farmer active appointment
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const fIdx = farmers.findIndex((f) => f.id === bookingData.farmerId);
  if (fIdx !== -1) {
    farmers[fIdx].activeAppointment = {
      tokenNumber,
      centreId: bookingData.centreId,
      centreName: bookingData.centreName,
      centreAddress: bookingData.centreAddress,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      quantity: bookingData.quantity,
      variety: bookingData.variety,
      status: "Scheduled"
    };
    farmers[fIdx].currentStage = 4;
    localStorage.setItem("epaddy_farmers", JSON.stringify(farmers));
  }

  // Show Success Confirmation View
  renderBookingSuccess(tokenNumber);
}

function renderBookingSuccess(tokenNumber) {
  const wizardContainer = document.getElementById("booking-wizard-card");
  const successContainer = document.getElementById("booking-confirmed-card");

  if (wizardContainer) wizardContainer.style.display = "none";
  if (successContainer) {
    successContainer.style.display = "block";

    document.getElementById("success-token-display").textContent = tokenNumber;
    document.getElementById("success-conf-farmer").textContent = `${bookingData.farmerName} (${bookingData.farmerId})`;
    document.getElementById("success-conf-centre").textContent = bookingData.centreName;
    document.getElementById("success-conf-date").textContent = `${bookingData.date} | ${bookingData.timeSlot}`;
    document.getElementById("success-conf-qty").textContent = `${bookingData.quantity} Quintals (${bookingData.variety})`;

    // View Token receipt link
    const receiptBtn = document.getElementById("btn-view-token-slip");
    if (receiptBtn) {
      receiptBtn.setAttribute("href", `receipt.html?token=${tokenNumber}`);
    }
  }

  showToast(`Procurement slot booked! Token ${tokenNumber} issued.`, "success", 6000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("booking-wizard-card")) {
    initSlotBooking();
  }
});
