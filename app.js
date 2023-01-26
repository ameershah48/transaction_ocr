const tesseract = require("node-tesseract-ocr")
const config = { lang: "eng", oem: 1, psm: 3 }

const express = require('express')
const fileUpload = require('express-fileupload');

const app = express()
const port = 3010

app.use(fileUpload());
app.use(express.json());

app.post('/', (req, res) => {

  try {
    const base64 = req.body.base64;
    const engine = req.body.engine;
    const buffer = Buffer.from(base64, 'base64');

    tesseract
      .recognize(buffer, config)
      .then((text) => {

        const ocr = require("./engine/" + engine)
        const transactions = ocr.getTransactions(text)

        res.send(transactions)
      })
      .catch((error) => {
        throw error
      })
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => {
  console.log(`Transaction OCR listening on port ${port}`)
})