import { obj } from "./object.js";

const loadZone = document.querySelector("div");
const input = document.querySelector("input");
let file;
let stroka = "";

loadZone.addEventListener("click", () => {
  input.click();
  input.addEventListener("change", () => {
    console.log(input.files);
    file = input.files[0];
    console.log(file);
    handleFile(file);
  });
});

const handleFile = (file) => {
  loadZone.remove();
  input.remove();
  document.querySelector("h1").remove();
  const type = file.type.replace(/\/.+/, "");
  switch (type) {
    case "text":
      createText(file);
      break;
    default:
      document.body.innerHTML = `<h3>НЕИЗВЕСТНЫЙ ФОРМАТ ФАЙЛА</h3>`;
      const timer = setTimeout(() => {
        location.reload();
        clearTimeout(timer);
      }, 2000);
      break;
  }
};

const createText = (text) => {
  const reader = new FileReader();
  reader.readAsText(text, "windows-1251");
  reader.onload = () => {
    let ultx = document.createElement("ol");
    ultx.className = "inputtext";
    var cheki = reader.result.split(/\r?\n/);
    document.body.append(ultx);
    let donetxt = document.createElement("h2");
    donetxt.innerHTML = `Файл выгружен из браузера`;
    document.body.append(donetxt);


    for (let i = 0; i < cheki.length; i++) {
      let item = document.createElement("li");
      item.innerHTML = `${cheki[i]}`;
      document.querySelector("ol").append(item);
      for (let key1 in obj) {
        if (cheki[i].includes(key1)) {
          for (let key2 in obj[key1]) {
            if (cheki[i].includes(key2)) {
              obj[key1][key2] = cheki[i];
              stroka = stroka + `/${key1}/${cheki[i]}\n`;
            }
          }
        }
      }
    }

    for (let key1 in obj) {
      for (let key2 in obj[key1]) {
        if (!obj[key1][key2]) {
          obj["неоплачено"][key1] = [...obj["неоплачено"][key1], key2];
        }
      }
    }

    stroka = stroka + "не оплачены: \n";
    for (let key in obj["неоплачено"]) {
      stroka = stroka + ` ${key} : ${obj["неоплачено"][key]} \n`;
    }
     
    let resgrid = document.createElement("div");
    resgrid.className = "grid";
    for (let key in obj) {
      let month = document.createElement("div");
      month.className = "month";
      let m = document.createElement("h3");
      m.innerHTML = key;
      month.append(m);

      for (let key2 in obj[key]) {
        let ch = document.createElement("p");
        if (obj[key][key2]) {
          key !== "неоплачено"
            ? (ch.innerHTML = obj[key][key2])
            : obj[key][key2].length > 0 &&
              (ch.innerHTML = `${key2} : ${obj[key][key2]}`);
          month.append(ch);
        }
      }
      resgrid.append(month);
    }
    document.body.append(resgrid);
    let blob = new Blob([stroka], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "чеки_по_папкам.txt");
    link.click();
  };
};
