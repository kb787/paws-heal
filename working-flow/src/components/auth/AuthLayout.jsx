import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import BrainVector from './BrainVector';
import ParticlesBackground from './ParticlesBackground';
import AnimatedText from './AnimatedText';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side animated section */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ParticlesBackground />
        
        <div className="relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
            whileHover={{ scale: 1.1 }}
            className="mb-8"
          >
            <BrainVector />
          </motion.div>

          <AnimatedText
            text="Prithvi.AI"
            className="text-6xl font-bold text-white mb-4"
          />
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="text-purple-400 text-xl relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Empowering Intelligence
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-purple-600/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
             
            ].map((text, index) => (
              <motion.div
                key={text}
                className="text-purple-300/60"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 + 1 }}
                whileHover={{
                  x: 10,
                  color: "#A78BFA",
                  transition: { duration: 0.2 }
                }}
              >
                {text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{ 
            background: [
              'radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>

      {/* Right side content section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;