import { useContext, useEffect, useState } from "react";
import { context } from "../context";
import { AdminNavbar, Navbar } from ".";
import { user } from "../assets";
import { getAccessToken } from "../utils/getAccessToken";

const Profile = () => {
    
    const { empNo, name, regNo, setName, setRegNo, setEmpNo, setIsSuperUser } = useContext(context);
    const [ dept, setDept ] = useState<string>("");
    const [ year, setYear ] = useState<number>(0);
    const [ email, setEmail ] = useState<string>("");

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
        if (year || dept)
            return;
        async function fetchData() {
            try {
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-type': 'application/json; charset=UTF-8',
                }
                const response = await fetch(`http://localhost:3000/profile`, { method: 'GET', headers})
                const data = await response.json();
                if (data.message && data.message === "Unauthorised Access") {
                    const values = await getAccessToken();
                    if (values) {
                        setName(values.name);
                        setEmpNo(values.empNo);
                        setRegNo(values.regNo);
                        setIsSuperUser(values.isSuperUser);
                        fetchData();
                    }
                    return;
                } else if (data) {
                    if (empNo)
                        setDept(data.dept);
                    else
                        setYear(data.year);
                    setEmail(data.email);
                }
            } catch(err) {
                console.error(err);
            };
        }

        fetchData();
    });

    const profileData = empNo ? [ { title: "Name: ", value: "Dr. " + name }, { title: "Employee Number: ", value: empNo }, { title: "Department: ", value: dept }, { title: "Email: ", value: email } ] : [ { title: "Name: ", value: name }, { title: "Registration Number: ", value: regNo }, { title: "Year: ", value: year }, { title: "Email: ", value: email } ];

    return (
        <div>
            {empNo ? <AdminNavbar /> : <Navbar />}
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#EEEEEE] p-3">
                <img src={user} alt="user" className="w-24 h-24 md:w-32 md:h-32 object-contain border-black border-2 mb-20" />
                <div className="flex flex-col items-center border-2 border-black w-full md:w-1/2 gap-3 justify-center bg-[#3A98B9] p-7 md:p-10 text-[#FFF1DC] rounded-3xl">
                    {profileData.map((data, index) => (
                        <div key={index} className="flex justify-between w-full">
                            <p className="text-sm md:text-lg">{data.title}</p>
                            <p className="text-sm md:text-lg">{data.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile;