const revealSystem = () => {
  const loadElements = document.querySelectorAll('[data-reveal="load"].reveal');
  const scrollElements = document.querySelectorAll(
    '[data-reveal="scroll"].reveal'
  );

  //page-load stagger
  loadElements.forEach((el, index) => {
    el.style.setProperty("--reveal-order", index);
  });

  //scroll stagger
  const scrollObserver = new IntersectionObserver(
    (entires) => {
      entires.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        //assign order if none
        if (!el.style.getPropertyValue("--reveal-order")) {
          const siblings = Array.from(
            document.querySelectorAll('[data-reveal="scroll].reveal')
          );
          const index = siblings.indexOf(el);
          el.style.setProperty("--reveal-order", index);
        }

        el.classList.add("reveal--visible");
        scrollObserver.unobserve(el);
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  scrollElements.forEach((el) => scrollObserver.observe(el));

  //trigger on-load animation after DOM is rdy
  loadElements.forEach((el) => {
    requestAnimationFrame(() => {
      el.classList.add("reveal--visible");
    });
  });
};

window.addEventListener("DOMContentLoaded", revealSystem);
