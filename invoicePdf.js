const PDFDocument = require("pdfkit");
const fs = require("fs");
const invoiceData = require("./invoiceData");

function generateInvoicePDF() {
  const doc = new PDFDocument({
    size: "A4",
    layout: "portrait",
    margins: { top: 40, left: 50, right: 50, bottom: 40 },
  });

  const stream = fs.createWriteStream("invoice-output.pdf");
  doc.pipe(stream);

  const {
    logoPath,
    header,
    project,
    items,
    totals,
    payment,
    layout,
  } = invoiceData;

  const { margin, headerY, leftColumnX, rightColumnX } = layout;

  //
  // ========== HEADER ==========
  //

  // Title
  doc.font("Helvetica-Bold").fontSize(20).text(header.title, margin, headerY);

  let y = headerY + 30;

  // LEFT COLUMN (attention + invoice meta)
  doc.font("Helvetica-Bold").fontSize(11);
  doc.text(`Att: ${header.attentionName}`, leftColumnX, y);
  y += 15;
  doc.font("Helvetica").fontSize(10);
  doc.text(header.attentionEmail, leftColumnX, y);
  y += 25;

  doc.text(project.referenceNumber, leftColumnX, y);
  y += 25;

  // RIGHT COLUMN (company info)
  let rightY = headerY + 30;
  doc.font("Helvetica").fontSize(10);
  header.companyInfoLines.forEach((line) => {
    doc.text(line, rightColumnX - 100, rightY, { 
      width: 200,
      align: "right" });
    rightY += 14;
  });

  let midColumnX = leftColumnX + 150
  let midY = headerY + 30
  // MID COLUMN meta
  doc.font("Helvetica-Bold").text("Date", midColumnX, midY, { align: "left" });
  midY += 13;
  doc.font("Helvetica").text(header.date, midColumnX, midY, { align: "left" });

  midY += 18;
  doc.font("Helvetica-Bold").text("Invoice Number", midColumnX, midY, { align: "left" });
  midY += 13;
  doc.font("Helvetica").text(header.invoiceNumber, midColumnX, midY, { align: "left" });

  midY += 18;
  doc.font("Helvetica-Bold").text("Client Order No.", midColumnX, midY, { align: "left" });
  midY += 13;
  doc.font("Helvetica").text(header.clientOrderNumber, midColumnX, midY, { align: "left" });

  //
  // ========== PROJECT DESCRIPTION ==========
  //
  y = layout.projectY;
  doc.font("Helvetica-Bold").fontSize(11).text(project.descriptionLines[0], margin, y);
  y += 18;

  doc.font("Helvetica").fontSize(10);
  project.descriptionLines.slice(1).forEach((line) => {
    doc.text(line, margin, y, { width: 500 });
    y += 14;
  });

  //
  // ========== TABLE HEADER ==========
  //
  y += 10;
  doc.moveTo(margin, y).lineTo(550, y).stroke();
  y += 8;

  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Description", margin, y);
  doc.text("Quantity", 260, y);
  doc.text("Rate", 340, y);
  doc.text("Amount", 430, y);

  y += 20;
  doc.font("Helvetica").fontSize(10);

  //
  // ========== TABLE ROWS ==========
  //
  items.forEach((item) => {
    doc.text(item.description, margin, y);
    doc.text(item.qty.toString(), 260, y);
    doc.text(`$${item.rate.toFixed(2)}`, 340, y);
    doc.text(`$${item.amount.toFixed(2)}`, 430, y);
    y += layout.rowHeight - 10;
  });

  //
  // ========== TOTALS ==========
  //
  y += 10;
  doc.font("Helvetica").fontSize(10);
  doc.text("Sub Total", 340, y);
  doc.text(`$${totals.subtotal.toFixed(2)}`, 430, y);

  y += 15;
  doc.text("GST", 340, y);
  doc.text(`$${totals.gst.toFixed(2)}`, 430, y);

  y += 18;
  doc.font("Helvetica-Bold").fontSize(11);
  doc.text("Total", 340, y);
  doc.text(`$${totals.total.toFixed(2)}`, 430, y);

  //
  // ========== NEW: DOWN PAYMENT + BALANCE ==========
  //
  y += 30;
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Down Payment", 50, y);
  doc.font("Helvetica").text(`$${totals.downPayment.toFixed(2)}`, 150, y);

  y += 20;
  doc.font("Helvetica-Bold").text("Balance", 50, y);
  doc.font("Helvetica").text(`$${totals.balance.toFixed(2)}`, 150, y);

  //
  // ========== DUE DATE ==========
  //
  y += 35;
  doc.font("Helvetica-Bold").fontSize(11).text("Due Date:", 50, y);
  doc.font("Helvetica").fontSize(10).text(payment.dueDate, 120, y);

  //
  // ========== PAYMENT FOOTER ==========
  //
  y += 40;
  doc.font("Helvetica").fontSize(10);
  payment.bankLines.forEach((line) => {
    doc.text(line, 50, y);
    y += 15;
  });

  //
  // FINISH
  //
  doc.end();
  console.log("Generated invoice-output.pdf");
}

generateInvoicePDF();
