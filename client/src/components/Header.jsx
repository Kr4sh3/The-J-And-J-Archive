import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Header = () => {
    const { authUser } = useContext(UserContext);
    return (
        <header>
            <h1><Link to="/">The J & J Archive</Link></h1>
            <nav>
                <ul>
                    {
                        authUser ?
                            <li>Welcome {authUser.name}</li>
                            :
                            <li><Link to="/signin">Sign In</Link></li>

                    }
                </ul>
            </nav>
        </header>
    );
}
export default Header;