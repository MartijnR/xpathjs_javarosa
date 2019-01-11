let doc, win, docEvaluate;

before( done => {
    console.log( 'running before' );

    const iframe = document.createElement( 'iframe' );
    iframe.setAttribute( 'id', 'testdoc' );
    iframe.setAttribute( 'src', '/base/test/doc.xml' );

    iframe.onload = () => {
        const script = document.createElement( 'script' );
        // TODO: should load parser and engine separately to facilitate development
        script.setAttribute( 'src', '/base/dist/enketo-xpathjs-bundle.js' );

        script.onload = () => {
            win = iframe.contentWindow;
            doc = win.document;
            win.XPathJS.bindDomLevel3XPath();
            docEvaluate = doc.evaluate;
            done();
        };

        iframe.contentWindow.document.querySelector( 'body' ).appendChild( script );
    };
    document.body.appendChild( iframe );

    /*
    loadXMLFile('/base/test/doc.xml', function(xmlStr) {
        var parser = new window.DOMParser();
        win = window;
        win.XPathJS.bindDomLevel3XPath();
        doc = parser.parseFromString(xmlStr, "text/xml");
        docEvaluate = win.document.evaluate;
        done();
    });*/

} );
