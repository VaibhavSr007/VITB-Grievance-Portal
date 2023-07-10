import { useContext, useState, useEffect } from "react";
import { context } from "../context"
import { close, menu } from "../assets";
import { useNavigate } from "react-router-dom";
import { UserIcon } from ".";


const AdminNavbar = () => {
    const [ isMenuShowing, setIsMenuShowing ] = useState(false);
    const [ isUserMenuShowing, setIsUserMenuShowing ] = useState(false);

    const { isSuperUser, currAdminPortal, setCurrAdminPortal } = useContext(context);
    const navigate = useNavigate();

    const navLinks = isSuperUser ? ["All Grievances", "Add Faculty", "Remove Users"] : ["All Grievances"];

    useEffect(() => {
        if (isMenuShowing && isUserMenuShowing)
            setIsUserMenuShowing(false);
    }, [isMenuShowing])

    useEffect(() => {
        if (isUserMenuShowing && isMenuShowing) 
            setIsMenuShowing(false);
    }, [isUserMenuShowing])

    function handleLinkChange(navLink: string) {
        if (window.location.pathname !== '/') 
            navigate('/');
        setCurrAdminPortal(navLink);
        setIsMenuShowing(false);
    }

    return (
        <div className="w-full">
            <div className="hidden md:flex justify-evenly items-center w-full fixed py-5 pl-5 pr-16 bg-[#3A98B9]">
                {navLinks.map((navLink, index) => (
                    <div key={index} onClick={() => handleLinkChange(navLink)} className={`${currAdminPortal === navLink ? "font-semibold" : ""} text-[#FFF1DC] text-xl hover:cursor-pointer w-1/3 text-center`}>{navLink}</div>
                ))}
                <UserIcon isUserMenuShowing={isUserMenuShowing} setIsUserMenuShowing={setIsUserMenuShowing} />
            </div>
            <div className="md:hidden flex justify-start items-center w-full fixed py-5 pl-5 bg-[#3A98B9]">
                <img src={isMenuShowing ? close : menu} alt="menu icon" className="w-5 h-5 -scale-x-100" onClick={() => setIsMenuShowing(!isMenuShowing)}/>
                <div className={`${isMenuShowing ? "flex" : "hidden"} rounded-xl p-5 bg-[#22667f] absolute top-11 flex flex-col justify-center items-start gap-2 text-[#FFF1DC]`}>
                    {navLinks.map((navLink, index) => (
                        <div key={index} onClick={() => handleLinkChange(navLink)} className={`${currAdminPortal === navLink ? "font-semibold" : ""} w-full text-[#FFF1DC] whitespace-nowrap hover:cursor-pointer text-center`}>{navLink}</div>
                    ))}
                </div>
                <UserIcon isUserMenuShowing={isUserMenuShowing} setIsUserMenuShowing={setIsUserMenuShowing} />
            </div>
        </div>
    )
}

export default AdminNavbar