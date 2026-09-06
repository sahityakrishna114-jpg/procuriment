/**
 * e-Paddy Portal: Citizen & Farmer Grievance Redressal Module
 * Registration, Category Routing, Tracking, and Storage
 */

function initGrievancePortal() {
  bindGrievanceTabs();
  populateGrievanceCentres();

  // Prefill if farmer logged in
  const currentUser = JSON.parse(localStorage.getItem("epaddy_current_user") || "null");
  if (currentUser && currentUser.role === "Farmer") {
    const regInput = document.getElementById("grv-reg-number");
    const mobileInput = document.getElementById("grv-mobile-number");
    if (regInput) regInput.value = currentUser.id;
    if (mobileInput) mobileInput.value = currentUser.mobile;
  }
}

function bindGrievanceTabs() {
  const tabs = document.querySelectorAll(".grv-tab");
  const panels = document.querySelectorAll(".grv-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
}

function populateGrievanceCentres() {
  const select = document.getElementById("grv-centre-select");
  if (!select) return;

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  select.innerHTML = '<option value="">-- Select Relevant Procurement Centre (Optional) --</option>';

  centres.forEach((centre) => {
    const opt = document.createElement("option");
    opt.value = centre.id;
    opt.textContent = `${centre.name} (${centre.district})`;
    select.appendChild(opt);
  });
}

function submitGrievanceForm(event) {
  if (event) event.preventDefault();

  const regNo = document.getElementById("grv-reg-number")?.value.trim();
  const mobile = document.getElementById("grv-mobile-number")?.value.trim();
  const category = document.getElementById("grv-category-select")?.value;
  const centreId = document.getElementById("grv-centre-select")?.value;
  const desc = document.getElementById("grv-description")?.value.trim();

  if (!regNo) {
    showToast("Please enter Farmer Registration Number.", "danger");
    return;
  }
  if (!mobile || mobile.length !== 10) {
    showToast("Please enter a valid 10-digit contact mobile number.", "danger");
    return;
  }
  if (!category) {
    showToast("Please select a grievance category.", "danger");
    return;
  }
  if (!desc || desc.length < 15) {
    showToast("Please provide a detailed description of the issue (at least 15 characters).", "danger");
    return;
  }

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  const centre = centres.find((c) => c.id === centreId);

  // Generate unique Grievance ID
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const grievanceId = `GRV-2026-${randomSuffix}`;

  const newGrievance = {
    id: grievanceId,
    farmerId: regNo,
    farmerName: "Registered Farmer",
    mobile,
    category,
    centreId: centreId || "-",
    centreName: centre ? centre.name : "District Office",
    description: desc,
    status: "Under Review",
    createdDate: new Date().toISOString().split("T")[0],
    officerRemarks: "Grievance acknowledged and forwarded to Sub-Divisional Nodal Officer for immediate inquiry."
  };

  const grievances = JSON.parse(localStorage.getItem("epaddy_grievances") || "[]");
  grievances.unshift(newGrievance);
  localStorage.setItem("epaddy_grievances", JSON.stringify(grievances));

  // Reset form
  if (document.getElementById("grievance-form")) {
    document.getElementById("grievance-form").reset();
  }

  // Display success modal
  const tokenDisplay = document.getElementById("grv-success-token");
  if (tokenDisplay) tokenDisplay.textContent = grievanceId;

  openModal("grievance-success-modal");
  showToast(`Grievance registered! Token: ${grievanceId}`, "success", 7000);
}

function searchGrievanceStatus() {
  const query = document.getElementById("grv-search-input")?.value.trim().toUpperCase();
  const resultsContainer = document.getElementById("grv-search-results");

  if (!query) {
    showToast("Please enter a Grievance Token or Mobile Number.", "danger");
    return;
  }

  const grievances = JSON.parse(localStorage.getItem("epaddy_grievances") || "[]");
  const match = grievances.find(
    (g) => g.id.toUpperCase() === query || g.mobile === query || g.farmerId.toUpperCase() === query
  );

  if (!match) {
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="alert alert-warning">
          No active grievance records found matching query "${query}". Please verify your token number or contact the district helpline.
        </div>
      `;
    }
    return;
  }

  let badgeClass = "badge-warning";
  if (match.status === "Resolved") badgeClass = "badge-success";
  if (match.status === "Action Initiated") badgeClass = "badge-info";

  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="card" style="border: 2px solid var(--gov-navy-primary);">
        <div class="card-header d-flex justify-between align-center">
          <div>
            <strong>Grievance Token: ${match.id}</strong>
            <span class="badge ${badgeClass}" style="margin-left: 10px;">${match.status}</span>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Filed on: ${match.createdDate}</span>
        </div>
        <div class="card-body">
          <div class="grid-2 mb-2">
            <div>
              <span class="form-label">Category</span>
              <strong>${match.category}</strong>
            </div>
            <div>
              <span class="form-label">Related Centre</span>
              <strong>${match.centreName}</strong>
            </div>
          </div>
          <div class="mb-2">
            <span class="form-label">Issue Summary</span>
            <p style="background: #f8fafc; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              ${match.description}
            </p>
          </div>
          <div class="alert alert-info" style="margin-bottom: 0;">
            <strong>Officer Redressal Action &amp; Remarks:</strong><br>
            ${match.officerRemarks}
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("grv-reg-number")) {
    initGrievancePortal();
  }
});
