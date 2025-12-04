import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicBackground from './components/MagicBackground';
import { QUESTIONS, RESULTS } from './constants';
import { Answers, QuizResult } from './types';
import { submitQuizData } from './services/submitService';

// --- Icons & Emojis ---
const QUESTION_ICONS: Record<number, string> = {
  1: "🕯️", // Me Time
  2: "🌲", // Solitude
  3: "🖼️", // Decor
  4: "💎", // Object Value
  5: "🕰️", // Schedule
};

// --- Helper for Highlighter Text ---
const HighlightText = ({ text }: { text: string }) => {
  const parts = text.split('*');
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <span key={index} className="mx-1 px-1 bg-purple-200/60 rounded-md box-decoration-clone text-purple-900 font-bold">
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// 客製化魔法少女分類帽 SVG
const MagicHatIcon = () => (
  <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 drop-shadow-xl filter">
    <motion.g
      initial={{ y: 0, rotate: 0 }}
      animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Hat Base - Pink/Purple Gradient */}
      <path d="M100 20 C60 20 40 80 30 110 C20 140 10 150 10 160 C10 170 30 180 100 180 C170 180 190 170 190 160 C190 150 180 140 170 110 C160 80 140 20 100 20Z" fill="url(#hatGradient)" />
      
      {/* Hat Fold (Sorting Hat style) */}
      <path d="M60 90 Q100 120 140 90" stroke="#C084FC" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round"/>
      
      {/* Brim */}
      <path d="M10 160 Q100 195 190 160" stroke="#E879F9" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M10 160 Q100 195 190 160" stroke="#FAE8FF" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Ribbon */}
      <path d="M30 145 Q100 165 170 145" stroke="#A855F7" strokeWidth="12" fill="none" />
      
      {/* Star Buckle */}
      <path d="M100 155 L105 145 L115 145 L108 138 L110 128 L100 135 L90 128 L92 138 L85 145 L95 145 Z" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
      
      {/* Sparkles around hat */}
      <circle cx="50" cy="60" r="3" fill="#FDE047" className="animate-pulse" />
      <circle cx="150" cy="50" r="4" fill="#fff" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
    </motion.g>
    
    <defs>
      <linearGradient id="hatGradient" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D8B4FE" /> {/* Light Purple */}
        <stop offset="1" stopColor="#E879F9" /> {/* Pink */}
      </linearGradient>
    </defs>
  </svg>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  const currentQuestion = QUESTIONS[currentQIndex];
  const totalQuestions = QUESTIONS.length;

  const handleStart = () => {
    setScreen('quiz');
    setCurrentQIndex(0);
    setAnswers({});
  };

  const handleRetake = () => {
    setScreen('start');
    setAnswers({});
    setFinalResult(null);
    setCurrentQIndex(0);
  };

  const handleOptionSelect = async (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);

    if (currentQIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
      }, 300);
    } else {
      setScreen('loading');
      await processResult(newAnswers);
    }
  };

  const processResult = async (completedAnswers: Answers) => {
    // Delay slightly longer for the "Dreamy" loading effect
    await new Promise(resolve => setTimeout(resolve, 3500));

    let totalScore = 0;
    QUESTIONS.forEach(q => {
      const selectedOptId = completedAnswers[q.id];
      const option = q.options.find(o => o.id === selectedOptId);
      if (option && option.score) {
        totalScore += option.score;
      }
    });

    const result = RESULTS.find(r => totalScore >= r.minScore && totalScore <= r.maxScore);
    const safeResult = result || RESULTS[1]; 
    setFinalResult(safeResult);
    await submitQuizData(completedAnswers, safeResult);
    setScreen('result');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative text-slate-700 overflow-hidden">
      <MagicBackground />

      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          
          {/* ================= START SCREEN ================= */}
          {screen === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl border-[6px] border-white text-center overflow-hidden"
            >
              {/* Top Decorations (Filling empty space) - Moved INSIDE visible area */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-100/50 to-transparent pointer-events-none" />
              
              {/* Decorative elements adjusted to be visible */}
              <div className="absolute top-6 left-6 text-3xl animate-bounce opacity-80" style={{ animationDuration: '3s' }}>☁️</div>
              <div className="absolute top-8 right-6 text-2xl animate-bounce opacity-80" style={{ animationDuration: '4s' }}>☁️</div>
              
              <div className="absolute top-16 left-12 text-yellow-300 text-xl animate-pulse">✨</div>
              <div className="absolute top-12 right-16 text-purple-300 text-lg">✦</div>

              <div className="relative z-10 pt-4">
                {/* Custom Magic Hat SVG - Smaller Size */}
                <MagicHatIcon />
                
                <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-wide">
                  心靈風格測驗
                </h1>
                <h2 className="text-xl text-purple-500 font-bold mb-6 flex items-center justify-center gap-2">
                  <span className="text-sm">✦</span> 你是哪一種「時間魔法師」？ <span className="text-sm">✦</span>
                </h2>
                
                <div className="text-gray-600 mb-8 leading-loose text-sm font-medium">
                  <p className="text-lg text-purple-900 font-bold mb-2">親愛的 Dai Dai ✨</p>
                  <p>在妳忙碌的生活中，我們來玩一個小測驗！</p>
                  <p className="mt-2 text-gray-500">
                    憑直覺選擇最符合妳心境的選項，<br/>
                    測出妳擁有的魔法能力！
                  </p>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full py-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white rounded-2xl text-xl font-bold shadow-lg shadow-purple-200 transform transition hover:scale-105 active:scale-95 bg-[length:200%_auto] hover:animate-[gradient_3s_ease_infinite]"
                  style={{ backgroundSize: '200% auto' }}
                >
                  開始魔法測驗 🔮
                </button>
              </div>

              {/* Bottom Decorations */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-100/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 text-2xl opacity-60 animate-pulse">⭐</div>
              <div className="absolute bottom-6 right-8 text-xl opacity-50 text-yellow-400">✨</div>
              {/* Cloud at bottom right */}
              <div className="absolute -bottom-2 -right-4 text-6xl opacity-20 rotate-12">☁️</div>
            </motion.div>
          )}

          {/* ================= QUIZ SCREEN ================= */}
          {screen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl border-4 border-purple-50 min-h-[500px] flex flex-col"
            >
              {/* Progress Bar with Title */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2 px-1">
                   <span className="text-xs font-bold text-purple-400 tracking-wider">🔮 魔法進度</span>
                   <span className="text-xs font-bold text-purple-300">
                    {currentQIndex + 1} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full h-4 bg-purple-50 rounded-full overflow-hidden shadow-inner border border-purple-100">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-300 to-pink-300 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
                  </motion.div>
                </div>
              </div>

              {/* Question Card */}
              <div className="flex-1 flex flex-col">
                <div className="text-center mb-6">
                   <motion.div
                     key={currentQuestion.id}
                     initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                     animate={{ scale: 1, opacity: 1, rotate: 0 }}
                     transition={{ type: "spring", stiffness: 200 }}
                     className="text-6xl inline-block p-6 bg-gradient-to-br from-white to-purple-50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.05)] mb-2 border border-white"
                   >
                     {QUESTION_ICONS[currentQuestion.id] || "✨"}
                   </motion.div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 text-center mb-8 px-2 leading-relaxed drop-shadow-sm">
                  {currentQuestion.title}
                </h2>

                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02, backgroundColor: '#faf5ff', borderColor: '#d8b4fe' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(option.id)}
                      className="w-full p-4 text-left border-2 border-slate-100 rounded-2xl hover:border-purple-300 transition-all bg-white group shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                      <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-purple-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity rounded-bl-3xl pointer-events-none"></div>
                      <div className="flex items-start gap-4 relative z-10">
                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 font-bold rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all text-lg font-nunito shadow-inner">
                          {option.id}
                        </span>
                        <div>
                          <span className="block font-bold text-slate-800 mb-1 text-lg">
                            {option.text}
                          </span>
                          {option.description && (
                            <span className="text-sm text-slate-500 group-hover:text-purple-700/80 leading-relaxed font-medium">
                              {option.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TECH-MAGIC LOADING SCREEN ================= */}
          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative text-center w-full max-w-[340px] aspect-square flex flex-col items-center justify-center mx-auto"
            >
              {/* Tech-Magic Array (SVG) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                 <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                    <defs>
                      <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>

                    {/* Outer Geometric Ring - Rotating Slow */}
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ originX: "100px", originY: "100px" }}
                    >
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.5" />
                      {/* Ticks on outer ring */}
                      {[0, 90, 180, 270].map(deg => (
                        <rect key={deg} x="98" y="5" width="4" height="8" fill="#c084fc" transform={`rotate(${deg} 100 100)`} />
                      ))}
                    </motion.g>

                    {/* Middle Tech Arc - Rotating Fast Counter-Clockwise */}
                    <motion.path
                      d="M100 25 A75 75 0 0 1 175 100 M100 175 A75 75 0 0 1 25 100"
                      fill="none"
                      stroke="url(#techGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      style={{ originX: "100px", originY: "100px" }}
                    />

                    {/* Inner Dashed Ring - Rotating Medium */}
                    <motion.circle 
                      cx="100" cy="100" r="55" 
                      fill="none" 
                      stroke="#fcd34d" 
                      strokeWidth="1.5"
                      strokeDasharray="2 6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      style={{ originX: "100px", originY: "100px" }}
                    />
                 </svg>
              </div>

              {/* Rising Stardust Particles (Replacing Bubbles) */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-yellow-100 rounded-full blur-[1px]"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${50 + (Math.random() * 60 - 30)}%`,
                    bottom: '20%',
                  }}
                  animate={{
                    y: -150 - Math.random() * 100,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: Math.random() * 1.5 + 1,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}

              {/* Center Crystal Ball */}
              <div className="z-10 relative bg-white/40 backdrop-blur-md p-6 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-white/50">
                  <motion.div 
                    className="text-6xl mb-0 block filter drop-shadow-md"
                    animate={{ 
                      scale: [1, 1.05, 1], 
                      filter: ["drop-shadow(0 0 5px rgba(168,85,247,0.5))", "drop-shadow(0 0 15px rgba(168,85,247,0.8))", "drop-shadow(0 0 5px rgba(168,85,247,0.5))"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🔮
                  </motion.div>
              </div>
              
              <motion.div 
                className="mt-8 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-purple-900 tracking-widest mb-1">
                  正在解析魔法能量
                </h2>
                <div className="flex justify-center gap-1">
                  <motion.div animate={{ opacity: [0,1,0] }} transition={{duration: 1.5, repeat: Infinity, delay: 0}} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <motion.div animate={{ opacity: [0,1,0] }} transition={{duration: 1.5, repeat: Infinity, delay: 0.3}} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <motion.div animate={{ opacity: [0,1,0] }} transition={{duration: 1.5, repeat: Infinity, delay: 0.6}} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ================= RESULT SCREEN ================= */}
          {screen === 'result' && finalResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border-[5px] border-white max-h-[85vh] overflow-y-auto w-full"
            >
              {/* Header Image/Color Area */}
              <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-white p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                {/* Background Glow */}
                <div className="absolute top-[-50%] left-[20%] w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-8xl mb-4 filter drop-shadow-lg inline-block relative z-10"
                >
                  {finalResult.imageKeyword === 'sparkle' ? '✨' : 
                   finalResult.imageKeyword === 'magic-potion' ? '🧪' : '⏳'}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xs font-bold tracking-[0.2em] text-purple-400 uppercase mb-3 bg-white/60 inline-block px-4 py-1.5 rounded-full border border-purple-100 shadow-sm">
                     妳的魔法能力 
                  </h2>
                  <h1 className="text-4xl font-extrabold text-purple-900 mb-3 tracking-wide">
                    {finalResult.title}
                  </h1>
                  <div className="inline-flex items-center gap-2 text-lg font-bold text-gray-500 bg-slate-50 px-4 py-2 rounded-xl">
                     魔法屬性： <span className="text-pink-500">{finalResult.magicName}</span>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-8 pt-0">
                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 mb-8 shadow-sm relative">
                  <span className="absolute -top-3 -left-2 text-4xl opacity-20">❝</span>
                  <p className="text-slate-700 leading-loose text-justify text-[1.05rem] font-medium relative z-10">
                    <HighlightText text={finalResult.description} />
                  </p>
                  <span className="absolute -bottom-6 -right-2 text-4xl opacity-20">❞</span>
                </div>

                <div className="flex items-center gap-4 my-6 opacity-50">
                   <div className="h-px bg-purple-200 flex-1"></div>
                   <span className="text-purple-300">✦</span>
                   <div className="h-px bg-purple-200 flex-1"></div>
                </div>

                {/* Call to Action */}
                <div className="bg-blue-50/60 p-6 rounded-2xl border-2 border-dashed border-blue-200 text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>
                  
                  <h3 className="text-lg font-bold text-blue-800 mb-2 mt-1">
                    💌 魔法指令：啟動驚喜傳送門
                  </h3>
                  
                  <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-blue-100 text-center text-sm text-slate-600 mb-2 font-medium leading-relaxed">
                    <p>「請<strong>截圖此畫面</strong>（包含標題與解析）<br/>並立刻傳送給讓妳做這個測驗的<br/><span className="text-blue-500 text-base font-bold">『時間守護者 Minna』</span>」</p>
                  </div>
                </div>

                <button 
                  onClick={handleRetake}
                  className="w-full mt-8 py-3.5 rounded-xl border-2 border-purple-200 text-purple-400 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm font-bold flex items-center justify-center gap-2 group"
                >
                  <span className="group-hover:-rotate-180 transition-transform duration-500">🔄</span> 
                  重新測試
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer / Credits */}
      <div className="fixed bottom-2 w-full text-center text-purple-300/60 text-[10px] pointer-events-none font-bold tracking-widest font-nunito">
        Designed by Minna
      </div>
    </div>
  );
};

export default App;