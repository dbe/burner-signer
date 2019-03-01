const ethers = require('ethers');
let wallet;

$(() => {
  wallet = loadWallet();

  //User doesn't have a wallet setup
  if(wallet === null) {
    $('#no-wallet').toggleClass('d-none');

    $('#generate-wallet').click(function() {
      wallet = generateNewWallet()

      $('#no-wallet').toggleClass('d-none');
      loadHasWallet()
    })

  //User has a wallet
  } else {
    loadHasWallet()
  }
});

function generateNewWallet() {
  let wallet = ethers.Wallet.createRandom();
  localStorage.setItem('metaPrivateKey', wallet.privateKey);
  return wallet;
}

function loadHasWallet() {
  $('#has-wallet').toggleClass('d-none');

  if(window.opener) {
    window.opener.postMessage({topic: 'loaded'}, '*');
  }

  window.addEventListener("message", receiveMessage, false);
}

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
  if(!event.data) {
    throw("Malformed request. Requires data and topic")
  }

  if(event.data.topic === 'login') {
    loginDetails(event)

  } else if(event.data.topic ==='sign') {
    signDetails(event)
  }
}

function loginDetails(event) {
  $('#login-requested').toggleClass('d-none');
  $('#client-url').html(event.origin)
  $('#client-name').html(event.data.name)
  $('#wallet-address').html(wallet.address)

  $('#confirm').click(function() {
    wallet.signMessage(`login-with-burner:${event.data.challenge}`).then(signature => {
      event.source.postMessage({topic: 'login:success', signature: signature, address: wallet.address}, '*')
      window.close();
    });
  });
}

function signDetails(event) {
  $('#sign-requested').toggleClass('d-none');
  $('#client-url').html(event.origin)
  $('#client-name').html(event.data.name)

  let bnify = ethers.utils.bigNumberify;

  let tx = event.data.tx;
  $('#tx').html(JSON.stringify(tx))

  tx.gasPrice = bnify(tx.gasPrice);
  tx.gasLimit = bnify(tx.gasLimit);
  tx.value = bnify(tx.value);

  $('#confirm').click(function() {
    wallet.sign(event.data.tx).then(signed => {
      event.source.postMessage({topic: 'sign:success', signed }, '*')
      window.close();
    }).catch(e => {
      console.log('e: ', e);
    })
  });
}
