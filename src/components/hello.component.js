"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_server_1 = require("@angular/platform-server");
const core_1 = require("@angular/core");
require("zone.js");
const platform_browser_1 = require("@angular/platform-browser");
const data_1 = require("./data");
const i0 = require("@angular/core");
const i1 = require("./data");
const i2 = require("@angular/platform-browser");
core_1.enableProdMode();
class HelloComponent {
    constructor(data) {
        this.data = data;
    }
}
exports.HelloComponent = HelloComponent;
HelloComponent.ɵfac = function HelloComponent_Factory(t) { return new (t || HelloComponent)(i0.ɵɵdirectiveInject(i1.Data)); };
HelloComponent.ɵcmp = i0.ɵɵdefineComponent({ type: HelloComponent, selectors: [["mc-hello"]], decls: 2, vars: 1, template: function HelloComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "h1");
        i0.ɵɵtext(1);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵtextInterpolate1("Hello ", ctx.data.title, "");
    } }, encapsulation: 2 });
/*@__PURE__*/ i0.ɵsetClassMetadata(HelloComponent, [{
        type: core_1.Component,
        args: [{
                selector: "mc-hello",
                template: `
    <h1>Hello {{ data.title }}</h1>
  `,
            }]
    }], function () { return [{ type: i1.Data }]; }, null);
class HelloModule {
}
exports.HelloModule = HelloModule;
HelloModule.ɵmod = i0.ɵɵdefineNgModule({ type: HelloModule, bootstrap: [HelloComponent] });
HelloModule.ɵinj = i0.ɵɵdefineInjector({ factory: function HelloModule_Factory(t) { return new (t || HelloModule)(); }, imports: [[
            platform_browser_1.BrowserModule.withServerTransition({ appId: "marmicode" }),
            platform_server_1.ServerModule,
        ]] });
/*@__PURE__*/ i0.ɵɵsetNgModuleScope(HelloModule, { imports: [i2.BrowserModule, platform_server_1.ServerModule] });
/*@__PURE__*/ i0.ɵsetClassMetadata(HelloModule, [{
        type: core_1.NgModule,
        args: [{
                imports: [
                    platform_browser_1.BrowserModule.withServerTransition({ appId: "marmicode" }),
                    platform_server_1.ServerModule,
                ],
                bootstrap: [HelloComponent]
            }]
    }], null, null);
//# sourceMappingURL=hello.component.js.map