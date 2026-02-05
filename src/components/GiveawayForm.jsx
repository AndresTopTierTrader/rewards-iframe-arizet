import { useState } from 'react';
import { fetchJSON, withAdmin, apiRoute } from '../utils/api';

export function GiveawayForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [adminNoticeVisible, setAdminNoticeVisible] = useState(false);
  const [adminNoticeClass, setAdminNoticeClass] = useState('');
  const [adminNoticeText, setAdminNoticeText] = useState('');

  const showNotice = (text, isError = false) => {
    setAdminNoticeVisible(true);
    setAdminNoticeClass(isError ? 'notice notice--bad' : 'notice notice--good');
    setAdminNoticeText(text);
    setTimeout(() => setAdminNoticeVisible(false), 5000);
  };

  const onCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdminNoticeVisible(false);

    const formData = new FormData(e.target);
    const payload = {};
    
    for (const [key, value] of formData.entries()) {
      if (value === null || value === undefined) continue;
      const s = value.toString().trim();
      if (s === '') continue;
      
      if (key === 'prize_msrp_usd' || key === 'revenue_target_usd' || key === 'progress_curve') {
        payload[key] = Number(s);
      } else {
        payload[key] = s;
      }
    }

    try {
      const res = await fetchJSON(withAdmin(apiRoute('/admin/giveaways')), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showNotice(`Created giveaway #${res.id} (draft). Use "Set current" to publish.`, false);
      e.target.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      showNotice(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={onCreateSubmit}>
      <div className="form__row">
        <label className="field">
          <span className="field__label">Start date/time (UTC ISO)</span>
          <input 
            name="start_at" 
            className="input" 
            placeholder="2026-02-04T00:00:00Z" 
          />
          <span className="field__hint">
            Leave blank to start now. No end date (unlocks when target entries reached).
          </span>
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Title</span>
          <input 
            name="title" 
            className="input" 
            placeholder="Community Rewards" 
          />
        </label>
        <label className="field">
          <span className="field__label">Prize name</span>
          <input 
            name="prize_name" 
            className="input" 
            placeholder="Rolex Datejust" 
          />
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Prize image URL</span>
          <input 
            name="prize_image" 
            className="input" 
            placeholder="/static/rolex-datejust.png or https://..." 
          />
        </label>
        <label className="field">
          <span className="field__label">MSRP (optional)</span>
          <input 
            name="prize_msrp_usd" 
            className="input" 
            type="number" 
            step="0.01" 
            placeholder="20000" 
          />
        </label>
      </div>

      <label className="field">
        <span className="field__label">Description</span>
        <textarea 
          name="description" 
          className="input input--textarea" 
          rows={3} 
          placeholder="Short description shown to users"
        />
      </label>

      <div className="form__row">
        <label className="field">
          <span className="field__label">Revenue goal (internal)</span>
          <input 
            name="revenue_target_usd" 
            className="input" 
            type="number" 
            step="0.01" 
            placeholder="400000" 
          />
          <span className="field__hint">
            Used to compute a hidden target entry count (based on 100K calibration). Not shown to users.
          </span>
        </label>
        <label className="field">
          <span className="field__label">Progress curve</span>
          <input 
            name="progress_curve" 
            className="input" 
            type="number" 
            step="0.01" 
            placeholder="1.15" 
          />
          <span className="field__hint">
            &gt; 1.0 reduces back-calculation. UI never shows the numeric %.
          </span>
        </label>
      </div>

      <label className="field">
        <span className="field__label">Unlocked message</span>
        <textarea 
          name="unlocked_message" 
          className="input input--textarea" 
          rows={2} 
          placeholder="Unlocked! We'll announce the winner on social media and reach out by email."
        />
      </label>

      <div className="form__actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create (draft)'}
        </button>
        <div className="muted">After creation, use "Set current" to publish.</div>
      </div>

      {adminNoticeVisible && (
        <div className={adminNoticeClass}>{adminNoticeText}</div>
      )}
    </form>
  );
}
