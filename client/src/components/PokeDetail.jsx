import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";
import GetImage from "./util/GetImage";
import JSwap from "./JSwap";

const PokeDetail = () => {
    const { id } = useParams();
    const { selectedUser } = useContext(UserContext);
    const [pokemon, setPokemon] = useState(null);
    const width = 63 * 4;
    const height = 88 * 4;

    //Get pokedetails
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:1234/api/pokemon/${id}`);
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.log(error);
                navigate('/error');
            }
        })()
    }, []);

    if (!pokemon)
        return (<main>
            <h1>Loading...</h1>
        </main>)
    return (<main>
        <div>
            <button>Save</button>
        </div>
        <div>
            <GetImage
                selectedUser={selectedUser}
                pokemon={pokemon}
                width={width}
                height={height}
            />
        </div>
        <JSwap />
    </main>);
}
export default PokeDetail;