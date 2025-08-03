//server.js
const express = require('express')
const tokenBucketRateLimiter = require('./tokenBucket')
const fixedWindowRateLimiter = require('./fixedWindow');

const app = express()
const PORT = 8080

app.get('/unlimited', (req, res) => {
    res.send('unlimited! lets go')
})

app.get('/limited', tokenBucketRateLimiter, (req, res) => {
    res.send('limited, dont overuse')
})
app.get('/fixed-window', fixedWindowRateLimiter, (req, res) => {
  res.send("Fixed Window Limited");
});


app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})