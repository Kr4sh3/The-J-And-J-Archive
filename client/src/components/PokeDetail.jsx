import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import GetImage from "./util/GetImage";
import JSwap from "./JSwap";

const PokeDetail = () => {
    const { id } = useParams();
    const { authUser, selectedUser } = useContext(UserContext);
    const [pokemon, setPokemon] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
                const response = await fetch(`http://localhost:1234/api/pokemon/${id}`);
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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    //Clicks file upload button, used for being able to click on card to upload image instead of a button
    const handleFileUploadClick = () => {
        fileUploadRef.current.click()
    }

    //Prompts user for an image url for desired chase card
    const handlePromptChaseCard = () => {
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
        const formData = new FormData();
        let submittingsomething = false;
        //Append formdata
        if (selectedFile) {
            formData.append("file", selectedFile);
            submittingsomething = true;
        }
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
            const res = await fetch(`http://localhost:1234/api/pokemon/${pokemon.id}/${selectedUser}`, options);
            const data = await res.json();
            alert(data);
            //Resets page
            getPokeDetails();
            clearChanges();
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();
        //Cancel operation if no card owned
        if(selectedUser === "Jesse"){
            if(!pokemon.jessehas)
                return alert("No card to be deleted!");
        }else{
            if(!pokemon.jasminehas)
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
            const res = await fetch(`http://localhost:1234/api/pokemon/${pokemon.id}/${selectedUser}`, options);
            const data = await res.json();
            alert(data);
            //Resets page
            getPokeDetails();
            clearChanges();
        }
    }

    if (!pokemon)
        return (<main>
            <h1>Loading...</h1>
        </main>)
    return (<main>
        <form onSubmit={handleSubmit}>
            <button type="submit" >Save</button>
            <button onClick={handleDelete}>Delete</button>
            <h2>{pokemon.id} {pokemon.name}</h2>
            <input type="file" onChange={handleFileChange} ref={fileUploadRef} />
            {
                //If we have a selected file to be uploaded, display it, otherwise display the appropriate image based on selected user
                selectedFile ?
                    <img src={URL.createObjectURL(selectedFile)} width={width} height={height} onClick={handleFileUploadClick} />
                    :
                    <GetImage
                        selectedUser={selectedUser}
                        pokemon={pokemon}
                        width={width}
                        height={height}
                        onClick={handleFileUploadClick}
                    />
            }
            {
                //If we pending notes to be uploaded, display them, otherwise display notes based on selected user
                notes ?
                    <textarea onChange={(event) => { setnotes(event.target.value) }} />
                    :
                    <textarea value={selectedUser === "Jesse" ?
                        (pokemon.jessenote ? pokemon.jessenote : "")
                        :
                        (pokemon.jasminenote ? pokemon.jasminenote : "")}
                        onChange={(event) => { setnotes(event.target.value) }} />
            }
            {
                //If we pending chasecard to be uploaded, display it, otherwise display chasecard based on user
                chasecard ? <img width={width / 3} height={height / 3} src={chasecard} onClick={handlePromptChaseCard} /> :
                    <img width={width / 3} height={height / 3} src={selectedUser === "Jesse" ? pokemon.jessechasecard : pokemon.jasminechasecard} onClick={handlePromptChaseCard} />

            }
        </form>
        <JSwap clearChanges={clearChanges} />
    </main>);
}
export default PokeDetail;