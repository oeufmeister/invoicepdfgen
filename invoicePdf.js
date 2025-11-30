// invoicePdf.js
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

function safe(v) {
  return v === undefined || v === null ? "" : String(v);
}

function generateInvoicePdf(outputPath, data) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    bufferPages: true,
    margin: data.layout.margin,
  });

  doc.pipe(fs.createWriteStream(outputPath));

  const pageW = doc.page.width;
  const pageH = doc.page.height;
  const margin = data.layout.margin;

  const leftX = data.layout.leftColumnX;
  const rightX = data.layout.rightColumnX;

  // -----------------------------
  // HEADER (2-column layout)
  // -----------------------------
  function drawHeader() {
    doc.font("Helvetica-Bold").fontSize(32);
    doc.text(data.header.title, leftX, data.layout.headerY);

    let y = data.layout.headerY + 50;
    doc.fontSize(11).font("Helvetica-Bold");
    doc.text("Att:", leftX, y, { continued: true });
    doc.font("Helvetica").text(` ${safe(data.header.attentionName)}`);
    y += 15;
    doc.text(safe(data.header.attentionEmail), leftX, y);
    y += 25;

    doc.font("Helvetica-Bold");
    doc.text("Date:", leftX, y, { continued: true });
    doc.font("Helvetica").text(" " + safe(data.header.date));
    y += 15;

    doc.font("Helvetica-Bold");
    doc.text("Invoice Number:", leftX, y, { continued: true });
    doc.font("Helvetica").text(" " + safe(data.header.invoiceNumber));
    y += 15;

    doc.font("Helvetica-Bold");
    doc.text("Client Order No.:", leftX, y, { continued: true });
    doc.font("Helvetica").text(" " + safe(data.header.clientOrderNumber));

    // --- Right Column ---
    let ry = data.layout.headerY + 20;
    doc.font("Helvetica");
    (data.header.companyInfoLines || []).forEach((line) => {
      doc.text(line, rightX, ry, { align: "right", width: 300 });
      ry += 15;
    });

    // Logo
    if (data.logoPath && fs.existsSync(data.logoPath)) {
      try {
        doc.image(data.logoPath, pageW - margin - 120, data.layout.headerY, {
          width: 110,
        });
      } catch {}
    }
  }

  // -----------------------------
  // PROJECT BLOCK
  // -----------------------------
  function drawProject() {
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text(safe(data.project.referenceNumber), leftX, data.layout.projectY);

    let y = data.layout.projectY + 25;
    doc.font("Helvetica").fontSize(10);

    (data.project.descriptionLines || []).forEach((line) => {
      doc.text(line, leftX, y, { width: pageW - margin * 2 });
      y += 13;
    });
  }

  // -----------------------------
  // TABLE (header + rows)
  // -----------------------------
  function drawTableHeader(y) {
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Description", leftX, y);
    doc.text("Quantity", leftX + 420, y);
    doc.text("Rate", leftX + 520, y);
    doc.text("Amount", leftX + 620, y);
  }

  function drawRow(item, y) {
    const rowH = data.layout.rowHeight;

    doc.rect(leftX, y, 700, rowH).stroke();

    doc.font("Helvetica").fontSize(10);
    doc.text(safe(item.description), leftX + 8, y + 12, { width: 390 });

    doc.text(String(item.qty), leftX + 430, y + 12);
    doc.text(String(item.rate), leftX + 530, y + 12);
    doc.text(String(item.amount), leftX + 630, y + 12);

    return y + rowH;
  }

  // -----------------------------
  // TOTALS
  // -----------------------------
  function drawTotals(y) {
    doc.font("Helvetica-Bold").fontSize(11);

    const tx = leftX + 520;

    doc.text("Sub Total:", tx, y, { continued: true });
    doc.font("Helvetica").text(` $${data.totals.subtotal.toFixed(2)}`);
    y += 15;

    doc.font("Helvetica-Bold");
    doc.text("GST:", tx, y, { continued: true });
    doc.font("Helvetica").text(` $${data.totals.gst.toFixed(2)}`);
    y += 15;

    doc.font("Helvetica-Bold");
    doc.text("Total:", tx, y, { continued: true });
    doc.font("Helvetica").text(` $${data.totals.total.toFixed(2)}`);
    y += 25;

    doc.font("Helvetica-Bold");
    doc.text("Down Payment 50%:", tx, y, { continued: true });
    doc.font("Helvetica").text(` $${data.totals.downPayment.toFixed(2)}`);
    y += 15;

    doc.font("Helvetica-Bold");
    doc.text("Balance:", tx, y, { continued: true });
    doc.font("Helvetica").text(` $${data.totals.balance.toFixed(2)}`);

    return y + 40;
  }

  // -----------------------------
  // PAYMENT INFO
  // -----------------------------
  function drawPayment(y) {
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Due Date: " + safe(data.payment.dueDate), leftX, y);
    y += 20;

    doc.font("Helvetica").fontSize(10);
    (data.payment.bankLines || []).forEach((line) => {
      doc.text(line, leftX, y);
      y += 14;
    });
  }

  // -----------------------------
  // PAGE NUMBERS
  // -----------------------------
  function addPageNumbers() {
    const range = doc.bufferedPageRange();
    const total = range.count;

    for (let i = 0; i < total; i++) {
      doc.switchToPage(i);
      const txt = data.header.pageTextTemplate
        .replace("{{current}}", i + 1)
        .replace("{{total}}", total);

      doc.font("Helvetica").fontSize(10);
      doc.text(txt, pageW - margin - 60, margin - 10);
    }
  }

  // -----------------------------
  // RENDER PAGE
  // -----------------------------
  drawHeader();
  drawProject();
  drawTableHeader(data.layout.tableTopY);

  let y = data.layout.tableTopY + 25;
  for (const item of data.items) {
    y = drawRow(item, y);
  }

  y = drawTotals(y + 15);
  drawPayment(y + 10);

  addPageNumbers();

  doc.end();
}

module.exports = generateInvoicePdf;
