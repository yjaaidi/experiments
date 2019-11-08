/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
require('zone.js');
const path = require('path')
const { renderScam } = require('./src/components/render-scam');
const { HelloModule } = require('./src/components/hello.component');

exports.createPages = async ({actions}) => {

  const { createPage } = actions;

  const titles = ['A', 'B'];

  titles.forEach(async title => {
    const html = await renderScam(HelloModule, {title});

    createPage({
      // Path for this page — required
      path: `/${title.toLowerCase()}`,
      component: path.resolve(`src/components/html.js`),
      context: {
        html, 
      }
    })
     
  });

 
}