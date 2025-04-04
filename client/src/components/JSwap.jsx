import { useContext } from "react";
import UserContext from "../context/UserContext";
const JSwap = () => {
    const { actions } = useContext(UserContext);

    const handleClick = () => {
        actions.swapUser();
    }
    return (
        <div id="JSwap">
            <button onClick={handleClick} />
        </div>)
}
export default JSwap;