import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getToken } from '../../api/venueOwnerApi.js';
import VenueStatusBadge from '../../components/venue-owner/StatusBadge.jsx';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDateStatus, setNewDateStatus] = useState('available');

  const load = () => api.getListing(id).then(setListing).catch(err => setError(err.message));
  useEffect(load, [id]);

  const update = (field, value) => setListing(l => ({ ...l, [field]: value }));

  async function handleSave(e) {
    e.preventDefault();
    try { const u = await api.updateListing(id, { name: listing.name, description: listing.description, location: listing.location, capacity: Number(listing.capacity), pricing: listing.pricing }); setListing(u); }
    catch (err) { setError(err.message); }
  }

  if (error) return <div className="alert error">{error}</div>;
  if (!listing) return <p>Loading...</p>;

  return (
    <div className="page">
      <button className="btn-link" onClick={() => navigate('/venue-owner/listings')}>← Back to listings</button>
      <div className="page-header"><h1>{listing.name}</h1><VenueStatusBadge status={listing.status} /></div>
      <form className="card form" onSubmit={handleSave}>
        <h3>Details</h3>
        <label>Name</label><input value={listing.name} onChange={e => update('name', e.target.value)} />
        <label>Description</label><textarea rows={3} value={listing.description} onChange={e => update('description', e.target.value)} />
        <label>Location</label><input value={listing.location} onChange={e => update('location', e.target.value)} />
        <div className="form-row">
          <div><label>Capacity</label><input type="number" value={listing.capacity} onChange={e => update('capacity', e.target.value)} /></div>
          <div><label>Price</label><input type="number" value={listing.pricing?.amount || 0} onChange={e => update('pricing', { ...listing.pricing, amount: Number(e.target.value) })} /></div>
        </div>
        <button type="submit">Save details</button>
      </form>
      <div className="card">
        <h3>Photos</h3>
        <ul className="url-list">{listing.photos.map((p, i) => <li key={i}>{p}</li>)}</ul>
        <form className="inline-form" onSubmit={async e => { e.preventDefault(); if (!photoUrl) return; const u = await api.addPhotos(id, [photoUrl]); setListing(u); setPhotoUrl(''); }}>
          <input placeholder="Photo URL" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
          <button type="submit">Add photo</button>
        </form>
      </div>
    </div>
  );
}
