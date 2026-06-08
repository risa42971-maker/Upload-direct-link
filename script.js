// ========== USER ID SYSTEM ==========
let currentUserId = localStorage.getItem("nebula_user_id");
if (!currentUserId) {
    currentUserId = Math.floor(Math.random() * 9000000000) + 1000000000;
    localStorage.setItem("nebula_user_id", currentUserId);
    let allUsers = localStorage.getItem("nebula_global_users");
    if (allUsers) {
        let userArr = JSON.parse(allUsers);
        if (!userArr.includes(currentUserId)) userArr.push(currentUserId);
        localStorage.setItem("nebula_global_users", JSON.stringify(userArr));
    } else {
        localStorage.setItem("nebula_global_users", JSON.stringify([currentUserId]));
    }
} else {
    let allUsers = localStorage.getItem("nebula_global_users");
    if (allUsers) {
        let userArr = JSON.parse(allUsers);
        if (!userArr.includes(currentUserId)) {
            userArr.push(currentUserId);
            localStorage.setItem("nebula_global_users", JSON.stringify(userArr));
        }
    } else {
        localStorage.setItem("nebula_global_users", JSON.stringify([currentUserId]));
    }
}

document.getElementById("globalUserId").innerText = currentUserId;

// ========== ADMIN CONFIG ==========
const ADMIN_ID = "7959393058";
const isAdmin = (currentUserId.toString() === ADMIN_ID);

function getTotalGlobalUsers() {
    const raw = localStorage.getItem("nebula_global_users");
    if (!raw) return 1;
    const arr = JSON.parse(raw);
    return arr.length;
}

// Admin double-click header
const headerArea = document.querySelector(".app-header");
headerArea.addEventListener("dblclick", () => {
    if (isAdmin) {
        const totalUnique = getTotalGlobalUsers();
        const resultsDiv = document.getElementById("dynamicResults");
        const adminCard = document.createElement("div");
        adminCard.className = "result-panel";
        adminCard.style.borderLeft = "4px solid #38bdf8";
        adminCard.innerHTML = `<div><i class="fas fa-chart-simple"></i> <strong>📊 Admin Panel</strong><br>👥 <strong>Total Users</strong>: ${totalUnique}<br><small>/users command simulated</small><br>🆔 Admin ID: ${currentUserId}</div>`;
        adminCard.id = "tempAdminCard";
        const old = document.getElementById("tempAdminCard");
        if (old) old.remove();
        resultsDiv.prepend(adminCard);
        setTimeout(() => { if(adminCard) adminCard.remove(); }, 6000);
    } else {
        const resultsDiv = document.getElementById("dynamicResults");
        const denyCard = document.createElement("div");
        denyCard.className = "result-panel";
        denyCard.style.background = "#44000066";
        denyCard.innerHTML = `<i class="fas fa-shield-alt"></i> Access denied: Admin only. Your ID: ${currentUserId}<br>Required ID: ${ADMIN_ID}`;
        denyCard.id = "denyToast";
        resultsDiv.prepend(denyCard);
        setTimeout(() => denyCard.remove(), 4000);
    }
});

// Add admin button to subhead
if (isAdmin) {
    const subheadSpan = document.querySelector(".subhead");
    const adminBtn = document.createElement("span");
    adminBtn.style.cursor = "pointer";
    adminBtn.style.background = "#1e2a44";
    adminBtn.style.padding = "2px 12px";
    adminBtn.style.borderRadius = "60px";
    adminBtn.style.fontSize = "0.7rem";
    adminBtn.innerHTML = `<i class="fas fa-users"></i> /users (${getTotalGlobalUsers()})`;
    adminBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const totalNow = getTotalGlobalUsers();
        const resultsDiv = document.getElementById("dynamicResults");
        const statCard = document.createElement("div");
        statCard.className = "result-panel";
        statCard.innerHTML = `<i class="fas fa-database"></i> 👥 Total unique users: <strong>${totalNow}</strong><br><small>localStorage unique IDs</small>`;
        resultsDiv.prepend(statCard);
        setTimeout(() => statCard.remove(), 5000);
    });
    subheadSpan.appendChild(adminBtn);
}

// ========== DOM ELEMENTS ==========
const dropzone = document.getElementById("dropzoneEl");
const fileInput = document.getElementById("fileInput");
const previewDiv = document.getElementById("previewFileName");
const progressArea = document.getElementById("progressArea");
const progressFill = document.getElementById("uploadProgressFill");
const statusMsgSpan = document.getElementById("statusMessage");
const resultsContainer = document.getElementById("dynamicResults");
const clearBtn = document.getElementById("clearResultsBtn");

// ========== HELPER FUNCTIONS ==========
function setStatus(text, isLoading = false) {
    if (isLoading) {
        statusMsgSpan.innerHTML = `<div class="spinner-sm"></div> ${text}`;
    } else {
        statusMsgSpan.innerHTML = `<i class="fas fa-info-circle"></i> ${text}`;
    }
}

