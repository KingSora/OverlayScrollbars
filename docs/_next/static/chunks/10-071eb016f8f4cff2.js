"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[10],{5010:function(t,e,r){let n;r.d(e,{E:function(){return rk},A:function(){return rC}});var l=r(2265);/*!
 * OverlayScrollbars
 * Version: 2.8.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */let o=(t,e)=>{let r;let{o:n,i:l,u:o}=t,i=n,a=(t,e)=>{let n=i,a=e||(l?!l(n,t):n!==t);return(a||o)&&(i=t,r=n),[i,a,r]};return[e?t=>a(e(i,r),t):a,t=>[i,!!t,r]]},i="undefined"!=typeof document,a=i?window:{},c=Math.max,s=Math.min,u=Math.round,d=Math.abs,p=Math.sign,f=a.cancelAnimationFrame,y=a.requestAnimationFrame,h=a.setTimeout,v=a.clearTimeout,b=t=>void 0!==a[t]?a[t]:void 0,m=b("MutationObserver"),g=b("IntersectionObserver"),w=b("ResizeObserver"),x=b("ScrollTimeline"),S=i&&Node.ELEMENT_NODE,{toString:O,hasOwnProperty:E}=Object.prototype,C=/^\[object (.+)\]$/,k=t=>void 0===t,R=t=>null===t,A=t=>k(t)||R(t)?"".concat(t):O.call(t).replace(C,"$1").toLowerCase(),M=t=>"number"==typeof t,T=t=>"string"==typeof t,_=t=>"boolean"==typeof t,H=t=>"function"==typeof t,I=t=>Array.isArray(t),L=t=>"object"==typeof t&&!I(t)&&!R(t),D=t=>{let e=!!t&&t.length,r=M(e)&&e>-1&&e%1==0;return(!!I(t)||!H(t)&&!!r)&&(!(e>0&&L(t))||e-1 in t)},z=t=>{let e;if(!t||!L(t)||"object"!==A(t))return!1;let r="constructor",n=t[r],l=n&&n.prototype,o=E.call(t,r),i=l&&E.call(l,"isPrototypeOf");if(n&&!o&&!i)return!1;for(e in t);return k(e)||E.call(t,e)},P=t=>{let e=HTMLElement;return!!t&&(e?t instanceof e:t.nodeType===S)},N=t=>{let e=Element;return!!t&&(e?t instanceof e:t.nodeType===S)};function F(t,e){if(D(t))for(let r=0;r<t.length&&!1!==e(t[r],r,t);r++);else t&&F(Object.keys(t),r=>e(t[r],r,t));return t}let K=(t,e)=>t.indexOf(e)>=0,V=(t,e)=>t.concat(e),j=(t,e,r)=>(!r&&!T(e)&&D(e)?Array.prototype.push.apply(t,e):t.push(e),t),B=t=>Array.from(t||[]),q=t=>I(t)?t:[t],X=t=>!!t&&!t.length,Y=t=>B(new Set(t)),W=(t,e,r)=>{F(t,t=>t&&t.apply(void 0,e||[])),r||(t.length=0)},$="paddingTop",J="paddingRight",U="paddingLeft",G="paddingBottom",Z="marginLeft",Q="marginRight",tt="marginBottom",te="width",tr="height",tn="visible",tl="hidden",to="scroll",ti=t=>{let e=String(t||"");return e?e[0].toUpperCase()+e.slice(1):""},ta=(t,e,r,n)=>{if(t&&e){let l=!0;return F(r,r=>{(n?n(t[r]):t[r])!==(n?n(e[r]):e[r])&&(l=!1)}),l}return!1},tc=(t,e)=>ta(t,e,["w","h"]),ts=(t,e)=>ta(t,e,["x","y"]),tu=(t,e)=>ta(t,e,["t","r","b","l"]),td=()=>{},tp=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),n=1;n<e;n++)r[n-1]=arguments[n];return t.bind(0,...r)},tf=t=>{let e;let r=t?h:y,n=t?v:f;return[l=>{n(e),e=r(l,H(t)?t():t)},()=>n(e)]},ty=(t,e)=>{let r,n,l;let o=td,{_:i,p:a,v:c}=e||{},s=function(e){o(),v(r),r=n=void 0,o=td,t.apply(this,e)},u=t=>c&&n?c(n,t):t,d=()=>{o!==td&&s(u(l)||l)},p=function(){let t=B(arguments),e=H(i)?i():i;if(M(e)&&e>=0){let i=H(a)?a():a,c=M(i)&&i>=0,p=e>0?h:y,b=e>0?v:f,m=u(t)||t,g=s.bind(0,m);o();let w=p(g,e);o=()=>b(w),c&&!r&&(r=h(d,i)),n=l=m}else s(t)};return p.S=d,p},th=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),tv=t=>t?Object.keys(t):[],tb=(t,e,r,n,l,o,i)=>(("object"!=typeof t||R(t))&&!H(t)&&(t={}),F([e,r,n,l,o,i],e=>{F(e,(r,n)=>{let l=e[n];if(t===l)return!0;let o=I(l);if(l&&z(l)){let e=t[n],r=e;o&&!I(e)?r=[]:o||z(e)||(r={}),t[n]=tb(r,l)}else t[n]=o?l.slice():l})}),t),tm=(t,e)=>F(tb({},t),(t,r,n)=>{void 0===t?delete n[r]:e&&t&&z(t)&&(n[r]=tm(t,e))}),tg=t=>{for(let e in t)return!1;return!0},tw=(t,e,r)=>c(t,s(e,r)),tx=t=>B(new Set((I(t)?t:(t||"").split(" ")).filter(t=>t))),tS=(t,e)=>t&&t.getAttribute(e),tO=(t,e)=>t&&t.hasAttribute(e),tE=(t,e,r)=>{F(tx(e),e=>{t&&t.setAttribute(e,String(r||""))})},tC=(t,e)=>{F(tx(e),e=>t&&t.removeAttribute(e))},tk=(t,e)=>{let r=tx(tS(t,e)),n=tp(tE,t,e),l=(t,e)=>{let n=new Set(r);return F(tx(t),t=>{n[e](t)}),B(n).join(" ")};return{m:t=>n(l(t,"delete")),O:t=>n(l(t,"add")),$:t=>{let e=tx(t);return e.reduce((t,e)=>t&&r.includes(e),e.length>0)}}},tR=(t,e,r)=>(tk(t,e).m(r),tp(tA,t,e,r)),tA=(t,e,r)=>(tk(t,e).O(r),tp(tR,t,e,r)),tM=(t,e,r,n)=>(n?tA:tR)(t,e,r),tT=(t,e,r)=>tk(t,e).$(r),t_=t=>tk(t,"class"),tH=(t,e)=>{t_(t).m(e)},tI=(t,e)=>(t_(t).O(e),tp(tH,t,e)),tL=(t,e)=>{let r=[],n=e?N(e)&&e:document;return n?j(r,n.querySelectorAll(t)):r},tD=(t,e)=>{let r=e?N(e)&&e:document;return r?r.querySelector(t):null},tz=(t,e)=>!!N(t)&&t.matches(e),tP=t=>tz(t,"body"),tN=t=>t?B(t.childNodes):[],tF=t=>t&&t.parentElement,tK=(t,e)=>N(t)&&t.closest(e),tV=t=>(t||document).activeElement,tj=(t,e,r)=>{let n=tK(t,e),l=t&&tD(r,n),o=tK(l,e)===n;return!!n&&!!l&&(n===t||l===t||o&&tK(tK(t,r),e)!==n)},tB=t=>{if(D(t))F(B(t),t=>tB(t));else if(t){let e=tF(t);e&&e.removeChild(t)}},tq=(t,e,r)=>{if(r&&t){let n,l=e;return D(r)?(n=document.createDocumentFragment(),F(r,t=>{t===l&&(l=t.previousSibling),n.appendChild(t)})):n=r,e&&(l?l!==e&&(l=l.nextSibling):l=t.firstChild),t.insertBefore(n,l||null),()=>tB(r)}return td},tX=(t,e)=>tq(t,null,e),tY=(t,e)=>tq(tF(t),t&&t.nextSibling,e),tW=t=>{let e=document.createElement("div");return tE(e,"class",t),e},t$=t=>{let e=tW();return e.innerHTML=t.trim(),F(tN(e),t=>tB(t))},tJ=/^--/,tU=(t,e)=>t.getPropertyValue(e)||t[e]||"",tG=t=>{let e=t||0;return isFinite(e)?e:0},tZ=t=>tG(parseFloat(t||"")),tQ=t=>"".concat((100*tG(t)).toFixed(3),"%"),t0=t=>"".concat(tG(t),"px");function t1(t,e){t&&e&&F(e,(e,r)=>{try{let n=t.style,l=M(e)?t0(e):(e||"")+"";tJ.test(r)?n.setProperty(r,l):n[r]=l}catch(t){}})}function t3(t,e,r){let n=T(e),l=n?"":{};if(t){let o=a.getComputedStyle(t,r)||t.style;l=n?tU(o,e):B(e).reduce((t,e)=>(t[e]=tU(o,e),t),l)}return l}let t2=(t,e,r)=>{let n=e?"".concat(e,"-"):"",l=r?"-".concat(r):"",o="".concat(n,"top").concat(l),i="".concat(n,"right").concat(l),a="".concat(n,"bottom").concat(l),c="".concat(n,"left").concat(l),s=t3(t,[o,i,a,c]);return{t:tZ(s[o]),r:tZ(s[i]),b:tZ(s[a]),l:tZ(s[c])}},t5=(t,e)=>"translate".concat(L(t)?"(".concat(t.x,",").concat(t.y,")"):"".concat(e?"X":"Y","(").concat(t,")")),t4=t=>!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length),t9={w:0,h:0},t6=(t,e)=>e?{w:e["".concat(t,"Width")],h:e["".concat(t,"Height")]}:t9,t7=t=>t6("inner",t||a),t8=tp(t6,"offset"),et=tp(t6,"client"),ee=tp(t6,"scroll"),er=t=>{let e=parseFloat(t3(t,te))||0,r=parseFloat(t3(t,tr))||0;return{w:e-u(e),h:r-u(r)}},en=t=>t.getBoundingClientRect(),el=t=>!!t&&t4(t),eo=t=>!!(t&&(t[tr]||t[te])),ei=(t,e)=>{let r=eo(t);return!eo(e)&&r},ea=(t,e,r,n)=>{F(tx(e),e=>{t&&t.removeEventListener(e,r,n)})},ec=(t,e,r,n)=>{var l;let o=null==(l=n&&n.C)||l,i=n&&n.H||!1,a=n&&n.A||!1,c={passive:o,capture:i};return tp(W,tx(e).map(e=>{let n=a?l=>{ea(t,e,n,i),r&&r(l)}:r;return t&&t.addEventListener(e,n,c),tp(ea,t,e,n,i)}))},es=t=>t.stopPropagation(),eu=t=>t.preventDefault(),ed=t=>es(t)||eu(t),ep=(t,e)=>{let{x:r,y:n}=M(e)?{x:e,y:e}:e||{};M(r)&&(t.scrollLeft=r),M(n)&&(t.scrollTop=n)},ef=t=>({x:t.scrollLeft,y:t.scrollTop}),ey=()=>({I:{x:0,y:0},T:{x:0,y:0}}),eh=(t,e)=>{let{I:r,T:n}=t,{w:l,h:o}=e,i=(t,e,r)=>{let n=p(t)*r,l=p(e)*r;if(n===l){let r=d(t),o=d(e);l=r>o?0:l,n=r<o?0:n}return[n+0,l+0]},[a,c]=i(r.x,n.x,l),[s,u]=i(r.y,n.y,o);return{I:{x:a,y:s},T:{x:c,y:u}}},ev=t=>{var e,r,n,l;let{I:o,T:i}=t;return{x:(e=o.x,r=i.x,0===e&&e<=r),y:(n=o.y,l=i.y,0===n&&n<=l)}},eb=(t,e)=>{let{I:r,T:n}=t,l=(t,e,r)=>tw(0,1,(t-r)/(t-e)||0);return{x:l(r.x,n.x,e.x),y:l(r.y,n.y,e.y)}},em=(t,e)=>{F(q(e),t)},eg=t=>{let e=new Map,r=(t,r)=>{if(t){let n=e.get(t);em(t=>{n&&n[t?"delete":"clear"](t)},r)}else e.forEach(t=>{t.clear()}),e.clear()},n=(t,l)=>{if(T(t)){let n=e.get(t)||new Set;return e.set(t,n),em(t=>{H(t)&&n.add(t)},l),tp(r,t,l)}_(l)&&l&&r();let o=tv(t),i=[];return F(o,e=>{let r=t[e];r&&j(i,n(e,r))}),tp(W,i)};return n(t||{}),[n,r,(t,r)=>{F(B(e.get(t)),t=>{r&&!X(r)?t.apply(0,r):t()})}]},ew=t=>JSON.stringify(t,(t,e)=>{if(H(e))throw 0;return e}),ex=(t,e)=>t?"".concat(e).split(".").reduce((t,e)=>t&&th(t,e)?t[e]:void 0,t):void 0,eS={paddingAbsolute:!1,showNativeOverlaidScrollbars:!1,update:{elementEvents:[["img","load"]],debounce:[0,33],attributes:null,ignoreMutation:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:!1,dragScroll:!0,clickScroll:!1,pointers:["mouse","touch","pen"]}},eO=(t,e)=>{let r={};return F(V(tv(e),tv(t)),n=>{let l=t[n],o=e[n];if(L(l)&&L(o))tb(r[n]={},eO(l,o)),tg(r[n])&&delete r[n];else if(th(e,n)&&o!==l){let t=!0;if(I(l)||I(o))try{ew(l)===ew(o)&&(t=!1)}catch(t){}t&&(r[n]=o)}}),r},eE=(t,e,r)=>n=>[ex(t,n),r||void 0!==ex(e,n)],eC="data-overlayscrollbars",ek="os-environment",eR="".concat(ek,"-scrollbar-hidden"),eA="".concat(eC,"-initialize"),eM="noClipping",eT="".concat(eC,"-body"),e_="".concat(eC,"-viewport"),eH="measuring",eI="scrollbarHidden",eL="".concat(eC,"-padding"),eD="".concat(eC,"-content"),ez="os-size-observer",eP="".concat(ez,"-appear"),eN="".concat(ez,"-listener"),eF="os-scrollbar",eK="".concat(eF,"-rtl"),eV="".concat(eF,"-horizontal"),ej="".concat(eF,"-vertical"),eB="".concat(eF,"-track"),eq="".concat(eF,"-handle"),eX="".concat(eF,"-visible"),eY="".concat(eF,"-cornerless"),eW="".concat(eF,"-interaction"),e$="".concat(eF,"-unusable"),eJ="".concat(eF,"-auto-hide"),eU="".concat(eJ,"-hidden"),eG="".concat(eF,"-wheel"),eZ="".concat(eB,"-interactive"),eQ="".concat(eq,"-interactive"),e0=()=>{let t=(t,e,r)=>{tX(document.body,t),tX(document.body,t);let n=et(t),l=t8(t),o=er(e);return r&&tB(t),{x:l.h-n.h+o.h,y:l.w-n.w+o.w}},e=".".concat(ek,"{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.").concat(ek," div{width:200%;height:200%;margin:10px 0}.").concat(eR,"{scrollbar-width:none!important}.").concat(eR,"::-webkit-scrollbar,.").concat(eR,"::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}"),r=t$('<div class="'.concat(ek,'"><div></div><style>').concat(e,"</style></div>"))[0],n=r.firstChild,[l,,i]=eg(),[c,s]=o({o:t(r,n),i:ts},tp(t,r,n,!0)),[u]=s(),d=(t=>{let e=!1,r=tI(t,eR);try{e="none"===t3(t,"scrollbar-width")||"none"===t3(t,"display","::-webkit-scrollbar")}catch(t){}return r(),e})(r),p={x:0===u.x,y:0===u.y},f={elements:{host:null,padding:!d,viewport:t=>d&&tP(t)&&t,content:!1},scrollbars:{slot:!0},cancel:{nativeScrollbarsOverlaid:!1,body:null}},y=tb({},eS),h=tp(tb,{},y),v=tp(tb,{},f),b={D:u,k:p,R:d,M:!!x,V:tp(l,"r"),L:v,P:t=>tb(f,t)&&v(),U:h,N:t=>tb(y,t)&&h(),j:tb({},f),q:tb({},y)};if(tC(r,"style"),tB(r),ec(a,"resize",()=>{i("r",[])}),H(a.matchMedia)&&!d&&(!p.x||!p.y)){let t=e=>{ec(a.matchMedia("(resolution: ".concat(a.devicePixelRatio,"dppx)")),"change",()=>{e(),t(e)},{A:!0})};t(()=>{let[t,e]=c();tb(b.D,t),i("r",[e])})}return b},e1=()=>(n||(n=e0()),n),e3=(t,e)=>H(e)?e.apply(0,t):e,e2=(t,e,r,n)=>e3(t,k(n)?r:n)||e.apply(0,t),e5=(t,e,r,n)=>{let l=e3(t,k(n)?r:n);return!!l&&(P(l)?l:e.apply(0,t))},e4=(t,e)=>{let{nativeScrollbarsOverlaid:r,body:n}=e||{},{k:l,R:o,L:i}=e1(),{nativeScrollbarsOverlaid:a,body:c}=i().cancel,s=k(n)?c:n,u=(l.x||l.y)&&(null!=r?r:a),d=t&&(R(s)?!o:s);return!!u||!!d},e9=new WeakMap,e6=(t,e)=>{e9.set(t,e)},e7=t=>{e9.delete(t)},e8=t=>e9.get(t),rt=(t,e,r)=>{let n=!1,l=!!r&&new WeakMap,o=o=>{l&&r&&F(r.map(e=>{let[r,n]=e||[];return[n&&r?(o||tL)(r,t):[],n]}),r=>F(r[0],o=>{let i=r[1],a=l.get(o)||[];if(t.contains(o)&&i){let t=ec(o,i,r=>{n?(t(),l.delete(o)):e(r)});l.set(o,j(a,t))}else W(a),l.delete(o)}))};return o(),[()=>{n=!0},o]},re=(t,e,r,n)=>{let l=!1,{F:o,B:i,X:a,Y:c,W:s,J:u}=n||{},d=ty(()=>l&&r(!0),{_:33,p:99}),[p,f]=rt(t,d,a),y=i||[],h=V(o||[],y),v=(l,o)=>{if(!X(o)){let i=s||td,a=u||td,d=[],p=[],h=!1,v=!1;if(F(o,r=>{let{attributeName:l,target:o,type:s,oldValue:u,addedNodes:f,removedNodes:b}=r,m="attributes"===s,g=t===o,w=m&&l,x=w&&tS(o,l||"")||null,S=w&&u!==x,O=K(y,l)&&S;if(e&&("childList"===s||!g)){let e=m&&S,s=e&&c&&tz(o,c),p=(s?!i(o,l,u,x):!m||e)&&!a(r,!!s,t,n);F(f,t=>j(d,t)),F(b,t=>j(d,t)),v=v||p}!e&&g&&S&&!i(o,l,u,x)&&(j(p,l),h=h||O)}),f(t=>Y(d).reduce((e,r)=>(j(e,tL(t,r)),tz(r,t)?j(e,r):e),[])),e)return!l&&v&&r(!1),[!1];if(!X(p)||h){let t=[Y(p),h];return l||r.apply(0,t),t}}},b=new m(tp(v,!1));return[()=>(b.observe(t,{attributes:!0,attributeOldValue:!0,attributeFilter:h,subtree:e,childList:e,characterData:e}),l=!0,()=>{l&&(p(),b.disconnect(),l=!1)}),()=>{if(l)return d.S(),v(!0,b.takeRecords())}]},rr={},rn={},rl=t=>{F(t,t=>F(t,(e,r)=>{rr[r]=t[r]}))},ro=(t,e,r)=>tv(t).map(n=>{let{static:l,instance:o}=t[n],[i,a,c]=r||[],s=r?o:l;if(s){let t=r?s(i,a,e):s(e);return(c||rn)[n]=t}}),ri=t=>rn[t],ra=(t,e)=>{let{k:r}=e,[n,l]=t("showNativeOverlaidScrollbars");return[n&&r.x&&r.y,l]},rc=t=>0===t.indexOf(tn),rs=(t,e)=>{let r=(t,e,r,n)=>{let l=t===tn?tl:t.replace("".concat(tn,"-"),""),o=rc(t),i=rc(r);if(!e&&!n)return tl;if(o&&i)return tn;if(o){let t=e?tn:tl;return e&&n?l:t}let a=i&&n?tn:tl;return e?l:a},n={x:r(e.x,t.x,e.y,t.y),y:r(e.y,t.y,e.x,t.x)};return{K:n,G:{x:n.x===to,y:n.y===to}}},ru="__osScrollbarsHidingPlugin",rd=(t,e,r)=>{let{dt:n}=r||{},l=ri("__osSizeObserverPlugin"),[i]=o({o:!1,u:!0});return()=>{let r=[],o=t$('<div class="'.concat(ez,'"><div class="').concat(eN,'"></div></div>'))[0],a=o.firstChild,c=t=>{let r=t instanceof ResizeObserverEntry,n=!1,l=!1;if(r){let[e,,r]=i(t.contentRect),o=eo(e);n=!(l=ei(e,r))&&!o}else l=!0===t;n||e({_t:!0,dt:l})};if(w){let t=new w(t=>c(t.pop()));t.observe(a),j(r,()=>{t.disconnect()})}else{if(!l)return td;let[t,e]=l(a,c,n);j(r,V([tI(o,eP),ec(o,"animationstart",t)],e))}return tp(W,j(r,tX(t,o)))}},rp=(t,e)=>{let r;let n=t=>0===t.h||t.isIntersecting||t.intersectionRatio>0,l=tW("os-trinsic-observer"),[i]=o({o:!1}),a=(t,r)=>{if(t){let l=i(n(t)),[,o]=l;return o&&!r&&e(l)&&[l]}},c=(t,e)=>a(e.pop(),t);return[()=>{let e=[];if(g)(r=new g(tp(c,!1),{root:t})).observe(l),j(e,()=>{r.disconnect()});else{let t=()=>{a(t8(l))};j(e,rd(l,t)()),t()}return tp(W,j(e,tX(t,l)))},()=>r&&c(!0,r.takeRecords())]},rf=(t,e,r,n)=>{let l,i,a,c,s,u;let{R:d}=e1(),p="[".concat(eC,"]"),f="[".concat(e_,"]"),y=["tabindex"],h=["wrap","cols","rows"],v=["id","class","style","open"],{ft:b,vt:m,nt:g,ht:x,gt:S,bt:O,tt:E,wt:C,yt:k}=t,R=t=>"rtl"===t3(t,"direction"),A={St:!1,et:R(b)},_=e1(),L=ri(ru),[D]=o({i:tc,o:{w:0,h:0}},()=>{let n=L&&L.Z(t,e,A,_,r).it,l=!E&&C("arrange"),o=l&&ef(x),i=k(eH,!0),a=l&&n&&n()[0],c=ee(S),s=ee(g),u=er(g);return a&&a(),ep(x,o),i(),{w:s.w+c.w+u.w,h:s.h+c.h+u.h}}),z=O?h:V(v,h),P=ty(n,{_:()=>l,p:()=>i,v(t,e){let[r]=t,[n]=e;return[V(tv(r),tv(n)).reduce((t,e)=>(t[e]=r[e]||n[e],t),{})]}}),N=t=>{let e=R(b);tb(t,{Ot:u!==e}),tb(A,{et:e}),u=e},j=t=>{F(t||y,t=>{if(K(y,t)){let e=tS(m,t);T(e)?tE(g,t,e):tC(g,t)}})},B=(t,e)=>{let[r,l]=t,o={$t:l};return tb(A,{St:r}),e||n(o),o},q=t=>{let{_t:e,dt:r}=t,l=!(e&&!r)&&d?P:n,o={_t:e||r,dt:r};N(o),l(o)},X=(t,e)=>{let[,r]=D(),l={Ct:r};N(l);let o=t?n:P;return r&&!e&&o(l),l},Y=(t,e,r)=>{let n={xt:e};return N(n),e&&!r?P(n):E||j(t),n},{V:W}=_,[$,J]=S?rp(m,B):[],U=!E&&rd(m,q,{dt:!0}),[G,Z]=re(m,!1,Y,{B:v,F:V(v,y)}),Q=E&&w&&new w(t=>{let e=t[t.length-1].contentRect;q({_t:!0,dt:ei(e,s)}),s=e});return[()=>{j(),Q&&Q.observe(m);let t=U&&U(),e=$&&$(),r=G(),n=W(t=>{let[,e]=D();P({Ht:t,Ct:e})});return()=>{Q&&Q.disconnect(),t&&t(),e&&e(),c&&c(),r(),n()}},t=>{let{Et:e,zt:r,At:n}=t,o={},[s]=e("update.ignoreMutation"),[u,d]=e("update.attributes"),[y,h]=e("update.elementEvents"),[v,b]=e("update.debounce"),m=r||n,w=t=>H(s)&&s(t);if(h||d){a&&a(),c&&c();let[t,e]=re(S||g,!0,X,{F:V(z,u||[]),X:y,Y:p,J:(t,e)=>{let{target:r,attributeName:n}=t;return!e&&!!n&&!E&&tj(r,p,f)||!!tK(r,".".concat(eF))||!!w(t)}});c=t(),a=e}if(b){if(P.S(),I(v)){let t=v[0],e=v[1];l=M(t)&&t,i=M(e)&&e}else l=!!M(v)&&v,i=!1}if(m){let t=Z(),e=J&&J(),r=a&&a();t&&tb(o,Y(t[0],t[1],m)),e&&tb(o,B(e[0],m)),r&&tb(o,X(r[0],m))}return N(o),o},A]},ry=(t,e,r,n)=>{let{L:l}=e1(),{scrollbars:o}=l(),{slot:i}=o,{ft:a,vt:c,nt:s,It:u,ht:d,Tt:p,tt:f}=e,{scrollbars:y}=u?{}:t,{slot:h}=y||{},v=new Map,b=t=>x&&new x({source:d,axis:t}),m={x:b("x"),y:b("y")},g=e5([a,c,s],()=>f&&p?a:c,i,h),w=(t,e)=>{if(e){let r=t?te:tr,{Dt:n,kt:l}=e;return tw(0,1,en(l)[r]/en(n)[r]||0)}let n=t?"x":"y",{Rt:l,Mt:o}=r,i=o[n];return tw(0,1,i/(i+l[n])||0)},S=(t,e,r)=>{let n=w(r,t);return 1/n*(1-n)*e},O=t=>tb(t,{clear:["left"]}),E=t=>{v.forEach((e,r)=>{(!t||K(q(t),r))&&(F(e||[],t=>{t&&t.cancel()}),v.delete(r))})},C=(t,e,r,n)=>{let l=v.get(t)||[],o=l.find(t=>t&&t.timeline===e);o?o.effect=new KeyframeEffect(t,r,{composite:n}):v.set(t,V(l,[t.animate(r,{timeline:e,composite:n})]))},k=(t,e,r)=>{let n=r?tI:tH;F(t,t=>{n(t.Vt,e)})},R=(t,e)=>{F(t,t=>{let[r,n]=e(t);t1(r,n)})},A=(t,e)=>{R(t,t=>{let{kt:r}=t;return[r,{[e?te:tr]:tQ(w(e))}]})},M=(t,e)=>{let{Lt:n}=r,l=e?"x":"y",o=m[l],i=ev(n)[l],a=(t,r)=>t5(tQ(S(t,i?r:1-r,e)),e);o?F(t,t=>{let{kt:e}=t;C(e,o,O({transform:[0,1].map(e=>a(t,e))}))}):R(t,t=>[t.kt,{transform:a(t,eb(n,ef(d))[l])}])},T=t=>f&&!p&&tF(t)===s,H=[],I=[],L=[],D=(t,e,r)=>{let n=_(r),l=!n||r,o=!n||!r;l&&k(I,t,e),o&&k(L,t,e)},z=t=>{let e=tW("".concat(eF," ").concat(t?eV:ej)),r=tW(eB),l=tW(eq),o={Vt:e,Dt:r,kt:l};return j(t?I:L,o),j(H,[tX(e,r),tX(r,l),tp(tB,e),E,n(o,D,M,t)]),o},P=tp(z,!0),N=tp(z,!1);return P(),N(),[{Pt:()=>{A(I,!0),A(L)},Ut:()=>{M(I,!0),M(L)},Nt:()=>{if(f){let{Rt:t,Lt:e}=r,n=ev(e);if(m.x&&m.y)F(V(L,I),e=>{let{Vt:r}=e;if(T(r)){let e=e=>C(r,m[e],O({transform:[0,n[e]?1:-1].map(r=>t5(t0(r*(t[e]-.5)),"x"===e))}),"add");e("x"),e("y")}else E(r)});else{let r=eb(e,ef(d)),l=e=>{let{Vt:l}=e,o=T(l)&&l,i=(t,e,r)=>{let n=e*t;return t0(r?n:-n)};return[o,o&&{transform:t5({x:i(r.x,t.x,n.x),y:i(r.y,t.y,n.y)})}]};R(I,l),R(L,l)}}},jt:D,qt:{M:m.x,Ft:I,Bt:P,Xt:tp(R,I)},Yt:{M:m.y,Ft:L,Bt:N,Xt:tp(R,L)}},()=>(tX(g,I[0].Vt),tX(g,L[0].Vt),tp(W,H))]},rh=(t,e,r,n)=>(l,o,i,a)=>{let{vt:c,nt:s,tt:p,ht:f,Wt:y,yt:v}=e,{Vt:b,Dt:m,kt:g}=l,[w,x]=tf(333),[S,O]=tf(444),[E,C]=tf(),k=tp(i,[l],a),R=t=>{H(f.scrollBy)&&f.scrollBy({behavior:"smooth",left:t.x,top:t.y})},A=a?te:tr,M=!0,T=t=>t.propertyName.indexOf(A)>-1;return tp(W,[ec(g,"pointermove pointerleave",n),ec(b,"pointerenter",()=>{o(eW,!0)}),ec(b,"pointerleave pointercancel",()=>{o(eW,!1)}),!p&&ec(b,"mousedown",()=>{let t=tV();(tO(t,e_)||tO(t,eC)||t===document.body)&&h(()=>{s.focus({preventScroll:!0})},25)}),ec(b,"wheel",t=>{let{deltaX:e,deltaY:r,deltaMode:n}=t;M&&0===n&&tF(b)===c&&R({x:e,y:r}),M=!1,o(eG,!0),w(()=>{M=!0,o(eG)}),eu(t)},{C:!1,H:!0}),ec(g,"transitionstart",t=>{if(T(t)){let t=()=>{k(),E(t)};t()}}),ec(g,"transitionend transitioncancel",t=>{T(t)&&(C(),k())}),ec(b,"pointerdown",tp(ec,y,"click",ed,{A:!0,H:!0,C:!1}),{H:!0}),(()=>{let e="pointerup pointercancel lostpointercapture",n="client".concat(a?"X":"Y"),l=a?"left":"top",o=a?"w":"h",i=a?"x":"y",c=(t,e)=>n=>{let{Rt:l}=r,a=e*n/(t8(m)[o]-t8(g)[o])*l[i];ep(f,{[i]:t+a})};return ec(m,"pointerdown",r=>{let a=tK(r.target,".".concat(eq))===g,s=a?g:m,p=t.scrollbars,{button:h,isPrimary:b,pointerType:w}=r,{pointers:x}=p;if(0===h&&b&&p[a?"dragScroll":"clickScroll"]&&(x||[]).includes(w)){O();let t=!a&&r.shiftKey,p=tp(en,g),h=tp(en,m),b=(t,e)=>(t||p())[l]-(e||h())[l],w=u(en(f)[A])/t8(f)[o]||1,x=c(ef(f)[i],1/w),E=r[n],C=p(),k=h(),M=C[A],T=b(C,k)+M/2,_=E-k[l],H=a?0:_-T,I=t=>{W(z),s.releasePointerCapture(t.pointerId)},L=()=>v("scrollbarPressed",!0),D=L(),z=[()=>{let t=ef(f);D();let e=ef(f),r={x:e.x-t.x,y:e.y-t.y};(d(r.x)>3||d(r.y)>3)&&(L(),ep(f,t),R(r),S(D))},ec(y,e,I),ec(y,"selectstart",t=>eu(t),{C:!1}),ec(m,e,I),ec(m,"pointermove",e=>{let r=e[n]-E;(a||t)&&x(H+r)})];if(s.setPointerCapture(r.pointerId),t)x(H);else if(!a){let t=ri("__osClickScrollPlugin");t&&j(z,t(x,b,H,M,_))}}})})(),x,O,C])},rv=(t,e,r,n,l,o)=>{let i,a,c,s,u;let d=td,p=0,f=t=>"mouse"===t.pointerType,[y,h]=tf(),[v,b]=tf(100),[m,g]=tf(100),[w,x]=tf(()=>p),[S,O]=ry(t,l,n,rh(e,l,n,t=>f(t)&&H())),{vt:E,Jt:C,Tt:k}=l,{jt:R,Pt:A,Ut:M,Nt:T}=S,_=(t,e)=>{if(x(),t)R(eU);else{let t=tp(R,eU,!0);p>0&&!e?w(t):t()}},H=()=>{(c?i:s)||(_(!0),v(()=>{_(!1)}))},I=t=>{R(eJ,t,!0),R(eJ,t,!1)},L=t=>{f(t)&&(i=c,c&&_(!0))},D=[x,b,g,h,()=>d(),ec(E,"pointerover",L,{A:!0}),ec(E,"pointerenter",L),ec(E,"pointerleave",t=>{f(t)&&(i=!1,c&&_(!1))}),ec(E,"pointermove",t=>{f(t)&&a&&H()}),ec(C,"scroll",t=>{y(()=>{M(),H()}),o(t),T()})];return[()=>tp(W,j(D,O())),t=>{let{Et:e,At:l,Kt:o,Gt:i}=t,{Qt:f,Zt:y,tn:h,nn:v}=i||{},{Ot:b,dt:g}=o||{},{et:w}=r,{k:x}=e1(),{K:S,sn:O}=n,[E,H]=e("showNativeOverlaidScrollbars"),[L,D]=e("scrollbars.theme"),[z,P]=e("scrollbars.visibility"),[N,F]=e("scrollbars.autoHide"),[K,V]=e("scrollbars.autoHideSuspend"),[j]=e("scrollbars.autoHideDelay"),[B,q]=e("scrollbars.dragScroll"),[X,Y]=e("scrollbars.clickScroll"),[W,$]=e("overflow"),J=O.x||O.y,U=E&&x.x&&x.y,G=(t,e,r)=>{let n=t.includes(to)&&(z===tn||"auto"===z&&e===to);return R(eX,n,r),n};if(p=j,g&&!l&&(K&&J?(I(!1),d(),m(()=>{d=ec(C,"scroll",tp(I,!0),{A:!0})})):I(!0)),H&&R("os-theme-none",U),D&&(R(u),R(L,!0),u=L),V&&!K&&I(!0),F&&(a="move"===N,c="leave"===N,_(s="never"===N,!0)),q&&R(eQ,B),Y&&R(eZ,X),h||P||$){let t=G(W.x,S.x,!0),e=G(W.y,S.y,!1);R(eY,!(t&&e))}(f||y||v||b||l)&&(A(),M(),T(),R(e$,!O.x,!0),R(e$,!O.y,!1),R(eK,w&&!k))},{},S]},rb=t=>{let{L:e,R:r}=e1(),{elements:n}=e(),{host:l,padding:o,viewport:i,content:c}=n,s=P(t),u=s?{}:t,{elements:d}=u,{host:p,padding:f,viewport:y,content:h}=d||{},v=s?t:u.target,b=tP(v),m=tz(v,"textarea"),g=v.ownerDocument,w=g.documentElement,x=()=>g.defaultView||a,S=t=>{t&&t.focus&&t.focus({preventScroll:!0})},O=tp(e2,[v]),E=tp(e5,[v]),C=tp(tW,""),k=tp(O,C,i),R=tp(E,C,c),A=k(y),M=A===v,T=M&&b,_=!M&&R(h),H=T?w:A,I=m?O(C,l,p):v,L=T?H:I,D=!M&&E(C,o,f),z=!(!M&&A===_)&&_,N=[z,H,D,L].map(t=>P(t)&&!tF(t)&&t),F=t=>t&&K(N,t),V=F(H)?v:H,B={ft:v,vt:L,nt:H,en:D,gt:z,ht:T?w:H,Jt:T?g:H,cn:b?w:V,Wt:g,bt:m,Tt:b,It:s,tt:M,rn:x,wt:t=>tT(H,e_,t),yt:(t,e)=>tM(H,e_,t,e)},{ft:q,vt:X,en:Y,nt:$,gt:J}=B,U=[()=>{tC(X,[eC,eA]),tC(q,eA),b&&tC(w,[eA,eC])}],G=m&&F(X),Z=m?q:tN([J,$,Y,X,q].find(t=>t&&!F(t))),Q=T?q:J||$,tt=tp(W,U);return[B,()=>{let t=x(),e=tV(),n=t=>{tX(tF(t),tN(t)),tB(t)},l=t=>ec(t,"focusin focusout focus blur",es,{H:!0}),o="tabindex",i=tS($,o),a=l(e);return tE(X,eC,M?"":"host"),tE(Y,eL,""),tE($,e_,""),tE(J,eD,""),!M&&(tE($,o,i||"-1"),b&&tE(w,eT,"")),G&&(tY(q,X),j(U,()=>{tY(X,q),tB(X)})),tX(Q,Z),tX(X,Y),tX(Y||X,!M&&$),tX($,J),j(U,[a,()=>{let t=tV(),e=l(t);tC(Y,eL),tC(J,eD),tC($,e_),b&&tC(w,eT),i?tE($,o,i):tC($,o),F(J)&&n(J),F($)&&n($),F(Y)&&n(Y),S(t),e()}]),r&&!M&&(tA($,e_,eI),j(U,tp(tC,$,e_))),S(M||e!==v||t.top!==t?e:$),a(),Z=0,tt},tt]},rm=t=>{let{gt:e}=t;return t=>{let{Kt:r,ln:n,At:l}=t,{$t:o}=r||{},{St:i}=n;e&&(o||l)&&t1(e,{[tr]:i&&"100%"})}},rg=(t,e)=>{let{vt:r,en:n,nt:l,tt:i}=t,[a,c]=o({i:tu,o:t2()},tp(t2,r,"padding",""));return t=>{let{Et:r,Kt:o,ln:s,At:u}=t,[d,p]=c(u),{R:f}=e1(),{_t:y,Ct:h,Ot:v}=o||{},{et:b}=s,[m,g]=r("paddingAbsolute"),w=u||h;(y||p||w)&&([d,p]=a(u));let x=!i&&(g||v||p);if(x){let t=!m||!n&&!f,r=d.r+d.l,o=d.t+d.b,i={[Q]:t&&!b?-r:0,[tt]:t?-o:0,[Z]:t&&b?-r:0,top:t?-d.t:0,right:t?b?-d.r:"auto":0,left:t?b?"auto":-d.l:0,[te]:t&&"calc(100% + ".concat(r,"px)")},a={[$]:t?d.t:0,[J]:t?d.r:0,[G]:t?d.b:0,[U]:t?d.l:0};t1(n||l,i),t1(l,a),tb(e,{en:d,an:!t,ct:n?a:tb({},i,a)})}return{un:x}}},rw=(t,e)=>{let r=e1(),{vt:n,en:l,nt:i,tt:s,ht:u,Tt:d,yt:p,rn:f}=t,{R:y}=r,h=d&&s,v=tp(c,0),b=["display","direction","flexDirection","writingMode"],m={i:tc,o:{w:0,h:0}},g=(t,e)=>{let r=a.devicePixelRatio%1!=0?1:0,n={w:v(t.w-e.w),h:v(t.h-e.h)};return{w:n.w>r?n.w:0,h:n.h>r?n.h:0}},w=()=>{let t=ef(u),e=p("noContent",!0),r=ec(u,to,es,{H:!0});ep(u,{x:0,y:0}),e();let n=ef(u),l=ee(u);ep(u,{x:l.w,y:l.h});let o=ef(u);ep(u,{x:o.x-n.x<1&&-l.w,y:o.y-n.y<1&&-l.h});let i=ef(u);return ep(u,t),r(),{I:n,T:i}},x=()=>tb({},el(i)?t3(i,b):{}),[S,O]=o(m,tp(er,i)),[E,C]=o(m,tp(ee,i)),[k,R]=o(m),[A,M]=o(m),[T]=o({i:ts,o:{}}),[_]=o({i:(t,e)=>ta(t,e,b),o:{}}),[H,I]=o({i:(t,e)=>ts(t.I,e.I)&&ts(t.T,e.T),o:ey()}),L=ri(ru),D=(t,e)=>"".concat(e?"overflowX":"overflowY").concat(ti(t)),z=t=>{let{K:e}=t;F(tv(e),t=>{let r="x"===t;p([tn,tl,to].map(t=>D(t,r)).join(" ")),p(D(e[t],r),!0)})};return(o,a)=>{let{Et:s,Kt:u,ln:d,At:b}=o,{un:m}=a,{_t:D,Ct:P,Ot:N,dt:F,Ht:K}=u||{},{lt:V,it:j,ut:B}=L&&L.Z(t,e,d,r,s)||{},[q,X]=ra(s,r),[Y,W]=s("overflow"),$=rc(Y.x),J=rc(Y.y),U=D||m||P||N||K||X,G=O(b),Z=C(b),Q=R(b),tt=M(b);if(X&&y&&p(eI,!q),U){let[t]=j?j():[],[e]=G=S(b),[r]=Z=E(b),n=et(i);t&&t();let l=t7(f()),o={w:v(c(r.w,r.w)+e.w),h:v(c(r.h,r.h)+e.h)},a={w:v((h?l.w:n.w+v(n.w-r.w))+e.w),h:v((h?l.h:n.h+v(n.h-r.h))+e.h)};tt=A(a),Q=k(g(o,a),b)}let[te,tr]=tt,[tn,tl]=Q,[to,ti]=Z,[ta,tc]=G,ts={x:tn.w>0,y:tn.h>0},tu=$&&J&&(ts.x||ts.y)||$&&ts.x&&!ts.y||J&&ts.y&&!ts.x,td=rs(ts,Y),[tp,tf]=T(td.K),[,ty]=_(x(),b),[th,tv]=N||F||ty||b?H(w(),b):I();return(m||N||K||tc||ti||tr||tl||W||X||U)&&(z(td),B&&V&&t1(i,B(td,d,V(td,to,ta)))),tM(n,eC,eM,tu),tM(l,eL,eM,tu),tb(e,{K:tp,Mt:{x:te.w,y:te.h},Rt:{x:tn.w,y:tn.h},sn:ts,Lt:eh(th,tn)}),{tn:tf,Qt:tr,Zt:tl,nn:tv||tl}}},rx=t=>{let[e,r,n]=rb(t),l={en:{t:0,r:0,b:0,l:0},an:!1,ct:{[Q]:0,[tt]:0,[Z]:0,[$]:0,[J]:0,[G]:0,[U]:0},Mt:{x:0,y:0},Rt:{x:0,y:0},K:{x:tl,y:tl},sn:{x:!1,y:!1},Lt:ey()},{ft:o,ht:i,tt:a,yt:c}=e,{R:s,k:u}=e1(),d=!s&&(u.x||u.y),p=[rm(e),rg(e,l),rw(e,l)];return[r,t=>{let e={},r=c(eH,!0),n=d&&ef(i);return F(p,r=>{tb(e,r(t,e)||{})}),ep(i,n),a||ep(o,0),r(),e},l,e,n]},rS=(t,e,r,n)=>{let l=eE(e,{}),[o,i,a,c,s]=rx(t),[u,d,p]=rf(c,a,l,t=>{b({},t)}),[f,y,,h]=rv(t,e,p,a,c,n),v=t=>tv(t).some(e=>!!t[e]),b=(t,n)=>{let{dn:l,At:o,zt:a,_n:c}=t,s=l||{},u=!!o,f={Et:eE(e,s,u),dn:s,At:u};if(c)return y(f),!1;let h=n||d(tb({},f,{zt:a})),b=i(tb({},f,{ln:p,Kt:h}));y(tb({},f,{Kt:h,Gt:b}));let m=v(h),g=v(b),w=m||g||!tg(s)||u;return w&&r(t,{Kt:h,Gt:b}),w};return[()=>{let{cn:t,ht:e,yt:r}=c,n=r(eH,!0),l=ef(t),i=[u(),o(),f()];return ep(e,l),n(),tp(W,i)},b,()=>({fn:p,pn:a}),{vn:c,hn:h},s]},rO=(t,e,r)=>{let{U:n}=e1(),l=P(t),o=l?t:t.target,i=e8(o);if(e&&!i){let i=!1,a=[],c={},s=t=>{let e=tm(t,!0),r=ri("__osOptionsValidationPlugin");return r?r(e,!0):e},u=tb({},n(),s(e)),[d,p,f]=eg(),[y,h,v]=eg(r),b=(t,e)=>{v(t,e),f(t,e)},[m,g,w,x,S]=rS(t,u,(t,e)=>{let{dn:r,At:n}=t,{Kt:l,Gt:o}=e,{_t:i,Ot:a,$t:c,Ct:s,xt:u,dt:d}=l,{Qt:p,Zt:f,tn:y,nn:h}=o;b("updated",[E,{updateHints:{sizeChanged:!!i,directionChanged:!!a,heightIntrinsicChanged:!!c,overflowEdgeChanged:!!p,overflowAmountChanged:!!f,overflowStyleChanged:!!y,scrollCoordinatesChanged:!!h,contentMutation:!!s,hostMutation:!!u,appear:!!d},changedOptions:r||{},force:!!n}])},t=>b("scroll",[E,t])),O=t=>{e7(o),W(a),i=!0,b("destroyed",[E,t]),p(),h()},E={options(t,e){if(t){let r=eO(u,tb(e?n():{},s(t)));tg(r)||(tb(u,r),g({dn:r}))}return tb({},u)},on:y,off:(t,e)=>{t&&e&&h(t,e)},state(){let{fn:t,pn:e}=w(),{et:r}=t,{Mt:n,Rt:l,K:o,sn:a,en:c,an:s,Lt:u}=e;return tb({},{overflowEdge:n,overflowAmount:l,overflowStyle:o,hasOverflow:a,scrollCoordinates:{start:u.I,end:u.T},padding:c,paddingAbsolute:s,directionRTL:r,destroyed:i})},elements(){let{ft:t,vt:e,en:r,nt:n,gt:l,ht:o,Jt:i}=x.vn,{qt:a,Yt:c}=x.hn,s=t=>{let{kt:e,Dt:r,Vt:n}=t;return{scrollbar:n,track:r,handle:e}},u=t=>{let{Ft:e,Bt:r}=t;return tb({},s(e[0]),{clone:()=>{let t=s(r());return g({_n:!0}),t}})};return tb({},{target:t,host:e,padding:r||n,viewport:n,content:l||n,scrollOffsetElement:o,scrollEventElement:i,scrollbarHorizontal:u(a),scrollbarVertical:u(c)})},update:t=>g({At:t,zt:!0}),destroy:tp(O,!1),plugin:t=>c[tv(t)[0]]};return(j(a,[S]),e6(o,E),ro(rr,rO,[E,d,c]),e4(x.vn.Tt,!l&&t.cancel))?O(!0):(j(a,m()),b("initialized",[E]),E.update(!0)),E}return i};rO.plugin=t=>{let e=I(t),r=e?t:[t],n=r.map(t=>ro(t,rO)[0]);return rl(r),e?n:n[0]},rO.valid=t=>{let e=t&&t.elements,r=H(e)&&e();return z(r)&&!!e8(r.target)},rO.env=()=>{let{D:t,k:e,R:r,M:n,j:l,q:o,L:i,P:a,U:c,N:s}=e1();return tb({},{scrollbarsSize:t,scrollbarsOverlaid:e,scrollbarsHiding:r,scrollTimeline:n,staticDefaultInitialization:l,staticDefaultOptions:o,getDefaultInitialization:i,setDefaultInitialization:a,getDefaultOptions:c,setDefaultOptions:s})};let rE=()=>{let t,e;let r=window,n="function"==typeof r.requestIdleCallback,l=r.requestAnimationFrame,o=r.cancelAnimationFrame,i=n?r.requestIdleCallback:l,a=n?r.cancelIdleCallback:o,c=()=>{a(t),o(e)};return[(r,o)=>{c(),t=i(n?()=>{c(),e=l(r)}:r,"object"==typeof o?o:{timeout:2233})},c]},rC=t=>{let{options:e,events:r,defer:n}=t||{},[o,i]=(0,l.useMemo)(rE,[]),a=(0,l.useRef)(null),c=(0,l.useRef)(n),s=(0,l.useRef)(e),u=(0,l.useRef)(r);return(0,l.useEffect)(()=>{c.current=n},[n]),(0,l.useEffect)(()=>{let{current:t}=a;s.current=e,rO.valid(t)&&t.options(e||{},!0)},[e]),(0,l.useEffect)(()=>{let{current:t}=a;u.current=r,rO.valid(t)&&t.on(r||{},!0)},[r]),(0,l.useEffect)(()=>()=>{var t;i(),null==(t=a.current)||t.destroy()},[]),(0,l.useMemo)(()=>[t=>{let e=a.current;if(rO.valid(e))return;let r=c.current,n=s.current||{},l=u.current||{},i=()=>a.current=rO(t,n,l);r?o(i,r):i()},()=>a.current],[])},rk=(0,l.forwardRef)((t,e)=>{let{element:r="div",options:n,events:o,defer:i,children:a,...c}=t,s=(0,l.useRef)(null),u=(0,l.useRef)(null),[d,p]=rC({options:n,events:o,defer:i});return(0,l.useEffect)(()=>{let{current:t}=s,{current:e}=u;if(t)return d("body"===r?{target:t,cancel:{body:null}}:{target:t,elements:{viewport:e,content:e}}),()=>{var t;return null==(t=p())?void 0:t.destroy()}},[d,r]),(0,l.useImperativeHandle)(e,()=>({osInstance:p,getElement:()=>s.current}),[]),l.createElement(r,{"data-overlayscrollbars-initialize":"",ref:s,...c},"body"===r?a:l.createElement("div",{"data-overlayscrollbars-contents":"",ref:u},a))})}}]);