
function init() {

    document.getElementById("body-wrapper").addEventListener("scroll", function(e) {
        let header = document.getElementById("header");

        if (this.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            header.style.backgroundColor = "rgba(0,0,0,1)";
        } else {
            header.style.backgroundColor = "rgba(0,0,0,0)";
        }
    });

}