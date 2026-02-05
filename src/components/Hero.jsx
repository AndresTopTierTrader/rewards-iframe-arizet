import { statusClass, niceStatus, fmtMoney, formatDate } from '../utils/formatters';
import { HiSparkles, HiClock, HiCheckCircle, HiGift } from 'react-icons/hi2';
import { RiTrophyLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export function Hero({ giveaway, progress }) {
  if (!giveaway) return null;

  const status = (giveaway.status || '').toLowerCase();
  const isUnlocked = status === 'unlocked';

  const prizeImageSrc = giveaway.prize_image || '/static/rolex-datejust.png';
  const statusPillClass = statusClass(giveaway.status);
  const statusPillText = niceStatus(giveaway.status);
  const prizeName = giveaway.prize_name || 'Prize';
  const prizeMeta = giveaway.prize_msrp_usd 
    ? `MSRP: ${fmtMoney(giveaway.prize_msrp_usd)}` 
    : 'MSRP: —';
  const prizeDesc = giveaway.description || '';
  
  let progressHint = 'Updates periodically';
  let progressIcon = <HiClock style={{ fontSize: '16px' }} />;
  if (status === 'scheduled') {
    progressHint = `Starts: ${formatDate(giveaway.start_at)}`;
    progressIcon = <HiClock style={{ fontSize: '16px' }} />;
  } else if (status === 'unlocked') {
    progressHint = 'Unlocked';
    progressIcon = <HiCheckCircle style={{ fontSize: '16px' }} />;
  }
  
  const displayPct = Math.max(0, Math.min(100, progress?.display_pct || 0));
  const showUnlockMessage = isUnlocked;
  const unlockMessage = giveaway.unlocked_message || 'Unlocked!';

  return (
    <motion.section 
      className="card hero" 
      id="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="hero__media"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img className="hero__img" src={prizeImageSrc} alt="Prize" />
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
      </motion.div>
    </motion.section>
  );
}
