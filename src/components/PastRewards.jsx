import { formatDate, safeText } from '../utils/formatters';
import { HiTrophy, HiUser, HiCalendar } from 'react-icons/hi2';
import { motion } from 'framer-motion';

export function PastRewards({ past }) {
  if (!past || past.length === 0) {
    return <div className="muted">No past rewards yet.</div>;
  }

  return (
    <div className="gridCards">
      {past.map((reward, index) => (
        <motion.div 
          key={reward.id} 
          className="miniCard"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.06, ease: [0.32, 0.72, 0, 1] }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="miniCard__imgWrap">
            <img 
              className="miniCard__img" 
              src={safeText(reward.prize_image)} 
              alt="Prize" 
            />
            <div className="miniCard__badge">
              <HiTrophy className="miniCard__badgeIcon" />
            </div>
          </div>
          <div className="miniCard__body">
            <div className="miniCard__title">
              <HiTrophy className="miniCard__titleIcon" />
              {safeText(reward.prize_name || 'Prize')}
            </div>
            <div className="miniCard__info">
              {reward.winner_display ? (
                <div className="miniCard__infoItem">
                  <HiUser className="miniCard__infoIcon" />
                  <div className="miniCard__infoContent">
                    <span className="miniCard__infoLabel">Winner</span>
                    <span className="miniCard__infoValue mono">{safeText(reward.winner_display)}</span>
                  </div>
                </div>
              ) : (
                <div className="miniCard__infoItem">
                  <HiUser className="miniCard__infoIcon" />
                  <div className="miniCard__infoContent">
                    <span className="miniCard__infoLabel">Winner</span>
                    <span className="miniCard__infoValue">—</span>
                  </div>
                </div>
              )}
              {reward.unlocked_at && (
                <div className="miniCard__infoItem">
                  <HiCalendar className="miniCard__infoIcon" />
                  <div className="miniCard__infoContent">
                    <span className="miniCard__infoLabel">Unlocked</span>
                    <span className="miniCard__infoValue">{formatDate(reward.unlocked_at)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
