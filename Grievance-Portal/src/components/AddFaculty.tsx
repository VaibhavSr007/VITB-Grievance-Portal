import { FormEvent, useEffect, useState } from "react";


const AddFaculty = () => {
    const [name, setName] = useState<string>("");
    const [empNo, setEmpNo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [repeatPass, setRepeatPass] = useState<string>("");
    const [dept, setDept] = useState<string>('');
    const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
    const [isDataValid, setIsDataValid] = useState<boolean>(false);
    
    const [alert, setAlert] = useState<[string, boolean]>(["", false]);


    // send user's registration data to the backend if all the data given is valid
    useEffect(() => {
        async function addAdmins() {
            const headers = {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            };
            const body = JSON.stringify({ name, empNo, dept, email, pass, isSuperUser });
            const response = await fetch('http://localhost:3000/register-admins', { method: "POST", headers, body });
            const data = await response.json();
            if (data && data.message === "Admin Added Successfully")
                setAlert([data.message, true]);
            else
                setAlert([data.message, false]);
            handleReset();
        }
        if (!isDataValid)
            return;
        addAdmins();
    }, [isDataValid]);

    // setTimeout for the alert message
    useEffect(() => {
        if (!alert[0])
            return;
        setTimeout(() => setAlert(['', false]), alert[0].length * 100);
    }, [alert])

    const registerDetails = [
        { name: "Name", value: name, type: "text", funct: setName, placeholder: "Enter your Full Name" },
        { name: "Employee Number", value: empNo, type: "text", funct: setEmpNo, placeholder: "Enter your Emp. No." },
        { name: "Department", value: dept, type: "text", funct: setDept, placeholder: "Enter your department" },
        { name: "Email", value: email, type: "email", funct: setEmail, placeholder: "Enter your Email" },
        { name: "Password", value: pass, type: "password", funct: setPass, placeholder: "Enter your Password" },
        { name: "Repeat Password", value: repeatPass, type: "password", funct: setRepeatPass, placeholder: "Repeat your Password" }
    ];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email || !pass || !repeatPass || !name || !empNo || !dept ) {
            setAlert(["Please fill all the fields", false]);
            return;
        }
        if (pass !== repeatPass) {
            setAlert(["Passwords do not match", false]);
            setPass('');
            setRepeatPass('');
            return;
        }
        // set email regex
        // const emailRegex = /^[a-zA-Z]+\.*?@vitbhopal\.ac\.in$/
        // if (!emailRegex.test(email)) {
        //     setAlert(["Please enter a valid VIT Bhopal email", false]);
        //     handleReset();
        //     return;
        // }
        setIsDataValid(true);
    }
    
    function handleReset() {
        setEmail("");
        setPass("");
        setRepeatPass("");
        setName("");
        setEmpNo("");
        setDept("");
        setIsSuperUser(false);
        setIsDataValid(false);
    }

    return (
        <div className="max-w-screen min-h-screen px-3 py-16 md:py-32 flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
            <div className={`${alert[0] ? "": "hidden"} fixed ${alert[1] ? "bg-green-500" : "bg-red-500"} text-white p-4 text-lg rounded-lg top-0 mx-auto flex gap-5`}>
                {alert[0]}
                <button className="font-black z-10" onClick={() => setAlert(['', false])}>x</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-[#3A98B9] py-10 px-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                {registerDetails.map((detail, index) => (
                    <label key={index} className="flex flex-col gap-1 md:text-lg w-full">
                        {detail.name}
                        <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => detail.funct(e.target.value)} type={detail.type} placeholder={detail.placeholder} value={detail.value} />
                    </label>
                ))}
                <label className="flex flex-row-reverse justify-end items-center gap-5 md:text-lg w-full">
                    Is a Super User?
                    <input type="checkbox" className="w-5 h-5" onChange={(e) => setIsSuperUser(e.target.checked)} checked={isSuperUser} />
                </label>
                <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg active:scale-105">AddFaculty</button>
            </form>
        </div>
    )
}

export default AddFaculty;