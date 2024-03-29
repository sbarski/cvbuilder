module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
            options: {
                sourceMap: 'true',
                sourceMapFilename: 'src/cvbuilder.web/public/css/app.css.map',
                sourceMapRootpath: '../../_sources/',
                sourceMapBasepath: 'src/cvbuilder.client',
                sourceMapURL: '/public/css/app.css.map'
            },
            production: {
                cleancss: true,
                compress: true,
                files: {
                    'src/cvbuilder.web/public/css/app.css': 'src/cvbuilder.client/less/app.less'
                },
            },
            development: {
                files: {
                    'src/cvbuilder.web/public/css/app.css': 'src/cvbuilder.client/less/app.less'
                }
            }
        },
    copy: {
      development: {
        files: [
          {expand: true, cwd: 'src/cvbuilder.client/views/', src: ['**/*'], dest: 'src/cvbuilder.web/public/views/'}
        ]
      },
      production: {
        files: [
          {expand: true, cwd: 'src/cvbuilder.client/views/', src: ['**/*'], dest: 'src/cvbuilder.web/public/views/'}
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
       development: {
                options: {
                    beautify: true,
                    preserveComments: true,
                    drop_debugger: false,
                    dead_code: true
                },
                files: {
                    'src/cvbuilder.web/public/js/app.js': [
                        'src/cvbuilder.client/js/routes.js',
                        'src/cvbuilder.client/js/config.js',
                        'src/cvbuilder.client/js/controllers/*.js',
                        'src/cvbuilder.client/js/interceptors/*.js',
                        'src/cvbuilder.client/js/filters/*.js',
                        'src/cvbuilder.client/js/directives/*.js',
                        'src/cvbuilder.client/js/services/*.js',
                        'src/cvbuilder.client/js/vendor/*.js',
                        'src/cvbuilder.client/js/routes.js',
                        'src/cvbuilder.client/js/app.js'
                    ]
                }
            },
            production: {
                options: {
                    beautify: false
                },
                files: {
                    'src/cvbuilder.web/public/js/app.js': [
                        'src/cvbuilder.client/js/routes.js',
                        'src/cvbuilder.client/js/config.js',
                        'src/cvbuilder.client/js/controllers/*.js',
                        'src/cvbuilder.client/js/interceptors/*.js',
                        'src/cvbuilder.client/js/filters/*.js',
                        'src/cvbuilder.client/js/directives/*.js',
                        'src/cvbuilder.client/js/services/*.js',
                        'src/cvbuilder.client/js/vendor/*.js',
                        'src/cvbuilder.client/js/routes.js',
                        'src/cvbuilder.client/js/app.js'
                    ]
                }
            }
    },
    watch: {
            scripts: {
                tasks: ['copy:development', 'less:development', 'uglify:development'],
                files: ['src/cvbuilder.client/**/*'],
                options: {
                  livereload: true
                }
            }
        }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', [ 'copy:development', 'less:development', 'uglify:development']);

  grunt.registerTask('development', [ 'copy:development', 'less:development', 'uglify:development']);
  grunt.registerTask('production', [ 'copy:production', 'less:production', 'uglify:production']);

};