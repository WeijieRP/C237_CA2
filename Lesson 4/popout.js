document.querySelector(".buttonpop").addEventListener('click', function(event) {
    event.preventDefault(); 

    const newcontainer = document.createElement("div");
    newcontainer.setAttribute("class", "popoutbox");

    const popoutContent = document.createElement("div");
    popoutContent.setAttribute("class", "popout-content");
    popoutContent.innerHTML = "<h1>Thank you for subscribing!</h1>";

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "close-btn");
    closeButton.innerText = "Close";

    // Close button functionality
    closeButton.addEventListener("click", () => {
        newcontainer.classList.remove("show");
        setTimeout(() => {
            newcontainer.remove();
        }, 500); // Wait for transition to complete
    });

    popoutContent.appendChild(closeButton);
    newcontainer.appendChild(popoutContent);

    document.body.appendChild(newcontainer);
    setTimeout(() => {
        newcontainer.classList.add("show");
    }, 10); 
});
