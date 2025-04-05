import { useContext } from "react";
import UserContext from "../context/UserContext";
const JSwap = ({ clearChanges }) => {
    const { actions, selectedUser } = useContext(UserContext);

    const handleClick = () => {
        if (clearChanges)
            clearChanges();
        actions.swapUser();
    }
    return (
        <div id="JSwap" className="fix-to-bottom-left">
            <button id="JSwap-button" onClick={handleClick} className={selectedUser === "Jesse" ? "Jesse" : "Jasmine"}>{selectedUser}</button>
        </div>)
}
export default JSwap;