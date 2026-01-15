#!/usr/bin/env node

/**
 * Quick OAuth Configuration Checker
 * Run this to verify your OAuth setup
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking OAuth Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('   Create it by copying .env.example');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let hasApiUrl = false;
let hasGoogleClientId = false;
let hasMicrosoftClientId = false;
let googleClientId = '';
let apiUrl = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_API_URL=')) {
    hasApiUrl = true;
    apiUrl = line.split('=')[1];
  }
  if (line.startsWith('NEXT_PUBLIC_GOOGLE_CLIENT_ID=')) {
    hasGoogleClientId = true;
    googleClientId = line.split('=')[1];
  }
  if (line.startsWith('NEXT_PUBLIC_MICROSOFT_CLIENT_ID=')) {
    hasMicrosoftClientId = true;
  }
});

// Check API URL
if (hasApiUrl) {
  console.log('✅ API URL configured:', apiUrl);
} else {
  console.log('❌ API URL not configured');
}

// Check Google OAuth
if (hasGoogleClientId) {
  if (googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && googleClientId.trim() !== '') {
    console.log('✅ Google OAuth configured');
    console.log('   Client ID:', googleClientId.substring(0, 20) + '...');
  } else {
    console.log('⚠️  Google OAuth placeholder found');
    console.log('   Replace YOUR_GOOGLE_CLIENT_ID_HERE with your actual Client ID');
    console.log('   Get it from: https://console.cloud.google.com/');
  }
} else {
  console.log('❌ Google OAuth not configured');
  console.log('   Add: NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id');
}

// Check Microsoft OAuth
if (hasMicrosoftClientId) {
  console.log('✅ Microsoft OAuth configured');
} else {
  console.log('ℹ️  Microsoft OAuth not configured (optional)');
}

console.log('\n📋 Summary:');
console.log('─────────────────────────────────────');

if (hasApiUrl && hasGoogleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
  console.log('✅ Configuration looks good!');
  console.log('\n📝 Next steps:');
  console.log('   1. Restart your development server');
  console.log('   2. Go to http://localhost:3000/login');
  console.log('   3. Click "Continue with Google"');
  console.log('   4. You should be redirected to Google login');
} else {
  console.log('⚠️  Configuration incomplete');
  console.log('\n📝 To fix:');
  console.log('   1. Get Google Client ID from:');
  console.log('      https://console.cloud.google.com/');
  console.log('   2. Add it to Frontend/.env.local');
  console.log('   3. Restart your development server');
  console.log('\n📖 See GOOGLE_OAUTH_QUICK_SETUP.md for detailed instructions');
}

console.log('\n');
