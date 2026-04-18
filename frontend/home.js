// Fade-in on scroll
// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".feature-card, .report-card, .about p");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
  });
});
