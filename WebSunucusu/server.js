const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const ModelConverter = require('./modelConverter');

app.use(cors());

// Initialize model converter
const modelConverter = new ModelConverter();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// 1. Site arayüzünü sun (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 2. KRİTİK NOKTA: Uploads klasörünü Unity'nin erişimine aç
// Bu satır olmazsa Unity dosyayı bulamaz, boş gri ekran görürsün.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Direkt ana sayfayı aç
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Model Conversion Endpoint
app.post('/convert-model', upload.single('model'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalName, outputFormat = 'glb' } = req.body;
        
        // Check if conversion is needed
        if (!modelConverter.needsConversion(originalName)) {
            // Return original file if no conversion needed
            return res.json({
                success: true,
                url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                filename: originalName,
                converted: false
            });
        }

        // Convert the model
        const conversionResult = await modelConverter.convertModel(
            req.file.buffer,
            originalName,
            outputFormat
        );

        // Return converted file as base64 data URL
        const mimeType = outputFormat === 'glb' ? 'model/gltf-binary' : 'model/gltf+json';
        const dataUrl = `data:${mimeType};base64,${conversionResult.buffer.toString('base64')}`;

        res.json({
            success: true,
            url: dataUrl,
            filename: conversionResult.filename,
            converted: true
        });

    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ 
            error: error.message,
            success: false 
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu Hazır: http://localhost:${PORT}`);
    console.log(`📂 Modeller Test: http://localhost:${PORT}/uploads/bambu.obj`);
});