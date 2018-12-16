let canvas, ctx, startTime, lastT;

const RADIUS = 200; // for display only
const POINT_RADIUS = 10; // for display only

let constants = {};

let Q = [Math.PI / 3, Math.PI / 5, 0, 0];

function diffEqn(Q) {
    const m1 = constants.mass1, m2 = constants.mass2;
    const R = 3, g = 9.82;
    const k = constants.springConst, L0 = constants.springLength;
    const theta1 = Q[0], theta2 = Q[1];
    const common = 2*k * (2*R*Math.sin(theta2/2) - L0) * Math.cos(theta2/2);
    const theta1dd = 1/R * (g*Math.cos(theta1) + common/m1);
    const theta2dd = 1/R * (g*Math.cos(theta1+theta2) - common/m2) - theta1dd;
    Qprim = [Q[2], Q[3], theta1dd, theta2dd];
    return Qprim;
}

function rungeKutta4(f, Q, h) {
    const k1 = vecProd(h, f(Q));
    const k2 = vecProd(h, f(vecSum(Q, vecProd(1/2, k1))));
    const k3 = vecProd(h, f(vecSum(Q, vecProd(1/2, k2))));
    const k4 = vecProd(h, f(vecSum(Q, k3)));
    const newQ = vecSum(Q, vecProd(1/6, vecSum(k1,
                                        vecSum(vecProd(2, k2),
                                        vecSum(vecProd(2, k3), k4)))));
    return newQ;
}

function vecProd(t, Q) {
    let newQ = [];
    for(let i = 0; i < Q.length; i++) {
        newQ[i] = t * Q[i];
    }
    return newQ;
}

function vecSum(Q, R) {
    let newQ = [];
    for(let i = 0; i < Q.length; i++) {
        newQ[i] = Q[i] + R[i];
    }
    return newQ;

}

function draw(theta1, theta2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStatic();
    let points = drawBall(theta1, 'red').concat(drawBall(theta1 + theta2, 'blue'));
    drawSpring.apply(null, points);
}

function drawBall(angle, color) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 3;
    ctx.fillStyle = color;
    ctx.beginPath();
    const x = cx + (RADIUS - POINT_RADIUS) * Math.cos(Math.PI - angle);
    const y = cy + (RADIUS - POINT_RADIUS) * Math.sin(Math.PI - angle);
    ctx.moveTo(x + POINT_RADIUS, y);
    ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    return [x, y];
}

function drawStatic() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 3;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(cx, cy / 2 - POINT_RADIUS);
    ctx.lineTo(cx, cy / 2 + POINT_RADIUS);
    ctx.moveTo(cx, cy / 2);
    ctx.lineTo(cx + RADIUS, cy / 2);
    ctx.moveTo(cx + RADIUS, cy / 2 - POINT_RADIUS);
    ctx.lineTo(cx + RADIUS, cy / 2 + POINT_RADIUS);
    ctx.stroke();
    ctx.strokeText('1 m', cx + RADIUS / 2, cy / 3);
    ctx.beginPath();
    ctx.moveTo(cx + RADIUS, cy);
    ctx.arc(cx, cy, RADIUS, 0, Math.PI);
    ctx.stroke();

}

function drawSpring(x0, y0, x1, y1) {
    const l = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    function interpLine(s, d) {
        const x = (1 - s/l) * x0 + s/l * x1;
        const y = (1 - s/l) * y0 + s/l * y1;
        const ox = d/l * -(y1 - y0);
        const oy = d/l * (x1 - x0);
        ctx.lineTo(x + ox, y + oy);
    }
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    const s0 = 1.5 * POINT_RADIUS;
    interpLine(s0, 0);
    let d = POINT_RADIUS;
    const n = 7;
    for(let i = 0; i <= n; i++) {
        d = -d;
        interpLine(s0 + (l - 2*s0) * i/n, d);
    }
    interpLine(l - s0, 0);
    interpLine(l, 0);
    ctx.stroke();
}

function loop() {
    const t = (Date.now() - startTime) / 1000;
    const dt = t - lastT;
    lastT = t;
    const STEPS = 10;
    for(let i = 0; i < STEPS; i++) {
        Q = rungeKutta4(diffEqn, Q, dt / STEPS);
    }
    draw(Q[0], Q[1]);
    window.requestAnimationFrame(loop);
}

window.addEventListener('load', function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    startTime = Date.now();
    lastT = 0;

    const names = ['springConst', 'springLength', 'mass1', 'mass2'];
    for(let i = 0; i < names.length; i++) {
        const elem = document.getElementById(names[i]);
        function inEvent() {
            const n = parseFloat(elem.value);
            if(n) {
                constants[names[i]] = n;
            }
        }
        elem.addEventListener('input', inEvent);
        inEvent(); // read initial value
    }

    loop();
});
