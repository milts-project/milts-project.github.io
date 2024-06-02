const isGroundTruth = (video) => video.getAttribute("data-src").includes("gt");

document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll("video[data-src]");

  videos.forEach((video) => {
    if (video.getAttribute("data-src").includes("gt")) {
      const p = document.createElement("p");
      p.style.textAlign = "center";
      src = video.getAttribute("data-src");
      content = src.split("/").pop().split(".")[0];
      speaker = src.split("/").slice(-2)[0];
      p.textContent = `${content} (${speaker})`;
      video.insertAdjacentElement("beforebegin", p);
    }
  });

  const vocoderSelect = document.getElementById("vocoder");
  const defaultPoster = "assets/images/play.png";

  const setPoster = (video, poster) => video.setAttribute("poster", poster);

  const loadVideo = (video) => {
    const vocoder = vocoderSelect.value;
    video.src =
      vocoder === "griffin-lim"
        ? video.getAttribute("data-src").replace("vocos", "gl")
        : video.getAttribute("data-src");
    video.play();
    video.controls = true;
    console.log(`${video.src} loaded.`);
  };

  const onVideoClick = (event) => {
    const video = event.currentTarget;
    if (!video.src) {
      setPoster(video, "");
      loadVideo(video);
    }
  };

  const resetAllVideos = () => {
    console.log("Resetting all videos.");
    videos.forEach((video) => {
      if (!isGroundTruth(video)) {
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        setPoster(video, defaultPoster);
        video.removeAttribute("controls");
        video.load();
        video.addEventListener("click", onVideoClick, { once: true });
      }
    });
  };

  videos.forEach((video) => {
    if (isGroundTruth(video)) {
      loadVideo(video);
    } else {
      setPoster(video, defaultPoster);
      video.addEventListener("click", onVideoClick, { once: true });
    }
  });

  vocoderSelect.addEventListener("change", resetAllVideos);
});
