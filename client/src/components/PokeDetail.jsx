import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../context/UserContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import Pokecard from "./Pokecard";
import JSwap from "./JSwap";

const PokeDetail = () => {
    const { id } = useParams();
    const { authUser, selectedUser } = useContext(UserContext);
    const [pokemon, setPokemon] = useState(null);
    const [chasecard, setchasecard] = useState(null);
    const [notes, setnotes] = useState(null);
    const fileUploadRef = useRef();
    const navigate = useNavigate();
    const width = 63 * 4;
    const height = 88 * 4;

    //Loads page details
    const getPokeDetails = () => {
        (async () => {
            try {
                const response = await fetch(`https://the-j-and-j-archive-backend-production.up.railway.app/api/pokemon/${id}`);
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.log(error);
                navigate('/error');
            }
        })()
    }

    //Get pokedetails
    useEffect(getPokeDetails, [id, navigate]);

    const handleFileChange = async (event) => {
        if (!authUser)
            return;
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        const options = {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Basic ${authUser.encodedCredentials}`
            }
        }
        const res = await fetch(`https://the-j-and-j-archive-backend-production.up.railway.app/api/pokemon/${pokemon.id}/${selectedUser}`, options);
        const data = await res.json();
        alert(data);
        //Resets page
        getPokeDetails();
        clearChanges();
    };

    //Clicks file upload button, used for being able to click on card to upload image instead of a button
    const handleFileUploadClick = () => {
        if (!authUser)
            return;
        fileUploadRef.current.click()
    }

    //Prompts user for an image url for desired chase card
    const handlePromptChaseCard = () => {
        if (!authUser)
            return;
        const chaseUrl = prompt("Please enter the image url of your desired chase card!");
        setchasecard(chaseUrl);
    }

    //Clears changes on selected user swap to clear form
    const clearChanges = () => {
        setSelectedFile(null);
        setnotes(null);
        setchasecard(null);
    }

    //Options for fetch post request to submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!authUser)
            return;
        const formData = new FormData();
        let submittingsomething = false;
        //Append formdata
        if (chasecard) {
            formData.append("chasecard", chasecard);
            submittingsomething = true;
        }
        if (notes) {
            formData.append("note", notes);
            submittingsomething = true;
        }
        if (!submittingsomething) {
            return alert("Nothing to save!");
        } else {
            const options = {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Basic ${authUser.encodedCredentials}`
                }
            }
            const res = await fetch(`https://the-j-and-j-archive-backend-production.up.railway.app/api/pokemon/${pokemon.id}/${selectedUser}`, options);
            const data = await res.json();
            alert(data);
            //Resets page
            getPokeDetails();
            clearChanges();
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        if (!authUser)
            return;
        //Cancel operation if no card owned
        if (selectedUser === "Jesse") {
            if (!pokemon.jessehas)
                return alert("No card to be deleted!");
        } else {
            if (!pokemon.jasminehas)
                return alert("No card to be deleted!");
        }
        const confirm = prompt("Are you sure you want to get rid of this card? Type CONFIRM if you do");
        if (confirm === "CONFIRM") {
            const options = {
                method: "DELETE",
                headers: {
                    "Authorization": `Basic ${authUser.encodedCredentials}`
                }
            }
            const res = await fetch(`https://the-j-and-j-archive-backend-production.up.railway.app/api/pokemon/${pokemon.id}/${selectedUser}`, options);
            const data = await res.json();
            alert(data);
            //Resets page
            getPokeDetails();
            clearChanges();
        }
    }

    if (!pokemon)
        return (<main id="main">
            <p className="poke-loading">Loading...</p>
        </main>)
    return (<main id="main">
        <form id="poke-detail" onSubmit={handleSubmit}>
            {
                //Authorized user only buttons
                authUser ? <div id="poke-edit"><button id="poke-save" type="submit" >Save</button>
                    <button id="poke-delete" onClick={handleDelete}>Delete</button></div> : <></>
            }
            <input type="file" onChange={handleFileChange} ref={fileUploadRef} capture="environment" hidden />
            <Pokecard pokemon={pokemon} isDetail={true} onClick={handleFileUploadClick} isUnsaved={false} width={width} height={height} />
            <div id="notechase">
                {
                    //If we pending notes to be uploaded, display them, otherwise display notes based on selected user
                    notes ?
                        <textarea className="poke-text" onChange={(event) => { setnotes(event.target.value) }} readOnly={!authUser} />
                        :
                        <textarea className="poke-text" value={selectedUser === "Jesse" ?
                            (pokemon.jessenote ? pokemon.jessenote : "")
                            :
                            (pokemon.jasminenote ? pokemon.jasminenote : "")}
                            onChange={(event) => { setnotes(event.target.value) }} readOnly={!authUser} />
                }
                {
                    //If we pending chasecard to be uploaded, display it, otherwise display chasecard based on user
                    chasecard ? <img className="poke-image poke-chase" width={width / 3} height={height / 3} src={chasecard} onClick={handlePromptChaseCard} /> :
                        <img className="poke-image poke-chase" width={width / 3} height={height / 3} src={selectedUser === "Jesse" ? pokemon.jessechasecard : pokemon.jasminechasecard} onClick={handlePromptChaseCard} />

                }
            </div>
        </form>
        <div id="id-nav-container">
            <Link to={`/pokemon/${pokemon.id - 3}`}><button className="id-nav">-3</button></Link>
            <Link to={`/pokemon/${pokemon.id - 2}`}><button className="id-nav">-2</button></Link>
            <Link to={`/pokemon/${pokemon.id - 1}`}><button className="id-nav">-1</button></Link>
            <Link to={`/pokemon/${pokemon.id + 1}`}><button className="id-nav">+1</button></Link>
            <Link to={`/pokemon/${pokemon.id + 2}`}><button className="id-nav">+2</button></Link>
            <Link to={`/pokemon/${pokemon.id + 3}`}><button className="id-nav">+3</button></Link>
        </div>
        <JSwap clearChanges={clearChanges} />
    </main>);
}
export default PokeDetail;