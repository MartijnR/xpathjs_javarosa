describe( 'location path', () => {
    let h;

    before( () => {
        h = {
            oneNamespaceNode( node ) {
                let result, item;

                result = documentEvaluate( "namespace::node()", node, null, win.XPathResult.ANY_UNORDERED_NODE_TYPE, null );
                item = result.singleNodeValue;
                expect( item ).to.not.equal( null );
                expect( item.nodeType ).to.equal( 13 );

                return item;
            }
        };
    } );

    it( 'root', () => {
        let i;
        let node;

        const input = [
            [ doc, [ doc ] ], // Document
            [ doc.documentElement, [ doc ] ], // Element
            [ doc.getElementById( 'LocationPathCase' ), [ doc ] ], // Element
            [ doc.getElementById( 'LocationPathCaseText' ).firstChild, [ doc ] ], // Text
            [ doc.getElementById( 'LocationPathCaseComment' ).firstChild, [ doc ] ], // Comment
            [ filterAttributes( doc.getElementById( 'LocationPathCaseAttribute' ).attributes )[ 0 ],
                [ doc ]
            ] // Attribute
        ];

        // ProcessingInstruction
        node = doc.getElementById( 'LocationPathCaseProcessingInstruction' ).firstChild;
        if ( node && node.nodeType == 7 ) {
            input.push( [ node, [ doc ] ] );
        }

        // CDATASection
        node = doc.getElementById( 'LocationPathCaseCData' ).firstChild;
        if ( node && node.nodeType == 4 ) {
            input.push( [ node, [ doc ] ] );
        }

        for ( i = 0; i < input.length; i++ ) {
            checkNodeResult( "/", input[ i ][ 0 ], input[ i ][ 1 ] );
        }
    } );

    it( 'root namespace', () => {
        const input = [ h.oneNamespaceNode( doc.getElementById( 'LocationPathCaseNamespace' ) ), [ doc ] ]; // XPathNamespace
        checkNodeResult( "/", input[ 0 ], input[ 1 ] );
    } );

    it( 'root node', () => {
        checkNodeResult( "/html", doc, [], helpers.xhtmlResolver );
        checkNodeResult( "/xhtml:html", doc, [ doc.documentElement ], helpers.xhtmlResolver );
        checkNodeResult( "/xhtml:html", doc.getElementById( 'LocationPathCase' ), [ doc.documentElement ], helpers.xhtmlResolver );
        checkNodeResult( "/htmlnot", doc.getElementById( 'LocationPathCase' ), [], helpers.xhtmlResolver );
    } );

    it( 'root node node', () => {
        checkNodeResult( "/xhtml:html/xhtml:body", doc.getElementById( 'LocationPathCase' ), [ doc.querySelector( 'body' ) ], helpers.xhtmlResolver );
    } );

    it( 'node (node)', () => {
        checkNodeResult( "html", doc, [], helpers.xhtmlResolver );
        checkNodeResult( "xhtml:html", doc, [ doc.documentElement ], helpers.xhtmlResolver );
        checkNodeResult( "xhtml:html/xhtml:body", doc, [ doc.querySelector( 'body' ) ], helpers.xhtmlResolver );
    } );

    xit( 'node attribute', () => {
        const node = doc.getElementById( 'LocationPathCaseAttributeParent' );

        checkNodeResult( "child::*/attribute::*", node, [
            filterAttributes( node.childNodes[ 0 ].attributes )[ 0 ],
            filterAttributes( node.childNodes[ 1 ].attributes )[ 0 ],
            filterAttributes( node.childNodes[ 1 ].attributes )[ 1 ],
            filterAttributes( node.childNodes[ 2 ].attributes )[ 0 ],
            filterAttributes( node.childNodes[ 3 ].attributes )[ 0 ]
        ], helpers.xhtmlResolver );
    } );

    xit( 'node namespace', () => {
        const node = doc.getElementById( 'LocationPathCaseNamespaceParent' ); //

        checkNodeResultNamespace( "child::* /namespace::*", node, [
            [ '', 'http://asdss/' ],
            [ 'ev', 'http://some-namespace.com/nss' ],
            [ 'xml', 'http://www.w3.org/XML/1998/namespace' ],
            [ '', 'http://www.w3.org/1999/xhtml' ],
            [ 'ab', 'hello/world2' ],
            [ 'a2', 'hello/world' ],
            [ 'aa', 'http://saa/' ],
            [ 'ev', 'http://some-namespace.com/nss' ],
            [ 'xml', 'http://www.w3.org/XML/1998/namespace' ],
            [ '', 'http://www.w3.org/1999/xhtml' ],
            [ 'ev', 'http://some-namespace.com/nss' ],
            [ 'xml', 'http://www.w3.org/XML/1998/namespace' ],
            [ '', 'http://www.w3.org/1999/xhtml' ],
            [ 'aa', 'http://saa/' ],
            [ 'ev', 'http://some-namespace.com/nss' ],
            [ 'xml', 'http://www.w3.org/XML/1998/namespace' ]
        ], helpers.xhtmlResolver );
    } );

    it( 'duplicates handled correctly', () => {
        checkNodeResult( "ancestor-or-self::* /ancestor-or-self::*", doc.getElementById( 'LocationPathCaseDuplicates' ), [
            doc.documentElement,
            doc.querySelector( 'body' ),
            doc.getElementById( 'LocationPathCase' ),
            doc.getElementById( 'LocationPathCaseDuplicates' )
        ], helpers.xhtmlResolver );
    } );
} );
