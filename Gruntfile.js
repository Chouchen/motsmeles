module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/*.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/css/<%= pkg.name %>.css': 'src/css/*.css'
                }
            }
        },
        jshint: {
            all: ['src/js/*.js']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify','cssmin' ]);

};