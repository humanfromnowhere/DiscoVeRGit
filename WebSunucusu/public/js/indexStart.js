// Sayfa Yüklendiğinde Çalışır
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. İkonları Başlat
    lucide.createIcons();

    // 2. Tab (Sekme) Geçişleri
    const btnDash = document.getElementById('tab-dashboard');
    const btnModels = document.getElementById('tab-models');
    const pageDash = document.getElementById('page-dashboard');
    const pageModels = document.getElementById('page-models');

    function switchTab(tabName) {
        if(tabName === 'dashboard') {
            pageDash.classList.remove('hidden');
            pageModels.classList.add('hidden');
            // Stil
            btnDash.className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-purple-600 text-white shadow-md";
            btnModels.className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-slate-600 hover:bg-slate-100";
        } else {
            pageDash.classList.add('hidden');
            pageModels.classList.remove('hidden');
            // Stil
            btnDash.className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-slate-600 hover:bg-slate-100";
            btnModels.className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-purple-600 text-white shadow-md";
        }
    }

    btnDash.addEventListener('click', () => switchTab('dashboard'));
    btnModels.addEventListener('click', () => switchTab('models'));

    // 3. Model Yükleme Butonları
    const modelButtons = document.querySelectorAll('.btn-view-model');
    const unityWrapper = document.getElementById('unity-wrapper');

    modelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modelIsmi = this.getAttribute('data-model');
            
            // Unity Alanını Göster
            unityWrapper.classList.remove('hidden');
            unityWrapper.scrollIntoView({ behavior: 'smooth' });

            // Unity'ye Mesaj Gönder (objOkuyucu.js ile bağlantılı)
            if(typeof unityErisim !== 'undefined' && unityErisim) {
                unityErisim.SendMessage('Yonetici', 'ModelYukle', modelIsmi);
            } else {
                alert("Unity henüz yüklenmedi, lütfen bekleyin...");
            }
        });
    });

    // 4. Unity Kapatma
    document.getElementById('btn-close-unity').addEventListener('click', () => {
        unityWrapper.classList.add('hidden');
    });

    // 5. Çıkış Yap
    document.getElementById('btn-logout').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});