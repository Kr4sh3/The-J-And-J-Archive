import { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ErrorsDisplay from './ErrorsDisplay';

const SignIn = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);
    const emailAddress = useRef(null);
    const password = useRef(null);


    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Build credentials object
        const credentials = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }
        //Error Handling
        if (!emailAddress.current.value || !password.current.value) {
            setErrors(["Please provide an email and password"]);
            return;
        }
        //Attempt signin, and redirect to original route or home page on success, otherwise notify user of unsuccessful attempt
        const user = await actions.signIn(credentials);
        if (user !== null) {
            if (user instanceof Error)
                navigate("/error")
            else
                navigate("/");
        } else if (user === null) {
            setErrors(["Sign-in was unsuccessful"]);
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <main>
            <div className="">
                <h2>Sign In</h2>
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleSubmit}>
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} placeholder="Email" />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" ref={password} placeholder="Password" />
                    <button type="submit">Sign In</button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
                <p>Resetting your password? Click here to <Link to="/SignUp">sign up</Link>!</p>
            </div>
        </main>
    )
};

export default SignIn;