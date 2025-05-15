import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link } from 'react-router-dom';

const Home = () => {

    const { user} = useContext(AuthContext);
    const [loading,setLoading]=useState(false);

    const [menu, setMenu] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/admin-menu`)
            .then(res => res.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.sl - b.sl);
                setMenu(sortedData);
                setLoading(false);
            });
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4101d8]"></div>
            </div>
        );
    }

    return (
        <div className="pt-14">
            <div className="grid grid-cols-3 gap-6">
                {
                    menu.map(item =>
                        <Link key={item.link} to={`/${item.link}`} className="bg-[#3b4aaf] rounded-xl">
                            <h2 className=" text-center text-[#fff] py-6 text-3xl font-bold">{item.name}</h2>
                        </Link>)
                }

            </div>
        </div>
    );
};

export default Home;