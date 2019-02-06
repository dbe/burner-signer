const ethers = require('ethers');

if(window.opener) {
  window.opener.postMessage('loaded', '*')
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  if(event.data && event.data.command === 'sign') {
    postDetails(event)
  }
}

function postDetails(event) {
  let details = document.getElementById('details');
  let pk = localStorage.getItem('metaPrivateKey')

  //TODO: Make this a more robust pk check
  if(pk) {
    details.innerHTML = `
      <div>
        <p>${event.data.name} - ${event.origin}</p>
        <p>Is requesting access to your Burner Wallet's address.</p>
        <button id="confirm" style="background-color: green; color:white;width:100px;height:50px;">Allow</button>
      </div>
    `
  } else {
    details.innerHTML = `
      <div>
        <p>You don't have a burner wallet setup yet.</p>
      </div>
    `
  }

  document.getElementById('confirm').addEventListener('click', function() {
    try {
      let wallet = new ethers.Wallet(pk)
      wallet.signMessage(`login-with-burner:${event.data.challenge}`).then(signature => {
        event.source.postMessage({command: 'signed', signature: signature, address: wallet.address}, '*')
        window.close()
      })
    } catch(e) {
      event.source.postMessage({command: 'error', message: e}, '*')
    }
  })
}
