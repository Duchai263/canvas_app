let invCanvas = document.createElement('canvas');
let invCanvas_seg = document.createElement('canvas');
let mode = "";
let check_upload = 0;
let globalheight = 0;
let globalwidth = 0;
let diddraw = 0;
window.onload = async function () {
    document.getElementById('btn-draw').onclick = () => {
      upload();
    }
    mode = "drawing";
    document.getElementById('btn-segment').onclick = async () => {
      if (mode === "drawing")
      {
        mode = "segment";
        var img = document.getElementById('file-image')
        if (check_upload === 0)
        {
          globalwidth = img.width;
          globalheight = img.height;
          await upload()
        }
        let segment_mode = document.getElementById('segment-image');
        document.getElementById("myCanvas").style.display = "none";
        document.getElementById("penSizeSlider").style.display = "none";
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
        mode = "drawing";
        if (check_upload === 1){
          document.getElementById("myCanvas").style.display = "block";
          document.getElementById("penSizeSlider").style.display = "block";
          document.getElementById("detectOnClick").classList.add('hidden');
        }
        else{
          await upload();
          document.getElementById("myCanvas").style.display = "block";
          document.getElementById("penSizeSlider").style.display = "block";
          document.getElementById("detectOnClick").classList.add('hidden');
        }
        if (diddraw === 0)
        {
          draw()
          diddraw = 1;
        }
        document.getElementById("btn-segment").textContent = "Segmentation";
      }
    }
};

let imagefile;

async function upload (){
  var img = document.getElementById('file-image')
  if (mode === "drawing")
  {
    document.getElementById("penSizeSlider").style.display = "block";
    document.getElementById("detectOnClick").classList.add('hidden')
  }
  if (globalheight === 0)
  {
    globalwidth = img.width;
    globalheight = img.height;
  }

  var img_name = document.getElementById('message')
  var canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.width = globalwidth;
          canvas.height = globalheight; 
          img.style.display = 'none';
          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
      check_upload = 1;
      if (img && ctx) {
        if(mode === "drawing")
        {
          document.getElementById('file-drag').style.pointerEvents = "none";

          draw()
          save_mode()
          document.getElementById('file-drag').style.display = "none";
        }
            // Set the canvas size to match the image
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
                document.getElementById('penSizeSlider').style.display = "none";
              }
              else if (mode === "segment"){
                document.getElementById('detectOnClick').style.display = "none";
              }
            }
}

function draw() {

    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    if (ctx) {
        invCanvas.width = canvas.width;
        invCanvas.height = canvas.height;
        var ctx2 = invCanvas.getContext('2d');
        ctx2.fillStyle='black';
        ctx2.fillRect(0,0,canvas.width,canvas.height);
        var penSizeSlider = document.getElementById('penSizeSlider');
        var penSize = parseInt(penSizeSlider.value);

        penSizeSlider.addEventListener('input', function() {
            penSize = parseInt(penSizeSlider.value);
            console.log(penSize)
        });
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

        ctx.lineWidth = penSize;
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
      // imageData = document.getElementById('canvas-segmentation').toDataURL()
      imageData = invCanvas_seg.toDataURL();
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
  
      var fileSelect    = document.getElementById('file-upload');
      fileSelect.addEventListener('change', fileSelectHandler, false);
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
  
  
    function updateFileProgress(e) {
      var pBar = document.getElementById('file-progress');
  
      if (e.lengthComputable) {
        pBar.value = e.loaded;

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
    console.log (event.target)
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
    // result of API for sementation
    const width = mask.width
    const height = mask.height
    const maskData = mask.getAsFloat32Array()
    //drawing mask

    const canvas = targetElement.getElementsByClassName("canvas-segmentation")[0]
    canvas.width = width
    canvas.height = height
    invCanvas_seg.width = width
    invCanvas_seg.height = height
  
    console.log("Start visualization")
  
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#00000000"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"

    const ctx2 = invCanvas_seg.getContext("2d")
    ctx2.fillStyle = "#fffffff"
    ctx2.fillRect(0, 0, width, height)
    ctx2.fillStyle = "rgba(255, 255, 255)"
    
    maskData.map((category, index) => {
      if (Math.round(category * 255.0) === 0) {
        const x = (index + 1) % width
        const y = (index + 1 - x) / width
        ctx.fillRect(x, y, 1, 1)
        ctx2.fillRect(x, y, 1, 1)
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
  