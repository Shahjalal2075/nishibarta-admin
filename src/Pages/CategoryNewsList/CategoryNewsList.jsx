import { Link, useLoaderData } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Providers/AuthProvider";

const CategoryNewsList = () => {

    const { userDetails } = useContext(AuthContext);
    const menu = useLoaderData();
    const { name, link } = menu;
    const [modalData, setModalData] = useState(null);

    const [categoryNews, setCategoryNews] = useState([]);

    useEffect(() => {
        axios.get(`https://nishibarta-server.vercel.app/news/${link}/${userDetails.idNo}`)
            .then(res => {
                const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setCategoryNews(sortedData);
            });
    }, [link, userDetails.idNo]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Update Status',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        }).then(async (result) => {
            let selected = null;
            if (result.isConfirmed) selected = 'Deleted';

            if (selected) {
                const confirm = await Swal.fire({
                    title: `Are you sure to ${selected.toLowerCase()} this news?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Confirm',
                });

                if (confirm.isConfirmed) {
                    try {
                        await axios.patch(`https://nishibarta-server.vercel.app/delete-news/${id}`, { deleteStatus: selected, deletedBy: userDetails.idNo, deletedTime: new Date().toISOString() });
                        setCategoryNews(prev => prev.filter(item => item._id !== id));
                        Swal.fire({
                            icon: selected === 'Deleted' ? 'success' : 'error',
                            title: selected === 'Deleted' ? 'Deleted!' : 'Rejected!',
                            text: `The news has been ${selected.toLowerCase()}.`,
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

    return (
        <div className="pt-14 min-h-screen">
            <div className="py-10 px-4 bg-white shadow-lg border border-[#3b4aaf28] rounded-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-purple-900">{name}</h2>
                    <Link to={`add`} className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-white hover:text-purple-700 border border-purple-700 transition">
                        Add News
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200 rounded-md">
                        <thead className="bg-gray-100 text-gray-700 font-semibold text-sm uppercase">
                            <tr>
                                <th className="py-3 px-4 border-b">SL</th>
                                <th className="py-3 px-4 border-b">Headline</th>
                                <th className="py-3 px-4 border-b">Publish Date</th>
                                <th className="py-3 px-4 border-b">Cover</th>
                                <th className="py-3 px-4 border-b">Status</th>
                                <th className="py-3 px-4 border-b text-center">View</th>
                                <th className="py-3 px-4 border-b text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {
                                categoryNews.map((news, idx) => (
                                    <tr key={news._id} className="hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 border-b">{idx + 1}</td>
                                        <td className="py-3 px-4 border-b">{news.headline}</td>
                                        <td className="py-3 px-4 border-b">{new Date(news.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 border-b">
                                            <img src={news.cover} alt="cover" className="w-16 h-auto rounded-md" />
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <div className="">
                                                <div className={`text-center px-3 py-1 rounded ${news.status === "Accept" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                                                    {news.status}
                                                </div>

                                            </div>
                                        </td>
                                        <td className="border-b p-2">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={() => setModalData(news)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <button
                                                onClick={() => handleDelete(news._id)}
                                                className="text-red-600 hover:text-red-800 text-xl"
                                            >
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
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
                            <p key={index} className="whitespace-pre-line text-justify ">{para.trim()}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryNewsList;
