// UI-related functions and event handlers
import { updatePromptDescription } from './utils.js';
import {
    handleEngineChange,
    saveCustomEngineConfig,
    loadCustomEngineConfig,
    initializeDefaultModels,
    loadSavedConfig,
    load,
    customEngineConfig
} from './engines.js?v={{VERSION}}';
import {
    initializeSocket,
    manualConnect,
    manualDisconnect,
    checkConnectionStatus,
    sendTestMessage
} from './socket.js?v={{VERSION}}';
import {
    registerServiceWorker,
    clearFetchLogs,
    toggleFetchDebugger,
    downloadFetchLogs
} from './service-worker.js?v={{VERSION}}';

// Setup all UI event listeners
export function setupUIEventListeners(engine, bareClient) {
    // Engine selection change
    document.getElementById("engine").addEventListener("change", handleEngineChange);

    // Prompt preset description updater
    document.getElementById("prefix-prompt").addEventListener("change", updatePromptDescription);

    // Set initial prompt description
    const initialPrompt = document.getElementById("prefix-prompt").value;
    document.getElementById("prompt-description").textContent =
        updatePromptDescription.promptDescriptions?.[initialPrompt] || "Hover over options to see descriptions";

    // Start button
    document.getElementById("start").addEventListener("click", async () => {
        // Log the current engine selection for debugging
        const currentEngine = document.getElementById("engine").value;
        console.log("Start clicked with engine:", currentEngine);

        await load(engine, bareClient);

        // Save config - this will be loaded on next page refresh
        localStorage.setItem("engine", currentEngine);
        localStorage.setItem("model", document.getElementById("model").value);
        localStorage.setItem("prefix-prompt", document.getElementById("prefix-prompt").value);
    });

    // Custom engine type selector
    const customTypeSelect = document.getElementById('custom-engine-type');
    if (customTypeSelect) {
        customTypeSelect.addEventListener('change', function() {
            const nvidiaDiv = document.getElementById('nvidia-specific');
            if (this.value === 'nvidia') {
                nvidiaDiv.style.display = 'block';
            } else {
                nvidiaDiv.style.display = 'none';
            }
        });
    }

    // Test message enter key handler
    const testInput = document.getElementById('test-message');
    if (testInput) {
        testInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendTestMessage();
            }
        });
    }
}

// Make functions globally accessible for HTML onclick handlers
export function exposeGlobalFunctions() {
    window.saveCustomEngineConfig = saveCustomEngineConfig;
    window.manualConnect = manualConnect;
    window.manualDisconnect = manualDisconnect;
    window.checkConnectionStatus = checkConnectionStatus;
    window.sendTestMessage = sendTestMessage;
    window.clearFetchLogs = clearFetchLogs;
    window.toggleFetchDebugger = toggleFetchDebugger;
    window.downloadFetchLogs = downloadFetchLogs;

    // Debug helper for custom engine config
    window.debugCustomEngine = function() {
        console.log('=== CUSTOM ENGINE DEBUG INFO ===');
        console.log('Current config object:', window.customEngineConfig);
        console.log('LocalStorage value:', localStorage.getItem('customEngineConfig'));
        try {
            const parsed = JSON.parse(localStorage.getItem('customEngineConfig'));
            console.log('Parsed localStorage:', parsed);
        } catch (e) {
            console.log('Failed to parse localStorage:', e);
        }
        console.log('Selected engine:', document.getElementById('engine')?.value);
        console.log('DOM element values:');
        console.log('  Type:', document.getElementById('custom-engine-type')?.value);
        console.log('  Endpoint:', document.getElementById('custom-endpoint')?.value);
        console.log('  Model:', document.getElementById('custom-model-name')?.value);
        console.log('  API Key length:', document.getElementById('custom-api-key')?.value?.length || 0);
        console.log('================================');
        return window.customEngineConfig;
    };
}

// Initialize all UI components
export function initializeUI(engine, bareClient) {
    // Setup event listeners
    setupUIEventListeners(engine, bareClient);

    // Load custom engine config
    loadCustomEngineConfig();

    // Initialize default models
    initializeDefaultModels();

    // Load saved config
    loadSavedConfig();

    // Register service worker
    registerServiceWorker();

    // Initialize socket connection
    initializeSocket();

    // Check on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (!window.socket || !window.socket.connected)) {
            console.log('Page became visible and not connected, reconnecting...');
            initializeSocket();
        }
    });

    // Expose global functions
    exposeGlobalFunctions();
}
