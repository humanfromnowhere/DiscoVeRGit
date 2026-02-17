document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Sekmeler
    const tabs = {
        dashboard: document.getElementById('page-dashboard'),
        upload: document.getElementById('page-upload'),
        models: document.getElementById('page-models')
    };

    const btns = {
        dashboard: document.getElementById('tab-dashboard'),
        upload: document.getElementById('tab-upload'),
        models: document.getElementById('tab-models')
    };

    function showAdminTab(name) {
        // Hepsini Gizle
        Object.values(tabs).forEach(el => el.classList.add('hidden'));
        // Hepsini Pasif Yap
        Object.values(btns).forEach(btn => btn.className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-slate-600 hover:bg-slate-100");

        // Seçileni Göster
        tabs[name].classList.remove('hidden');
        btns[name].className = "flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-amber-600 text-white shadow-md";
    }

    btns.dashboard.addEventListener('click', () => showAdminTab('dashboard'));
    btns.upload.addEventListener('click', () => showAdminTab('upload'));
    btns.models.addEventListener('click', () => showAdminTab('models'));

    // Model Yükleme (Unity) - Kullanıcı ile aynı mantık
    const unityWrapper = document.getElementById('unity-wrapper');
    document.querySelectorAll('.btn-view-model').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.getAttribute('data-model');
            unityWrapper.classList.remove('hidden');
            if(unityErisim) unityErisim.SendMes
            ge('Yonetici', 'ModelYukle', model);
        });
    });

    document.getElementById('btn-close-unity').addEventListener('click', () => unityWrapper.classList.add('hidden'));
    document.getElementById('btn-logout').addEventListener('click', () => window.location.href = 'login.html');
});