import React from "react";

const COLORS = {
  Pending: "badge-pending",
  Approved: "badge-approved",
  Confirmed: "badge-approved",
  Declined: "badge-declined",
  active: "badge-approved",
  deactivated: "badge-pending"
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${COLORS[status] || "badge-pending"}`}>{status}</span>;
}
