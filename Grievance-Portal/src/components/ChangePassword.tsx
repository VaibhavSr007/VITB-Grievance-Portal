import { FormEvent, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../utils/getAccessToken";
import { AdminNavbar, Navbar } from ".";
import { context } from "../context";

const ChangePassword = () => {
    const [pass, setPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [repeatNewPass, setRepeatNewPass] = useState("");
    const [isDataValid, setIsDataValid] = useState<boolean>(false);

    const [alert, setAlert] = useState<[string, boolean]>(["", false]);

    const { empNo, regNo } = useContext(context);

    // sending the newpass and curr password for authentication and updation
    useEffect(() => {
        async function changePass() {
            try {
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-type': 'application/json; charset=UTF-8',
                }
                let body;
                if (regNo){
                    body = JSON.stringify({ regNo, pass, newPass });
                } else {
                    body = JSON.stringify({ empNo, pass, newPass })
                }
                const response = await fetch(`http://localhost:3000/change-password`, { method: 'POST', headers, body })
                const data = await response.json();
                if (data.message && data.message === "Unauthorised Access") {
                    if (await getAccessToken())
                        changePass();
                    return;
                } else if (data.message === "Password Updated Successfully") {
                    setAlert([data.message, true]);
                    handleReset();
                } else if (data) {
                    setAlert([data.message, false]);
                    handleReset();
                }
            } catch(err) {
                console.error(err);
                handleReset();
            };
        }
        if (!isDataValid)
            return;
        changePass();
    }, [isDataValid])

    // setTimeout for the alert message
    useEffect(() => {
        if (!alert[0])
            return;
        setTimeout(() => setAlert(['', false]), alert[0].length * 100);
    }, [alert])

    const entryDetails = [
        { name: "Password", value: pass, funct: setPass, placeholder: "Enter your Password" },
        { name: "New Password", value: newPass, funct: setNewPass, placeholder: "Enter your new password" },
        { name: "Repeat New Password", value: repeatNewPass, funct: setRepeatNewPass, placeholder: "Repeat your new password" }
    ];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!pass || !newPass || !repeatNewPass) {
            setAlert(["Please fill all the fields", false]);
            return;
        }
        if (newPass !== repeatNewPass) {
            setAlert(["Passwords do not match", false]);
            setNewPass("");
            setRepeatNewPass("");
            return;
        }
        setIsDataValid(true);
    }
    
    function handleReset() {
        setPass('');
        setNewPass("");
        setRepeatNewPass("");
        setIsDataValid(false);
    }

    return (
        <div>
            {empNo ? <AdminNavbar /> : <Navbar />}
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
                <div className={`${alert[0] ? "": "hidden"} fixed ${alert[1] ? "bg-green-500" : "bg-red-500"} text-white p-4 text-lg rounded-lg top-0 mx-auto flex gap-5`}>
                    {alert[0]}
                    <button className="font-black z-10" onClick={() => setAlert(['', false])}>x</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-[#3A98B9] py-10 px-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                    {entryDetails.map((entry, index) => (
                        <label key={index} className="flex flex-col gap-1 md:text-lg w-full">
                            {entry.name}
                            <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => entry.funct(e.target.value)} type="password" placeholder={entry.placeholder} value={entry.value} />
                            <Link to="/forget-password" className={`${index === entryDetails.length - 1 ? "" : "hidden"} hover:underline self-end text-[13px] md:text-base`}>Forgot Password?</Link>
                        </label>
                    ))}
                    <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg active:scale-105">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;