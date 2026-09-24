const KLIPLER_KEY = "klipler";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get([KLIPLER_KEY], function (g) {
    if (!g[KLIPLER_KEY]) {
      const obj = {};
      obj[KLIPLER_KEY] = [];
      chrome.storage.local.set(obj);
    }
  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg && msg.aktiyon === "klip_al") {
    chrome.tabs.query({ currentWindow: true }, function (sekmeler) {
      const artik = new Date().toISOString();
      const eklenecekler = [];
      sekmeler.forEach(function (s) {
        if (!s.url || !s.title) return;
        if (/^chrome:\/\/|^chrome-extension:\/\/|^edge:\/\/|^about:/.test(s.url)) return;
        if (s.title.trim() === "Yeni Sekme" || s.title.trim() === "New Tab") return;
        eklenecekler.push({
          url: s.url,
          title: s.title.trim(),
          favicon: s.favIconUrl || "",
          tarih: artik,
          okundu: false
        });
      });
      if (!eklenecekler.length) return sendResponse({ ok: false, hata: "Kliplenecek sekme yok." });
      chrome.storage.local.get([KLIPLER_KEY], function (g) {
        let mevcut = g[KLIPLER_KEY] || [];
        const yeni = [];
        eklenecekler.forEach(function (k) {
          const zaten = mevcut.some(function (m) { return m.url === k.url; });
          if (!zaten) { k.id = Math.random().toString(36).slice(2) + Date.now().toString(36); yeni.push(k); }
        });
        mevcut = yeni.concat(mevcut);
        const obj = {};
        obj[KLIPLER_KEY] = mevcut;
        chrome.storage.local.set(obj, function () {
          sendResponse({ ok: true, yeni: yeni.length, onceki: eklenecekler.length });
        });
      });
    });
    return true;
  }
});