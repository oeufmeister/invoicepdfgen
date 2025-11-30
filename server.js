const express = require("express");
const generateInvoicePdf = require("./invoicePdf");
const data = require("./invoiceData");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/invoice", (req, res) => {
  const filePath = path.join(__dirname, "invoice-output.pdf");

  generateInvoicePdf(filePath, data);

  setTimeout(() => {
    res.download(filePath);
  }, 300);
});

app.listen(3000, () => console.log("http://localhost:3000/invoice"));
