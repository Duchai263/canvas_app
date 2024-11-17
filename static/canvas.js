let invCanvas = document.createElement('canvas');
var link = document.createElement('a');
let mode = "";
let check_upload = 0;
let globalheight = 0;
let globalwidth = 0;
window.onload = function () {
    document.getElementById('btn-draw').onclick = () => {
      upload();
    }
    mode = "drawing";
    document.getElementById('btn-segment').onclick = () => {
      if (mode === "drawing")
      {
        var img = document.getElementById('file-image')
        globalwidth = img.width;
        globalheight = img.height;
        mode = "segment";
        let segment_mode = document.getElementById('segment-image');
        document.getElementById("myCanvas").style.display = "none";
        document.getElementById("detectOnClick").classList.remove('hidden');
        segment_mode.src = document.getElementById("file-image").src;
        segment_mode.style = document.getElementById("file-image").style;
        segment_mode.addEventListener("click",handleClick);
        document.getElementById('file-drag').style.pointerEvents = "none";
        document.getElementById('file-drag').style.display = "none";
        save_mode()
        document.getElementById("btn-segment").textContent = "Draw Mask";
      }
      else if (mode === "segment")
      {
        if (check_upload === 1){
          mode = "drawing";
          document.getElementById("myCanvas").style.display = "block"
          document.getElementById("detectOnClick").classList.add('hidden')
        }
        else{
          upload();
          document.getElementById("myCanvas").style.display = "block"
          document.getElementById("detectOnClick").classList.add('hidden')
        }
        document.getElementById("btn-segment").textContent = "Segmentation";
      }
    }
};

let imagefile;

async function upload (){
  var img = document.getElementById('file-image')
  if (globalheight === 0)
  {
    globalwidth = img.width;
    globalheight = img.height;
  }
  check_upload = 1;
  var img_name = document.getElementById('message')
  var canvas = document.getElementById('myCanvas');
  document.getElementById("detectOnClick").classList.add('hidden')


  let canvas_img = canvas.toDataURL();

  await fetch('/upload_img', {
    method: 'POST',
    body: JSON.stringify({ upload_img: canvas_img, name: imagefile.name}),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.message === 'oke')
    {
      // let canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext('2d');

      if (img && ctx) {
            // Set the canvas size to match the image
            // document.getElementById('file-drag').style.height = 0; 
            document.getElementById('file-drag').style.pointerEvents = "none";

            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.width = globalwidth;
            canvas.height = globalheight; 
            img.style.display = 'none';
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            draw()
            save_mode()
            document.getElementById('file-drag').style.display = "none";
    }
    }
})
.catch(error => {
    console.error('Error:', error);
});
}

function save_mode (){
  document.getElementById('btn-draw').textContent = "Save"
            document.getElementById('btn-draw').onclick = () => {
              let canvas = document.getElementById("myCanvas");
              save()
              let img_result = document.getElementById('uploadedImage');
              img_result.style.width = "100%";
              img_result.style.height = "100%";
              img_result.classList.remove("hidden");
              if (mode === "drawing")
              {
                canvas.style.display = "none";
              }
              else if (mode === "segment"){
                document.getElementById('detectOnClick').style.display = "none";
              }
            }
}

