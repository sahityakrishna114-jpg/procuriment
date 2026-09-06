/**
 * e-Paddy Portal: 7-Step Farmer Registration Wizard
 * Dynamic Land Grid, Validation, Centre Preview & Storage
 */

let currentStep = 1;
const totalSteps = 7;

// Land records collection
let landRecords = [
  {
    id: 1,
    district: "Guntur",
    village: "Tenali Rural",
    surveyNo: "128/1A",
    dagNo: "34",
    areaAcres: 3.0,
    ownership: "Self Owned",
    status: "Verified (e-Record)"
  }
];

function initRegistrationWizard() {
  updateStepView(currentStep);
  renderLandTable();
  populateCentreDropdown();
  bindStepNavigation();
}

function updateStepView(step) {
  currentStep = step;

  // Update step indicators
  const stepItems = document.querySelectorAll(".stepper-item-reg");
  stepItems.forEach((item, index) => {
    const stepNum = index + 1;
    item.classList.remove("active", "completed");
    if (stepNum < currentStep) {
      item.classList.add("completed");
    } else if (stepNum === currentStep) {
      item.classList.add("active");
    }
  });

  // Show only current step container
  const stepContainers = document.querySelectorAll(".reg-step-container");
  stepContainers.forEach((container) => {
    const containerStep = parseInt(container.getAttribute("data-step"), 10);
    container.style.display = containerStep === currentStep ? "block" : "none";
  });

  // Scroll to top of form smoothly
  window.scrollTo({ top: 150, behavior: "smooth" });

  if (currentStep === 7) {
    populateReviewSummary();
  }
}

function bindStepNavigation() {
  // Next buttons
  const nextButtons = document.querySelectorAll(".btn-next-step");
  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          updateStepView(currentStep + 1);
        }
      }
    });
  });

  // Prev buttons
  const prevButtons = document.querySelectorAll(".btn-prev-step");
  prevButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 1) {
        updateStepView(currentStep - 1);
      }
    });
  });
}

function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const name = document.getElementById("reg-farmer-name")?.value.trim();
    const aadhaar = document.getElementById("reg-aadhaar")?.value.trim();
    const mobile = document.getElementById("reg-mobile")?.value.trim();
    const age = document.getElementById("reg-age")?.value.trim();

    if (!name) {
      showToast("Please enter Farmer Full Name.", "danger");
      return false;
    }
    if (!aadhaar || aadhaar.length !== 12 || isNaN(aadhaar)) {
      showToast("Please enter a valid 12-digit Aadhaar Number.", "danger");
      return false;
    }
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      showToast("Please enter a valid 10-digit Mobile Number.", "danger");
      return false;
    }
    if (!age || parseInt(age, 10) < 18) {
      showToast("Applicant age must be at least 18 years.", "danger");
      return false;
    }
  } else if (step === 2) {
    const district = document.getElementById("reg-district")?.value;
    const mandal = document.getElementById("reg-mandal")?.value.trim();
    const village = document.getElementById("reg-village")?.value.trim();
    const pincode = document.getElementById("reg-pincode")?.value.trim();

    if (!district || !mandal || !village) {
      showToast("Please complete the residential address details.", "danger");
      return false;
    }
    if (!pincode || pincode.length !== 6) {
      showToast("Please enter a valid 6-digit PIN code.", "danger");
      return false;
    }
  } else if (step === 3) {
    if (landRecords.length === 0) {
      showToast("Please add at least one land parcel record.", "danger");
      return false;
    }
  } else if (step === 4) {
    const centre = document.getElementById("reg-centre-select")?.value;
    if (!centre) {
      showToast("Please choose your nearest Procurement Centre.", "danger");
      return false;
    }
  } else if (step === 5) {
    const bank = document.getElementById("reg-bank-name")?.value.trim();
    const ifsc = document.getElementById("reg-ifsc")?.value.trim();
    const accNo = document.getElementById("reg-account-no")?.value.trim();
    const confirmAcc = document.getElementById("reg-confirm-account-no")?.value.trim();

    if (!bank || !ifsc || !accNo) {
      showToast("Please enter complete bank and account information.", "danger");
      return false;
    }
    if (accNo !== confirmAcc) {
      showToast("Account Number and Confirm Account Number do not match.", "danger");
      return false;
    }
  }

  return isValid;
}

