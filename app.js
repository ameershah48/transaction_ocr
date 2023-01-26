const tesseract = require("node-tesseract-ocr")
const config = { lang: "eng", oem: 1, psm: 3}

const paramFile = process.argv[2];
const paramEngine = process.argv[3];

tesseract
  .recognize("screenshots/" + paramFile, config)
  .then((text) => {
    
    const engine = require("./engine/" + paramEngine)
    const transactions = engine.getTransactions(text)

    console.table(transactions)
  })
  .catch((error) => {
    console.log(error.message)
  })