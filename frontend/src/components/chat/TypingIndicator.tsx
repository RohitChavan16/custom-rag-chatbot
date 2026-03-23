import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="mx-4 mb-2 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-md xl:mx-6">
      <div className="text-sm font-medium text-cyan-200">
        Atlas AI is thinking
      </div>

      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
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
