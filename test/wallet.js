const {expectRevert} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const Wallet = artifacts.require("Wallet");
// console.log(expectRevert);

contract('Wallet',(accounts)=>{
	let wallet;
	beforeEach(async ()=>{
		wallet = await Wallet.new([accounts[0],accounts[1],accounts[2]],2);
		let transactionObj = {
			from: accounts[0],
			to: wallet.address,
			value: 1000
		}
		console.log(transactionObj);
		await web3.eth.sendTransaction(transactionObj);
	});

	it("Should have correct no of approvers and quorum",async()=>{
		const approvers = await wallet.getApprovers();
		const quorum = await wallet.quorum();
		
		assert(approvers.length===3);
		assert(approvers[0]===accounts[0]);
		assert(approvers[1]===accounts[1]);
		assert(approvers[2]===accounts[2]);
		assert(quorum.toNumber()===2);
	});

	it("should create a transfer", async()=>{
		const amountToTransfer = 100;
		const recepient = accounts[5];
		await wallet.createTransfer(amountToTransfer,recepient, {from: accounts[0]});
		const transfers = await wallet.getTransfer();
		assert(transfers.length===1);
		assert(transfers[0].amount.toString()===amountToTransfer.toString());
		assert(transfers[0].to===recepient);
		assert(transfers[0].approvals.toString()==='0');
		assert(transfers[0].sent===false);

		
	});

	it("only approvers can create a transfer", async()=>{
		const amountToTransfer = 100;
		const recepient = accounts[5];
		const notApprover = accounts[4];	
		await expectRevert(
			wallet.createTransfer(amountToTransfer,recepient,{from: notApprover}),
			"Only Approvers allowed"
		);

	});

	it("should change the approvals status to true and increase approvals",async()=>{
		let transfers;
		let transferId;
		let approvalsAfter;
		let approvalStatusAfter;
		const amountToTransfer = 100;
		const recepient = accounts[5];
		const sender = accounts[0];

		await wallet.createTransfer(amountToTransfer,recepient, {from: sender});
		transfers = await wallet.getTransfer();
		transferId = transfers[0].id;
		approvalStatusBefore = await wallet.approvals(sender,transferId);
		approvalsBefore = parseInt(transfers[0].approvals);
		
		
		await wallet.approveTransfer(transferId);
		transfers = await wallet.getTransfer();
		transferId = transfers[0].id;
		approvalStatusAfter = await wallet.approvals(sender,transferId);
		approvalsAfter = parseInt(transfers[0].approvals);

		const quorum = await wallet.quorum();
		const balance = await web3.eth.getBalance(wallet.address);
		
		
		assert(!approvalStatusBefore && approvalStatusAfter);
		assert(approvalsAfter===(approvalsBefore+1));
		assert(balance==='1000');
		
		

	});

	it("should send transfer if quorum reached",async()=>{

		let transfers;
		let transferId;
		const amountToTransfer = 1000;
		// const amountToTransfer = web3.utils.toWei('1', 'shannon');
		const recepient = accounts[5];
		const sender = accounts[2];

		const balanceBefore = await web3.eth.getBalance(recepient);
		
		const quorum = await wallet.quorum();
		await wallet.createTransfer(amountToTransfer,recepient, {from: sender});
		transfers = await wallet.getTransfer();
		transferId = transfers[0].id;

		await wallet.approveTransfer(transferId,{from: accounts[0]});
		await wallet.approveTransfer(transferId,{from: accounts[1]});

		transfers = await wallet.getTransfer();
		transferId = transfers[0].id;
		const approvalsAfter = parseInt(transfers[0].approvals);
		
		const balanceAfter = await web3.eth.getBalance(recepient);

		assert(parseInt(balanceAfter)===parseInt(balanceBefore)+amountToTransfer);
		assert(parseInt(approvalsAfter)>=parseInt(quorum));

		
	});

	it("should stop approving if a transfer is already sent",async()=>{

		let transfers;
		let transferId;
		const amountToTransfer = 1000;
		// const amountToTransfer = web3.utils.toWei('1', 'shannon');
		const recepient = accounts[5];
		const sender = accounts[2];

		const balanceBefore = await web3.eth.getBalance(recepient);
		
		const quorum = await wallet.quorum();
		await wallet.createTransfer(amountToTransfer,recepient, {from: sender});
		transfers = await wallet.getTransfer();
		transferId = transfers[0].id;

		await wallet.approveTransfer(transferId,{from: accounts[0]});

		// await wallet.approveTransfer(transferId,{from: accounts[0]});

		await expectRevert(
			wallet.approveTransfer(transferId,{from: accounts[0]}),
			"Can not approve twice"
		);

		await wallet.approveTransfer(transferId,{from: accounts[1]});

		

		await expectRevert(
			wallet.approveTransfer(transferId,{from: accounts[2]}),
			"Already approved"
		);

	})

	
});