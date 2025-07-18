import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Providers/AuthProvider';

const DeletedNews = () => {

    const { userDetails } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        axios.get('https://nishibarta-server.vercel.app/news')
            .then(res => {
                const pendingData = res.data
                    .filter(item => item.deleteStatus !== 'None')
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                setNews(pendingData);
                setLoading(false);
            });
    }, []);

    const handleStatusAction = (id) => {
        Swal.fire({
            title: 'Update Status',
            showCancelButton: true,
            confirmButtonText: 'Restore',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then(async (result) => {
            let selected = null;
            if (result.isConfirmed) selected = 'Restore';

            if (selected) {
                const confirm = await Swal.fire({
                    title: `Are you sure to ${selected.toLowerCase()} this news?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Confirm',
                });

                if (confirm.isConfirmed) {
                    try {
                        await axios.patch(`https://nishibarta-server.vercel.app/delete-news/${id}`, { deleteStatus: 'None', deletedBy: userDetails.username, deletedTime: new Date().toISOString() });
                        setNews(prev => prev.filter(item => item._id !== id));
                        Swal.fire({
                            icon: 'success',
                            title: 'Restored!',
                            text: `The news has been restored.`,
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } catch (err) {
                        Swal.fire('Failed', 'Something went wrong while updating status.', 'error');
                    }
                }
            }
        });
    };

    if (userDetails?.role !== 'Admin') {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4101d8]"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Deleted News</h2>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Cover</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Headline</th>
                            <th className="border p-2">Journalist</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map(item => (
                            <tr key={item._id}>
                                <td className="border p-2">
                                    <img src={item.cover} alt="cover" className="w-16 h-12 object-cover mx-auto" />
                                </td>
                                <td className="border p-2">{item.categoryBn}</td>
                                <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="border p-2">{item.headline}</td>
                                <td className="border p-2">{item.journalist || 'N/A'}</td>
                                <td className="border p-2">
                                    <button
                                        className="bg-red-400 text-white px-3 py-1 rounded font-semibold"
                                        onClick={() => handleStatusAction(item._id)}
                                    >
                                        Deleted
                                    </button>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => setModalData(item)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {news.length === 0 && (
                            <tr><td colSpan="7" className="text-center py-4">No news</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {news.map(item => (
                    <div key={item._id} className="border rounded p-4 shadow">
                        <img src={item.cover} alt="cover" className="w-full h-40 object-cover rounded mb-2" />
                        <h3 className="text-lg font-bold mb-1">{item.headline}</h3>
                        <p><strong>Category:</strong> {item.categoryBn}</p>
                        <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                        <p><strong>Journalist:</strong> {item.journalist || 'N/A'}</p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => handleStatusAction(item._id)}
                                className="flex-1 bg-red-400 text-white px-3 py-1 rounded font-semibold"
                            >
                                Deleted
                            </button>
                            <button
                                onClick={() => setModalData(item)}
                                className="flex-1 bg-green-500 text-white px-3 py-1 rounded"
                            >
                                View
                            </button>
                        </div>
                    </div>
                ))}
                {news.length === 0 && (
                    <p className="text-center py-4">No news</p>
                )}
            </div>

            {/* Modal */}
            {modalData && (
                <div className="fixed inset-0 bg-[#111c] flex justify-center items-center z-50">
                    <div className="bg-white rounded p-6 w-full max-w-3xl max-h-[calc(100vh-100px)] overflow-y-auto relative mx-[50px] my-[50px]">
                        <button
                            className="absolute top-2 right-2 text-xl font-bold"
                            onClick={() => setModalData(null)}
                        >
                            &times;
                        </button>
                        <img src={modalData.cover} alt="cover" className="w-full mb-4 rounded" />
                        <h3 className="text-xl font-bold mb-2">{modalData.headline}</h3>
                        {modalData.details.split('/n').map((para, index) => (
                            <p key={index} className="whitespace-pre-line text-justify">{para.trim()}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeletedNews;
