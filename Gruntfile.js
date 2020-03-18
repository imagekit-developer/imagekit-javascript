module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      browserify: {
        dist : {
            files : {
                'dist/imagekit.js' : ['index.js']
            },
            options : {
                browserifyOptions : {
                    "standalone" : "ImageKit"
                }
            }
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        my_target: {
          files: {
            'dist/imagekit-min.js': ['dist/imagekit.js']
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-browserify');
  
    // Default task(s).
    grunt.registerTask('default', ['browserify:dist','uglify']);
  
  };

