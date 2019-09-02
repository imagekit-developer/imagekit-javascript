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
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
  
    // Default task(s).
    grunt.registerTask('default', ['browserify:dist']);
  
  };

