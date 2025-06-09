import React from 'react';
import { motion } from 'framer-motion';

const Tag = ({ label = 'Eduardo', translateX = ["0vw", "0vw", "0vw"], translateY = ["0vh", "0vh", "0vh"] }) => {
  return (
    <motion.div
      animate={{
        x: translateX,
        y: translateY
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute"
    >
      <div className="w-[6px] h-[6px] bg-[#bfbaff] rounded-sm"></div>
      <div className="relative inline-block px-3 py-1 rounded-xl text-sm text-[#2c2c54] bg-[#bfbaff]">
        {label}
      </div>
    </motion.div>
  );
};

export default Tag;