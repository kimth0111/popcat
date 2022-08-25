const a = "https://popcat-dae.herokuapp.com";
const b = "http://localhost:8005";

const canvas = document.querySelector("#main-canvas");
const ctx = canvas.getContext("2d");
const imgList = [new Image(), new Image()];
imgList[0].src = "/popcat1.jpg";
imgList[1].src = "/popcat2.jpg";

let imgIndex = 0;
let isClick = false;
let isDrawing = false;
let count = 0;
let cntData = {};
let order;
let preOrder;
let isStart = true;

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
  console.log(imgIndex);
  ctx.drawImage(imgList[imgIndex], 0, 0, canvas.width, canvas.height);
}
const socket = io.connect(a, {
  path: "/socket.io",
});

socket.on("send", (data) => {
  console.log("데이터를 받음");
  console.table(data.grade[2]);
  cntData = { ...data };
  setOrder();
  draw();
  isStart = false;
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
  console.log(temp);
}

function getOrder(cl, arr) {
  let result;
  arr.forEach((el, index) => {
    if (el.class == cl) result = index;
  });
  return result + 1;
}

function draw() {
  const data = [...order];
  const trList = document.querySelectorAll("tr");
  trList.forEach((el, index) => {
    if (data[index].class == user.class) el.classList.add("my");
    else el.classList.remove("my");
    console.log(
      data[index].class,
      getOrder(data[index].class, order),
      getOrder(data[index].class, preOrder)
    );
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

    el.querySelector(".class").innerHTML = data[index].class + "반";
    el.querySelector(".change").innerHTML =
      "+" +
      (data[index].data - Number(el.querySelectorAll("td")[2].textContent));
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        el.querySelectorAll("td")[2].textContent =
          Number(el.querySelectorAll("td")[2].textContent) +
          Math.ceil(
            ((data[index].data -
              Number(el.querySelectorAll("td")[2].textContent)) /
              20.0) *
              i
          );
      }, i * 80);
    }
  });
}
