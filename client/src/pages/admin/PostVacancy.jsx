import { useState, useEffect } from 'react';

const VACANCY_API = 'http://localhost:5002/api/vacancies';

const INITIAL_FORM = {
  title: '',
  company: '',
  description: '',
  location: '',
  deadline: '',
  imageUrl: '',
  salary: '',
  jobType: 'Internship',
  skills: ''
};

const stripCommas = (value) => value.replace(/,/g, '');

const validateSalary = (value) => {
  if (!value) return '';

  const cleanValue = stripCommas(value);
  const [integerPart = '', decimalPart] = cleanValue.split('.');

  if (!/^\d+(\.\d{0,2})?$/.test(cleanValue)) {
    return 'Salary must be a valid number';
  }

  if (integerPart.length < 4) {
    return 'Salary must contain at least 4 digits';
  }

  if (integerPart.length > 6) {
    return 'Salary cannot exceed 6 digits';
  }

  if (decimalPart && decimalPart.length > 2) {
    return 'Salary can have at most 2 decimal places';
  }

  return '';
};

const validateTitle = (value) => {
  if (!value.trim()) return 'Job title is required';

  // Check if it contains at least one letter
  if (!/[a-zA-Z]/.test(value)) {
    return 'Job title must contain letters';
  }

  // Check if it contains any numbers
  if (/\d/.test(value)) {
    return 'Job title cannot contain numbers';
  }

  return '';
};

const validateCompany = (value) => {
  if (!value.trim()) return 'Company name is required';

  // Check if it contains at least one letter
  if (!/[a-zA-Z]/.test(value)) {
    return 'Company name must contain letters';
  }

  // Check if it contains any numbers
  if (/\d/.test(value)) {
    return 'Company name cannot contain numbers';
  }

  return '';
};

const validateLocation = (value) => {
  if (!value.trim()) return 'Location is required';

  // Check if it contains letters or numbers
  if (!/[a-zA-Z0-9]/.test(value)) {
    return 'Location must contain letters or numbers';
  }

  // Check for special symbols (excluding common separators like comma, space, dash, period)
  if (/[^a-zA-Z0-9\s,\-\.]/.test(value)) {
    return 'Location cannot contain special symbols';
  }

  return '';
};

const formatSalaryDisplay = (value, isFocused) => {
  if (!value) return '';

  const cleanValue = stripCommas(value);
  const hasDecimal = cleanValue.includes('.');
  const endsWithDot = cleanValue.endsWith('.');
  const [integerPart = '', decimalPart = ''] = cleanValue.split('.');

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (isFocused) {
    if (endsWithDot) {
      return `${formattedInteger}.`;
    }

    if (hasDecimal) {
      return `${formattedInteger}.${decimalPart}`;
    }

    return formattedInteger;
  }

  if (!hasDecimal) {
    return `${formattedInteger}.00`;
  }

  if (endsWithDot) {
    return `${formattedInteger}.`;
  }

  return `${formattedInteger}.${decimalPart}`;
};

const normalizeSalaryForSubmit = (value) => {
  if (!value) return '';

  const cleanValue = stripCommas(value);

  if (!cleanValue.includes('.')) {
    return `${cleanValue}.00`;
  }

  return cleanValue;
};

