import { useContext } from 'react';
import UserContext from '../context/UserContext';
import GetImage from './util/GetImage';
import { Link } from 'react-router-dom';

const Pokecard = ({ pokemon }) => {
    const { selectedUser } = useContext(UserContext);
    const width = 63 * 2;
    const height = 88 * 2;

    return (
        <div>
            <p>{pokemon.id} {pokemon.name}</p>
            <Link to={`pokemon/${pokemon.id}`}>
                <GetImage
                    selectedUser={selectedUser}
                    pokemon={pokemon}
                    width={width}
                    height={height}
                /></Link>

        </div>
    );
}
export default Pokecard;