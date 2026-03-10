import { useState } from "react";
import { Calendar, MapPin, DollarSign, Sparkles, ChevronRight, Clock, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SmartTripPlanner() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    days: 3,
    budget: "Medium",
    interests: [] as string[]
  });
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const interests = ["Safari", "Culture", "Adventure", "Aviation", "Luxury", "Budget"];

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      });
      const data = await res.json();
      setItinerary(data);
      setStep(4);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
      <div className="bg-[#5A5A40] p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-amber-400" />
          <h3 className="text-2xl font-serif font-bold">Smart Trip Planner</h3>
        </div>
        <p className="text-white/70 text-sm">AI-powered personalized Botswana itinerary</p>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">How many days?</label>
                <div className="flex items-center gap-4">
                  {[1, 3, 5, 7, 10].map(d => (
                    <button 
                      key={d}
                      onClick={() => setPreferences({...preferences, days: d})}
                      className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                        preferences.days === d ? "bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">What's your budget?</label>
                <div className="grid grid-cols-3 gap-4">
                  {["Low", "Medium", "High"].map(b => (
                    <button 
                      key={b}
                      onClick={() => setPreferences({...preferences, budget: b})}
                      className={`py-4 rounded-2xl font-bold transition-all border ${
                        preferences.budget === b ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-[#5A5A40] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">Next Step <ChevronRight size={18} /></button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map(i => (
                    <button 
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                        preferences.interests.includes(i) ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Back</button>
                <button 
                  onClick={generateItinerary}
                  disabled={loading}
                  className="flex-[2] bg-[#5A5A40] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Itinerary"}
                  {!loading && <Sparkles size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && itinerary && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800">Your {preferences.days}-Day Plan</h4>
                <button onClick={() => setStep(1)} className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest hover:underline">Reset</button>
              </div>

              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {itinerary.days.map((day: any, idx: number) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-[#5A5A40] text-white rounded-full flex items-center justify-center font-bold text-xs z-10">
                      {idx + 1}
                    </div>
                    <div className="space-y-4">
                      {day.activities.map((act: any, aIdx: number) => (
                        <div key={aIdx} className="bg-gray-50 p-4 rounded-2xl border border-black/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <Clock size={12} /> {act.time}
                            </span>
                          </div>
                          <h5 className="font-bold text-gray-800 text-sm mb-1">{act.title}</h5>
                          <p className="text-xs text-gray-500 leading-relaxed">{act.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <Info className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Pro Tip:</strong> {itinerary.recommendation}
                </p>
              </div>

              <button className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#5A5A40]/20">
                Save to My Trips
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
