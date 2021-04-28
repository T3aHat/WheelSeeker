let eventflag = false;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "watchGen") {
    chrome.storage.sync.get(
      {
        toggle: false,
        seektimef: 5000,
        seektimeb: 5000,
      },
      function (items) {
        //window.setTimeout(main, 1000);
        main();

        function main() {
          var video = document.getElementsByTagName("video")[0];
          var time = 0;
          var now = 0;
          if (video) {
            console.log(video.readyState);
            if (eventflag == false) {
              if (video.readyState != 4) {
                video.addEventListener("loadeddata", () => {
                  if (!eventflag) {
                    console.log("WheelSeeker : loaded data");
                    var playerelm = video.parentNode;
                    playerelm.classList.add("WSVideoParent");
                    playerelm.addEventListener("wheel", seekFunc, {
                      passive: false,
                    });
                    eventflag = true;
                  }
                });
              } else {
                if (!eventflag) {
                  console.log("WheelSeeker : loaded data");
                  var playerelm = video.parentNode;
                  playerelm.classList.add("WSVideoParent");
                  playerelm.addEventListener("wheel", seekFunc, {
                    passive: false,
                  });
                  eventflag = true;
                }
              }
            } else if (video.readyState != 4) {
              eventflag = false;
            }

            function seekWithMsg(seektime) {
              now = video.currentTime;
              time += seektime;
              video.currentTime = now + seektime;
              var newNode = document.createElement("div");
              newNode.className = "seek_message";
              var message = time.toLocaleString(undefined, {
                maximumFractionDigits: [3],
              });
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
              try {
                video.parentNode.appendChild(newNode);
                timer = setTimeout(function () {
                  newNode.remove();
                  time = 0;
                }, 800);
              } catch {}
            }

            function seekFunc(e) {
              e.preventDefault();
              var toggle = items.toggle;
              var seektime;
              now = video.currentTime;
              if (
                (e.wheelDelta < 0 && !toggle) ||
                (e.wheelDelta > 0 && toggle)
              ) {
                seektime = items.seektimef / 1000;
              } else {
                seektime = -items.seektimeb / 1000;
              }
              seekWithMsg(seektime);
            }
          } else {
            console.log("no video");
            eventflag = false;
          }
        }
      }
    );
  }
});
