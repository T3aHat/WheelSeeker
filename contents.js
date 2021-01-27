var eventflag = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "watch") {
    chrome.storage.sync.get(
      {
        toggle: false,
        seektimef: 5000,
        seektimeb: 5000,
      },
      function (items) {
        var myPlayer = document.getElementsByClassName(
          "video-stream html5-main-video"
        )[0];
        function func(e) {
          e.preventDefault();
          var toggle = items.toggle;
          var seektime;
          if ((e.wheelDelta < 0 && !toggle) || (e.wheelDelta > 0 && toggle)) {
            seektime = items.seektimef / 1000;
          } else {
            seektime = -items.seektimeb / 1000;
          }
          var now = myPlayer.currentTime;
          myPlayer.currentTime = now + seektime;
        }

        if (myPlayer.readyState == "4" && eventflag == false) {
          console.log("Wheel seek for YouTube loaded");
          var playerelm = document.getElementById("player-container");
          playerelm.addEventListener("wheel", func);
          eventflag = true;
        }
      }
    );
  }
});
