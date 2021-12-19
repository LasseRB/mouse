const socket = io("ws://localhost:8081");
const el = document.getElementById("message");
let users = new Set();

socket.on("connect", () => {
  users.add(socket.id);
  document.getElementById("username").innerHTML = socket.id;
  redrawUsers();
});

window.addEventListener("mousemove", (mouse) => {
  socket.emit("mouse", { id: socket.id, x: mouse.clientX, y: mouse.clientY });
});

window.addEventListener("mousedown", () => {
  const mouse = document.getElementById(socket.id);
  piv(mouse.firstChild)
  socket.emit("piv", socket.id);
});

socket.on("other users", (other_users) => {
  const json = JSON.parse(other_users);
  console.log(json);
  json.forEach((user, index) => {
    console.log("a user ->", index, user);
    users.add(user);
    drawMouse(user);
  });

});

socket.on("user disconnected", (user) => {
  console.log("disconnected ->", user);
  users.delete(user);
  removeMouseFromDOM(user);
});

socket.on("user connected", (new_user) => {
  console.log("new user", new_user);
  users.add(new_user);
  drawMouse(new_user);
  // redrawUsers();
});

socket.on("mouseMove", (client) => {
  const mouse = document.getElementById(client.id);
  if (mouse != null || mouse != undefined) {
    animateMouse(mouse, client);
  }
});

socket.on("piv", (id) => {
  const mouse = document.getElementById(id);
 
  if (mouse != null || mouse != undefined) {
    piv( mouse.firstChild)
  }
});

// DOM
const animateMouse = (mouse, pos) => {
  return mouse.setAttribute(
    "style",
    "left:" +
      (pos.x - 25) +
      "px;" +
      "top:" +
      (pos.y - 25) +
      "px;" +
      "position:absolute"
  );
};
const redrawUsers = () => {
  const clients = document.querySelector(".clients");
  clients.innerHTML = "";
  console.log(clients);
  users.forEach((user) => {
    console.log("drawing", user);
    drawMouse(user, clients);
  });
};

const removeMouseFromDOM = (id, clients) => {
  const mouse = document.getElementById(id);
  if (mouse == undefined) {
    return;
  }
  if (clients == undefined || clients == null) {
    clients = document.querySelector(".clients");
  }
  clients.removeChild(mouse);
};

const drawMouse = (id, clients) => {
  const existsAlready = document.getElementById(id);
  if (existsAlready != undefined) {
    return;
  }

  if (clients == undefined || clients == null) {
    clients = document.querySelector(".clients");
  }

  const div = document.createElement("div");
  div.id = id;
  div.style = " position:absolute";

  const piv = document.createElement("p");
  piv.id = "piv"
  piv.textContent = 'piv!';
  piv.style.display = 'None';
  piv.style.width = 10;
  piv.style.paddingLeft = "45px";
  piv.style.position = "absolute";
  div.appendChild(piv);

  const mouse = document.createElement("img");
  mouse.src = "./mouse.png";
  mouse.width = 50;
  mouse.setAttribute(
    "style",
    "filter: saturate(600%) brightness(140%) drop-shadow(6px 6px 10px rgba(10,10,10,0.2)) hue-rotate(" +
      ((parseInt(id[(0, 4)]) * 1000) % 360) +
      "deg)"
  );

  document.body.appendChild(mouse);
  div.appendChild(mouse);
  clients.appendChild(div);
};

const piv = (div) => {
  console.log(div)
  div.style.display = "block";
  setTimeout( () => div.style.display = "none", 100)
}

window.onload = () => {
  console.log("refresh", users);
  redrawUsers();
};
