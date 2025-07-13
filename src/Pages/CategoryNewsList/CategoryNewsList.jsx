import { Link, useLoaderData } from "react-router-dom";
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
      if (result.isConfirmed) {
        const confirm = await Swal.fire({
          title: `Are you sure to delete this news?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Confirm',
        });

        if (confirm.isConfirmed) {
          try {
            await axios.patch(`https://nishibarta-server.vercel.app/delete-news/${id}`, {
              deleteStatus: 'Deleted',
              deletedBy: userDetails.idNo,
              deletedTime: new Date().toISOString()
            });
            setCategoryNews(prev => prev.filter(item => item._id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The news has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
          } catch (err) {
            Swal.fire('Failed', 'Something went wrong.', 'error');
          }
        }
      }
    });
  };

  return (
    <div className="pt-14 min-h-screen">
      <div className="py-10 px-4 bg-white shadow-lg border border-[#3b4aaf28] rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-purple-900">{name}</h2>
          <Link to={`add`} className="px-4 py-2 rounded-md bg-purple-700 text-white hover:bg-white hover:text-purple-700 border border-purple-700 transition">
            Add News
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto hidden md:block">
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
              {categoryNews.map((news, idx) => (
                <tr key={news._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b">{idx + 1}</td>
                  <td className="py-3 px-4 border-b">{news.headline}</td>
                  <td className="py-3 px-4 border-b">{new Date(news.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b">
                    <img src={news.cover} alt="cover" className="w-16 h-auto rounded-md" />
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className={`text-center px-3 py-1 rounded ${news.status === "Accept" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                      {news.status}
                    </div>
                  </td>
                  <td className="border-b p-2 text-center">
                    <button
                      onClick={() => setModalData(news)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {categoryNews.map((news, idx) => (
            <div key={news._id} className="border border-gray-200 rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{news.headline}</h3>
                <span className={`text-xs px-2 py-1 rounded ${news.status === "Accept" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                  {news.status}
                </span>
              </div>
              <img src={news.cover} alt="cover" className="w-full h-40 object-cover rounded mb-2" />
              <p className="text-sm text-gray-600 mb-1">Date: {new Date(news.date).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => setModalData(news)} className="flex-1 bg-green-500 text-white py-1 rounded text-sm">View</button>
                <button onClick={() => handleDelete(news._id)} className="flex-1 bg-red-500 text-white py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-[#111c] flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-3xl w-full max-h-[calc(100vh-100px)] overflow-y-auto relative mx-3 md:mx-[50px] md:my-[50px]">
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

export default CategoryNewsList;
