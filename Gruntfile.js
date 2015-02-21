module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            game: {
                files: {
                    'dist/js/<%= pkg.name %>.game.min.js': ['src/game/js/*.js']
                }
            },
            generator: {
                files: {
                    'dist/js/<%= pkg.name %>.generator.min.js': ['src/generator/js/*.js']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/css/<%= pkg.name %>.generator.css': 'src/generator/css/*.css',
                    'dist/css/<%= pkg.name %>.game.css': 'src/game/css/*.css'
                }
            }
        },
        jshint: {
            all: ['src/game/js/*.js', 'src/generator/js/*.js']
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['src/game/*.html', 'src/generator/*.html'], dest: 'dist/', filter: 'isFile'}
                ],
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/(game.css|generator.css)/g, "motsmeles.$1");
                        //return content.replace(/(\.\.\/\.\.\/vendor\/fabric\.1\.4\.0\.min\.js)/g,"js/fabric.1.4.0.min.js");
                    }
                }
            },
            dev: {
                files: [
                    {expand: true, flatten: true, src: ['src/game/*.html', 'src/generator/*.html'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'src/game/css/', src: '*.css', dest: 'dist/css/', filter: 'isFile'},
                    {expand: true, cwd: 'src/generator/css/', src: '*.css', dest: 'dist/css/', filter: 'isFile'},
                ]
            },
            vendor: {
                files: [{expand: true, cwd: 'vendor/', src: '*.min.js', dest: 'dist/js/', filter: 'isFile'}]
            }
        },
        concat: {
            game: {
                src: ['src/game/js/*.js'],
                dest: 'dist/js/<%= pkg.name %>.game.min.js'
            },
            generator: {
                src: ['src/generator/js/*.js'],
                dest: 'dist/js/<%= pkg.name %>.generator.min.js'
            }
        },
        clean: {
            dist: ['dist'],
            force: true
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean:dist', 'jshint', 'uglify', 'cssmin', 'copy:main', 'copy:vendor']);
    grunt.registerTask('dev', ['clean:dist', 'jshint', 'concat', 'copy:dev', 'copy:vendor']);

};