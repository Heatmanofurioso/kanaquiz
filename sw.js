if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let t={};const o=e=>i(e,l),c={module:{uri:l},exports:t,require:o};s[l]=Promise.all(n.map((e=>c[e]||o(e)))).then((e=>(r(...e),t)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BKn-umh6.css",revision:null},{url:"assets/index-DVmswFWX.js",revision:null},{url:"assets/index-legacy-CT6v4Jiv.js",revision:null},{url:"assets/polyfills-legacy-DYdpjzK8.js",revision:null},{url:"index.html",revision:"a60ca2508830cc51083ea1838b59ff78"},{url:"registerSW.js",revision:"932b2fa3b30d8bdb26848e1a67093ec0"},{url:"manifest.webmanifest",revision:"41f3ccd60bae2d5dc3a1e8cc89d41f4d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
