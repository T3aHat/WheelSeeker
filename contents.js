console.log("Wheel seek for YouTube loaded");

var playerelm = document.getElementById("player-container");
var myPlayer = document.getElementsByClassName(
  "video-stream html5-main-video"
)[0];

chrome.storage.sync.get(
  {
    toggle: false,
    seektimef: 5000,
    seektimeb: 5000,
  },
  function (items) {
    var toggle = items.toggle;
    var seektime;
    playerelm.addEventListener("wheel", function (e) {
      e.preventDefault();
      if ((e.wheelDelta < 0 && !toggle) || (e.wheelDelta > 0 && toggle)) {
        seektime = items.seektimef / 1000;
      } else {
        seektime = -items.seektimeb / 1000;
      }
      var now = myPlayer.currentTime;
      myPlayer.currentTime = now + seektime;
    });
  }
);
