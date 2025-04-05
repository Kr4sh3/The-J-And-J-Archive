const ErrorsDisplay = ({ errors }) => {
    let errorsDisplay = null;
    if (errors.length) {
        errorsDisplay = (
            <div id="poke-error">
                <h3 id="poke-error-title">Validation Errors</h3>
                <ul id="poke-error-list">
                    {errors.map((error, i) => <li className="poke-error-item" key={i}>{error}</li>)}
                </ul>
            </div>
        );
    }
    return errorsDisplay;
}

export default ErrorsDisplay;