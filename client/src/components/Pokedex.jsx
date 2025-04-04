import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pokecard from './Pokecard';
import JSwap from './JSwap';

const Pokedex = () => {
    const [search, setSearch] = useState("");
    const [pokemons, setPokemons] = useState(null);
    const [searchedPokemons, setSearchedPokemons] = useState([]);
    const [numberToShow, setNumberToShow] = useState(20); //Used to limit the page to only showing 20 pokemon at a time
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://localhost:1234/api/pokemon");
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
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
                setNumberToShow(numberToShow + 20);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [numberToShow]);


    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    //Update searchList
    useEffect(() => {
        if (!pokemons)
            return;
        if (search === null || search === "")
            return setSearchedPokemons(pokemons);
        else {
            const searchPokemons = pokemons.filter((pokemon) => pokemon.name.includes(search));
            setSearchedPokemons(searchPokemons);
        }
    }, [search, pokemons])

    if (!pokemons)
        return (<main>
            <h1>Loading...</h1>
        </main>)
    return (
        <main>
            <form id="SearchBar" onSubmit={(event) => { event.preventDefault(); }}>
                <input placeholder="Search..." onChange={handleChange} />
            </form>
            <div id="Pokedex">
                {
                    searchedPokemons.map((pokemon, index) => {
                        if (index > numberToShow)
                            return;
                        else
                            return (<Pokecard key={pokemon.id} pokemon={pokemon} />);
                    })}
            </div>
            <JSwap />
        </main>)
}
export default Pokedex;