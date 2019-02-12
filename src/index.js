const ethers = require('ethers');

let wallet;

$(() => {
  wallet = loadWallet();

  //User doesn't have a wallet setup
  if(wallet === null) {
    $('#no-wallet').toggleClass('d-none');

  //User has a wallet
  } else {
    $('#has-wallet').toggleClass('d-none');

    if(window.opener) {
      window.opener.postMessage('loaded', '*');
    }

    window.addEventListener("message", receiveMessage, false);
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
  $('#client-url').html(event.origin)
  $('#client-name').html(event.data.name)
  $('#wallet-address').html(wallet.address)

  $('#confirm').click(function() {
    wallet.signMessage(`login-with-burner:${event.data.challenge}`).then(signature => {
      event.source.postMessage({command: 'signed', signature: signature, address: wallet.address}, '*')
      window.close();
    });
  });
}
