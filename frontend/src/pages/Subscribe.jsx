import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Zap, Globe, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.get(`${globalThis.API_URL}/scores/me`, { headers });
      setUser(res.data);
    } catch (err) {}
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.post(`${globalThis.API_URL}/subscriptions/create-checkout-session`, { plan }, { headers });
      
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError('Failed up initiate secure session. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gateway communication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
          Level Up Your <span className="text-green-600">Impact</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock performance tracking, monthly prize draws, and join a fleet of heroes making real change. Choose your movement.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-xl text-center font-bold animate-shake">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Monthly Plan */}
        <div className={`bg-white rounded-3xl p-8 shadow-xl border-2 transition-all ${user?.plan === 'monthly' ? 'border-green-600' : 'border-transparent shadow-gray-100 hover:border-green-200'}`}>
          <div className="flex justify-between items-start mb-8">
            <div className="bg-green-100 p-3 rounded-2xl text-green-700">
              <Zap size={24} />
            </div>
            {user?.plan === 'monthly' && (
              <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                ACTIVE PLAN
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black mb-2">Monthly Entry</h3>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-black">$10</span>
            <span className="text-gray-400 font-bold">/month</span>
          </div>

          <ul className="space-y-4 mb-10 text-gray-600 font-semibold text-sm md:text-base">
            <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-green-500"/> Full Stableford Score Tracking</li>
            <li className="flex items-center gap-3"><Globe size={18} className="text-green-500"/> Supports Monthly Global Charities</li>
            <li className="flex items-center gap-3"><Star size={18} className="text-green-500"/> Automatic Entry to Monthly Draws</li>
          </ul>

          {user?.plan === 'monthly' ? (
             <div className="w-full flex items-center justify-center gap-2 py-4 text-green-700 font-black bg-green-50 rounded-2xl border border-green-200">
               <CheckCircle2 size={24}/> Current Active
             </div>
          ) : (
            <button 
              disabled={loading || user?.plan === 'yearly'}
              onClick={() => handleSubscribe('monthly')}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-30"
            >
              {loading ? 'Securing...' : (user?.plan === 'yearly' ? 'Lower Plan' : 'Get Monthly')} <ArrowRight size={20}/>
            </button>
          )}
        </div>

        {/* Yearly Plan - Spotlight */}
        <div className={`bg-white rounded-3xl p-8 shadow-2xl border-2 relative overflow-hidden group transition-all ${user?.plan === 'yearly' ? 'border-green-600 ring-4 ring-green-50' : 'border-green-600 shadow-green-100'}`}>
          {user?.plan !== 'yearly' && (
            <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-black px-6 py-2 rotate-45 translate-x-[25px] translate-y-[10px] shadow-sm uppercase tracking-tighter">
              MOST POPULAR
            </div>
          )}

          <div className="flex justify-between items-start mb-8">
            <div className={`p-3 rounded-2xl transition ${user?.plan === 'yearly' ? 'bg-green-50 text-green-700' : 'bg-green-600 text-white group-hover:rotate-12'}`}>
              <Star size={24} />
            </div>
            {user?.plan === 'yearly' && (
              <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                ACTIVE PLAN
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black mb-2">Yearly Membership</h3>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-black">$100</span>
            <span className="text-gray-400 font-bold">/year</span>
            {user?.plan !== 'yearly' && <span className="ml-2 bg-green-100 text-green-800 text-[11px] font-black px-2 py-0.5 rounded-full">Save 16%</span>}
          </div>

          <ul className="space-y-4 mb-10 text-gray-600 font-semibold text-sm md:text-base">
             <li className="flex items-center gap-3 font-black text-gray-900"><ShieldCheck size={18} className="text-green-600"/> All Monthly Benefits Included</li>
             <li className="flex items-center gap-3"><Globe size={18} className="text-green-600"/> Priority Support Channel</li>
             <li className="flex items-center gap-3"><Star size={18} className="text-green-600"/> VIP Status Badge on Profile</li>
             <li className="flex items-center gap-3 italic text-xs text-gray-400 font-normal">One annual payment. Minimum 10% donation guaranteed.</li>
          </ul>

          {user?.plan === 'yearly' ? (
             <div className="w-full flex items-center justify-center gap-2 py-4 text-green-700 font-black bg-green-50 rounded-2xl border border-green-200">
               <CheckCircle2 size={24}/> Current Active
             </div>
          ) : (
            <button 
              disabled={loading}
              onClick={() => handleSubscribe('yearly')}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2 shadow-green-200 disabled:opacity-50"
            >
               {loading ? 'Redirecting...' : (user?.plan === 'monthly' ? 'Upgrade to Yearly' : 'Start Yearly Session')} <ArrowRight size={20}/>
            </button>
          )}
        </div>
      </div>

      <div className="text-center pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
         <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={16}/> Payments Secured via Stripe Gateway
         </div>
         <p className="text-[10px] text-gray-400 max-w-sm mx-auto leading-relaxed">
           By activating your session, you agree to our Terms of Service. All donations are handled via PCI-compliant infrastructure.
         </p>
      </div>
    </div>
  );
}
