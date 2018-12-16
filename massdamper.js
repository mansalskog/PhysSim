let canvas, ctx, startTime, lastT;

const BOX_HEIGHT = 50;
const BOX_WIDTH = 200;

let constants = {};

let Q = [1, 0.5, 0, 0];

function diffEqn(t, Q) {
    const m1 = constants.mass1, m2 = constants.mass2;
    const g = 0; //9.82;
    const k1 = constants.springConst1, L01 = constants.springLength1;
    const k2 = constants.springConst2, L02 = constants.springLength2;
    const c1 = constants.damping1, c2 = constants.damping2;
    const F0 = constants.forceAmpl, w = constants.forceFreq;
    x1 = Q[0];
    x2 = Q[1];
    x1d = Q[2];
    x2d = Q[3];
    x1dd = 1/m1 * (F0*Math.sin(w * t) - k1*(x1-L01) - c1*x1d - m1*g + k2*(x2-L02) + c2*x2d);
    x2dd = 1/m2 * (-k2*(x2-L02) - m2*g - c2*x2d) - x1dd;
    return [x1d, x2d, x1dd, x2dd];
}

function draw(x1, x2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const ox = canvas.width * 3/4;
    const oy = canvas.height * 3/4;
    drawStatic();
    let points = drawBox(x1, 'red', BOX_WIDTH).concat(drawBox(x1 + x2, 'blue', BOX_WIDTH/2));
    drawSpring.apply(null, points);
    drawSpring(cx, oy, points[0], points[1]);
    drawArrow(ox, oy, ox, oy - constants.forceAmpl * Math.sin(constants.forceFreq * lastT / 1000));
}

function drawBox(xx, color, width) {
    const cx = canvas.width / 2;
    const oy = canvas.height * 3/4;
    ctx.fillStyle = color;
    ctx.beginPath();
    const x = cx;
    const y = oy - xx * BOX_HEIGHT;
    ctx.fillRect(x - width/2, y - BOX_HEIGHT/2, width, BOX_HEIGHT);
    return [x, y];
}

function drawStatic() {
    const ox = canvas.width * 1/4;
    const oy = canvas.height * 3/4;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(canvas.width, oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox, oy - BOX_HEIGHT);
    ctx.stroke();
    ctx.fillText("1 m", ox, oy - BOX_HEIGHT);
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

    const names = ['springConst1', 'springLength1', 'damping1', 'mass1',
                   'springConst2', 'springLength2', 'damping2', 'mass2',
                   'forceAmpl', 'forceFreq'];
    for(let i = 0; i < names.length; i++) {
        const elem = document.getElementById(names[i]);
        function inEvent() {
            const n = parseFloat(elem.value);
            if(n) {
                constants[names[i]] = n;
            }
            console.log(constants);
        }
        elem.addEventListener('input', inEvent);
        inEvent(); // read initial value
    }

    loop();
});
