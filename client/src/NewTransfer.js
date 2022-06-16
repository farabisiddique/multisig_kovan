import React, {useState} from "react";

function NewTransfer({createTransfer}){
    const [transfer,setTransfer] = useState(undefined);

    const updateTransfer = (e,field)=>{
        const value = e.target.value;
        setTransfer({...transfer,[field]: value});
    };

    const submit = e=>{
        e.preventDefault();
        createTransfer(transfer);
        
    }

    return (
        <div>
            <h2>Create Transfer</h2>
            <form onSubmit={(e)=> submit(e)}>
                <label htmlFor="amount">Amount</label>
                <input 
                    id="amount"
                    type="number"
                    onChange={e => updateTransfer(e,"amount")}
                />
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="to">Recepient</label>
                <input 
                    id="to"
                    type="text"
                    onChange={e => updateTransfer(e,"to")}
                />
                &nbsp;&nbsp;&nbsp;
                <button>Submit</button>
            </form>
        </div>

    );
}

export default NewTransfer;