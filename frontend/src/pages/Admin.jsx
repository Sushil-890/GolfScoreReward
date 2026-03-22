import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dices, Trophy, Users, HeartHandshake, CheckCircle, XCircle, FileText, ArrowRight, History } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Draws');
  const [data, setData] = useState({ draws: [], winnings: [], users: [], charities: [] });
  const [newCharity, setNewCharity] = useState({ name: '', description: '' });
  const [publishing, setPublishing] = useState(false);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => { fetchData() }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'Draws') {
        const d = await axios.get(`${globalThis.API_URL}/draws/admin/latest`, { headers });
        setData(p => ({ ...p, draws: [d.data] }));
      } else if (activeTab === 'Winners') {
        const w = await axios.get(`${globalThis.API_URL}/winnings/admin/all`, { headers });
        setData(p => ({ ...p, winnings: w.data }));
      } else if (activeTab === 'Users') {
        const u = await axios.get(`${globalThis.API_URL}/auth/users`, { headers });
        setData(p => ({ ...p, users: u.data }));
      } else if (activeTab === 'Charities') {
        const c = await axios.get(`${globalThis.API_URL}/charities`);
        setData(p => ({ ...p, charities: c.data }));
      } else if (activeTab === 'Records') {
        const h = await axios.get(`${globalThis.API_URL}/draws/admin/history`, { headers });
        setData(p => ({ ...p, history: h.data }));
      }
    } catch (err) { }
  };

  const simulateDraw = async (logicType) => {
    try {
      await axios.post(`${globalThis.API_URL}/draws/simulate`, { logicType }, { headers });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error simulating'); }
  };

  const publishDraw = async (id) => {
    setPublishing(true);
    try {
      await axios.post(`${globalThis.API_URL}/draws/publish/${id}`, {}, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing');
    } finally {
      setPublishing(false);
    }
  };

  const updateWinningStatus = async (id, status, notes = '') => {
    try {
      await axios.patch(`${globalThis.API_URL}/winnings/review/${id}`, { status, notes }, { headers });
      fetchData();
    } catch (err) { }
  };

  const createCharity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${globalThis.API_URL}/charities`, newCharity, { headers });
      setNewCharity({ name: '', description: '' });
      fetchData();
    } catch (err) { }
  };

  const tabs = [
    { id: 'Draws', icon: <Dices size={20} /> },
    { id: 'Winners', icon: <Trophy size={20} /> },
    { id: 'Users', icon: <Users size={20} /> },
    { id: 'Charities', icon: <HeartHandshake size={20} /> },
    { id: 'Records', icon: <History size={20} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Admin Command Center</h2>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Comprehensive management for draws, payouts, and platform health.</p>
        </div>
      </div>

      {/* Styled Tabs (Desktop centered, Mobile Scrollable) */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex md:justify-center overflow-x-auto snap-x hide-scrollbar gap-2 max-w-4xl mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold shrink-0 snap-start transition-all duration-200 ${activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-200 translate-y-[-2px]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
              }`}
          >
            {tab.icon} <span className="text-sm tracking-wide">{tab.id}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[500px]">

        {/* ================= DRAWS TAB ================= */}
        {activeTab === 'Draws' && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
              <div>
                <h3 className="text-2xl font-black">Draw Engine</h3>
                <p className="text-sm text-gray-500">Simulate outputs before officially committing to the public pool.</p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <button onClick={() => simulateDraw('random')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold px-4 py-2 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition">
                  <Dices size={18} /> Random
                </button>
                <button onClick={() => simulateDraw('algorithm')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-50 text-purple-700 font-bold px-4 py-2 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition">
                  <FileText size={18} /> Algorithm
                </button>
              </div>
            </div>

            {!data.draws[0] ? (
              <div className="text-center py-12 text-gray-400 italic">No draws found. Execute a simulation above.</div>
            ) : data.draws.map((d, i) => d && (
              <div key={i} className={`rounded-xl border-2 p-6 md:p-8 transition-all ${d.status === 'published' ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/30 ring-2 ring-orange-100 shadow-lg'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                  {/* Draw Meta */}
                  <div className="space-y-4 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md ${d.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-orange-500 text-white animate-pulse'}`}>
                        {d.status} Status
                      </span>
                      <span className="text-sm font-semibold text-gray-500">{new Date(d.date).toLocaleString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {d.numbers.map((n, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center font-black text-xl text-gray-800">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pool Stats */}
                  <div className="w-full md:w-[300px] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wide">Financial Impact</p>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-semibold text-gray-600">Total Pool Size:</p>
                      <p className="text-2xl font-black text-green-600">${d.prizePool?.total}</p>
                    </div>
                    {d.prizePool?.jackpotRollover > 0 && (
                      <p className="text-xs font-bold text-orange-500 text-right">+ ${d.prizePool.jackpotRollover} Rollover Included!</p>
                    )}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center border-t pt-3">
                      <div className="bg-gray-50 rounded p-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">5 Match</p>
                        <p className="font-black text-sm">{d.stats?.match5}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">4 Match</p>
                        <p className="font-black text-sm">{d.stats?.match4}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">3 Match</p>
                        <p className="font-black text-sm">{d.stats?.match3}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {d.status === 'simulated' && (
                    <button
                      disabled={publishing}
                      onClick={() => publishDraw(d._id)}
                      className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition shadow hover:shadow-lg ${publishing
                          ? 'bg-gray-400 text-white cursor-not-allowed blur-[0.5px]'
                          : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-1'
                        }`}
                    >
                      {publishing ? (
                        <div className="flex items-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Publishing...
                        </div>
                      ) : (
                        <>PUBLISH DRAW <ArrowRight size={20} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= WINNERS TAB ================= */}
        {activeTab === 'Winners' && (
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-black mb-6">Winner Verification Pipeline</h3>

            {/* Mobile View: Stacked Cards */}
            <div className="md:hidden space-y-4">
              {data.winnings.length === 0 && <p className="text-gray-500 italic">No winners in pipeline.</p>}
              {data.winnings.map(w => (
                <div key={w._id} className="bg-gray-50 p-5 rounded-xl border relative shadow-sm">
                  <span className={`absolute top-4 right-4 text-xs px-2 py-1 rounded font-bold
                    ${w.status === 'Paid' ? 'bg-green-100 text-green-700' : w.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {w.status}
                  </span>
                  <p className="font-black text-lg mb-1">{w.userId?.name}</p>
                  <p className="text-sm font-semibold text-gray-500 mb-3">Matched: {w.matchType} numbers</p>
                  <p className="text-2xl font-black text-green-600 mb-4">${w.prizeAmount}</p>

                  <div className="bg-white p-3 rounded-lg border mb-4">
                    <p className="text-xs font-bold text-gray-400 mb-1">PROOF UPLOAD</p>
                                        {w.proofImage ? <a href={w.proofImage.startsWith('http') ? w.proofImage : `${globalThis.API_URL.replace('/api', '')}${w.proofImage}`} target="_blank" className="font-bold text-blue-600 hover:underline">View Screenshot</a> : <span className="text-sm text-gray-400">Awaiting user upload...</span>}

                  </div>

                  {w.status === 'Pending Review' && w.proofImage && (
                    <div className="flex gap-2">
                      <button onClick={() => updateWinningStatus(w._id, 'Approved')} className="flex-1 flex justify-center items-center gap-1 bg-green-600 text-white p-2 rounded-lg font-bold"><CheckCircle size={16} /> Approve</button>
                      <button onClick={() => updateWinningStatus(w._id, 'Rejected')} className="flex-1 flex justify-center items-center gap-1 bg-red-600 text-white p-2 rounded-lg font-bold"><XCircle size={16} /> Reject</button>
                    </div>
                  )}
                  {w.status === 'Approved' && (
                    <button onClick={() => updateWinningStatus(w._id, 'Paid')} className="w-full bg-blue-600 text-white p-2 rounded-lg font-bold shadow">Mark as Paid</button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View: Styled Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border shadow-sm">
              <table className="w-full text-left bg-white">
                <thead className="bg-gray-50 text-gray-600 text-sm font-bold border-b tracking-wide">
                  <tr><th className="p-4">User Details</th><th className="p-4">Payout</th><th className="p-4">Evidence</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.winnings.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Clear pipeline! No pending un-paid winners.</td></tr>}
                  {data.winnings.map(w => (
                    <tr key={w._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-black">{w.userId?.name}</p>
                        <p className="text-sm text-gray-500">{w.matchType} Matches &middot; <span className={`font-semibold ${w.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>{w.status}</span></p>
                      </td>
                      <td className="p-4 font-black text-xl text-green-700">${w.prizeAmount}</td>
                      <td className="p-4">
                                                {w.proofImage ? <a href={w.proofImage.startsWith('http') ? w.proofImage : `${globalThis.API_URL.replace('/api', '')}${w.proofImage}`} target="_blank" className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded font-bold text-xs hover:bg-blue-100">View File</a> : <span className="text-gray-400 text-sm italic">Pending</span>}

                      </td>
                      <td className="p-4 flex gap-2 justify-end items-center h-full">
                        {w.status === 'Pending Review' && w.proofImage && (
                          <>
                            <button onClick={() => updateWinningStatus(w._id, 'Approved')} className="text-green-600 bg-green-50 hover:bg-green-100 p-2 rounded -lg font-bold transition tooltip" title="Approve"><CheckCircle size={20} /></button>
                            <button onClick={() => updateWinningStatus(w._id, 'Rejected')} className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg font-bold transition tooltip" title="Reject"><XCircle size={20} /></button>
                          </>
                        )}
                        {w.status === 'Approved' && (
                          <button onClick={() => updateWinningStatus(w._id, 'Paid')} className="bg-blue-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700">Flag Paid</button>
                        )}
                        {w.status === 'Paid' && <span className="text-gray-400 font-bold block pr-4">Resolved</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= USERS TAB ================= */}
        {activeTab === 'Users' && (
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-black mb-6">User Telemetry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.users.map(u => (
                <div key={u._id} className={`p-5 rounded-xl border ${u.isSubscribed ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-lg leading-tight">{u.name}<br /><span className="text-sm font-normal text-gray-500">{u.email}</span></p>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-black tracking-wider rounded ${u.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isSubscribed ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mt-4 text-sm border">
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Supported Charity</p>
                    <p className="font-semibold">{u.charity?.name || 'Unassigned'}</p>
                    <p className="text-green-700 font-black">{u.charityContributionPercentage}% Split</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CHARITIES TAB ================= */}
        {activeTab === 'Charities' && (
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <h3 className="text-xl font-black mb-4">Add Listing</h3>
                <form onSubmit={createCharity} className="space-y-4 bg-gray-50 p-6 rounded-xl border">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Name</label>
                    <input required className="w-full border-2 rounded-lg p-3 mt-1 focus:border-green-500 outline-none" value={newCharity.name} onChange={e => setNewCharity({ ...newCharity, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Description</label>
                    <textarea required className="w-full border-2 rounded-lg p-3 mt-1 h-32 focus:border-green-500 outline-none" value={newCharity.description} onChange={e => setNewCharity({ ...newCharity, description: e.target.value })} />
                  </div>
                  <button className="w-full bg-green-600 text-white font-black px-4 py-3 rounded-lg shadow hover:bg-green-700 transition">Register Entity</button>
                </form>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-black mb-4">Active Directories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.charities.map(c => (
                    <div key={c._id} className="border-2 border-gray-100 p-5 rounded-xl shadow-sm hover:shadow transition bg-white flex flex-col justify-between">
                      <div>
                        <p className="font-black text-lg mb-2">{c.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                      </div>
                      <button className="mt-4 text-xs font-bold text-green-600 hover:text-green-800 self-start border-b-2 border-green-200 hover:border-green-600 pb-0.5 transition">Manage Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= RECORDS TAB ================= */}
        {activeTab === 'Records' && (
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-black mb-6">Historical Draw Records</h3>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left bg-white">
                <thead className="bg-gray-50 text-gray-600 text-sm font-bold border-b tracking-wide">
                  <tr>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Winning Numbers</th>
                    <th className="p-4">Prize Pool</th>
                    <th className="p-4">Winners</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {!data.history || data.history.length === 0 ? (
                    <tr><td colSpan="4" className="p-12 text-center text-gray-400 italic">No historical records found.</td></tr>
                  ) : data.history.map(h => (
                    <tr key={h._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{new Date(h.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(h.date).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {h.numbers.map((n, idx) => (
                            <span key={idx} className="w-7 h-7 flex items-center justify-center bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-black">{n}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-green-700">${h.prizePool?.total}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Total Distributed</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <div><p className="font-bold">{h.stats?.match5}</p><p className="text-[10px] uppercase text-gray-400">Match 5</p></div>
                          <div><p className="font-bold">{h.stats?.match4}</p><p className="text-[10px] uppercase text-gray-400">Match 4</p></div>
                          <div><p className="font-bold">{h.stats?.match3}</p><p className="text-[10px] uppercase text-gray-400">Match 3</p></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Dirty Style Injection for horizontal scrolling config */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
