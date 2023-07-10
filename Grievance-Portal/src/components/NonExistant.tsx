import { useContext } from "react";
import { AdminNavbar, Navbar } from ".";
import { error404 } from "../assets";
import { context } from "../context";

const NonExistant = () => {
    const { empNo } = useContext(context);

    return (
        <div className="">
            {!localStorage.getItem("accessToken") ? null : empNo ? <AdminNavbar /> : <Navbar />}
            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="flex text-xl md:text-3xl items-center justify-center"> Sorry! This page doesn't exists</div> 
                <img src={error404} alt="not found" className="w-72 h-72 md:w-96 md:h-96"/>     
            </div>
        </div>
    )
}

export default NonExistant;