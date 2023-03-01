import React from "react"
import blob1 from "../assets/blob1.svg"
import blob2 from "../assets/blob2.svg"
function Blob(){
    return (
        <>
        <img src={blob1} className="blob1" alt="yellow-blob"/>
        <img src={blob2} className="blob2" alt="blue-blob"/>
        </>
    )
}
export default Blob;