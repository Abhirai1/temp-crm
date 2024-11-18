class FileUploader {
  // Add static property to store instances
  static instances = new Map();

  constructor(config) {
    this.uploadButton = document.getElementById(config.uploadButtonId);
    this.imageInput = document.getElementById(config.imageInputId);
    this.previewContainer = document.getElementById(config.previewContainerId);
    this.fileCountDisplay = document.getElementById(config.fileCountDisplayId);
    this.files = [];

    // Add scrollbar styles
    this.addScrollbarStyles(config.previewContainerId);

    // Initialize event listeners
    this.initializeEventListeners();
  }

  addScrollbarStyles(containerId) {
    const style = document.createElement("style");
    style.innerHTML = `
            #${containerId}::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            #${containerId}::-webkit-scrollbar-thumb {
                background: #00a15d;
                border-radius: 10px;
            }
            #${containerId}::-webkit-scrollbar-thumb:hover {
                background: #00a15d;
            }
            #${containerId}::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
        `;
    document.head.appendChild(style);
    // Store instance with a unique key
    // FileUploader.instances.set(config.uploadButtonId, this);
  }

  initializeEventListeners() {
    this.uploadButton.addEventListener("click", () => {
      this.imageInput.click();
    });

    this.imageInput.addEventListener("change", (event) => {
      const newFiles = Array.from(event.target.files);
      this.files = this.files.concat(newFiles);
      this.updatePreview();
    });
  }

  createFileWrapper() {
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      width: "100px",
      height: "100px",
      flexShrink: "0",
      overflow: "hidden",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      position: "relative",
    });
    return wrapper;
  }

  createCrossButton(index) {
    const button = document.createElement("button");
    button.innerHTML = "&#10005;";
    Object.assign(button.style, {
      position: "absolute",
      top: "2px",
      right: "2px",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "10",
    });

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.files.splice(index, 1);
      this.updatePreview();
    });

    return button;
  }

  getFileIcon(fileType) {
    const iconMap = {
      "application/pdf":
        "https://img.icons8.com/?size=80&id=mcyAsTDJNTI9&format=png",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "https://img.icons8.com/?size=48&id=xdyzXTtWRBOu&format=png",
      "application/vnd.ms-excel":
        "https://img.icons8.com/?size=48&id=xdyzXTtWRBOu&format=png",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBfrd5iUDDLG-V2xS_Kwh0taIBRitiUl3zfzqcIeOkirJUuzg-1n8pn8eVky2-h2MjA_I&usqp=CAU",
      "application/vnd.ms-powerpoint":
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBfrd5iUDDLG-V2xS_Kwh0taIBRitiUl3zfzqcIeOkirJUuzg-1n8pn8eVky2-h2MjA_I&usqp=CAU",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "https://img.icons8.com/?size=80&id=xQya0Qe4iwM5&format=png",
      "application/msword":
        "https://img.icons8.com/?size=80&id=xQya0Qe4iwM5&format=png",
      "image/heic":
        "https://img.icons8.com/?size=48&id=k2KV1MfxLwJf&format=png",
      "image/heif":
        "https://img.icons8.com/?size=48&id=k2KV1MfxLwJf&format=png",
      video:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLwn7NxE9nf5h5D0pbu1JByji4mBhjAVeUQ&s",
      audio: "https://img.icons8.com/color/48/000000/audio-file.png",
      "text/plain": "https://img.icons8.com/color/48/000000/txt.png",
      "application/zip": "https://img.icons8.com/color/48/000000/zip.png",
      "application/x-zip-compressed":
        "https://img.icons8.com/color/48/000000/zip.png",
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs-O5tcW-3DezbTeUFyUg5EBpU3U5_2aBqjQ&s",
    };

    const type = fileType.split("/")[0];
    return iconMap[fileType] || iconMap[type] || iconMap.default;
  }

  createPreviewElement(file, index) {
    const fileWrapper = this.createFileWrapper();
    const crossButton = this.createCrossButton(index);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        Object.assign(img.style, {
          width: "100%",
          height: "100%",
          objectFit: "cover",
        });
        fileWrapper.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoThumbnail = document.createElement("div");
      Object.assign(videoThumbnail.style, {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });

      const playIcon = document.createElement("i");
      playIcon.className = "fas fa-play";
      playIcon.style.color = "#fff";
      playIcon.style.fontSize = "24px";

      videoThumbnail.appendChild(playIcon);
      fileWrapper.appendChild(videoThumbnail);
    } else {
      const icon = document.createElement("img");
      icon.src = this.getFileIcon(file.type);
      Object.assign(icon.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain",
      });
      fileWrapper.appendChild(icon);

      if (file.type === "application/pdf") {
        fileWrapper.addEventListener("click", () => {
          window.open(URL.createObjectURL(file), "_blank");
        });
      }
    }

    fileWrapper.appendChild(crossButton);
    return fileWrapper;
  }

  updatePreview() {
    this.previewContainer.innerHTML = "";
    this.fileCountDisplay.textContent = `${this.files.length} files`;

    this.files.forEach((file, index) => {
      const previewElement = this.createPreviewElement(file, index);
      this.previewContainer.appendChild(previewElement);
    });
  }

  // Method to get the current files
  getFiles() {
    return this.files;
  }

  // Add static method to get instance
  static getInstance(uploaderId) {
    return FileUploader.instances.get(uploaderId);
  }

  // Method to clear all files
  clearFiles() {
    this.files = [];
    this.updatePreview();
  }
}


