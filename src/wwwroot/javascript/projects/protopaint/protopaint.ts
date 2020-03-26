
document.addEventListener("keydown", (e) => {
    switch(e.key)
    {
        case "q":
            document.querySelector('div[data-panel="left"]').classList.toggle("hide");
            break;
        case "p": 
            document.querySelector('div[data-panel="right"]').classList.toggle("hide");
            break;
    }

}, false);