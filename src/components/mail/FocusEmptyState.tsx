import React, { useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export function FocusEmptyState() {
    useEffect(() => {
        // Fire confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-full p-8 text-center"
        >
            <div className="relative w-64 h-64 mb-6">
                <Image
                    src="/images/illustration_coffee_green_circle.png"
                    alt="Task Complete"
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-500"
                    priority
                />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                所有事项已经处理完毕
            </h2>
            <p className="text-slate-500 font-medium">
                忙点别的，迎接下一个挑战
            </p>
        </motion.div>
    );
}
