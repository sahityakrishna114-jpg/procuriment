/**
 * e-Paddy Portal: Core Application Engine
 * Accessibility, Responsive Nav, Data Seed & Toast Engine
 */

// Toast notification helper
function showToast(message, type = "info", duration = 4000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Screen reader announcer
function announceToScreenReader(message) {
  let announcer = document.getElementById("sr-announcer");
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", "assertive");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-9999px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}

// Modal management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    const firstInput = modal.querySelector("input, select, textarea, button");
    if (firstInput) firstInput.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Data Seeding System with embedded fallback for direct file:// or http:// loading
const DEFAULT_FARMERS = [
  {
    "id": "FMR-AP-2026-7821",
    "name": "Ramesh Kumar",
    "fatherName": "Venkata Narayana",
    "aadhaarMasked": "XXXX-XXXX-8921",
    "aadhaar": "123456788921",
    "mobile": "9876543210",
    "gender": "Male",
    "age": 46,
    "krishakBandhuId": "KB-2026-90412",
    "voterId": "AP/08/042/189201",
    "district": "Guntur",
    "mandal": "Tenali",
    "panchayat": "Angalakuduru",
    "village": "Angalakuduru",
    "pincode": "522211",
    "status": "Verified",
    "registrationDate": "2026-08-12",
    "lands": [
      {
        "id": "LND-01",
        "district": "Guntur",
        "village": "Angalakuduru",
        "surveyNo": "142/2A",
        "dagNo": "45",
        "areaAcres": 3.5,
        "ownership": "Self Owned",
        "verified": true
      },
      {
        "id": "LND-02",
        "district": "Guntur",
        "village": "Angalakuduru",
        "surveyNo": "143/1B",
        "dagNo": "48",
        "areaAcres": 2.0,
        "ownership": "Tenant / Lease",
        "verified": true
      }
    ],
    "preferredCentreId": "PPC-GNT-001",
    "bank": {
      "bankName": "State Bank of India",
      "branch": "Tenali Main Branch",
      "ifsc": "SBIN0000928",
      "accountNumberMasked": "XXXXXXXX4819",
      "accountNumber": "309812454819",
      "accountType": "Savings"
    },
    "procurementSummary": {
      "scheduledQuantity": 45,
      "procuredQuantity": 30,
      "paymentDue": 34800,
      "paymentReceived": 69600
    },
    "activeAppointment": {
      "tokenNumber": "PPC-2026-1042",
      "centreId": "PPC-GNT-001",
      "centreName": "Tenali Agricultural Market Yard PPC",
      "centreAddress": "Market Yard Complex, Old Bus Stand Road, Tenali, Guntur - 522201",
      "date": "2026-10-15",
      "timeSlot": "10:00 AM - 11:00 AM",
      "quantity": 25,
      "variety": "Paddy Grade A",
      "status": "Scheduled"
    },
    "currentStage": 4
  },
  {
    "id": "FMR-AP-2026-4412",
    "name": "Lakshmi Devi",
    "fatherName": "Chinnaiah",
    "aadhaarMasked": "XXXX-XXXX-4512",
    "aadhaar": "987654324512",
    "mobile": "9848022334",
    "gender": "Female",
    "age": 42,
    "krishakBandhuId": "KB-2026-67319",
    "voterId": "AP/09/051/342110",
    "district": "Krishna",
    "mandal": "Gudivada",
    "panchayat": "Valivarthipadu",
    "village": "Valivarthipadu",
    "pincode": "521301",
    "status": "Verified",
    "registrationDate": "2026-08-20",
    "lands": [
      {
        "id": "LND-03",
        "district": "Krishna",
        "village": "Valivarthipadu",
        "surveyNo": "88/3",
        "dagNo": "19",
        "areaAcres": 4.0,
        "ownership": "Self Owned",
        "verified": true
      }
    ],
    "preferredCentreId": "PPC-KRI-001",
    "bank": {
      "bankName": "Andhra Pragathi Grameena Bank",
      "branch": "Gudivada",
      "ifsc": "APGB0001045",
      "accountNumberMasked": "XXXXXXXX7723",
      "accountNumber": "119823457723",
      "accountType": "Savings"
    },
    "procurementSummary": {
      "scheduledQuantity": 40,
      "procuredQuantity": 40,
      "paymentDue": 0,
      "paymentReceived": 92800
    },
    "activeAppointment": null,
    "currentStage": 7
  },
  {
    "id": "FMR-AP-2026-9023",
    "name": "Venkata Subba Rao",
    "fatherName": "Appa Rao",
    "aadhaarMasked": "XXXX-XXXX-6619",
    "aadhaar": "543210986619",
    "mobile": "9440188992",
    "gender": "Male",
    "age": 53,
    "krishakBandhuId": "KB-2026-88124",
    "voterId": "AP/04/022/981244",
    "district": "West Godavari",
    "mandal": "Bhimavaram",
    "panchayat": "Rayalam",
    "village": "Rayalam",
    "pincode": "534208",
    "status": "Verified",
    "registrationDate": "2026-08-25",
    "lands": [
      {
        "id": "LND-04",
        "district": "West Godavari",
        "village": "Rayalam",
        "surveyNo": "205/4C",
        "dagNo": "72",
        "areaAcres": 5.5,
        "ownership": "Self Owned",
        "verified": true
      }
    ],
    "preferredCentreId": "PPC-WG-001",
    "bank": {
      "bankName": "Union Bank of India",
      "branch": "Bhimavaram Bazar",
      "ifsc": "UBIN0532981",
      "accountNumberMasked": "XXXXXXXX9012",
      "accountNumber": "520101009012",
      "accountType": "Savings"
    },
    "procurementSummary": {
      "scheduledQuantity": 50,
      "procuredQuantity": 50,
      "paymentDue": 0,
      "paymentReceived": 116000
    },
    "activeAppointment": null,
    "currentStage": 7
  }
];

const DEFAULT_CENTRES = [
  {
    "id": "PPC-GNT-001",
    "name": "Tenali Agricultural Market Yard PPC",
    "type": "Paddy Procurement Centre (PPC)",
    "agency": "AP State Civil Supplies Corporation",
    "district": "Guntur",
    "mandal": "Tenali",
    "village": "Tenali Town",
    "address": "Market Yard Complex, Old Bus Stand Road, Tenali, Guntur - 522201",
    "officerName": "K. Srinivasulu",
    "officerDesignation": "Procurement Officer / Tahsildar",
    "officerPhone": "+91 94409 01234",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:00 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 500,
    "bookedSlots": 380,
    "availableSlots": 120,
    "approxWaitingTime": "25 - 35 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-GNT-002",
    "name": "Mangalagiri PACS Paddy Centre",
    "type": "Primary Agricultural Credit Society (PACS)",
    "agency": "Cooperative Department / MARKFED",
    "district": "Guntur",
    "mandal": "Mangalagiri",
    "village": "Mangalagiri",
    "address": "Near Sub-Registrar Office, GT Road, Mangalagiri - 522503",
    "officerName": "V. Radhakrishna",
    "officerDesignation": "Society Secretary",
    "officerPhone": "+91 94409 05678",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:30 AM - 05:30 PM",
    "status": "Operational",
    "todayCapacity": 400,
    "bookedSlots": 290,
    "availableSlots": 110,
    "approxWaitingTime": "30 - 45 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-KRI-001",
    "name": "Gudivada Rythu Bharosa Kendra (RBK-1)",
    "type": "Rythu Bharosa Kendra (RBK)",
    "agency": "AP State Civil Supplies Corporation",
    "district": "Krishna",
    "mandal": "Gudivada",
    "village": "Valivarthipadu",
    "address": "RBK Center, Valivarthipadu Road, Gudivada Mandal - 521301",
    "officerName": "M. Anjaneyulu",
    "officerDesignation": "Agriculture Assistant",
    "officerPhone": "+91 94409 07890",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:00 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 350,
    "bookedSlots": 310,
    "availableSlots": 40,
    "approxWaitingTime": "45 - 60 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-KRI-002",
    "name": "Machilipatnam DCMS Godown Centre",
    "type": "District Cooperative Marketing Society (DCMS)",
    "agency": "MARKFED",
    "district": "Krishna",
    "mandal": "Machilipatnam",
    "village": "Chilakalapudi",
    "address": "DCMS Godown Complex, Railway Station Road, Chilakalapudi, Machilipatnam - 521002",
    "officerName": "G. Venkatesh",
    "officerDesignation": "DCMS Manager",
    "officerPhone": "+91 94409 11223",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:00 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 600,
    "bookedSlots": 420,
    "availableSlots": 180,
    "approxWaitingTime": "20 - 30 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-WG-001",
    "name": "Bhimavaram AMC Paddy Procurement Centre",
    "type": "Paddy Procurement Centre (PPC)",
    "agency": "AP State Civil Supplies Corporation",
    "district": "West Godavari",
    "mandal": "Bhimavaram",
    "village": "Rayalam",
    "address": "Agriculture Market Committee Yard, Somavaram Road, Bhimavaram - 534202",
    "officerName": "P. Satyanarayana",
    "officerDesignation": "Assistant Director (Civil Supplies)",
    "officerPhone": "+91 94409 33445",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "07:30 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 750,
    "bookedSlots": 580,
    "availableSlots": 170,
    "approxWaitingTime": "20 - 35 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-EG-001",
    "name": "Kakinada Port Basin PPC",
    "type": "Paddy Procurement Centre (PPC)",
    "agency": "Food Corporation of India (FCI) / APSCSCL",
    "district": "East Godavari",
    "mandal": "Kakinada Rural",
    "village": "Sarpavaram",
    "address": "State Warehousing Corp Godown No. 4, Sarpavaram, Kakinada - 533005",
    "officerName": "D. Murali Mohan",
    "officerDesignation": "Quality Control Inspector",
    "officerPhone": "+91 94409 55667",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:00 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 800,
    "bookedSlots": 620,
    "availableSlots": 180,
    "approxWaitingTime": "15 - 25 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  },
  {
    "id": "PPC-KRN-001",
    "name": "Nandyal Rythu Bharosa Kendra (RBK)",
    "type": "Rythu Bharosa Kendra (RBK)",
    "agency": "AP State Civil Supplies Corporation",
    "district": "Kurnool",
    "mandal": "Nandyal",
    "village": "Mahanandi Road",
    "address": "Mahanandi Road RBK Centre, Near Rythu Bazar, Nandyal - 518501",
    "officerName": "B. Rammohan Reddy",
    "officerDesignation": "Village Agriculture Assistant",
    "officerPhone": "+91 94409 77889",
    "operatingDays": "Monday to Saturday",
    "operatingHours": "08:30 AM - 05:00 PM",
    "status": "Operational",
    "todayCapacity": 300,
    "bookedSlots": 210,
    "availableSlots": 90,
    "approxWaitingTime": "30 - 40 mins",
    "purchaseDate": "2026-10-01 to 2026-12-31"
  }
];

const DEFAULT_SCHEDULES = [
  {
    "tokenNumber": "PPC-2026-1042",
    "farmerId": "FMR-AP-2026-7821",
    "farmerName": "Ramesh Kumar",
    "mobile": "9876543210",
    "centreId": "PPC-GNT-001",
    "centreName": "Tenali Agricultural Market Yard PPC",
    "centreAddress": "Market Yard Complex, Old Bus Stand Road, Tenali, Guntur - 522201",
    "date": "2026-10-15",
    "timeSlot": "10:00 AM - 11:00 AM",
    "scheduledQuantity": 25,
    "variety": "Paddy Grade A",
    "status": "Scheduled",
    "currentStage": 1
  },
  {
    "tokenNumber": "PPC-2026-0918",
    "farmerId": "FMR-AP-2026-7821",
    "farmerName": "Ramesh Kumar",
    "mobile": "9876543210",
    "centreId": "PPC-GNT-001",
    "centreName": "Tenali Agricultural Market Yard PPC",
    "centreAddress": "Market Yard Complex, Old Bus Stand Road, Tenali, Guntur - 522201",
    "date": "2026-08-28",
    "timeSlot": "09:00 AM - 10:00 AM",
    "scheduledQuantity": 30,
    "variety": "Paddy Grade A",
    "status": "Completed",
    "currentStage": 8,
    "mspRate": 2320,
    "procuredQuantity": 30,
    "receiptNumber": "RCP-AP-2026-894102",
    "paymentDetails": {
      "grossAmount": 69600,
      "gunnyBagDeduction": 0,
      "moistureDeduction": 0,
      "netPayable": 69600,
      "paymentStatus": "Paid / Credited",
      "transactionReference": "RBI20260830784912",
      "paymentDate": "2026-08-30",
      "paymentMode": "DBT / PFMS",
      "beneficiaryBank": "State Bank of India",
      "accountNumberMasked": "XXXXXXXX4819"
    }
  },
  {
    "tokenNumber": "PPC-2026-0845",
    "farmerId": "FMR-AP-2026-4412",
    "farmerName": "Lakshmi Devi",
    "mobile": "9848022334",
    "centreId": "PPC-KRI-001",
    "centreName": "Gudivada Rythu Bharosa Kendra (RBK-1)",
    "centreAddress": "RBK Center, Valivarthipadu Road, Gudivada Mandal - 521301",
    "date": "2026-08-26",
    "timeSlot": "11:00 AM - 12:00 PM",
    "scheduledQuantity": 40,
    "variety": "Paddy Grade A",
    "status": "Completed",
    "currentStage": 8,
    "mspRate": 2320,
    "procuredQuantity": 40,
    "receiptNumber": "RCP-AP-2026-881204",
    "paymentDetails": {
      "grossAmount": 92800,
      "gunnyBagDeduction": 0,
      "moistureDeduction": 0,
      "netPayable": 92800,
      "paymentStatus": "Paid / Credited",
      "transactionReference": "RBI20260829391024",
      "paymentDate": "2026-08-29",
      "paymentMode": "DBT / PFMS",
      "beneficiaryBank": "Andhra Pragathi Grameena Bank",
      "accountNumberMasked": "XXXXXXXX7723"
    }
  }
];

async function initSeedData() {
  try {
    if (!localStorage.getItem("epaddy_farmers")) {
      try {
        const res = await fetch("data/farmers.json");
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("epaddy_farmers", JSON.stringify(data));
        } else {
          localStorage.setItem("epaddy_farmers", JSON.stringify(DEFAULT_FARMERS));
        }
      } catch {
        localStorage.setItem("epaddy_farmers", JSON.stringify(DEFAULT_FARMERS));
      }
    }

    if (!localStorage.getItem("epaddy_centres")) {
      try {
        const res = await fetch("data/centres.json");
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("epaddy_centres", JSON.stringify(data));
        } else {
          localStorage.setItem("epaddy_centres", JSON.stringify(DEFAULT_CENTRES));
        }
      } catch {
        localStorage.setItem("epaddy_centres", JSON.stringify(DEFAULT_CENTRES));
      }
    }

    if (!localStorage.getItem("epaddy_schedules")) {
      try {
        const res = await fetch("data/schedules.json");
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("epaddy_schedules", JSON.stringify(data));
        } else {
          localStorage.setItem("epaddy_schedules", JSON.stringify(DEFAULT_SCHEDULES));
        }
      } catch {
        localStorage.setItem("epaddy_schedules", JSON.stringify(DEFAULT_SCHEDULES));
      }
    }

    if (!localStorage.getItem("epaddy_grievances")) {
      const defaultGrievances = [
        {
          id: "GRV-2026-001245",
          farmerId: "FMR-AP-2026-7821",
          farmerName: "Ramesh Kumar",
          mobile: "9876543210",
          category: "Payment Delay",
          centreId: "PPC-GNT-001",
          centreName: "Tenali Agricultural Market Yard PPC",
          description: "Subsidy payment for 30 quintals sold on August 28 is pending sanction.",
          status: "Under Review",
          createdDate: "2026-09-02",
          officerRemarks: "Forwarded to District Treasury for e-Kuber token clearance."
        }
      ];
      localStorage.setItem("epaddy_grievances", JSON.stringify(defaultGrievances));
    }
  } catch (err) {
    console.warn("Local storage seeding check:", err);
  }
}

