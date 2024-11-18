export async function setImage(img , name = "") {
    const APIurl = 'http://localhost:5959/setimage/'

    // let img = document.getElementById('myCanvas');
    let imageData = img.toDataURL()

    await fetch(APIurl, {
      method: 'POST',
      body: JSON.stringify({ image_data: imageData , name: name}),
      headers: {
          'Content-Type': 'application/json'
      }})
    .then (res => {
      console.log("set successfully", res.json())
    })
  }

export async function click(x, y) {
    const APIurl = `http://localhost:5959/click/?x=${x}&y=${y}`

    console.log([x,y])

    await fetch(APIurl, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
}