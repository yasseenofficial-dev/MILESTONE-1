const { fakeInvoices } = require("../Database/fakeData");

exports.getClientInvoices = (req, res) => {
  res.json({
    success: true,
    invoices: fakeInvoices
  });
};
