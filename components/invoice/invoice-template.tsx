import React from "react";
import {
  formatCryptoAmount,
  formatUSDAmount,
  formatInvoiceDate,
  type InvoiceData,
} from "@/lib/invoice";
import "./styles.css";

export const InvoicePDFTemplate: React.FC<{ invoice: InvoiceData }> = ({
  invoice,
}) => {
  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="company-info">
          <h1 className="company-name">{invoice.company.name}</h1>
          <div className="company-wallet">{invoice.company.walletAddress}</div>
          <div className="company-address">
            <div>{invoice.company.address.street}</div>
            <div>
              {invoice.company.address.city}, {invoice.company.address.state}{" "}
              {invoice.company.address.zipCode}
            </div>
            <div>Tax ID: {invoice.company.taxId}</div>
            {invoice.company.email && <div>{invoice.company.email}</div>}
          </div>
        </div>

        <div className="invoice-title-section">
          <h2 className="invoice-title">INVOICE</h2>
          <div className="invoice-number">
            #{invoice.metadata.invoiceNumber}
          </div>
        </div>
      </div>

      <div className="invoice-meta">
        <div className="invoice-details">
          <div>
            <span className="label">Issue Date:</span>{" "}
            {formatInvoiceDate(invoice.metadata.issueDate)}
          </div>
          <div>
            <span className="label">Chain:</span> {invoice.payment.chain}
          </div>
          <div>
            <span className="label">Currency:</span> {invoice.payment.currency}
          </div>
          {invoice.payment.transactionHash && (
            <div className="transaction-hash">
              <span className="label">TX:</span>{" "}
              {invoice.payment.transactionHash}
            </div>
          )}
        </div>

        <div className="bill-to-section">
          <h3 className="bill-to-header">BILL TO</h3>
          <div className="customer-name">
            {[invoice.buyer.firstName, invoice.buyer.lastName]
              .filter(Boolean)
              .join(" ") || "Customer"}
          </div>
          <div className="customer-wallet">{invoice.buyer.walletAddress}</div>
          <div className="customer-email">{invoice.buyer.email}</div>
          <div className="customer-address">
            <div>{invoice.buyer.streetAddress}</div>
            <div>
              {invoice.buyer.city}, {invoice.buyer.state}{" "}
              {invoice.buyer.postalCode}
            </div>
          </div>
        </div>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="center col-qty">Qty</th>
            <th className="right col-price">Unit Price</th>
            <th className="center col-discount">Disc%</th>
            <th className="center col-tax">Tax%</th>
            <th className="right col-amount">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "row-even" : "row-odd"}
            >
              <td>{item.description}</td>
              <td className="center">{item.quantity}</td>
              <td className="right price-amount">
                {formatCryptoAmount(
                  item.unitPrice,
                  item.currency || invoice.payment.currency,
                )}
              </td>
              <td className="center">{item.discount || 0}%</td>
              <td className="center">{item.tax || 0}%</td>
              <td className="right price-amount bold">
                {formatCryptoAmount(
                  item.total,
                  item.currency || invoice.payment.currency,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals-section">
        <div className="totals-box">
          {invoice.totals.totalDiscount > 0 && (
            <div className="total-line discount">
              <span>Discount:</span>
              <span className="total-amount">
                -
                {formatCryptoAmount(
                  invoice.totals.totalDiscount,
                  invoice.payment.currency,
                )}
              </span>
            </div>
          )}

          {invoice.totals.totalTax > 0 && (
            <div className="total-line">
              <span>Tax:</span>
              <span className="total-amount">
                {formatCryptoAmount(
                  invoice.totals.totalTax,
                  invoice.payment.currency,
                )}
              </span>
            </div>
          )}

          <div className="total-line final">
            <span>TOTAL:</span>
            <span className="total-amount large">
              {formatCryptoAmount(
                invoice.totals.total,
                invoice.payment.currency,
              )}
            </span>
          </div>

          <div className="total-line usd">
            <span>USD Equivalent:</span>
            <span>{formatUSDAmount(invoice.totals.totalUSD)}</span>
          </div>
        </div>
      </div>

      {invoice.metadata.notes && (
        <div className="notes-section">
          <h4 className="notes-header">Notes:</h4>
          <div className="notes-content">{invoice.metadata.notes}</div>
        </div>
      )}
    </div>
  );
};
