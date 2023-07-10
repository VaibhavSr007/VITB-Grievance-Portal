import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { user } from "../assets";
import { context } from "../context";

const UserIcon = (props: { isUserMenuShowing: boolean, setIsUserMenuShowing: (menuStatus: boolean) => void }) => {
    const { isUserMenuShowing, setIsUserMenuShowing } = props;
    const navigate = useNavigate();
    
    const { name, setName, setEmpNo, setRegNo, setIsSuperUser } = useContext(context);

    function handleSignOut() {
        localStorage.clear();
        setName("");
        setEmpNo("");
        setRegNo("");
        setIsSuperUser(false);
        navigate("/login");
    }

    return (
        <div className="flex items-end justify-end right-5 md:right-7 lg:right-10 fixed bg-[#3A98B9] hover:cursor-pointer select-none" onClick={() => setIsUserMenuShowing(!isUserMenuShowing)}>
            <div className="bg-white flex items-end justify-center w-8 h-8 md:w-10 md:h-10 rounded-full overflow-clip">
                <img className="w-7 h-7 md:w-9 md:h-9 pointer-events-none" src={user} alt="user" />
            </div>
            <div className={`${isUserMenuShowing ? "": "hidden"} rounded-xl px-5 py-7 md:px-8 md:py-10 bg-[#22667f] absolute top-11 flex flex-col justify-center gap-2 md:gap-4 md:text-lg text-[#FFF1DC]`}>
                <div className="text-lg md:text-xl font-bold truncate text-ellipsis">Hi, {name.split(" ")[0]}</div>
                <div className="ml-1 md:ml-2 w-full" onClick={() => navigate("/profile")}>Profile</div>
                <div className="ml-1 md:ml-2 whitespace-nowrap" onClick={() => navigate("/change-password")}>Change Password</div>
                <div className="ml-1 md:ml-2 " onClick={handleSignOut}>Signout</div>
            </div>
        </div>
    )
}

export default UserIcon;