document.addEventListener("DOMContentLoaded", function () {

    const proposalAttachment = new FileUploader({
      uploadButtonId: "upload-button-proposal",
      imageInputId: "image-input-proposal",
      previewContainerId: "preview-container-proposal",
      fileCountDisplayId: "file-count-proposal",
    });

    const siteSurveyAttachment = new FileUploader({
      uploadButtonId: "upload-button-sitesurvey",
      imageInputId: "image-input-sitesurvey",
      previewContainerId: "preview-container-sitesurvey",
      fileCountDisplayId: "file-count-sitesurvey",
    });

    const architecturalAttachment = new FileUploader({
      uploadButtonId: "upload-button-architectural",
      imageInputId: "image-input-architectural",
      previewContainerId: "preview-container-architectural",
      fileCountDisplayId: "file-count-architectural",
    });

    const roofAttachment = new FileUploader({
      uploadButtonId: "upload-button-roof-top",
      imageInputId: "image-input-roof-top",
      previewContainerId: "preview-container-roof-top",
      fileCountDisplayId: "file-count-roof-top",
    });

    const atticAttachment = new FileUploader({
      uploadButtonId: "upload-button-attic-pics",
      imageInputId: "image-input-attic-pics",
      previewContainerId: "preview-container-attic-pics",
      fileCountDisplayId: "file-count-attic-pics",
    });

     const meterPanelAttachment = new FileUploader({
       uploadButtonId: "upload-button-meter-pics",
       imageInputId: "image-input-meter-pics",
       previewContainerId: "preview-container-meter-pics",
       fileCountDisplayId: "file-count-meter-pics",
     });

     const mainPanelAttachment = new FileUploader({
       uploadButtonId: "upload-button-main-panel-pics",
       imageInputId: "image-input-main-panel-pics",
       previewContainerId: "preview-container-main-panel-pics",
       fileCountDisplayId: "file-count-main-panel-pics",
     });

      const subPannelAttachment = new FileUploader({
        uploadButtonId: "upload-button-sub-panel-pics",
        imageInputId: "image-input-sub-panel-pics",
        previewContainerId: "preview-container-sub-panel-pics",
        fileCountDisplayId: "file-count-sub-panel-pics",
      });


  // Example function to get all files when submitting form
  window.submitPropertyForm = function () {
    const formData = new FormData();

    // Get files from each uploader
    const propertyPhotos = propertyPhotosUploader.getFiles();
    const floorPlans = floorPlanUploader.getFiles();
    const documents = documentsUploader.getFiles();
    const kitchenPhotos = kitchenUploader.getFiles();
    const bathroomPhotos = bathroomUploader.getFiles();

    // Add files to FormData
    propertyPhotos.forEach((file) => formData.append("propertyPhotos[]", file));
    floorPlans.forEach((file) => formData.append("floorPlans[]", file));
    documents.forEach((file) => formData.append("documents[]", file));
    kitchenPhotos.forEach((file) => formData.append("kitchenPhotos[]", file));
    bathroomPhotos.forEach((file) => formData.append("bathroomPhotos[]", file));

    // Log for debugging
    console.log("Submitting files:", {
      propertyPhotos: propertyPhotos.length,
      floorPlans: floorPlans.length,
      documents: documents.length,
      kitchenPhotos: kitchenPhotos.length,
      bathroomPhotos: bathroomPhotos.length,
    });

    // Here you would typically send formData to your server
    // fetch('/api/submit-property', {
    //     method: 'POST',
    //     body: formData
    // });
  };

  // Example function to reset all uploaders
  window.resetPropertyForm = function () {
    propertyPhotosUploader.clearFiles();
    floorPlanUploader.clearFiles();
    documentsUploader.clearFiles();
    kitchenUploader.clearFiles();
    bathroomUploader.clearFiles();
  };
});