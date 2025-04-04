import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';

const SignUp = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();

    // State
    const name = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);
    const confirmedPassword = useRef(null);
    const [errors, setErrors] = useState([]);

    // event handlers
    const handleSubmit = async (event) => {
        event.preventDefault();

        //Build User Object
        const user = {
            name: name.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value,
            confirmedPassword: confirmedPassword.current.value
        }
        const formData = new FormData();
        formData.name = "formDataName";
        formData.append("name", user.name);
        formData.append("email", user.emailAddress);
        formData.append("password", user.password);
        formData.append("confirmedPassword", user.confirmedPassword);


        const options = {
            method: "POST",
            body: formData,
        }

        //Post user object, signing them in if successful, and showing errors is unsuccessful
        try {
            const response = await fetch("http://localhost:1234/api/user", options);
            const data = await response.json();
            console.log(data);
            if (response.status === 201) {
                console.log(`${user.name} is sucessfully signed up and authenticated!`);
                await actions.signIn(user);
                return navigate("/");
            }
            if (response.status === 400 || response.status === 401) {
                setErrors(data);
            } else {
                navigate("/error");
            }
        } catch {
            navigate("/error");
        }

    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <main>
            <div>
                <h2>Sign Up</h2>
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" placeholder="Name" ref={name} />
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" placeholder="Email" ref={emailAddress} />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" placeholder="Password" ref={password} />
                    <label htmlFor="confirmedPassword">Confirmed Password</label>
                    <input id="confirmedPassword" name="confirmedPassword" type="password" placeholder="Confirm Password" ref={confirmedPassword} />
                    <button type="submit">Sign Up</button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
                <p>Already have a user account? Click here to <Link to="/SignIn">sign in</Link>!</p>
            </div>
        </main>
    );
}

export default SignUp;