const cd = $(".login")[0]; // Lấy phần tử DOM từ đối tượng jQuery

//handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    };
//}