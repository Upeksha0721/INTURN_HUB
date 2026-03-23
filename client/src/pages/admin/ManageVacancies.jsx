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
        title: '',
        company: '',
        description: '',
        location: '',
        deadline: '',
        skills: [],
        salary: '',
        jobType: 'Internship'
    });
    const [editLoading, setEditLoading] = useState(false);

    // Delete State
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVacancyId, setSelectedVacancyId] = useState(null);

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getVacancies();
            setVacancies(res.data);
        } catch (err) {
            console.error('Fetch vacancies error:', err);
            setError('Failed to fetch vacancies');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedVacancyId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setDeletingId(selectedVacancyId);
            setError('');
            setSuccess('');

            await deleteVacancy(selectedVacancyId);

            setSuccess('Vacancy deleted successfully');
            setVacancies(vacancies.filter((v) => v._id !== selectedVacancyId));

            setShowDeleteModal(false);
            setSelectedVacancyId(null);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Delete vacancy error:', err);
            setError('Unable to delete the vacancy right now. Please try again.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedVacancyId(null);
    };

    const openEditModal = (vacancy) => {
        setEditingVacancy(vacancy);
        setEditForm({
            title: vacancy.title,
            company: vacancy.company,
            description: vacancy.description || '',
            location: vacancy.location || '',
            deadline: vacancy.deadline
                ? new Date(vacancy.deadline).toISOString().split('T')[0]
                : '',
            skills: vacancy.skills || [],
            salary: vacancy.salary || '',
            jobType: vacancy.jobType || 'Internship'
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setEditLoading(true);
            setError('');
            setSuccess('');

            const res = await updateVacancy(editingVacancy._id, editForm);
            setSuccess('Vacancy updated successfully');
            setVacancies(
                vacancies.map((v) =>
                    v._id === editingVacancy._id ? res.data : v
                )
            );
            setEditingVacancy(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Update vacancy error:', err);
            setError('Failed to update vacancy');
            setTimeout(() => setError(''), 3000);
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
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        💼 Manage Vacancies
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review, update or remove existing internship postings.
                    </p>
                </div>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm flex items-center gap-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <p className="text-green-700 font-medium">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm flex items-center gap-3">
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
                            <th className="px-6 py-4">Uploaded Date</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {vacancies.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-12 text-center text-gray-400"
                                >
                                    No vacancies found.
                                </td>
                            </tr>
                        ) : (
                            vacancies.map((v) => (
                                <tr
                                    key={v._id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 line-clamp-1">
                                            {v.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {v.company}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-gray-400">📍</span>
                                            {v.location || 'Remote'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-gray-400">⏳</span>
                                            {v.deadline
                                                ? new Date(v.deadline).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-gray-400">📅</span>
                                            {v.createdAt
                                                ? new Date(v.createdAt).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(v)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-all"
                                                title="Edit Vacancy"
                                            >
                                                <span>✏️</span>
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(v._id)}
                                                disabled={deletingId === v._id}
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-all ${
                                                    deletingId === v._id
                                                        ? 'opacity-60 cursor-not-allowed'
                                                        : ''
                                                }`}
                                                title="Delete Vacancy"
                                            >
                                                <span>🗑️</span>
                                                <span>
                                                    {deletingId === v._id
                                                        ? 'Deleting...'
                                                        : 'Delete'}
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {editingVacancy && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Vacancy
                            </h2>
                            <button
                                onClick={() => setEditingVacancy(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.title}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                title: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.company}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                company: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                location: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={editForm.deadline}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                deadline: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={editForm.description}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                description: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Required Skills (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, React, Node.js"
                                        value={
                                            Array.isArray(editForm.skills)
                                                ? editForm.skills.join(', ')
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                skills: e.target.value
                                                    .split(',')
                                                    .map((s) => s.trim())
                                                    .filter((s) => s)
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Salary
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., $50,000 - $70,000"
                                        value={editForm.salary}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                salary: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Job Type
                                    </label>
                                    <select
                                        value={editForm.jobType}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                jobType: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    >
                                        <option value="Internship">Internship</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                    </select>
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

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Confirm Delete
                            </h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete this vacancy?
                            </p>
                        </div>

                        <div className="px-6 pb-6 flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={deletingId === selectedVacancyId}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deletingId === selectedVacancyId ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}