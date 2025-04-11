import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pokecard from './Pokecard';
import JSwap from './JSwap';

const Pokedex = () => {
    const [search, setSearch] = useState("");
    const [pokemons, setPokemons] = useState(null);
    const [searchedPokemons, setSearchedPokemons] = useState([]);
    const [numberToShow, setNumberToShow] = useState(40); //Used to limit the page to only showing 20 pokemon at a time
    const navigate = useNavigate();

    //Get pokemon
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("https://the-j-and-j-archive-backend-production.up.railway.app/api/pokemon");
                const data = await response.json();
                setPokemons(data);
            } catch (error) {
                console.log(error);
                navigate('/error');
            }
        })()

    }, [navigate]);

    //Extend list when scrolling
    useEffect(() => {
        const handleScroll = () => {
            //Bootstrap for some reason changes one of these so we have to shorten the offsetHeight just a bit to make sure this triggers at the bottom of the page
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 40) {
                setNumberToShow(numberToShow + 40);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [numberToShow]);


    const handleChange = (event) => {
        setSearch(event.target.value.toLowerCase().replace(/\s/g, ''));
    }

    //Update searchList
    useEffect(() => {
        if (!pokemons)
            return;
        if (search === null || search === "")
            return setSearchedPokemons(pokemons);
        else {
            const searchPokemons = pokemons.filter((pokemon) => pokemon.name.includes(search) || search == pokemon.id);
            setSearchedPokemons(searchPokemons);
        }
    }, [search, pokemons])
    

    if (!pokemons)
        return (<main>
            <h1>Loading...</h1>
        </main>)
    return (
        <main id="main">
            <form id="search-form" onSubmit={(event) => { event.preventDefault(); }}>
                <input id="search-input" placeholder="Search..." onChange={handleChange} />
            </form>
            <div id="pokedex">
                {
                    searchedPokemons.map((pokemon, index) => {
                        if (index > numberToShow)
                            return;
                        else
                            return (<Pokecard key={pokemon.id} pokemon={pokemon} isDetail={false} isUnsaved={false}/>);
                    })}
            </div>
            <JSwap />
        </main>)
}
export default Pokedex;