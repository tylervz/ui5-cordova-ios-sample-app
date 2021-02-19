module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: 'www',
            prefix: '',
            src: [
              'main/**/*.js',
              'main/**/*.fragment.html',
              'main/**/*.fragment.json',
              'main/**/*.fragment.xml',
              'main/**/*.view.html',
              'main/**/*.view.json',
              'main/**/*.view.xml',
              'main/**/*.properties'
            ]
          },
          dest: 'www',
          compress: true
        },
        components: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-openui5');

}
