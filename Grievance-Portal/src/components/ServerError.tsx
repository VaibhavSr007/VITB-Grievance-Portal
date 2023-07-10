import { useContext } from "react";
import { context } from "../context";

const ServerError = () => {
    const { setCurrPortal } = useContext(context);
    setCurrPortal("");

    return (
        <div>Server Error</div>
    )
}

export default ServerError;