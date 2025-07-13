import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { Link } from 'react-router-dom';

const Home = () => {
    const { userDetails } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    console.log(userDetails);

    const menuSA = [
        { name: "All Journalist", link: "journalist" },
        { name: "All News", link: "all-news" },
        { name: "Deleted News", link: "deleted-news" },
    ];

    const menuM = [
        { name: "Approved News", link: "approved-news" },
        { name: "Pending News", link: "pending-news" },
        { name: "Rejected News", link: "rejected-news" },
    ];

    const menu = [
        { name: "জাতীয়", link: "national" },
        { name: "যশোর", link: "jashore" },
        { name: "খুলনা", link: "khulna" },
        { name: "রাজনীতি", link: "politics" },
        { name: "খেলাধুলা", link: "sports" },
        { name: "আন্তর্জাতিক", link: "international" },
        { name: "বিনোদন", link: "entertainment" },
        { name: "চাকরি", link: "job" },
        { name: "অজানা", link: "ojana" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4101d8]"></div>
            </div>
        );
    }

    const getVisibleMenus = () => {
        if (!userDetails?.role) return [];

        if (userDetails.role === 'Agent') {
            return [...menu];
        } else if (userDetails.role === 'Moderator') {
            return [...menuM, ...menu];
        } else if (userDetails.role === 'Admin') {
            return [...menuSA, ...menuM, ...menu];
        } else {
            return [];
        }
    };

    const visibleMenus = getVisibleMenus();

    return (
        <div className="py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    visibleMenus.map(item =>
                        <Link key={item.link} to={`/${item.link}`} className="bg-[#3b4aaf] rounded-xl">
                            <h2 className="text-center text-[#fff] py-6 text-3xl font-bold">{item.name}</h2>
                        </Link>
                    )
                }
            </div>
        </div>
    );
};

export default Home;
