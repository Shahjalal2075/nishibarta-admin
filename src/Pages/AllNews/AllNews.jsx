import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllNews = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState({ headline: '', journalist: '', category: '', status: '' });

  const [viewModalData, setViewModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', headline: '', journalist: '', details: '', cover: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get('https://nishibarta-server.vercel.app/news')
      .then(res => {
        const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(sortedData);
        setFilteredNews(sortedData);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const filtered = news.filter(item =>
      item.headline.toLowerCase().includes(search.headline.toLowerCase()) &&
      (item.journalist || '').toLowerCase().includes(search.journalist.toLowerCase()) &&
      (search.category === '' || item.category === search.category) &&
      (search.status === '' || item.status === search.status)
    );
    setFilteredNews(filtered);
  };

  const handleReset = () => {
    setSearch({ headline: '', journalist: '', category: '', status: '' });
    setFilteredNews(news);
  };

  const handleEditClick = (item) => {
    setEditForm({
      date: item.date.slice(0, 10),
      headline: item.headline,
      journalist: item.journalist || '',
      details: item.details,
      cover: item.cover
    });
    setEditModalData(item);
  };

  const handleEditSubmit = () => {
    const updated = {
      ...editForm,
      detailsView: editForm.details.replace(/\\n/g, '\n'),
    };
    const updated2 = {
      ...editModalData,
      ...editForm,
      detailsView: editForm.details.replace(/\\n/g, '\n'),
    };

    axios.patch(`https://nishibarta-server.vercel.app/news/edit/${editModalData._id}`, updated)
      .then(() => {
        const updatedList = news.map(item => item._id === editModalData._id ? updated2 : item);
        setNews(updatedList);
        setFilteredNews(updatedList);
        setEditModalData(null);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=abbd3168fe4bef8335f1b5da9bf4eb5e',
        formData
      );
      const url = response.data.data.url;
      setEditForm({ ...editForm, cover: url });
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Image upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const categories = [...new Set(news.map(n => n.category))];
  const statuses = [...new Set(news.map(n => n.status))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4101d8]"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All News</h2>

      {/* Search Section */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search Headline"
          className="border p-2"
          value={search.headline}
          onChange={e => setSearch({ ...search, headline: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search Journalist"
          className="border p-2"
          value={search.journalist}
          onChange={e => setSearch({ ...search, journalist: e.target.value })}
        />
        <select
          className="border p-2"
          value={search.category}
          onChange={e => setSearch({ ...search, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border p-2"
          value={search.status}
          onChange={e => setSearch({ ...search, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {statuses.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Cover</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Headline</th>
              <th className="border p-2">Journalist</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map(item => (
              <tr key={item._id}>
                <td className="border p-2"><img src={item.cover} alt="cover" className="w-16 h-12 object-cover" /></td>
                <td className="border p-2">{item.categoryBn}</td>
                <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="border p-2">{item.headline}</td>
                <td className="border p-2">{item.journalist || 'N/A'}</td>
                <td className="border p-2">{item.status}</td>
                <td className="border p-2">
                  <div className="flex justify-between gap-1">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-[#0c87b8] text-white px-4 py-1 rounded"
                    >Edit</button>
                    <button
                      onClick={() => setViewModalData(item)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >View</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredNews.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No data found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModalData && (
        <div className="fixed inset-0 bg-[#111c] flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-3xl max-h-[calc(100vh-100px)] overflow-y-auto relative mx-[50px] my-[50px]">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={() => setViewModalData(null)}>&times;</button>
            <img src={viewModalData.cover} alt="cover" className="w-full mb-4 rounded" />
            <h3 className="text-xl font-bold mb-2">{viewModalData.headline}</h3>
            {viewModalData.details.split('/n').map((para, index) => (
              <p key={index} className="whitespace-pre-line text-justify ">{para.trim()}</p>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-[#111c] flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl max-h-[calc(100vh-100px)] overflow-y-auto relative mx-[50px] my-[50px]">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={() => setEditModalData(null)}>&times;</button>
            <h3 className="text-xl font-bold mb-4">Edit News</h3>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full border p-2"
                value={editForm.date}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
              />
              <input
                type="text"
                className="w-full border p-2"
                placeholder="Headline"
                value={editForm.headline}
                onChange={e => setEditForm({ ...editForm, headline: e.target.value })}
              />
              <input
                type="text"
                className="w-full border p-2"
                placeholder="Journalist"
                value={editForm.journalist}
                onChange={e => setEditForm({ ...editForm, journalist: e.target.value })}
              />
              <textarea
                rows="6"
                className="w-full border p-2"
                placeholder="Details"
                value={editForm.details}
                onChange={e => setEditForm({ ...editForm, details: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border p-2 w-full"
              />
              {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
              {editForm.cover && (
                <img src={editForm.cover} alt="Preview" className="w-full h-48 object-cover mt-2 rounded" />
              )}
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllNews;
