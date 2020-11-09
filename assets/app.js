// colors Project
function colorProject() {
  this.colorDivs = document.querySelectorAll(".color");
  this.sliders = document.querySelectorAll("input[type=range]");
  this.icons = document.querySelectorAll(".adj-icons");
  this.initialColors;
  this.generateBtn = document.querySelector(".generate-btn");
  this.colorCode = document.querySelectorAll(".color h2");
  this.copyContainer = document.querySelector(".copy-container");
  this.copyPop = document.querySelector(".copy-popup");
  this.sliderBtn = document.querySelectorAll(".slider-btn");
  this.slidersPop = document.querySelectorAll(".sliders");
  this.closeSlider = document.querySelectorAll(".close-slider");
}

// To Generate Random Colors
colorProject.prototype.randomColorGenerator = function () {
  return chroma.random();
};

// To Generate output
colorProject.prototype.colorBox = function () {
  initialColors = [];
  this.colorDivs.forEach((divs, index) => {
    let colors = this.randomColorGenerator();
    let hexText = divs.children[0];
    if (divs.querySelector(".unlock-btn").classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(colors).hex());
    }
    hexText.innerText = chroma(colors).hex();
    divs.style.backgroundColor = hexText.innerText;
    this.checkContrast(hexText.innerText, hexText);

    // Set Sliders
    let sliders = divs.querySelectorAll(".sliders input[type=range]");

    let color = chroma(colors);
    let hue = sliders[0];
    let brightness = sliders[1];
    let saturation = sliders[2];
    this.updateBackground(color, hue, brightness, saturation);
    this.updateTextUi(index);
  });
  this.resetSlider();
};

// Check Contrast
colorProject.prototype.checkContrast = function (color, text) {
  let luminance = Math.floor(chroma(color).luminance() * 100) / 100;
  if (luminance > 0.5) {
    text.style.color = "#000";
  } else {
    text.style.color = "#fff";
  }
};

// Update Colors in Sliders
colorProject.prototype.updateBackground = function (
  color,
  hue,
  brightness,
  saturation
) {
  // Saturation Level
  let minSaturation = color.set("hsl.s", 0);
  let maxSaturation = color.set("hsl.s", 1);
  let scaleSat = chroma.scale([minSaturation, color, maxSaturation]);

  // Brightness Level
  let midBright = color.set("hsl.l", 0.5);
  let scaleBright = chroma.scale(["#000", midBright, "#fff"]);

  //Updating BG in Sliders
  // Hue
  hue.style.backgroundImage =
    "linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))";

  // BRightness
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)},${scaleBright(2)})`;

  // Saturation
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )},${scaleSat(1)},${scaleSat(2)})`;
};

// Event of Slider
colorProject.prototype.playSlider = function (e) {
  let getIndex =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-light");
  let sliders = this.colorDivs[getIndex].querySelectorAll(".sliders input");
  let hue = sliders[0];
  let brightness = sliders[1];
  let saturation = sliders[2];

  let bgColor = this.colorDivs[getIndex].querySelector("h2");

  let color = chroma(initialColors[getIndex]);
  let allColors = color
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value)
    .set("hsl.s", saturation.value);
  bgColor.innerText = allColors.hex();

  // initialColors[getIndex] = allColors.hex();
  // console.log(allColors.hex());
  this.colorDivs[getIndex].style.backgroundColor = allColors;

  this.checkContrast(allColors, bgColor);
  this.updateBackground(allColors, hue, brightness, saturation);
};

// Resetting slider Value to its Colors position
colorProject.prototype.resetSlider = function () {
  this.colorDivs.forEach((slider, index) => {
    let slideRanger = slider.querySelectorAll("input");
    let hue = slideRanger[0];
    let brightness = slideRanger[1];
    let saturation = slideRanger[2];
    let hexText = this.colorDivs[index].querySelector("h2");
    let color = chroma(hexText.innerText);
    hue.value = color.hsl()[0];
    saturation.value = color.hsl()[1];
    brightness.value = color.hsl()[2];
  });
};

// Update Text UI's
colorProject.prototype.updateTextUi = function (index) {
  let activeDiv = this.colorDivs[index];
  let activeColors = chroma(activeDiv.style.backgroundColor);
  let icons = activeDiv.querySelectorAll(".adj-icons");
  this.checkContrast(chroma(activeColors), activeDiv.children[0]);
  icons.forEach((icon) => {
    this.checkContrast(activeColors, icon);
  });
};

// Copy ColorCode
colorProject.prototype.copyCode = function (e) {
  let textElement = document.createElement("textarea");
  textElement.value = e.target.innerText;
  document.body.appendChild(textElement);
  textElement.select();
  document.execCommand("copy");
  textElement.remove();
  this.clipBoard();
};
colorProject.prototype.clipBoard = function () {
  this.copyContainer.classList.add("active");
  this.copyPop.classList.add("active");
  this.copyPop.addEventListener("transitionend", () => {
    this.copyContainer.classList.remove("active");
    this.copyPop.classList.remove("active");
  });
};
colorProject.prototype.closeSlidePop = function (index) {
  this.slidersPop[index].classList.remove("active");
};
colorProject.prototype.slideAction = function (index) {
  this.slidersPop[index].classList.toggle("active");
};
// Instantiate
const colorPicker = new colorProject();

