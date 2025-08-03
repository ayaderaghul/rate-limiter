class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity
        this.tokens = capacity
        this.refillRate = refillRate,
        this.lasRefill = Date.now()
    }

    refill() {
        const now = Date.now()
        const elapsed  = (now - this.lastRefill) / 1000
        const tokensToAdd = elapsed * this.refillRate
        this.tokens = Math.min(this.capicity, this.tokens + tokensToAdd)
        this.lastRefill = now
    }

    consume() {
        this.refill()
        if (this.tokens >= 1) {
            this.tokens -= 1
            return true
        }
        return false
    }
}

const buckets = new Map()

function tokenBucketRateLimiter(req,res,next) {
    const ip = req.ip
    if(!buckets.has(ip)) {
        buckets.set(ip, new TokenBucket(10,1)) // 10 capacity, 1 token per sec
    }

    const bucket = buckets.get(ip)
    if (bucket.consume()) {
        next()
    } else {
        res.status(429).send('too many request')
    }
}

module.exports = tokenBucketRateLimiter