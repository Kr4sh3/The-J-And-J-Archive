import { useContext } from "react";
import UserContext from "../context/UserContext";
const JSwap = ({ clearChanges }) => {
    const { actions, selectedUser } = useContext(UserContext);

    const handleClick = () => {
        if(clearChanges)
            clearChanges();
        actions.swapUser();
    }
    return (
        <div id="JSwap">
            <button onClick={handleClick} >{selectedUser}</button>
        </div>)
}
export default JSwap;