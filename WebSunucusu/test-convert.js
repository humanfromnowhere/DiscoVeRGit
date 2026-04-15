const fs = require('fs');

async function testConversion() {
    try {
        console.log('🧪 Testing /convert-model endpoint...');
        
        // Read the file as buffer
        const fileBuffer = fs.readFileSync('uploads/bambu.obj');
        
        // Create a simple multipart boundary
        const boundary = '----formdata-test-' + Math.random().toString(16);
        
        // Build multipart form data manually
        let formData = '';
        
        // Add model file
        formData += `--${boundary}\r\n`;
        formData += `Content-Disposition: form-data; name="model"; filename="bambu.obj"\r\n`;
        formData += `Content-Type: application/octet-stream\r\n\r\n`;
        
        const header = Buffer.from(formData, 'utf8');
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
        
        // Add other form fields
        let fields = '';
        fields += `--${boundary}\r\n`;
        fields += `Content-Disposition: form-data; name="originalName"\r\n\r\n`;
        fields += `bambu.obj\r\n`;
        fields += `--${boundary}\r\n`;
        fields += `Content-Disposition: form-data; name="outputFormat"\r\n\r\n`;
        fields += `glb\r\n`;
        
        const fieldsBuffer = Buffer.from(fields, 'utf8');
        
        // Combine all parts
        const body = Buffer.concat([header, fileBuffer, fieldsBuffer, footer]);
        
        const response = await fetch('http://localhost:3000/convert-model', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length
            },
            body: body
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return;
        }

        const result = await response.json();
        console.log('✅ Success!', result);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testConversion();
