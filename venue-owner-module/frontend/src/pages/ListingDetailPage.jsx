import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [floorPlanUrl, setFloorPlanUrl] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDateStatus, setNewDateStatus] = useState("available");

  function load() {
    api
      .getListing(id)
      .then(setListing)
      .catch((err) => setError(err.message));
  }

  useEffect(load, [id]);

  function update(field, value) {
    setListing((l) => ({ ...l, [field]: value }));
  }

  async function handleSaveDetails(e) {
    e.preventDefault();
    try {
      const updated = await api.updateListing(id, {
        name: listing.name,
        description: listing.description,
        location: listing.location,
        capacity: Number(listing.capacity),
        dimensionsSqm: listing.dimensionsSqm ? Number(listing.dimensionsSqm) : null,
        amenities: listing.amenities,
        pricing: listing.pricing
      });
      setListing(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddPhoto(e) {
    e.preventDefault();
    if (!photoUrl) return;
    const updated = await api.addPhotos(id, [photoUrl]);
    setListing(updated);
    setPhotoUrl("");
  }

  async function handleAddFloorPlan(e) {
    e.preventDefault();
    if (!floorPlanUrl) return;
    const updated = await api.addFloorPlans(id, [floorPlanUrl]);
    setListing(updated);
    setFloorPlanUrl("");
  }

  async function handleAddAvailability(e) {
    e.preventDefault();
    if (!newDate) return;
    const updated = await api.setAvailability(id, [{ date: newDate, status: newDateStatus }]);
    setListing(updated);
    setNewDate("");
  }

  if (error) return <div className="alert error">{error}</div>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate("/listings")}>
        &larr; Back to listings
      </button>
      <div className="page-header">
        <h1>{listing.name}</h1>
        <StatusBadge status={listing.status} />
      </div>

      <form className="card form" onSubmit={handleSaveDetails}>
        <h3>Listing details</h3>
        <label>Name</label>
        <input value={listing.name} onChange={(e) => update("name", e.target.value)} />

        <label>Description</label>
        <textarea rows={3} value={listing.description} onChange={(e) => update("description", e.target.value)} />

        <label>Location</label>
        <input value={listing.location} onChange={(e) => update("location", e.target.value)} />

        <div className="form-row">
          <div>
            <label>Capacity</label>
            <input type="number" value={listing.capacity} onChange={(e) => update("capacity", e.target.value)} />
          </div>
          <div>
            <label>Dimensions (m²)</label>
            <input
              type="number"
              value={listing.dimensionsSqm || ""}
              onChange={(e) => update("dimensionsSqm", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Price amount</label>
            <input
              type="number"
              value={listing.pricing?.amount || 0}
              onChange={(e) => update("pricing", { ...listing.pricing, amount: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Currency</label>
            <input
              value={listing.pricing?.currency || ""}
              onChange={(e) => update("pricing", { ...listing.pricing, currency: e.target.value })}
            />
          </div>
        </div>

        <button type="submit">Save details</button>
      </form>

      <div className="card">
        <h3>Photos</h3>
        <ul className="url-list">
          {listing.photos.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
          {listing.photos.length === 0 && <p className="muted">No photos uploaded yet.</p>}
        </ul>
        <form className="inline-form" onSubmit={handleAddPhoto}>
          <input
            placeholder="Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <button type="submit">Add photo</button>
        </form>
      </div>

      <div className="card">
        <h3>Floor plans</h3>
        <ul className="url-list">
          {listing.floorPlans.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
          {listing.floorPlans.length === 0 && <p className="muted">No floor plans uploaded yet.</p>}
        </ul>
        <form className="inline-form" onSubmit={handleAddFloorPlan}>
          <input
            placeholder="Floor plan URL"
            value={floorPlanUrl}
            onChange={(e) => setFloorPlanUrl(e.target.value)}
          />
          <button type="submit">Add floor plan</button>
        </form>
      </div>

      <div className="card">
        <h3>Availability calendar</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {listing.availability.map((a) => (
              <tr key={a.date}>
                <td>{a.date}</td>
                <td>
                  <StatusBadge status={a.status === "available" ? "active" : "deactivated"} /> {a.status}
                </td>
              </tr>
            ))}
            {listing.availability.length === 0 && (
              <tr>
                <td colSpan={2} className="muted">
                  No availability set yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <form className="inline-form" onSubmit={handleAddAvailability}>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          <select value={newDateStatus} onChange={(e) => setNewDateStatus(e.target.value)}>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <button type="submit">Set date</button>
        </form>
      </div>
    </div>
  );
}
