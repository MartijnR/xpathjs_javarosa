/**
 * Performs a Fisher-Yates efficient in-place array shuffle.
 * 
 * @param  {<*>}        array the array to shuffle
 * @param  {number=}    seed the seed value
 * @return {<*>}        the suffled array
 */
function shuffle( array, seed ) {
    var m = array.length;
    var t;
    var i;

    if ( typeof seed !== 'undefined' ){
        if ( !Number.isInteger( seed ) ) {
            throw new Error('Invalid seed argument. Integer required.');
        }
    } else {
        seed = Math.floor( Math.random() * Number.MAX_SAFE_INTEGER );
    }

    var rnd = new Random(seed);

    // While there remain elements to shuffle…
    while ( m ) {
        // Pick a remaining element…
        i = Math.floor( rnd.nextFloat() * m-- );
        // And swap it with the current element.
        t = array[ m ];
        array[ m ] = array[ i ];
        array[ i ] = t;
    }

    return array;
}

// Polyfill for Internet Explorer
Number.isInteger = Number.isInteger || function( value ) {
    return typeof value === 'number' &&
        isFinite( value ) &&
        Math.floor( value ) === value;
};

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 * 
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 * 
 * From: https://gist.github.com/blixt/f17b47c62508be59987b
 */
function Random( seed ) {
    this._seed = seed % 2147483647;
    if ( this._seed <= 0 ) {
        this._seed += 2147483646;
    }
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
    return this._seed = this._seed * 16807 % 2147483647;
};

/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function () {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return ( this.next() - 1 ) / 2147483646;
}; 