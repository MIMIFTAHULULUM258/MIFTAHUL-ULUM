// Ekstrakurikuler Card Click
document.querySelectorAll(".ekskul-card").forEach((card) => {
  card.addEventListener("click", () => {
    alert(`You clicked on: ${card.querySelector("h3").innerText}`);
  });
});

// Guru section
const guruCarousel = document.querySelector("#guruCarousel");

if (guruCarousel) {
  const carousel = new bootstrap.Carousel(guruCarousel, {
    interval: 5000,
    ride: "carousel",
  });

  function adjustCarouselHeight() {
    const activeItem = guruCarousel.querySelector(".carousel-item.active");
    if (activeItem) {
      const itemHeight = activeItem.offsetHeight;
      guruCarousel.querySelector(".carousel-inner").style.height =
        itemHeight + "px";
    }
  }

  // Adjust on load, slide, and window resize
  window.addEventListener("load", adjustCarouselHeight);
  window.addEventListener("resize", adjustCarouselHeight);
  guruCarousel.addEventListener("slid.bs.carousel", adjustCarouselHeight);
}
