import { useContext } from 'react';
import UserContext from '../context/UserContext';

const Pokecard = ({ pokemon }) => {
    const { selectedUser } = useContext(UserContext);



    //Gets appropriate img for context
    const getImage = () => {
        if (selectedUser === "Jesse") {
            if (pokemon.jesselocation !== null && pokemon.jesselocation !== "") {
                return (<img src={`http://localhost:1234${pokemon.jesselocation}`} width="200" height="200" />);
            } else {
                return (<img src={pokemon.defaultlocation} width="200" height="200" />)
            }
        } else {
            if (pokemon.jasminelocation !== null && pokemon.jasminelocation !== "") {
                return (<img src={`http://localhost:1234${pokemon.jasminelocation}`} width="200" height="200" />)
            } else {
                return (<img src={pokemon.defaultlocation} width="200" height="200" />);
            }
        }
    }
    return (
        <div>
            <p>{pokemon.name}</p>
            <p>{pokemon.id}</p>
            {getImage()}

        </div>
    );
}
export default Pokecard;