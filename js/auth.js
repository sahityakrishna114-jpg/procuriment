/**
 * e-Paddy Portal: Authentication & OTP Simulation Module
 * Farmer and Admin logins with mock OTP verification
 */

let pendingAuthFarmer = null;
let otpTimerInterval = null;

// Tab switcher for Farmer Login
function initAuthTabs() {
  const tabs = document.querySelectorAll(".auth-tab");
  const tabContents = document.querySelectorAll(".auth-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// Captcha Simulation
function refreshCaptcha(containerId = "captcha-code") {
  const codeElem = document.getElementById(containerId);
  if (!codeElem) return;

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  codeElem.textContent = captcha;
  codeElem.setAttribute("data-code", captcha);
}

// Quick autofill demo credentials
function fillDemoFarmer(regNo) {
  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  const farmer = farmers.find((f) => f.id === regNo);
  if (!farmer) return;

  // Fill in Registration No tab
  const regInput = document.getElementById("login-reg-number");
  if (regInput) regInput.value = farmer.id;

  // Fill in Mobile tab
  const mobileInput = document.getElementById("login-mobile-number");
  if (mobileInput) mobileInput.value = farmer.mobile;

  // Fill in Aadhaar tab
  const aadhaarInput = document.getElementById("login-aadhaar-number");
  if (aadhaarInput) aadhaarInput.value = farmer.aadhaar;

  // Auto fill captcha
  const captchaText = document.getElementById("captcha-code")?.getAttribute("data-code");
  const captchaInput = document.getElementById("login-captcha-input");
  if (captchaInput && captchaText) captchaInput.value = captchaText;

  showToast(`Pre-filled credentials for ${farmer.name} (${farmer.id})`, "info");
}

// Handle OTP Request
function handleFarmerOtpRequest(identifierType) {
  let identifierValue = "";
  if (identifierType === "reg") {
    identifierValue = document.getElementById("login-reg-number")?.value.trim();
  } else if (identifierType === "mobile") {
    identifierValue = document.getElementById("login-mobile-number")?.value.trim();
  } else if (identifierType === "aadhaar") {
    identifierValue = document.getElementById("login-aadhaar-number")?.value.trim();
  }

  const captchaInput = document.getElementById("login-captcha-input")?.value.trim();
  const actualCaptcha = document.getElementById("captcha-code")?.getAttribute("data-code");

  if (!identifierValue) {
    showToast("Please enter your login identifier.", "danger");
    return;
  }

  if (captchaInput.toUpperCase() !== actualCaptcha) {
    showToast("Invalid security Captcha code. Please try again.", "danger");
    refreshCaptcha();
    return;
  }

  const farmers = JSON.parse(localStorage.getItem("epaddy_farmers") || "[]");
  let farmer = null;

  if (identifierType === "reg") {
    farmer = farmers.find((f) => f.id.toLowerCase() === identifierValue.toLowerCase());
  } else if (identifierType === "mobile") {
    farmer = farmers.find((f) => f.mobile === identifierValue);
  } else if (identifierType === "aadhaar") {
    farmer = farmers.find((f) => f.aadhaar === identifierValue);
  }

  // Fallback demo matching if not found
  if (!farmer && farmers.length > 0) {
    farmer = farmers[0];
  }

  if (!farmer) {
    showToast("No registered record found with given details. Please register first.", "danger");
    return;
  }

  pendingAuthFarmer = farmer;

  // Open OTP modal & start countdown
  const phoneDisplay = document.getElementById("otp-modal-mobile");
  if (phoneDisplay) {
    phoneDisplay.textContent = `XXXX-XX-${farmer.mobile.slice(-4)}`;
  }

  startOtpTimer();
  openModal("otp-modal");
  showToast(`Mock OTP sent to linked mobile. (Demo OTP is: 123456)`, "success");
}

function startOtpTimer() {
  let seconds = 60;
  const timerElem = document.getElementById("otp-timer-count");
  const resendBtn = document.getElementById("btn-resend-otp");

  if (resendBtn) resendBtn.disabled = true;

  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (timerElem) timerElem.textContent = `${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
      if (resendBtn) resendBtn.disabled = false;
      if (timerElem) timerElem.textContent = "Expired";
    }
  }, 1000);
}

// Verify OTP & complete login
function verifyFarmerOtp() {
  const otpInputs = document.querySelectorAll(".otp-box");
  let enteredOtp = "";
  otpInputs.forEach((input) => (enteredOtp += input.value.trim()));

  if (enteredOtp.length < 6) {
    showToast("Please enter the complete 6-digit OTP.", "danger");
    return;
  }

  // Allow "123456" or any 6 digits for testing ease
  if (enteredOtp === "123456" || enteredOtp.length === 6) {
    clearInterval(otpTimerInterval);
    closeModal("otp-modal");

    const sessionUser = {
      id: pendingAuthFarmer.id,
      name: pendingAuthFarmer.name,
      mobile: pendingAuthFarmer.mobile,
      district: pendingAuthFarmer.district,
      mandal: pendingAuthFarmer.mandal,
      role: "Farmer"
    };

    localStorage.setItem("epaddy_current_user", JSON.stringify(sessionUser));
    showToast("OTP Verified successfully! Redirecting to Farmer Dashboard...", "success");

    setTimeout(() => {
      window.location.href = "farmer-dashboard.html";
    }, 900);
  } else {
    showToast("Incorrect OTP entered. Use demo OTP 123456.", "danger");
  }
}

// Admin / Departmental Login
function handleAdminLogin(event) {
  if (event) event.preventDefault();

  const empId = document.getElementById("admin-emp-id")?.value.trim();
  const password = document.getElementById("admin-password")?.value.trim();
  const district = document.getElementById("admin-district")?.value;
  const role = document.getElementById("admin-role")?.value || "District Procurement Officer";

  if (!empId || !password) {
    showToast("Please enter Officer ID and Password.", "danger");
    return;
  }

  const sessionUser = {
    id: empId,
    name: "Sri M. Rajasekhar, IAS",
    role: "Admin",
    officialRole: role,
    district: district || "Guntur"
  };

  localStorage.setItem("epaddy_current_user", JSON.stringify(sessionUser));
  showToast("Departmental authentication successful! Opening Admin Dashboard...", "success");

  setTimeout(() => {
    window.location.href = "admin-dashboard.html";
  }, 900);
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initAuthTabs();
  refreshCaptcha();

  // Refresh captcha click
  const refreshBtn = document.getElementById("btn-refresh-captcha");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => refreshCaptcha());
  }

  // OTP Box Auto-focus behavior
  const otpBoxes = document.querySelectorAll(".otp-box");
  otpBoxes.forEach((box, idx) => {
    box.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && idx < otpBoxes.length - 1) {
        otpBoxes[idx + 1].focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && idx > 0) {
        otpBoxes[idx - 1].focus();
      }
    });
  });
});
