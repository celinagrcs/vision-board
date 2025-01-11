import html2canvas from "html2canvas";
import interact from "interactjs";

document.addEventListener("DOMContentLoaded", () => {
  const visionBoard = document.getElementById("visionBoard");
  const addImage = document.getElementById("addImage");
  const inputFile = document.getElementById("inputFile");
  const exportButton = document.getElementById("exportImage")

  // cargar estado del vision board
  function loadVisionBoard() {
    const savedData = localStorage.getItem("visionBoard");
    if (savedData) {
      const images = JSON.parse(savedData);
      images.forEach(({ src, width,  x, y }) => {
        createImage(src, width, parseFloat(x), parseFloat(y));
      });
    }
  }

  // guardar el estado del vision board
  function saveVisionBoard() {
    const images = [];
    visionBoard.querySelectorAll("figure").forEach((container) => {
      const img = container.querySelector("img");
      const rect = container.getBoundingClientRect();
      images.push({
        src: img.src,
        width: img.style.width,
        x: container.dataset.x || 0,
        y: container.dataset.y || 0,
      });
    });
    localStorage.setItem("visionBoard", JSON.stringify(images));
  }


  // input para seleccionar imágenes
  addImage.addEventListener("click", () => {
    inputFile.click();
  });

  // manejo de selección de imágenes
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
    }
  });

  // crea imágenes y las actualiza en el visionBoard
  function createImage(src, initialWidth = "200px", initialX = 0, initialY = 0) {
    // creación del contenedor
    const container = document.createElement("figure");
    container.style.position = "absolute";
    container.style.transform = `translate(${initialX}px, ${initialY}px)`;
    container.dataset.x = initialX;
    container.dataset.y = initialY;

    // contenedor de las imagenes
    const draggableWrapper = document.createElement("div");
    draggableWrapper.style.position = "relative";
    draggableWrapper.style.position = "relative";
    draggableWrapper.style.transform = "translate(0, 0)";
    draggableWrapper.dataset.x = initialX;
    draggableWrapper.dataset.y = initialY;

    // creación de la imagen
    const img = document.createElement("img");
    img.src = src;
    img.className = "draggable";
    img.style.width = initialWidth;
    img.alt = "imagen en el tablero";
    img.style.cursor = "grab";
    draggableWrapper.appendChild(img);

   // panel de controles
    const controls = document.createElement("div");
    controls.style.position = "absolute";
    controls.style.bottom = "0";
    controls.style.left = "0";
    controls.style.width = "100%";
    controls.style.display = "flex";
    controls.style.justifyContent = "space-between";
    controls.style.alignItems = "center";
    controls.style.background = "#ffead1";
    controls.style.borderBottomRightRadius = "10px";
    controls.style.borderBottomLeftRadius = "10px";
    controls.style.padding = "2px";

    // boton para agrandar
    const bigSizeButton = document.createElement("button");
    bigSizeButton.style.border = "none";
    bigSizeButton.style.cursor = "pointer";


    // creación del icono
    const bigSizeIcon = document.createElement("i");
    bigSizeIcon.className = "bi bi-plus-circle-dotted";
    bigSizeIcon.style.color = "black";
    bigSizeIcon.style.fontSize = "1.2rem";
    bigSizeButton.appendChild(bigSizeIcon);

    bigSizeButton.addEventListener("click", () => {
      const newWidth = parseInt(img.style.width) + 20; 
      img.style.width = `${newWidth}px`;
      saveVisionBoard();
    });

    // boton para disminuir tamaño
    const smallSizeButton = document.createElement("button");
    smallSizeButton.style.border = "none";
    smallSizeButton.style.cursor = "pointer";

    // creación del icono
    const smallSizeIcon = document.createElement("i");
    smallSizeIcon.className = "bi bi-dash-circle-dotted";
    smallSizeIcon.style.color = "black";
    smallSizeIcon.style.fontSize = "1.2rem";
    smallSizeButton.appendChild(smallSizeIcon);

    smallSizeButton.addEventListener("click", () => {
      const newWidth = Math.max(parseInt(img.style.width) - 20, 20); 
      img.style.width = `${newWidth}px`;
      saveVisionBoard();
    });


    // creación de boton para eliminar
    const deleteButton = document.createElement("button");
    deleteButton.style.borderRadius = "30%";
    deleteButton.style.cursor = "pointer";

    // creación del ícono de Bootstrap
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash3"; 
    deleteIcon.style.fontSize = "1.1rem";
    deleteButton.appendChild(deleteIcon); 

    deleteButton.addEventListener("click", () => {
      container.remove();
      saveVisionBoard();
    })

    controls.appendChild(bigSizeButton);
    controls.appendChild(smallSizeButton);
    controls.appendChild(deleteButton);

    container.appendChild(img);
    container.appendChild(draggableWrapper);
    container.appendChild(controls);
    visionBoard.appendChild(container);

    // interact.js
    interact(container)
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;

            const x = (parseFloat(target.dataset.x) || 0) + event.dx;
            const y = (parseFloat(target.dataset.y) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.dataset.x = x;
            target.dataset.y = y;
          },
          end() {
            saveVisionBoard();
          }
        }
      })

    saveVisionBoard();
  }

  // exportar imagenes
  exportButton.addEventListener(("click"), () => {
    html2canvas(visionBoard, { useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "vision-board.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  loadVisionBoard();
});
