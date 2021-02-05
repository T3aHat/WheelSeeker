function save_options() {
  chrome.storage.sync.set(
    {
      toggle: document.querySelector("#togglein").checked,
      seektimef: document.querySelector("#seektimeinf").value,
      seektimeb: document.querySelector("#seektimeinb").value,
    },
    function () {}
  );

  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url.match(/https:\/\/www.youtube.com\/watch*/)) {
        chrome.tabs.reload(tabs[i].id);
      }
    }
  });
  window.close();
}

function restore_options() {
  chrome.storage.sync.get(
    {
      toggle: false,
      seektimef: 5000,
      seektimeb: 5000,
    },
    function (items) {
      document.querySelector("#togglein").checked = items.toggle;
      document.querySelector("#seektimeinf").value = items.seektimef;
      document.querySelector("#seektimeinb").value = items.seektimeb;
      if (items.toggle) {
        document.querySelector(".txtf").innerText = "↑ Seek forward : ";
        document.querySelector(".txtb").innerText = "↓ Seek backward : ";
      } else {
        document.querySelector(".txtf").innerText = "↓ Seek forward : ";
        document.querySelector(".txtb").innerText = "↑ Seek backward : ";
      }
    }
  );
}

function change_txt(e) {
  if (e.target.checked) {
    document.querySelector(".txtf").innerText = "↑ Seek forward : ";
    document.querySelector(".txtb").innerText = "↓ Seek backward : ";
  } else {
    document.querySelector(".txtf").innerText = "↓ Seek forward : ";
    document.querySelector(".txtb").innerText = "↑ Seek backward : ";
  }
}

document.querySelector("#togglein").addEventListener("change", change_txt);
document.querySelector("#savebtn").addEventListener("click", save_options);
document.addEventListener("DOMContentLoaded", restore_options);
