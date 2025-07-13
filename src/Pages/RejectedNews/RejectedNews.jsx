import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Providers/AuthProvider';

const RejectedNews = () => {
  const { userDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    axios.get('https://nishibarta-server.vercel.app/news')
      .then(res => {
        const rejectedData = res.data
          .filter(item => item.status === 'Reject' && item.deleteStatus === 'None')
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(rejectedData);
        setLoading(false);
      });
  }, []);

  const handleStatusAction = (id) => {
    Swal.fire({
      title: 'Delete this news?',
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
              deletedBy: userDetails.username,
              deletedTime: new Date().toISOString()
            });
            setNews(prev => prev.filter(item => item._id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The news has been deleted.',
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

  if (userDetails?.role === 'Agent') {
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
      <h2 className="text-xl font-bold mb-4">Rejected News</h2>

      {/* Table for Desktop */}
      <div className="overflow-x-auto hidden md:block">
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
                    onClick={() => handleStatusAction(item._id)}
                    className="bg-red-400 text-white px-3 py-1 rounded font-semibold"
                  >
                    Rejected
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
              <tr><td colSpan="7" className="text-center py-4">No rejected news</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="space-y-4 md:hidden">
        {news.map(item => (
          <div key={item._id} className="border rounded shadow p-3">
            <img src={item.cover} alt="cover" className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold text-lg">{item.headline}</h3>
            <p className="text-sm text-gray-600">Date: {new Date(item.date).toLocaleDateString()}</p>
            <p className="text-sm">Category: {item.categoryBn}</p>
            <p className="text-sm">Journalist: {item.journalist || 'N/A'}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleStatusAction(item._id)}
                className="flex-1 bg-red-400 text-white py-1 rounded"
              >
                Rejected
              </button>
              <button
                onClick={() => setModalData(item)}
                className="flex-1 bg-green-500 text-white py-1 rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-center py-4">No rejected news</p>
        )}
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-[#111c] flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-3xl max-h-[calc(100vh-80px)] overflow-y-auto relative mx-3 my-6">
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

export default RejectedNews;
