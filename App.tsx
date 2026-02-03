
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import CalculatorCard from './components/CalculatorCard.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import HistoryList from './components/HistoryList.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import LoginOverlay from './components/LoginOverlay.tsx';
import CommunityChat from './components/CommunityChat.tsx';
import { CalculationResult, HistoryItem, CalcMode, Language, UserProfile } from './types.ts';
import { translations } from './translations.ts';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalcMode>('toMurubba');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<'emerald' | 'blue' | 'indigo'>('emerald');
  const [language, setLanguage] = useState<Language>('bn');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'calc' | 'chat'>('calc');

  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    const savedHistory = localStorage.getItem('stone_calc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('stone_calc_theme') as any;
    if (savedTheme && ['emerald', 'blue', 'indigo'].includes(savedTheme)) setTheme(savedTheme);

    const savedLang = localStorage.getItem('stone_calc_lang') as Language;
    if (savedLang && ['bn', 'en', 'hi', 'ar'].includes(savedLang)) setLanguage(savedLang);

    const savedUser = localStorage.getItem('stone_calc_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('stone_calc_lang', language);
  }, [language]);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('stone_calc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stone_calc_user');
  };

  const handleThemeChange = (newTheme: 'emerald' | 'blue' | 'indigo') => {
    setTheme(newTheme);
    localStorage.setItem('stone_calc_theme', newTheme);
  };

  const handleCalculate = (data: CalculationResult) => {
    setResult(data);
    const newItem: HistoryItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      label: `${t.appTitle} ${history.length + 1}`,
      userMobile: user?.mobile
    };
    const updatedHistory = [newItem, ...history].slice(0, 50); // Store more history
    setHistory(updatedHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    const remainingHistory = history.filter(item => item.userMobile !== user?.mobile);
    setHistory(remainingHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(remainingHistory));
  };

  // Filter history to only show current user's items
  const currentUserHistory = history.filter(item => item.userMobile === user?.mobile);

  const themeAccentBg = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500'
  }[theme];

  const devWhatsAppUrl = "https://wa.me/8801735308795";

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/50 ${language === 'ar' ? 'font-serif' : ''}`}>
      {!user && <LoginOverlay language={language} onLogin={handleLogin} />}
      
      <Header 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        currentTheme={theme} 
        onThemeChange={handleThemeChange} 
        language={language}
        onLanguageChange={setLanguage}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 max-w-xs mx-auto mb-8">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calc' ? themeAccentBg + ' text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-calculator mr-2"></i> {t.calculate}
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-sms mr-2"></i> {t.communityTab}
          </button>
        </div>

        {activeTab === 'calc' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2 h-8 ${themeAccentBg} rounded-full`}></div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                    {t[activeMode as keyof typeof t]}
                  </h2>
                </div>
                <CalculatorCard activeMode={activeMode} onCalculate={handleCalculate} themeColor={theme} language={language} />
              </section>

              {result && (
                <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-slate-800 rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t.resultTitle}</h2>
                  </div>
                  <ResultDisplay result={result} themeColor={theme} language={language} />
                </section>
              )}

              <section>
                  <AIAssistant currentCalculation={result} language={language} />
              </section>
            </div>

            <div className="space-y-6">
              <section className="sticky top-32">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-slate-300 rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t.history}</h2>
                  </div>
                  {currentUserHistory.length > 0 && (
                    <button onClick={clearHistory} className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-red-50 hover:bg-red-50 transition-colors">{t.clearHistory}</button>
                  )}
                </div>
                <HistoryList items={currentUserHistory} onSelect={setResult} language={language} />
              </section>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <CommunityChat language={language} user={user!} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t-2 border-slate-100 py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${themeAccentBg} rounded-2xl flex items-center justify-center text-white text-xl shadow-xl shadow-slate-200`}>
                <i className="fas fa-gem"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{t.brand}</span>
                <span className="text-lg font-black text-slate-800 uppercase tracking-widest">PRO CALCULATOR</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.devLabel}</p>
              <a 
                href={devWhatsAppUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all"
              >
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700 tracking-tight">KARINA GROUP</p>
                  <p className="text-[9px] font-bold text-slate-400 tracking-widest">+880 1735 308795</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
