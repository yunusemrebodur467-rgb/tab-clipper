# 📌 Tab Clipper

Açık sekmeleri tek tıkla "sonra oku" listesine alan Chrome eklentisi. Listeyi tek sayfada gösterir; favicon, başlık, tarih, okundu işareti, arama ve filtre destekler. Veri `chrome.storage.local` içinde saklanır — hiçbir yere gönderilmez.

**Canlı demo (statik):** https://yunusemrebodur467-rgb.github.io/tab-clipper/

## Özellikler

- 📌 **Tüm sekmeleri kliple** — bu penceredeki sekmelerin başlık + URL + favicon'unu alır (chrome://, chrome-extension:// ve boş sekmeleri atlar; zaten listede olanları tekrarlamaz)
- 📋 **Okuma paneli** — kayıtlı listeyi tek sayfada gösterir
- ✅ Okundu işareti (otomatik: Aç'a basınca / elle: ✓)
- ✕ Sil, 🔄 Temizle
- 🔍 Canlı arama (başlık veya URL)
- Filtre: Tümü / Okunmamış
- Veri `chrome.storage.local`'de kalıcı — senin verin sende

## Kurulum (yerel eklenti)

1. `chrome://extensions` adresine git
2. Sağ üstte **Geliştirici modu**'nu aç
3. **Paketlenmemiş öğe yükle** → bu klasörü (`tab_clipper`) seç
4. Araç çubuğundaki 📌 simgesine tıkla → **Tüm sekmeleri kliple**
5. **Okuma panelini aç** ile listeyi gör

## Proje yapısı

```
manifest.json   → MV3 tanımı (izinler: tabs, storage, favicon)
background.js   → klip_al mesaj işleyicisi
popup.html/js   → araç çubuğu açılır menüsü
panel.html/js   → okuma paneli (eklenti modu: chrome.storage)
index.html      → Pages demosu için panel.html kopyası (eklenti dışında localStorage + demo verisi)
.github/workflows/pages.yml → Pages deploy'u panel.html'i index.html olarak yayınlar
```

## Not

`index.html` yalnızca GitHub Pages demosu içindir: normal web sayfasında `chrome.*` API'leri olmadığından `localStorage` + örnek veri kullanır. Gerçek eklenti davranışı `panel.html`'dir.