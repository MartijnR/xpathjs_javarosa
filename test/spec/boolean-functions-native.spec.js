describe( 'native boolean functions', () => {

    it( 'true()', () => {
        const result = documentEvaluate( "true()", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );
    } );

    it( 'true() fails when too many arguments are provided', () => {
        const test = () => {
            documentEvaluate( "true(1)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'false()', () => {
        const result = documentEvaluate( "false()", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'true() fails when too many arguments are provided', () => {
        const test = () => {
            documentEvaluate( "false('a')", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'boolean()', () => {
        let result;

        result = documentEvaluate( "boolean('a')", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean('')", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'boolean() conversion of booleans', () => {
        let result;

        result = documentEvaluate( "boolean(true())", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(false())", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'boolean() conversion of numbers', () => {
        let result;

        result = documentEvaluate( "boolean(1)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(-1)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(1 div 0)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(0.1)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean('0.0001')", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(0)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );

        result = documentEvaluate( "boolean(0.0)", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );

        result = documentEvaluate( "boolean(number(''))", doc, null, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'boolean() conversion of nodeset', () => {
        let result;

        result = documentEvaluate( "boolean(/xhtml:html)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(/asdf)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );

        result = documentEvaluate( "boolean(self::node())", doc.getElementById( 'FunctionBooleanEmptyNode' ), helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "boolean(//xhtml:article)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'boolean() fails when too few arguments are provided', () => {
        const test = () => {
            documentEvaluate( "boolean()", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'boolean() fails when too many arguments are provided', () => {
        const test = () => {
            documentEvaluate( "boolean(1, 2)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'not()', () => {
        let result;

        result = documentEvaluate( "not(true())", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );

        result = documentEvaluate( "not(false())", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( true );

        result = documentEvaluate( "not(1)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        expect( result.booleanValue ).to.equal( false );
    } );

    it( 'not() fails when too few arguments are provided', () => {
        const test = () => {
            documentEvaluate( "not()", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'not() fails when too many arguments are provided', () => {
        const test = () => {
            documentEvaluate( "not(1, 2)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'lang()', () => {
        [
            [ "lang('en')", doc.documentElement, true ],
            [ "lang('EN')", doc.documentElement, true ],
            [ "lang('EN-us')", doc.documentElement, true ],
            [ "lang('EN-us-boont')", doc.documentElement, false ], //
            // hierarchy check
            [ "lang('EN')", doc.querySelector( 'body' ), true ],
            [ "lang('sr')", doc.getElementById( 'testLang2' ), true ],
            [ "lang('sr-Cyrl-bg')", doc.getElementById( 'testLang2' ), true ],
            [ "lang('fr')", doc.getElementById( 'testLang2' ), false ], //
            // node check
            [ "lang('sl')", doc.getElementById( 'testLang3' ), true ], //
            // attribute node check
            [ "lang('sr-Cyrl-bg')", filterAttributes( doc.getElementById( 'testLang4' ).attributes )[ 0 ], true ]
        ].forEach( t => {
            const result = documentEvaluate( t[ 0 ], t[ 1 ], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
            expect( result.booleanValue ).to.equal( t[ 2 ] );
        } );
    } );

    it( 'lang() fails when too few arguments are provided', () => {
        const test = () => {
            documentEvaluate( "lang()", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );

    it( 'lang() fails when too many arguments are provided', () => {
        const test = () => {
            documentEvaluate( "lang(1, 2)", doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null );
        };
        expect( test ).to.throw( win.Error );
    } );
} );
