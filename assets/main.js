var listofgigstocome = document.querySelectorAll("ul>li.ns-notpassed");
var nextgig = listofgigstocome[listofgigstocome.length - 1];
if (nextgig) {
  nextgig.classList.add("ns-nextgig");
}

window.addEventListener("load", () => {
  quicklink.listen({
    origins: !0,
    priority: !0
  });
});

// Lazy load images
window.addEventListener("load", function () {
  var timer, images, viewHeight;

  function init() {
    images = document.body.querySelectorAll("[data-src]");
    viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );

    lazyload(0);
  }

  function scroll() {
    lazyload(200);
  }

  function lazyload(delay) {
    if (timer) {
      return;
    }

    timer = setTimeout(function () {
      var changed = false;

      requestAnimationFrame(function () {
        for (var i = 0; i < images.length; i++) {
          var img = images[i];
          var rect = img.getBoundingClientRect();

          if (!(rect.bottom < 0 || rect.top - 100 - viewHeight >= 0)) {
            img.onload = function (e) {
              e.target.className = "loaded";
            };

            img.className = "notloaded";
            img.src = img.getAttribute("data-src");
            img.removeAttribute("data-src");
            changed = true;
          }
        }

        if (changed) {
          filterImages();
        }

        timer = null;
      });
    }, delay);
  }

  function filterImages() {
    images = Array.prototype.filter.call(images, function (img) {
      return img.hasAttribute("data-src");
    });

    if (images.length === 0) {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", init);
      return;
    }
  }

  // polyfill for older browsers
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  window.addEventListener("scroll", scroll);
  window.addEventListener("resize", init);

  init();
});

function decodeEmail(encodedString) {
  // Holds the final output
  var email = "";

  // Extract the first 2 letters
  var keyInHex = encodedString.substr(0, 2);

  // Convert the hex-encoded key into decimal
  var key = parseInt(keyInHex, 16);

  // Loop through the remaining encoded characters in steps of 2
  for (var n = 2; n < encodedString.length; n += 2) {
    // Get the next pair of characters
    var charInHex = encodedString.substr(n, 2);

    // Convert hex to decimal
    var char = parseInt(charInHex, 16);

    // XOR the character with the key to get the original character
    var output = char ^ key;

    // Append the decoded character to the output
    email += String.fromCharCode(output);
  }
  return email;
}

// Find all the elements on the page that use class="eml-protected"
var allElements = document.getElementsByClassName("eml-protected");

// Loop through all the elements, and update them
for (var i = 0; i < allElements.length; i++) {
  updateAnchor(allElements[i]);
}

function updateAnchor(el) {
  // fetch the hex-encoded string
  var encoded = el.innerHTML;

  // decode the email, using the decodeEmail() function from before
  var decoded = decodeEmail(encoded);

  // Replace the text (displayed) content
  el.textContent = decoded;

  // Set the link to be a "mailto:" link
  el.href = "mailto:" + decoded;
}
