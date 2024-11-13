let w, h; //Dùng để lưu kích thước chiều rộng và chiều cao của canvas
const ctx = canvas.getContext("2d"); //Lấy ngữ cảnh 2D của canvas, cho phép vẽ lên canvas.
const { sin, cos, PI, hypot, min, max } = Math; //Truy xuất các hàm toán học 


// Tạo Spider
function spawn() {

    const pts = many(333, () => {
        return {
            x: rnd(innerWidth),
            y: rnd(innerHeight),
            len: 0,
            r: 0
        };
    });
    //Mảng các điểm tạo thành hình tròn với 9 điểm cách đều nhau, sử dụng công thức lượng giác để phân bố đều quanh vòng tròn.
    const pts2 = many(9, (i) => {
        return {
            x: cos((i / 9) * PI * 2),
            y: sin((i / 9) * PI * 2)
        };
    });

    //Các giá trị ngẫu nhiên để kiểm soát chuyển động và vị trí ban đầu của các nhện.
    let seed = rnd(100)
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);

    //Hệ số ngẫu nhiên cho chuyển động tự thân của nhện
    let x = rnd(innerWidth)
    let y = rnd(innerHeight)
    let kx = rnd(0.5, 0.5)
    let ky = rnd(0.5, 0.5)

    //Bán kính để kiểm soát khoảng cách nhện có thể di chuyển tự thân
    let walkRadius = pt(rnd(50, 50), rnd(50, 50))

    //Giá trị để tính bán kính mạng nhện vẽ quanh nhện
    let r = innerWidth / rnd(100, 150);

    // tạo thành các đường nối từ nhện đến các điểm xung quanh, tạo hiệu ứng mạng nhện.
    function paintPt(pt) {
        pts2.forEach((pt2) => {
            if (!pt.len)
                return
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        drawCircle(pt.x, pt.y, pt.r);
    }

    return {
        follow(x, y) {
            tx = x;
            ty = y;
        },

        // Điều khiển chuyển động của nhện
        tick(t) {

            const selfMoveX = cos(t * kx + seed) * walkRadius.x
            const selfMoveY = sin(t * ky + seed) * walkRadius.y
            let fx = tx + selfMoveX;
            let fy = ty + selfMoveY;

            x += min(innerWidth / 100, (fx - x) / 10)
            y += min(innerWidth / 100, (fy - y) / 10)

            let i = 0
            pts.forEach((pt) => {
                const dx = pt.x - x,
                    dy = pt.y - y;
                const len = hypot(dx, dy);
                let r = min(2, innerWidth / len / 5);
                pt.t = 0;
                const increasing = len < innerWidth / 10
                    && (i++) < 8;
                let dir = increasing ? 0.1 : -0.1;
                if (increasing) {
                    r *= 1.5;
                }
                pt.r = r;
                pt.len = max(0, min(pt.len + dir, 1));
                paintPt(pt)
            });



        }
    }
}

//Tạo 2 nhện sử dụng hàm spawn
const spiders = many(2, spawn)


// Event kiểm tra Khi con trỏ chuột di chuyển, gọi follow của mỗi nhện để cập nhật vị trí mục tiêu theo con trỏ.
addEventListener("pointermove", (e) => {
    spiders.forEach(spider => {
        spider.follow(e.clientX, e.clientY)
    })
});

// Hàm tái tạo chuyển động liên tục
requestAnimationFrame(function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;
    ctx.fillStyle = "#000";
    drawCircle(0, 0, w * 10);
    ctx.fillStyle = ctx.strokeStyle = "#fff";
    t /= 1000
    spiders.forEach(spider => spider.tick(t))
    requestAnimationFrame(anim);
});

function recalc(X, Y) {
    tx = X;
    ty = Y;
}

function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
    //console.log(x,y,r)
    // ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
        i = (i + 1) / 100;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        let k = noise(x / 5 + x0, y / 5 + y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
}

function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

function pt(x, y) {
    return { x, y }
}