const vw = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
const vh = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

const scaleFactor = 1;

const nodeSize = 12 * scaleFactor;
const drawNodes = false;
const speedMultipier = 3;

const birthTransition = 20000;

const nodeGap = 80 * scaleFactor;
const maxConnectionDistance = 120 * scaleFactor;

var nodes = [];
var mode = 0;

function setup() {
    createCanvas( vw * scaleFactor, vh * scaleFactor );
    frameRate( 60 );

    let columns = width / nodeGap;
    let Xoffset = ( width % nodeGap ) / 2;

    let rows = height / nodeGap;
    let Yoffset = ( height % nodeGap ) / 2;

    for( let c = 0; c < columns; c++ ) {
        for( let r = 0; r < rows; r++ ) {
            nodes.push( new Node( c * nodeGap + Xoffset, r * nodeGap + Yoffset, nodeSize, Math.floor( random( birthTransition ) ) ) );
        }
    }
}

function draw() {
    background( 51 );

    for( let n in nodes ) {
        nodes[ n ].update();

        if( drawNodes )
            nodes[ n ].draw();

        for( let o in nodes ) {
            drawConnection( nodes[ n ], nodes[ o ] );
        }
    }
}

function drawConnection( n1, n2 ) {
    if( n1.pos.x == n2.pos.x && n1.pos.y == n2.pos.y ) return;
    if( !n1.alive || !n2.alive ) return;

    let distance = n1.pos.dist( n2.pos );
    if( distance <= maxConnectionDistance ) {
        let alpha = map( distance, 0, maxConnectionDistance, 255, 0 );
        alpha = Math.floor( constrain( alpha, 0, 255 ) );

        stroke( 255, alpha );
        strokeWeight( 1 );
        line( n1.pos.x, n1.pos.y, n2.pos.x, n2.pos.y );
    }
}


// NODE
class Node {
    constructor( x, y, size, birthDelay ) {
        this.pos = createVector( x, y );
        this.vel = p5.Vector.random2D().mult( 0.4 );
        this.size = size;

        this.birthDelay = birthDelay;
        this.birthMoment = Date.now();
        this.alpha = 0;
        this.alive = false;
    }

    update() {
        // wrap arround canvas
        if( this.pos.x < -this.size ) this.pos.x = width + this.size;
        if( this.pos.x > width + this.size ) this.pos.x = -this.size;
        if( this.pos.y < -this.size ) this.pos.y = height + this.size;
        if( this.pos.y > height + this.size ) this.pos.y = -this.size;

        // repel mouse
        let m = createVector( mouseX, mouseY );
        let distance = this.pos.dist( m );
        if( distance < 280 && distance > 0 ) {
            let value = 1 / ( distance * distance );
            let force = value * 18000;

            let acc = createVector( ( this.pos.x - m.x ), ( this.pos.y - m.y ) );
            acc.setMag( force );

            this.pos.add( acc.x, acc.y );
        }


        // update position
        if( mode == 0 )
            this.pos.add( this.vel.x * speedMultipier, this.vel.y * speedMultipier );
        else
            this.pos.add( this.vel.x * speedMultipier, this.vel.x * speedMultipier );

        // check alive
        if( !this.alive )
            this.alive = !!( Date.now() > this.birthMoment + this.birthDelay );
    }

    draw() {
        if( this.alive ) {
            if( this.alpha < 127 ) this.alpha++;
            fill( 60, 60, 120, this.alpha );
            noStroke();
            ellipse( this.pos.x, this.pos.y, this.size );
        }
    }
}
