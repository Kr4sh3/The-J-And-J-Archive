import { createContext, useState } from "react";
import Cookies from "js-cookie";

const UserContext = createContext(null);

export const UserProvider = (props) => {
    const cookie = Cookies.get("authenticatedUser");
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
    const [selectedUser, setSelectedUser] = useState(cookie ? (JSON.parse(cookie).email.toUpperCase() === "POKEMONJM@GMAIL.COM" ? "Jesse" : "Jasmine") : "Jasmine");

    const signIn = async (credentials) => {
        if (!credentials)
            return;
        //Encode credentials in base64
        const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`)
        //Build Header
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${encodedCredentials}`,
            }
        }
        //Attempt authentication, returning null if failed, and a user object if successful
        try {
            const res = await fetch('https://the-j-and-j-archive-backend-production.up.railway.app/api/user', options);
            const data = await res.json();
            if (res.status === 200) {
                const user = data;
                user.encodedCredentials = encodedCredentials;
                setAuthUser(user);
                Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 30 });
                return user;
            }
        } catch (err) {
            if (err.code === "ERR_NETWORK")
                return new Error("Network Error");
            return null;
        }
    }

    const signOut = () => {
        setAuthUser(null);
        Cookies.remove("authenticatedUser");
    }

    const swapUser = () => {
        if(selectedUser === "Jesse"){
            setSelectedUser("Jasmine");
        }else{
            setSelectedUser("Jesse");
        }
    }

    return (
        <UserContext.Provider value={{
            authUser,
            selectedUser,
            actions:
            {
                signIn,
                signOut,
                swapUser
            }
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;