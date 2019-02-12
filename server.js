const express = require('express')
const app = express()
const port = 3001

app.use('/static', express.static('dist/'))

app.get('/', (req, res) => {
  console.log("Serving index.html")
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/authentication', (req, res) => {
  console.log("Serving authentication.html")
  res.sendFile(`${__dirname}/authentication.html`)
})

app.listen(port, () => console.log(`BurnerWalletServer listening on port: ${port}!`))
