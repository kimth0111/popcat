const { default: axios } = require("axios");
const { session } = require("passport");
const SocketIO = require("socket.io");
const { saveDataTemp, getData } = require("./game");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  io.on("connection", (socket) => {
    const req = socket.request;
    console.log("game 접속!!", socket.id, socket.ip);

    socket.on("click", (data) => {
      console.log(data);
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
      saveDataTemp(data);
    });
    socket.emit("send", getData());
    const interval = setInterval(() => {
      const data = getData();
      socket.emit("send", data);
    }, 2000);
    socket.on("disconnect", () => {
      console.log("클라이언트 접속해제", socket.id);
      clearInterval(interval);
    });
  });
};
