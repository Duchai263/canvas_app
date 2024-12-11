export async function setImage(img , name = "") {
    const APIurl = 'http://localhost:5959/setImage/'

    // img = document.getElementById('myCanvas');
    console.log(`${img.width}, ${img.height}`)
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
  let mask = null
  const APIurl = `http://localhost:5959/click/?x=${x}&y=${y}`

  console.log([x,y])

  let res = await fetch(APIurl, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
  })

  res = await res.json()
  mask = res['mask']
  

  if (mask) {
    // console.log(mask)
    return mask
  }

    return null
}

export async function inpainting(image, mask,target) {
  const APIurl = 'http://localhost:5958/inpainting/'
  
  let image_data = image.toDataURL()
  let mask_data = mask.toDataURL()

  let result = await fetch(APIurl, {
    method: 'POST',
    body: JSON.stringify({ image: image_data , mask: mask_data}),
    headers: {
        'Content-Type': 'application/json'
    }})
  result = await result.blob()

  const img = new Image();
  img.src = URL.createObjectURL(result);

  // console.log(result)
  let ctx = target.getContext('2d')
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0, target.width, target.height);
  }

  return img
}