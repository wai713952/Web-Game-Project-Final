window.onload = pageloaded;

function pageloaded()
{
    var container = document.querySelector("#unity-container");
    var canvas = document.querySelector("#unity-canvas");
    var loadingBar = document.querySelector("#unity-loading-bar");
    var progressBarFull = document.querySelector("#unity-progress-bar-full");
    var fullscreenButton = document.querySelector("#unity-fullscreen-button");
    var warningBanner = document.querySelector("#unity-warning");
    
    // Shows a temporary message banner/ribbon for a few seconds, or
    // a permanent error message on top of the canvas if type=='error'.
    // If type=='warning', a yellow highlight color is used.
    // Modify or remove this function to customize the visually presented
    // way that non-critical warnings and error messages are presented to the
    // user.

    var buildUrl = "Build";
var loaderUrl = buildUrl + "/shinji.loader.js";
var config = {
  dataUrl: buildUrl + "/shinji.data",
  frameworkUrl: buildUrl + "/shinji.framework.js",
  codeUrl: buildUrl + "/shinji.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "DefaultCompany",
  productName: "popcat",
  productVersion: "1.0",
  showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile device style: fill the whole browser client area with the game canvas:

  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
  document.getElementsByTagName('head')[0].appendChild(meta);
  container.className = "unity-mobile";

  // To lower canvas resolution on mobile devices to gain some
  // performance, uncomment the following line:
  // config.devicePixelRatio = 1;

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  unityShowBanner('WebGL builds are not supported on mobile devices.');
} else {
  // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

  canvas.style.width = "1280px";
  canvas.style.height = "720px";
}

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  }).then((unityInstance) => {
    loadingBar.style.display = "none";
    fullscreenButton.onclick = () => {
      unityInstance.SetFullscreen(1);
    };
  }).catch((message) => {
    alert(message);
  });
};
document.body.appendChild(script);
}



function unityShowBanner(msg, type) {
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
  }
  var div = document.createElement('div');
  div.innerHTML = msg;
  warningBanner.appendChild(div);
  if (type == 'error') div.style = 'background: red; padding: 10px;';
  else {
    if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
    setTimeout(function() {
      warningBanner.removeChild(div);
      updateBannerVisibility();
    }, 5000);
  }
  updateBannerVisibility();
}

