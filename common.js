function rungeKutta4(f, Q, t, h) {
    const k1 = vecProd(h, f(t, Q));
    const k2 = vecProd(h, f(t + h/2, vecSum(Q, vecProd(1/2, k1))));
    const k3 = vecProd(h, f(t + h/2, vecSum(Q, vecProd(1/2, k2))));
    const k4 = vecProd(h, f(t + h, vecSum(Q, k3)));
    const newQ = vecSum(Q, vecProd(1/6, vecSum(k1,
                                        vecSum(vecProd(2, k2),
                                        vecSum(vecProd(2, k3), k4)))));
    return [t, newQ];
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

const SPRING_WIDTH = 20;

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
    const s0 = 1.5 * SPRING_WIDTH;
    interpLine(s0, 0);
    let d = SPRING_WIDTH;
    const n = 7;
    for(let i = 0; i <= n; i++) {
        d = -d;
        interpLine(s0 + (l - 2*s0) * i/n, d);
    }
    interpLine(l - s0, 0);
    interpLine(l, 0);
    ctx.stroke();
}

function drawArrow(x0, y0, x1, y1) {
    const l = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    const dx = (x1 - x0) / l;
    const dy = (y1 - y0) / l;
    const ox = -(y1 - y0) / l;
    const oy = (x1 - x0) / l;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x1 - (dx - ox) * SPRING_WIDTH, y1 - (dy - oy) * SPRING_WIDTH);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1 - (dx + ox) * SPRING_WIDTH, y1 - (dy + oy) * SPRING_WIDTH);
    ctx.stroke();
}
