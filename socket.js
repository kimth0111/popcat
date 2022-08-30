const { default: axios } = require("axios");
const { session } = require("passport");
const SocketIO = require("socket.io");
const { saveDataTemp, getData, chat, getChat } = require("./game");
const { saveDataTemp2, getData2 } = require("./onetwo");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  io.on("connection", (socket) => {
    const req = socket.request;
    console.log("game 접속!!", socket.id, socket.ip);

    socket.on("click", (data) => {
      if (!data.user) return;
      // console.log(data);
      if (data.user.grade === 0 || data.user.grade === 0) {
        return;
      }
      if (isNaN(data.user.grade) || isNaN(data.user.class)) {
        return;
      } else if (
        data.user.grade <= 0 ||
        data.user.grade > 3 ||
        data.user.class <= 0 ||
        data.user.class > 8
      ) {
        return;
      }
      saveDataTemp(data, socket.id);
    });
    socket.on("chat", (data) => {
      chat(data);
      console.log("ghgjhg");
      io.emit("chat", data);
    });
    socket.emit("send", getData());
    const interval = setInterval(() => {
      const data = getData();
      socket.emit("send", data);
    }, 2000);
    socket.on("start", () => {
      const data = getChat();
      console.log(data);
      socket.emit("start", data);
    });

    socket.on("click2", (data) => {
      if (data.id != 1 && data.id != 2) return;
      saveDataTemp2(data);
    });
    socket.emit("send2", { data: getData2() });
    const interval2 = setInterval(() => {
      const data = getData2();
      socket.emit("send2", { data });
    }, 500);
    socket.on("disconnect", () => {
      console.log("클라이언트 접속해제", socket.id);
      clearInterval(interval);
      clearInterval(interval2);
    });
  });
};
