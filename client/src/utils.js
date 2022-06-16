import { web3 } from '@openzeppelin/test-helpers/src/setup';
import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';


// const theContract = Wallet.deployed();
// console.log(`The wallet address is: ${theContract.address}`);

const getWeb3 = ()=>{
    // return new Web3("http://127.0.0.1:7545");
    return new Promise((resolve,reject)=>{

        window.addEventListener('load',async()=>{
            
            if(window.ethereum){
                const web3 = new Web3(window.ethereum);
                
                try{
                    // await window.ethereum.enable();
                    const status = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // setAccounts(accounts);
                    resolve(web3);
                    // console.log(status);
                }catch(error){
                    reject(error);
                }
            }
            else if(window.web3){
                resolve(window.web3);
            }
            else{
                reject("Must install metamask");
            }
        });

    


    });
}

const getWallet = async web3 =>{
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Wallet.networks[networkId];

    return new web3.eth.Contract(
        Wallet.abi,
        deployedNetwork && deployedNetwork.address

    );
    
}

export {getWeb3,getWallet}