import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-white/10 w-fit">
      
      <div className="text-indigo-400 text-sm font-medium">
        AI is typing
      </div>

      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
            animate={{
              y: [0, -6, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;