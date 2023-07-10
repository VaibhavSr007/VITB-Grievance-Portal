import { FormEvent, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../utils/getAccessToken";
import TagsAutoComplete from "./TagsAutocomplete";
import { tags } from "../constants";
import { context } from "../context";

const SubmitGrievance = () => {
    const [subject, setSubject] = useState<string>("");
    const [complaint, setComplaint] = useState<string>("");
    const [relatedDepts, setRelatedDepts] = useState<string[]>([]);
    const [isDataValid, setIsDataValid] = useState<boolean>(false);

    const [alert, setAlert] = useState<[string, boolean]>(["", false]);

    const { setName, setEmpNo, setRegNo, setIsSuperUser } = useContext(context);
    
    // posts the submitted details to the server
    useEffect(() => {
        async function postData() {
            try {
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-type': 'application/json; charset=UTF-8',
                }
                const body = JSON.stringify({ subject, complaint, relatedDepts, isAnonymous: false });
                const response = await fetch(`http://localhost:3000/grievances`, { method: 'POST', headers, body })
                const data = await response.json();
                if (data.message && data.message === "Unauthorised Access") {
                    const values = await getAccessToken();
                    if (values) {
                        setName(values.name);
                        setEmpNo(values.empNo);
                        setRegNo(values.regNo);
                        setIsSuperUser(values.isSuperUser);
                        postData();
                    }
                    return;
                } else if (data) {
                    setAlert(["Complaint Registered Successfully", true])
                    handleReset();
                }
            } catch(err) {
                setAlert(["Error in submitting complaint", false]);
                console.error(err);
            };
        }
        if (!isDataValid)
            return;
        postData();
    }, [isDataValid])
    
    useEffect(() => {
        if (!alert[0])
            return;
        setTimeout(() => setAlert(['', false]), alert[0].length * 100);
    }, [alert])

    // checks the validity of the submitted details
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!subject || !complaint) {
            setAlert(["Please fill all the fields", false]);
            return;
        }
        if (!relatedDepts.length) {
            setRelatedDepts([...relatedDepts, "any"]);
        }
        // Limit the word limit of subject, complaint
        setIsDataValid(true);
    }
    
    function handleReset() {
        setSubject("");
        setComplaint("");
        setRelatedDepts([]);
        setIsDataValid(false);
    }

    return (
        <div className="min-h-screen px-3 py-16 md:py-10 flex flex-col justify-center items-center">
            <div className={`${alert[0] ? "": "hidden"} fixed ${alert[1] ? "bg-green-500" : "bg-red-500"} text-white p-4 text-lg rounded-lg top-0 mx-auto flex gap-5`}>
                {alert[0]}
                <button className="font-black z-10" onClick={() => setAlert(['', false])}>x</button>
            </div>
            <h1 className="p-10 text-xl md:text-2xl font-semibold">What's bothering you?</h1>
            <form onSubmit={handleSubmit} className="flex flex-col justify-start bg-[#3A98B9] px-5 py-7 md:p-10 md:pb-7 gap-5 text-[#FFF1DC] rounded-3xl w-full md:w-auto">
                <label className="flex gap-4 items-center text-sm md:text-base">
                    Subject 
                    <input type="text" placeholder="What's your issue?" className="w-full p-1 md:p-2 rounded-lg text-black" onChange={(e) => setSubject(e.target.value)} value={subject} />
                </label>
                <TagsAutoComplete name="Related Departments" state={relatedDepts} setState={setRelatedDepts} tags={tags}/>
                <label className="flex flex-col gap-2 text-sm md:text-base">
                    Describe your Issue
                    <textarea className="w-full md:w-[600px] h-[200px] text-black p-2 md:p-3 rounded-xl" placeholder="Write about your complaint here..." onChange={(e) => setComplaint(e.target.value)} value={complaint} />
                </label>
                <button type="submit" className="bg-gray-700 p-3 px-4 rounded-xl md:text-lg self-center active:scale-105">Submit</button>
            </form>
        </div>
    )
}

export default SubmitGrievance;