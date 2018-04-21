var MAX_INT32 = 2147483647;
var MINSTD = 16807;

/**
 * Performs a Fisher-Yates array shuffle.
 * 
 * @param  {<*>}        array the array to shuffle
 * @param  {number=}    seed the seed value
 * @return {<*>}        the suffled array
 */
function shuffle( array, seed ) {
    var rng;
    var result = []

    if ( typeof seed !== 'undefined' ){
        if ( !Number.isInteger( seed ) ) {
            throw new Error('Invalid seed argument. Integer required.');
        }
        var rnd = new Random( seed );
        rng = rnd.nextFloat.bind(rnd);
    } else {
        rng = Math.random;
    }

    for ( var i = 0; i < array.length; ++i ) {
      var j = Math.floor( rng() * ( i + 1 ) );
  
      if ( j !== i ) {
        result[i] = result[j];
      }
  
      result[j] = array[i];
    }
  
    return result
}

// Polyfill for Internet Explorer
Number.isInteger = Number.isInteger || function( value ) {
    return typeof value === 'number' &&
        isFinite( value ) &&
        Math.floor( value ) === value;
};

/**
 * Creates a the Park-Miller PRNG pseudo-random value generator. 
 * The seed must be an integer.
 * 
 * Adapted from: https://gist.github.com/blixt/f17b47c62508be59987b
 */
function Random( seed ) {
    this._seed = seed % MAX_INT32;
	if ( this._seed <= 0 ) {
		this._seed += ( MAX_INT32 - 1 );
	}
}

/**
 * Returns a pseudo-random integer value.
 */
Random.prototype.next = function () {
    return this._seed = this._seed * MINSTD % MAX_INT32;
};

/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function () {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return ( this.next() - 1 ) / ( MAX_INT32 - 1 );
}; 