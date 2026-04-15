const ModelConverter = require('./modelConverter');
const fs = require('fs');

async function testConversion() {
    console.log('Testing Model Converter...');
    
    const converter = new ModelConverter();
    
    // Test format detection
    console.log('\n=== Format Detection Tests ===');
    console.log('needsConversion("model.obj"):', converter.needsConversion("model.obj"));
    console.log('needsConversion("model.fbx"):', converter.needsConversion("model.fbx"));
    console.log('needsConversion("model.glb"):', converter.needsConversion("model.glb"));
    console.log('needsConversion("model.gltf"):', converter.needsConversion("model.gltf"));
    
    // Test with a simple OBJ file if available
    const testObjPath = './uploads/bambu.obj';
    if (fs.existsSync(testObjPath)) {
        console.log('\n=== Testing OBJ Conversion ===');
        try {
            const objBuffer = fs.readFileSync(testObjPath);
            const result = await converter.convertModel(objBuffer, 'bambu.obj', 'glb');
            console.log('Conversion successful!');
            console.log('Original size:', objBuffer.length, 'bytes');
            console.log('Converted size:', result.buffer.length, 'bytes');
            console.log('Output filename:', result.filename);
        } catch (error) {
            console.error('Conversion failed:', error.message);
        }
    } else {
        console.log('\nNo test OBJ file found at', testObjPath);
        console.log('To test conversion, place an OBJ file in the uploads directory');
    }
    
    console.log('\nTest completed.');
}

// Run the test
testConversion().catch(console.error);
