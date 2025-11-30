// invoiceData.js
module.exports = {
  logoPath: "./media/logo.png",

  header: {
    title: "INVOICE",

    // left column
    attentionName: "Rohin Kickett",
    attentionEmail: "example@hotmail.com",

    // invoice meta
    date: "Friday, 24 October 2025",
    invoiceNumber: "INV-000265",
    clientOrderNumber: "CO-000099",

    pageTextTemplate: "{{current}} of {{total}}",

    // company block (right side)
    companyInfoLines: [
      "Walpix Metal Pty Ltd",
      "PO Box 232",
      "Subiaco WA 6904",
      "ABN: 98 645 637 010",
      "Phone: (+61) 402 342 173",
      "E-mail: accounts@walpix.com.au",
    ],
  },

  project: {
    referenceNumber: "No. J000265",
    descriptionLines: [
      "Perforated panels Aldi - Budget Price only",
      "Supply 38 panels misc sizes - W x H - Flat panels",
      "Average Pattern : 30 - 35 % OA",
      "Material: 3 mm aluminum 5005 mill finish perforated sheets.",
      "Treatment : Powder Coating Standard Colour - Desert Satin - WARRANTY.",
      "Customer to arrange - pick up",
      "Pattern Economical use Cluster - Full Perforated (Ø9.6–12.7–60°)",
      "max holes Ø9.6 with 3 different holes - limited center.",
      "(see attachment rendering for reference)",
      "Notes:",
      "Including tek screw as spec",
    ],
  },

  items: [
    {
      description: "Aluminum perforated sheets as above spec",
      qty: 38,
      rate: 25.0,
      amount: 950.0,
    },
  ],

  totals: {
    subtotal: 950.0,
    gst: 95.0,
    total: 1045.0,
    downPayment: 522.5,
    balance: 522.5,
  },

  payment: {
    dueDate: "Friday, 24 October 2025",
    bankLines: [
      "Please reference the invoice number when making payment.",
      "Acc Name: Walpix Metal Pty Ltd",
      "BSB: 066-158",
      "Account No: 1041 4601",
    ],
  },

  layout: {
    margin: 50,
    headerY: 40,
    leftColumnX: 50,
    rightColumnX: 450,
    projectY: 180,
    tableTopY: 330,
    rowHeight: 40,
    termsY: 500,
  },
};
