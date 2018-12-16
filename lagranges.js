let canvas, ctx, startTime, lastT;

const RADIUS = 200; // for display only
const POINT_RADIUS = 10; // for display only

let constants = {};

let Q = [Math.PI / 3, Math.PI / 5, 0, 0];

function diffEqn(t, Q) {
    const m1 = constants.mass1, m2 = constants.mass2;
    const R = 1, g = 9.82;
    const k = constants.springConst, L0 = constants.springLength;
    const theta1 = Q[0], theta2 = Q[1];
    const common = 2*k * (2*R*Math.sin(theta2/2) - L0) * Math.cos(theta2/2);
    const theta1dd = 1/R * (g*Math.cos(theta1) + common/m1);
    const theta2dd = 1/R * (g*Math.cos(theta1+theta2) - common/m2) - theta1dd;
    Qprim = [Q[2], Q[3], theta1dd, theta2dd];
    return Qprim;
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

function loop() {
    const t = (Date.now() - startTime) / 1000;
    const dt = t - lastT;
    lastT = t;
    const STEPS = 10;
    for(let i = 0; i < STEPS; i++) {
        Q = rungeKutta4(diffEqn, Q, t, dt / STEPS)[1];
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
