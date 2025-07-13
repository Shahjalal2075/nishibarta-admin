import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../Providers/AuthProvider";

const NewsAdd = () => {
    const { userDetails } = useContext(AuthContext);
    const menu = useLoaderData();
    const { name, link } = menu;

    const [details, setDetails] = useState("");
    const [detailsView, setDetailsView] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const navigate = useNavigate();

    const handleDetailsChange = (e) => {
        const value = e.target.value;
        setDetailsView(value);
        setDetails(value.replace(/\r?\n/g, "/n"));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=abbd3168fe4bef8335f1b5da9bf4eb5e`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Failed to upload image to ImgBB');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!coverFile) return;
        const form = e.target;

        try {
            const url = await uploadToImgBB(coverFile);
            const news = {
                category: link,
                categoryBn: name,
                date: new Date().toISOString(),
                headline: form.headline.value,
                details: details,
                detailsView: detailsView,
                cover: url,
                isTopHead: false,
                isTopNews: false,
                journalist: userDetails.idNo,
                status: "Pending",
                operationBy: "",
                operationTime: "",
                deleteStatus: "None",
                deletedBy: "",
                deletedTime: "",
            };

            const res = await fetch("https://nishibarta-server.vercel.app/news", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(news)
            });

            if (res.ok) {
                toast.success("News added successfully!");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                toast.error("Failed to add news to server");
            }

        } catch (error) {
            console.error("Error adding news:", error);
            toast.error("An error occurred while adding news");
        }
    };

    return (
        <div className="bg-gray-100 pt-10 min-h-screen">
            <form onSubmit={handleAddProduct} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-purple-900 mb-6">{name}</h2>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Headline</label>
                    <input
                        required
                        type="text"
                        name="headline"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Details</label>
                    <textarea
                        required
                        name="details"
                        value={detailsView}
                        onChange={handleDetailsChange}
                        className="w-full px-4 py-2 h-40 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-2">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {coverPreview && (
                        <img
                            src={coverPreview}
                            alt="Cover Preview"
                            className="mt-3 w-auto h-20 rounded border"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-800 transition duration-300"
                >
                    Add News
                </button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default NewsAdd;
