let Web3 = require("web3");

// HTTP
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Websocket
// let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));

window.onload = load;
function load() {
  updateSelectBox();  //web3.eth.Accounts()를 통해 accounts 불러옴
}

// select 태그 안에 계정 목록 표시
async function updateSelectBox() {
  console.log("updateSelectBox");
  let accounts = await web3.eth.getAccounts();
  let selectTags = document.getElementsByClassName("accounts");
  for (let i = 0; i < selectTags.length; i++) {
    selectTags[i].innerHTML = "";
    for (let j = 0; j < accounts.length; j++) {
      selectTags[
        i
      ].innerHTML += `<option value='${accounts[j]}'>${accounts[j]}</option>`;
    }
  }
  showBalance();
}

// get
let select = document.getElementsByClassName("accounts")[0];
select.addEventListener("change", showBalance);
let log = document.getElementById("log");
log.innerHTML = "";

// 선택된 계정의 balance 표시
async function showBalance() {
  let selectTags = document.getElementsByClassName("accounts");
  let balanceTag = document.getElementById("balance");
  console.log("show balance");

  let address = selectTags[0].options[selectTags[0].selectedIndex].value;
  console.log(address);
  let balance = await web3.eth.getBalance(address);
  console.log(balance);
  balanceTag.innerHTML = web3.utils.fromWei(balance, "ether");
}

// sendBtn을 클릭하면 이더 전송
let sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", () => {
  // 데이터 가져오기
  let id = document.getElementById("id").value;
//   id = id.options[id.selectedIndex].value;
  let name = document.getElementById("name").value;
  let birth = document.getElementById("birth").value;
  let password = document.getElementById("password").value;

//   value = web3.utils.toWei(value, "ether");


  // 계정 언락
  web3.eth.personal.unlockAccount(id, password).then(async (unlocked) => {
    if (unlocked) {
      outputLog(log, `unlocked ? ${unlocked}, sending Transaction...`);
      // send a transaction
      let receipt = await web3.eth.sendTransaction({
        // from: fromAddr,
        // to: toAddr,
        value: id,
        value: birth,
         value: value,

        

      });
      outputLog(log, "Transaction Successfully sended");
      outputLog(log, "Transaction Receipt: ");
      outputLog(log, JSON.stringify(receipt, undefined, 2));
    }
  });
});

function outputLog(log, result) {
  log.innerHTML += "\n";
  log.innerHTML += result;
}