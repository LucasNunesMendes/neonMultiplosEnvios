const readline = require('readline');
const Web3 = require('web3');
const web3 = new Web3('https://testnet.neonlink.io');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para coletar as entradas do usuário
function collectUserInputs(callback) {
  rl.question('Digite a chave privada da conta: ', (privateKey) => {
    rl.question('Digite o endereço de envio (Conta que está enviando): ', (senderAddress) => {
      rl.question('Digite a quantidade a ser enviada: ', (amount) => {
        rl.question('Digite a lista de endereços para enviar os tokens separados por ";": ', (toAddress) => {
          const addresses = toAddress.split(';').map(address => address.trim());
          callback(privateKey, senderAddress, amount, addresses);
          rl.close();
        });
      });
    });
  });
}

async function safeTransferTokens(_amount, _send, _addresses, privateKey) {
  let account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const gas = 21000;

  try {
    for (let i = 0; i < _addresses.length; i++) {
      const toAddress = _addresses[i];
      const tx = {
        from: _send,
        to: toAddress,
        value: web3.utils.toWei(_amount, 'ether'),
        gas: web3.utils.toHex(gas)
      };

      let _rawTransaction = await account.signTransaction(tx)
        .then(signed => web3.eth.sendSignedTransaction(signed.rawTransaction))
        .then((response) => {
          console.log(`Enviado com sucesso para o endereço ${toAddress}`);
          console.log(response);
        });
    }

    console.log("Transações concluídas.");
  } catch (error) {
    console.log(`${error} - Carteira ${_send}`);
  }
}

// Função principal para coletar os valores do usuário e chamar a função safeTransferTokens
function main() {
  collectUserInputs((privateKey, senderAddress, amount, addresses) => {
    safeTransferTokens(amount, senderAddress, addresses, privateKey);
  });
}

// Chamada da função principal
main();