// Dynamic Land Table
function renderLandTable() {
  const tbody = document.getElementById("land-records-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  let totalAcres = 0;

  landRecords.forEach((record, index) => {
    totalAcres += parseFloat(record.areaAcres || 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${record.district}</strong></td>
      <td>${record.village}</td>
      <td>${record.surveyNo}</td>
      <td>${record.dagNo}</td>
      <td>${record.areaAcres} Acres</td>
      <td><span class="badge badge-info">${record.ownership}</span></td>
      <td><span class="badge badge-success">${record.status}</span></td>
      <td>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeLandRecord(${record.id})">
          Remove
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const totalAcresElem = document.getElementById("total-land-acres");
  if (totalAcresElem) totalAcresElem.textContent = totalAcres.toFixed(2);
}

function addLandRecord() {
  const district = document.getElementById("land-input-district")?.value || "Guntur";
  const village = document.getElementById("land-input-village")?.value.trim();
  const surveyNo = document.getElementById("land-input-survey")?.value.trim();
  const dagNo = document.getElementById("land-input-dag")?.value.trim() || "-";
  const area = parseFloat(document.getElementById("land-input-area")?.value);
  const ownership = document.getElementById("land-input-ownership")?.value || "Self Owned";

  if (!village || !surveyNo || isNaN(area) || area <= 0) {
    showToast("Please fill in Village, Survey Number, and valid Area.", "danger");
    return;
  }

  const newRecord = {
    id: Date.now(),
    district,
    village,
    surveyNo,
    dagNo,
    areaAcres: area,
    ownership,
    status: "Verified (e-Record)"
  };

  landRecords.push(newRecord);
  renderLandTable();

  // Clear inputs
  if (document.getElementById("land-input-village")) document.getElementById("land-input-village").value = "";
  if (document.getElementById("land-input-survey")) document.getElementById("land-input-survey").value = "";
  if (document.getElementById("land-input-area")) document.getElementById("land-input-area").value = "";

  showToast("Land record added successfully.", "success");
}

function removeLandRecord(id) {
  landRecords = landRecords.filter((r) => r.id !== id);
  renderLandTable();
  showToast("Land parcel removed.", "info");
}

// Procurement Centre Dropdown & Preview
function populateCentreDropdown() {
  const select = document.getElementById("reg-centre-select");
  if (!select) return;

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  select.innerHTML = '<option value="">-- Select Nearest Procurement Centre --</option>';

  centres.forEach((centre) => {
    const opt = document.createElement("option");
    opt.value = centre.id;
    opt.textContent = `${centre.name} (${centre.district} - ${centre.type})`;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    const centreId = e.target.value;
    const previewBox = document.getElementById("centre-preview-card");
    const centre = centres.find((c) => c.id === centreId);

    if (centre && previewBox) {
      previewBox.style.display = "block";
      document.getElementById("centre-preview-name").textContent = centre.name;
      document.getElementById("centre-preview-address").textContent = centre.address;
      document.getElementById("centre-preview-officer").textContent = `${centre.officerName} (${centre.officerDesignation}) - ${centre.officerPhone}`;
      document.getElementById("centre-preview-capacity").textContent = `Capacity: ${centre.todayCapacity} Quintals/day | Available Slots: ${centre.availableSlots}`;
    } else if (previewBox) {
      previewBox.style.display = "none";
    }
  });
}

// Step 7: Summary Review
function populateReviewSummary() {
  const name = document.getElementById("reg-farmer-name")?.value;
  const mobile = document.getElementById("reg-mobile")?.value;
  const aadhaar = document.getElementById("reg-aadhaar")?.value;
  const district = document.getElementById("reg-district")?.value;
  const mandal = document.getElementById("reg-mandal")?.value;
  const village = document.getElementById("reg-village")?.value;
  const bank = document.getElementById("reg-bank-name")?.value;
  const accNo = document.getElementById("reg-account-no")?.value;

  const summaryContainer = document.getElementById("registration-summary-box");
  if (!summaryContainer) return;

  let totalAcres = landRecords.reduce((acc, curr) => acc + curr.areaAcres, 0);

  summaryContainer.innerHTML = `
    <div class="grid-2 mb-2">
      <div><strong>Applicant Name:</strong> ${name || "-"}</div>
      <div><strong>Mobile Number:</strong> ${mobile || "-"}</div>
      <div><strong>Aadhaar Number:</strong> XXXX-XXXX-${aadhaar ? aadhaar.slice(-4) : "XXXX"}</div>
      <div><strong>Address:</strong> ${village}, ${mandal}, ${district}</div>
      <div><strong>Total Land Cultivated:</strong> ${totalAcres.toFixed(2)} Acres (${landRecords.length} Parcels)</div>
      <div><strong>Bank &amp; Account:</strong> ${bank} (A/C: XXXX-${accNo ? accNo.slice(-4) : "XXXX"})</div>
    </div>
  `;
}

// Final Submit
function submitFarmerRegistration(event) {
  if (event) event.preventDefault();

  const declarationCheck = document.getElementById("reg-declaration-checkbox");
  if (!declarationCheck || !declarationCheck.checked) {
    showToast("Please read and accept the official statutory declaration.", "danger");
    return;
  }

  const name = document.getElementById("reg-farmer-name")?.value.trim();
  const fatherName = document.getElementById("reg-father-name")?.value.trim() || "-";
  const aadhaar = document.getElementById("reg-aadhaar")?.value.trim();
  const mobile = document.getElementById("reg-mobile")?.value.trim();
  const gender = document.getElementById("reg-gender")?.value || "Male";
  const age = parseInt(document.getElementById("reg-age")?.value || "35", 10);
  const krishakBandhu = document.getElementById("reg-krishak-id")?.value.trim() || `KB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const voterId = document.getElementById("reg-voter-id")?.value.trim() || "AP/08/042/991201";

  const district = document.getElementById("reg-district")?.value || "Guntur";
  const mandal = document.getElementById("reg-mandal")?.value.trim() || "Tenali";
  const panchayat = document.getElementById("reg-panchayat")?.value.trim() || "Angalakuduru";
  const village = document.getElementById("reg-village")?.value.trim() || "Angalakuduru";
  const pincode = document.getElementById("reg-pincode")?.value.trim() || "522201";

  const centreId = document.getElementById("reg-centre-select")?.value || "PPC-GNT-001";
  const bankName = document.getElementById("reg-bank-name")?.value.trim() || "State Bank of India";
  const branch = document.getElementById("reg-branch")?.value.trim() || "Main Branch";
  const ifsc = document.getElementById("reg-ifsc")?.value.trim() || "SBIN0000928";
  const accNo = document.getElementById("reg-account-no")?.value.trim() || "309812454819";

  // Generate unique registration ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newRegId = `FMR-AP-2026-${randomSuffix}`;

  const newFarmer = {
    id: newRegId,
    name,
    fatherName,
    aadhaarMasked: `XXXX-XXXX-${aadhaar.slice(-4)}`,
    aadhaar,
    mobile,
    gender,
    age,
    krishakBandhuId: krishakBandhu,
    voterId,
    district,
    mandal,
    panchayat,
    village,
    pincode,
    status: "Verified",
    registrationDate: new Date().toISOString().split("T")[0],
    lands: landRecords,
    preferredCentreId: centreId,
    bank: {
      bankName,
      branch,
      ifsc,
      accountNumberMasked: `XXXXXXXX${accNo.slice(-4)}`,
      accountNumber: accNo,
      accountType: "Savings"
    },
    procurementSummary: {
      scheduledQuantity: 0,
      procuredQuantity: 0,
      paymentDue: 0,
      paymentReceived: 0
    },
    activeAppointment: null,
    currentStage: 3
  };

  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  farmers.unshift(newFarmer);
  localStorage.setItem("epaddy_farmers", JSON.stringify(farmers));

  // Set as logged in user
  const sessionUser = {
    id: newFarmer.id,
    name: newFarmer.name,
    mobile: newFarmer.mobile,
    district: newFarmer.district,
    mandal: newFarmer.mandal,
    role: "Farmer"
  };
  localStorage.setItem("epaddy_current_user", JSON.stringify(sessionUser));

  // Show confirmation modal
  const regIdDisplay = document.getElementById("success-reg-id");
  if (regIdDisplay) regIdDisplay.textContent = newRegId;

  openModal("registration-success-modal");
  showToast(`Registration Successful! Registration ID: ${newRegId}`, "success", 6000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".reg-step-container")) {
    initRegistrationWizard();
  }
});
