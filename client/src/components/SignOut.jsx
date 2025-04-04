import { useContext, useEffect } from "react"
import UserContext from "../context/UserContext"
import { Navigate } from "react-router-dom";

const SignOut = () => {
    const { actions } = useContext(UserContext);

    useEffect(() => actions.signOut());

    return <Navigate to="/" replace />;
}

export default SignOut;