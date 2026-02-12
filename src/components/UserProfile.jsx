import { motion } from 'framer-motion';
import { HiUser, HiEnvelope, HiCalendar } from 'react-icons/hi2';
import { formatDate } from '../utils/formatters';
import '../styles/app.css';

export function UserProfile({ user, firstPurchase }) {
  if (!user) return null;

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const displayEmail = user.email || '—';
  const firstPurchaseDate = firstPurchase ? formatDate(firstPurchase) : '—';

  return (
    <section className="card userProfile">
      <div className="userProfile__header">
        <motion.div 
          className="userProfile__avatar"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <HiUser style={{ fontSize: '24px' }} />
        </motion.div>
        <h3 className="userProfile__name">{displayName}</h3>
      </div>

      <div className="userProfile__body">
        <motion.div 
          className="userProfile__item"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <HiEnvelope style={{ fontSize: '16px', color: 'var(--textSecondary)', flexShrink: 0 }} />
          <div className="userProfile__itemContent">
            <div className="userProfile__label">Email</div>
            <div className="userProfile__value">{displayEmail}</div>
          </div>
        </motion.div>

        <motion.div 
          className="userProfile__item"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <HiCalendar style={{ fontSize: '16px', color: 'var(--textSecondary)', flexShrink: 0 }} />
          <div className="userProfile__itemContent">
            <div className="userProfile__label">First Purchase</div>
            <div className="userProfile__value">{firstPurchaseDate}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
