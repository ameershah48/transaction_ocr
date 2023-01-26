const tesseract = require("node-tesseract-ocr")
const config = { lang: "eng", oem: 1, psm: 3 }
const cors = require('cors');

const express = require('express')
const app = express()
const port = 3000

app.use(express.json({limit: '50mb'}));
app.use(express.json());

app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/api/getTransactions', (req, res) => {

  try {
    let base64 = req.body.base64;
    let engine = req.body.engine;

    base64 = base64
      .replace(/^data:image\/png;base64,/, "")
      .replace(/^data:image\/jpeg;base64,/, "")

    const buffer = Buffer.from(base64, 'base64')

    tesseract
      .recognize(buffer, config)
      .then((text) => {

        const ocr = require("./engine/" + engine)
        const transactions = ocr.getTransactions(text)

        res.send(transactions)
      })
      .catch((error) => {

        console.log('Error: ', error.message)

        res.send({
          error: error.message
        })
      })
  } catch (error) {
    console.log('Error: ', error.message)

    res.send({
      error: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Transaction OCR listening on port ${port}`)
})