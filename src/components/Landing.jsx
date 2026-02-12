import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiCheck } from 'react-icons/hi2';

export function Landing() {
  const [userId, setUserId] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasNavigated = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const doNavigate = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    const value = userId.trim();
    const params = new URLSearchParams(location.search);
    params.set('token', value);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  const exitTimerRef = useRef(null);

  const handleGoCheck = (e) => {
    e?.preventDefault();
    const value = userId.trim();
    if (!value || isNavigating) return;
    setIsNavigating(true);
    exitTimerRef.current = setTimeout(() => setExiting(true), 500);
  };

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const cardExiting = isNavigating && exiting;

  return (
    <div className="page page--wide bgHero">
      <div className="landing">
        <motion.div
          className="landing__card"
          initial={false}
          animate={{
            opacity: cardExiting ? 0 : 1,
            scale: cardExiting ? 0.96 : 1,
            y: cardExiting ? -20 : 0,
            filter: cardExiting ? 'blur(8px)' : 'blur(0px)',
          }}
          transition={{
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
          }}
          onAnimationComplete={() => {
            if (cardExiting) doNavigate();
          }}
        >
          <AnimatePresence mode="wait">
            {!isNavigating ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: '100%' }}
              >
                <motion.img
                  src="/logo.svg"
                  alt="TX3 Funding"
                  className="landing__logo"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <motion.h1
                  className="landing__title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Tx3 Community Rewards
                </motion.h1>
                <motion.p
                  className="landing__description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  This is where TX3 community members can see their reward entries, track progress toward current giveaways, and explore past rewards. When you visit with your personal link (including your token), you’ll see your own stats and eligibility for active prizes.
                </motion.p>
                <motion.form
                  className="landing__form"
                  onSubmit={handleGoCheck}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <input
                    type="text"
                    className="landing__input input"
                    placeholder="Enter your User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={isNavigating}
                    aria-label="User ID"
                  />
                  <motion.button
                    type="submit"
                    className="btn landing__btn"
                    disabled={!userId.trim()}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 24px rgba(0, 82, 180, 0.35)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="landing__btnContent">
                      <span>Go Check</span>
                      <HiArrowRight style={{ fontSize: '18px', marginLeft: '4px' }} />
                    </span>
                  </motion.button>
                </motion.form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="landing__successWrap"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 24,
                }}
              >
                <motion.div
                  className="landing__successIcon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    delay: 0.08,
                  }}
                >
                  <HiCheck style={{ width: 48, height: 48 }} />
                </motion.div>
                <motion.p
                  className="landing__successText"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Taking you to your rewards…
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
