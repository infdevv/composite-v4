/**
 * YUZU.JS FRAMEWORK
 * AI FOR ALL
 * Author: AXIOM NETWORK / COMPOSITE / KIWI AI
 * Repository: https://github.com/infdevv/yuzu
*/

/*
*/

import { generateUserAgent } from './helpers/useragents.js';

class yuzu {
    constructor(endpoint, reasoning_endpoint, reasoning_on) {
        this.endpoint = endpoint || "https://api.deepinfra.com/v1/openai/chat/completions"
        this.reasoning_endpoint = reasoning_endpoint || "https://charbot.ape3d.com/?prompt="
        this.reasoning_on = reasoning_on || true
        this.model = "google/gemma-2-9b-it"
        this.generateUserAgent = generateUserAgent;
        this.lastTime = null;
    }

    async generate(messages, model = this.model, settings = {}) {
        const {
            temperature = 0.7,
            top_p = 1,
            max_tokens = 26000,
            frequency_penalty = 0,
            presence_penalty = 0,
            ...extra
        } = settings;

        const requestBody = {
            messages: messages,
            model: model,
            temperature: temperature,
            top_p: top_p,
            max_tokens: max_tokens,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            ...extra
        };

        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (this.lastTime && (now - this.lastTime) < fiveMinutes) {
            console.log('[YUZU] Starting generation with fallback (rate limit cooldown)');
            const fallbackRes = await fetch("https://text.pollinations.ai/openai", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "User-Agent": this.generateUserAgent()
                },
                credentials: 'omit',
                body: JSON.stringify({ ...requestBody, model: "mistral" })
            });
            const fallbackData = await fallbackRes.json();
            return fallbackData;
        }

        try {
            console.log('[YUZU] Starting generation with main endpoint');
            const res = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "User-Agent": this.generateUserAgent()
                },
                credentials: 'omit',
                body: JSON.stringify(requestBody)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('[YUZU] Main endpoint failed with error:', error.message || error);
            this.lastTime = Date.now();

            try {
                console.log('[YUZU] Starting generation with fallback after main failure');
                const fallbackRes = await fetch("https://text.pollinations.ai/openai", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "User-Agent": this.generateUserAgent()
                    },
                    credentials: 'omit',
                    body: JSON.stringify({ ...requestBody, model: "mistral" })
                });
                const fallbackData = await fallbackRes.json();
                return fallbackData;
            } catch (fallbackError) {
                console.error('[YUZU] Fallback endpoint failed with error:', fallbackError.message || fallbackError);
                throw fallbackError;
            }
        }
    }

    async generateStreaming(messages, callback, model = this.model, settings = {}) {
        const {
            temperature = 0.7,
            top_p = 1,
            max_tokens = 26000,
            frequency_penalty = 0,
            presence_penalty = 0,
            ...extra
        } = settings;

        const requestBody = {
            messages: messages,
            model: model,
            stream: true,
            temperature: temperature,
            top_p: top_p,
            max_tokens: max_tokens,
            frequency_penalty: frequency_penalty,
            presence_penalty: presence_penalty,
            ...extra
        };

        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        let res;
        let isFallback = false;

        if (this.lastTime && (now - this.lastTime) < fiveMinutes) {
            console.log('[YUZU] Starting streaming generation with fallback (rate limit cooldown)');
            isFallback = true;
            res = await fetch("https://text.pollinations.ai/openai", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "User-Agent": this.generateUserAgent()
                },
                credentials: 'omit',
                body: JSON.stringify({ ...requestBody, model: "mistral" })
            });
        } else {
            try {
                console.log('[YUZU] Starting streaming generation with main endpoint');
                res = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "User-Agent": this.generateUserAgent()
                    },
                    credentials: 'omit',
                    body: JSON.stringify(requestBody)
                });
            } catch (error) {
                console.error('[YUZU] Main streaming endpoint failed with error:', error.message || error);
                this.lastTime = Date.now();
                isFallback = true;
                console.log('[YUZU] Starting streaming generation with fallback after main failure');
                res = await fetch("https://text.pollinations.ai/openai", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "User-Agent": this.generateUserAgent()
                    },
                    credentials: 'omit',
                    body: JSON.stringify({ ...requestBody, model: "mistral" })
                });
            }
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        callback(parsed);
                    } catch (e) {
                    }
                }
            }
        }
    }
}

export default yuzu;