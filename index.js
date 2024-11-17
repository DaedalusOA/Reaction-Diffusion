import * as THREE from "https://cdn.skypack.dev/three@0.146.0";

/**
 * Base
 */

// Scenes
const scene = new THREE.Scene();
const bufferScene = new THREE.Scene();

// Select the button using its ID
const reset = document.getElementById('reset');
const clear = document.getElementById('clear');

var mouseX = 0;
var mouseY = 0;

window.addEventListener('mousemove', (event) => {
   mouseX = event.clientX; // X coordinate relative to the viewport
   mouseY = event.clientY; // Y coordinate relative to the viewport
});

var LeftClick = 0.;
var RightClick = 0.;

document.addEventListener('mousedown', function(event) {
  
  const rect = settings.getBoundingClientRect();
   const isInside = mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;


  if (event.button === 0 && !isInside) {
    LeftClick = 1.;
  } else if (event.button === 2  && !isInside) {
    RightClick = 1.;
  }
});
document.addEventListener('mouseup', function(event) {
  if (event.button === 0) {
    LeftClick = 0.;
  } else if (event.button === 2) {
    RightClick = 0.;
  }
});




/////////touchhhhhhhhh
// Function to handle touch events
let touchX = 0;
let touchY = 0;
let touch = 0;




// Function to handle touchstart event
function handleTouchStart(event) {
    // Prevent default behavior (optional)
     touch = 1;

    
}

// Function to handle touchmove event
function handleTouchMove(event) {

    // Get the updated touch coordinates
    if (event.touches.length > 0) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
        
    }
}

// Function to handle touchend event
function handleTouchEnd(event) {

    touch = 0;
}

// Attach the touch event listeners
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);
document.addEventListener("touchend", handleTouchEnd, false);

/////////touchhhhhhhhhh




// Optional: Prevent the right-click menu from appearing
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();  // Prevents the context menu from opening on right-click
});


// Add a click event listener to the button
reset.addEventListener('click', function() {
  kRange.value = 0.061;
  dBRange.value = 1.0;
  dARange.value= 0.5;
  feedRange.value= 0.055;

  // Create a new data texture with a rectangle in the center
  const newDataTexture = createDataTexture();

  // Update the texture in the buffer material
  bufferMaterial.uniforms.uTexture.value = newDataTexture;

  renderer.setRenderTarget(renderBufferA);
  renderer.clear();

  renderer.setRenderTarget(renderBufferB);
  renderer.clear();

});
clear.addEventListener('click', function() {
  renderer.setRenderTarget(renderBufferA);
  renderer.clear();

  renderer.setRenderTarget(renderBufferB);
  renderer.clear();

});



const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

/**
 * Textures
 */
const dataTexture = createDataTexture();

/**
 * Meshes
 */
// Geometry
const geometry = new THREE.PlaneGeometry(2, 2);

//Screen resolution
const resolution = new THREE.Vector3(
  sizes.width,
  sizes.height,
  window.devicePixelRatio
);

/**
 * Render Buffers
 */
// Create a new framebuffer we will use to render to
// the video card memory
let renderBufferA = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
        // In this demo UV coordinates are float values in the range of [0,1]. 
        // If you render these values into a 32bit RGBA buffer (a render target in format RGBA and type UnsignedByte), you will lose precision since you can only store 8 bit (256 possible integer values) per color channel. 
        // This loss is visible if you use the sampled uv coordinates for a texture fetch.
        // You can fix the issue if you add this parameter when creating the render target type: THREE.FloatType. 
        // The underlying texture is now a float texture that can hold your uv coordinates and retain precision.
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    }
)

let renderBufferB = new THREE.WebGLRenderTarget(
    sizes.width,
    sizes.height,
    {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    }
)

// Buffer Material
const bufferMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: dataTexture },
        udA: {value: 1.0},
        udB: {value: 0.5},
        uk: {value: 0.0622},
        ufeed: {value: 0.036},
        x: {value: 0.0},
        y: {value: 0.0},
        mSize: {value: 0.004},
        Lpress: {value: 0.0},
        Rpress: {value: 0.0},
        uResolution: {
            value: resolution
        },
    },
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShaderBuffer").textContent
});

