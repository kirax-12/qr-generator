// QR Generator — semua proses jalan lokal di browser, nggak ada data yang dikirim ke server.

var QUIET_ZONE = 4; // modul kosong di sekeliling QR, wajib ada biar gampang di-scan
var ERROR_LEVEL = "M";

var state = {
  mode: "text",
  hasQr: false
};

var els = {
  tabs: document.querySelectorAll(".tab"),
  panelText: document.getElementById("panel-text"),
  panelWifi: document.getElementById("panel-wifi"),
  text: document.getElementById("input-text"),
  ssid: document.getElementById("input-ssid"),
  wifiPass: document.getElementById("input-wifi-pass"),
  wifiPassField: document.getElementById("wifi-pass-field"),
  wifiEnc: document.getElementById("input-wifi-enc"),
  size: document.getElementById("input-size"),
  fg: document.getElementById("input-fg"),
  bg: document.getElementById("input-bg"),
  canvas: document.getElementById("qr-canvas"),
  payloadPreview: document.getElementById("payload-preview"),
  errorMsg: document.getElementById("error-msg"),
  download: document.getElementById("download-button")
};

// Karakter ; , " \ : di SSID & password WiFi harus di-escape pakai backslash,
// kalau nggak format WIFI:...; nggak dikenali pemindai.
function escapeWifiValue(value) {
  return value.replace(/([\\;,":])/g, "\\$1");
}

function buildPayload() {
  if (state.mode === "wifi") {
    var ssid = els.ssid.value.trim();
    if (!ssid) return "";
    var enc = els.wifiEnc.value;
    var payload = "WIFI:T:" + enc + ";S:" + escapeWifiValue(ssid) + ";";
    if (enc !== "nopass") {
      payload += "P:" + escapeWifiValue(els.wifiPass.value) + ";";
    }
    return payload + ";";
  }
  return els.text.value.trim();
}

function drawPlaceholder(message) {
  var size = parseInt(els.size.value, 10);
  var ctx = els.canvas.getContext("2d");
  els.canvas.width = size;
  els.canvas.height = size;
  ctx.fillStyle = els.bg.value;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#55534e";
  ctx.font = "700 " + Math.max(14, Math.round(size / 18)) + "px 'Space Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, size / 2, size / 2, size - 32);
}

function drawQr(payload) {
  var qr = qrcode(0, ERROR_LEVEL);
  qr.addData(payload, "Byte");
  qr.make();

  var moduleCount = qr.getModuleCount();
  var totalModules = moduleCount + QUIET_ZONE * 2;
  var size = parseInt(els.size.value, 10);
  var cell = size / totalModules;

  els.canvas.width = size;
  els.canvas.height = size;
  var ctx = els.canvas.getContext("2d");

  ctx.fillStyle = els.bg.value;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = els.fg.value;

  // Tiap modul digambar sedikit lebih besar (ceil + 1) biar nggak ada celah garis putih di antara modul.
  var cellPx = Math.ceil(cell);
  for (var row = 0; row < moduleCount; row++) {
    for (var col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          Math.round((col + QUIET_ZONE) * cell),
          Math.round((row + QUIET_ZONE) * cell),
          cellPx,
          cellPx
        );
      }
    }
  }
}

function showError(message) {
  els.errorMsg.textContent = message;
  els.errorMsg.hidden = !message;
}

function generate() {
  var payload = buildPayload();
  els.payloadPreview.textContent = payload ? payload : "";
  showError("");
  state.hasQr = false;

  if (!payload) {
    drawPlaceholder(state.mode === "wifi" ? "Isi nama WiFi dulu →" : "Isi teks / link dulu →");
    els.download.disabled = true;
    return;
  }

  try {
    drawQr(payload);
    state.hasQr = true;
    els.download.disabled = false;
  } catch (err) {
    // Library melempar error kalau isi kepanjangan buat satu QR.
    drawPlaceholder("Kepanjangan!");
    showError("Isinya kepanjangan buat satu kode QR. Pendekin dikit, ya.");
    els.download.disabled = true;
  }
}

var debounceTimer = null;
function scheduleGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generate, 180);
}

function setMode(mode) {
  state.mode = mode;
  els.tabs.forEach(function (tab) {
    var active = tab.getAttribute("data-mode") === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });
  els.panelText.hidden = mode !== "text";
  els.panelWifi.hidden = mode !== "wifi";
  generate();
}

els.tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    setMode(tab.getAttribute("data-mode"));
  });
});

[els.text, els.ssid, els.wifiPass].forEach(function (input) {
  input.addEventListener("input", scheduleGenerate);
});
[els.size, els.fg, els.bg].forEach(function (input) {
  input.addEventListener("input", scheduleGenerate);
  input.addEventListener("change", scheduleGenerate);
});
els.wifiEnc.addEventListener("change", function () {
  els.wifiPassField.hidden = els.wifiEnc.value === "nopass";
  scheduleGenerate();
});

els.download.addEventListener("click", function () {
  if (!state.hasQr) return;
  var link = document.createElement("a");
  link.download = state.mode === "wifi" ? "qr-wifi.png" : "qr-code.png";
  link.href = els.canvas.toDataURL("image/png");
  link.click();
});

generate();
