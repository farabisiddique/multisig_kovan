import React from "react";

function TransferList({transfers,approve}){

    return (
        <div className="transferList">
            <h2>All Transfers</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>To</th>
                        <th>Approvals</th>
                        <th>Action</th>
                        <th>Sent</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map(transfer=>(
                        <tr key={transfer.id}>

                            <td>{transfer.id}</td>
                            <td>{transfer.amount}</td>
                            <td>{transfer.to}</td>
                            <td>{transfer.approvals}</td>
                            <td>
                                {transfer.approvals>=2 ? 'Already Approved': <button onClick={()=>approve(transfer.id)}>Approve</button>}
                            </td>
                            <td>{transfer.sent? 'Yes':'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default TransferList; 