colorPicker.sliders.forEach((slider, index) => {
  slider.addEventListener("input", function (e) {
    colorPicker.playSlider(e);
  });
});
colorPicker.colorDivs.forEach((allDivs, index) => {
  allDivs.addEventListener("change", function () {
    colorPicker.updateTextUi(index);
  });
});
colorPicker.icons.forEach((icon) => {
  if (icon.classList.contains("unlock-btn")) {
    icon.addEventListener("click", function (e) {
      e.target.classList.toggle("locked");
      if (e.target.classList.contains("locked")) {
        e.target.children[0].classList.remove("fa-unlock");
        e.target.children[0].classList.add("fa-lock");
      } else {
        e.target.children[0].classList.add("fa-unlock");
        e.target.children[0].classList.remove("fa-lock");
      }
    });
  }
});
colorPicker.generateBtn.addEventListener("click", function () {
  colorPicker.colorBox();
});
colorPicker.colorCode.forEach((color) => {
  color.addEventListener("click", function (e) {
    colorPicker.copyCode(e);
  });
});
colorPicker.sliderBtn.forEach((slider, index) => {
  slider.addEventListener("click", () => {
    colorPicker.slideAction(index);
  });
});
colorPicker.closeSlider.forEach((slide, index) => {
  slide.addEventListener("click", function () {
    colorPicker.closeSlidePop(index);
  });
});

colorPicker.colorBox();

// Localstorage Functions from here
class StoreinLocal {
  constructor() {
    this.saveBtn = document.querySelector(".save-btn");
    this.saveContainer = document.querySelector(".save-container");
    this.closepopPalettes = document.querySelector(".close-save");
    this.paletteInput = document.getElementById("pal-name");
    this.saveSubmit = document.querySelector(".save-submit");
    this.clearBtn = document.querySelector(".clear-btn");
    this.colorArray = [];
    this.libraryBtn = document.querySelector(".library-btn");
    this.libraryContainer = document.querySelector(".library-container");
    this.closeLibrarypop = document.querySelector(".close-library");
    this.library = document.querySelector(".libraries");
    this.previewBtn = document.querySelectorAll(".select-colors");
    this.searchBar = document.querySelector(".search-colors");
  }
  // Open popup to save Palletes
  savePalettes() {
    this.saveContainer.classList.add("active");
    this.saveContainer.children[0].classList.add("active");
  }
  // Close Popup to save pallettes
  closesavePalletes() {
    this.saveContainer.classList.remove("active");
    this.saveContainer.children[0].classList.remove("active");
  }
  // LocalStorage Check
  checkLocalStorage() {
    let localColors;
    if (localStorage.getItem("palette") === null) {
      localColors = [];
    } else {
      localColors = JSON.parse(localStorage.getItem("palette"));
    }
  }
  // Submitting input Values
  submitValuesToLocal() {
    let paletteName = this.paletteInput.value;
    let paletteColors = initialColors;
    let id;

    let datas = JSON.parse(localStorage.getItem("palette"));
    if (datas) {
      id = datas.length;
    } else {
      id = this.colorArray.length;
    }

    let paletteObj = {
      id: id,
      name: paletteName,
      colors: paletteColors,
    };
    this.colorArray.push(paletteObj);

    // Pushing to localStorage
    let localColors;
    if (localStorage.getItem("palette") === null) {
      localColors = [];
    } else {
      localColors = JSON.parse(localStorage.getItem("palette"));
    }
    localColors.push(paletteObj);
    localStorage.setItem("palette", JSON.stringify(localColors));

    // Pushing to dynamic library
    let libraryDiv = document.createElement("div");
    let colorName = document.createElement("span");
    let colorList = document.createElement("div");
    let selectBtn = document.createElement("button");
    let trashBtn = document.createElement("button");
    trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
    trashBtn.classList.add(`delete`, `${id}`);

    selectBtn.classList.add("select-colors", `${id}`);
    selectBtn.innerText = "select";
    paletteObj.colors.forEach((colors, i) => {
      let colorBlocks = document.createElement("div");
      colorBlocks.style.backgroundColor = colors;
      colorBlocks.classList.add("library-colors");
      colorList.appendChild(colorBlocks);
      colorList.appendChild(selectBtn);
      colorList.classList.add("d-flex", "img-preview");
      colorList.appendChild(trashBtn);
    });
    colorName.innerText = paletteName;
    libraryDiv.appendChild(colorName);
    libraryDiv.appendChild(colorList);
    libraryDiv.classList.add("d-flex", "overall-lib");
    this.library.append(libraryDiv);
    this.closesavePalletes();
    this.paletteInput.value = "";
  }
  openLibrary() {
    this.libraryContainer.classList.add("active");
    this.libraryContainer.children[0].classList.add("active");
  }
  closeLibrary() {
    this.libraryContainer.classList.remove("active");
    this.libraryContainer.children[0].classList.remove("active");
    this.searchBar.value = "";
    let lib = document.querySelectorAll(".libraries .overall-lib");

    lib.forEach((li, index) => {
      li.style.display = "flex";
    });
  }

