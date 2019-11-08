"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const platform_server_1 = require("@angular/platform-server");
const data_1 = require("./data");
function renderScam(scam, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const selector = scam['ɵmod'].bootstrap[0]['ɵcmp'].selectors[0][0];
        const result = yield platform_server_1.renderModule(scam, {
            document: `<${selector}>`,
            extraProviders: [
                {
                    provide: data_1.Data,
                    useValue: data,
                },
            ]
        });
        return result.replace(/<\/?(body|head|html)>/g, '');
    });
}
exports.renderScam = renderScam;
//# sourceMappingURL=render-scam.js.map