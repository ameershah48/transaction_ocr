const file = process.argv[2];
const tesseract = require("node-tesseract-ocr")
const mae = require("./engine/mae")

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

tesseract
  .recognize("receipts/" + file, config)
  .then((text) => {
    // const transactions = mae.getTransactions(text)
    // console.table(transactions)
    console.log(text)
  })
  .catch((error) => {
    console.log(error.message)
  })