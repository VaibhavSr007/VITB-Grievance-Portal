import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";


const Register = () => {
    const [name, setName] = useState<string>("");
    const [regNo, setRegNo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [repeatPass, setRepeatPass] = useState<string>("");
    const [year, setYear] = useState<number>(0);
    const [isDataValid, setIsDataValid] = useState<boolean>(false);
    
    const [alert, setAlert] = useState<string>("");

    const navigate = useNavigate();

    // send user's registration data to the backend if all the data given is valid
    useEffect(() => {
        if (!isDataValid)
            return;
        setIsDataValid(false);
        fetch('http://localhost:3000/register', {
            method: 'POST',
            body: JSON.stringify({ name, regNo, year, email, pass }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .then(() => navigate('/login', { replace: true }))
            .catch((err) => {
                console.error(err.message);
                handleReset();
            });
    }, [isDataValid]);

    // setTimeout for the alert message
    useEffect(() => {
        if (!alert.length)
            return;
        setTimeout(() => setAlert(''), alert.length * 100);
    }, [alert])

    const registerDetails = [
        { name: "Name", value: name, type: "text", funct: setName, placeholder: "Enter your Full Name" },
        { name: "Registration Number", value: regNo, type: "text", funct: setRegNo, placeholder: "Enter your Reg. No." },
        { name: "Email", value: email, type: "email", funct: setEmail, placeholder: "Enter your Email" },
        { name: "Password", value: pass, type: "password", funct: setPass, placeholder: "Enter your Password" },
        { name: "Repeat Password", value: repeatPass, type: "password", funct: setRepeatPass, placeholder: "Repeat your Password" }
    ];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email || !pass || !repeatPass || !name || !regNo ) {
            setAlert("Please fill all the fields");
            return;
        }
        if (pass !== repeatPass) {
            setAlert("Passwords do not match");
            setPass('');
            setRepeatPass('');
            return;
        }
        const emailRegex = /^[a-zA-Z]+\.([a-zA-Z]*)?(20\d{2})?@vitbhopal\.ac\.in$/
        if (!emailRegex.test(email)) {
            setAlert("Please enter a valid VIT Bhopal email");
            handleReset();
            return;
        }
        setYear(Number(email.match(emailRegex)![2]));
        setIsDataValid(true);
    }
    
    function handleReset() {
        setEmail("");
        setPass("");
        setRepeatPass("");
        setName("");
        setRegNo("");
    }

    return !localStorage.getItem("accessToken") ? (
        <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
            <div className={`${alert ? "": "hidden"} fixed bg-red-500 text-white p-4 text-lg rounded-lg top-0 mx-auto flex gap-5`}>
                {alert}
                <button className="font-black z-10" onClick={() => setAlert('')}>x</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-[#3A98B9] py-10 px-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                {registerDetails.map((detail, index) => (
                    <label key={index} className="flex flex-col gap-1 md:text-lg w-full">
                        {detail.name}
                        <input className="p-2 rounded-xl placeholder:text-gray-400 md:w-[400px] text-black" onChange={(e) => detail.funct(e.target.value)} type={detail.type} placeholder={detail.placeholder} value={detail.value} />
                        <Link to="/login" className={`${index === registerDetails.length - 1 ? "" : "hidden"} hover:underline self-end text-[13px] md:text-base`}>Already a User?</Link>
                    </label>
                ))}
                <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg active:scale-105">Register</button>
            </form>
        </div>
    ) : <Navigate to="/" />
}

export default Register;