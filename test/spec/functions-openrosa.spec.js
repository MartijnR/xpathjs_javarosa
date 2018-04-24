/* global define, document, describe, xdescribe, require, it, xit, before, after, beforeEach, afterEach, expect, Blob, doc, win, docEvaluate, documentEvaluate, window, loadXMLFile, helpers, XPathJS*/
'use strict';

describe('Custom "OpenRosa" functions', function () {

    //test only the use of position(node) with an argument
    it('position(node)', function () {
        [
            ['position(..)', doc.getElementById('FunctionNumberCaseNumberMultiple'), 6],
            ['position(.)', doc.getElementById('FunctionNumberCaseNumberMultiple'), 3],
            ['position(../..)', doc.getElementById('testFunctionNodeset3NodeP'), 2]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(t[2]).to.equal(result.numberValue);
        });
    });

    it('selected()', function () {
        [
            ["selected(self::node(), '')", doc.getElementById('FunctionSelectedCaseEmpty'), true],
            ["selected(self::node(), 'ab')", doc.getElementById('FunctionSelectedCaseEmpty'), false],
            ["selected(self::node(), 'bc')", doc.getElementById('FunctionSelectedCaseSingle'), false],
            ["selected(self::node(), 'ab')", doc.getElementById('FunctionSelectedCaseSingle'), true],
            ["selected(self::node(), 'kl')", doc.getElementById('FunctionSelectedCaseMultiple'), false],
            ["selected(self::node(), 'ab')", doc.getElementById('FunctionSelectedCaseMultiple'), true],
            ["selected(self::node(), 'cd')", doc.getElementById('FunctionSelectedCaseMultiple'), true],
            ["selected(self::node(), 'ij')", doc.getElementById('FunctionSelectedCaseMultiple'), false],
            ["selected('apple baby crimson', 'apple')", doc, true],
            ["selected('apple baby crimson', 'baby')", doc, true],
            ["selected('apple baby crimson', 'crimson')", doc, true],
            ["selected('apple baby crimson', '  baby  ')", doc, true],
            ["selected('apple baby crimson', 'babby')", doc, false],
            ["selected('apple baby crimson', 'bab')", doc, false],
            ["selected('apple', 'apple')", doc, true],
            ["selected('apple', 'ovoid')", doc, false],
            ["selected('', 'apple')", doc, false]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('selected-at()', function () {
        [
            ["selected-at(self::node(), 0)", doc.getElementById('FunctionSelectedCaseEmpty'), ''],
            ["selected-at(self::node(), 0)", doc.getElementById('FunctionSelectedCaseSingle'), 'ab'],
            ["selected-at(self::node(), 1)", doc.getElementById('FunctionSelectedCaseSingle'), ''],
            ["selected-at(self::node(), 2)", doc.getElementById('FunctionSelectedCaseMultiple'), 'ef'],
            ["selected-at(self::node(), -1)", doc.getElementById('FunctionSelectedCaseMultiple'), ''],
            ["selected-at('apple baby crimson', 2)", doc, 'crimson'],
            ["selected-at('apple baby crimson', -1)", doc, ''],
            ["selected-at('', 1)", doc, '']
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.STRING_TYPE, null);
            expect(t[2]).to.equal(result.stringValue);
        });
    });

    it('count-selected()', function () {
        [
            ["count-selected(self::node())", doc.getElementById('FunctionSelectedCaseEmpty'), 0],
            ["count-selected(self::node())", doc.getElementById('FunctionSelectedCaseSingle'), 1],
            ["count-selected(self::node())", doc.getElementById('FunctionSelectedCaseMultiple'), 4]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(t[2]).to.equal(result.numberValue);
        });
    });

    it('checklist()', function () {
        [
            ["checklist(-1, 2, 2>1)", doc, true],
            ["checklist(-1, 2, 1=1, 2=2, 3=3)", doc, false],
            ["checklist(1, 2, 1=1, 2=2, 3=3)", doc, false],
            ["checklist(1, 1, 1=1)", doc, true],
            ["checklist(2, 2, * )", doc.getElementById('FunctionChecklistCase'), true],
            ["checklist(-1, 2, self::node())", doc.getElementById('FunctionChecklistCaseEmpty'), true],
            ["checklist(1, 2, self::node())", doc.getElementById('FunctionChecklistCaseEmpty'), false],
            ["checklist(1, 1, true(), false(), false())", doc, true]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('weighted-checklist()', function () {
        // Note: test for two node-set arguments done elsewhere
        [
            ["weighted-checklist(-1, 2, 2>1, 2)", doc, true],
            ["weighted-checklist(-1, 2, 2>1, 3)", doc, false],
            ["weighted-checklist(-1, 2, 1=1, 1, 2=2, 1, 3=3, 1)", doc, false],
            ["weighted-checklist(1, 2, 1=1, 1, 2=2, 1, 3=3, 1)", doc, false],
            ["weighted-checklist(1, 1, 1=1, 1)", doc, true],
            ["weighted-checklist(1, 1, 1=1, 0)", doc, false],
            ["weighted-checklist(5, 5, self::* ,5)", doc.getElementById('FunctionChecklistCase0'), true],
            ["weighted-checklist(-1, 2, self::node(), 0)", doc.getElementById('FunctionChecklistCaseEmpty'), true],
            ["weighted-checklist(1, 2, self::node(), 1)", doc.getElementById('FunctionChecklistCaseEmpty'), false],
            ["weighted-checklist(3, 3, 1=1, self::node())", doc.getElementById('FunctionWeightedChecklist'), true],
            ["weighted-checklist(2, 2, true(), 2, false(), 5, false(), 6)", doc, true],
            ["weighted-checklist(2, -1, true(), 999, false(), 5, false(), 6)", doc, true]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('boolean-from-string()', function () {
        [
            ["boolean-from-string(1)", doc, true],
            ["boolean-from-string(0)", doc, false],
            ["boolean-from-string('1')", doc, true],
            ["boolean-from-string('2')", doc, false],
            ["boolean-from-string('0')", doc, false],
            ["boolean-from-string('true')", doc, true],
            ["boolean-from-string('false')", doc, false],
            ["boolean-from-string('whatever')", doc, false],
            ["boolean-from-string(1.0)", doc, true],
            ["boolean-from-string(1.0001)", doc, false],
            ["boolean-from-string(true())", doc, true]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('if()', function () {
        [
            ["if(true(), 5, 'abc')", doc, "5"],
            ["if(false(), 5, 'abc')", doc, "abc"],
            ["if(6 > 7, 5, 'abc')", doc, "abc"],
            ["if('', 5, 'abc')", doc, "abc"],
            ["if(self::node(), 'exists', 'does not exist')", doc.getElementById('FunctionChecklistCaseEmpty'), 'exists']
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.STRING_TYPE, null);
            expect(t[2]).to.equal(result.stringValue);
        });
    });

    it('regex()', function () {
        [
            ["regex('12345','[0-9]+')", doc, true],
            ["regex('abcde','[0-9]+')", doc, false]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    // THIS IS NOT A CUSTOM FUNCTION
    it('contextual and absolute', function () {
        [
            ["(. >= 122)", doc.getElementById('FunctionNumberCaseNumber'), true],
            ["(. < //xhtml:div[@id='FunctionNumberCaseNumber'])", doc.getElementById('FunctionChecklistCase0'), true],
            ["(. > /xhtml:html/xhtml:body/xhtml:div[@id='FunctionNumberCase']/xhtml:div[@id='FunctionNumberCaseNumber'])", doc.getElementById('FunctionChecklistCase0'), false],
            ["(//xhtml:div[@id='FunctionNumberCaseNumber'] >= 122)", doc.getElementById('XPathExpressionEvaluateCase'), true]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('dates as string', function(){
        [
            [ '"2018-01-01"', '2018-01-01'],
            [ 'date("2018-01-01")', '2017-12-31T17:00:00.000-07:00'], // America/Phoenix
            [ '"2018-01-01" + 1', '17533'], // converted to Number according to regular XPath rules
            [ 'date("2018-01-01" + 1)', '2018-01-01T17:00:00.000-07:00'],
        ].forEach(function( t ){
            var result = documentEvaluate(t[0], doc, helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[1]);
        });

        [
            "today()",
            "now()",
            "date(today() + 10)",
            "date(10 + today())"
        ].forEach(function(t) {
            var result = documentEvaluate(t, doc, helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.match(/([0-9]{4}\-[0-9]{2}\-[0-9]{2})([T]|[\s])([0-9]){2}:([0-9]){2}([0-9:.]*)(\+|\-)([0-9]{2}):([0-9]{2})$/);
        });
    });

    it('converts dates to numbers', function () {
        [
            ["number(date('1970-01-01'))", 0],
            ["number(date('1970-01-02'))", 1],
            ["number(date('1969-12-31'))", -1],
            ["number(date('2008-09-05'))", 14127],
            ["number(date('1941-12-07'))", -10252],
            ["number('2008-09-05')", 14127],
            ["number( 1 div 1000000000 )", 1e-9]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            expect(t[1]).to.equal(result.numberValue);
        });

        //for nodes (where the date datatype is guessed)
        [
            [".", doc.getElementById("FunctionDateCase1"), 15544],
            [".", doc.getElementById("FunctionDateCase2"), 15572]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            //Y.Assert.areSame(input[i][2], result.numberValue);
            expect(t[2]).to.equal(result.numberValue);
        });
    });

    it('datetype comparisons', function () {
        [
            ["date('2001-12-26') > date('2001-12-25')", true],
            ["date('1969-07-20') < date('1969-07-21')", true],
            ["date('2004-05-01') = date('2004-05-01')", true],
            ["true() != date('1999-09-09')", false],
            ["date(0) = date('1970-01-01')", true],
            //["date(6.5)", "date('1970-01-07')"],
            ["date(1) = date('1970-01-02')", true],
            ["date(-1) = date('1969-12-31')", true],
            ["date(14127) = date('2008-09-05')", true],
            ["date(-10252) = date('1941-12-07')", true],
            ["date(date('1989-11-09')) = date('1989-11-09')", true],
            ["date('2012-01-01') < today()", true],
            ["date('2100-01-02') > today()", true],
            ["date('2012-01-01') < now()", true],
            ["date('2100-01-02') > now()", true],
            ["now() > today()", true]
        ].forEach(function (t) {
            var expr = t[0];
            var result = documentEvaluate(expr, doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[1]).to.equal(result.booleanValue);
            // do the same tests for the alias date-time()
            expr = expr.replace('date(', 'date-time(');
            result = documentEvaluate(expr, doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[1]).to.equal(result.booleanValue);
        });
    });

    it('datestring comparisons (date detection)', function () {
        [
            [". < date('2012-07-24')", doc.getElementById("FunctionDateCase1"), true],
            //returns false if strings are compared but true if dates are compared
            ["../node()[@id='FunctionDateCase2'] > ../node()[@id='FunctionDateCase3']", doc.getElementById("FunctionDateCase1"), true]
        ].forEach(function (t) {
            var expr = t[0]; //
            var result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
            // do the same tests for the alias date-time()
            expr = expr.replace('date(', 'date-time(');
            result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });
    });

    it('date calculations', function () {
        [
            ["today() > ('2012-01-01' + 10)", doc, true],
            ["10 + date('2012-07-24') = date('2012-08-03')", doc, true],
            [". = date('2012-07-24') - 1", doc.getElementById("FunctionDateCase1"), true],
            [". > date('2012-07-24') - 2", doc.getElementById("FunctionDateCase1"), true],
            [". < date('2012-07-25') - 1", doc.getElementById("FunctionDateCase1"), true],
            [". = 30 + /xhtml:html/xhtml:body/xhtml:div[@id='FunctionDate']/xhtml:div[@id='FunctionDateCase4']", doc.getElementById("FunctionDateCase1"), true],
            ["10 + '2012-07-24' = '2012-08-03'", doc, true]
        ].forEach(function (t) {
            var expr = t[0];
            var result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
            // do the same tests for the alias date-time()
            expr = expr.replace('date(', 'date-time(');
            result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(t[2]).to.equal(result.booleanValue);
        });

        [
            ["10 + date('2012-07-24')", doc, 15555]
        ].forEach(function (t) {
            var expr = t[0];
            var result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.equal(t[2]);
            // do the same tests for the alias date-time()
            expr = expr.replace('date(', 'date-time(');
            result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.equal(t[2]);
        });
    });

    it('invalid dates', function () {
        [
            "date('1983-09-31')",
            "date('not a date')",
            "date('opv_3')",
            "date(true())"
            //"date(convertible())"
        ].forEach(function (t) {
            var expr = t[0];
            var result = documentEvaluate(expr, doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(result.booleanValue).to.equal(false);
            // do the same tests for the alias date-time()
            expr = expr.replace('date(', 'date-time(');
            result = documentEvaluate(expr, doc, helpers.xhtmlResolver, win.XPathResult.BOOLEAN_TYPE, null);
            expect(result.booleanValue).to.equal(false);
        });
    });

    // Karma config is setting timezone to America/Denver
    it('format-date()', function () {
        var
            date = new Date();
        [
            ["format-date(.,  '%Y/%n | %y/%m | %b' )", doc.getElementById("FunctionDateCase1"), '2012/7 | 12/07 | Jul'],
            ["format-date(., '%Y/%n | %y/%m | %b')", doc.getElementById("FunctionDateCase2"), '2012/8 | 12/08 | Aug'],
            ["format-date(., '%M | %S | %3')", doc.getElementById("FunctionDateCase2"), '00 | 00 | 000'],
            ["format-date('" + date.toString() + "', '%e | %a' )", doc,
            date.getDate() + ' | ' + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
            ],
            ["format-date('not a date', '%M')", doc, 'Invalid Date'],
            //["format-date('Mon, 02 Jul 2012 00:00:00 GMT', )", doc, '']
            // the test below probably only works in the GMT -6 timezone...
            ["format-date(., '%Y | %y | %m | %n | %b | %d | %e | %H | %h | %M | %S | %3 | %a')", doc.getElementById("FunctionDateCase5"),
                '2012 | 12 | 08 | 8 | Aug | 08 | 8 | 06 | 6 | 07 | 08 | 123 | Wed'
            ],
        ].forEach(function (t) {
            var expr = t[0];
            var result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
            // do the same tests for the alias format-date-time()
            expr = expr.replace('format-date', 'format-date-time');
            result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
        });
    });

    // Karma config is setting timezone to America/Denver
    it('format-date() - locale dependent', function () {
        [
            ["format-date('2017-05-26T00:00:01-07:00', '%a %b')", doc, 'Fri May'],
            ["format-date('2017-05-26T23:59:59-07:00', '%a %b')", doc, 'Fri May'],
            ["format-date('2017-05-26T01:00:00-07:00', '%a %b')", doc, 'Fri May', 'en'],
            ["format-date('2017-05-26T01:00:00-07:00', '%a %b')", doc, 'ven. mai', 'fr'],
            ["format-date('2017-05-26T01:00:00-07:00', '%a %b')", doc, 'vr mei', 'nl'],
        ].forEach(function (t) {
            document.querySelector('iframe').contentWindow.enketoFormLocale = t[3];
            var expr = t[0];
            var result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
            // do the same tests for the alias format-date-time()
            expr = expr.replace('format-date', 'format-date-time');
            result = documentEvaluate(expr, t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
        });
    });

    it('uuid()', function () {
        var result = documentEvaluate('uuid()', doc, null, win.XPathResult.STRING_TYPE);
        expect(result.stringValue).to.have.length(36);
    });

    it('int()', function () {
        var result;
        [
            ["int(2.1)", 2],
            ["int(2.51)", 2],
            ["int(2)", 2],
            ["int('2.1')", 2],
            ["int('2.51')", 2],
            ["int(1 div 47999799999)", 0], //(2.08e-11)
            ["int(-1.4)", -1],
            ["int(-1.51)", -1]
        ].forEach(function (t) {
            result = documentEvaluate(t[0], doc, null, win.XPathResult.NUMBER_TYPE);
            expect(result.numberValue).to.equal(t[1]);
        });

        result = documentEvaluate('int("a")', doc, null, win.XPathResult.NUMBER_TYPE);
        expect(result.numberValue).to.deep.equal(NaN);

        // XPath 1.0 does not deal with scientific notation
        result = documentEvaluate('int("7.922021953507237e-12")', doc, null, win.XPathResult.NUMBER_TYPE);
        expect(result.numberValue).to.deep.equal(NaN);
    });

    it('substr()', function () {
        [
            ["substr('hello',0)", "hello"],
            ["substr('hello',0,5)", "hello"],
            ["substr('hello',1)", "ello"],
            ["substr('hello',1,5)", "ello"],
            ["substr('hello',1,4)", "ell"],
            ["substr('hello',-2)", "lo"],
            ["substr('hello',0,-1)", "hell"]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, null, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[1]);
        });
    });

    it('random()', function () {
        var result = documentEvaluate('random()', doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.match(/0\.[0-9]{15}/);
    });

    it('min()', function () {
        [
            ["min(self::*)", doc.getElementById('FunctionNumberCaseNumber'), 123],
            ["min(self::*)", doc.getElementById('FunctionMaxMinCaseEmpty'), NaN],
            ["min(*)", doc.getElementById('FunctionNumberCaseNumberMultiple'), -10],
            ["min(*)", doc.getElementById('FunctionMinCase'), 0],
            ["min(//*[@id='FunctionMinCase']/*[position()=1], //*[@id='FunctionMinCase']/*[position()=2], //*[@id='FunctionMinCase']/*[position()=3])", doc, 0],
            ["min(*)", doc.getElementById('FunctionMaxMinWithEmpty'), NaN],
            ["min(1, 2, 3)", doc, 1],
            ["min(1, 2, 0)", doc, 0],
            ["min(0, 2, 3)", doc, 0],
            ["min(-1, 2, 3)", doc, -1],
            ["min('')", doc, NaN],
            ["min(node())", doc.getElementById('FunctionNumberCaseNotNumberMultiple'), NaN],
            ["min(//nonexisting)", doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.be.a('number');
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('max()', function () {
        [
            ["max(self::*)", doc.getElementById('FunctionNumberCaseNumber'), 123],
            ["max(self::*)", doc.getElementById('FunctionMaxMinCaseEmpty'), NaN],
            ["max(*)", doc.getElementById('FunctionNumberCaseNumberMultiple'), 99],
            ["max(*)", doc.getElementById('FunctionMaxCase'), 0],
            ["max(//*[@id='FunctionMaxCase']/*[position()=1], //*[@id='FunctionMaxCase']/*[position()=2], //*[@id='FunctionMaxCase']/*[position()=3])", doc, 0],
            ["max(*)", doc.getElementById('FunctionMaxMinWithEmpty'), NaN],
            ["max(1, 2, 3)", doc, 3],
            ["max(-1, -3, 0)", doc, 0],
            ["max(-1, 0, -3)", doc, 0],
            ["max(-4, -1, -3)", doc, -1],
            ["max('')", doc, NaN],
            ["max(node())", doc.getElementById('FunctionNumberCaseNotNumberMultiple'), NaN],
            ["max(//nonexisting)", doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.be.a('number');
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('round()', function () {
        var result;
        [
            ["round(1.234)", 1],
            ["round(1.234, 2)", 1.23],
            ["round(1.234, 5)", 1.234],
            ["round(1.234, 0)", 1],
            ["round(33.33, -1)", 30],
            ["round(1 div 47999799999)", 0], //(2.08e-11)
        ].forEach(function (t) {
            result = documentEvaluate(t[0], doc, null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.equal(t[1]);
        });

        result = documentEvaluate("round('a')", doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.deep.equal(NaN);
    });

    it('round() with too many args throws exception', function () {
        var test = function () {
            documentEvaluate("round(1, 2, 3)", doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
        };
        expect(test).to.throw(win.Error);
    });

    it('join()', function () {
        [
            ["join(', ', *)", doc.getElementById('testFunctionNodeset2'), "1, 2, 3, 4"],
            ["join(' ', 'This', 'is', 'a', 'sentence.')", doc, "This is a sentence."],
            ["join(' ## ')", doc, ""]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
        });
    });

    // Javarosa accepts an optional node-set argument for concat which deviates from native XPath. It also accepts no arguments.
    it('concat()', function () {
        [
            ["concat(*, 'a')", doc.getElementById('testFunctionNodeset2'), '1234a'],
            ["concat(*)", doc.getElementById('testFunctionNodeset2'), '1234'],
            ["concat('a')", doc, 'a'],
            ["concat('a','b', '')", doc, 'ab'],
            ["concat()", doc.getElementById('testFunctionNodeset2'), '']
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
        });
    });

    it('coalesce()', function () {
        [
            ["coalesce('', 'ab')", doc, 'ab'],
            ["coalesce(self::*, 'ab')", doc.getElementById('FunctionSelectedCaseEmpty'), 'ab'],
            ["coalesce(self::*, 'cd')", doc.getElementById('FunctionSelectedCaseSingle'), 'ab']
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.STRING_TYPE, null);
            //Y.Assert.areSame(input[i][2], result.stringValue);
            expect(result.stringValue).to.equal(t[2]);
        });
    });

    it('pow()', function () {
        [
            ['pow(2, 2)', doc, 4],
            ['pow(2, 0)', doc, 1],
            ['pow(0,4)', doc, 0],
            ['pow(2.5, 2)', doc, 6.25],
            ['pow(0.5, 2)', doc, 0.25],
            ['pow(-1, 2)', doc, 1],
            ['pow(-1, 3)', doc, -1],
            ['pow(4, 0.5)', doc, 2],
            ['pow(16, 0.25)', doc, 2]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });


    it('sin()', function () {
        [
            ['sin(2)', doc, 0.9092974268256817],
            ['sin("a")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('cos()', function () {
        [
            ['cos(2)', doc, -0.4161468365471424],
            //['cos("a")', doc, NaN],
            ['cos("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('tan()', function () {
        [
            ['tan(2)', doc, -2.185039863261519],
            ['tan("a")', doc, NaN],
            ['tan("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('acos()', function () {
        [
            ['acos(0.5)', doc, 1.047197551196598],
            ['acos(-1)', doc, 3.141592653589793],
            ['acos(2)', doc, NaN],
            ['acos("a")', doc, NaN],
            ['acos("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            // rounding error on Travis
            expect(Math.round(result.numberValue * Math.pow(10, 15)) / Math.pow(10, 15)).to.deep.equal(t[2]);
        });
    });

    it('asin()', function () {
        [
            ['asin(0.5)', doc, 0.523598775598299],
            ['asin(-1)', doc, -1.570796326794896],
            ['asin(2)', doc, NaN],
            ['asin("a")', doc, NaN],
            ['asin("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            // rounding error on Travis
            expect(Math.round(result.numberValue * Math.pow(10, 15)) / Math.pow(10, 15)).to.deep.equal(t[2]);
        });
    });

    it('atan()', function () {
        [
            ['atan(0.5)', doc, 0.463647609000806],
            ['atan(-1)', doc, -0.785398163397448],
            ['atan("a")', doc, NaN],
            ['atan("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            // rounding error on Travis
            expect(Math.round(result.numberValue * Math.pow(10, 15)) / Math.pow(10, 15)).to.deep.equal(t[2]);
        });
    });

    it('atan2()', function () {
        [
            ['atan2(2,3)', doc, 0.5880026035475675],
            ['atan2(2, "NaN")', doc, NaN],
            ['atan2(2, "a")', doc, NaN],
            ['atan2("NaN", 2)', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('log()', function () {
        [
            ['log(2)', doc, 0.6931471805599453],
            ['log("NaN")', doc, NaN],
            ['log("a")', doc, NaN],
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('log10()', function () {
        [
            ['log10(2)', doc, 0.3010299956639812],
            ['log10("NaN")', doc, NaN],
            ['log10("a")', doc, NaN],
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('pi()', function () {
        [
            ['pi()', doc, 3.141592653589793],
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('exp()', function () {
        [
            ['exp(2)', doc, 7.38905609893065],
            ['exp("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('exp10()', function () {
        [
            ['exp10(2)', doc, 100],
            ['exp10(-2)', doc, 0.01],
            ['exp10("NaN")', doc, NaN],
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('sqrt()', function () {
        [
            ['sqrt(4)', doc, 2],
            ['sqrt(-2)', doc, NaN],
            ['sqrt("NaN")', doc, NaN]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[2]);
        });
    });

    it('once()', function () {
        var result;

        // attempt to change value of empty node
        result = documentEvaluate("once('aa')", doc.getElementById('FunctionSelectedCaseEmpty'), null, win.XPathResult.STRING_TYPE, null);
        expect(result.stringValue).to.equal("aa");

        // attempt to change value of node with existing value
        result = documentEvaluate("once('aa')", doc.getElementById('FunctionSelectedCaseSingle'), null, win.XPathResult.STRING_TYPE, null);
        expect(result.stringValue).to.equal("ab");

        // controversial: attempt to change value to NaN of empty node
        result = documentEvaluate("once(. * 10)", doc.getElementById('FunctionSelectedCaseEmpty'), null, win.XPathResult.STRING_TYPE, null);
        expect(result.stringValue).to.equal("");

        // controversial: attempt to change value to Infinity of empty node
        // result = documentEvaluate("once( 1 div 0)", doc.getElementById('FunctionSelectedCaseEmpty'), null, win.XPathResult.STRING_TYPE, null);
        // expect(result.stringValue).to.equal("");
    });

    it('area()', function () {
        var result,
            geoshapeValue1 = '7.9377 -11.5845 0 0;7.9324 -11.5902 0 0;7.927 -11.5857 0 0;7.925 -11.578 0 0;7.9267 -11.5722 0 0;7.9325 -11.5708 0 0;7.9372 -11.5737 0 0;7.9393 -11.579 0 0;7.9377 -11.5845 0 0',
            geoshapeValue2 = '38.253094215699576 21.756382658677467;38.25021274773806 21.756382658677467;38.25007793942195 21.763892843919166;38.25290886154963 21.763935759263404;38.25146813817506 21.758421137528785'; //

        result = documentEvaluate("area('" + geoshapeValue1 + "')", doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(2333220.77);

        result = documentEvaluate("area(.)", doc.getElementById('FunctionArea4'), null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(2333220.77);

        //from SurveyCTO/ODK
        result = documentEvaluate("area('" + geoshapeValue2 + "')", doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(151451.76);

        result = documentEvaluate("area(./*)", doc.getElementById('FunctionArea1'), null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(2333220.77);

        // from SurveyCTO/ODK
        result = documentEvaluate("area(./*)", doc.getElementById('FunctionArea2'), null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(122754.94);

        // from SurveyCTO/ODK
        result = documentEvaluate("area(./*)", doc.getElementById('FunctionArea3'), null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(93911.49);

        result = documentEvaluate("area('')", doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.deep.equal(NaN);

        result = documentEvaluate("area('7.9377 -11.5845 0 0;7.9324 -11.5902 0 0')", doc, null, win.XPathResult.NUMBER_TYPE, null);
        expect(result.numberValue).to.equal(0.0);
    });

    it('ends-with', function () {
        [
            ["ends-with('', '')", true],
            ["ends-with('a', '')", true],
            ["ends-with('a', 'a')", true],
            ["ends-with('a', 'b')", false],
            ["ends-with('ba', 'a')", true],
            ["ends-with('', 'b')", false]
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, null, win.XPathResult.BOOLEAN_TYPE, null);
            expect(result.booleanValue).to.equal(t[1]);
        });
    });

    it('ends-with() fails when too many arguments are provided', function () {
        var test = function () {
            documentEvaluate("ends-with(1, 2, 3)", doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
        };
        expect(test).to.throw(win.Error);
    });

    it('ends-with() fails when not enough arguments are provided', function () {
        var test = function () {
            documentEvaluate("ends-with()", doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
        };
        expect(test).to.throw(win.Error);

        test = function () {
            documentEvaluate("ends-with(1)", doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
        };
        expect(test).to.throw(win.Error);
    });

    it('abs', function () {
        [
            ['abs(10.5)', 10.5],
            ['abs(-10.5)', 10.5],
            ['abs("-10.5")', 10.5],
            ['abs("a")', NaN],
        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[1]);
        });
    });

    it('count-non-empty', function () {
        [
            ['count-non-empty(//xhtml:div[@id="FunctionCountNonEmpty"]/xhtml:div)', 2],
            ['count-non-empty(//xhtml:div[@id="FunctionCountNonEmpty"]/xhtml:p)', 1],
            ['count-non-empty(//xhtml:div[@id="FunctionCountNonEmpty"]/xhtml:p/xhtml:div)', 0],
            ['count-non-empty(//xhtml:div[@id="FunctionCountNonEmpty"]/xhtml:p/xhtml:span)', 2],
            ['count-non-empty(//xhtml:div[@id="FunctionCountNonEmpty"]//*)', 5],
            ['count-non-empty(//xhtml:div[@id="NoExist"]/xhtml:div)', 0],

        ].forEach(function (t) {
            var result = documentEvaluate(t[0], doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.deep.equal(t[1]);
        });
    });

    it('count-non-empty fails when too few, too many, or incorrect arguments are provided', function () {
        [
            'count-non-empty()',
            'count-non-empty(2)',
            'count-non-empty(0)',
            'count-non-empty("a")',
        ].forEach(function (t) {
            var test = function () {
                documentEvaluate(t, doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
            };
            expect(test).to.throw(win.Error);
        });

    });

    describe('randomize() shuffles nodesets', function(){
        var SELECTOR = '//xhtml:div[@id="FunctionRandomize"]/xhtml:div';

        it('without a seed', function(){
            var result = documentEvaluate(`randomize(${SELECTOR})`, doc, helpers.xhtmlResolver, win.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var nodes = [];
            var text = '';
            for ( var j = 0; j < result.snapshotLength; j++ ) {
                var node = result.snapshotItem( j );
                nodes.push( node );
                text += node.textContent;
            }
            expect(nodes.length).to.equal(6);
            expect(text.length).to.equal(6);
            expect(text).not.to.equal('ABCDEF');
        });

        [
            [42, 'AFCBDE'],
            ['42', 'AFCBDE'],
            [-42, 'EDAFBC'], 
            [1, 'BFEACD'], 
            [11111111, 'ACDBFE'],
        ].forEach(function(t){
            it('with a seed', function(){
                var result = documentEvaluate(`randomize(${SELECTOR},${t[0]})`, doc, helpers.xhtmlResolver, win.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                var nodes = [];
                var text = '';
                for ( var j = 0; j < result.snapshotLength; j++ ) {
                    text += result.snapshotItem( j ).textContent;
                }
                expect(text).to.equal(t[1]);
            });
        });

        [ 
            `randomize()`,
            `randomize(${SELECTOR}, 'a')`,
            `randomize(${SELECTOR}, 1, 2)`,
        ].forEach(function (t) {
            it(`with invalid args (${t}), throws an error`, function(){
                var test = function () {
                    documentEvaluate(t, doc, helpers.xhtmlResolver, win.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                };
                expect(test).to.throw(win.Error);
            });
        });

    });

    describe('decimal-date()', function(){
        [
            ['"1970-01-01T00:00:00.000Z"', 0.000],
            ['"1970-01-02T00:00:00.000Z"', 1.000],
            ['"2018-04-24T15:30:00.000+06:00"', 17645.396],
        ].forEach(function(t){
            it(`decimates dates ${t[0]} to ${t[1]}`, function(){
                var result = documentEvaluate(`decimal-date-time(${t[0]})`, doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
                expect(result.numberValue).to.deep.equal(t[1]);
            });
        });

        [
            '',
            '"1970-01-01T00:00:00.000Z", 2',
        ].forEach(function (t) {
            it(`with invalid args (${t}), throws an error`, function(){
                var test = function () {
                    documentEvaluate(`decimal-date-time(${t})`, doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
                };
                expect(test).to.throw(win.Error);
            });
        });
    });

    describe('decimal-time()', function(){
        [
            ['"06:00:00.000-07:00"', 0.250],
            ['"06:00:00.000-01:00"', 0.000],
            ['"06:30:00.000-07:00"', 0.271],
            ['"06:00:59.000-07:00"', 0.251],
            ['"23:59:00.000-07:00"', 0.999],
            ['"23:59:00.000-13:00"', 0.249],
            ['"a"', NaN],
            ['2', NaN],
            ['"24:00:00.000-07:00"', NaN],
            ['"06:00:00.000-24:00"', NaN],
            ['"06:60:00.000-07:00"', NaN],
            ['"06:00:60.000-07:00"', NaN],
            ['"23:59:00.000-07:60"', NaN],
            ['now()', NaN],
        ].forEach(function(t){
            it(`decimates time ${t[0]} to ${t[1]}`, function(){
                var result = documentEvaluate(`decimal-time(${t[0]})`, doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
                expect(result.numberValue).to.deep.equal(t[1]);
            });
        });

        [
            ['decimal-time("12:00:00.000-07:00") - decimal-time("06:00:00.000-07:00")', 0.250],
        ].forEach(function(t){
            it(`facilitates time calculations and evaluates ${t[0]} to ${t[1]}`, function(){
                var result = documentEvaluate(t[0], doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
                expect(result.numberValue).to.deep.equal(t[1]);
            });
        });

        [
            '',
            '"06:00:00.000-07:00", 2',
        ].forEach(function (t) {
            it(`with invalid args (${t}), throws an error`, function(){
                var test = function () {
                    documentEvaluate(`decimal-time(${t})`, doc, helpers.xhtmlResolver, win.XPathResult.NUMBER_TYPE, null);
                };
                expect(test).to.throw(win.Error);
            });
        });
    });

    /*
     This function is now supported by translating it into regular XPath before passing to this evaluator.
    it('indexed-repeat()', function() {
        [
            // targeting div child of #testXPathEvaluate
            ["indexed-repeat(xhtml:div/xhtml:div, xhtml:div, 2)", doc.getElementById('body'), 'some text'],
            // targeting 3rd p-element in #testFunctionNodeset3
            ["indexed-repeat(xhtml:div/xhtml:p, xhtml:div, 3)", doc.getElementById('testFunctionNodeset3'), '3'],
            // targeting 3rd p-element in #testFunctionNodeset3, in a more complex manner (triple-nested repeats)
            ["indexed-repeat(xhtml:div/xhtml:div/xhtml:div/xhtml:p, xhtml:div, 4, xhtml:div/xhtml:div, 2, xhtml:div/xhtml:div/xhtml:div, 3)", doc.getElementById('body'), '3']
        ].forEach(function(t) {
            var result = documentEvaluate(t[0], t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            expect(result.stringValue).to.equal(t[2]);
        });
    });
    */

    /*
    This function is now supported by translating it into regular XPath before passing to this evaluator.
    it('indexed-repeat() with invalid args', function() {
        [
            // targeting div child of #testXPathEvaluate
            ["indexed-repeat(xhtml:div/xhtml:div, xhtml:div, 2, xhtml:div)", doc.getElementById('body'), 'some text'],
        ].forEach(function(t) {
            result = documentEvaluate(t[0], t[1], helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null);
            Y.Assert.areSame(51, win.XPathException.INVALID_EXPRESSION_ERR);
        });
    });
    */

    /*
    it('sum() according to erratic javarosa implementation', function() {
        [
            ["sum_jr(self::*)", doc.getElementById('FunctionNumberCaseNumber'), 123],
            ["sum_jr(*)", doc.getElementById('FunctionNumberCaseNumberMultiple'), 100],
            ["sum_jr(*)", doc.getElementById('FunctionSumCaseJavarosa'), 5]
        ].forEach(function(t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.equal(t[2]);
        })

        [
            ["sum_jr(node())", doc.getElementById('FunctionNumberCaseNotNumberMultiple')]
        ].forEach(function(t) {
            var result = documentEvaluate(t[0], t[1], null, win.XPathResult.NUMBER_TYPE, null);
            expect(result.numberValue).to.be.a('number');
        });
    });
    */

    describe('custom XPath functions', function(){

        afterEach(function(){
            win.XPathJS.customXPathFunction.remove('comment-status');
        });

        it('can be added', function(){
            var obj = { status: 'good' };
            var node = doc.getElementById('FunctionCustom');
            node.textContent = JSON.stringify( obj );

            var test = function () {
                return documentEvaluate( 'comment-status(.)', node, helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null );
            };

            // Check the function doesn't exist before.
            expect( test ).to.throw(/does not exist/);

            // Add custom function
            win.XPathJS.customXPathFunction.add('comment-status', {
                fn: function(a){
                    var curValue = a.toString();
                    var status = '';

                    try {
                        status = JSON.parse(curValue).status;
                    }
                    catch(e){
                        console.error('Could not parse JSON from', curValue);
                    };
                    
                    return new win.XPathJS.customXPathFunction.type.StringType( status ); 
                },
                args: [
                    {t: 'string'}
                ],
                ret: 'string'
            });
        
            // Check functioning:
            var result = test();
            expect( result.stringValue ).to.equal( obj.status );

            // Check parameter errors:
            var test = function () {
                documentEvaluate( 'comment-status(., 2)', node, helpers.xhtmlResolver, win.XPathResult.STRING_TYPE, null );
            };
            expect( test ).to.throw( win.Error );

        });

    });

});
