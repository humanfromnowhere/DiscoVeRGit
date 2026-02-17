// --- DEĞİŞKENLER ---
const container = document.getElementById('unity-container');
const infoBadge = document.getElementById('yukleniyor-bilgisi');
const statusLight = document.getElementById('durum-isigi');
let unityErisim = null;

// --- AYARLAR ---
// Klasör yollarını buradan yönetirsin
const buildUrl = "unity_dosyalari/Build";
const loaderUrl = buildUrl + "/unity_dosyalari.loader.js"; // Dosya adına dikkat!
const config = {
    dataUrl: buildUrl + "/unity_dosyalari.data",
    frameworkUrl: buildUrl + "/unity_dosyalari.framework.js",
    codeUrl: buildUrl + "/unity_dosyalari.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "SanalTur",
    productVersion: "1.0",
};

// --- SAYFA YÜKLENİNCE ÇALIŞIR ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. İkonları Oluştur
    lucide.createIcons();

    // 2. Unity Scriptini Yükle ve Başlat
    var script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
        createUnityInstance(document.querySelector("#unity-canvas"), config)
        .then((instance) => {
            unityErisim = instance;
            console.log("✅ Unity Hazır!");
            statusLight.innerText = "🟢 Hazır";
            statusLight.className = "text-green-500 font-bold";
        }).catch((err) => {
            console.error("Unity Hatası:", err);
            statusLight.innerText = "🔴 Hata!";
        });
    };
    document.body.appendChild(script);
});

// --- MODEL AÇMA FONKSİYONU ---
function ModelAc(dosyaAdi) {
    // Pencereyi Göster
    container.classList.remove('gizli');
    container.scrollIntoView({ behavior: 'smooth' });
    
    // Bilgi Rozetini Göster
    infoBadge.style.display = 'block';
    infoBadge.innerText = "⏳ " + dosyaAdi + " indiriliyor...";

    // Unity'ye Emir Ver
    if (unityErisim) {
        console.log("Unity'ye gönderiliyor: " + dosyaAdi);
        unityErisim.SendMessage('Yonetici', 'ModelYukle', dosyaAdi);
        
        // 2 saniye sonra yazıyı kaldır
        setTimeout(() => {
            infoBadge.style.display = 'none';
        }, 2000);
    } else {
        alert("Unity henüz tam yüklenmedi, lütfen 2-3 saniye bekleyin.");
    }
}

// --- PENCEREYİ GİZLEME ---
function UnityGizle() {
    container.classList.add('gizli');
}