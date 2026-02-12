import { useRewards } from '../hooks/useRewards';
import { getUserId } from '../utils/api';
import { Hero } from '../components/Hero';
import { Landing } from '../components/Landing';
import { UserProfile } from '../components/UserProfile';
import { PastRewards } from '../components/PastRewards';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorScreen } from '../components/ErrorScreen';
import { formatDate, safeText, tagClass } from '../utils/formatters';
import { mockGiveawayData } from '../utils/mockData';
import { HiArrowPath, HiTicket, HiShoppingBag, HiTrophy, HiExclamationTriangle, HiInformationCircle } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/app.css';

export function Community() {
  const { data, loading, error, errorStatus, usingMockData, refetch } = useRewards();

  // When there's no ?token= in the URL, show the landing/welcome screen
  if (!getUserId()) {
    return <Landing />;
  }

  const giveaway = data?.giveaway;
  const progress = data?.progress;
  const user = data?.user;
  const entries = data?.user?.entries;
  const orders = data?.orders || [];
  const authenticated = !!user;

  const topbarSub = giveaway ? 'Rewards for the TX3 community' : (data?.ui?.progressText || 'No active reward is configured yet.');
  const myEntries = entries != null && typeof entries === 'number'
    ? entries.toLocaleString(undefined, { maximumFractionDigits: 1 })
    : '—';
  const myOrdersCount = orders.length;

  // Get first purchase date from orders
  const firstPurchase = orders.length > 0 
    ? orders.reduce((earliest, order) => {
        const orderDate = new Date(order.date_created);
        const earliestDate = earliest ? new Date(earliest) : null;
        if (!earliestDate || orderDate < earliestDate) {
          return order.date_created;
        }
        return earliest;
      }, null)
    : null;

  const entriesText = (entries) => {
    const e = Number(entries || 0);
    return e.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const showMockWarning = usingMockData;

  // Show loading spinner
  if (loading) {
    return (
      <div className="page page--wide">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error screen if there's an error
  if (error && !data) {
    return (
      <div className="page page--wide">
        <ErrorScreen 
          error={error} 
          statusCode={errorStatus}
          onRetry={refetch} 
        />
      </div>
    );
  }

  const premiumTransition = { duration: 0.6, ease: [0.32, 0.72, 0, 1] };
  const stagger = (i) => ({ ...premiumTransition, delay: 0.06 * i });

  return (
    <div className="page page--wide">
      <motion.header 
        className="topbar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={stagger(0)}
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
            <div className="topbar__title">Community Rewards</div>
            <div className="topbar__sub">{topbarSub}</div>
          </div>
        </div>
        <div className="topbar__right">
          <motion.button 
            type="button" 
            className="btn btn--ghost" 
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiArrowPath style={{ fontSize: '16px' }} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </motion.header>

      <main className="layout">
        <AnimatePresence>
          {showMockWarning && (
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
        </AnimatePresence>
        
        <>
          {giveaway ? (
            <motion.div
              className="layout__hero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(1)}
            >
              <Hero 
                giveaway={giveaway} 
                progress={progress} 
                user={user}
                ui={data?.ui}
                onClaimSuccess={refetch}
              />
            </motion.div>
          ) : data?.ui && (
            <motion.section
              className="card hero"
              id="hero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(1)}
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px' }}
            >
              <HiTrophy style={{ fontSize: '48px', color: 'var(--textSecondary)', marginBottom: '16px' }} />
              <h2 className="hero__title" style={{ fontSize: '22px', marginBottom: '8px' }}>
                No active reward
              </h2>
              <p className="hero__desc" style={{ margin: 0 }}>
                {data.ui.progressText || 'Check back later for the next community reward.'}
              </p>
            </motion.section>
          )}
            
            {authenticated && user && (
              <motion.div
                className="layout__userProfile"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(2)}
              >
                <UserProfile user={user} firstPurchase={firstPurchase} />
              </motion.div>
            )}

            <motion.section 
              className="card" 
              id="meCard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(3)}
            >
              <div className="card__title">
                <HiTicket style={{ fontSize: '20px' }} />
                Your entries
              </div>
              {!authenticated && (
                <motion.div 
                  className="notice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <HiInformationCircle style={{ fontSize: '18px' }} />
                  No token parameter found. Add ?token=USER_ID to the URL to see your entries.
                </motion.div>
              )}

              <div className="statRow">
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiTicket style={{ fontSize: '14px', marginRight: '4px' }} />
                    Entries
                  </div>
                  <div className="stat__value">{myEntries}</div>
                </motion.div>
                <motion.div 
                  className="stat"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat__label">
                    <HiShoppingBag style={{ fontSize: '14px', marginRight: '4px' }} />
                    Eligible purchases shown
                  </div>
                  <div className="stat__value">{myOrdersCount}</div>
                </motion.div>
              </div>

              <div className="divider" />

              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product</th>
                      <th className="right">Entries</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="muted">
                          {loading ? 'Loading…' : 'No eligible purchases yet.'}
                        </td>
                      </tr>
                    ) : (
                      orders.map((r, index) => (
                        <motion.tr 
                          key={r.id ?? r.order_id ?? r.date_created + r.product_name}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: 0.35 + index * 0.04, ease: [0.32, 0.72, 0, 1] }}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        >
                          <td>{formatDate(r.date_created)}</td>
                          <td>{safeText(r.product_name)}</td>
                          <td className="right">{entriesText(r.entries)}</td>
                          <td><span className={tagClass(r.status)}>{safeText(r.status)}</span></td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <motion.section 
              className="card card--scrollable" 
              id="pastCard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(4)}
            >
              <div className="card__title">
                <HiTrophy style={{ fontSize: '20px' }} />
                Past rewards
              </div>
              <div className="card__scrollableContent">
                <PastRewards past={data?.rewards || mockGiveawayData.past} />
              </div>
            </motion.section>

            <motion.section 
              className="footerNote"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(5)}
            >
              Entries are calculated from eligible purchases and may update with a short delay.
            </motion.section>
        </>
      </main>
    </div>
  );
}
