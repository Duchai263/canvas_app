window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    var invCanvas = document.getElementById('invisibleCanvas')
    var ctx = canvas.getContext('2d');
    var ctx2 = invCanvas.getContext('2d')
    var img = document.getElementById('uploadedImage');
    var painting = false;

    ctx.globalAlpha = 1; // Full opacity
    ctx.imageSmoothingEnabled = false; 

    ctx2.globalAlpha = 1;
    ctx2.imageSmoothingEnabled = false; 

    // Draw the uploaded image onto the canvas once it loads
    if (img && ctx) {
        img.onload = function() {
            // Set the canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }

    // Start painting
    canvas.addEventListener('mousedown', async function () {
        console.log("mouse down function")
        painting = true;
    });

    // Stop painting
    canvas.addEventListener('mouseup', async function () {
        console.log("mouse up function")
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

};

function draw() {
    console.log("draw function")
    var img = document.getElementById('uploadedImage');
    var invCanvas = document.getElementById('invisibleCanvas')
    var canvas = document.getElementById('myCanvas');
    document.getElementById('drawing-content').classList.remove("hidden");
    document.getElementById('btn-draw').textContent = 'Draw again';
    var ctx = canvas.getContext('2d');
    var ctx2 = invCanvas.getContext('2d')
    if (img && ctx) {
        console.log("aaa")
        canvas.width = img.width;
        canvas.height = img.height;
        invCanvas.width = img.width;
        invCanvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx2.fillStyle='black';
        ctx2.fillRect(0,0,canvas.width,canvas.height);
    }
  }

  function save(){
    // var canvas = document.getElementById('myCanvas');
    var invCanvas = document.getElementById('invisibleCanvas')
    console.log("aaaaaaa")
    var link = document.createElement('a');
    link.download = 'canvas_image.png'; // The name of the downloaded file
    // link.href = canvas.toDataURL(); // Convert canvas content to a data URL (image format)
    link.href = invCanvas.toDataURL()
    link.click();
  }

// image upload 

// File Upload
// 
function ekUpload(){
  function Init() {
    
    //(1)
      console.log("Upload Initialised");
  
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
  
      console.log(file.name);
      output(
        '<strong>' + encodeURI(file.name) + '</strong>'
      );
      
      // var fileType = file.type;
      // console.log(fileType);
      var imageName = file.name;
      console.log(file );
  
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