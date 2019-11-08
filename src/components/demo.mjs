import { renderModuleFactory } from "@angular/platform-server";
import { Component, NgModule } from "@angular/core";
import * as i0 from "@angular/core";
export class HelloComponent {
}
HelloComponent.ɵfac = function HelloComponent_Factory(t) { return new (t || HelloComponent)(); };
HelloComponent.ɵcmp = i0.ɵɵdefineComponent({ type: HelloComponent, selectors: [["mc-hello"]], decls: 2, vars: 0, template: function HelloComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "h1");
        i0.ɵɵtext(1, "Hello test");
        i0.ɵɵelementEnd();
    } }, encapsulation: 2 });
/*@__PURE__*/ i0.ɵsetClassMetadata(HelloComponent, [{
        type: Component,
        args: [{
                selector: "mc-hello",
                template: `
    <h1>Hello test</h1>
  `,
            }]
    }], null, null);
export class HelloModule {
}
HelloModule.ɵmod = i0.ɵɵdefineNgModule({ type: HelloModule, bootstrap: [HelloComponent] });
HelloModule.ɵinj = i0.ɵɵdefineInjector({ factory: function HelloModule_Factory(t) { return new (t || HelloModule)(); } });
/*@__PURE__*/ i0.ɵɵsetNgModuleScope(HelloModule, { declarations: [HelloComponent], exports: [HelloComponent] });
/*@__PURE__*/ i0.ɵsetClassMetadata(HelloModule, [{
        type: NgModule,
        args: [{
                declarations: [HelloComponent],
                exports: [HelloComponent],
                bootstrap: [HelloComponent],
            }]
    }], null, null);
renderModuleFactory(HelloModule["ngModuleDef"], {
    document: `<mc-hello></mc-hello>`,
    url: "/",
});
//# sourceMappingURL=demo.js.map