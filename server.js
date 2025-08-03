//server.js
const express = require('express')
const app = express()
const PORT = 8080

app.get('/unlimited', (req, res) => {
    res.send('unlimited! lets go')
})

app.get('/limited', (req, res) => {
    res.send('limited, dont overuse')
})

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})