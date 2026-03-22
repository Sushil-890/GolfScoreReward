import { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Trash2, Edit } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const role = localStorage.getItem('role') || 'user';
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${globalThis.API_URL}/announcements`, { headers });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`${globalThis.API_URL}/announcements/${editingId}`, formData, { headers });
      } else {
        await axios.post(`${globalThis.API_URL}/announcements`, formData, { headers });
      }
      setFormData({ title: '', content: '' });
      setEditingId(null);
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ann) => {
    setEditingId(ann._id);
    setFormData({ title: ann.title, content: ann.content });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`${globalThis.API_URL}/announcements/${id}`, { headers });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border-t-4 border-green-600 flex items-center gap-6">
        <div className="bg-green-100 p-4 rounded-2xl text-green-600">
          <Megaphone size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Platform Announcements</h2>
          <p className="text-gray-500 font-semibold mt-1">Official updates, draw results, and community news.</p>
        </div>
      </div>

      {/* Admin Controls */}
      {role === 'admin' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Announcement' : 'Post New Announcement'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                required 
                placeholder="Announcement Title" 
                className="w-full border-2 rounded-lg p-3 outline-none focus:border-green-500 transition"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <textarea 
                required 
                placeholder="Write your update here..." 
                className="w-full border-2 rounded-lg p-3 h-32 outline-none focus:border-green-500 transition"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Publish'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({title:'', content:''}); }} className="bg-gray-200 text-gray-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No announcements yet. Check back later!</div>
        ) : announcements.map(ann => (
          <div key={ann._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group transition hover:shadow-md">
            
            {/* Admin action buttons on hover */}
            {role === 'admin' && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleEdit(ann)} className="bg-gray-100 p-2 rounded hover:bg-green-100 hover:text-green-600 text-gray-500 transition"><Edit size={16}/></button>
                <button onClick={() => handleDelete(ann._id)} className="bg-gray-100 p-2 rounded hover:bg-red-100 hover:text-red-600 text-gray-500 transition"><Trash2 size={16}/></button>
              </div>
            )}

            <h4 className="text-xl font-black text-gray-900 pr-20">{ann.title}</h4>
            <p className="text-sm font-semibold text-green-600 mb-4">{new Date(ann.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
