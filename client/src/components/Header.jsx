import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';

const Header = () => {
    const { authUser } = useContext(UserContext);
    return (
        <header id="header">
            <Link to="/"><h1 id="title">The J & J Archive</h1></Link>
            <nav id="nav">
                <ul id="nav-list">
                    {
                        authUser ?
                            <li id="nav-welcome">Welcome {authUser.name}</li>
                            :
                            <li id="nav-signin"><Link to="/signin">Sign In</Link></li>

                    }
                </ul>
            </nav>
        </header>
    );
}
export default Header;