import { useContext } from 'react';
import UserContext from '../context/UserContext';
import GetImage from './util/GetImage';
import { Link } from 'react-router-dom';

const Pokecard = ({ pokemon, isDetail, onClick, isUnsaved, src, width = 63 * 2.45, height = 88 * 2.45}) => {
    const { selectedUser } = useContext(UserContext);
    
    return (
        <div className="poke-card">
            {isDetail ?
                <GetImage
                    selectedUser={selectedUser}
                    pokemon={pokemon}
                    width={width}
                    height={height}
                    onClick={onClick}
                    isUnsaved={isUnsaved}
                    src={src}
                />
                :
                <Link to={`pokemon/${pokemon.id}`}>
                    <GetImage
                        selectedUser={selectedUser}
                        pokemon={pokemon}
                        width={width}
                        height={height}
                    /></Link>}

            <div className='poke-id-circle'>
                <p className="poke-id">{pokemon.id}</p>
            </div>
            <div className="poke-name-background">
                <p className="poke-name">{pokemon.name}</p>
            </div>
            <div className="has-indicator" >
                {selectedUser === "Jesse" && pokemon.jessehas ? <div className="has" /> : <></>}
                {selectedUser === "Jasmine" && pokemon.jasminehas ? <div className="has" /> : <></>}
            </div>
        </div>
    );
}
export default Pokecard;