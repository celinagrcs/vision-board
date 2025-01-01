import { dragAndDrop } from "@formkit/drag-and-drop";

document.addEventListener("DOMContentLoaded", () => {
  const visionBoard = document.getElementById("visionBoard");
  const addImage = document.getElementById("addImage");
  const inputFile = document.getElementById("inputFile");


  const dragAndDropInstance = dragAndDrop({
    el: visionBoard,
    items: '.draggable',
  })

  addImage.addEventListener("click", () => {
    inputFile.click();
  });

  inputFile.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          createImage(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    };
  });

  function createImage (src) {
    const img = document.createElement("img");
    img.src = src;
    img.className = "draggable";
    img.style.width = "100px";
    img.style.margin = "10px";

    img.setAttribute("draggable", "true")

    visionBoard.appendChild(img);

    dragAndDropInstance.update();
  }

})