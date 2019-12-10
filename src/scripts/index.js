import '../styles/index.scss';
import '../scripts/app_scripts.js';

import bannerImage from '../images/slide-2.png';
import hotelImg2 from '../images/slide-3.png';
import hotelImg from '../images/slide-4.png';

document.getElementById('banner1').setAttribute('src', bannerImage);
//document.getElementById('banner2').setAttribute('src', hotelImg);
//document.getElementById('banner3').setAttribute('src', hotelImg2);
// document.getElementById('img3').setAttribute('src', bannerImage);




////////for header style/////////////////////////
const header = document.querySelector("header");
const header_height = header.offsetHeight;
const scrollToTop = document.querySelector('.cd-top');
window.onscroll = function () {
    var scrollPosY = window.pageYOffset | document.body.scrollTop;
    if (scrollPosY >= header_height) {
        header.classList.add("blackHeader");
    } else {
        header.classList.remove("blackHeader");
    }
    //////////for scroll to top
    if (scrollPosY > 400) {
        scrollToTop.style.visibility = 'visible';
    } else {
        scrollToTop.style.visibility = 'hidden';
    }

};
scrollToTop.addEventListener('click', function () {
    window.scrollTo({ top: 100, behavior: 'smooth' });

});
/////////////////header style Endddddddd///////////


