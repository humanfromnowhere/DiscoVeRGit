const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());

// 1. Site arayüzünü sun (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 2. KRİTİK NOKTA: Uploads klasörünü Unity'nin erişimine aç
// Bu satır olmazsa Unity dosyayı bulamaz, boş gri ekran görürsün.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Direkt ana sayfayı aç
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu Hazır: http://localhost:${PORT}`);
    console.log(`📂 Modeller Test: http://localhost:${PORT}/uploads/bambu.obj`);
});