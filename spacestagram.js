const APIkey = "pDlhLIS2yKZKLB3h6OUqiySIuXCMK13tKh4fDH1C";
let imagesData = [];

// make request and get images from NASA API
function init() {
    let queryLink = `https://api.nasa.gov/planetary/apod?api_key=${APIkey}&count=5&thumbs=true`;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 1 || this.readyState == 2 || this.readyState == 3) {
            document.getElementById("loader").style.display = "block";
        }
        else if (this.readyState == 4) {
            document.getElementById("loader").style.display = "none";
            if (this.status == 200) {
                // console.log(this.responseText);
                imagesData = JSON.parse(this.responseText);
                // console.log(imagesData);
                renderImages();
            } else {
                alert(this.responseText);
            }
        }
    }
    req.open("GET", queryLink, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Accept", "application/json");
    req.send();
}

// after receiving images data, render html page
function renderImages() {
    let container = document.getElementById("images");
    container.innerHTML = "";
    for (let imageData of imagesData) {
        if (imageData.media_type !== 'image') continue;

        let newImgDiv = document.createElement("div");
        newImgDiv.className = "image";
        newImgDiv.innerHTML = `<a class="image-link" href="${imageData.hdurl || imageData.url}" target="_blank">
        <img class="image-pic" src="${imageData.url}"></a>`;

        if (imageData.copyright) {
            newImgDiv.innerHTML += `<div class="image-title-copyright-date">${imageData.title} - ${imageData.copyright} (${imageData.date})</div>`;
        } else newImgDiv.innerHTML += `<div class="image-title-copyright-date">${imageData.title} (${imageData.date})</div>`;
        
        newImgDiv.innerHTML += `<div class="image-explanation">${imageData.explanation.split('digg_url')[0] || "<br>"}</div>
        <img class="image-sharelink" src="images/share.png" onclick="copyShareLink(this)">
        <img class="image-nolike" src="images/nolike.png" onclick="changeLikeStatus(this)">`;
        container.appendChild(newImgDiv);

    }
}


function copyShareLink(ele) {
    let url = ele.parentElement.childNodes[0].href;
    let shareMsg = `Hi! I have found a nice picture: ${url}`;
    navigator.clipboard.writeText(shareMsg);
    alert("Share Text Copied!");
}


function changeLikeStatus(ele) {
    if (ele.className === 'image-nolike') {
        ele.className = "image-like";
        ele.src = "images/like.png";
    } else if (ele.className === 'image-like') {
        ele.className = "image-nolike";
        ele.src = "images/nolike.png";
    }
}
