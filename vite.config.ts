import { defineConfig } from 'vite';
import { ViteAngularPlugin } from '@nxext/angular/plugins/vite-plugin-angular';
import Pages, { PageContext, SupportedPagesResolver } from "vite-plugin-pages";
PageContext.prototype.resolveRoutes = async() => {
  // @ts-ignore
  
  return `
    import { Routes } from '@angular/router';
    // import { Component, NgModule } from '@angular/core';

    // @Component({
    //  selector: 'app-home',
    //  template: '<h1>Home</h1>'
    // })
    // export class HomePageComponent {}

  import { HomePageComponent } from '/pages/home';

  export const routes = [
    { path: '', component: HomePageComponent },
  ];
  `;
}
export function myPlugin() {
  const virtualModuleId = '@my-virtual-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        console.log(virtualModuleId)
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const routes = [];`
      }
    }
  }
}

export default defineConfig({
  root: './src',
  plugins: [
    Pages({
      resolver: 'angular' as SupportedPagesResolver,
      pagesDir: ['pages'],
      extensions: ['ts'],
      importMode: 'async',
      onRoutesGenerated(routes) {
        console.log('routes', JSON.stringify(routes));
        return [];
      },
      onClientGenerated(code) {
        console.log('client', code);
        return `
          /*${code}*/
          export const routes = [];
        `;
      }
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