/**
 * This file directly patches the SockJS-client library's 'global is not defined' error.
 * It should be imported before any other imports in the main entry file.
 */

// Set global to window if it doesn't exist (browser environment)
if (typeof window !== 'undefined' && typeof global === 'undefined') {
    window.global = window;
}

// Ensure crypto is available
if (typeof window !== 'undefined' && typeof window.global !== 'undefined') {
    if (!window.global.crypto && window.crypto) {
        window.global.crypto = window.crypto;
    }
}

// Ensure Buffer is available
if (typeof window !== 'undefined' && typeof window.global !== 'undefined') {
    if (!window.global.Buffer) {
        window.global.Buffer = {
            isBuffer: () => false
        };
    }
}

// Patch missing modules
const mockModules = {
    crypto: {
        randomBytes: (size) => {
            const bytes = new Uint8Array(size);
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(bytes);
            } else {
                // Fallback to less secure Math.random()
                for (let i = 0; i < size; i++) {
                    bytes[i] = Math.floor(Math.random() * 256);
                }
            }
            return bytes;
        }
    }
};

if (typeof window !== 'undefined') {
    Object.keys(mockModules).forEach(moduleName => {
        if (!window[moduleName]) {
            window[moduleName] = mockModules[moduleName];
        }
    });
}

console.log("SockJS patch applied"); 