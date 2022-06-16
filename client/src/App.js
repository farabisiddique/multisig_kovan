// import logo from './logo.svg';
import './App.css';
import {getWeb3, getWallet} from './utils';
import {useState, useEffect} from 'react';
import Header from './Header';
import NewTransfer from './NewTransfer';
import TransferList from './TransferList';
import detectEthereumProvider from '@metamask/detect-provider';
import loadingGif from './img/loading.gif';
import farabiLogo from './img/farabisiddique.jpg'



function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts,setAccounts] = useState(undefined);
  const [wallet,setWallet] = useState(undefined);
  const [approvers,setApprovers] = useState(undefined);
  const [quorum,setQuorum] = useState(undefined);
  const [transfers,setTransfers] = useState([]);

  const getProvider = async () => {
    const theProvider = await detectEthereumProvider(); 
    return theProvider;
  }
  
  const getAccount = async () => {
    const provider = await getProvider();
    const accounts = await provider.request({ method: 'eth_accounts' });
    return accounts; 
  }

  useEffect( ()=>{
    const init = async ()=>{
      const web3 = await getWeb3();
      const accounts =  await getAccount();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfer().call();
      
      
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers); 
      setQuorum(quorum);
      setTransfers(transfers);
    };
    init();
  },[]);
  // console.log(accounts);
  const createTransfer = async (transfer)=>{ 
    await wallet.methods
      .createTransfer(transfer.amount,transfer.to)
      .send({from: accounts[0]});
      const transfers = await wallet.methods.getTransfer().call();
      
      setTransfers(transfers);
  }

  const approveTransfer = async (transferId)=>{
    
    await wallet.methods
    .approveTransfer(transferId)
    .send({from: accounts[0]});

    const transfers = await wallet.methods.getTransfer().call();
    setTransfers(transfers);
  }

  window.ethereum.on('accountsChanged', async function (accounts) {
    const newAccounts = await getAccount();
    setAccounts(newAccounts);
  })

  if(
    typeof web3 === 'undefined' ||
    typeof accounts === 'undefined' ||
    typeof wallet === 'undefined'
  ){

    return (
      <div className="loadingGif">
        <h1>Multisig Wallet with Kovan</h1>
        <h3>Please connect to the Kovan Testnet before using this dApp</h3>
        <h3>
          Developed by &nbsp;&nbsp;
          <a 
            href='https://www.linkedin.com/in/farabisiddique/'
            target="_blank"
          >
            Farabi Siddique
          </a>
        </h3>
        <h3>Give me advices on disccord: &nbsp; &nbsp; 
          <a 
            href='https://discord.com/users/828517663109677056'
            target="_blank"
          >
          <img 
            src={farabiLogo}
            className="farabiLogo"
          
          />&nbsp;
            Farabi Siddique
          </a>

        </h3>
        <h4>
          Github Repository of full smart contract: &nbsp;&nbsp;
          <a 
            href='https://github.com/farabisiddique/multisig_kovan'
            target="_blank"
          >
            Multisig Kovan
          </a>
        </h4>
        
        <img 
          src={loadingGif} 
        />
      </div>
    );

  }
  else{
    
    return (
      <div className="App">
        <h1>MultiSig Wallet</h1> 
        <p>Connected Account is: <b>{accounts[0]}</b></p>
        
        <Header 
          approvers={approvers}
          quorum = {quorum}
        
        />
        <NewTransfer 
          createTransfer={createTransfer}
          

        />
        <TransferList
          transfers={transfers}
          approve={approveTransfer}

        />
        <br />
        <p>
          Developed by &nbsp;&nbsp;
          <a 
            href='https://www.linkedin.com/in/farabisiddique/'
            target="_blank"
            className='specialLink'
          >
            Farabi Siddique
          </a>
        </p>
        <p>
          View the contract on Etherscan &nbsp;&nbsp;
          <a 
            href='https://kovan.etherscan.io/address/0x69b50bd2d21bb7f4f464bd1de0430ba2af9b24d0'
            target="_blank"
            className='specialLink'
          >
            https://kovan.etherscan.io/address/0x69b50bd2d21bb7f4f464bd1de0430ba2af9b24d0
          </a>
        </p>
        
      </div>
    );

  }

  
}

export default App;
