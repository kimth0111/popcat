const { db } = require("./game");

let serverData = {};
let userClick = {};

let clickData = [0, 0];
db.collection("data")
  .doc("data2")
  .get()
  .then((data) => {
    serverData = data.data();
    if (!serverData) serverData = {};
    else serverData = serverData.data;
    setInterval(saveDataToServer, 1000);
  });

function saveDataTemp2(data) {
  clickData[data.id - 1] = clickData[data.id - 1] + 1;
}
let frame = 0;
function saveDataToServer() {
  frame++;
  //   const change = { ...clickData.grade };
  serverData[0] = serverData[0] + clickData[0];
  serverData[1] = serverData[1] + clickData[1];
  if (frame % 40 == 0)
    db.collection("data").doc("data2").set({ data: serverData });
  clickData = [0, 0];
}

function getData2() {
  return [...serverData];
}

async function betting({kor, opp, number}){
  serverData[number] = {kor, opp};
  await db.collection("data").doc("data2").set({ data:serverData })
}
module.exports = { saveDataTemp2,betting, getData2 };
