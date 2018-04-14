var utils = {     
     /**
      * Performs a Fisher-Yates efficient in-place array shuffle.
      * 
      * @param  {<*>} array the array to shuffle
      * @return {<*>}       the suffled array
      */
    shuffle: function( array ) {
         var m = array.length;
         var t;
         var i;

         // While there remain elements to shuffle…
         while ( m ) {
             // Pick a remaining element…
             i = Math.floor( Math.random() * m-- );
             // And swap it with the current element.
             t = array[ m ];
             array[ m ] = array[ i ];
             array[ i ] = t;
         }

         return array;
     },     
}
// Polyfill
Number.isInteger = Number.isInteger || function( value ) {
    return typeof value === 'number' &&
        isFinite( value ) &&
        Math.floor( value ) === value;
};