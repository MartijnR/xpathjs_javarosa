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

        copy: {
          openrosa: {
            cwd: '.',
            src: 'node_modules/openrosa-xpath-evaluator/dist/orxe.min.js',
            dest: 'dist/orxe.min.js'
          }
        },

        peg: {
            dist: {
                src: 'src/parser.pegjs',
                dest: 'dist/parser.js'
            }
        },

        browserify: {
            dist: {
                files: {
                    'dist/enketo-xpathjs-bundle.js': [ 'src/XPathJS.js' ]
                },
            },
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('dist', [
        'clean:dist',
        'copy:openrosa'
    ]);

    grunt.registerTask('test-dev', ['dist', 'karma:headless']);
    grunt.registerTask('test-browsers-dev', ['dist', 'karma:browsers']);
};
