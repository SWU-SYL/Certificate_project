
let Web3 = require("web3");

// HTTP provider setting
// let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Websocket provider setting
let web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546")
);

window.onload = load;
function load() {
  showList();
}

// contract 가져오기
let CA = "0x8B9907B0F24B24670De5DaE1C54779E0517786C2";
let certificateJSON = require("./solidity/build/contracts/Student.json");//./certificate.jsons
let ABI = certificateJSON.abi;
let Certificate = new web3.eth.Contract(ABI, CA);

// show the all customer list
async function showList() {
  console.log("showList() call");
  const tbody1 = document.getElementById("tbody1");

  // event가 발생하면 테이블 추가
  Student.events.SetCertificateEvent({ fomBlock: "latest" }, (err, result) => {
    if (!err) {
      console.log("event detected");
      let arglist = result.returnValues;
      insertTable(tbody1, arglist);
    } else {
      console.error(err);
    }
  });

  // 기존의 데이터 가져오기
  const certificateList = await Certificate.methods.getCertificateList().call();
  for (let i = 0; i < certificateList.length; i++) {
    const result = await Certificate.methods.getCertificate(certificatetList[i]).call();
    insertTable(tbody1, result);
  }
}

// 테이블에 argList 내용을 차례대로 넣는다.
async function insertTable(tbody, arglist) {
  const row = tbody.insertRow();
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);

  cell1.innerHTML = await arglist.id;
  cell2.innerHTML = await arglist.name;
  cell3.innerHTML = await arglist.birth;
//   cell4.innerHTML = await arglist.grade;
}

// 등록버튼 클릭시
const setBtn = document.getElementById("setBtn");
setBtn.addEventListener("click", async () => {
  console.log("set button click");

  // input tag에서 값 가져오기
  let id = document.getElementById("id").value;
  id = parseInt(id);
  let name = document.getElementById("name").value;
  let birth = document.getElementById("birth").value;
  birth = parseInt(birth);


  // 트랜잭션을 발행할 계정 가져오기
  let accounts = await web3.eth.getAccounts();

  // Student contract의 setStudent() 호출
  Student.methods
    .setStudent(id, name, age)
    .send({ from: accounts[0] }, (err, result) => {
      if (!err) {
        console.log("Transaction successfully sended");
        console.log("hash: ", result);
      } else {
        console.err(err);
      }
    });
});

// event Filtering
let tbody2 = document.getElementById("tbody2");
let filterID = document.getElementById("filterID");
let filterAGE = document.getElementById("filterAGE");
let filterGRADE = document.getElementById("filterGRADE");

// ID filtering
filterID.addEventListener("keydown", (e) => {
  if (e.code !== "Enter") {
    return;
  }
  filterEvent(parseInt(filterID.value), null, null);
});

// AGE filtering
filterAGE.addEventListener("keydown", (e) => {
  if (e.code !== "Enter") {
    return;
  }
  filterEvent(null, parseInt(filterAGE.value), null);
});

// GRADE filtering
filterGRADE.addEventListener("keydown", (e) => {
  if (e.code !== "Enter") {
    return;
  }
  filterEvent(null, null, parseInt(filterGRADE.value));
});

function filterEvent(id, age, grade) {
  console.log("filterEvent() call");
  Student.getPastEvents(
    "SetStudentEvent",
    {
      filter: {
        id: id,
        age: age,
        grade: grade,
      },
      fromBlock: 0,
    },
    (err, result) => {
      if (!err) {
        document.getElementById("tbody2").innerHTML = "";
        console.log("event detected");
        for (let i = 0; i < result.length; i++) {
          let arglist = result[i].returnValues;
          insertTable(tbody2, arglist);
        }
      } else {
        console.error(err);
      }
    }
  );
}