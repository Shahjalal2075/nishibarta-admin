import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllNews = () => {

  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [search, setSearch] = useState({ headline: '', journalist: '', category: '', status: '' });
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/news')
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

      {/* Search/Filter Section */}
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

      {/* News Table */}
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
              <th className="border p-2">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map(item => (
              <tr key={item._id}>
                <td className="border p-2">
                  <img src={item.cover} alt="cover" className="w-16 h-12 object-cover" />
                </td>
                <td className="border p-2">{item.category}</td>
                <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="border p-2">{item.headline}</td>
                <td className="border p-2">{item.journalist || 'N/A'}</td>
                <td className="border p-2">{item.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => setModalData(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredNews.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No data found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => setModalData(null)}
            >
              &times;
            </button>
            <img src={modalData.cover} alt="cover" className="w-full mb-4 rounded" />
            <h3 className="text-xl font-bold mb-2">{modalData.headline}</h3>
            <p className="whitespace-pre-line">{modalData.detailsView}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllNews;
