import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '24px',
    }}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src="/logo.svg" 
          alt="TX3 Funding" 
          style={{
            height: '60px',
            width: 'auto',
            display: 'block',
          }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          color: 'var(--textSecondary)',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        Loading rewards...
      </motion.p>
    </div>
  );
}
