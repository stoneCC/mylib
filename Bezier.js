/**
 * Created by changchuan on 2015/9/7.
 */
/**
 * Bezier 贝塞尔曲线函数
 *
 *
 * 在线制作工具：http://labs.pufen.net/cubic-bezier/#.17,.67,.83,.67

 var b = new Bezier(0.0, 0.0, 1.0, 1.0);
 var x = b.solve(0.1,0.001);
 console.log(x);
 var x = b.solve(0.2,0.001);
 console.log(x);
 var x = b.solve(0.5,0.001);
 console.log(x);


 */
function Bezier(p1x, p1y, p2x,p2y)
{
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
}

Bezier.prototype.sampleCurveX=function( t )
{
    return ((this.ax * t + this.bx) * t + this.cx) * t;
}

Bezier.prototype.sampleCurveY=function( t )
{
    return ((this.ay * t + this.by) * t + this.cy) * t;
}

Bezier.prototype.sampleCurveDerivativeX=function( t )
{
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
}

Bezier.prototype.solveCurveX=function( x,  epsilon)
{
    var t0;
    var t1;
    var t2;
    var x2;
    var d2;
    var i;

    // First try a few iterations of Newton's method -- normally very fast.
    for (t2 = x, i = 0; i < 8; i++) {
        x2 = this.sampleCurveX(t2) - x;
        if (Math.abs (x2) < epsilon)
            return t2;
        d2 = this.sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-6)
            break;
        t2 = t2 - x2 / d2;
    }

    // Fall back to the bisection method for reliability.
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;

    if (t2 < t0)
        return t0;
    if (t2 > t1)
        return t1;

    while (t0 < t1) {
        x2 = this.sampleCurveX(t2);
        if (Math.abs(x2 - x) < epsilon)
            return t2;
        if (x > x2)
            t0 = t2;
        else
            t1 = t2;
        t2 = (t1 - t0) * .5 + t0;
    }

    // Failure.
    return t2;
}

Bezier.prototype.solve=function( x,  epsilon)
{
    return this.sampleCurveY(this.solveCurveX(x, epsilon));
}




