/**
 * e-Paddy Portal: Farmer Dashboard Module
 * Dynamic Data Binding, Stepper, Appointment Management
 */

let activeFarmer = null;

function loadFarmerDashboard() {
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const currentUser = JSON.parse(localStorage.getItem("epaddy_current_user") || "null");

  if (currentUser && currentUser.role === "Farmer") {
    activeFarmer = farmers.find((f) => f.id === currentUser.id) || farmers[0];
  } else if (farmers.length > 0) {
    activeFarmer = farmers[0]; // Default to Ramesh Kumar demo
  }

  if (!activeFarmer) return;

  renderFarmerHeader(activeFarmer);
  renderStatistics(activeFarmer);
  renderStatusStepper(activeFarmer.currentStage || 4);
  renderAppointmentCard(activeFarmer);
  renderRecentActivity(activeFarmer);
}

function renderFarmerHeader(farmer) {
  const nameElem = document.getElementById("dash-farmer-name");
  const idElem = document.getElementById("dash-farmer-id");
  const kbElem = document.getElementById("dash-kb-id");
  const statusElem = document.getElementById("dash-reg-status");

  if (nameElem) nameElem.textContent = farmer.name;
  if (idElem) idElem.textContent = farmer.id;
  if (kbElem) kbElem.textContent = farmer.krishakBandhuId || "KB-2026-90412";
  if (statusElem) statusElem.textContent = farmer.status || "Verified";
}

function renderStatistics(farmer) {
  const scheduledElem = document.getElementById("stat-scheduled-qty");
  const soldElem = document.getElementById("stat-sold-qty");
  const dueElem = document.getElementById("stat-payment-due");
  const receivedElem = document.getElementById("stat-payment-received");

  const summary = farmer.procurementSummary || {
    scheduledQuantity: 45,
    procuredQuantity: 30,
    paymentDue: 34800,
    paymentReceived: 69600
  };

  if (scheduledElem) scheduledElem.textContent = `${summary.scheduledQuantity} Qtl`;
  if (soldElem) soldElem.textContent = `${summary.procuredQuantity} Qtl`;
  if (dueElem) dueElem.textContent = `₹${summary.paymentDue.toLocaleString("en-IN")}`;
  if (receivedElem) receivedElem.textContent = `₹${summary.paymentReceived.toLocaleString("en-IN")}`;
}

function renderStatusStepper(currentStage = 4) {
  const stepItems = document.querySelectorAll(".dash-step-item");
  const progressBar = document.getElementById("dash-stepper-progress");

  stepItems.forEach((item, index) => {
    const stage = index + 1;
    item.classList.remove("completed", "active");
    if (stage < currentStage) {
      item.classList.add("completed");
    } else if (stage === currentStage) {
      item.classList.add("active");
    }
  });

  if (progressBar && stepItems.length > 1) {
    const progressPercent = ((currentStage - 1) / (stepItems.length - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
}

function renderAppointmentCard(farmer) {
  const container = document.getElementById("appointment-card-container");
  if (!container) return;

  const appt = farmer.activeAppointment;

  if (!appt) {
    container.innerHTML = `
      <div class="card-body text-center" style="padding: 35px 20px;">
        <div style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 12px;">📅</div>
        <h4 style="color: var(--gov-navy-dark); margin-bottom: 6px;">No Active Procurement Schedule</h4>
        <p class="text-muted mb-3" style="max-width: 480px; margin-left: auto; margin-right: auto;">
          You do not have any pending appointments. Select your preferred procurement centre and schedule a delivery date for your harvested paddy.
        </p>
        <a href="slot-booking.html" class="btn btn-success">
          Book Procurement Slot Now
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="card-header d-flex justify-between align-center">
      <h3>Next Procurement Appointment</h3>
      <span class="badge badge-success">Token Active</span>
    </div>
    <div class="card-body">
      <div class="grid-2 mb-2">
        <div>
          <span class="form-label" style="margin-bottom: 2px;">Centre Name</span>
          <strong style="color: var(--gov-navy-primary); font-size: 1.05rem;">${appt.centreName}</strong>
          <p class="text-muted mt-1" style="font-size: 0.86rem; margin-bottom: 0;">${appt.centreAddress}</p>
        </div>
        <div>
          <div class="alert alert-info" style="padding: 10px 14px; margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span><strong>Token No:</strong></span>
              <span style="font-family: var(--font-mono); font-weight: 800; color: #1e40af;">${appt.tokenNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Date:</span>
              <strong>${appt.date}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Time Slot:</span>
              <strong>${appt.timeSlot}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Quantity:</span>
              <strong style="color: var(--agri-green-dark);">${appt.quantity} Quintals (${appt.variety})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-between align-center">
      <div class="d-flex gap-2">
        <a href="centre-details.html?id=${appt.centreId}" class="btn btn-sm btn-secondary">
          View Centre
        </a>
        <a href="https://maps.google.com/?q=${encodeURIComponent(appt.centreName + ' ' + appt.centreAddress)}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-navy">
          Get Directions
        </a>
        <a href="receipt.html?token=${appt.tokenNumber}" class="btn btn-sm btn-outline-green">
          View / Print Token Slip
        </a>
      </div>
      <div>
        <button type="button" class="btn btn-sm btn-danger" onclick="confirmCancelAppointment()">
          Cancel Schedule
        </button>
      </div>
    </div>
  `;
}

function renderRecentActivity(farmer) {
  const tbody = document.getElementById("dash-history-tbody");
  if (!tbody) return;

  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  const farmerSchedules = schedules.filter((s) => s.farmerId === farmer.id);

  if (farmerSchedules.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 20px;">No historical procurement records found.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";
  farmerSchedules.forEach((sch) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="font-family: var(--font-mono);">${sch.tokenNumber}</strong></td>
      <td>${sch.date}</td>
      <td>${sch.centreName}</td>
      <td>${sch.scheduledQuantity} Qtl</td>
      <td>${sch.procuredQuantity ? sch.procuredQuantity + ' Qtl' : '-'}</td>
      <td>
        <span class="badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-info'}">
          ${sch.status}
        </span>
      </td>
      <td>
        <a href="procurement-status.html?reg=${farmer.id}" class="btn btn-sm btn-secondary">Track</a>
        ${sch.receiptNumber ? `<a href="receipt.html?token=${sch.tokenNumber}" class="btn btn-sm btn-outline-navy">Receipt</a>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Cancel appointment flow
function confirmCancelAppointment() {
  openModal("cancel-schedule-modal");
}

function executeCancelAppointment() {
  if (!activeFarmer || !activeFarmer.activeAppointment) return;

  const tokenToCancel = activeFarmer.activeAppointment.tokenNumber;
  activeFarmer.activeAppointment = null;
  activeFarmer.currentStage = 3; // back to land verified

  // Update farmer record in localStorage
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const idx = farmers.findIndex((f) => f.id === activeFarmer.id);
  if (idx !== -1) {
    farmers[idx] = activeFarmer;
    localStorage.setItem("epaddy_farmers", JSON.stringify(farmers));
  }

  // Update schedule status
  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  const schIdx = schedules.findIndex((s) => s.tokenNumber === tokenToCancel);
  if (schIdx !== -1) {
    schedules[schIdx].status = "Cancelled";
    localStorage.setItem("epaddy_schedules", JSON.stringify(schedules));
  }

  closeModal("cancel-schedule-modal");
  showToast(`Schedule ${tokenToCancel} cancelled successfully.`, "warning");
  loadFarmerDashboard();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dash-farmer-name")) {
    loadFarmerDashboard();
  }
});
