#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DISCOVERGIT SYSTEM TEST\n');

// Test 1: Check all required files exist
console.log('1. 📁 Checking required files...');
const requiredFiles = [
    'server.js',
    'modelConverter.js',
    'public/index.html',
    'public/admin.html',
    'package.json'
];

let filesOk = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        filesOk = false;
    }
});

// Test 2: Check dependencies
console.log('\n2. 📦 Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['express', 'cors', 'multer', 'obj2gltf', 'three', 'fs-extra'];
    
    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`   ✅ ${dep} - ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`   ❌ ${dep} - MISSING`);
            filesOk = false;
        }
    });
} catch (error) {
    console.log('   ❌ Could not read package.json');
    filesOk = false;
}

// Test 3: Check syntax
console.log('\n3. 🔧 Checking JavaScript syntax...');
try {
    require('./modelConverter.js');
    console.log('   ✅ modelConverter.js - OK');
} catch (error) {
    console.log(`   ❌ modelConverter.js - ${error.message}`);
    filesOk = false;
}

try {
    require('./server.js');
    console.log('   ✅ server.js - OK');
} catch (error) {
    console.log(`   ❌ server.js - ${error.message}`);
    filesOk = false;
}

// Test 4: Check temp directory
console.log('\n4. 📂 Checking temp directory...');
const tempDir = 'temp';
if (!fs.existsSync(tempDir)) {
    console.log('   ⚠️  Creating temp directory...');
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('   ✅ temp directory created');
} else {
    console.log('   ✅ temp directory exists');
}

// Test 5: Check uploads directory
console.log('\n5. 📂 Checking uploads directory...');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    console.log('   ⚠️  Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('   ✅ uploads directory created');
} else {
    console.log('   ✅ uploads directory exists');
}

// Test 6: Check HTML files for syntax issues
console.log('\n6. 🌐 Checking HTML files...');
try {
    const indexHtml = fs.readFileSync('public/index.html', 'utf8');
    if (indexHtml.includes('modeliSupabaseYukle')) {
        console.log('   ✅ index.html - Contains upload function');
    } else {
        console.log('   ❌ index.html - Missing upload function');
        filesOk = false;
    }
} catch (error) {
    console.log(`   ❌ index.html - ${error.message}`);
    filesOk = false;
}

try {
    const adminHtml = fs.readFileSync('public/admin.html', 'utf8');
    if (adminHtml.includes('adminModeliSupabaseYukle')) {
        console.log('   ✅ admin.html - Contains admin upload function');
    } else {
        console.log('   ❌ admin.html - Missing admin upload function');
        filesOk = false;
    }
} catch (error) {
    console.log(`   ❌ admin.html - ${error.message}`);
    filesOk = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (filesOk) {
    console.log('🎉 ALL TESTS PASSED! System is ready to run.');
    console.log('\n📋 Next steps:');
    console.log('   1. Start server: node server.js');
    console.log('   2. Open browser: http://localhost:3000');
    console.log('   3. Test upload functionality');
    console.log('   4. Check database schema supports new fields:');
    console.log('      - original_format');
    console.log('      - converted_format');
    console.log('      - file_size');
} else {
    console.log('❌ SOME TESTS FAILED! Please fix the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('   - Run: npm install (if dependencies missing)');
    console.log('   - Check file paths and permissions');
    console.log('   - Verify JavaScript syntax');
}

console.log('\n' + '='.repeat(50));