//Screen Material
const quadMaterial = new THREE.ShaderMaterial({
  uniforms: {
    //The screen will receive it's texture from our off screen framebuffer
    uTexture: { value: null },
    uResolution: {
      value: resolution
    }
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShaderScreen").textContent
});

// Meshes
const mesh = new THREE.Mesh(geometry, quadMaterial);
scene.add(mesh)

// Meshes
const bufferMesh = new THREE.Mesh(geometry, bufferMaterial);
bufferScene.add(bufferMesh)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement);

const onWindowResize = () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    location.reload()
    // Update camera
    // camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //update uniforms
    quadMaterial.uniforms.uResolution.value.x = sizes.width
    quadMaterial.uniforms.uResolution.value.y = sizes.height
}

window.addEventListener('resize', onWindowResize)

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);


/**
 * Animate
 */

/**
 * Animate
 */
// Get the first touch point's coordinates
   
const rect = settings.getBoundingClientRect();
const isInside = touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom;
 

const stepsPerFrame = 30; // Number of updates per frame

const tick = () => {
  for (let i = 0; i < stepsPerFrame; i++) {
    // Render to the offscreen buffer
    renderer.setRenderTarget(renderBufferA);
    renderer.render(bufferScene, camera);

    // Swap the buffers (ping-pong)
    const temp = renderBufferA;
    renderBufferA = renderBufferB;
    renderBufferB = temp;

    // Update the input texture for the next pass
    bufferMaterial.uniforms.uTexture.value = renderBufferB.texture;
    bufferMaterial.uniforms.udA.value = dBRange.value;
    bufferMaterial.uniforms.udB.value = dARange.value;
    bufferMaterial.uniforms.ufeed.value = feedRange.value;
    bufferMaterial.uniforms.uk.value = kRange.value;
    bufferMaterial.uniforms.x.value = mouseX + touchX;
    bufferMaterial.uniforms.y.value = mouseY + touchY;
    if (!isInside){
       bufferMaterial.uniforms.Rpress.value = LeftClick + touch;
    }else{
       bufferMaterial.uniforms.Rpress.value = LeftClick;
    }
    bufferMaterial.uniforms.Lpress.value = RightClick;
    bufferMaterial.uniforms.mSize.value = sizeRange.value;
   
    
    
  }
  
  kValue.textContent = kRange.value;
  dBValue.textContent = dBRange.value;
  dAValue.textContent = dARange.value;
  feedValue.textContent = feedRange.value;
  sizeValue.textContent = sizeRange.value;



  // Render the final result to the screen
  quadMaterial.uniforms.uTexture.value = renderBufferA.texture;
  renderer.setRenderTarget(null); // Default framebuffer (screen)
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();



/**
 * CREATE RANDOM NOISY TEXTURE
 */

function createDataTexture() {
  // Create a buffer with color data
  var size = sizes.width * sizes.height;
  var data = new Uint8Array(4 * size);

  // Define the rectangle dimensions
  var rectWidth = Math.floor(sizes.width * 0.05); // 20% of the texture width
  var rectHeight = Math.floor(sizes.height * 0.05); // 20% of the texture height

  // Calculate the starting position of the rectangle
  var rectXStart = Math.floor((sizes.width - rectWidth) / 2);
  var rectYStart = Math.floor((sizes.height - rectHeight) / 2);

  // Loop through each pixel in the texture
  for (var y = 0; y < sizes.height; y++) {
    for (var x = 0; x < sizes.width; x++) {
      var i = y * sizes.width + x;
      var stride = i * 4;

      // Check if the current pixel is within the rectangle
      if (
        x >= rectXStart &&
        x < rectXStart + rectWidth &&
        y >= rectYStart &&
        y < rectYStart + rectHeight
      ) {
        // Set the pixel to white
        data[stride] = 255; // Red
        data[stride + 1] = 0; // Green
        data[stride + 2] = 0; // Blue
        data[stride + 3] = 255; // Alpha
      } else {
        // Set the pixel to black
        data[stride] = 0; // Red
        data[stride + 1] = 0; // Green
        data[stride + 2] = 255; // Blue
        data[stride + 3] = 255; // Alpha
      }
    }
  }

  // Use the buffer to create a DataTexture
  var texture = new THREE.DataTexture(
    data,
    sizes.width,
    sizes.height,
    THREE.RGBAFormat
  );

  // Three.js requires this flag to update the texture
  texture.needsUpdate = true;

  return texture;
}


