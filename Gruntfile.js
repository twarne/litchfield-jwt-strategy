'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            files: ['lib/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        mochacli: {
            src: ['test/*.js'],
            options: {
                globals: ['chai'],
                timeout: 6000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');

    grunt.registerTask('test', ['jshint', 'mochacli']);

};
