import { setImage, click, inpainting } from './segmentAPI.js'

let invCanvas = document.createElement('canvas');
let invCanvas_seg = document.createElement('canvas');
let imgHolder = document.createElement('canvas');
const history = [];
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
    if (mode === "drawing") {
      mode = "segment";
      var img = document.getElementById('file-image')
      if (check_upload === 0) {
        globalwidth = img.width;
        globalheight = img.height;
        await upload()
      }

      let segment_mode = document.getElementById('segment-image');
      document.getElementById("myCanvas").style.display = "none";
      document.getElementById("penSizeSlider").style.display = "none";
      document.getElementById("btn-undo").style.display = "none";
      document.getElementById("detectOnClick").classList.remove('hidden');
      segment_mode.src = document.getElementById("file-image").src;
      segment_mode.style = document.getElementById("file-image").style;
      segment_mode.addEventListener("click", handleClick);
      document.getElementById('file-drag').style.pointerEvents = "none";
      document.getElementById('file-drag').style.display = "none";
      save_mode()
      document.getElementById("btn-segment").textContent = "Draw Mask";

      var canvas = document.getElementById('myCanvas');
      setImage(canvas, imagefile.name)
    }
    else if (mode === "segment") {
      mode = "drawing";
      if (check_upload === 1) {
        document.getElementById("myCanvas").style.display = "block";
        document.getElementById("btn-undo").style.display = "block";
        document.getElementById("penSizeSlider").style.display = "block";
        document.getElementById("detectOnClick").classList.add('hidden');
      }
      else {
        await upload();
        document.getElementById("myCanvas").style.display = "block";
        document.getElementById("btn-undo").style.display = "block";
        document.getElementById("penSizeSlider").style.display = "block";
        document.getElementById("detectOnClick").classList.add('hidden');
      }
      if (diddraw === 0) {
        draw()
        diddraw = 1;
      }
      document.getElementById("btn-segment").textContent = "Segmentation";
    }
  }
};

let imagefile;

async function upload() {
  var img = document.getElementById('file-image')
  if (mode === "drawing") {
    document.getElementById("penSizeSlider").style.display = "block";
    document.getElementById("btn-undo").style.display = "block";
    document.getElementById("detectOnClick").classList.add('hidden')
  }
  if (globalheight === 0) {
    globalwidth = img.width;
    globalheight = img.height;
  }
  
  var canvas = document.getElementById('myCanvas');
  let ctx = canvas.getContext('2d');
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = globalwidth;
  canvas.height = globalheight;
  img.style.display = 'none';
  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  history.push(  ctx.getImageData(0, 0, canvas.width, canvas.height))
  
  /// Draw image on holder
  imgHolder.width = globalwidth
  imgHolder.height = globalheight
  let ctxHolder = imgHolder.getContext('2d')
  ctxHolder.drawImage(img, 0, 0, canvas.width, canvas.height)
  let canvas_img = canvas.toDataURL();

  await fetch('/upload_img', {
    method: 'POST',
    body: JSON.stringify({ upload_img: canvas_img, name: imagefile.name }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'oke') {
        check_upload = 1;
        if (img && ctx) {
          if (mode === "drawing") {
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

function save_mode() {
  document.getElementById('btn-draw').textContent = "Remove"
  document.getElementById('btn-draw').onclick = () => {

    if (mode === "drawing") {
      let canvas = document.getElementById("myCanvas");
      inpainting(imgHolder,invCanvas,canvas)
    }
    else if (mode === "segment") {
      let canvas_seg = document.getElementById('canvas-segmentation')
      inpainting(imgHolder,invCanvas_seg,canvas_seg)
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
    ctx2.fillStyle = 'black';
    ctx2.fillRect(0, 0, canvas.width, canvas.height);
    var penSizeSlider = document.getElementById('penSizeSlider');
    var penSize = parseInt(penSizeSlider.value);

    penSizeSlider.addEventListener('input', function () {
      penSize = parseInt(penSizeSlider.value);
    });
    // Start painting

    var painting = false;


    ctx2.globalAlpha = 1;
    ctx2.imageSmoothingEnabled = false;
    // Draw the uploaded image onto the canvas once it loads
    canvas.addEventListener('mousedown', async function (e) {
      painting = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      ctx2.beginPath();
      ctx2.moveTo(e.offsetX, e.offsetY);
    });

    // Stop painting
    canvas.addEventListener('mouseup', async function () {
      if (painting)
      {
        ctx.closePath();
        // ctx2.closePath();
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        painting = false;
      }
      // painting = false;
      // ctx.beginPath(); // Reset the path after each stroke
      // ctx2.beginPath();
    });

    // Drawing logic
    canvas.addEventListener('mousemove', async function (e) {
    //   if (!painting) return;

      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'red';

      ctx2.lineWidth = 10;
      ctx2.lineCap = 'round';
      ctx2.strokeStyle = '#FFFFFF';

    //   // Adjust mouse coordinates to canvas offset
    //   var rect = canvas.getBoundingClientRect();
    //   var x = event.clientX - rect.left;
    //   var y = event.clientY - rect.top;

    //   ctx2.lineTo(x, y);
    //   ctx2.stroke();
    //   ctx2.beginPath();
    //   ctx2.moveTo(x, y);

    //   ctx.lineTo(x, y);
    //   ctx.stroke();
    //   ctx.beginPath();
    //   ctx.moveTo(x, y);
        if (painting) {
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
      }
    });
    document.getElementById('btn-undo').addEventListener('click', undo)
    function undo() {
      if (history.length > 0) {
        if (history.length == 1)
        {
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
          console.log(history.length)
          history.pop(); // Remove the last drawing from history

          // Redraw the remaining history
          history.forEach(item => {
              ctx.putImageData(item, 0, 0);
          });
      }
  }

  }
}


function ekUpload() {
  function Init() {
    var fileSelect = document.getElementById('file-upload');
    fileSelect.addEventListener('change', fileSelectHandler, false);
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('file-drag');

    e.stopPropagation();
    e.preventDefault();

    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }
  function fileSelectHandler(e) {
    var files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);

    // Process all File objects
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
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
  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    document.getElementById('file-drag').style.display = 'none';
  }
}
ekUpload();

async function handleClick(event) {
  let x = event.offsetX
  let y = event.offsetY

  let mask = await click(x, y)
  mask = eval(mask)
  console.log(typeof (mask))
  console.log(mask.length)
  console.log(mask[0].length)

  drawSegmentation(mask, event.target.parentElement)
  drawClickPoint(event.target.parentElement, event)
}
/////////////////////////////////////////////
/**
 * Draw segmentation result
 */
function drawSegmentation(mask, targetElement) {

  const width = mask[0].length
  const height = mask.length
  console.log(mask[0][0])
  // const maskData = mask.getAsFloat32Array()
  //drawing mask

  const canvas = targetElement.getElementsByClassName("canvas-segmentation")[0]
  canvas.width = width
  canvas.height = height
  invCanvas_seg.width = width
  invCanvas_seg.height = height

  const ctx = canvas.getContext("2d")
  ctx.fillStyle = "#00000000"
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"

  const ctx2 = invCanvas_seg.getContext("2d")
  ctx2.fillStyle = "#fffffff"
  ctx2.fillRect(0, 0, width, height)
  ctx2.fillStyle = "rgba(255, 255, 255)"

  for (let i = 0; i < mask.length; i++)
    for (let j = 0; j < mask[0].length; j++)
      if (mask[i][j]) {
        ctx.fillRect(j, i, 1, 1)
        ctx2.fillRect(j, i, 1, 1)
      }
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