import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../public/Landing';

interface FormData {
  brandName: string;
  website: string;
  category: string;
  email: string;
  description: string;
}

const ProviderRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    website: '',
    category: '',
    email: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Provider request submitted! Admin will review and grant access.');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <button onClick={() => navigate(-1)} className="text-sm text-neutral-500 mb-8">
            ← Back to landing page
          </button>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">Partner with us</p>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Provider Request</h1>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                Submit your brand details below. spireeze is a curated platform, and we only partner with brands that share our values of quality, design, and privacy.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="Brand Name"
                  required
                  className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website URL"
                  type="url"
                  required
                  className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Primary Category"
                required
                className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Contact Email"
                type="email"
                required
                className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your brand"
                rows={5}
                required
                className="w-full px-6 py-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              />

              <button
                type="submit"
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-wider text-sm hover:opacity-90 transition"
              >
                Submit Request
              </button>

              <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
                Privacy Protected Submission
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderRequestForm;