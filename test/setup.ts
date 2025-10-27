import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});

globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;

Object.assign(globalThis, {
    HTMLElement: dom.window.HTMLElement,
    CustomEvent: dom.window.CustomEvent,
});

globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
