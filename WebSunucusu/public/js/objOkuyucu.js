const klasorYolu = "unity_dosyalari/Build/"; 
const buildIsmi = "unity_dosyalari"; 

var unityErisim = null;
document.addEventListener("DOMContentLoaded", function() {
    
    // Sadece Unity canvas varsa çalıştır
    if(document.querySelector("#unity-canvas")) {
        var script = document.createElement("script");
        script.src = klasorYolu + buildIsmi + ".loader.js";

        script.onload = () => {
            createUnityInstance(document.querySelector("#unity-canvas"), {
                dataUrl: klasorYolu + buildIsmi + ".data",
                frameworkUrl: klasorYolu + buildIsmi + ".framework.js",
                codeUrl: klasorYolu + buildIsmi + ".wasm",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "DefaultCompany",
                productName: "SanalTur",
                productVersion: "1.0",
            }).then((instance) => {
                unityErisim = instance;
                console.log("✅ Unity Başarıyla Yüklendi!");
            }).catch((err) => {
                console.error("Unity Yükleme Hatası:", err);
            });
        };
        document.body.appendChild(script);
    }
    
    // Sidebar'ı Yükle (Eğer sayfada sidebar yeri varsa)
    if(document.getElementById("sidebar-placeholder")) {
        fetch("components/sidebar.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("sidebar-placeholder").innerHTML = data;
            });
    }
});

// HTML'den çağrılan fonksiyon
function ModelCagir(isim, butonElementi) {
    if (unityErisim) {
        console.log("Model Gönderiliyor: " + isim);
        unityErisim.SendMessage('Yonetici', 'ModelYukle', isim);
        
        // Buton renklerini ayarla
        if(butonElementi) {
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            butonElementi.classList.add('active');
        }
    } else {
        alert("Unity hazırlanıyor, lütfen bekleyin...");
    }
}