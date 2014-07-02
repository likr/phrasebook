module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'static/jphrasebook.js': 'coffee/jphrasebook.coffee'
    watch:
      scripts:
        files: ['coffee/**/*.coffee']
        tasks: ['compile']

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    grunt.registerTask 'compile', ['coffee']
    grunt.registerTask 'default', ['watch:scripts']
