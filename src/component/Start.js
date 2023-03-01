function Start(props){
    return(
        <div className="start-container">
            <h1 className="start-title">Quizzical</h1>
            <p className="start-description">A Short Random Question(5)  Quiz App</p>
            <button className="start-button" onClick={props.handler}>Start Quiz</button>
        </div>
    )
}
export default Start;