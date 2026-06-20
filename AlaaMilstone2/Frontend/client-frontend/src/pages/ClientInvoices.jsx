import React, { useEffect, useState } from "react";

function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/client/invoices")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInvoices(data.invoices);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>My Invoices</h2>

      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        invoices.map((invoice) => (
          <div key={invoice.id} className="card">
            <h3 style={{ marginBottom: "10px" }}>
              Invoice #{invoice.id}
            </h3>

            <p>
              <strong>Amount:</strong> ${invoice.amount}
            </p>

            <p>
              <strong>Date:</strong> {invoice.date}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: invoice.status === "Paid" ? "green" : "orange",
                  fontWeight: "bold"
                }}
              >
                {invoice.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientInvoices;
