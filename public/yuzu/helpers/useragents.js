export function generateUserAgent() {
        // Simple randomized User-Agent generator covering common browsers and platforms.
        const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

        const platforms = [
            // Windows 10/11
            () => `Windows NT ${rand(10, 10)}.${rand(0, 1)}; Win64; x64`,
            // macOS
            () => `Macintosh; Intel Mac OS X 10_${rand(12, 15)}_${rand(0, 6)}`,
            // Linux
            () => `X11; Linux x86_64`,
            // Android
            () => `Linux; Android ${rand(8, 13)}; Nexus ${rand(4, 6)}`,
            // iPhone
            () => `iPhone; CPU iPhone OS ${rand(13, 17)}_${rand(0, 6)} like Mac OS X`
        ]

        const browsers = [
            // Chrome-style
            () => {
                const v = rand(100, 120)
                return `Mozilla/5.0 (${platforms[Math.floor(Math.random() * platforms.length)]()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.${rand(1000, 5000)}.${rand(0, 200)} Safari/537.36`
            },
            // Firefox
            () => {
                const v = rand(90, 120)
                return `Mozilla/5.0 (${platforms[Math.floor(Math.random() * platforms.length)]()}; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`
            },
            // Safari (mac/iPhone)
            () => {
                const safariV = `${rand(13, 17)}.${rand(0, 2)}`
                const pf = platforms[Math.floor(Math.random() * platforms.length)]()
                // prefer Mac/iPhone for Safari-like
                const pfAdjusted = pf.includes('iPhone') || pf.includes('Macintosh') ? pf : `Macintosh; Intel Mac OS X 10_${rand(12, 15)}_${rand(0, 6)}`
                return `Mozilla/5.0 (${pfAdjusted}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${safariV} Safari/605.1.15`
            },
            // Edge (Chromium)
            () => {
                const v = rand(100, 120)
                return `Mozilla/5.0 (${platforms[Math.floor(Math.random() * platforms.length)]()}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.${rand(1000, 5000)}.${rand(0, 200)} Safari/537.36 Edg/${v}.0`
            }
        ]

        return browsers[Math.floor(Math.random() * browsers.length)]()
}