import { useContext } from "react";
import UserContext from "../context/UserContext";
const JSwap = ({ clearChanges }) => {
    const { actions } = useContext(UserContext);

    const handleClick = () => {
        if(clearChanges)
            clearChanges();
        actions.swapUser();
    }
    return (
        <div id="JSwap">
            <button onClick={handleClick} >Swap</button>
        </div>)
}
export default JSwap;