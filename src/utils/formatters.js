export function fmtMoney(maybeNumber) {
  if (maybeNumber == null || maybeNumber === '') return '—';
  const n = Number(maybeNumber);
  if (!Number.isFinite(n)) return '—';
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function niceStatus(status) {
  const s = (status ?? '').toLowerCase();
  if (s === 'scheduled') return 'Scheduled';
  if (s === 'active') return 'Active';
  if (s === 'unlocked') return 'Unlocked';
  if (s === 'paused') return 'Paused';
  if (s === 'draft') return 'Draft';
  if (s === 'archived') return 'Archived';
  return status || '—';
}

export function statusClass(status) {
  const s = (status ?? '').toLowerCase();
  if (s === 'unlocked') return 'pill pill--good';
  if (s === 'active') return 'pill pill--good';
  if (s === 'scheduled') return 'pill pill--muted';
  if (s === 'paused') return 'pill pill--warn';
  return 'pill pill--muted';
}

export function tagClass(status) {
  const s = (status ?? '').toLowerCase();
  // Success states - green
  if (s === 'completed' || s === 'success' || s === 'active' || s === 'unlocked') {
    return 'tag tag--success';
  }
  // Error states - red
  if (s === 'error' || s === 'failed' || s === 'cancelled' || s === 'rejected') {
    return 'tag tag--error';
  }
  // Pending/Processing states - yellow
  if (s === 'pending' || s === 'processing' || s === 'scheduled' || s === 'in_progress') {
    return 'tag tag--pending';
  }
  // Default - muted
  return 'tag';
}

export function safeText(t) {
  return (t ?? '').toString();
}

export function safe(t) {
  return (t ?? '').toString();
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export function fmtNum(n, digits = 0) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return x.toLocaleString(undefined, { 
    maximumFractionDigits: digits, 
    minimumFractionDigits: digits 
  });
}

export function pct(x, digits = 1) {
  const v = Number(x);
  if (!Number.isFinite(v)) return '—';
  return (v).toFixed(digits) + '%';
}

export function fmtTs(iso) {
  return formatDate(iso);
}
