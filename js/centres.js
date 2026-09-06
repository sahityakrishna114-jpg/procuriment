/**
 * e-Paddy Portal: Procurement Centre Directory & Details Module
 * Filtering, Search, Capacity Monitoring & Slot Booking Links
 */

let allCentres = [];

function initCentresDirectory() {
  allCentres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  if (allCentres.length === 0) {
    fetch("data/centres.json")
      .then((r) => r.json())
      .then((data) => {
        allCentres = data;
        localStorage.setItem("epaddy_centres", JSON.stringify(data));
        renderCentresTable(allCentres);
      });
  } else {
    renderCentresTable(allCentres);
  }

  bindFilterControls();
}

function renderCentresTable(centres) {
  const tbody = document.getElementById("centres-table-tbody");
  const countElem = document.getElementById("centres-count-display");
  if (!tbody) return;

  if (countElem) {
    countElem.textContent = `Showing ${centres.length} of ${allCentres.length} Centres`;
  }

  if (centres.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted" style="padding: 24px;">
          No procurement centres matched your filter criteria. Try resetting the filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = "";
  centres.forEach((centre) => {
    const tr = document.createElement("tr");

    // Availability Badge calculation
    let availBadge = '<span class="badge badge-success">Available</span>';
    if (centre.availableSlots < 50) {
      availBadge = '<span class="badge badge-warning">Few Slots Left</span>';
    } else if (centre.availableSlots === 0) {
      availBadge = '<span class="badge badge-danger">Full for Today</span>';
    }

    tr.innerHTML = `
      <td>
        <strong style="color: var(--gov-navy-primary);">${centre.name}</strong>
        <div style="font-size: 0.78rem; color: var(--text-light); font-family: var(--font-mono);">${centre.id}</div>
      </td>
      <td><span class="badge badge-info">${centre.type.split(" ")[0]}</span></td>
      <td>${centre.agency.split("/")[0]}</td>
      <td>
        <strong>${centre.officerName}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${centre.officerPhone}</div>
      </td>
      <td>${centre.village}, ${centre.mandal}</td>
      <td>
        <div>${centre.availableSlots} / ${centre.todayCapacity} Qtl</div>
        ${availBadge}
      </td>
      <td><span class="badge badge-success">${centre.status}</span></td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <a href="centre-details.html?id=${centre.id}" class="btn btn-sm btn-secondary">
            View Details
          </a>
          <a href="slot-booking.html?centre=${centre.id}" class="btn btn-sm btn-success">
            Book Slot
          </a>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function bindFilterControls() {
  const districtFilter = document.getElementById("filter-district");
  const typeFilter = document.getElementById("filter-type");
  const agencyFilter = document.getElementById("filter-agency");
  const searchInput = document.getElementById("filter-search");
  const resetBtn = document.getElementById("btn-reset-filters");

  const applyFilters = () => {
    const distVal = districtFilter ? districtFilter.value : "";
    const typeVal = typeFilter ? typeFilter.value : "";
    const agencyVal = agencyFilter ? agencyFilter.value : "";
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = allCentres.filter((c) => {
      const matchDist = !distVal || c.district.toLowerCase() === distVal.toLowerCase();
      const matchType = !typeVal || c.type.toLowerCase().includes(typeVal.toLowerCase());
      const matchAgency = !agencyVal || c.agency.toLowerCase().includes(agencyVal.toLowerCase());
      const matchSearch =
        !searchVal ||
        c.name.toLowerCase().includes(searchVal) ||
        c.mandal.toLowerCase().includes(searchVal) ||
        c.officerName.toLowerCase().includes(searchVal) ||
        c.id.toLowerCase().includes(searchVal);

      return matchDist && matchType && matchAgency && matchSearch;
    });

    renderCentresTable(filtered);
  };

  if (districtFilter) districtFilter.addEventListener("change", applyFilters);
  if (typeFilter) typeFilter.addEventListener("change", applyFilters);
  if (agencyFilter) agencyFilter.addEventListener("change", applyFilters);
  if (searchInput) searchInput.addEventListener("input", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (districtFilter) districtFilter.value = "";
      if (typeFilter) typeFilter.value = "";
      if (agencyFilter) agencyFilter.value = "";
      if (searchInput) searchInput.value = "";
      renderCentresTable(allCentres);
    });
  }
}

// Centre Details Page (`centre-details.html`)
function loadCentreDetails() {
  const params = new URLSearchParams(window.location.search);
  const centreId = params.get("id") || "PPC-GNT-001";

  const centres = JSON.parse(localStorage.getItem("epaddy_centres") || "[]");
  const centre = centres.find((c) => c.id === centreId) || centres[0];

  if (!centre) return;

  // Set titles and breadcrumb
  const nameElem = document.getElementById("detail-centre-name");
  const codeElem = document.getElementById("detail-centre-code");
  const typeElem = document.getElementById("detail-centre-type");
  const addrElem = document.getElementById("detail-centre-address");

  if (nameElem) nameElem.textContent = centre.name;
  if (codeElem) codeElem.textContent = centre.id;
  if (typeElem) typeElem.textContent = centre.type;
  if (addrElem) addrElem.textContent = centre.address;

  // Officer Info
  const officerNameElem = document.getElementById("detail-officer-name");
  const officerDesigElem = document.getElementById("detail-officer-desig");
  const officerPhoneElem = document.getElementById("detail-officer-phone");
  const agencyElem = document.getElementById("detail-agency-name");

  if (officerNameElem) officerNameElem.textContent = centre.officerName;
  if (officerDesigElem) officerDesigElem.textContent = centre.officerDesignation;
  if (officerPhoneElem) officerPhoneElem.textContent = centre.officerPhone;
  if (agencyElem) agencyElem.textContent = centre.agency;

  // Timings & Capacity
  const daysElem = document.getElementById("detail-operating-days");
  const hoursElem = document.getElementById("detail-operating-hours");
  const capacityElem = document.getElementById("detail-today-capacity");
  const bookedElem = document.getElementById("detail-booked-slots");
  const availableElem = document.getElementById("detail-available-slots");
  const waitElem = document.getElementById("detail-waiting-time");

  if (daysElem) daysElem.textContent = centre.operatingDays;
  if (hoursElem) hoursElem.textContent = centre.operatingHours;
  if (capacityElem) capacityElem.textContent = `${centre.todayCapacity} Quintals`;
  if (bookedElem) bookedElem.textContent = `${centre.bookedSlots} Quintals`;
  if (availableElem) availableElem.textContent = `${centre.availableSlots} Quintals`;
  if (waitElem) waitElem.textContent = centre.approxWaitingTime;

  // Book Slot CTA link
  const bookBtn = document.getElementById("btn-book-this-centre");
  if (bookBtn) {
    bookBtn.setAttribute("href", `slot-booking.html?centre=${centre.id}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("centres-table-tbody")) {
    initCentresDirectory();
  }
  if (document.getElementById("detail-centre-name")) {
    loadCentreDetails();
  }
});
