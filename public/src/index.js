const a = "https://popcat-dae.herokuapp.com";
const b = "http://localhost:8005";
const c = location.href;

const canvas = document.querySelector("#main-canvas");
const ctx = canvas.getContext("2d");
const imgList = [new Image(), new Image()];
imgList[0].src = "/popcat1.jpg";
imgList[1].src = "/popcat2.jpg";

let imgIndex = 0;
let isClick = false;
let isDrawing = false;
let count = Number(localStorage.getItem("count")) | 0;
let cntData = {};
let order;
let preOrder;
let isStart = true;
let chatList = [];

const user = {
  grade: Number(localStorage.getItem("grade")) | 0,
  class: Number(localStorage.getItem("class")) | 0,
};

if (user.grade === 0 || user.grade === 0) {
  document.querySelector("div").style.display = "none";
  document.write("학년과 반을 작성해주세요!!");
  document.write("<a href='/set'>설정하러가기</a>");
}
if (isNaN(user.grade) || isNaN(user.class)) {
  document.querySelector("div").style.display = "none";
  document.write("숫자를 입력해주세요!!");
  document.write("<a href='/set'>설정하러가기</a>");
} else if (
  user.grade <= 0 ||
  user.grade > 3 ||
  user.class <= 0 ||
  user.class > 8
) {
  document.querySelector("div").style.display = "none";
  document.write("제대로된 학년,반을 입력해주세요!!!");
  document.write("<a href='/set'>설정하러가기</a>");
}
imgList[0].onload = () => {
  drawImg();
};

function drawImg() {
  ctx.drawImage(imgList[imgIndex], 0, 0, canvas.width, canvas.height);
}
const socket = io.connect(c, {
  path: "/socket.io",
});

socket.on("send", (data) => {
  cntData = { ...data };
  setOrder();
  draw();
  isStart = false;
});
socket.on("start", (data) => {
  console.log("start", data);
  chatList = data;
  drawChat();
});
socket.emit("start");
socket.on("chat", (data) => {
  console.log("hihi");
  chatList.unshift(data);
  drawChat();
});

canvas.addEventListener("click", () => {
  count++;
  document.querySelector(".counter").textContent = count;

  document.querySelector(".counter").classList.add("vibration");

  setTimeout(function () {
    document.querySelector(".counter").classList.remove("vibration");
  }, 400);

  socket.emit("click", {
    user,
  });
});

canvas.addEventListener("mouseup", () => {
  imgIndex = 0;
  drawImg();
  isClick = false;
  if (!isDrawing) {
    isDrawing = true;
    setTimeout(() => {
      isDrawing = false;
      if (!isClick) {
      }
    }, 10);
  }
});
canvas.addEventListener("mousedown", () => {
  imgIndex = 1;
  isClick = true;
  drawImg();
});

window.addEventListener("keyup", () => {
  imgIndex = 0;
  drawImg();
  isClick = false;
  if (!isDrawing) {
    isDrawing = true;
    setTimeout(() => {
      isDrawing = false;
      if (!isClick) {
      }
    }, 10);
  }
  count++;
  document.querySelector(".counter").textContent = count;

  document.querySelector(".counter").classList.add("vibration");

  setTimeout(function () {
    document.querySelector(".counter").classList.remove("vibration");
  }, 400);

  socket.emit("click", {
    user,
  });
});
window.addEventListener("keydown", () => {
  imgIndex = 1;
  isClick = true;
  drawImg();
});
function setOrder() {
  const temp = [...cntData.grade[2]];
  cntData.grade[2].forEach((el, index) => {
    temp[index] = {};
    temp[index].data = el;
    temp[index].class = index + 1;
  });
  temp.sort((a, b) => {
    if (a.data > b.data) return -1;
    else if (a.data < b.data) return +1;
    else return 0;
  });
  if (!isStart) {
    order = [...temp];
  } else {
    preOrder = [...temp];
    order = [...temp];
  }
}

function getOrder(cl, arr) {
  let result;
  arr.forEach((el, index) => {
    if (el.class == cl) result = index;
  });
  return result + 1;
}

function draw() {
  localStorage.setItem("count", count);
  const data = [...order];
  const trList = document.querySelectorAll("tr");
  trList.forEach((el, index) => {
    if (data[index].class == user.class) el.classList.add("my");
    else el.classList.remove("my");
    if (
      getOrder(data[index].class, order) > getOrder(data[index].class, preOrder)
    ) {
      el.classList.remove("up");
      el.classList.add("down");
    } else if (
      getOrder(data[index].class, order) < getOrder(data[index].class, preOrder)
    ) {
      el.classList.remove("down");
      el.classList.add("up");
    } else {
      // el.classList.remove("up");
      // el.classList.remove("down");
    }

    el.querySelector(".class").textContent = data[index].class + "반";
    el.querySelector(".change").textContent =
      "+" +
      (data[index].data - Number(el.querySelectorAll("td")[2].textContent));
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        el.querySelectorAll("td")[2].textContent =
          Number(el.querySelectorAll("td")[2].textContent) +
          Math.floor(
            ((data[index].data -
              Number(el.querySelectorAll("td")[2].textContent)) /
              20.0) *
              i
          );
      }, i * 80);
    }
  });
}

document.querySelector("form").addEventListener("submit", (el) => {
  el.preventDefault();
  console.log(el.target.content.value);
  const content = el.target.content.value;
  el.target.content.value = "";
  if (!content) return;
  console.log(content + "를 보냅니다");
  socket.emit("chat", { user, content });
  drawChat();
});

function drawChat() {
  const chatCon = document.querySelector("ul");
  chatCon.textContent = "";
  for (let i = 0; i < 5; i++) {
    console.log(chatList[i]);
    if (chatList.length - 1 < i) return;
    const li = document.createElement("li");
    const name = document.createElement("div");
    name.classList = "chat-name";
    const content = document.createElement("div");
    content.classList = "chat-content";
    const div = document.createElement("div");
    name.textContent = chatList[i].user.class + "반";
    content.textContent = chatList[i].content;
    div.style.display = "flex";
    div.append(name);
    div.append(content);
    li.append(div);
    chatCon.append(li);
  }
}
