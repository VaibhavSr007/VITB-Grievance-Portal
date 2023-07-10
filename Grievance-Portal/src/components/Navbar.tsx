import { useContext, useState, useEffect } from "react";
import { context } from "../context"
import { close, menu } from "../assets";
import { useNavigate } from "react-router-dom";
import { UserIcon } from ".";
import { getAccessToken } from "../utils/getAccessToken";


const Navbar = () => {
    const [ isMenuShowing, setIsMenuShowing ] = useState(false);
    const [ isUserMenuShowing, setIsUserMenuShowing ] = useState(false);

    const { empNo, regNo, setName, setEmpNo, setRegNo, setIsSuperUser, currPortal, setCurrPortal } = useContext(context);
    const navigate = useNavigate();

    const navLinks = ["Ongoing Grievances", "Submit a Grievance", "Anonymous Complaints/Suggestions"]

    useEffect(() => {
        if (empNo || regNo)
            return;
        async function fetchToken() {
            const values = await getAccessToken();
            if (values) {
                setName(values.name);
                setEmpNo(values.empNo);
                setRegNo(values.regNo);
                setIsSuperUser(values.isSuperUser);
            }

        }
        fetchToken()
    }, []);

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
        setCurrPortal(navLink);
        setIsMenuShowing(false);
    }

    return (
        <div className="w-full">
            <div className="hidden md:flex justify-evenly items-center w-full fixed py-5 pl-5 pr-16 bg-[#3A98B9]">
                {navLinks.map((navLink, index) => (
                    <div key={index} onClick={() => handleLinkChange(navLink)} className={`${currPortal === navLink ? "font-semibold" : ""} text-[#FFF1DC] text-xl hover:cursor-pointer w-1/3 text-center`}>{navLink}</div>
                ))}
                <UserIcon isUserMenuShowing={isUserMenuShowing} setIsUserMenuShowing={setIsUserMenuShowing} />
            </div>
            <div className="md:hidden flex justify-start items-center w-full fixed py-5 pl-5 bg-[#3A98B9]">
                <img src={isMenuShowing ? close : menu} alt="menu icon" className="w-5 h-5 -scale-x-100" onClick={() => setIsMenuShowing(!isMenuShowing)}/>
                <div className={`${isMenuShowing ? "flex" : "hidden"} rounded-xl p-5 bg-[#22667f] absolute top-11 flex flex-col justify-center gap-2 text-[#FFF1DC]`}>
                    {navLinks.map((navLink, index) => (
                        <div key={index} onClick={() => handleLinkChange(navLink)} className={`${currPortal === navLink ? "font-semibold" : ""} w-full text-[#FFF1DC] whitespace-nowrap hover:cursor-pointer`}>{navLink !== "Anonymous Complaints/Suggestions" ? navLink : "Anonymous Complaints"}</div>
                    ))}
                </div>
                <UserIcon isUserMenuShowing={isUserMenuShowing} setIsUserMenuShowing={setIsUserMenuShowing} />
            </div>
        </div>
    )
}

export default Navbar