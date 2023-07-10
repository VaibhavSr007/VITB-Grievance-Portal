import { ReactNode, createContext, useState } from 'react';

interface ContextData {
    name: string,
    setName: (newName: string) => void,
    empNo: string,
    setEmpNo: (newEmpNo: string) => void,
    regNo: string,
    setRegNo: (newRegNo: string) => void,
    isSuperUser: boolean,
    setIsSuperUser: (newIsSuperUser: boolean) => void,
    currPortal: string,
    setCurrPortal: (newPortal: string) => void,
    currAdminPortal: string,
    setCurrAdminPortal: (newPortal: string) => void,
}

const context = createContext<ContextData>({ 
    name: "",
    setName: () => {},
    empNo: "",
    setEmpNo: () => {},
    regNo: "",
    setRegNo: () => {},
    isSuperUser: false,
    setIsSuperUser: () => {},
    currPortal: "", 
    setCurrPortal: () => {},
    currAdminPortal: "", 
    setCurrAdminPortal: () => {},
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
    
    const [name, setName] = useState<string>("");
    const [empNo, setEmpNo] = useState<string>("");
    const [regNo, setRegNo] = useState<string>("");
    const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
    const [currPortal, setCurrPortal] = useState<string>("");
    const [currAdminPortal, setCurrAdminPortal] = useState<string>("");
  
    const contextValue = { name, setName, empNo, setEmpNo, regNo, setRegNo, isSuperUser, setIsSuperUser, currPortal, setCurrPortal, currAdminPortal, setCurrAdminPortal };
  
    return (
        <context.Provider value={contextValue}>
          {children}
        </context.Provider>
    );
};

export { context, ContextProvider };