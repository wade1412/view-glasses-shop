import "./cart/cartController.js";

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.35,
  }
);

document.querySelectorAll(".scroll-reveal").forEach((el) => {
  scrollObserver.observe(el);
});
