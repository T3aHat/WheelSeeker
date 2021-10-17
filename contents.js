let eventflag = false;
let chapterSecondList = [];
let ctrlflag = false;

function disablerForEnhancerForYouTube() {
  try {
    document
      .querySelector("#efyt-speed")
      .addEventListener("mouseover", function (e) {
        ctrlflag = true;
      });
    document
      .querySelector("#efyt-speed")
      .addEventListener("mouseout", function (e) {
        ctrlflag = false;
      });
  } catch {}
}

function updateChapterlist() {
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
    "WheelSeeker for YouTube : chapterlist updated",
    chapterSecondList
  );
  return chapterSecondList;
}

function keyUpDownFunc(e) {
  ctrlflag = e.ctrlKey || e.metaKey;
}

function inject() {
  document.addEventListener("keyup", keyUpDownFunc);
  document.addEventListener("keydown", keyUpDownFunc);
  chrome.storage.sync.get(
    {
      toggle: false,
      seektimef: 5000,
      seektimeb: 5000,
    },
    function (items) {
      var video = document.querySelector("video");
      var time = 0;
      var now = 0;
      disablerForEnhancerForYouTube();
      if (!eventflag && document.querySelector("video").parentNode) {
        console.log("WheelSeeker for YouTube : loaded");
        document
          .querySelector("video")
          .parentNode.addEventListener("wheel", seekfunc);
        eventflag = true;
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
        let parent = video.parentNode;
        parent.classList.add("WSVideoParent");
        parent.appendChild(newNode);
        timer = setTimeout(function () {
          newNode.remove();
          time = 0;
        }, 800);
      }

      function seekfunc(e) {
        e.preventDefault();
        var toggle = items.toggle;
        var seektime;
        now = video.currentTime;

        if ((e.wheelDelta < 0 && !toggle) || (e.wheelDelta > 0 && toggle)) {
          seektime = items.seektimef / 1000;
        } else {
          seektime = -items.seektimeb / 1000;
        }
        let chapterSecondList = updateChapterlist();
        if (chapterSecondList.length == 0 || !ctrlflag) {
          seekWithMsg(seektime);
        } else {
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
        }
      }
    }
  );
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "watch") {
    inject();
  }
});