  // Pulling from LocalStorage and displaying
  showDynamicLibrary() {
    let localColors;
    if (localStorage.getItem("palette") === null) {
      localColors = [];
    } else {
      localColors = JSON.parse(localStorage.getItem("palette"));
      localColors.forEach((localcolor, index) => {
        let libraryDiv = document.createElement("div");
        let colorName = document.createElement("span");
        let colorList = document.createElement("div");
        let selectBtn = document.createElement("button");
        let trashBtn = document.createElement("button");
        trashBtn.innerHTML = `<i class="fa fa-trash"></i>`;
        trashBtn.classList.add(`delete`, `${index}`);
        selectBtn.classList.add("select-colors", `${index}`);
        selectBtn.innerText = "select";
        localcolor.colors.forEach((color) => {
          let colorBlocks = document.createElement("div");
          colorBlocks.style.backgroundColor = color;
          colorBlocks.classList.add("library-colors");
          colorList.appendChild(colorBlocks);
          colorList.appendChild(selectBtn);
          colorList.classList.add("d-flex", "img-preview");
          colorList.appendChild(trashBtn);
        });
        colorName.innerText = localcolor.name;
        libraryDiv.appendChild(colorName);
        libraryDiv.appendChild(colorList);
        libraryDiv.classList.add("d-flex", "overall-lib");
        this.library.append(libraryDiv);
      });
    }
  }
  selectColors(e) {
    if (e.target.classList.contains("select-colors")) {
      var localDataColors = JSON.parse(localStorage.getItem("palette"));
      let indexed = e.target.classList[1];
      initialColors = localDataColors[indexed].colors;
      document.querySelectorAll(".color").forEach((colors, index) => {
        colors.style.backgroundColor = initialColors[index];
        let pickedColor = chroma(initialColors[index]);
        let sliders = colors.querySelectorAll(".sliders input[type=range]");
        colors.querySelector("h2").innerText = initialColors[index];

        // Update input UI
        let actColor = chroma(pickedColor);
        let hue = sliders[0];
        let brightness = sliders[1];
        let saturation = sliders[2];
        colorPicker.updateBackground(actColor, hue, brightness, saturation);

        // Slider Position Reset
        hue.value = actColor.hsl()[0];
        saturation.value = actColor.hsl()[1];
        brightness.value = actColor.hsl()[2];
      });
    }
  }

  // Search Libraries
  searchLibrary(e) {
    let lowerAlph = e.target.value.toLowerCase();
    let searchOverall = this.library.querySelectorAll(".overall-lib span");
    searchOverall.forEach((search) => {
      if (search.innerText.toLowerCase().indexOf(lowerAlph) !== -1) {
        search.parentElement.style.display = "flex";
      } else {
        search.parentElement.style.display = "none";
      }
    });
  }
  // Delete Libraries
  deleteAction(e) {
    if (e.target.classList.contains("delete")) {
      let localColors;
      if (localStorage.getItem("palette") === null) {
        localColors = [];
      } else {
        localColors = JSON.parse(localStorage.getItem("palette"));
      }
      let targetedName =
        e.target.parentElement.previousElementSibling.innerText;

      let deletePreview = localColors.map((prev) => {
        return prev.name;
      });
      localColors.splice(deletePreview.indexOf(targetedName), 1);
      localStorage.setItem("palette", JSON.stringify(localColors));
      document
        .querySelectorAll(".overall-lib")
        [deletePreview.indexOf(targetedName)].remove();

      document.querySelectorAll(".delete").forEach((del, index) => {
        del.className = `delete ${index}`;
        document.querySelectorAll(".select-colors")[
          index
        ].className = `select-colors ${index}`;
      });
    }
  }
}

const localStore = new StoreinLocal();
localStore.saveBtn.addEventListener("click", function () {
  localStore.savePalettes();
});
localStore.closepopPalettes.addEventListener("click", function () {
  localStore.closesavePalletes();
});
localStore.saveSubmit.addEventListener("click", function () {
  localStore.submitValuesToLocal();
});
localStore.libraryBtn.addEventListener("click", function () {
  localStore.openLibrary();
});
localStore.closeLibrarypop.addEventListener("click", function () {
  localStore.closeLibrary();
});
localStore.library.addEventListener("click", function (e) {
  localStore.selectColors(e);
});
localStore.searchBar.addEventListener("keyup", function (e) {
  localStore.searchLibrary(e);
});
localStore.library.addEventListener("click", function (e) {
  localStore.deleteAction(e);
});

localStore.showDynamicLibrary();
// Clearing local storage
// localStore.clearBtn.addEventListener("click", () => localStorage.clear());
