/*jshint node:true*/
'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        clean: {
            dist: {
                src: [
                    'dist'
                ]
            }
        },

        peg: {
            dist: {
                options: {
                    exportVar: 'XPathJS._parser'
                },
                src: 'src/parser.pegjs',
                dest: 'dist/parser.js'
            }
        },

        concat: {
            dist: {
                src: [
                    'src/date-extensions.js',
                    'src/shuffle.js',
                    'src/engine.js',
                    'dist/parser.js',
                    'src/umd.js'
                ],
                dest: 'dist/enketo-xpathjs.js'
            }
        },

        uglify: {
            dist: {
                src: 'dist/enketo-xpathjs.js',
                dest: 'dist/enketo-xpathjs.min.js'
            }
        },

        karma: {
            options: {
                singleRun: true,
                reporters: ['dots'],
                configFile: 'test/karma.conf.js',
                customLaunchers: {
                    ChromeHeadlessNoSandbox: {
                        base: 'ChromeHeadless',
                        flags: [ '--no-sandbox' ]
                    }
                },
            },
            headless: {
                browsers: ['ChromeHeadlessNoSandbox']
            },
            browsers: {
                browsers: ['Chrome' , 'Firefox', 'Safari', 'Opera' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dist', [
        'clean:dist',
        'peg:dist',
        'concat:dist',
        'uglify:dist'
    ]);

    grunt.registerTask('test-dev', ['dist', 'karma:headless']);
    grunt.registerTask('test-browsers-dev', ['dist', 'karma:browsers']);
};
