describe( 'creating expressions', () => {

    it( 'parses', () => {
        const resolver = documentCreateNSResolver( doc.documentElement );
        const expression = documentCreateExpression( '1', resolver );

        expect( expression ).to.be.an.instanceOf( win.XPathExpression );
    } );

    it( 'throws invalid expression exceptions', () => {
        const resolver = documentCreateNSResolver( doc.documentElement );
        const test = () => {
            documentCreateExpression( 'aa&&aa', resolver );
        };

        expect( test ).to.throw( win.XPathException.INVALID_EXPRESSION_ERR ); //,/DOM XPath Exception 51/);
    } );

    it( 'throws exception when parsing without a resolver', () => {
        const test = () => {
            documentCreateExpression( 'xml:node' );
        };

        expect( test ).to.throw( win.XPathException.NAMESPACE_ERR );
    } );

    it( 'parses with a namespace', () => {
        const test = () => {
            const resolver = documentCreateNSResolver( doc.documentElement );
            documentCreateExpression( 'node1 | xml:node2 | ev:node2', resolver );
        };

        expect( test ).not.to.throw();
    } );

    it( 'throws an exception if namespace is incorrect', () => {
        const resolver = documentCreateNSResolver( doc.documentElement );
        const test = () => {
            documentCreateExpression( 'as:node1 | ev:node2', resolver );
        };

        expect( test ).to.throw( win.DOMException.NAMESPACE_ERR ); //,/DOM Exception 14/);
    } );
} );
