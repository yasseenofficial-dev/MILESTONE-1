import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .getListings()
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleStatus(listing) {
    const newStatus = listing.status === "active" ? "deactivated" : "active";
    await api.setListingStatus(listing.id, newStatus);
    load();
  }

  async function handleDelete(listing) {
    if (!confirm(`Permanently remove "${listing.name}"?`)) return;
    await api.deleteListing(listing.id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Listings</h1>
        <Link to="/listings/new" className="btn-primary">
          + New Listing
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading && <p>Loading listings...</p>}

      {!loading && listings.length === 0 && (
        <div className="empty-state">
          <p>You haven't created any venue listings yet.</p>
          <Link to="/listings/new" className="btn-primary">
            Create your first listing
          </Link>
        </div>
      )}

      <div className="grid">
        {listings.map((l) => (
          <div className="card listing-card" key={l.id}>
            <div className="listing-card-header">
              <h3>{l.name}</h3>
              <StatusBadge status={l.status} />
            </div>
            <p className="muted">{l.location}</p>
            <p>
              Capacity: <strong>{l.capacity}</strong> &middot; {l.dimensionsSqm || "—"} m²
            </p>
            <p>
              {l.pricing?.amount} {l.pricing?.currency} / {l.pricing?.unit?.replace("per_", "")}
            </p>
            <div className="card-actions">
              <Link to={`/listings/${l.id}`}>Manage</Link>
              <button className="btn-link" onClick={() => toggleStatus(l)}>
                {l.status === "active" ? "Deactivate" : "Reactivate"}
              </button>
              <button className="btn-link danger" onClick={() => handleDelete(l)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
