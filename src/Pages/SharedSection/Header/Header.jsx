import { FaLocationDot } from "react-icons/fa6";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { MdOutlineDateRange } from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import { Link } from "react-router-dom";

const Header = () => {
    ;

    const currentDate = new Date();

    const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const week = weekNames[currentDate.getDay()];
    const month = monthNames[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const { userDetails, signOutUser } = useContext(AuthContext);

    const [isBtn, setIsBtn] = useState(true);

    const handleLogOutToggle = () => {
        setIsBtn(!isBtn);
    }

    const handleLogOut = () => {
        signOutUser()
            .then()
            .catch()
    }

    return (
        <div className="lg:flex justify-between mt-4 py-4 bg-[#3b4aaf] rounded-xl px-4 font-medium items-center grid grid-cols-2">
            <div className="lg:flex flex-col text-[#fff] hidden">
                <div className="flex gap-6">
                    <div className="flex gap-1 items-center">
                        <p><FaLocationDot /></p>
                        <p>Bangladesh</p>
                    </div>
                    <div className="flex gap-1 items-center">
                        <p><TiWeatherPartlySunny /></p>
                        <p>31°</p>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <p><MdOutlineDateRange /></p>
                    <p>Today ({week}, {date} {month}, {year})</p>
                </div>
            </div>
            <div className="flex justify-start lg:justify-center">
                <Link to={`/`}>
                    <img src="https://i.ibb.co/qyvRMH2/logolight.png" alt="Nishi Barta" />
                </Link>
            </div>
            <div className="flex md:gap-4 gap-2 items-center justify-end">
                <button className="md:ml-4" onClick={handleLogOutToggle}>
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                        <img
                            className="w-full h-full object-cover"
                            src={userDetails.profile}
                            alt="profile"
                        />
                    </div>
                </button>
                {
                    isBtn
                        ? <>
                            <p className="text-[#fff] font-medium md:hidden capitalize">
                                {userDetails.username.slice(0, 6)}
                            </p>
                            <p className="text-[#fff] font-medium hidden md:flex capitalize">
                                {userDetails.username}
                            </p>
                        </>
                        : <button className="font-bold text-[#ffffff]" onClick={handleLogOut}>Logout</button>
                }
            </div>


        </div>
    );
};

export default Header;