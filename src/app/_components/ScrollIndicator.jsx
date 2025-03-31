"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollIndicator = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-gray-500 text-sm mb-2">Scroll Down</span>
          <motion.div
            className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <motion.div
              className="w-2 h-2 bg-gray-500 rounded-full mt-2"
              animate={{ 
                y: [0, 14, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator; 