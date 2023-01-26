const tesseract = require("node-tesseract-ocr")
const config = { lang: "eng", oem: 1, psm: 3 }

const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('OCR Transaction.')
})

app.post('/api/getTransactions', (req, res) => {

  try {
    const base64 = req.body.base64;
    const engine = req.body.engine;

    const base64Data = base64.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    tesseract
      .recognize(buffer, config)
      .then((text) => {

        const ocr = require("./engine/" + engine)
        const transactions = ocr.getTransactions(text)

        res.send(transactions)
      })
      .catch((error) => {
        console.log(error.message)
      })
  } catch (error) {
    console.log(error.message)
  }
})

app.listen(port, () => {
  console.log(`Transaction OCR listening on port ${port}`)
})