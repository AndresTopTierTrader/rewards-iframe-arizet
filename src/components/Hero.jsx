import { useState } from 'react';
import { statusClass, niceStatus, fmtMoney, formatDate } from '../utils/formatters';
import { HiSparkles, HiClock, HiCheckCircle, HiGift, HiTrophy, HiExclamationTriangle } from 'react-icons/hi2';
import { RiTrophyLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { claimPrize } from '../utils/api';

export function Hero({ giveaway, progress, user, onClaimSuccess }) {
  if (!giveaway) return null;

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);

  const status = (giveaway.status || '').toLowerCase();
  const isUnlocked = status === 'unlocked' || status === 'active';
  // locked is now a boolean in the new API
  const isLocked = giveaway.locked === true || giveaway.locked === 'true';
  // Only show claim button when progress is above 100% (prize is unlocked)
  const displayPct = Math.max(0, Math.min(100, progress?.display_pct || 0));
  const isProgressComplete = (progress?.display_pct || 0) > 100;
  const canClaim = isUnlocked && !isLocked && isProgressComplete && user && user.id;
  
  // Calculate tickets needed
  const currentTickets = progress?.current_tickets || 0;
  const prizeTickets = giveaway.prize_tickets || 0;
  const ticketsNeeded = Math.max(0, prizeTickets - currentTickets);

  const prizeImageSrc = giveaway.prize_image || '/static/rolex-datejust.png';
  const statusPillClass = statusClass(giveaway.status);
  const statusPillText = niceStatus(giveaway.status);
  const prizeName = giveaway.prize_name || 'Prize';
  // Use price_usd instead of prize_msrp_usd
  const prizeMeta = giveaway.price_usd 
    ? `Estimated Dolar Value: ${fmtMoney(giveaway.price_usd)}` 
    : 'Estimated Dolar Value: —';
  const prizeDesc = giveaway.description || '';
  
  let progressHint = 'Updates periodically';
  let progressIcon = <HiClock style={{ fontSize: '16px' }} />;
  if (status === 'scheduled') {
    progressHint = `Starts: ${formatDate(giveaway.start_at)}`;
    progressIcon = <HiClock style={{ fontSize: '16px' }} />;
  } else if (status === 'unlocked' && !isLocked) {
    progressHint = 'Still available';
    progressIcon = <HiCheckCircle style={{ fontSize: '16px' }} />;
  } else if (status === 'unlocked' && isLocked) {
    progressHint = 'Already won';
    progressIcon = <HiExclamationTriangle style={{ fontSize: '16px' }} />;
  }
  
  const showUnlockMessage = isUnlocked && !isLocked;
  const unlockMessage = giveaway.unlocked_message || 'Prize is still open! You can still win this prize.';

  const handleClaimPrize = async () => {
    if (!user || !user.id || !giveaway.id) {
      console.error('Missing required data for claim:', { user, giveawayId: giveaway.id });
      return;
    }
    
    setIsClaiming(true);
    setClaimError(null);
    
    try {
      // Use giveaway.id (should be the actual ID like 'fXHVo5uRLaEPsdNnjgSq') to mark the giveaway as inactive and blocked
      console.log('Claiming prize with giveaway ID:', giveaway.id);
      await claimPrize(giveaway.id, user);
      // Refresh data to get updated locked/blocked status
      if (onClaimSuccess) {
        onClaimSuccess();
      }
    } catch (err) {
      console.error('Failed to claim prize:', err);
      setClaimError(err.message || 'Failed to claim prize. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <motion.section 
      className={`card hero ${isLocked ? 'hero--locked' : ''}`}
      id="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ position: 'relative' }}
    >
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(11, 17, 29, 0.7)',
            borderRadius: '20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              maxWidth: '500px',
            }}
          >
            <HiExclamationTriangle 
              style={{ 
                fontSize: '48px', 
                color: 'var(--gold)',
                marginBottom: '20px',
              }} 
            />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--textPrimary)',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
            }}>
              Prize Already Claimed
            </h3>
            <p style={{
              fontSize: '16px',
              color: 'var(--textSecondary)',
              lineHeight: 1.6,
            }}>
              The prize has already been claimed by another trader! We will be updating on Community Rewards shortly.
            </p>
          </motion.div>
        </motion.div>
      )}
      <motion.div 
        className="hero__media"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img 
          className={`hero__img ${isLocked ? 'hero__img--locked' : ''}`}
          src={prizeImageSrc} 
          alt="Prize"
        />
      </motion.div>
      <motion.div 
        className="hero__body"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="pillRow">
          <motion.span 
            className={statusPillClass}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <RiTrophyLine style={{ fontSize: '14px' }} />
            {statusPillText}
          </motion.span>
        </div>

        <motion.h1 
          className="hero__title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <HiGift style={{ fontSize: '32px', marginRight: '12px', verticalAlign: 'middle' }} />
          {prizeName}
        </motion.h1>
        <motion.div 
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {prizeMeta}
        </motion.div>

        <motion.p 
          className="hero__desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {prizeDesc}
        </motion.p>

        <motion.div 
          className="progressCard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="progressCard__top">
            <div className="progressCard__label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiSparkles style={{ fontSize: '16px' }} />
              Unlock meter
            </div>
            <div className="progressCard__hint" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {progressIcon}
              {progressHint}
            </div>
          </div>
          <div className="bar">
            <motion.div 
              className="bar__fill" 
              initial={{ width: 0 }}
              animate={{ width: `${displayPct}%` }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            />
          </div>
          {prizeTickets > 0 && (
            <div style={{ 
              marginTop: '12px', 
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--textSecondary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>
                {isProgressComplete ? (
                  <span style={{ color: 'var(--futuresGreen)' }}>✓ Prize unlocked!</span>
                ) : (
                  <>
                    <strong style={{ color: 'var(--textPrimary)' }}>{ticketsNeeded.toLocaleString()}</strong> tickets needed
                  </>
                )}
              </span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {currentTickets.toLocaleString()} / {prizeTickets.toLocaleString()}
              </span>
            </div>
          )}
          {showUnlockMessage && (
            <motion.div 
              className="progressCard__bottom"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              <HiCheckCircle style={{ fontSize: '18px', marginRight: '8px' }} />
              {unlockMessage}
            </motion.div>
          )}
        </motion.div>

        {canClaim && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ marginTop: '20px' }}
          >
            <motion.button
              className="btn"
              onClick={handleClaimPrize}
              disabled={isClaiming}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px',
                padding: '14px 24px',
                background: 'white',
                color: '#0B111D',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
              }}
            >
              {isClaiming ? (
                <>
                  <HiClock style={{ fontSize: '18px' }} />
                  Claiming...
                </>
              ) : (
                <>
                  <HiTrophy style={{ fontSize: '18px' }} />
                  Claim Prize
                </>
              )}
            </motion.button>
            {claimError && (
              <motion.div
                className="notice notice--bad"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '12px' }}
              >
                <HiExclamationTriangle style={{ fontSize: '18px' }} />
                {claimError}
              </motion.div>
            )}
          </motion.div>
        )}

        {isUnlocked && isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ marginTop: '20px' }}
          >
            <motion.div
              className="notice notice--warn"
              style={{
                background: 'rgba(113, 120, 146, 0.15)',
                borderColor: 'rgba(113, 120, 146, 0.4)',
                color: 'var(--textSecondary)',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid',
              }}
            >
              <HiExclamationTriangle style={{ fontSize: '18px', marginRight: '10px', color: 'var(--textSecondary)' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--textPrimary)' }}>
                  Prize Already Won
                </strong>
                <span style={{ fontSize: '14px' }}>
                  Someone has already redeemed this prize. We'll be publishing a new one soon!
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
