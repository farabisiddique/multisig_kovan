// SPDX-License-Identifier: MIT 

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Wallet{
    address[] public approvers;
    uint public quorum;
    struct Transfer{
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }

    Transfer[] public transfers;
    // uint public nextId;
    mapping(address=>mapping(uint=>bool)) public approvals;


    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns(address[] memory){
        return approvers;
    }

    function getTransfer() external view returns(Transfer[] memory){
        return transfers;
    }

    function createTransfer(uint amount, address payable to) external onlyApprover(){
        
        transfers.push(
            Transfer(transfers.length,amount,to,0,false)
        );
    }

    function approveTransfer(uint id) external onlyApprover(){

        require(transfers[id].sent==false, "Already approved");
        require(approvals[msg.sender][id]==false,'Can not approve twice');
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;

        if(transfers[id].approvals>=quorum){
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
        
    }

    receive() payable external {}

    modifier onlyApprover(){

        bool allowed = false;

        for(uint i=0;i<approvers.length;i++){

            if(approvers[i]==msg.sender){
                allowed = true;
            }

        }
        require(allowed==true,"Only Approvers allowed");
        _;
    }



    
}
