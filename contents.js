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
          time += seektime;
          var now = myPlayer.currentTime;
          myPlayer.currentTime = now + seektime;
          var newNode = document.createElement("div");
          newNode.className = "seek_message";
          var message = time.toLocaleString(undefined, {
            maximumFractionDigits: [3],
          });
          console.log(message);
          if (time >= 0) {
            message = "+" + message;
          }
          newNode.textContent = message;
          try {
            document.querySelector(".seek_message").remove();
            clearTimeout(timer);
          } catch {
            //no message
          }

          document.querySelector(".html5-video-container").appendChild(newNode);
          timer = setTimeout(function () {
            newNode.remove();
            time = 0;
          }, 800);
        }

        if (myPlayer.readyState == "4" && eventflag == false) {
          console.log("Wheel seek for YouTube loaded");
          var playerelm = document.getElementById("player-container");
          var time = 0;
          playerelm.addEventListener("wheel", func);
          eventflag = true;
        }
      }
    );
  }
});
