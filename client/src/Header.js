import React from "react";

function Header({quorum,approvers}){

    return (
        <header>
            
                <p>Approvers: <b>{approvers.join(', ')}</b></p>
                <p>Quorum: <b>{quorum}</b></p>
            
        </header>
    )
}

export default Header