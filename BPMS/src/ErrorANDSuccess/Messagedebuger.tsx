"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Messager {
  error_set?: boolean;
  success_set?: boolean;
  Message?: string;
  className?: string;
}

export default function MassegeDebuge({
  error_set = false,
  success_set = false,
  Message,
  className
}: Messager) {
  return (
    <div className="w-full flex flex-col items-center space-y-2 px-4 sm:px-0">
      <AnimatePresence>
        {error_set && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-500 text-red-700 dark:text-white px-4 py-3 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md text-center pointer-events-auto"
          >
           <span className={`font-medium ${className}`}>{Message}</span>
          </motion.div>
        )}

        {success_set && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-800 dark:text-white px-4 py-3 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md text-center pointer-events-auto"
          >
            <p className={`font-semibold ${className}`}>{Message || "عملیات با موفقیت انجام شد!"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
