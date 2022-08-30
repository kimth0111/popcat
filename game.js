const redis = require("redis");
const { app } = require("./app");
const jsonify = require("redis-jsonify");
var admin = require("firebase-admin");
var firestore = require("firebase-admin/firestore");

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = firestore.getFirestore();

// const client = redis.createClient({ host: "127.0.0.1", port: 6379 });
const chatList = [];
let serverData = {};
let userClick = {};

const clickData = {
  time: 0,
  grade: {
    1: [0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 0, 0, 0, 0, 0, 0, 0],
  },
};
/**
 *
 * @param {{user:{class,grade}, content}} data
 */
function chat(data) {
  chatList.unshift(data);
  // console.log("챗입니다:", chatList);
}

// client.connect();
// client.on("connect", function () {
//   console.log("connected!!");

//   client.get("test").then((data) => {
//     serverData = JSON.parse(data);
//     if (!serverData)
//       serverData = { time: clickData.time, grade: { ...clickData.grade } };

//     setInterval(saveDataToServer, 1000);
//   });
// });
db.collection("data")
  .doc("data")
  .get()
  .then((data) => {
    serverData = data.data();
    if (!serverData)
      serverData = { time: clickData.time, grade: { ...clickData.grade } };
    setInterval(saveDataToServer, 1000);
  });

function saveDataTemp(data, id) {
  if (!userClick[id]) {
    userClick[id] = {
      click: 1,
      class: data.user.class,
    };
  } else {
    userClick[id].click = userClick[id].click + 1;
  }

  if (clickData.grade[data.user.grade]) {
    if (clickData.grade[data.user.grade][data.user.class - 1] != undefined) {
      clickData.grade[data.user.grade][data.user.class - 1] =
        clickData.grade[data.user.grade][data.user.class - 1] + 1;
    }
  }
}
let frame = 0;
function saveDataToServer() {
  for (let i in userClick) {
    if (userClick[i].click >= 60) {
      clickData.grade[2][userClick[i].class - 1] =
        clickData.grade[2][userClick[i].class - 1] - userClick[i].click;
      console.log("too many!!!!!!!!!!", userClick[i].class);
    }
  }
  userClick = {};
  frame++;
  const change = { ...clickData.grade };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j++) {
      serverData.grade[i + 1 + ""][j] =
        serverData.grade[i + 1 + ""][j] + change[i + 1 + ""][j];
    }
  }

  for (let i = 0; i < 3; i++) {
    clickData.grade[i + 1 + ""] = [0, 0, 0, 0, 0, 0, 0, 0];
    // client.set("test", JSON.stringify(serverData));
    if (frame % 40 == 0) db.collection("data").doc("data").set(serverData);
  }
}

/**
 *
 * @returns 서버테이터를 반환하는 함수입니다
 */
function getData() {
  return { ...serverData };
}
function delAllData() {
  client.del("test");
}
// delAllData();
function copyObj(obj1, obj2) {
  // for()
}

function getChat() {
  console.log(chatList);
  return chatList;
}
module.exports = { saveDataTemp, getData, getChat, chat, db };
