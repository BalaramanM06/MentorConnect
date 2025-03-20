// Polyfills for SockJS in browser environments

// Global object polyfill
if (typeof global === 'undefined') {
    window.global = window;
}

// Process polyfill
if (typeof process === 'undefined') {
    window.process = {
        env: {
            NODE_ENV: process?.env?.NODE_ENV || 'production'
        }
    };
}

// Buffer polyfill
if (typeof Buffer === 'undefined') {
    window.Buffer = {
        isBuffer: () => false
    };
}

// Crypto polyfill specifically for sockjs-client/lib/utils/browser-crypto.js
if (typeof global.crypto === 'undefined' && typeof window.crypto !== 'undefined') {
    window.global.crypto = window.crypto;
}

// Apply globalThis for older browsers
if (typeof globalThis === 'undefined') {
    window.globalThis = window;
}

export default function setupPolyfills() {
    console.log('Browser polyfills for SockJS initialized');
} 