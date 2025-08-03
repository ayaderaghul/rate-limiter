// fixedWindow.js

class FixedWindowCounter {
    constructor(windowSize, maxRequests) {
        this.windowSize = windowSize * 1000
        this.maxRequests = maxRequests
        this.windows = new Map()
    }

    getCurrentWindow() {
        const now = Date.now()
        const currentWindow = Math.floor(now/this.windowSize) *this.windowSize
        return currentWindow
    }

    increment(ip) {
        const currentWindow = this.getCurrentWindow()
        if(!this.windows.has(ip)) {
            this.windows.set(ip, {})
        }

        const userWindows = this.windows.get(ip)

        if(!userWindows[currentWindow]){
            userWindows[currentWindow] = 0
        }

        userWindows[currentWindow]++

        for (const windowTime in userWindows) {
            if (parseInt(windowTime) < currentWindow - this.windowSize) {
                delete userWindows[windowTime]
            }
        }

        return userWindows[currentWindow]
    }

    isOverLimit(ip) {
        const count = this.increment(ip)
        return count > this.maxRequests
    }
}

const counter = new FixedWindowCounter(60,60) // 60 seconds 60 requests

function fixedWindowRateLimiter(req, res, next) {
    const ip = req.ip
    if (counter.isOverLimit(ip)) {
        res.status(429).send('too many requests')
    } else {
        next()
    }
}
module.exports = fixedWindowRateLimiter