# WheelSeeker

You can seek forward or backward a YouTube video by wheeling the mouse.

# Install from Chrome Web Store

https://chrome.google.com/webstore/detail/wheelseek-for-youtube/cjjmkhjkajecnbabfihiddlmmdehjodj

# Install from GitHub

- Download `wheelseeker.zip` from

https://github.com/T3aHat/WheelSeek_for_YouTube/raw/main/wheelseeker.zip

- Drag-and-drop `wheelseek.zip` to `chrome://extensions`.  
  Ensure that the "Developer mode" checkbox in the top right-hand corner is checked.

# Usage

- You can seek forward or backward a YouTube video by wheeling the mouse on YouTube(`https://www.youtube.com/watch*`) video player.
- Wheeling with `Ctrl` or `⌘` on mac, you can move on the next chapter or go back to the previous chapter if the video has information about chapters.

# Update

- v1.1.0 にて通常の`video`においても同様の挙動をするようにしてみた
- niconico, bilibili では，`wheel`が発火しない
- instagram では，一度動画を読み込まないと使用できない
  - これは`video`を見つける動作を`setTimeout`で遅らせれば回避できるが，他サイトのパフォーマンスが落ちるのでやらない
  - `MutationObserver`でなんとでもなりそうだが，本命の microsoft stream で実現できて満足したのでおしまい
