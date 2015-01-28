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
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/', src: '*.html', dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'vendor/', src: '*.min.js', dest: 'dist/js/', filter: 'isFile'}
                ]
            },
            dev: {
                files: [
                    {expand: true, cwd: 'src/', src: '*.html', dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'vendor/', src: '*.min.js', dest: 'dist/js/', filter: 'isFile'},
                    {expand: true, cwd: 'src/js/', src: '*.js', dest: 'dist/js/', filter: 'isFile'},
                    {expand: true, cwd: 'src/css/', src: '*.js', dest: 'dist/js/', filter: 'isFile'}
                ]
            }
        },
        concat: {
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        clean: {
            dist: ['dist/js','dist/css','index.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean:dist', 'jshint', 'uglify', 'cssmin', 'copy:main']);
    grunt.registerTask('dev', ['clean:dist', 'jshint', 'concat', 'copy:dev']);

};