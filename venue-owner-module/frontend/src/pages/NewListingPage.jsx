import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function NewListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    dimensionsSqm: "",
    amenities: "",
    priceAmount: "",
    priceCurrency: "EGP",
    priceUnit: "per_day"
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const newListing = await api.createListing({
        name: form.name,
        description: form.description,
        location: form.location,
        capacity: Number(form.capacity),
        dimensionsSqm: form.dimensionsSqm ? Number(form.dimensionsSqm) : null,
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        pricing: {
          amount: Number(form.priceAmount) || 0,
          currency: form.priceCurrency,
          unit: form.priceUnit
        }
      });
      navigate(`/listings/${newListing.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <h1>New Venue Listing</h1>

      <form className="card form" onSubmit={handleSubmit}>
        {error && <div className="alert error">{error}</div>}

        <label>Venue name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} required />

        <label>Description</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />

        <label>Location</label>
        <input value={form.location} onChange={(e) => update("location", e.target.value)} required />

        <div className="form-row">
          <div>
            <label>Capacity (guests)</label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => update("capacity", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Dimensions (m²)</label>
            <input
              type="number"
              min="1"
              value={form.dimensionsSqm}
              onChange={(e) => update("dimensionsSqm", e.target.value)}
            />
          </div>
        </div>

        <label>Amenities (comma-separated)</label>
        <input
          value={form.amenities}
          onChange={(e) => update("amenities", e.target.value)}
          placeholder="WiFi, Sound system, Parking"
        />

        <div className="form-row">
          <div>
            <label>Price amount</label>
            <input
              type="number"
              min="0"
              value={form.priceAmount}
              onChange={(e) => update("priceAmount", e.target.value)}
            />
          </div>
          <div>
            <label>Currency</label>
            <input value={form.priceCurrency} onChange={(e) => update("priceCurrency", e.target.value)} />
          </div>
          <div>
            <label>Pricing unit</label>
            <select value={form.priceUnit} onChange={(e) => update("priceUnit", e.target.value)}>
              <option value="per_day">Per day</option>
              <option value="per_hour">Per hour</option>
              <option value="per_event">Per event</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
