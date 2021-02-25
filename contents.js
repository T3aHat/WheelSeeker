var eventflag = false;
let chapterSecondList = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "watch") {
    function keyUpDownFunc(e) {
      ctrlFlag = e.ctrlKey || e.metaKey;
      return;
    }
    var ctrlFlag = false;
    document.addEventListener("keyup", keyUpDownFunc);
    document.addEventListener("keydown", keyUpDownFunc);
    chrome.storage.sync.get(
      {
        toggle: false,
        seektimef: 5000,
        seektimeb: 5000,
      },
      function (items) {
        var video = document.getElementsByClassName(
          "video-stream html5-main-video"
        )[0];
        //update chapter list
        let descs = document.querySelectorAll("yt-formatted-string.content a");
        chapterSecondList = [];
        for (let desc of descs) {
          if (
            desc.href.match(/https:\/\/www.youtube.com\/watch\?v=.*?&t=.*?s/) &&
            desc.textContent.match(/(\d{1,}:){0,1}\d{1,}:\d\d/)
          ) {
            let sec = desc.href.replace(
              /https:\/\/www.youtube.com\/watch\?v=.*?&t=(.*?)s/,
              "$1"
            );
            chapterSecondList.push(Number(sec));
          }
        }
        chapterSecondList = chapterSecondList.sort(function (a, b) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        console.log(
          "WheelSeek for YouTube : chapterlist updated\n" + chapterSecondList
        );
        var time = 0;
        if (video.readyState == "0") {
          video.addEventListener("loadeddata", () => {
            console.log("WheelSeek for YouTube : loadeddata");
            var playerelm = document.getElementById("player-container");
            playerelm.addEventListener("wheel", func);
            eventflag = true;
          });
        } else if (eventflag == false) {
          console.log("WheelSeek for YouTube : loaded");
          var playerelm = document.getElementById("player-container");
          playerelm.addEventListener("wheel", func);
          eventflag = true;
        }

        function func(e) {
          e.preventDefault();
          var toggle = items.toggle;
          var seektime;
          var now = video.currentTime;

          if ((e.wheelDelta < 0 && !toggle) || (e.wheelDelta > 0 && toggle)) {
            seektime = items.seektimef / 1000;
          } else {
            seektime = -items.seektimeb / 1000;
          }
          if (ctrlFlag) {
            if (seektime > 0) {
              for (let sec of chapterSecondList) {
                if (sec > now) {
                  //go to next chapter
                  video.currentTime = sec;
                  break;
                }
              }
            } else {
              for (let i = chapterSecondList.length; i >= 0; i--) {
                if (0.9 < now - chapterSecondList[i]) {
                  //go to before chapter
                  video.currentTime = chapterSecondList[i];
                  break;
                }
              }
            }
          } else {
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

            document
              .querySelector(".html5-video-container")
              .appendChild(newNode);
            timer = setTimeout(function () {
              newNode.remove();
              time = 0;
            }, 800);
            if (ctrlFlag) {
            }
          }
        }
      }
    );
  }
});
