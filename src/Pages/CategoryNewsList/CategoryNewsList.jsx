import { Link, useLoaderData } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

const CategoryNewsList = () => {
    const menu = useLoaderData();
    const { name, link } = menu;

    const [categoryNews, setCategoryNews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/news/${link}`)
            .then(res => res.json())
            .then(data => setCategoryNews(data));
    }, [link]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/purchase-invoice/${id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            Swal.fire('Deleted!', 'The news item has been deleted.', 'success');
                            setCategoryNews(prev => prev.filter(item => item._id !== id));
                        }
                    });
            }
        });
    };

    return (
        <div className="pt-14 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto py-10 px-4 bg-white shadow-md rounded-lg">
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
                                <th className="py-3 px-4 border-b text-center">Edit</th>
                                <th className="py-3 px-4 border-b text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {
                                categoryNews.map((news, idx) => (
                                    <tr key={news._id} className="hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 border-b">{idx + 1}</td>
                                        <td className="py-3 px-4 border-b">{news.headline}</td>
                                        <td className="py-3 px-4 border-b">{news.date}</td>
                                        <td className="py-3 px-4 border-b">
                                            <img src={news.cover} alt="cover" className="w-16 h-auto rounded-md" />
                                        </td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <Link to={`/`} className="text-green-600 hover:text-green-800 text-xl">
                                                <FaRegEdit />
                                            </Link>
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
        </div>
    );
};

export default CategoryNewsList;
