import { FormEvent, useEffect, useState } from "react";


const RemoveUsers = () => {
    const [userno, setUserno] = useState<string>("");
    const [repeatUserno, setRepeatUserno] = useState<string>("");
    const [isDataValid, setIsDataValid] = useState<boolean>(false);
    
    const [alert, setAlert] = useState<[string, boolean]>(["", false]);


    // send user's registration/employee number to the backend for deletion
    useEffect(() => {
        async function removeUser() {
            const headers = {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            };
            const response = await fetch(`http://localhost:3000/delete/${userno}`, { method: "DELETE", headers });
            const data = await response.json();
            if (data && (data.message === "User Deleted Successfully" || data.message === "Admin Deleted Successfully" ))
                setAlert([data.message, true]);
            else if (data.message === "Wrong Credentials")
                setAlert(["User does not exists", false]);
            else
                setAlert([data.message, false]);
            handleReset();
        }
        if (!isDataValid)
            return;
        removeUser();
    }, [isDataValid]);

    // setTimeout for the alert message
    useEffect(() => {
        if (!alert[0])
            return;
        setTimeout(() => setAlert(['', false]), alert[0].length * 100);
    }, [alert])

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!userno || !repeatUserno ) {
            setAlert(["Please fill all the fields", false]);
            return;
        }
        if (userno !== repeatUserno) {
            setAlert(["Registration/Employee Numbers do not match", false]);
            return;
        }
        setIsDataValid(true);
    }
    
    function handleReset() {
        setUserno('');
        setRepeatUserno('');
        setIsDataValid(false);
    }

    return (
        <div className="max-w-screen min-h-screen px-3 py-16 md:py-32 flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
            <div className={`${alert[0] ? "": "hidden"} fixed ${alert[1] ? "bg-green-500" : "bg-red-500"} text-white p-4 text-lg rounded-lg top-0 mx-auto flex gap-5`}>
                {alert[0]}
                <button className="font-black z-10" onClick={() => setAlert(['', false])}>x</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-[#3A98B9] py-10 px-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                <label className="flex flex-col gap-1 md:text-lg w-full">
                    Registration/Employee No to delete
                    <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => setUserno(e.target.value)} type="text" placeholder="Registration/Employee No" value={userno} />
                </label>
                <label className="flex flex-col gap-1 md:text-lg w-full">
                    Repeat Registration/Employee
                    <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => setRepeatUserno(e.target.value)} type="text" placeholder="Registration/Employee No" value={repeatUserno} />
                </label>
                <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg active:scale-105">Remove User</button>
            </form>
        </div>
    )
}

export default RemoveUsers;