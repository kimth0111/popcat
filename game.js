const redis = require("redis");
const { app } = require("./app");
const jsonify = require("redis-jsonify");

const client = redis.createClient({ host: "127.0.0.1", port: 6379 });

let serverData = {};

const clickData = {
  time: 0,
  grade: {
    1: [0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0],
    3: [0, 0, 0, 0, 0, 0, 0, 0],
  },
};

client.connect();
client.on("connect", function () {
  console.log("connected!!");

  client.get("test").then((data) => {
    serverData = JSON.parse(data);
    if (!serverData)
      serverData = { time: clickData.time, grade: { ...clickData.grade } };

    setInterval(saveDataToServer, 1000);
  });
});

function saveDataTemp(data) {
  if (clickData.grade[data.user.grade]) {
    if (clickData.grade[data.user.grade][data.user.class - 1] != undefined) {
      console.log("click@");
      clickData.grade[data.user.grade][data.user.class - 1] =
        clickData.grade[data.user.grade][data.user.class - 1] + 1;
    }
  }
}

function saveDataToServer() {
  const change = { ...clickData.grade };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j++) {
      // console.log(serverData.grade[i + 1 + ""][j], change[i + 1 + ""][j]);
      serverData.grade[i + 1 + ""][j] =
        serverData.grade[i + 1 + ""][j] + change[i + 1 + ""][j];
    }
  }

  for (let i = 0; i < 3; i++) {
    clickData.grade[i + 1 + ""] = [0, 0, 0, 0, 0, 0, 0, 0];
    client.set("test", JSON.stringify(serverData));
  }
}

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

module.exports = { saveDataTemp, getData };
