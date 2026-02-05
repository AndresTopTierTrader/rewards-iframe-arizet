import { useState, Fragment } from 'react';
import { useAdminGiveaways, useGiveawayStats } from '../hooks/useAdmin';
import { GiveawayForm } from '../components/GiveawayForm';
import { fetchJSON, withAdmin, post, apiRoute } from '../utils/api';
import { fmtNum, pct, fmtTs, safeText, tagClass } from '../utils/formatters';
import { 
  HiArrowPath, 
  HiArrowPathRoundedSquare, 
  HiPlus, 
  HiTrophy, 
  HiEye, 
  HiCheckCircle, 
  HiPause, 
  HiPlay, 
  HiLockOpen, 
  HiSparkles, 
  HiFolder,
  HiTrash,
  HiChartBar,
  HiUsers,
  HiShoppingBag,
  HiTicket,
  HiExclamationTriangle,
  HiInformationCircle,
  HiHashtag,
  HiTag,
  HiClock,
  HiCurrencyDollar
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/app.css';

export function Admin() {
  const { giveaways, loading: giveawaysLoading, error, usingMockData: usingMockGiveaways, refetch } = useAdminGiveaways();
  const [selectedId, setSelectedId] = useState(null);
  const [adminNoticeVisible, setAdminNoticeVisible] = useState(false);
  const [adminNoticeClass, setAdminNoticeClass] = useState('');
  const [adminNoticeText, setAdminNoticeText] = useState('');
  const { stats: detailPayload, usingMockData: usingMockStats, refetch: refetchStats } = useGiveawayStats(selectedId);

  const showNotice = (text, isError = false) => {
    setAdminNoticeVisible(true);
    setAdminNoticeClass(isError ? 'notice notice--bad' : 'notice notice--good');
    setAdminNoticeText(text);
    setTimeout(() => setAdminNoticeVisible(false), 5000);
  };

  const handleAction = async (action, giveawayId, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    
    try {
      await post(apiRoute(`/admin/giveaways/${giveawayId}/${action}`));
      showNotice(`Success: ${action}`, false);
      await refetch();
      if (selectedId === giveawayId) {
        await refetchStats();
      }
    } catch (err) {
      showNotice(err.message, true);
    }
  };

  const handleSync = async () => {
    try {
      await fetchJSON(withAdmin(apiRoute('/admin/sync')), { method: 'POST' });
      showNotice('Sync triggered', false);
    } catch (err) {
      showNotice(err.message, true);
    }
  };

  const onRefresh = async () => {
    await refetch();
    if (selectedId) {
      await refetchStats();
    }
  };

  const onSelectGiveaway = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const onView = (id) => {
    setSelectedId(id);
  };

  const safe = safeText;
  const detailTotalEntries = Number(detailPayload?.totals?.total_entries || 0);
  const detailTargetEntries = Number(detailPayload?.progress?.target_entries || 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="page page--wide">
      <motion.header 
        className="topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="topbar__left">
          <motion.img 
            src="/logo.svg" 
            alt="TX3 Funding" 
            className="topbar__logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <div>
            <div className="topbar__title">Community Rewards — Admin</div>
            <div className="topbar__sub">Create rewards, set current, force unlock, draw winners</div>
          </div>
        </div>
        <div className="topbar__right">
          <motion.button 
            type="button" 
            className="btn btn--ghost" 
            onClick={onRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiArrowPath style={{ fontSize: '16px' }} />
            <span className="btn-text-mobile-hidden">Refresh</span>
          </motion.button>
          <motion.button 
            type="button" 
            className="btn" 
            onClick={handleSync}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiArrowPathRoundedSquare style={{ fontSize: '16px' }} />
            <span className="btn-text-mobile-hidden">Sync orders</span>
          </motion.button>
        </div>
      </motion.header>

      <motion.main 
        className="adminLayout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {(usingMockGiveaways || usingMockStats) && (
            <motion.div 
              className="notice notice--bad" 
              style={{ gridColumn: '1 / -1' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HiExclamationTriangle style={{ fontSize: '18px' }} />
              API connection failed. Showing mock data for demonstration. Check that your backend is running on localhost:8000
            </motion.div>
          )}
          {adminNoticeVisible && (
            <motion.div 
              className={adminNoticeClass} 
              style={{ gridColumn: '1 / -1' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {adminNoticeClass.includes('good') ? (
                <HiCheckCircle style={{ fontSize: '18px' }} />
              ) : (
                <HiExclamationTriangle style={{ fontSize: '18px' }} />
              )}
              {adminNoticeText}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section 
          className="card" 
          style={{ gridColumn: '1 / -1' }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="card__title">
            <HiPlus style={{ fontSize: '20px' }} />
            Create a new reward
          </div>
          <GiveawayForm onSuccess={refetch} />
        </motion.section>

        <motion.section 
          className="card" 
          style={{ gridColumn: '1 / -1' }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="card__title">
            <HiTrophy style={{ fontSize: '20px' }} />
            Giveaways
          </div>
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Current</th>
                  <th>Prize</th>
                  <th>Start</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {giveawaysLoading ? (
                  <tr>
                    <td colSpan={6} className="muted">Loading…</td>
                  </tr>
                ) : giveaways.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="muted">No giveaways found.</td>
                  </tr>
                ) : (
                  giveaways.map((r, index) => (
                    <Fragment key={r.id}>
                      <motion.tr 
                        onClick={() => onSelectGiveaway(r.id)} 
                        style={{ cursor: 'pointer' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      >
                        <td>
                          <HiHashtag style={{ fontSize: '12px', marginRight: '4px', verticalAlign: 'middle', opacity: 0.6 }} />
                          {r.id}
                        </td>
                        <td><span className={tagClass(r.status)}>{safe(r.status)}</span></td>
                        <td>{Number(r.is_current) === 1 ? <HiCheckCircle style={{ fontSize: '16px', color: 'var(--futuresGreen)' }} /> : '—'}</td>
                        <td>
                          <div><HiTrophy style={{ fontSize: '14px', marginRight: '6px', verticalAlign: 'middle' }} />{safe(r.prize_name || 'Prize')}</div>
                          <div className="small muted">
                            <HiCurrencyDollar style={{ fontSize: '11px', marginRight: '4px', verticalAlign: 'middle' }} />
                            Goal: {r.revenue_target_usd 
                              ? '$' + Number(r.revenue_target_usd).toLocaleString() 
                              : '—'} • 
                            <HiTicket style={{ fontSize: '11px', marginRight: '4px', marginLeft: '8px', verticalAlign: 'middle' }} />
                            Target entries: {r.target_entries 
                              ? Number(r.target_entries).toFixed(0) 
                              : '—'}
                          </div>
                        </td>
                        <td>
                          <HiClock style={{ fontSize: '12px', marginRight: '4px', verticalAlign: 'middle', opacity: 0.6 }} />
                          {fmtTs(r.start_at)}
                        </td>
                        <td className="right">
                          <div className="btnRow">
                            <motion.button 
                              type="button" 
                              className="btn btn--ghost btn--sm" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                onView(r.id); 
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HiEye style={{ fontSize: '14px' }} />
                              <span className="btn-text-mobile-hidden">View</span>
                            </motion.button>
                            <motion.button 
                              type="button"
                              className="btn btn--sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('set_current', r.id, 'Set this giveaway as current?');
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HiCheckCircle style={{ fontSize: '14px' }} />
                              <span className="btn-text-mobile-hidden">Set current</span>
                            </motion.button>
                            {r.status === 'active' && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('pause', r.id);
                                }}
                              >
                                <HiPause style={{ fontSize: '14px' }} />
                                Pause
                              </button>
                            )}
                            {r.status === 'paused' && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('resume', r.id);
                                }}
                              >
                                <HiPlay style={{ fontSize: '14px' }} />
                                Resume
                              </button>
                            )}
                            {r.status !== 'unlocked' && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('force_unlock', r.id, 'Force unlock this giveaway?');
                                }}
                              >
                                <HiLockOpen style={{ fontSize: '14px' }} />
                                Force unlock
                              </button>
                            )}
                            {r.status === 'unlocked' && !r.winner_email && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('draw', r.id, 'Draw winner for this giveaway?');
                                }}
                              >
                                <HiSparkles style={{ fontSize: '14px' }} />
                                Draw winner
                              </button>
                            )}
                            {r.status !== 'archived' && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('archive', r.id, 'Archive this giveaway?');
                                }}
                              >
                                <HiFolder style={{ fontSize: '14px' }} />
                                Archive
                              </button>
                            )}
                            {r.status === 'archived' && (
                              <button 
                                type="button"
                                className="btn btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('unarchive', r.id);
                                }}
                              >
                                <HiFolder style={{ fontSize: '14px' }} />
                                Unarchive
                              </button>
                            )}
                            <button 
                              type="button"
                              className="btn btn--sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction('delete', r.id, 'Delete this giveaway? This cannot be undone.');
                              }}
                            >
                              <HiTrash style={{ fontSize: '14px' }} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      {r.winner_display && (
                        <motion.tr 
                          className="rowSub"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <td colSpan={6} className="small muted">
                            Winner: <span className="mono">{safe(r.winner_display)}</span> • Drawn: {fmtTs(r.winner_drawn_at)}
                          </td>
                        </motion.tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {selectedId && (
            <motion.section 
              className="card" 
              id="detailCard" 
              style={{ gridColumn: '1 / -1' }}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key={selectedId}
            >
              <div className="card__title">
                <HiChartBar style={{ fontSize: '20px' }} />
                Giveaway insights
              </div>
              {!detailPayload ? (
                <motion.div 
                  className="muted" 
                  id="detailHint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <HiInformationCircle style={{ fontSize: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
                  Select a giveaway (click "View") to see live stats, progress, and entrant probabilities.
                </motion.div>
              ) : (
            <div id="detailBody">
              <div className="adminDetailHeader">
                <div>
                  <div className="adminDetailTitle">
                    #{detailPayload.giveaway.id} — {safe(detailPayload.giveaway.prize_name || detailPayload.giveaway.title || 'Giveaway')}
                  </div>
                  <div className="small muted">
                    Status: {safe(detailPayload.giveaway.status)} • 
                    Current: {Number(detailPayload.giveaway.is_current) === 1 ? 'Yes' : 'No'} • 
                    Start: {fmtTs(detailPayload.giveaway.start_at)}
                  </div>
                </div>
                <div className="btnRow">
                  <button 
                    type="button"
                    className="btn btn--sm"
                    onClick={() => handleAction('set_current', detailPayload.giveaway.id, 'Set this giveaway as current?')}
                  >
                    <HiCheckCircle style={{ fontSize: '14px' }} />
                    Set current
                  </button>
                  {detailPayload.giveaway.status === 'active' && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('pause', detailPayload.giveaway.id)}
                    >
                      <HiPause style={{ fontSize: '14px' }} />
                      Pause
                    </button>
                  )}
                  {detailPayload.giveaway.status === 'paused' && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('resume', detailPayload.giveaway.id)}
                    >
                      <HiPlay style={{ fontSize: '14px' }} />
                      Resume
                    </button>
                  )}
                  {detailPayload.giveaway.status !== 'unlocked' && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('force_unlock', detailPayload.giveaway.id, 'Force unlock this giveaway?')}
                    >
                      <HiLockOpen style={{ fontSize: '14px' }} />
                      Force unlock
                    </button>
                  )}
                  {detailPayload.giveaway.status === 'unlocked' && !detailPayload.giveaway.winner_email && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('draw', detailPayload.giveaway.id, 'Draw winner for this giveaway?')}
                    >
                      <HiSparkles style={{ fontSize: '14px' }} />
                      Draw winner
                    </button>
                  )}
                  {detailPayload.giveaway.status !== 'archived' && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('archive', detailPayload.giveaway.id, 'Archive this giveaway?')}
                    >
                      <HiFolder style={{ fontSize: '14px' }} />
                      Archive
                    </button>
                  )}
                  {detailPayload.giveaway.status === 'archived' && (
                    <button 
                      type="button"
                      className="btn btn--sm"
                      onClick={() => handleAction('unarchive', detailPayload.giveaway.id)}
                    >
                      <HiFolder style={{ fontSize: '14px' }} />
                      Unarchive
                    </button>
                  )}
                  <button 
                    type="button"
                    className="btn btn--sm"
                    onClick={() => handleAction('delete', detailPayload.giveaway.id, 'Delete this giveaway? This cannot be undone.')}
                  >
                    <HiTrash style={{ fontSize: '14px' }} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="progressBox">
                <div className="bar">
                  <div 
                    className="bar__fill" 
                    style={{ 
                      width: `${Math.max(0, Math.min(100, Number(detailPayload.progress?.true_pct || 0)))}%` 
                    }} 
                  />
                </div>
                <div className="small muted">
                  {detailTargetEntries > 0
                    ? `${pct(detailPayload.progress?.true_pct, 1)} • ${fmtNum(detailTotalEntries, 0)} / ${fmtNum(detailTargetEntries, 0)} entries`
                    : `${fmtNum(detailTotalEntries, 0)} entries • (no target configured)`}
                </div>
              </div>

              <div className="adminStatsGrid">
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiTicket style={{ fontSize: '14px', marginRight: '4px' }} />
                    Total entries
                  </div>
                  <div className="stat__value">{fmtNum(detailTotalEntries, 0)}</div>
                </motion.div>
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiChartBar style={{ fontSize: '14px', marginRight: '4px' }} />
                    Target entries
                  </div>
                  <div className="stat__value">
                    {detailTargetEntries > 0 ? fmtNum(detailTargetEntries, 0) : '—'}
                  </div>
                </motion.div>
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiUsers style={{ fontSize: '14px', marginRight: '4px' }} />
                    Unique users
                  </div>
                  <div className="stat__value">{fmtNum(detailPayload.totals?.user_count, 0)}</div>
                </motion.div>
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiShoppingBag style={{ fontSize: '14px', marginRight: '4px' }} />
                    Eligible orders
                  </div>
                  <div className="stat__value">{fmtNum(detailPayload.totals?.orders_count, 0)}</div>
                </motion.div>
              </div>

              {detailPayload.giveaway.winner_email && (
                <div className="adminWinnerBox">
                  <div><strong>Winner drawn</strong></div>
                  <div className="small muted">
                    Email: <span className="mono">{safe(detailPayload.giveaway.winner_email)}</span>
                  </div>
                  <div className="small muted">
                    Display: <span className="mono">{safe(detailPayload.giveaway.winner_display)}</span>
                  </div>
                  <div className="small muted">
                    Drawn: {fmtTs(detailPayload.giveaway.winner_drawn_at)}
                  </div>
                </div>
              )}

              <div className="card__title" style={{ marginTop: 16 }}>
                Entrants (top)
              </div>
              <div className="small muted">
                Showing top entrants by entries. Probability = entries / total entries.
              </div>
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th className="right">Entries</th>
                      <th className="right">Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!detailPayload.participants || detailPayload.participants.length === 0) ? (
                      <tr>
                        <td colSpan={4} className="muted">No eligible entrants yet.</td>
                      </tr>
                    ) : (
                      detailPayload.participants.map((p, idx) => {
                        const prob = Number(p.probability || 0) * 100;
                        return (
                          <tr key={p.email ?? idx}>
                            <td>{idx + 1}</td>
                            <td><span className="mono">{safe(p.email)}</span></td>
                            <td className="right">{fmtNum(p.entries, 0)}</td>
                            <td className="right">
                              {prob < 0.01 ? '<0.01%' : pct(prob, 2)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