function showProgress(show) {
    if (show) {
        progressArea.style.display = "block";
        progressFill.style.width = "0%";
    } else {
        progressArea.style.display = "none";
    }
}

function resetProgress() {
    progressFill.style.width = "0%";
    showProgress(false);
    setStatus("Ready", false);
}

// Check if file is an image by extension or mime
function isImageFile(file) {
    const imageMimes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];
    if (imageMimes.includes(file.type)) return true;
    const ext = file.name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
}

// Upload to Catbox
async function uploadToCatbox(file) {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", file);
    
    setStatus("Uploading to Catbox...", true);
    showProgress(true);
    
    // Fake progress animation
    let fakePercent = 0;
    const interval = setInterval(() => {
        if (fakePercent < 85) {
            fakePercent += Math.random() * 12;
            if (fakePercent > 85) fakePercent = 85;
            progressFill.style.width = fakePercent + "%";
        }
    }, 250);
    
    try {
        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData
        });
        
        clearInterval(interval);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const link = await response.text();
        progressFill.style.width = "100%";
        
        if (!link || !link.startsWith("https://")) {
            throw new Error("Invalid response from Catbox");
        }
        
        return link.trim();
    } catch (error) {
        clearInterval(interval);
        throw new Error(`Upload failed: ${error.message}`);
    }
}

// Generate QR Code using QRCode.js
function generateQRCode(link, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; // clear previous
    new QRCode(container, {
        text: link,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// Display result in UI
function displayResult(link, fileName, isImage) {
    const resultDiv = document.createElement("div");
    resultDiv.className = "result-panel";
    
    const timestamp = new Date().toLocaleTimeString();
    const fileTypeBadge = isImage ? '<span class="badge-img"><i class="fas fa-camera"></i> Image detected → QR ready</span>' : '<span class="badge-img"><i class="fas fa-file"></i> Direct link only</span>';
    
    resultDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <strong><i class="fas fa-link"></i> Direct Link</strong>
            ${fileTypeBadge}
        </div>
        <div class="link-container" id="linkText_${Date.now()}">${link}</div>
        <div class="btn-group">
            <button class="btn-copy" data-link="${link}"><i class="fas fa-copy"></i> Copy Link</button>
        </div>
        <div style="font-size:0.7rem; color:#8aaec0; margin-top: 4px;">
            <i class="fas fa-user"></i> User ID: ${currentUserId} &nbsp;|&nbsp; 
            <i class="far fa-clock"></i> ${timestamp} &nbsp;|&nbsp;
            <i class="fas fa-file"></i> ${fileName}
        </div>
        <div id="qrContainer_${Date.now()}" class="qr-block" style="${isImage ? '' : 'display: none;'}">
            <div class="qr-wrapper" id="qrInner_${Date.now()}"></div>
            <div class="qr-meta"><i class="fas fa-qrcode"></i> Scan to view image</div>
        </div>
    `;
    
    resultsContainer.prepend(resultDiv);
    
    // Attach copy event
    const copyBtn = resultDiv.querySelector(".btn-copy");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(link).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
        }).catch(() => alert("Could not copy"));
    });
    
    // Generate QR if image
    if (isImage) {
        const qrBlock = resultDiv.querySelector(`[id^="qrInner_"]`);
        const qrId = qrBlock.id;
        generateQRCode(link, qrId);
    }
}

// Main file handler
async function handleFile(file) {
    if (!file) return;
    
    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "result-panel error-msg";
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> File too large! Max 200MB.`;
        resultsContainer.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
        resetProgress();
        return;
    }
    
    // Show preview
    previewDiv.style.display = "inline-flex";
    previewDiv.innerHTML = `<i class="fas fa-file"></i> ${file.name.substring(0, 40)}${file.name.length > 40 ? '...' : ''}`;
    
    const isImage = isImageFile(file);
    
    try {
        const link = await uploadToCatbox(file);
        setStatus("Upload complete! ✅", false);
        progressFill.style.width = "100%";
        
        displayResult(link, file.name, isImage);
        
        setTimeout(() => {
            resetProgress();
            previewDiv.style.display = "none";
        }, 1000);
        
    } catch (error) {
        console.error(error);
        setStatus("Upload failed", false);
        const errorDiv = document.createElement("div");
        errorDiv.className = "result-panel error-msg";
        errorDiv.innerHTML = `<i class="fas fa-skull-crosswalk"></i> Error: ${error.message}`;
        resultsContainer.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 6000);
        resetProgress();
        previewDiv.style.display = "none";
    }
}

// ========== EVENT LISTENERS ==========
dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.background = "rgba(56, 189, 248, 0.2)";
});

dropzone.addEventListener("dragleave", () => {
    dropzone.style.background = "rgba(10, 20, 35, 0.7)";
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.background = "rgba(10, 20, 35, 0.7)";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
    fileInput.value = "";
});

clearBtn.addEventListener("click", () => {
    resultsContainer.innerHTML = "";
    resetProgress();
    previewDiv.style.display = "none";
    setStatus("Cleared", false);
});