/**
 * e-Paddy Portal: Admin & Departmental Monitoring Dashboard
 * Pure Vanilla JS Analytics, Queue & Schedule Processing, Grievance Management
 */

function initAdminDashboard() {
  renderAdminKPIs();
  renderProcurementTrendChart();
  renderAdminCentresTable();
  renderAdminSchedulesTable();
  renderAdminGrievancesTable();
  renderAdminPaymentsTable();
  bindAdminTabs();
}

function bindAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const tabPanels = document.querySelectorAll(".admin-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
}

function renderAdminKPIs() {
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  const grievances = JSON.parse(localStorage.getItem("epaddy_grievances") || "[]");

  const totalFarmers = 14820 + farmers.length;
  const todaySchedCount = schedules.filter((s) => s.status === "Scheduled").length;
  const pendingGrvCount = grievances.filter((g) => g.status !== "Resolved").length;

  const kpiFarmers = document.getElementById("admin-kpi-farmers");
  const kpiSched = document.getElementById("admin-kpi-scheduled");
  const kpiCentres = document.getElementById("admin-kpi-centres");
  const kpiGrievances = document.getElementById("admin-kpi-grievances");

  if (kpiFarmers) kpiFarmers.textContent = totalFarmers.toLocaleString("en-IN");
  if (kpiSched) kpiSched.textContent = todaySchedCount;
  if (kpiCentres) kpiCentres.textContent = centres.length;
  if (kpiGrievances) kpiGrievances.textContent = pendingGrvCount;
}

