const ethers = require('ethers');
const blockies = require('ethereum-blockies');

let wallet;

domReady(() => {
  wallet = loadWallet();
  console.log('wallet: ', wallet);

  //User doesn't have a wallet setup
  if(wallet === null) {
    document.getElementById('no-wallet').style.display = 'block';

  //User has a wallet
  } else {
    if(window.opener) {
      window.opener.postMessage('loaded', '*');
    }

    window.addEventListener("message", receiveMessage, false);


    //Setup blockie
  }
});


function loadWallet() {
  let pk = localStorage.getItem('metaPrivateKey');
  try {
    let wallet = new ethers.Wallet(pk);
    return wallet;
  } catch(e) {
    console.log('error loading wallet: ', e);
    return null;
  }
}

function receiveMessage(event) {
  if(event.data && event.data.command === 'sign') {
    postDetails(event)
  }
}

function postDetails(event) {
  // let details = document.getElementById('details');
  //
  //   details.innerHTML = `
  //     <div>
  //       <p>${event.data.name} - ${event.origin}</p>
  //       <p>Is requesting access to your Burner Wallet's address.</p>
  //       <button id="confirm" style="background-color: green; color:white;width:100px;height:50px;">Allow</button>
  //     </div>
  //   `
  //   document.getElementById('confirm').addEventListener('click', function() {
  //     try {
  //       let wallet = new ethers.Wallet(pk)
  //       wallet.signMessage(`login-with-burner:${event.data.challenge}`).then(signature => {
  //         event.source.postMessage({command: 'signed', signature: signature, address: wallet.address}, '*')
  //         window.close()
  //       })
  //     } catch(e) {
  //       event.source.postMessage({command: 'error', message: e}, '*')
  //     }
  //   })
  // } catch(e) {
  //   console.log('e: ', e);
  //   details.innerHTML = `
  //     <div>
  //       <p>You don't have a burner wallet setup yet.</p>
  //     </div>
  //   `
  // }
}

function domReady(fn) {
  document.addEventListener("DOMContentLoaded", fn);
  if (document.readyState === "interactive" || document.readyState === "complete" ) {
    fn();
  }
}
