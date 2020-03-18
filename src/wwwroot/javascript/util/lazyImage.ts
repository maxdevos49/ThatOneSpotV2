

// create config object: rootMargin and threshold
// are two properties exposed by the interface
const config = {
    rootMargin: '0px 0px 50px 0px',
    threshold: 1
};

// register the config object with an instance
// of intersectionObserver
let observer = new IntersectionObserver(function (entries:any, self:any) {

    // iterate over each entry
    entries.forEach((entry:any) => {

        if (entry.isIntersecting) {

            entry.target.src = entry.target.dataset.src;

            self.unobserve(entry.target);
        }
    });
}, config);


const imgs = document.querySelectorAll('[data-src]');

imgs.forEach(img => {
    observer.observe(img);
});