// Accessibility Tools Initializer
function initAccessibility() {
  const savedFontSize = localStorage.getItem("epaddy_fontsize");
  if (savedFontSize === "large") document.body.classList.add("font-large");
  if (savedFontSize === "small") document.body.classList.add("font-small");

  const savedContrast = localStorage.getItem("epaddy_contrast");
  if (savedContrast === "high") document.body.classList.add("high-contrast");

  // Event handlers for A-, A, A+
  const btnFontSmall = document.getElementById("btn-font-small");
  const btnFontNormal = document.getElementById("btn-font-normal");
  const btnFontLarge = document.getElementById("btn-font-large");

  if (btnFontSmall) {
    btnFontSmall.addEventListener("click", () => {
      document.body.classList.remove("font-large");
      document.body.classList.add("font-small");
      localStorage.setItem("epaddy_fontsize", "small");
      announceToScreenReader("Text size reduced");
    });
  }

  if (btnFontNormal) {
    btnFontNormal.addEventListener("click", () => {
      document.body.classList.remove("font-small", "font-large");
      localStorage.setItem("epaddy_fontsize", "normal");
      announceToScreenReader("Text size restored to normal");
    });
  }

  if (btnFontLarge) {
    btnFontLarge.addEventListener("click", () => {
      document.body.classList.remove("font-small");
      document.body.classList.add("font-large");
      localStorage.setItem("epaddy_fontsize", "large");
      announceToScreenReader("Text size increased");
    });
  }

  // Contrast toggle
  const btnContrast = document.getElementById("btn-contrast-toggle");
  if (btnContrast) {
    btnContrast.addEventListener("click", () => {
      const isHigh = document.body.classList.toggle("high-contrast");
      localStorage.setItem("epaddy_contrast", isHigh ? "high" : "normal");
      announceToScreenReader(isHigh ? "High contrast mode enabled" : "Normal contrast mode enabled");
    });
  }

  // Screen reader demo announce button
  const btnScreenReader = document.getElementById("btn-screen-reader");
  if (btnScreenReader) {
    btnScreenReader.addEventListener("click", () => {
      showToast("Screen Reader optimized: Standard ARIA landmarks & tags active.", "info");
      announceToScreenReader("Screen Reader Mode Active. Use Tab and Shift+Tab to navigate.");
    });
  }
}

// Navigation & Auth State Initializer
function initNavigation() {
  // Mobile Hamburger Toggle
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".gov-nav-menu");
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Active page indicator
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".gov-nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Dynamic user login / logout state in header
  const currentUser = JSON.parse(localStorage.getItem("epaddy_current_user") || "null");
  const navRightActions = document.querySelector(".gov-nav-right-actions");
  
  if (navRightActions && currentUser) {
    navRightActions.innerHTML = `
      <span style="font-size:0.85rem; color:#ffffff; margin-right:8px;">
        <strong>${currentUser.name || "Farmer"}</strong> (${currentUser.role || "Farmer"})
      </span>
      <a href="${currentUser.role === 'Admin' ? 'admin-dashboard.html' : 'farmer-dashboard.html'}" class="btn btn-sm btn-secondary" style="font-size:0.8rem;">
        Dashboard
      </a>
      <button id="btn-logout" class="btn btn-sm btn-danger" style="font-size:0.8rem;">
        Logout
      </button>
    `;

    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("epaddy_current_user");
        showToast("Logged out successfully.", "info");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      });
    }
  }
}

// Run on page ready
document.addEventListener("DOMContentLoaded", () => {
  initSeedData();
  initAccessibility();
  initNavigation();
});
