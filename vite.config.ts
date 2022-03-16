import { defineConfig } from 'vite';
import { ViteAngularPlugin } from '@nxext/angular/plugins/vite-plugin-angular';
import Pages, { PageContext, SupportedPagesResolver } from "./vite-plugin-pages/src";
// PageContext.prototype.resolveRoutes = async() => {
//   // @ts-ignore
  
//   return `
//     import { Routes } from '@angular/router';
//     // import { Component, NgModule } from '@angular/core';

//     // @Component({
//     //  selector: 'app-home',
//     //  template: '<h1>Home</h1>'
//     // })
//     // export class HomePageComponent {}

//   import { HomePageComponent } from '/pages/home';

//   export const routes = [
//     { path: '', component: HomePageComponent },
//   ];
//   `;
// }

export default defineConfig({
  root: './src',
  plugins: [
    Pages({
      resolver: 'angular',
      pagesDir: ['pages'],
      extensions: ['ts'],
      importMode: function(path: string) {
        return path.includes('module') ? 'sync' : 'sync';
      },
      // onRoutesGenerated(routes) {
      //   console.log('routes', JSON.stringify(routes));
      // },
      // onClientGenerated(code) {
      //   console.log('client', code);
      //   return `
      //     /*${code}*/
      //     export const routes = [];
      //   `;
      // }
    }
    ),
    // myPlugin(),
    ViteAngularPlugin({
      target: 'es2020',
    }),
  ],
  resolve: {
    preserveSymlinks: true,
  },
});