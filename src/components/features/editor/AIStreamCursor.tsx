import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AIStreamCursor = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 ml-1 bg-white rounded-full shadow-sm border border-blue-100 select-none pointer-events-none transform -translate-y-0.5"
            style={{ zIndex: 50 }}
        >
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-600">
                <Sparkles className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-medium text-blue-600 leading-none whitespace-nowrap">
                AI在写...
            </span>
        </motion.div>
    );
};