// Pure SVG Bar Chart (No Chart.js, No External Libraries!)
function renderProcurementTrendChart() {
  const container = document.getElementById("admin-procurement-chart");
  if (!container) return;

  const data = [
    { day: "Mon", qtl: 1420 },
    { day: "Tue", qtl: 1850 },
    { day: "Wed", qtl: 2100 },
    { day: "Thu", qtl: 2450 },
    { day: "Fri", qtl: 2900 },
    { day: "Sat", qtl: 3120 },
    { day: "Today", qtl: 3480 }
  ];

  const maxVal = 4000;
  const chartHeight = 160;
  const chartWidth = 520;
  const barWidth = 44;
  const spacing = (chartWidth - data.length * barWidth) / (data.length + 1);

  let svgBars = "";
  data.forEach((d, idx) => {
    const x = spacing + idx * (barWidth + spacing);
    const barH = (d.qtl / maxVal) * chartHeight;
    const y = chartHeight - barH + 20;

    svgBars += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="3" fill="${idx === data.length - 1 ? '#2e7d32' : '#163b6d'}">
        <title>${d.day}: ${d.qtl} Quintals</title>
      </rect>
      <text x="${x + barWidth / 2}" y="${y - 6}" font-size="10" font-weight="700" fill="#0c2340" text-anchor="middle">${d.qtl}</text>
      <text x="${x + barWidth / 2}" y="${chartHeight + 35}" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">${d.day}</text>
    `;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${chartWidth} 200" width="100%" height="200" style="overflow: visible;">
      <!-- Grid line -->
      <line x1="0" y1="180" x2="${chartWidth}" y2="180" stroke="#cbd5e1" stroke-width="1.5"/>
      ${svgBars}
    </svg>
  `;
}

function renderAdminCentresTable() {
  const tbody = document.getElementById("admin-centres-tbody");
  if (!tbody) return;

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  tbody.innerHTML = "";

  centres.forEach((centre) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${centre.name}</strong><br><small class="text-muted">${centre.id}</small></td>
      <td>${centre.mandal}, ${centre.district}</td>
      <td>${centre.type}</td>
      <td>${centre.todayCapacity} Qtl</td>
      <td>${centre.bookedSlots} Qtl</td>
      <td><strong style="color: var(--agri-green-dark);">${centre.availableSlots} Qtl</strong></td>
      <td><span class="badge badge-success">${centre.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAdminSchedulesTable() {
  const tbody = document.getElementById("admin-schedules-tbody");
  if (!tbody) return;

  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  tbody.innerHTML = "";

  schedules.forEach((sch) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="font-family: var(--font-mono);">${sch.tokenNumber}</strong></td>
      <td>${sch.farmerName}<br><small class="text-muted">${sch.farmerId}</small></td>
      <td>${sch.date}<br><small>${sch.timeSlot}</small></td>
      <td>${sch.scheduledQuantity} Qtl</td>
      <td><span class="badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-info'}">${sch.status}</span></td>
      <td>
        <div style="display: flex; gap: 4px;">
          ${sch.status === 'Scheduled' ? `
            <button class="btn btn-sm btn-success" onclick="advanceScheduleStage('${sch.tokenNumber}')">
              Process &amp; Weigh
            </button>
          ` : `
            <a href="receipt.html?token=${sch.tokenNumber}" class="btn btn-sm btn-outline-navy">
              View Receipt
            </a>
          `}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function advanceScheduleStage(tokenNumber) {
  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  const sch = schedules.find((s) => s.tokenNumber === tokenNumber);

  if (!sch) return;

  sch.status = "Completed";
  sch.procuredQuantity = sch.scheduledQuantity;
  sch.receiptNumber = `RCP-AP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  sch.paymentDetails = {
    grossAmount: sch.scheduledQuantity * 2320,
    gunnyBagDeduction: 0,
    moistureDeduction: 0,
    netPayable: sch.scheduledQuantity * 2320,
    paymentStatus: "Pending Treasury Clearance",
    transactionReference: `RBI2026${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "DBT / PFMS",
    beneficiaryBank: "State Bank of India",
    accountNumberMasked: "XXXXXXXX4819"
  };

  localStorage.setItem("epaddy_schedules", JSON.stringify(schedules));

  // Update farmer record
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const f = farmers.find((farm) => farm.id === sch.farmerId);
  if (f) {
    f.procurementSummary.procuredQuantity += sch.scheduledQuantity;
    f.procurementSummary.paymentDue += sch.scheduledQuantity * 2320;
    f.currentStage = 6; // Receipt generated
    localStorage.setItem("epaddy_farmers", JSON.stringify(farmers));
  }

  showToast(`Schedule ${tokenNumber} processed! Purchase receipt ${sch.receiptNumber} generated.`, "success");
  renderAdminSchedulesTable();
  renderAdminKPIs();
}

function renderAdminGrievancesTable() {
  const tbody = document.getElementById("admin-grievances-tbody");
  if (!tbody) return;

  const grievances = JSON.parse(localStorage.getItem("epaddy_grievances") || "[]");
  tbody.innerHTML = "";

  grievances.forEach((g) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="font-family: var(--font-mono);">${g.id}</strong></td>
      <td>${g.farmerId}<br><small>${g.mobile}</small></td>
      <td><strong>${g.category}</strong></td>
      <td><p style="font-size: 0.82rem; margin: 0; max-width: 260px;">${g.description}</p></td>
      <td><span class="badge ${g.status === 'Resolved' ? 'badge-success' : 'badge-warning'}">${g.status}</span></td>
      <td>
        ${g.status !== 'Resolved' ? `
          <button class="btn btn-sm btn-success" onclick="resolveGrievance('${g.id}')">
            Resolve
          </button>
        ` : `<span class="text-muted" style="font-size: 0.8rem;">Resolved</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resolveGrievance(id) {
  const grievances = JSON.parse(localStorage.getItem("epaddy_grievances") || "[]");
  const g = grievances.find((item) => item.id === id);
  if (g) {
    g.status = "Resolved";
    g.officerRemarks = "Inquiry completed by Nodal Officer. Corrective action taken & SMS confirmation dispatched.";
    localStorage.setItem("epaddy_grievances", JSON.stringify(grievances));
    showToast(`Grievance ${id} marked as Resolved.`, "success");
    renderAdminGrievancesTable();
    renderAdminKPIs();
  }
}

function renderAdminPaymentsTable() {
  const tbody = document.getElementById("admin-payments-tbody");
  if (!tbody) return;

  const schedules = JSON.parse(localStorage.getItem("epaddy_schedules") || "[]");
  tbody.innerHTML = "";

  schedules.forEach((sch) => {
    if (sch.paymentDetails) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="font-family: var(--font-mono);">${sch.tokenNumber}</strong></td>
        <td>${sch.farmerName}</td>
        <td>${sch.scheduledQuantity} Qtl</td>
        <td><strong>₹${sch.paymentDetails.grossAmount.toLocaleString("en-IN")}</strong></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.8rem;">${sch.paymentDetails.transactionReference}</span></td>
        <td><span class="badge badge-success">${sch.paymentDetails.paymentStatus}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="showToast('Payment sanction verified with Reserve Bank of India e-Kuber gateway.', 'info')">
            Verify UTR
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("admin-kpi-farmers")) {
    initAdminDashboard();
  }
});
