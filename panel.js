const EXTN = !!(typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id);
const DEMO = !EXTN;

const LISTE = document.getElementById("liste");
const SAYAC = document.getElementById("sayac");
const ARAMA = document.getElementById("arama");
const BILGI = document.getElementById("bilgi");
let KAYITLAR = [];
let FILTRE = "hepsi";

const DEMO_KAYITLAR = [
  { id: "d1", title: "Chrome eklenti geliştirme rehberi", url: "https://developer.chrome.com/docs/extensions", favicon: "", tarih: new Date(Date.now() - 86400000 * 5).toISOString(), okundu: true },
  { id: "d2", title: "Sonra oku: bu makale", url: "https://example.com/sonra-oku", favicon: "", tarih: new Date(Date.now() - 86400000 * 2).toISOString(), okundu: false },
  { id: "d3", title: "MDN — JavaScript", url: "https://developer.mozilla.org/tr/docs/Web/JavaScript", favicon: "", tarih: new Date(Date.now() - 3600000 * 6).toISOString(), okundu: false }
];

function tarihGoster(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) + " " +
         d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function kaydet() {
  if (EXTN) chrome.storage.local.set({ klipler: KAYITLAR });
  else localStorage.setItem("klipler", JSON.stringify(KAYITLAR));
}

function ciz() {
  const terim = ARAMA.value.trim().toLowerCase();
  let gorunecek = KAYITLAR;
  if (FILTRE === "okunmadi") gorunecek = gorunecek.filter(function (k) { return !k.okundu; });
  if (terim) gorunecek = gorunecek.filter(function (k) {
    return (k.title + " " + k.url).toLowerCase().indexOf(terim) !== -1;
  });
  let okunmamis = 0;
  KAYITLAR.forEach(function (k) { if (!k.okundu) okunmamis++; });
  SAYAC.textContent = KAYITLAR.length ? ("(" + KAYITLAR.length + ")") : "";
  BILGI.textContent = KAYITLAR.length + " kayıt · " + okunmamis + " okunmamış";

  if (!gorunecek.length) {
    LISTE.innerHTML = '<div class="bos">' + (KAYITLAR.length ? "Filtreye uyan sonuç yok." : "Henüz klip yok — popup'tan 'Tüm sekmeleri kliple' düğmesine bas.") + '</div>';
    return;
  }
  LISTE.innerHTML = gorunecek.map(function (k) {
    const ikon = k.favicon ? '<img src="' + k.favicon + '" alt="">' : "📄";
    return '<div class="kayit' + (k.okundu ? " okundu" : "") + '">' +
      '<div class="ikon">' + ikon + '</div>' +
      '<div class="bilgi">' +
        '<div class="baslik">' + esc(k.title) + '</div>' +
        '<div class="url">' + esc(k.url) + '</div>' +
        '<div class="meta">' + tarihGoster(k.tarih) + (k.okundu ? " · okundu ✓" : "") + '</div>' +
      '</div>' +
      '<div class="islem">' +
        '<button class="ac" onclick="ac(\'' + k.id + '\')">Aç</button>' +
        '<button class="ok" onclick="okTog(\'' + k.id + '\')">✓</button>' +
        '<button class="sil" onclick="sild(\'' + k.id + '\')">✕</button>' +
      '</div></div>';
  }).join("");
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ac(id) {
  const k = KAYITLAR.find(function (x) { return x.id === id; });
  if (!k) return;
  if (!k.okundu) { k.okundu = true; kaydet(); }
  ciz();
  if (EXTN) chrome.tabs.create({ url: k.url });
  else window.open(k.url, "_blank");
}

function okTog(id) {
  const k = KAYITLAR.find(function (x) { return x.id === id; });
  if (!k) return;
  k.okundu = !k.okundu;
  kaydet();
  ciz();
}

function sild(id) {
  KAYITLAR = KAYITLAR.filter(function (x) { return x.id !== id; });
  kaydet();
  ciz();
}

document.getElementById("temizle").addEventListener("click", function () {
  if (!KAYITLAR.length) return;
  if (!confirm("Tüm kayıtları sil?")) return;
  KAYITLAR = [];
  kaydet();
  ciz();
});

document.getElementById("fHepsi").addEventListener("click", function () {
  FILTRE = "hepsi";
  aktifButon(this);
  ciz();
});
document.getElementById("fOkunmadi").addEventListener("click", function () {
  FILTRE = "okunmadi";
  aktifButon(this);
  ciz();
});
function aktifButon(btn) {
  document.querySelectorAll(".sag .btn").forEach(function (b) { b.classList.remove("aktif"); });
  btn.classList.add("aktif");
}

ARAMA.addEventListener("input", ciz);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { ARAMA.value = ""; ciz(); }
});

if (EXTN) {
  chrome.storage.local.get(["klipler"], function (g) {
    KAYITLAR = g.klipler || [];
    ciz();
  });
  chrome.storage.onChanged.addListener(function (deg, alan) {
    if (alan === "local" && deg.klipler) {
      KAYITLAR = deg.klipler.newValue || [];
      ciz();
    }
  });
} else {
  try {
    const ham = localStorage.getItem("klipler");
    KAYITLAR = ham ? JSON.parse(ham) : [];
  } catch (e) { KAYITLAR = []; }
  if (!KAYITLAR.length) KAYITLAR = DEMO_KAYITLAR.slice();
  document.querySelector(".sag").insertAdjacentHTML("afterbegin",
    '<button class="btn" onclick="demoDoldur()" title="Örnek veriyi geri döndür">Demo</button>');
  window.demoDoldur = function () {
    KAYITLAR = DEMO_KAYITLAR.slice();
    kaydet();
    ciz();
  };
  BILGI.textContent = "📄 Demo modu — sayfa GitHub Pages'te; eklentiyle yüklersen canlı klip alırsın";
  ciz();
}