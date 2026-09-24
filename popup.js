const klipBtn = document.getElementById("klipBtn");
const panelBtn = document.getElementById("panelBtn");
const durum = document.getElementById("durum");

function goster(mesaj, sinif) {
  durum.textContent = mesaj;
  durum.className = sinif || "";
}

klipBtn.addEventListener("click", function () {
  klipBtn.disabled = true;
  goster("Klipleniyor...");
  chrome.runtime.sendMessage({ aktiyon: "klip_al" }, function (r) {
    klipBtn.disabled = false;
    if (chrome.runtime.lastError || !r) {
      goster("Hata: " + (chrome.runtime.lastError ? chrome.runtime.lastError.message : "bilinmiyor"), "hata");
      return;
    }
    if (!r.ok) return goster(r.hata || "İşlem başarısız.", "hata");
    const not = r.onceki - r.yeni > 0 ? " (" + (r.onceki - r.yeni) + " zaten listede)" : "";
    goster("✅ " + r.yeni + " sekme klip edildi" + not + ".", "ok");
  });
});

panelBtn.addEventListener("click", function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("panel.html") });
});