const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .setPublicPath('public')
    .webpackConfig({
        resolve: {
            fallback: {
                path: require.resolve('path-browserify'),
            }
        }
    })
    .js('resources/js/app.js', 'public/StaffDirectory.js').react()
    .js('resources/js/view.js', 'public/StaffDirectory_View.js').react()
    /**
     * Uncomment these lines during development to copy your updated JS
     * file automatically (you must have installed and activated your app)
     * 
     * Update the relative path to your WebApps Directory
     */
    .copy('public/StaffDirectory.js', '../../../WebApps/public/js/apps/StaffDirectory.js')
    .copy('public/StaffDirectory_View.js', '../../../WebApps/public/js/apps/StaffDirectory_View.js')
