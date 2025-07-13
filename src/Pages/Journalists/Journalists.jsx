import { useEffect, useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import JournalistCard from '../SharedSection/JournalistCard/JournalistCard';

const Journalists = () => {
    const [journalists, setJournalists] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [filters, setFilters] = useState({
        username: '',
        email: '',
        phone: '',
        city: '',
        level: '',
    });

    const [formData, setFormData] = useState({
        profile: '',
        name: '',
        email: '',
        username: '',
        phone: '',
        address: '',
        city: '',
        division: '',
        country: '',
        nidNo: '',
        blood: '',
        level: '',
        joinDate: '',
        profession: '',
        dob: '',
        role: 'Admin',
        isBan: false,
        idNo: '',
        password: ''
    });

    // Fetch journalists
    useEffect(() => {
        fetch('https://nishibarta-server.vercel.app/user-list')
            .then(res => res.json())
            .then(data => {
                setJournalists(data);
                setFiltered(data);
            });
    }, []);

    const generateUniqueId = () => {
        let id;
        do {
            id = 'NB-' + Math.floor(100000 + Math.random() * 900000);
        } while (journalists.find(j => j.idNo === id));
        return id;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        const result = journalists.filter((j) =>
            Object.entries(filters).every(([key, value]) =>
                j[key]?.toLowerCase().includes(value.toLowerCase())
            )
        );
        setFiltered(result);
    };

    const handleReset = () => {
        setFilters({
            username: '',
            email: '',
            phone: '',
            city: '',
            level: '',
        });
        setFiltered(journalists);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const form = new FormData();
        form.append('image', file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=abbd3168fe4bef8335f1b5da9bf4eb5e`, {
                method: 'POST',
                body: form
            });

            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, profile: data.data.url }));
            } else {
                alert('❌ Failed to upload image.');
            }
        } catch (err) {
            alert('❌ Error uploading image.');
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = async () => {
        const { email, username, phone, nidNo } = formData;
        const isDuplicate = journalists.some(j =>
            j.email === email || j.username === username || j.phone === phone || j.nidNo === nidNo
        );

        if (isDuplicate) {
            alert('❌ Email, Username, Phone, or NID already exists.');
            return;
        }

        const newJournalist = {
            ...formData,
            idNo: generateUniqueId(),
            isBan: false,
        };

        try {
            const res = await fetch('https://nishibarta-server.vercel.app/user-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJournalist),
            });

            if (res.ok) {
                alert('✅ Journalist added successfully!');
                setShowModal(false);
                const updated = await fetch('https://nishibarta-server.vercel.app/user-list').then(res => res.json());
                setJournalists(updated);
                setFiltered(updated);
            } else {
                alert('❌ Failed to add journalist.');
            }
        } catch (err) {
            alert('❌ Server error.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-pink-50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">📋 Journalist Directory</h2>
                <button
                    className="flex gap-1 items-center bg-gradient-to-r from-[#3b4aaf] to-[#3b4aaf] text-white px-4 py-2 rounded-lg text-base font-medium shadow hover:opacity-90 transition"
                    onClick={() => {
                        setFormData({
                            profile: '',
                            name: '',
                            email: '',
                            username: '',
                            phone: '',
                            address: '',
                            city: '',
                            division: '',
                            country: '',
                            nidNo: '',
                            blood: '',
                            level: '',
                            joinDate: '',
                            profession: '',
                            dob: '',
                            role: 'Intern',
                            isBan: false,
                            idNo: '',
                            password: ''
                        });
                        setShowModal(true);
                    }}
                >
                    <TiPlus className="font-extrabold text-xl" /> Add Journalist
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {['username', 'email', 'phone', 'city', 'level'].map((field) => (
                        <input
                            key={field}
                            type="text"
                            name={field}
                            value={filters[field]}
                            onChange={handleInputChange}
                            placeholder={`Search ${field}`}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    ))}
                    <div className="flex justify-end gap-4 items-center">
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Journalist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-full">No journalists found.</p>
                ) : (
                    filtered.map((j, idx) => <JournalistCard key={idx} j={j} />)
                )}
            </div>

            {/* Add Journalist Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#11111190] flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 space-y-4">
                        <h3 className="text-xl font-bold">➕ Add Journalist</h3>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
                            {[
                                'name', 'email', 'username', 'phone', 'address',
                                'city', 'division', 'country', 'nidNo', 'blood', 'level',
                                'joinDate', 'profession', 'dob', 'password'
                            ].map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    type="text"
                                    value={formData[field]}
                                    onChange={handleFormChange}
                                    placeholder={field}
                                    className="border px-3 py-2 rounded"
                                />
                            ))}
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                                className="border px-3 py-2 rounded"
                            >
                                {['Admin', 'Moderator', 'Agent', 'Intern'].map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        {/* Profile Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="border px-3 py-2 rounded w-full"
                            />
                            {uploading ? (
                                <p className="text-sm text-blue-600">Uploading image...</p>
                            ) : formData.profile && (
                                <img src={formData.profile} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2" />
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleFormSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Journalists;
