describe( 'xpath exceptions', () => {

    it( 'Exception constants have expected values', () => {
        expect( win.XPathException.INVALID_EXPRESSION_ERR ).to.equal( 51 );
        expect( win.XPathException.TYPE_ERR ).to.equal( 52 );
    } );

    it( 'Constructor is constructing nicely with a message', () => {
        const message = 'here is the message';
        const ex = new win.XPathException( win.XPathException.INVALID_EXPRESSION_ERR, message );

        // check code
        expect( ex.code ).to.equal( win.XPathException.INVALID_EXPRESSION_ERR );
        expect( ex.code ).to.equal( 51 );

        // check message
        expect( ex.message ).to.equal( message );

        // check toString
        expect( ex.toString ).to.be.an.instanceOf( win.Function );
        expect( ex.toString() ).to.equal( `XPathException: "${ex.message}", code: "${ex.code}", name: "INVALID_EXPRESSION_ERR"` );
    } );

    it( 'Constructor is constructing nicely without a message', () => {
        const ex = new win.XPathException( win.XPathException.INVALID_EXPRESSION_ERR );
        expect( ex.message ).to.equal( "" );
    } );

    it( 'Constructor throws exception when wrong arguments provided', () => {
        const test = () => {
            new win.XPathException( 99, 'message goes here' );
        };
        expect( test ).to.throw( win.Error, /Unsupported XPathException code: 99/ );
    } );

} );
