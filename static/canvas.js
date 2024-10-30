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
    canvas.addEventListener('mousedown', function () {
        painting = true;
    });

    // Stop painting
    canvas.addEventListener('mouseup', function () {
        painting = false;
        ctx.beginPath(); // Reset the path after each stroke
    });

    // Drawing logic
    canvas.addEventListener('mousemove', function (event) {
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

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        ctx2.lineTo(x, y);
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(x, y);
    });

};




function draw() {
    var img = document.getElementById('uploadedImage');
    var invCanvas = document.getElementById('invisibleCanvas')
    var canvas = document.getElementById('myCanvas');

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