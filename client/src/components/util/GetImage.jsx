//Gets appropriate img for context
const GetImage = ({ selectedUser, pokemon, width, height, onClick, isUnsaved, src }) => {
    if(isUnsaved)
        return (<img className="poke-image" src={src} width={width} height={height} onClick={onClick} />);
    if (selectedUser === "Jesse") {
        if (pokemon.jesselocation !== null && pokemon.jesselocation !== "")
            return (<img className="poke-image" src={`https://the-j-and-j-archive-production.up.railway.app${pokemon.jesselocation}`} width={width} height={height} onClick={onClick} />);
        else
            return (<img className="poke-image dont-have" src={pokemon.defaultlocation} width={width} height={height} onClick={onClick} />);
    } else {
        if (pokemon.jasminelocation !== null && pokemon.jasminelocation !== "")
            return (<img className="poke-image" src={`https://the-j-and-j-archive-production.up.railway.app${pokemon.jasminelocation}`} width={width} height={height} onClick={onClick} />)
        else
            return (<img className="poke-image dont-have" src={pokemon.defaultlocation} width={width} height={height} onClick={onClick} />);
    }
}
export default GetImage;