import { motion } from 'framer-motion';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';

export function ErrorScreen({ error, onRetry, statusCode }) {
  const isNotFound = statusCode === 422 || statusCode === 404;
  const errorTitle = isNotFound ? 'User Not Found' : 'Error Loading Rewards';
  const errorMessage = isNotFound 
    ? 'The user ID provided could not be found. Please check the token parameter in the URL.'
    : error || 'An unexpected error occurred. Please try again.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <HiExclamationTriangle style={{ fontSize: '40px', color: '#ef4444' }} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: 'var(--textPrimary)',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}
      >
        {errorTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: '15px',
          color: 'var(--textSecondary)',
          maxWidth: '500px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        {errorMessage}
      </motion.p>

      {onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--forexBlue)',
            border: '1px solid var(--forexBlue)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          <HiArrowPath style={{ fontSize: '18px' }} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
