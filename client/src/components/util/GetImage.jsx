//Gets appropriate img for context
const GetImage = ({ selectedUser, pokemon, width, height }) => {
    if (selectedUser === "Jesse")
        if (pokemon.jesselocation !== null && pokemon.jesselocation !== "") {
            return (<img src={`http://localhost:1234${pokemon.jesselocation}`} width={width} height={height} />);

        } else {
            if (pokemon.jasminelocation !== null && pokemon.jasminelocation !== "")
                return (<img src={`http://localhost:1234${pokemon.jasminelocation}`} width={width} height={height} />)
        }
    return (<img src={pokemon.defaultlocation} width={width} height={height} />);
}
export default GetImage;