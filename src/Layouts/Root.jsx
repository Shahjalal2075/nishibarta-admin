import { Outlet } from "react-router-dom";
import Header from "../Pages/SharedSection/Header/Header";

const Root = () => {

    return (
        <div className="bg-[#fff] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-0">
                <Header></Header>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Root;