export default function PostVacancy() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentVacancies, setRecentVacancies] = useState([]);
  const [salaryError, setSalaryError] = useState('');
  const [salaryFocused, setSalaryFocused] = useState(false);
  const [salaryTouched, setSalaryTouched] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [locationError, setLocationError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(VACANCY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRecentVacancies(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch vacancies');
      }
    };

    fetchRecent();
  }, [success, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxWidth = 800;
      const ratio = Math.min(maxWidth / img.width, 1);

      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressed = canvas.toDataURL('image/jpeg', 0.6);
      setForm((prev) => ({ ...prev, imageUrl: compressed }));
    };

    img.src = URL.createObjectURL(file);
  };

  const handleSalaryChange = (e) => {
    let value = e.target.value;

    setSalaryTouched(true);

    value = stripCommas(value);
    value = value.replace(/[^\d.]/g, '');

    const firstDotIndex = value.indexOf('.');
    if (firstDotIndex !== -1) {
      value =
        value.slice(0, firstDotIndex + 1) +
        value.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    const hasDot = value.includes('.');
    let [integerPart = '', decimalPart = ''] = value.split('.');

    if (integerPart.length > 1) {
      integerPart = integerPart.replace(/^0+/, '') || '0';
    }

    if (integerPart.length > 6) {
      integerPart = integerPart.slice(0, 6);
    }

    decimalPart = decimalPart.slice(0, 2);

    const normalizedValue = hasDot
      ? `${integerPart}.${decimalPart}`
      : integerPart;

    setForm((prev) => ({
      ...prev,
      salary: normalizedValue
    }));

    setSalaryError(validateSalary(normalizedValue));
  };

  const handleSalaryFocus = () => {
    setSalaryFocused(true);
  };

  const handleSalaryBlur = () => {
    setSalaryFocused(false);
    setSalaryTouched(true);

    const currentValue = form.salary;
    const currentError = validateSalary(currentValue);

    setSalaryError(currentError);

    if (!currentValue) return;

    if (!stripCommas(currentValue).includes('.')) {
      setForm((prev) => ({
        ...prev,
        salary: `${stripCommas(currentValue)}.00`
      }));
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, title: value });
    setTitleError(validateTitle(value));
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, company: value });
    setCompanyError(validateCompany(value));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, location: value });
    setLocationError(validateLocation(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const titleError = validateTitle(form.title);
    const companyError = validateCompany(form.company);
    const locationError = validateLocation(form.location);
    const salaryError = validateSalary(form.salary);

    setTitleError(titleError);
    setCompanyError(companyError);
    setLocationError(locationError);
    setSalaryError(salaryError);
    setSalaryTouched(true);

    // Check if any validation errors exist
    if (titleError || companyError || locationError || salaryError) {
      setError('Please correct the validation errors before submitting.');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...form,
        salary: form.salary ? normalizeSalaryForSubmit(form.salary) : '',
        skills: form.skills.split(',').map((s) => s.trim()).filter((s) => s)
      };

      const res = await fetch(VACANCY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess('Vacancy posted successfully!');
        setForm(INITIAL_FORM);
        setSalaryError('');
        setSalaryTouched(false);
        setSalaryFocused(false);
        setTitleError('');
        setCompanyError('');
        setLocationError('');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to post vacancy');
      }
    } catch (err) {
      setError('Failed to post vacancy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💼 Post New Vacancy</h1>
        <p className="text-gray-500 mt-1">Create a new internship vacancy for students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form - Left Side */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              ✅ {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Image <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
              />
              {form.imageUrl && (
                <div className="mt-2 relative">
                  <img
                    src={form.imageUrl}
                    alt="preview"
                    className="h-40 w-full object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Title & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer Intern"
                  value={form.title}
                  onChange={handleTitleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    titleError
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  required
                />
                {titleError && (
                  <p className="text-sm text-red-500 mt-1">{titleError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google Sri Lanka"
                  value={form.company}
                  onChange={handleCompanyChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    companyError
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  required
                />
                {companyError && (
                  <p className="text-sm text-red-500 mt-1">{companyError}</p>
                )}
              </div>
            </div>

            {/* Location & Job Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Colombo, Sri Lanka"
                  value={form.location}
                  onChange={handleLocationChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    locationError
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  required
                />
                {locationError && (
                  <p className="text-sm text-red-500 mt-1">{locationError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={form.jobType}
                  onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                </select>
              </div>
            </div>

            {/* Salary & Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45,000.00"
                  value={formatSalaryDisplay(form.salary, salaryFocused)}
                  onChange={handleSalaryChange}
                  onFocus={handleSalaryFocus}
                  onBlur={handleSalaryBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                    salaryTouched && salaryError
                      ? 'border-red-400 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                {salaryTouched && salaryError && (
                  <p className="text-sm text-red-500 mt-1">{salaryError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills <span className="text-gray-400">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe the internship role and requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Posting...
                </span>
              ) : (
                '🚀 Post Vacancy'
              )}
            </button>
          </form>
        </div>

        {/* Recent Vacancies - Right Side */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Recently Posted</h2>
          <p className="text-gray-400 text-sm mb-5">Last 5 vacancies uploaded</p>

          {recentVacancies.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">💼</div>
              <p className="text-sm">No vacancies yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentVacancies.map((v, index) => (
                <div
                  key={v._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{v.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      🕒 {new Date(v.createdAt).toLocaleDateString()}{' '}
                      {new Date(v.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="w-2 h-2 bg-orange-400 rounded-full shrink-0"></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}