(function () {
  let folderButton = document.querySelector(".folderAdd");
  let fileButton = document.querySelector(".fileAdd");
  let albumButton = document.querySelector(".albumAdd");
  let templates = document.querySelector(".myTemplate");
  let folderContainer = document.querySelector(".container");
  let breadCrumb = document.querySelector(".breadCrumb");
  let closeButton = document.querySelector("#close");
  //adding event listener to root anchor tag
  let aRootTag = breadCrumb.querySelector("a[purpose='path']");
  aRootTag.addEventListener("click", viewFolderFromPath);

  // let folderDiv = document.importNode(folderDivTemplate, true) // make a copy of template
  //LOCALSTORAGE:
  //save in html-> array-> localstorage

  let resources = [];
  let cfid = -1; //pid parent id -> pid //root ke liye -1
  let rid = 0; // folder id -> rid

  let appBodyDiv = document.querySelector(".appBody");
  let menuBarDiv = document.querySelector(".menuBar");
  let appTitleDiv = document.querySelector(".appTitle");

  folderButton.addEventListener("click", addFolder);
  fileButton.addEventListener("click", addFile);
  albumButton.addEventListener("click", addAlbum);

  function addAlbum(){
    let fname = prompt("Enter album name", "default");
    if (fname != null) {
      fname.trim();
    }
    if (!fname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let alreadyExists = resources.some(
      (r) => r.rname == fname && r.pid == cfid && r.rtype == "textFile"
    );
    if (alreadyExists) {
      alert("album name already exist");
      return;
    }

    rid++;
    addAlbumHTML(fname, rid, cfid);

    resources.push({
      rid: rid,
      rtype: "album",
      pid: cfid,
      rname: fname,
    });

    saveToLS();
  }
  function addAlbumHTML(fname, rid, pid){
    let albumDivTemplate = templates.content.querySelector(".album");
    let albumDiv = document.importNode(albumDivTemplate, true); // make a copy of template

    let spanRename = albumDiv.querySelector("[action ='rename']");
    let spanDelete = albumDiv.querySelector("[action ='delete']");
    let spanView = albumDiv.querySelector("[action ='view']");
    let nameDiv = albumDiv.querySelector("[purpose = name]");

    // spanRename.addEventListener("click", handleFolderDelete.bind(this)())

    spanRename.addEventListener("click", handleAlbumRename);
    spanView.addEventListener("click", handleAlbumView);
    spanDelete.addEventListener("click", handleAlbumDelete);

    nameDiv.innerHTML = fname;
    albumDiv.setAttribute("rid", rid);
    albumDiv.setAttribute("pid", pid);

    folderContainer.append(albumDiv);
  }
  function handleAlbumRename(){
    let nfname = prompt("Enter new album name");
    if (nfname != null) {
      nfname.trim();
    }
    if (!nfname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let spanElement = this;
    let divAlbum = spanElement.parentNode;
    let divName = divAlbum.querySelector("[purpose = name]");

    let ofname = divName.innerHTML;

    if (ofname == nfname) {
      // new name validation
      alert("same as previous");
      return;
    }

    let alreadyExists = resources.some(
      (r) => r.rname == nfname && r.pid == cfid && r.rtype == "album"
    );
    if (alreadyExists) {
      // unique name validation
      alert("album name already exist");
      return;
    }

    let fidTBU = parseInt(divAlbum.getAttribute("rid"));

    //html change
    divName.innerHTML = nfname;

    //ram change
    let resource = resources.find((r) => r.rid == fidTBU);
    resource.rname = nfname;

    //localstorage
    saveToLS();
  }
  function handleAlbumDelete(){
    let delTag = this;
    let divAlbum = delTag.parentNode;
    let divName = divAlbum.querySelector("[purpose = name]");
    let albumNameTBD = divName.innerHTML;

    let fidTBD = parseInt(divAlbum.getAttribute("rid"));

    let sure = confirm(`are you sure you want to delete ${albumNameTBD}`);
    if (!sure) {
      return;
    }
    //htm;
    folderContainer.removeChild(divAlbum);

    //ram
    let albumIdx = resources.findIndex((r) => r.rid == fidTBD);
    resources.splice(albumIdx, 1);

    //storage
    saveToLS();
  }

  function handleAlbumView(){
    let spanElement = this;
    let divAlbum = spanElement.parentNode;
    let divName = divAlbum.querySelector("[purpose = name]");
    let nameOfFile = divName.innerHTML;

    let fidTBV = parseInt(divAlbum.getAttribute("rid"));

    let albumMenuTemplate = templates.content.querySelector(".album-menu");
    let albumMenu = document.importNode(albumMenuTemplate, true);

    let albumBodyTemplate = templates.content.querySelector(".album-body");
    let albumBody = document.importNode(albumBodyTemplate, true);

    menuBarDiv.innerHTML = "";
    menuBarDiv.appendChild(albumMenu);

    appBodyDiv.innerHTML = "";
    appBodyDiv.appendChild(albumBody);

    appTitleDiv.innerHTML = nameOfFile;
    appTitleDiv.setAttribute("rid", fidTBV);

    // let spanSave = menuBarDiv.querySelector("[action = 'save']");
    let spanAdd = menuBarDiv.querySelector("[action = 'add']");
    // let spanItalic = menuBarDiv.querySelector("[action = 'italic']");
    // let spanUnderline = menuBarDiv.querySelector("[action = 'underline']");
    // let inputBc = menuBarDiv.querySelector(".bc");
    // let inputFc = menuBarDiv.querySelector(".fc");
    // let fontTypeSelect = menuBarDiv.querySelector("#font-type");
    // let fontSizeSelect = menuBarDiv.querySelector("#font-size");
    // let download = menuBarDiv.querySelector("[action = 'download']");
    // let upload = menuBarDiv.querySelector("[action = 'upload']");
    // let textArea = appBodyDiv.querySelector("textArea");
    // let spanForUpload = menuBarDiv.querySelector("[action = 'forUpload']");

    spanAdd.addEventListener("click", function(){
      let urlOfImg = prompt("enter image url!");
      let img = document.createElement("img");
      img.setAttribute("src", urlOfImg);
      img.addEventListener("click", viewImgInMain);
      let imgListDiv = appBodyDiv.querySelector(".img-list");
      imgListDiv.appendChild(img);
    })



    // spanSave.addEventListener("click", fileSave);
    // spanBold.addEventListener("click", fileBold);
    // spanItalic.addEventListener("click", fileItalic);
    // spanUnderline.addEventListener("click", fileUnderline);
    // inputBc.addEventListener("change", fileBc);
    // inputFc.addEventListener("change", fileFc);
    // fontTypeSelect.addEventListener("change", fileFontType);
    // fontSizeSelect.addEventListener("change", fileFontSize);
    // download.addEventListener("click", downloadFile);
    // download.addEventListener("change", uploadFile);
    // upload.addEventListener("change", uploadFile);
    // let resource = resources.find((r) => r.rid == fidTBV);

    // spanBold.setAttribute("pressed", !resource.isBold);
    // spanItalic.setAttribute("pressed", !resource.isItalic);
    // spanUnderline.setAttribute("pressed", !resource.isUnderline);
    // inputBc.value=resource.bgColor;
    // inputFc.value=resource.fColor;
    // fontTypeSelect.value=resource.fFamily;
    // fontSizeSelect.value=resource.fSize;
    // textArea.value = resource.content;

    // spanBold.dispatchEvent(new Event ("click"));
    // spanItalic.dispatchEvent(new Event ("click"));
    // spanUnderline.dispatchEvent(new Event ("click"));
    // inputBc.dispatchEvent(new Event ("change"));
    // inputFc.dispatchEvent(new Event ("change"));
    // fontTypeSelect.dispatchEvent(new Event ("change"));
    // fontSizeSelect.dispatchEvent(new Event ("change"));

  }
  function viewImgInMain(){
    let imgInMainDiv = appBodyDiv.querySelector(".image-main > img");
    imgInMainDiv.setAttribute("src", this.getAttribute("src"));
    let imgList = appBodyDiv.querySelector(".img-list");
    let allImages = imgList.querySelectorAll("img");
    for(let i=0; i<allImages.length; i++){
      allImages[i].setAttribute("pressed", false);
    }
    
    this.setAttribute("pressed", true);
  }
  closeButton.addEventListener("click", function(){
    appTitleDiv.innerHTML = "title will come here";
    appTitleDiv.setAttribute("rid", "");
    menuBarDiv.innerHTML="";
    appBodyDiv.innerHTML="";
  })
  function addFile() {
    let fname = prompt("Enter file name", "default");
    if (fname != null) {
      fname.trim();
    }
    if (!fname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let alreadyExists = resources.some(
      (r) => r.rname == fname && r.pid == cfid && r.rtype == "textFile"
    );
    if (alreadyExists) {
      alert("File name already exist");
      return;
    }

    rid++;
    addFileHTML(fname, rid, cfid);

    resources.push({
      rid: rid,
      rtype: "textFile",
      pid: cfid,
      rname: fname,
    });

    saveToLS();
  }
  function handleFileRename() {
    let nfname = prompt("Enter new file name");
    if (nfname != null) {
      nfname.trim();
    }
    if (!nfname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let spanElement = this;
    let divFile = spanElement.parentNode;
    let divName = divFile.querySelector("[purpose = name]");

    let ofname = divName.innerHTML;

    if (ofname == nfname) {
      // new name validation
      alert("same as previous");
      return;
    }

    let alreadyExists = resources.some(
      (r) => r.rname == nfname && r.pid == cfid && r.rtype == "textFile"
    );
    if (alreadyExists) {
      // unique name validation
      alert("File name already exist");
      return;
    }

    let fidTBU = parseInt(divFile.getAttribute("rid"));

    //html change
    divName.innerHTML = nfname;

    //ram change
    let resource = resources.find((r) => r.rid == fidTBU);
    resource.rname = nfname;

    //localstorage
    saveToLS();
  }
  function handleFileDelete() {
    let delTag = this;
    let divFile = delTag.parentNode;
    let divName = divFile.querySelector("[purpose = name]");
    let fileNameTBD = divName.innerHTML;

    let fidTBD = parseInt(divFile.getAttribute("rid"));

    let sure = confirm(`are you sure you want to delete ${fileNameTBD}`);
    if (!sure) {
      return;
    }
    //htm;
    folderContainer.removeChild(divFile);

    //ram
    let fileIdx = resources.findIndex((r) => r.rid == fidTBD);
    resources.splice(fileIdx, 1);

    //storage
    saveToLS();
  }

  function fileBc() {
    let color = this.value;
    let textArea = appBodyDiv.querySelector("textArea");
    textArea.style.backgroundColor = color;
  }
  function fileFc() {
    let color = this.value;
    let textArea = appBodyDiv.querySelector("textArea");
    textArea.style.color = color;
  }

  function fileBold() {
    let textArea = appBodyDiv.querySelector("textArea");
    let pressed = this.getAttribute("pressed") == "true";

    if (pressed) {
      this.setAttribute("pressed", false);
      textArea.style.fontWeight = "normal";
    } else {
      this.setAttribute("pressed", true);
      textArea.style.fontWeight = "bold";
    }
  }
  function fileItalic() {
    let textArea = appBodyDiv.querySelector("textArea");
    let pressed = this.getAttribute("pressed") == "true";

    if (pressed) {
      this.setAttribute("pressed", false);
      textArea.style.fontStyle = "normal";
    } else {
      this.setAttribute("pressed", true);
      textArea.style.fontStyle = "italic";
    }
  }
  function fileUnderline() {
    let textArea = appBodyDiv.querySelector("textArea");
    let pressed = this.getAttribute("pressed") == "true";
    console.log(pressed);
    if (pressed) {
      this.setAttribute("pressed", false);
      textArea.style.textDecoration = "normal";
    } else {
      this.setAttribute("pressed", true);
      textArea.style.textDecoration = "underline";
    }
  }

  function fileFontType() {
    let type = this.value;
    let textArea = appBodyDiv.querySelector("textArea");
    textArea.style.fontFamily = type;
  }
  function fileFontSize() {
    let fontSize = this.value;
    // console.log(fontSize);
    let textArea = appBodyDiv.querySelector("textArea");
    textArea.style.fontSize = fontSize;
  }

  function fileSave() {
    let fid = parseInt(appTitleDiv.getAttribute("rid"));
    let textArea = appBodyDiv.querySelector("textArea");

    let resource = resources.find((r) => r.rid == fid);

    let spanBold = menuBarDiv.querySelector("[action = 'bold']");
    let spanItalic = menuBarDiv.querySelector("[action = 'italic']");
    let spanUnderline = menuBarDiv.querySelector("[action = 'underline']");

    let inputBc = menuBarDiv.querySelector(".bc");
    let inputFc = menuBarDiv.querySelector(".fc");

    let fontTypeSelect = menuBarDiv.querySelector("#font-type");
    let fontSizeSelect = menuBarDiv.querySelector("#font-size");

    resource.isBold = spanBold.getAttribute("pressed")== "true";
    resource.isItalic = spanItalic.getAttribute("pressed")== "true";
    resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
    resource.bgColor = inputBc.value;
    resource.fColor = inputFc.value;

    resource.fFamily = fontTypeSelect.value;
    resource.fSize = fontSizeSelect.value;
    resource.content = textArea.value;

    saveToLS();
  }

  function downloadFile(){
    let fid = parseInt(appTitleDiv.getAttribute("rid"));
    let resource = resources.find((r) => r.rid == fid);

    let aDownload = menuBarDiv.querySelector("a[purpose = 'download']");

    let strData = JSON.stringify(resource);
    let EncodedData = encodeURIComponent(strData);
    aDownload.setAttribute("href", "data:text/json;charset=UTF-8," +" "+ EncodedData);
    aDownload.setAttribute("download", resource.rname+".json");

    aDownload.click();

  }
  function uploadFile(){
    console.log("upload clicked");
    let file = window.event.target.files[0];

    let reader = new FileReader();
    

    reader.addEventListener("load", function(){
      console.log("upload loaded");
      let data =window.event.target.result;
      let resource = JSON.parse(data);
      console.log(resource);
    let spanBold = menuBarDiv.querySelector("[action = 'bold']");
    let spanItalic = menuBarDiv.querySelector("[action = 'italic']");
    let spanUnderline = menuBarDiv.querySelector("[action = 'underline']");
    let inputBc = menuBarDiv.querySelector(".bc");
    let inputFc = menuBarDiv.querySelector(".fc");
    let fontTypeSelect = menuBarDiv.querySelector("#font-type");
    let fontSizeSelect = menuBarDiv.querySelector("#font-size");
    
    let textArea = appBodyDiv.querySelector("textArea");

    spanBold.setAttribute("pressed", !resource.isBold);
    spanItalic.setAttribute("pressed", !resource.isItalic);
    spanUnderline.setAttribute("pressed", !resource.isUnderline);
    inputBc.value=resource.bgColor;
    inputFc.value=resource.fColor;
    fontTypeSelect.value=resource.fFamily;
    fontSizeSelect.value=resource.fSize;
    textArea.value = resource.content;

    spanBold.dispatchEvent(new Event ("click"));
    spanItalic.dispatchEvent(new Event ("click"));
    spanUnderline.dispatchEvent(new Event ("click"));
    inputBc.dispatchEvent(new Event ("change"));
    inputFc.dispatchEvent(new Event ("change"));
    fontTypeSelect.dispatchEvent(new Event ("change"));
    fontSizeSelect.dispatchEvent(new Event ("change"));


    })
    reader.readAsText(file);// this will fire load event and hence we will have to add event listener to reader initial to this

  }

  function handleFileView() {
    let spanElement = this;
    let divFile = spanElement.parentNode;
    let divName = divFile.querySelector("[purpose = name]");
    let nameOfFile = divName.innerHTML;

    let fidTBV = parseInt(divFile.getAttribute("rid"));

    let notePadMenuTemplate = templates.content.querySelector(".notepad-menu");
    let notePadMenu = document.importNode(notePadMenuTemplate, true);

    let notePadBodyTemplate = templates.content.querySelector(".notepad-body");
    let notePadBody = document.importNode(notePadBodyTemplate, true);

    menuBarDiv.innerHTML = "";
    menuBarDiv.appendChild(notePadMenu);

    appBodyDiv.innerHTML = "";
    appBodyDiv.appendChild(notePadBody);

    appTitleDiv.innerHTML = nameOfFile;
    appTitleDiv.setAttribute("rid", fidTBV);

    let spanSave = menuBarDiv.querySelector("[action = 'save']");
    let spanBold = menuBarDiv.querySelector("[action = 'bold']");
    let spanItalic = menuBarDiv.querySelector("[action = 'italic']");
    let spanUnderline = menuBarDiv.querySelector("[action = 'underline']");
    let inputBc = menuBarDiv.querySelector(".bc");
    let inputFc = menuBarDiv.querySelector(".fc");
    let fontTypeSelect = menuBarDiv.querySelector("#font-type");
    let fontSizeSelect = menuBarDiv.querySelector("#font-size");
    let download = menuBarDiv.querySelector("[action = 'download']");
    let upload = menuBarDiv.querySelector("[action = 'upload']");
    let textArea = appBodyDiv.querySelector("textArea");
    let spanForUpload = menuBarDiv.querySelector("[action = 'forUpload']");

    spanForUpload.addEventListener("click", function(){
      upload.click();
    })

    spanSave.addEventListener("click", fileSave);
    spanBold.addEventListener("click", fileBold);
    spanItalic.addEventListener("click", fileItalic);
    spanUnderline.addEventListener("click", fileUnderline);
    inputBc.addEventListener("change", fileBc);
    inputFc.addEventListener("change", fileFc);
    fontTypeSelect.addEventListener("change", fileFontType);
    fontSizeSelect.addEventListener("change", fileFontSize);
    download.addEventListener("click", downloadFile);
    download.addEventListener("change", uploadFile);
    upload.addEventListener("change", uploadFile);
    let resource = resources.find((r) => r.rid == fidTBV);

    spanBold.setAttribute("pressed", !resource.isBold);
    spanItalic.setAttribute("pressed", !resource.isItalic);
    spanUnderline.setAttribute("pressed", !resource.isUnderline);
    inputBc.value=resource.bgColor;
    inputFc.value=resource.fColor;
    fontTypeSelect.value=resource.fFamily;
    fontSizeSelect.value=resource.fSize;
    textArea.value = resource.content;

    spanBold.dispatchEvent(new Event ("click"));
    spanItalic.dispatchEvent(new Event ("click"));
    spanUnderline.dispatchEvent(new Event ("click"));
    inputBc.dispatchEvent(new Event ("change"));
    inputFc.dispatchEvent(new Event ("change"));
    fontTypeSelect.dispatchEvent(new Event ("change"));
    fontSizeSelect.dispatchEvent(new Event ("change"));
  }

  function addFileHTML(fname, rid, pid) {
    let fileDivTemplate = templates.content.querySelector(".textFile");
    let fileDiv = document.importNode(fileDivTemplate, true); // make a copy of template

    let spanRename = fileDiv.querySelector("[action ='rename']");
    let spanDelete = fileDiv.querySelector("[action ='delete']");
    let spanView = fileDiv.querySelector("[action ='view']");
    let nameDiv = fileDiv.querySelector("[purpose = name]");

    // spanRename.addEventListener("click", handleFolderDelete.bind(this)())

    spanRename.addEventListener("click", handleFileRename);
    spanView.addEventListener("click", handleFileView);
    spanDelete.addEventListener("click", handleFileDelete);

    nameDiv.innerHTML = fname;
    fileDiv.setAttribute("rid", rid);
    fileDiv.setAttribute("pid", pid);

    folderContainer.append(fileDiv);
  }

  function addFolder() {
    // console.log("clicked");
    let fname = prompt("Enter folder name", "default");
    if (fname != null) {
      fname.trim();
    }
    if (!fname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let alreadyExists = resources.some(
      (r) => r.rname == fname && r.pid == cfid
    );
    if (alreadyExists) {
      alert("Folder name already exist");
      return;
    }

    rid++;
    addFolderHTML(fname, rid, cfid);

    resources.push({
      rid: rid,
      rtype: "folder",
      pid: cfid,
      rname: fname,
    });

    saveToLS();
  }

  function handleRename() {
    let nfname = prompt("Enter new folder name");
    if (nfname != null) {
      nfname.trim();
    }
    if (!nfname) {
      // if(!fname) -> empty name validation
      alert("Empty name is not allowed");
      return;
    }
    let spanElement = this;
    let divFolder = spanElement.parentNode;
    let divName = divFolder.querySelector("[purpose = name]");

    let ofname = divName.innerHTML;

    if (ofname == nfname) {
      // new name validation
      alert("same as previous");
      return;
    }

    let alreadyExists = resources.some(
      (r) => r.rname == nfname && r.pid == cfid
    );
    if (alreadyExists) {
      // unique name validation
      alert("Folder name already exist");
      return;
    }

    let fidTBU = parseInt(divFolder.getAttribute("rid"));

    //html change
    divName.innerHTML = nfname;

    //ram change
    let resource = resources.find((r) => r.rid == fidTBU);
    resource.rname = nfname;

    //localstorage
    saveToLS();
  }

  function viewFolderFromPath() {
    let aTag = this;
    let fidTBV = parseInt(this.getAttribute("rid"));

    //bread crumb me changes
    while (aTag.nextSibling) {
      aTag.parentNode.removeChild(aTag.nextSibling);
    } // jab tk atag ka sibling present hai tab tk bread crumb me se uska sibling delete krte jao

    //container me changes
    cfid = fidTBV;
    folderContainer.innerHTML = "";
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].pid == cfid) {
        if (resources[i].rtype == "folder") {
          addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        } else if (resources[i].rtype == "textFile") {
          addFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }else if (resources[i].rtype == "album") {
          addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }
        // addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
      }
    }
  }

  function handleView() {
    // nameOfFolder = this.parentNode.querySelector("[purpose = name]").innerHTML;
    let spanElement = this;
    let divFolder = spanElement.parentNode;
    let divName = divFolder.querySelector("[purpose = name]");
    let nameOfFolder = divName.innerHTML;

    let fidTBV = parseInt(divFolder.getAttribute("rid"));

    anchorTemplate = templates.content.querySelector("a[purpose='path']");
    anchorTag = document.importNode(anchorTemplate, true);

    anchorTag.innerHTML = nameOfFolder;

    anchorTag.setAttribute("rid", fidTBV);

    anchorTag.addEventListener("click", viewFolderFromPath);

    breadCrumb.appendChild(anchorTag);

    //on html
    cfid = fidTBV;
    folderContainer.innerHTML = "";
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].pid == cfid) {
        if (resources[i].rtype == "folder") {
          addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        } else if (resources[i].rtype == "textFile") {
          addFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }else if (resources[i].rtype == "album") {
          addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }
        // addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid)
      }
    }
  }

  function deleteHelper(fidTBD) {
    let childrenOfFolder = resources.filter((r) => r.pid == fidTBD);

    for (let i = 0; i < childrenOfFolder.length; i++) {
      deleteHelper(childrenOfFolder[i].rid);
    }

    //removing foler from resources
    let fidx = resources.findIndex((r) => r.rid == fidTBD);
    resources.splice(fidx, 1);
    console.log(resources);
  }

  function handleDelete() {
    let delTag = this;
    let divFolder = delTag.parentNode;
    let divName = divFolder.querySelector("[purpose = name]");
    let folderTBD = divName.innerHTML;

    let fidTBD = parseInt(divFolder.getAttribute("rid"));

    let sure = confirm(`are you sure you want to delete ${folderTBD}`);
    if (!sure) {
      return;
    }
    folderContainer.removeChild(divFolder);

    //ram
    deleteHelper(fidTBD);

    //storage
    saveToLS();
  }

  function addFolderHTML(fname, rid, pid) {
    let folderDivTemplate = templates.content.querySelector(".folder");
    let folderDiv = document.importNode(folderDivTemplate, true); // make a copy of template

    let spanRename = folderDiv.querySelector("[action ='rename']");
    let spanDelete = folderDiv.querySelector("[action ='delete']");
    let spanView = folderDiv.querySelector("[action ='view']");
    let nameDiv = folderDiv.querySelector("[purpose = name]");

    // spanRename.addEventListener("click", handleFolderDelete.bind(this)())

    spanRename.addEventListener("click", handleRename);
    spanView.addEventListener("click", handleView);

    spanDelete.addEventListener("click", handleDelete);

    nameDiv.innerHTML = fname;
    folderDiv.setAttribute("rid", rid);
    folderDiv.setAttribute("pid", pid);

    folderContainer.append(folderDiv);
  }

  function saveToLS() {
    localStorage.setItem("data", JSON.stringify(resources));
  }

  function loadFromLS() {
    let rArr = localStorage.getItem("data");
    if (rArr == null) {
      // rArr == null
      return;
    }

    resources = JSON.parse(rArr);
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].pid == cfid) {
        if (resources[i].rtype == "folder") {
          addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        } else if (resources[i].rtype == "textFile") {
          addFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }else if (resources[i].rtype == "album") {
          addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        }
      }

      if (resources[i].rid > rid) {
        rid = resources[i].rid;
      }
    }
  }

  loadFromLS();
  // handleFolderDelete = ()=>{

  //     // console.log(this.parentNode.querySelector("[purpose = name]").innerHTML);
  // }
})();

//to prevent namespace pollution
