"use client"

import * as React from "react"

export function InboxZeroState() {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
            {/* Coffee Cup Illustration */}
            <div className="relative mb-6">
                <div className="text-8xl animate-bounce-slow">☕</div>
                {/* Steam animation */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
                    <span className="w-1 h-6 bg-slate-300/50 rounded-full animate-steam-1" />
                    <span className="w-1 h-8 bg-slate-300/50 rounded-full animate-steam-2" />
                    <span className="w-1 h-5 bg-slate-300/50 rounded-full animate-steam-3" />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                收件箱已清空 🎉
            </h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                去喝杯咖啡吧，你值得休息一下。<br />
                所有邮件都已处理完毕。
            </p>

            {/* Celebration confetti (subtle) */}
            <div className="mt-8 flex gap-2">
                <span className="text-2xl animate-wiggle delay-100">🎊</span>
                <span className="text-2xl animate-wiggle delay-200">✨</span>
                <span className="text-2xl animate-wiggle delay-300">🎉</span>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                @keyframes steam {
                    0% { opacity: 0; transform: translateY(0) scaleY(1); }
                    50% { opacity: 0.6; }
                    100% { opacity: 0; transform: translateY(-20px) scaleY(1.5); }
                }
                .animate-steam-1 { animation: steam 2s ease-out infinite; }
                .animate-steam-2 { animation: steam 2s ease-out infinite 0.3s; }
                .animate-steam-3 { animation: steam 2s ease-out infinite 0.6s; }
                
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }
                .animate-wiggle {
                    animation: wiggle 1s ease-in-out infinite;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>
        </div>
    )
}