function draw() {

    let canvas = document.getElementById('myCanvas');
    // invCanvas.classList.remove("hidden");
    // // document.getElementById('drawing-content').classList.remove("hidden");
    // // document.getElementById('btn-draw').textContent = 'Draw again'; 

    let ctx = canvas.getContext('2d');
    if (ctx) {
        invCanvas.width = canvas.width;
        invCanvas.height = canvas.height;
        var ctx2 = invCanvas.getContext('2d');
        ctx2.fillStyle='black';
        ctx2.fillRect(0,0,canvas.width,canvas.height);

    // Start painting

    var painting = false;


    ctx2.globalAlpha = 1;
    ctx2.imageSmoothingEnabled = false; 
    // Draw the uploaded image onto the canvas once it loads
    canvas.addEventListener('mousedown', async function () {
        painting = true;
    });

    // Stop painting
    canvas.addEventListener('mouseup', async function () {
        painting = false;
        ctx.beginPath(); // Reset the path after each stroke
        ctx2.beginPath();
    });

    // Drawing logic
    canvas.addEventListener('mousemove', async function (event) {
        if (!painting) return;

        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
        
        ctx2.lineWidth = 10;
        ctx2.lineCap = 'round';
        ctx2.strokeStyle = '#FFFFFF';
        
        // Adjust mouse coordinates to canvas offset
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
                
        ctx2.lineTo(x, y);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(x, y);
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    });

    }
  }

  async function save(){
    
    let imageData;
    if (mode === "drawing")
    {
      imageData = invCanvas.toDataURL();
    }
    else if (mode === "segment")
    {
      imageData = document.getElementById('canvas-segmentation').toDataURL()
    }

    await fetch('/download_canvas', {
      method: 'POST',
      body: JSON.stringify({ image_data: imageData,name:imagefile.name }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === 'oke')
      {
        document.getElementById('uploadedImage').src = data.img_name;
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
  }

// image upload 

// File Upload
// 
function ekUpload(){
  function Init() {
    
    //(1)
  
      var fileSelect    = document.getElementById('file-upload'),
          fileDrag      = document.getElementById('file-drag'),
          submitButton  = document.getElementById('submit-button');


          //(2)
      fileSelect.addEventListener('change', fileSelectHandler, false);
      // Is XHR2 available?
      // var xhr = new XMLHttpRequest();
      // if (xhr.upload) {
      //   // File Drop
      //   fileDrag.addEventListener('dragover', fileDragHover, false);
      //   fileDrag.addEventListener('dragleave', fileDragHover, false);
      //   fileDrag.addEventListener('drop', fileSelectHandler, false);
      // }
    }
  
    function fileDragHover(e) {
      var fileDrag = document.getElementById('file-drag');
  
      e.stopPropagation();
      e.preventDefault();
  
      fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }
  //(3)
    function fileSelectHandler(e) {
      // Fetch FileList object
      var files = e.target.files || e.dataTransfer.files;
  
      // Cancel event and hover styling
      fileDragHover(e);
  
      // Process all File objects
      for (var i = 0, f; f = files[i]; i++) {
        //(4)
        parseFile(f);
        //(5)
        // uploadFile(f);
      }
    }
  
    // Output
    function output(msg) {
      // Response
      var m = document.getElementById('messages');
      m.innerHTML = msg;
    }
  //(4)
    function parseFile(file) {
      imagefile = file;
      output(
        '<strong>' + encodeURI(file.name) + '</strong>'
      );
      
      var imageName = file.name;
  
      var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
      if (isGood) {
        document.getElementById('start').classList.add("hidden");
        document.getElementById('response').classList.remove("hidden");
        document.getElementById('notimage').classList.add("hidden");
        // Thumbnail Preview
        document.getElementById('file-image').classList.remove("hidden");
        document.getElementById('file-image').src = URL.createObjectURL(file);
      }
      else {
        document.getElementById('file-image').classList.add("hidden");
        document.getElementById('notimage').classList.remove("hidden");
        document.getElementById('start').classList.remove("hidden");
        document.getElementById('response').classList.add("hidden");
        document.getElementById("file-upload-form").reset();
      }
    }
  
    function setProgressMaxValue(e) {
      var pBar = document.getElementById('file-progress');
  
      if (e.lengthComputable) {
        pBar.max = e.total;
      }
    }
  
    function updateFileProgress(e) {
      var pBar = document.getElementById('file-progress');
  
      if (e.lengthComputable) {
        pBar.value = e.loaded;

      }
    }
  //(5)
    function uploadFile(file) {
  
      var xhr = new XMLHttpRequest(),
        fileInput = document.getElementById('class-roster-file'),
        pBar = document.getElementById('file-progress'),
        fileSizeLimit = 1024; // In MB
      if (xhr.upload) {
        // Check if file is less than x MB
        if (file.size <= fileSizeLimit * 1024 * 1024) {
          // Progress bar
          pBar.style.display = 'inline';
          xhr.upload.addEventListener('loadstart', setProgressMaxValue, true);
          xhr.upload.addEventListener('progress', updateFileProgress, true);
  
          // File received / failed
          xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
              // Everything is good!
  
              // progress.className = (xhr.status == 200 ? "success" : "failure");
              // document.location.reload(true);
            }
          };
  
          // Start upload
          xhr.open('POST', document.getElementById('file-upload-form').action, true);
          xhr.setRequestHeader('X-File-Name', file.name);
          xhr.setRequestHeader('X-File-Size', file.size);
          xhr.setRequestHeader('Content-Type', 'multipart/form-data');
          xhr.send(file);
        } else {
          output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
        }
      }
    }
  
    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
      Init();
    } else {
      document.getElementById('file-drag').style.display = 'none';
    }
  }
  ekUpload();

  import {
    InteractiveSegmenter,
    FilesetResolver
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"
  
  
  let interactiveSegmenter
  
  // Before we can use InteractiveSegmenter class we must wait for it to finish
  // loading. Machine Learning models can be large and take a moment to
  // get everything needed to run.
  const createSegmenter = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    )
    interactiveSegmenter = await InteractiveSegmenter.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite`,
          delegate: "GPU"
        },
        outputCategoryMask: true,
        outputConfidenceMasks: false
      }
    )
  }
  createSegmenter()
  
  /********************************************************************
   // Demo 1: Grab a bunch of images from the page and detection them
   // upon click.
   ********************************************************************/
  
  // In this demo, we have put all our clickable images in divs with the
  // CSS class 'detectionOnClick'. Lets get all the elements that have
  // this class.
  const imageContainers = document.getElementsByClassName("detectOnClick")
  const uploadFile = document.getElementById("uploadFile")
  const imageUpload = document.getElementById("imageUpload")
  
  // Handle the upload file event
  uploadFile.addEventListener("change", uploadedImage, false)
  
  function uploadedImage(event) {
    const reader = new FileReader()
    reader.onload = function() {
      const src = reader.result
      imageUpload.src = src
      imageUpload.style.display = "block"
      const canvas = imageUpload.parentElement.getElementsByClassName(
        "canvas-segmentation"
      )[0]
      const ctx = canvas.getContext("2d")
  
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const clickPoint = imageUpload.parentElement.getElementsByClassName(
        "click-point"
      )[0]
      clickPoint.style.display = "none"
    }
    reader.readAsDataURL(event.target.files[0])
  }
  
  // Handle clicks on the demo images
  for (let i = 0; i < imageContainers.length; i++) {
    imageContainers[i].children[0].addEventListener("click", handleClick)
  }
  
  /**
   * Detect segmentation on click
   */
  async function handleClick(event) {
    if (!interactiveSegmenter) {
      alert("InteractiveSegmenter still loading. Try again shortly.")
      return
    }
    console.log (event.target.height)
    interactiveSegmenter.segment(
      event.target,
      {
        keypoint: {
          x: event.offsetX / event.target.width,
          y: event.offsetY / event.target.height
        }
      },
      result => {
        drawSegmentation(result.categoryMask, event.target.parentElement)
        drawClickPoint(event.target.parentElement, event)
      }
    )
  }
  
  /**
   * Draw segmentation result
   */
  function drawSegmentation(mask, targetElement) {
    const width = mask.width
    const height = mask.height
    const maskData = mask.getAsFloat32Array()
    const canvas = targetElement.getElementsByClassName("canvas-segmentation")[0]
    canvas.width = width
    canvas.height = height
  
    console.log("Start visualization")
  
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#00000000"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  
    maskData.map((category, index) => {
      if (Math.round(category * 255.0) === 0) {
        const x = (index + 1) % width
        const y = (index + 1 - x) / width
        ctx.fillRect(x, y, 1, 1)
      }
    })
  }
  
  /**
   * Draw click point
   */
  function drawClickPoint(targetElement, event) {
    const clickPoint = targetElement.getElementsByClassName("click-point")[0]
    clickPoint.style.top = `${event.offsetY - 8}px`
    clickPoint.style.left = `${event.offsetX - 8}px`
    clickPoint.style.display = "block"
  }
  