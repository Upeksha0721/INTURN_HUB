import { useState, useEffect } from 'react';
import { getVacancies, updateVacancy, deleteVacancy } from '../../services/api';

export default function ManageVacancies() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Edit State
    const [editingVacancy, setEditingVacancy] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '', company: '', description: '', location: '', deadline: ''
    });
    const [editLoading, setEditLoading] = useState(false);

    // Delete State
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            setLoading(true);
            const res = await getVacancies();
            setVacancies(res.data);
        } catch (err) {
            setError('Failed to fetch vacancies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;

        try {
            setDeletingId(id);
            await deleteVacancy(id);
            setSuccess('Vacancy deleted successfully');
            setVacancies(vacancies.filter(v => v._id !== id));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete vacancy');
        } finally {
            setDeletingId(null);
        }
    };

    const openEditModal = (vacancy) => {
        setEditingVacancy(vacancy);
        setEditForm({
            title: vacancy.title,
            company: vacancy.company,
            description: vacancy.description || '',
            location: vacancy.location || '',
            deadline: vacancy.deadline ? new Date(vacancy.deadline).toISOString().split('T')[0] : ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setEditLoading(true);
            const res = await updateVacancy(editingVacancy._id, editForm);
            setSuccess('Vacancy updated successfully');
            setVacancies(vacancies.map(v => v._id === editingVacancy._id ? res.data : v));
            setEditingVacancy(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update vacancy');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">💼 Manage Vacancies</h1>
                    <p className="text-gray-500 mt-1">Review, update or remove existing internship postings.</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm flex items-center gap-3 animate-fade-in">
                    <span className="text-green-500 text-xl">✅</span>
                    <p className="text-green-700 font-medium">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm flex items-center gap-3 animate-fade-in">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Vacancy Details</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {vacancies.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                    No vacancies found.
                                </td>
                            </tr>
                        ) : (
                            vacancies.map((v) => (
                                <tr key={v._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 line-clamp-1">{v.title}</div>
                                        <div className="text-sm text-gray-500">{v.company}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-gray-400">📍</span> {v.location || 'Remote'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-gray-400">⏳</span> {v.deadline ? new Date(v.deadline).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(v)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Edit Vacancy"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v._id)}
                                                disabled={deletingId === v._id}
                                                className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${deletingId === v._id ? 'opacity-50' : ''}`}
                                                title="Delete Vacancy"
                                            >
                                                {deletingId === v._id ? '...' : '🗑️'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingVacancy && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Edit Vacancy</h2>
                            <button onClick={() => setEditingVacancy(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.company}
                                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={editForm.deadline}
                                        onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        rows="4"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingVacancy(null)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {editLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
