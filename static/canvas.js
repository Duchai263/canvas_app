let invCanvas = document.createElement('canvas');
var link = document.createElement('a');

window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1; // Full opacity
    ctx.imageSmoothingEnabled = false; 
    document.getElementById('btn-draw').onclick = () => {
      upload();
    }
};
let imagefile;

async function upload (){
  var img = document.getElementById('file-image')
  var img_name = document.getElementById('message')
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let canvas_img = canvas.toDataURL('image/png');

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
            document.getElementById('file-drag').style.height = 0; 
            canvas.width = img.width;
            canvas.height = img.height; 
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            img.style.display = 'none';
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            draw()
            document.getElementById('btn-draw').textContent = "Save"
            document.getElementById('btn-draw').onclick = () => {
              save()
              let img_result = document.getElementById('uploadedImage');
              img_result.style.width = canvas.style.width;
              img_result.style.height = canvas.style.height;
              img_result.classList.remove("hidden");
              canvas.style.display = "none";

            }
    }
    }
})
.catch(error => {
    console.error('Error:', error);
});
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
    
    let imageData = invCanvas.toDataURL();

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