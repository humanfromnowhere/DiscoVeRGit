const fs = require('fs');
const path = require('path');
const obj2gltf = require('obj2gltf');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ModelConverter {
    constructor() {
        this.supportedFormats = {
            input: ['.obj', '.fbx', '.glb', '.gltf'],
            output: ['.glb', '.gltf']
        };
    }

    /**
     * Detects if a file needs conversion to GLTF/GLB format
     * @param {string} filename - Original filename
     * @returns {boolean} - True if conversion is needed
     */
    needsConversion(filename) {
        const ext = path.extname(filename).toLowerCase();
        return !['.glb', '.gltf'].includes(ext);
    }

    /**
     * Converts a 3D model file to GLTF or GLB format
     * @param {Buffer} fileBuffer - The file buffer
     * @param {string} originalFilename - Original filename with extension
     * @param {string} outputFormat - Desired output format ('glb' or 'gltf')
     * @returns {Promise<{buffer: Buffer, filename: string}>} - Converted file buffer and new filename
     */
    async convertModel(fileBuffer, originalFilename, outputFormat = 'glb') {
        const ext = path.extname(originalFilename).toLowerCase();
        const baseName = path.basename(originalFilename, ext);
        
        try {
            // Create temporary files for conversion
            const tempInputPath = path.join(__dirname, 'temp', `input_${Date.now()}_${originalFilename}`);
            const tempOutputPath = path.join(__dirname, 'temp', `output_${Date.now()}_${baseName}.${outputFormat}`);
            
            // Ensure temp directory exists
            await fs.promises.mkdir(path.dirname(tempInputPath), { recursive: true });
            
            // Write input file
            await fs.promises.writeFile(tempInputPath, fileBuffer);
            
            let result;
            
            // Convert based on input format
            switch (ext) {
                case '.obj':
                    result = await this.convertObjToGltf(tempInputPath, tempOutputPath, outputFormat);
                    break;
                case '.fbx':
                    result = await this.convertFbxToGltf(tempInputPath, tempOutputPath, outputFormat);
                    break;
                case '.glb':
                case '.gltf':
                    // No conversion needed, just return original
                    result = {
                        buffer: fileBuffer,
                        filename: originalFilename
                    };
                    break;
                default:
                    throw new Error(`Unsupported input format: ${ext}`);
            }
            
            // Clean up temporary files
            await this.cleanupTempFiles([tempInputPath, tempOutputPath]);
            
            return result;
            
        } catch (error) {
            console.error('Model conversion error:', error);
            throw new Error(`Model conversion failed: ${error.message}`);
        }
    }

    /**
     * Converts OBJ file to GLTF/GLB using obj2gltf library
     */
    async convertObjToGltf(inputPath, outputPath, outputFormat) {
        try {
            const options = {
                binary: outputFormat === 'glb',
                embedImages: true,
                compress: false
            };
            
            const gltf = await obj2gltf(inputPath, options);
            
            let buffer;
            if (outputFormat === 'glb') {
                // For GLB, we need to create a binary format
                buffer = await this.createGlbBuffer(gltf);
            } else {
                // For GLTF, just stringify the JSON
                buffer = Buffer.from(JSON.stringify(gltf));
            }
            
            const filename = path.basename(outputPath);
            
            return {
                buffer,
                filename
            };
            
        } catch (error) {
            throw new Error(`OBJ to GLTF conversion failed: ${error.message}`);
        }
    }

    /**
     * Converts FBX file to GLTF/GLB using FBX2glTF (requires external tool)
     */
    async convertFbxToGltf(inputPath, outputPath, outputFormat) {
        try {
            // Note: This requires FBX2glTF to be installed and available in PATH
            // For production, you might want to bundle this tool or use a different approach
            
            const command = `FBX2glTF -i "${inputPath}" -o "${outputPath}" --binary ${outputFormat === 'glb'}`;
            
            await execAsync(command);
            
            // Read the converted file
            const buffer = await fs.promises.readFile(outputPath);
            const filename = path.basename(outputPath);
            
            return {
                buffer,
                filename
            };
            
        } catch (error) {
            // Fallback: try using Three.js in Node.js environment if FBX2glTF is not available
            console.warn('FBX2glTF not available, attempting Three.js conversion...');
            return await this.convertFbxWithThree(inputPath, outputPath, outputFormat);
        }
    }

    /**
     * Fallback FBX conversion using Three.js
     */
    async convertFbxWithThree(inputPath, outputPath, outputFormat) {
        // This is a placeholder for Three.js-based FBX conversion
        // In practice, you'd need to set up Three.js in Node.js environment
        throw new Error('FBX conversion requires FBX2glTF tool to be installed. Please install FBX2glTF and ensure it\'s in your PATH.');
    }

    /**
     * Creates a GLB buffer from GLTF data
     */
    async createGlbBuffer(gltf) {
        // This is a simplified GLB creation
        // In production, you'd want to use proper GLB formatting
        const gltfJson = JSON.stringify(gltf);
        const jsonBuffer = Buffer.from(gltfJson, 'utf8');
        
        // GLB header (20 bytes) + JSON chunk + binary data
        const header = Buffer.alloc(20);
        header.write('glTF', 0); // magic
        header.writeUInt32LE(2, 4); // version
        header.writeUInt32LE(20 + jsonBuffer.length, 8); // total length
        header.writeUInt32LE(jsonBuffer.length, 12); // JSON chunk length
        header.writeUInt32LE(0x4E4F534A, 16); // JSON chunk type (0x4E4F534A = "JSON")
        
        return Buffer.concat([header, jsonBuffer]);
    }

    /**
     * Cleans up temporary files
     */
    async cleanupTempFiles(filePaths) {
        for (const filePath of filePaths) {
            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                console.warn(`Failed to cleanup temp file ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Gets the appropriate output format based on file size and type
     */
    getOptimalOutputFormat(originalFilename, fileSize) {
        // Use GLB for better compression and single file distribution
        // Use GLTF for debugging or when you need separate files
        return 'glb';
    }
}

module.exports = ModelConverter;
