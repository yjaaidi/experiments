import { renderModule } from '@angular/platform-server';
import { Data } from './data';

export async function renderScam(scam, data) {

  const selector = scam['ɵmod'].bootstrap[0]['ɵcmp'].selectors[0][0];

  const result = await renderModule(scam, {  
    document: `<${selector}>`,
    extraProviders: [
      {
        provide: Data,
        useValue: data,
      },
    ]
  })

  return result.replace(/<\/?(body|head|html)>/g, '');
  
}
