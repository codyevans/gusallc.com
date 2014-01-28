module.exports = function(grunt) {

    // configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'js/libs/*.js', // All js in the libs folder
                    'js/global.js'  // Authored js file
                ],
                dest: 'js/build/production.js',
            }
        },

        uglify: {
            build: {
                src: 'js/build/production.js',
                dest: 'js/build/production.min.js'
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/build/global.css': 'css/global.scss'
                }
            } 
        },

        // watch js/css files + livereload css
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['css/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            } 
        }

    });  // end config


    grunt.loadNpmTasks('grunt-contrib-concat'); // load concat
    grunt.loadNpmTasks('grunt-contrib-uglify'); // load uglify
    grunt.loadNpmTasks('grunt-contrib-sass'); // load sass
    grunt.loadNpmTasks('grunt-contrib-watch'); // load watch

    grunt.registerTask('default', ['concat', 'uglify', 'sass']); // tell grunt what to do
    grunt.registerTask('dev', ['watch']); // let grunt watch files

};