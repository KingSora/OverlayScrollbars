"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[10],{5010:function(t,e,r){let n,l;r.d(e,{E:function(){return rw},A:function(){return rg}});var o=r(2265);/*!
 * OverlayScrollbars
 * Version: 2.9.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */let i=(t,e)=>{let r;let{o:n,i:l,u:o}=t,i=n,a=(t,e)=>{let n=i,a=e||(l?!l(n,t):n!==t);return(a||o)&&(i=t,r=n),[i,a,r]};return[e?t=>a(e(i,r),t):a,t=>[i,!!t,r]]},a="undefined"!=typeof HTMLElement&&window.document?window:{},c=Math.max,s=Math.min,u=Math.round,d=Math.abs,p=Math.sign,f=a.cancelAnimationFrame,y=a.requestAnimationFrame,h=a.setTimeout,v=a.clearTimeout,b=t=>void 0!==a[t]?a[t]:void 0,m=b("MutationObserver"),g=b("IntersectionObserver"),w=b("ResizeObserver"),x=b("ScrollTimeline"),S=t=>void 0===t,O=t=>null===t,A=t=>"number"==typeof t,M=t=>"string"==typeof t,k=t=>"boolean"==typeof t,C=t=>"function"==typeof t,E=t=>Array.isArray(t),R=t=>"object"==typeof t&&!E(t)&&!O(t),D=t=>{let e=!!t&&t.length,r=A(e)&&e>-1&&e%1==0;return(!!E(t)||!C(t)&&!!r)&&(!(e>0&&R(t))||e-1 in t)},T=t=>!!t&&t.constructor===Object,H=t=>t instanceof HTMLElement,I=t=>t instanceof Element;function z(t,e){if(D(t))for(let r=0;r<t.length&&!1!==e(t[r],r,t);r++);else t&&z(Object.keys(t),r=>e(t[r],r,t));return t}let L=(t,e)=>t.indexOf(e)>=0,N=(t,e)=>t.concat(e),P=(t,e,r)=>(!r&&!M(e)&&D(e)?Array.prototype.push.apply(t,e):t.push(e),t),V=t=>Array.from(t||[]),_=t=>E(t)?t:!M(t)&&D(t)?V(t):[t],j=t=>!!t&&!t.length,F=t=>V(new Set(t)),K=(t,e,r)=>{z(t,t=>t&&t.apply(void 0,e||[])),r||(t.length=0)},G="paddingTop",q="paddingRight",B="paddingLeft",U="paddingBottom",W="marginLeft",X="marginRight",Y="marginBottom",$="width",J="height",Z="visible",Q="hidden",tt="scroll",te=t=>{let e=String(t||"");return e?e[0].toUpperCase()+e.slice(1):""},tr=(t,e,r,n)=>{if(t&&e){let l=!0;return z(r,r=>{(n?n(t[r]):t[r])!==(n?n(e[r]):e[r])&&(l=!1)}),l}return!1},tn=(t,e)=>tr(t,e,["w","h"]),tl=(t,e)=>tr(t,e,["x","y"]),to=(t,e)=>tr(t,e,["t","r","b","l"]),ti=()=>{},ta=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),n=1;n<e;n++)r[n-1]=arguments[n];return t.bind(0,...r)},tc=t=>{let e;let r=t?h:y,n=t?v:f;return[l=>{n(e),e=r(()=>l(),C(t)?t():t)},()=>n(e)]},ts=(t,e)=>{let r,n,l,o;let{_:i,p:a,v:c,m:s}=e||{},u=ti,d=function(e){u(),v(r),o=r=n=void 0,u=ti,t.apply(this,e)},p=t=>s&&n?s(n,t):t,b=()=>{u!==ti&&d(p(l)||l)},m=function(){let t=V(arguments),e=C(i)?i():i;if(A(e)&&e>=0){let i;let s=C(a)?a():a,m=A(s)&&s>=0,g=e>0?h:y,w=e>0?v:f,x=p(t)||t,S=d.bind(0,x);u(),c&&!o?(S(),o=!0,i=g(()=>o=void 0,e)):(i=g(S,e),m&&!r&&(r=h(b,s))),u=()=>w(i),n=l=x}else d(t)};return m.S=b,m},tu=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),td=t=>t?Object.keys(t):[],tp=(t,e,r,n,l,o,i)=>(("object"!=typeof t||O(t))&&!C(t)&&(t={}),z([e,r,n,l,o,i],e=>{z(e,(r,n)=>{let l=e[n];if(t===l)return!0;let o=E(l);if(l&&T(l)){let e=t[n],r=e;o&&!E(e)?r=[]:o||T(e)||(r={}),t[n]=tp(r,l)}else t[n]=o?l.slice():l})}),t),tf=(t,e)=>z(tp({},t),(t,r,n)=>{void 0===t?delete n[r]:e&&t&&T(t)&&(n[r]=tf(t,e))}),ty=t=>!td(t).length,th=(t,e,r)=>c(t,s(e,r)),tv=t=>F((E(t)?t:(t||"").split(" ")).filter(t=>t)),tb=(t,e)=>t&&t.getAttribute(e),tm=(t,e)=>t&&t.hasAttribute(e),tg=(t,e,r)=>{z(tv(e),e=>{t&&t.setAttribute(e,String(r||""))})},tw=(t,e)=>{z(tv(e),e=>t&&t.removeAttribute(e))},tx=(t,e)=>{let r=tv(tb(t,e)),n=ta(tg,t,e),l=(t,e)=>{let n=new Set(r);return z(tv(t),t=>{n[e](t)}),V(n).join(" ")};return{O:t=>n(l(t,"delete")),$:t=>n(l(t,"add")),C:t=>{let e=tv(t);return e.reduce((t,e)=>t&&r.includes(e),e.length>0)}}},tS=(t,e,r)=>(tx(t,e).O(r),ta(tO,t,e,r)),tO=(t,e,r)=>(tx(t,e).$(r),ta(tS,t,e,r)),tA=(t,e,r,n)=>(n?tO:tS)(t,e,r),tM=(t,e,r)=>tx(t,e).C(r),tk=t=>tx(t,"class"),tC=(t,e)=>{tk(t).O(e)},tE=(t,e)=>(tk(t).$(e),ta(tC,t,e)),tR=(t,e)=>{let r=e?I(e)&&e:document;return r?V(r.querySelectorAll(t)):[]},tD=(t,e)=>{let r=e?I(e)&&e:document;return r&&r.querySelector(t)},tT=(t,e)=>I(t)&&t.matches(e),tH=t=>tT(t,"body"),tI=t=>t?V(t.childNodes):[],tz=t=>t&&t.parentElement,tL=(t,e)=>I(t)&&t.closest(e),tN=t=>(t||document).activeElement,tP=(t,e,r)=>{let n=tL(t,e),l=t&&tD(r,n),o=tL(l,e)===n;return!!n&&!!l&&(n===t||l===t||o&&tL(tL(t,r),e)!==n)},tV=t=>{z(_(t),t=>{let e=tz(t);t&&e&&e.removeChild(t)})},t_=(t,e)=>ta(tV,t&&e&&z(_(e),e=>{e&&t.appendChild(e)})),tj=t=>{let e=document.createElement("div");return tg(e,"class",t),e},tF=t=>{let e=tj();return e.innerHTML=t.trim(),z(tI(e),t=>tV(t))},tK=(t,e)=>t.getPropertyValue(e)||t[e]||"",tG=t=>{let e=t||0;return isFinite(e)?e:0},tq=t=>tG(parseFloat(t||"")),tB=t=>"".concat((100*tG(t)).toFixed(3),"%"),tU=t=>"".concat(tG(t),"px");function tW(t,e){t&&e&&z(e,(e,r)=>{try{let n=t.style,l=A(e)?tU(e):(e||"")+"";0===r.indexOf("--")?n.setProperty(r,l):n[r]=l}catch(t){}})}function tX(t,e,r){let n=M(e),l=n?"":{};if(t){let o=a.getComputedStyle(t,r)||t.style;l=n?tK(o,e):V(e).reduce((t,e)=>(t[e]=tK(o,e),t),l)}return l}let tY=(t,e,r)=>{let n=e?"".concat(e,"-"):"",l=r?"-".concat(r):"",o="".concat(n,"top").concat(l),i="".concat(n,"right").concat(l),a="".concat(n,"bottom").concat(l),c="".concat(n,"left").concat(l),s=tX(t,[o,i,a,c]);return{t:tq(s[o]),r:tq(s[i]),b:tq(s[a]),l:tq(s[c])}},t$=(t,e)=>"translate".concat(R(t)?"(".concat(t.x,",").concat(t.y,")"):"".concat(e?"X":"Y","(").concat(t,")")),tJ=t=>!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length),tZ={w:0,h:0},tQ=(t,e)=>e?{w:e["".concat(t,"Width")],h:e["".concat(t,"Height")]}:tZ,t0=t=>tQ("inner",t||a),t1=ta(tQ,"offset"),t2=ta(tQ,"client"),t3=ta(tQ,"scroll"),t5=t=>{let e=parseFloat(tX(t,$))||0,r=parseFloat(tX(t,J))||0;return{w:e-u(e),h:r-u(r)}},t4=t=>t.getBoundingClientRect(),t9=t=>!!t&&tJ(t),t6=t=>!!(t&&(t[J]||t[$])),t7=(t,e)=>{let r=t6(t);return!t6(e)&&r},t8=(t,e,r,n)=>{z(tv(e),e=>{t&&t.removeEventListener(e,r,n)})},et=(t,e,r,n)=>{var l;let o=null==(l=n&&n.H)||l,i=n&&n.I||!1,a=n&&n.A||!1,c={passive:o,capture:i};return ta(K,tv(e).map(e=>{let n=a?l=>{t8(t,e,n,i),r&&r(l)}:r;return t&&t.addEventListener(e,n,c),ta(t8,t,e,n,i)}))},ee=t=>t.stopPropagation(),er=t=>t.preventDefault(),en=t=>ee(t)||er(t),el=(t,e)=>{let{x:r,y:n}=A(e)?{x:e,y:e}:e||{};A(r)&&(t.scrollLeft=r),A(n)&&(t.scrollTop=n)},eo=t=>({x:t.scrollLeft,y:t.scrollTop}),ei=()=>({T:{x:0,y:0},D:{x:0,y:0}}),ea=(t,e)=>{let{T:r,D:n}=t,{w:l,h:o}=e,i=(t,e,r)=>{let n=p(t)*r,l=p(e)*r;if(n===l){let r=d(t),o=d(e);l=r>o?0:l,n=r<o?0:n}return[(n=n===l?0:n)+0,l+0]},[a,c]=i(r.x,n.x,l),[s,u]=i(r.y,n.y,o);return{T:{x:a,y:s},D:{x:c,y:u}}},ec=t=>{var e,r,n,l;let{T:o,D:i}=t;return{x:(e=o.x,r=i.x,0===e&&e<=r),y:(n=o.y,l=i.y,0===n&&n<=l)}},es=(t,e)=>{let{T:r,D:n}=t,l=(t,e,r)=>th(0,1,(t-r)/(t-e)||0);return{x:l(r.x,n.x,e.x),y:l(r.y,n.y,e.y)}},eu=t=>{t&&t.focus&&t.focus({preventScroll:!0})},ed=(t,e)=>{z(_(e),t)},ep=t=>{let e=new Map,r=(t,r)=>{if(t){let n=e.get(t);ed(t=>{n&&n[t?"delete":"clear"](t)},r)}else e.forEach(t=>{t.clear()}),e.clear()},n=(t,l)=>{if(M(t)){let n=e.get(t)||new Set;return e.set(t,n),ed(t=>{C(t)&&n.add(t)},l),ta(r,t,l)}k(l)&&l&&r();let o=td(t),i=[];return z(o,e=>{let r=t[e];r&&P(i,n(e,r))}),ta(K,i)};return n(t||{}),[n,r,(t,r)=>{z(V(e.get(t)),t=>{r&&!j(r)?t.apply(0,r):t()})}]},ef=t=>JSON.stringify(t,(t,e)=>{if(C(e))throw 0;return e}),ey=(t,e)=>t?"".concat(e).split(".").reduce((t,e)=>t&&tu(t,e)?t[e]:void 0,t):void 0,eh={paddingAbsolute:!1,showNativeOverlaidScrollbars:!1,update:{elementEvents:[["img","load"]],debounce:[0,33],attributes:null,ignoreMutation:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:!1,dragScroll:!0,clickScroll:!1,pointers:["mouse","touch","pen"]}},ev=(t,e)=>{let r={};return z(N(td(e),td(t)),n=>{let l=t[n],o=e[n];if(R(l)&&R(o))tp(r[n]={},ev(l,o)),ty(r[n])&&delete r[n];else if(tu(e,n)&&o!==l){let t=!0;if(E(l)||E(o))try{ef(l)===ef(o)&&(t=!1)}catch(t){}t&&(r[n]=o)}}),r},eb=(t,e,r)=>n=>[ey(t,n),r||void 0!==ey(e,n)],em="data-overlayscrollbars",eg="os-environment",ew="".concat(eg,"-scrollbar-hidden"),ex="".concat(em,"-initialize"),eS="noClipping",eO="".concat(em,"-body"),eA="".concat(em,"-viewport"),eM="measuring",ek="scrollbarHidden",eC="".concat(em,"-padding"),eE="".concat(em,"-content"),eR="os-size-observer",eD="".concat(eR,"-appear"),eT="".concat(eR,"-listener"),eH="os-scrollbar",eI="".concat(eH,"-rtl"),ez="".concat(eH,"-horizontal"),eL="".concat(eH,"-vertical"),eN="".concat(eH,"-track"),eP="".concat(eH,"-handle"),eV="".concat(eH,"-visible"),e_="".concat(eH,"-cornerless"),ej="".concat(eH,"-interaction"),eF="".concat(eH,"-unusable"),eK="".concat(eH,"-auto-hide"),eG="".concat(eK,"-hidden"),eq="".concat(eH,"-wheel"),eB="".concat(eN,"-interactive"),eU="".concat(eP,"-interactive"),eW=()=>n,eX=()=>{let t=(t,e,r)=>{t_(document.body,t),t_(document.body,t);let n=t2(t),l=t1(t),o=t5(e);return r&&tV(t),{x:l.h-n.h+o.h,y:l.w-n.w+o.w}},e=".".concat(eg,"{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.").concat(eg," div{width:200%;height:200%;margin:10px 0}.").concat(ew,"{scrollbar-width:none!important}.").concat(ew,"::-webkit-scrollbar,.").concat(ew,"::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}"),r=tF('<div class="'.concat(eg,'"><div></div><style>').concat(e,"</style></div>"))[0],n=r.firstChild,l=r.lastChild,o=eW();o&&(l.nonce=o);let[c,,s]=ep(),[u,d]=i({o:t(r,n),i:tl},ta(t,r,n,!0)),[p]=d(),f=(t=>{let e=!1,r=tE(t,ew);try{e="none"===tX(t,"scrollbar-width")||"none"===tX(t,"display","::-webkit-scrollbar")}catch(t){}return r(),e})(r),y={x:0===p.x,y:0===p.y},h={elements:{host:null,padding:!f,viewport:t=>f&&tH(t)&&t,content:!1},scrollbars:{slot:!0},cancel:{nativeScrollbarsOverlaid:!1,body:null}},v=tp({},eh),b=ta(tp,{},v),m=ta(tp,{},h),g={k:p,M:y,R:f,V:!!x,L:ta(c,"r"),U:m,P:t=>tp(h,t)&&m(),N:b,q:t=>tp(v,t)&&b(),B:tp({},h),F:tp({},v)};if(tw(r,"style"),tV(r),et(a,"resize",()=>{s("r",[])}),C(a.matchMedia)&&!f&&(!y.x||!y.y)){let t=e=>{et(a.matchMedia("(resolution: ".concat(a.devicePixelRatio,"dppx)")),"change",()=>{e(),t(e)},{A:!0})};t(()=>{let[t,e]=u();tp(g.k,t),s("r",[e])})}return g},eY=()=>(l||(l=eX()),l),e$=(t,e)=>C(e)?e.apply(0,t):e,eJ=(t,e,r,n)=>e$(t,S(n)?r:n)||e.apply(0,t),eZ=(t,e,r,n)=>{let l=e$(t,S(n)?r:n);return!!l&&(H(l)?l:e.apply(0,t))},eQ=(t,e)=>{let{nativeScrollbarsOverlaid:r,body:n}=e||{},{M:l,R:o,U:i}=eY(),{nativeScrollbarsOverlaid:a,body:c}=i().cancel,s=S(n)?c:n,u=(l.x||l.y)&&(null!=r?r:a),d=t&&(O(s)?!o:s);return!!u||!!d},e0=new WeakMap,e1=(t,e)=>{e0.set(t,e)},e2=t=>{e0.delete(t)},e3=t=>e0.get(t),e5=(t,e,r)=>{let n=!1,l=!!r&&new WeakMap,o=o=>{l&&r&&z(r.map(e=>{let[r,n]=e||[];return[n&&r?(o||tR)(r,t):[],n]}),r=>z(r[0],o=>{let i=r[1],a=l.get(o)||[];if(t.contains(o)&&i){let t=et(o,i,r=>{n?(t(),l.delete(o)):e(r)});l.set(o,P(a,t))}else K(a),l.delete(o)}))};return o(),[()=>{n=!0},o]},e4=(t,e,r,n)=>{let l=!1,{j:o,X:i,Y:a,W:c,J:s,K:u}=n||{},d=ts(()=>l&&r(!0),{_:33,p:99}),[p,f]=e5(t,d,a),y=i||[],h=N(o||[],y),v=(l,o)=>{if(!j(o)){let i=s||ti,a=u||ti,d=[],p=[],h=!1,v=!1;if(z(o,r=>{let{attributeName:l,target:o,type:s,oldValue:u,addedNodes:f,removedNodes:b}=r,m="attributes"===s,g=t===o,w=m&&l,x=w&&tb(o,l||""),S=M(x)?x:null,O=w&&u!==S,A=L(y,l)&&O;if(e&&("childList"===s||!g)){let e=m&&O,s=e&&c&&tT(o,c),p=(s?!i(o,l,u,S):!m||e)&&!a(r,!!s,t,n);z(f,t=>P(d,t)),z(b,t=>P(d,t)),v=v||p}!e&&g&&O&&!i(o,l,u,S)&&(P(p,l),h=h||A)}),f(t=>F(d).reduce((e,r)=>(P(e,tR(t,r)),tT(r,t)?P(e,r):e),[])),e)return!l&&v&&r(!1),[!1];if(!j(p)||h){let t=[F(p),h];return l||r.apply(0,t),t}}},b=new m(ta(v,!1));return[()=>(b.observe(t,{attributes:!0,attributeOldValue:!0,attributeFilter:h,subtree:e,childList:e,characterData:e}),l=!0,()=>{l&&(p(),b.disconnect(),l=!1)}),()=>{if(l)return d.S(),v(!0,b.takeRecords())}]},e9={},e6={},e7=t=>{z(t,t=>z(t,(e,r)=>{e9[r]=t[r]}))},e8=(t,e,r)=>td(t).map(n=>{let{static:l,instance:o}=t[n],[i,a,c]=r||[],s=r?o:l;if(s){let t=r?s(i,a,e):s(e);return(c||e6)[n]=t}}),rt=t=>e6[t],re=(t,e)=>{let{M:r}=e,[n,l]=t("showNativeOverlaidScrollbars");return[n&&r.x&&r.y,l]},rr=t=>0===t.indexOf(Z),rn=(t,e)=>{let r=(t,e,r,n)=>{let l=t===Z?Q:t.replace("".concat(Z,"-"),""),o=rr(t),i=rr(r);if(!e&&!n)return Q;if(o&&i)return Z;if(o){let t=e?Z:Q;return e&&n?l:t}let a=i&&n?Z:Q;return e?l:a},n={x:r(e.x,t.x,e.y,t.y),y:r(e.y,t.y,e.x,t.x)};return{G:n,Z:{x:n.x===tt,y:n.y===tt}}},rl="__osScrollbarsHidingPlugin",ro=(t,e,r)=>{let{dt:n}=r||{},l=rt("__osSizeObserverPlugin"),[o]=i({o:!1,u:!0});return()=>{let r=[],i=tF('<div class="'.concat(eR,'"><div class="').concat(eT,'"></div></div>'))[0],a=i.firstChild,c=t=>{let r=t instanceof ResizeObserverEntry,n=!1,l=!1;if(r){let[e,,r]=o(t.contentRect),i=t6(e);n=!(l=t7(e,r))&&!i}else l=!0===t;n||e({ft:!0,dt:l})};if(w){let t=new w(t=>c(t.pop()));t.observe(a),P(r,()=>{t.disconnect()})}else{if(!l)return ti;let[t,e]=l(a,c,n);P(r,N([tE(i,eD),et(i,"animationstart",t)],e))}return ta(K,P(r,t_(t,i)))}},ri=(t,e)=>{let r;let n=t=>0===t.h||t.isIntersecting||t.intersectionRatio>0,l=tj("os-trinsic-observer"),[o]=i({o:!1}),a=(t,r)=>{if(t){let l=o(n(t)),[,i]=l;return i&&!r&&e(l)&&[l]}},c=(t,e)=>a(e.pop(),t);return[()=>{let e=[];if(g)(r=new g(ta(c,!1),{root:t})).observe(l),P(e,()=>{r.disconnect()});else{let t=()=>{a(t1(l))};P(e,ro(l,t)()),t()}return ta(K,P(e,t_(t,l)))},()=>r&&c(!0,r.takeRecords())]},ra=(t,e,r,n)=>{let l,o,a,c,s,u;let d="[".concat(em,"]"),p="[".concat(eA,"]"),f=["id","class","style","open","wrap","cols","rows"],{vt:y,ht:h,ot:v,gt:b,bt:m,nt:g,wt:x,yt:S,St:O}=t,M=t=>"rtl"===tX(t,"direction"),k={Ot:!1,ct:M(y)},R=eY(),D=rt(rl),[T]=i({i:tn,o:{w:0,h:0}},()=>{let n=D&&D.tt(t,e,k,R,r).ut,l=!(x&&g)&&tM(h,em,eS),o=!g&&S("arrange"),i=o&&eo(b),a=O(eM,l),c=o&&n&&n()[0],s=t3(v),u=t5(v);return c&&c(),el(b,i),l&&a(),{w:s.w+u.w,h:s.h+u.h}}),H=ts(n,{_:()=>l,p:()=>o,m(t,e){let[r]=t,[n]=e;return[N(td(r),td(n)).reduce((t,e)=>(t[e]=r[e]||n[e],t),{})]}}),I=t=>{let e=M(y);tp(t,{$t:u!==e}),tp(k,{ct:e}),u=e},z=(t,e)=>{let[r,l]=t,o={Ct:l};return tp(k,{Ot:r}),e||n(o),o},L=t=>{let{ft:e,dt:r}=t,l=!(e&&!r)&&R.R?H:n,o={ft:e||r,dt:r};I(o),l(o)},P=(t,e)=>{let[,r]=T(),l={xt:r};I(l);let o=t?n:H;return r&&!e&&o(l),l},V=(t,e,r)=>{let n={Ht:e};return I(n),e&&!r&&H(n),n},[_,j]=m?ri(h,z):[],F=!g&&ro(h,L,{dt:!0}),[K,G]=e4(h,!1,V,{X:f,j:f}),q=g&&w&&new w(t=>{let e=t[t.length-1].contentRect;L({ft:!0,dt:t7(e,s)}),s=e}),B=ts(()=>{let[,t]=T();n({xt:t})},{_:222,v:!0});return[()=>{q&&q.observe(h);let t=F&&F(),e=_&&_(),r=K(),n=R.L(t=>{t?H({Et:t}):B()});return()=>{q&&q.disconnect(),t&&t(),e&&e(),c&&c(),r(),n()}},t=>{let{zt:e,It:r,At:n}=t,i={},[s]=e("update.ignoreMutation"),[u,y]=e("update.attributes"),[h,b]=e("update.elementEvents"),[w,x]=e("update.debounce"),S=r||n,O=t=>C(s)&&s(t);if(b||y){a&&a(),c&&c();let[t,e]=e4(m||v,!0,P,{j:N(f,u||[]),Y:h,W:d,K:(t,e)=>{let{target:r,attributeName:n}=t;return!e&&!!n&&!g&&tP(r,d,p)||!!tL(r,".".concat(eH))||!!O(t)}});c=t(),a=e}if(x){if(H.S(),E(w)){let t=w[0],e=w[1];l=A(t)&&t,o=A(e)&&e}else l=!!A(w)&&w,o=!1}if(S){let t=G(),e=j&&j(),r=a&&a();t&&tp(i,V(t[0],t[1],S)),e&&tp(i,z(e[0],S)),r&&tp(i,P(r[0],S))}return I(i),i},k]},rc=(t,e,r,n)=>{let{U:l}=eY(),{scrollbars:o}=l(),{slot:i}=o,{vt:a,ht:c,ot:s,Tt:u,gt:d,wt:p,nt:f}=e,{scrollbars:y}=u?{}:t,{slot:h}=y||{},v=new Map,b=t=>x&&new x({source:d,axis:t}),m={x:b("x"),y:b("y")},g=eZ([a,c,s],()=>f&&p?a:c,i,h),w=(t,e)=>{if(e){let r=t?$:J,{Dt:n,kt:l}=e;return th(0,1,t4(l)[r]/t4(n)[r]||0)}let n=t?"x":"y",{Mt:l,Rt:o}=r,i=o[n];return th(0,1,i/(i+l[n])||0)},S=(t,e,r)=>{let n=w(r,t);return 1/n*(1-n)*e},O=t=>tp(t,{clear:["left"]}),A=t=>{v.forEach((e,r)=>{(!t||L(_(t),r))&&(z(e||[],t=>{t&&t.cancel()}),v.delete(r))})},M=(t,e,r,n)=>{let l=v.get(t)||[],o=l.find(t=>t&&t.timeline===e);o?o.effect=new KeyframeEffect(t,r,{composite:n}):v.set(t,N(l,[t.animate(r,{timeline:e,composite:n})]))},C=(t,e,r)=>{let n=r?tE:tC;z(t,t=>{n(t.Vt,e)})},E=(t,e)=>{z(t,t=>{let[r,n]=e(t);tW(r,n)})},R=(t,e)=>{E(t,t=>{let{kt:r}=t;return[r,{[e?$:J]:tB(w(e))}]})},D=(t,e)=>{let{Lt:n}=r,l=e?"x":"y",o=m[l],i=ec(n)[l],a=(t,r)=>t$(tB(S(t,i?r:1-r,e)),e);o?z(t,t=>{let{kt:e}=t;M(e,o,O({transform:[0,1].map(e=>a(t,e))}))}):E(t,t=>[t.kt,{transform:a(t,es(n,eo(d))[l])}])},T=t=>f&&!p&&tz(t)===s,H=[],I=[],V=[],j=(t,e,r)=>{let n=k(r),l=!n||r,o=!n||!r;l&&C(I,t,e),o&&C(V,t,e)},F=t=>{let e=tj("".concat(eH," ").concat(t?ez:eL)),r=tj(eN),l=tj(eP),o={Vt:e,Dt:r,kt:l};return P(t?I:V,o),P(H,[t_(e,r),t_(r,l),ta(tV,e),A,n(o,j,D,t)]),o},G=ta(F,!0),q=ta(F,!1);return G(),q(),[{Ut:()=>{R(I,!0),R(V)},Pt:()=>{D(I,!0),D(V)},Nt:()=>{if(f){let{Mt:t,Lt:e}=r,n=ec(e);if(m.x&&m.y)z(N(V,I),e=>{let{Vt:r}=e;if(T(r)){let e=e=>M(r,m[e],O({transform:[0,n[e]?1:-1].map(r=>t$(tU(r*(t[e]-.5)),"x"===e))}),"add");e("x"),e("y")}else A(r)});else{let r=es(e,eo(d)),l=e=>{let{Vt:l}=e,o=T(l)&&l,i=(t,e,r)=>{let n=e*t;return tU(r?n:-n)};return[o,o&&{transform:t$({x:i(r.x,t.x,n.x),y:i(r.y,t.y,n.y)})}]};E(I,l),E(V,l)}}},qt:j,Bt:{V:m.x,Ft:I,jt:G,Xt:ta(E,I)},Yt:{V:m.y,Ft:V,jt:q,Xt:ta(E,V)}},()=>(t_(g,I[0].Vt),t_(g,V[0].Vt),ta(K,H))]},rs=(t,e,r,n)=>(l,o,i,a)=>{let{ht:c,ot:s,nt:p,gt:f,Wt:y,St:v}=e,{Vt:b,Dt:m,kt:g}=l,[w,x]=tc(333),[S,O]=tc(444),A=ta(i,[l],a),M=t=>{C(f.scrollBy)&&f.scrollBy({behavior:"smooth",left:t.x,top:t.y})},k=a?$:J,E=!0,R=(t,e)=>{let[r,n]=tc(),l=e=>e.target===t;return ta(K,[n,et(t,"transitionstart",t=>{if(l(t)&&(!e||e(t))){let t=()=>{A(),r(t)};t()}}),et(t,"transitionend transitioncancel",t=>{l(t)&&(n(),A())})])};return ta(K,[et(g,"pointermove pointerleave",n),et(b,"pointerenter",()=>{o(ej,!0)}),et(b,"pointerleave pointercancel",()=>{o(ej,!1)}),!p&&et(b,"mousedown",()=>{let t=tN();(tm(t,eA)||tm(t,em)||t===document.body)&&h(ta(eu,s),25)}),et(b,"wheel",t=>{let{deltaX:e,deltaY:r,deltaMode:n}=t;E&&0===n&&tz(b)===c&&M({x:e,y:r}),E=!1,o(eq,!0),w(()=>{E=!0,o(eq)}),er(t)},{H:!1,I:!0}),R(g,t=>t.propertyName.indexOf(k)>-1),R(b,t=>!["opacity","visibility"].includes(t.propertyName)),et(b,"pointerdown",ta(et,y,"click",en,{A:!0,I:!0,H:!1}),{I:!0}),(()=>{let e="pointerup pointercancel lostpointercapture",n="client".concat(a?"X":"Y"),l=a?"left":"top",o=a?"w":"h",i=a?"x":"y",c=(t,e)=>n=>{let{Mt:l}=r,a=e*n/(t1(m)[o]-t1(g)[o])*l[i];el(f,{[i]:t+a})};return et(m,"pointerdown",r=>{let a=tL(r.target,".".concat(eP))===g,s=a?g:m,p=t.scrollbars,{button:h,isPrimary:b,pointerType:w}=r,{pointers:x}=p;if(0===h&&b&&p[a?"dragScroll":"clickScroll"]&&(x||[]).includes(w)){O();let t=!a&&r.shiftKey,p=ta(t4,g),h=ta(t4,m),b=(t,e)=>(t||p())[l]-(e||h())[l],w=u(t4(f)[k])/t1(f)[o]||1,x=c(eo(f)[i],1/w),A=r[n],C=p(),E=h(),R=C[k],D=b(C,E)+R/2,T=A-E[l],H=a?0:T-D,I=t=>{K(N),s.releasePointerCapture(t.pointerId)},z=()=>v("scrollbarPressed",!0),L=z(),N=[()=>{let t=eo(f);L();let e=eo(f),r={x:e.x-t.x,y:e.y-t.y};(d(r.x)>3||d(r.y)>3)&&(z(),el(f,t),M(r),S(L))},et(y,e,I),et(y,"selectstart",t=>er(t),{H:!1}),et(m,e,I),et(m,"pointermove",e=>{let r=e[n]-A;(a||t)&&x(H+r)})];if(s.setPointerCapture(r.pointerId),t)x(H);else if(!a){let t=rt("__osClickScrollPlugin");t&&P(N,t(x,b,H,R,T))}}})})(),x,O])},ru=(t,e,r,n,l,o)=>{let i,a,c,s,u;let d=ti,p=0,f=t=>"mouse"===t.pointerType,[y,h]=tc(),[v,b]=tc(100),[m,g]=tc(100),[w,x]=tc(()=>p),[S,O]=rc(t,l,n,rs(e,l,n,t=>f(t)&&H())),{ht:A,Jt:M,wt:k}=l,{qt:C,Ut:E,Pt:R,Nt:D}=S,T=(t,e)=>{if(x(),t)C(eG);else{let t=ta(C,eG,!0);p>0&&!e?w(t):t()}},H=()=>{(c?i:s)||(T(!0),v(()=>{T(!1)}))},I=t=>{C(eK,t,!0),C(eK,t,!1)},z=t=>{f(t)&&(i=c,c&&T(!0))},L=[x,b,g,h,()=>d(),et(A,"pointerover",z,{A:!0}),et(A,"pointerenter",z),et(A,"pointerleave",t=>{f(t)&&(i=!1,c&&T(!1))}),et(A,"pointermove",t=>{f(t)&&a&&H()}),et(M,"scroll",t=>{y(()=>{R(),H()}),o(t),D()})];return[()=>ta(K,P(L,O())),t=>{let{zt:e,At:l,Kt:o,Gt:i}=t,{Qt:f,Zt:y,tn:h,nn:v}=i||{},{$t:b,dt:g}=o||{},{ct:w}=r,{M:x}=eY(),{G:S,sn:O}=n,[A,H]=e("showNativeOverlaidScrollbars"),[z,L]=e("scrollbars.theme"),[N,P]=e("scrollbars.visibility"),[V,_]=e("scrollbars.autoHide"),[j,F]=e("scrollbars.autoHideSuspend"),[K]=e("scrollbars.autoHideDelay"),[G,q]=e("scrollbars.dragScroll"),[B,U]=e("scrollbars.clickScroll"),[W,X]=e("overflow"),Y=O.x||O.y,$=A&&x.x&&x.y,J=(t,e,r)=>{let n=t.includes(tt)&&(N===Z||"auto"===N&&e===tt);return C(eV,n,r),n};if(p=K,g&&!l&&(j&&Y?(I(!1),d(),m(()=>{d=et(M,"scroll",ta(I,!0),{A:!0})})):I(!0)),H&&C("os-theme-none",$),L&&(C(u),C(z,!0),u=z),F&&!j&&I(!0),_&&(a="move"===V,c="leave"===V,T(s="never"===V,!0)),q&&C(eU,G),U&&C(eB,B),h||P||X){let t=J(W.x,S.x,!0),e=J(W.y,S.y,!1);C(e_,!(t&&e))}(f||y||v||b||l)&&(E(),R(),D(),C(eF,!O.x,!0),C(eF,!O.y,!1),C(eI,w&&!k))},{},S]},rd=t=>{let{U:e,R:r}=eY(),{elements:n}=e(),{padding:l,viewport:o,content:i}=n,c=H(t),s=c?{}:t,{elements:u}=s,{padding:d,viewport:p,content:f}=u||{},y=c?t:s.target,h=tH(y),v=y.ownerDocument,b=v.documentElement,m=()=>v.defaultView||a,g=ta(eJ,[y]),w=ta(eZ,[y]),x=ta(tj,""),S=ta(g,x,o),O=ta(w,x,i),A=S(p),M=A===y,k=M&&h,C=!M&&O(f),E=k?b:A,R=k?E:y,D=!M&&w(x,l,d),T=!(!M&&A===C)&&C,I=[T,E,D,R].map(t=>H(t)&&!tz(t)&&t),z=t=>t&&L(I,t),N=z(E)?y:E,V={vt:y,ht:R,ot:E,en:D,bt:T,gt:k?b:E,Jt:k?v:E,cn:h?b:N,Wt:v,wt:h,Tt:c,nt:M,rn:m,yt:t=>tM(E,eA,t),St:(t,e)=>tA(E,eA,t,e)},{vt:_,ht:j,en:F,ot:G,bt:q}=V,B=[()=>{tw(j,[em,ex]),tw(_,ex),h&&tw(b,[ex,em])}],U=tI([q,G,F,j,_].find(t=>t&&!z(t))),W=k?_:q||G,X=ta(K,B);return[V,()=>{let t=m(),e=tN(),n=t=>{t_(tz(t),tI(t)),tV(t)},l=t=>et(t,"focusin focusout focus blur",en,{I:!0,H:!1}),o="tabindex",i=tb(G,o),a=l(e);return tg(j,em,M?"":"host"),tg(F,eC,""),tg(G,eA,""),tg(q,eE,""),!M&&(tg(G,o,i||"-1"),h&&tg(b,eO,"")),t_(W,U),t_(j,F),t_(F||j,!M&&G),t_(G,q),P(B,[a,()=>{let t=tN(),e=z(G),r=e&&t===G?_:t,a=l(r);tw(F,eC),tw(q,eE),tw(G,eA),h&&tw(b,eO),i?tg(G,o,i):tw(G,o),z(q)&&n(q),e&&n(G),z(F)&&n(F),eu(r),a()}]),r&&!M&&(tO(G,eA,ek),P(B,ta(tw,G,eA))),eu(!M&&h&&e===_&&t.top===t?G:e),a(),U=0,X},X]},rp=t=>{let{bt:e}=t;return t=>{let{Kt:r,ln:n,At:l}=t,{Ct:o}=r||{},{Ot:i}=n;e&&(o||l)&&tW(e,{[J]:i&&"100%"})}},rf=(t,e)=>{let{ht:r,en:n,ot:l,nt:o}=t,[a,c]=i({i:to,o:tY()},ta(tY,r,"padding",""));return t=>{let{zt:r,Kt:i,ln:s,At:u}=t,[d,p]=c(u),{R:f}=eY(),{ft:y,xt:h,$t:v}=i||{},{ct:b}=s,[m,g]=r("paddingAbsolute"),w=u||h;(y||p||w)&&([d,p]=a(u));let x=!o&&(g||v||p);if(x){let t=!m||!n&&!f,r=d.r+d.l,o=d.t+d.b,i={[X]:t&&!b?-r:0,[Y]:t?-o:0,[W]:t&&b?-r:0,top:t?-d.t:0,right:t?b?-d.r:"auto":0,left:t?b?"auto":-d.l:0,[$]:t&&"calc(100% + ".concat(r,"px)")},a={[G]:t?d.t:0,[q]:t?d.r:0,[U]:t?d.b:0,[B]:t?d.l:0};tW(n||l,i),tW(l,a),tp(e,{en:d,an:!t,rt:n?a:tp({},i,a)})}return{un:x}}},ry=(t,e)=>{let r=eY(),{ht:n,en:l,ot:o,nt:s,Jt:u,gt:d,wt:p,St:f,rn:h}=t,{R:v}=r,b=p&&s,m=ta(c,0),g=["display","direction","flexDirection","writingMode"],w={i:tn,o:{w:0,h:0}},x={i:tl,o:{}},S=t=>{f(eM,!b&&t)},O=(t,e)=>{let r=a.devicePixelRatio%1!=0?1:0,n={w:m(t.w-e.w),h:m(t.h-e.h)};return{w:n.w>r?n.w:0,h:n.h>r?n.h:0}},[A,M]=i(w,ta(t5,o)),[k,C]=i(w,ta(t3,o)),[E,R]=i(w),[D]=i(x),[T,H]=i(w),[I]=i(x),[z]=i({i:(t,e)=>tr(t,e,g),o:{}},()=>t9(o)?tX(o,g):{}),[L,N]=i({i:(t,e)=>tl(t.T,e.T)&&tl(t.D,e.D),o:ei()},()=>{S(!0);let t=eo(d),e=f("noContent",!0),r=et(u,tt,e=>{let r=eo(d);e.isTrusted&&r.x===t.x&&r.y===t.y&&ee(e)},{I:!0,A:!0});el(d,{x:0,y:0}),e();let n=eo(d),l=t3(d);el(d,{x:l.w,y:l.h});let o=eo(d);el(d,{x:o.x-n.x<1&&-l.w,y:o.y-n.y<1&&-l.h});let i=eo(d);return el(d,t),y(()=>r()),{T:n,D:i}}),P=rt(rl),V=(t,e)=>"".concat(e?"overflowX":"overflowY").concat(te(t)),_=t=>{let e=t=>[Z,Q,tt].map(e=>V(e,t));f(e(!0).concat(e()).join(" ")),f(td(t).map(e=>V(t[e],"x"===e)).join(" "),!0)};return(i,a)=>{let{zt:c,Kt:s,ln:u,At:d}=i,{un:p}=a,{ft:y,xt:g,$t:w,dt:x,Et:V}=s||{},{it:j,ut:F,_t:K}=P&&P.tt(t,e,u,r,c)||{},[G,q]=re(c,r),[B,U]=c("overflow"),W=rr(B.x),X=rr(B.y),Y=M(d),$=C(d),J=R(d),Z=H(d);q&&v&&f(ek,!G);{tM(n,em,eS)&&S(!0);let[t]=F?F():[],[e]=Y=A(d),[r]=$=k(d),l=t2(o),i=b&&t0(h()),a={w:m(r.w+e.w),h:m(r.h+e.h)},c={w:m((i?i.w:l.w+m(l.w-r.w))+e.w),h:m((i?i.h:l.h+m(l.h-r.h))+e.h)};t&&t(),Z=T(c),J=E(O(a,c),d)}let[Q,tt]=Z,[te,tr]=J,[tn,tl]=$,[to,ti]=Y,[ta,tc]=D({x:te.w>0,y:te.h>0}),ts=W&&X&&(ta.x||ta.y)||W&&ta.x&&!ta.y||X&&ta.y&&!ta.x,tu=rn(ta,B),[td,tf]=I(tu.G),[,ty]=z(d),th=w||x||ty||tc||d,[tv,tb]=th?L(d):N();return tf&&_(tu.G),K&&j&&tW(o,K(tu,u,j(tu,tn,to))),S(!1),tA(n,em,eS,ts),tA(l,eC,eS,ts),tp(e,{G:td,Rt:{x:Q.w,y:Q.h},Mt:{x:te.w,y:te.h},sn:ta,Lt:ea(tv,te)}),{tn:tf,Qt:tt,Zt:tr,nn:tb||tr,_n:th}}},rh=t=>{let[e,r,n]=rd(t),l={en:{t:0,r:0,b:0,l:0},an:!1,rt:{[X]:0,[Y]:0,[W]:0,[G]:0,[q]:0,[U]:0,[B]:0},Rt:{x:0,y:0},Mt:{x:0,y:0},G:{x:Q,y:Q},sn:{x:!1,y:!1},Lt:ei()},{vt:o,gt:i,nt:a}=e,{R:c,M:s}=eY(),u=!c&&(s.x||s.y),d=[rp(e),rf(e,l),ry(e,l)];return[r,t=>{let e={},r=u&&eo(i);return z(d,r=>{tp(e,r(t,e)||{})}),el(i,r),a||el(o,0),e},l,e,n]},rv=(t,e,r,n,l)=>{let o=!1,i=eb(e,{}),[a,c,s,u,d]=rh(t),[p,f,y]=ra(u,s,i,t=>{g({},t)}),[h,v,,b]=ru(t,e,y,s,u,l),m=t=>td(t).some(e=>!!t[e]),g=(t,l)=>{let{dn:i,At:a,It:s,fn:d}=t,p=i||{},h=!!a||!o,b={zt:eb(e,p,h),dn:p,At:h};if(r()||!t9(u.ht))return!1;if(d)return v(b),!1;let g=l||f(tp({},b,{It:s})),w=c(tp({},b,{ln:y,Kt:g}));v(tp({},b,{Kt:g,Gt:w}));let x=m(g),S=m(w),O=x||S||!ty(p)||h;return O&&n(t,{Kt:g,Gt:w}),o=!0,O};return[()=>{let{cn:t,gt:e}=u,r=eo(t),n=[p(),a(),h()];return el(e,r),ta(K,n)},g,()=>({pn:y,vn:s}),{hn:u,gn:b},d]},rb=(t,e,r)=>{let{N:n}=eY(),l=H(t),o=l?t:t.target,i=e3(o);if(e&&!i){let i=!1,a=[],c={},s=t=>{let e=tf(t,!0),r=rt("__osOptionsValidationPlugin");return r?r(e,!0):e},u=tp({},n(),s(e)),[d,p,f]=ep(),[y,h,v]=ep(r),b=(t,e)=>{v(t,e),f(t,e)},[m,g,w,x,S]=rv(t,u,()=>i,(t,e)=>{let{dn:r,At:n}=t,{Kt:l,Gt:o}=e,{ft:i,$t:a,Ct:c,xt:s,Ht:u,dt:d}=l,{Qt:p,Zt:f,tn:y,nn:h}=o;b("updated",[A,{updateHints:{sizeChanged:!!i,directionChanged:!!a,heightIntrinsicChanged:!!c,overflowEdgeChanged:!!p,overflowAmountChanged:!!f,overflowStyleChanged:!!y,scrollCoordinatesChanged:!!h,contentMutation:!!s,hostMutation:!!u,appear:!!d},changedOptions:r||{},force:!!n}])},t=>b("scroll",[A,t])),O=t=>{e2(o),K(a),i=!0,b("destroyed",[A,t]),p(),h()},A={options(t,e){if(t){let r=ev(u,tp(e?n():{},s(t)));ty(r)||(tp(u,r),g({dn:r}))}return tp({},u)},on:y,off:(t,e)=>{t&&e&&h(t,e)},state(){let{pn:t,vn:e}=w(),{ct:r}=t,{Rt:n,Mt:l,G:o,sn:a,en:c,an:s,Lt:u}=e;return tp({},{overflowEdge:n,overflowAmount:l,overflowStyle:o,hasOverflow:a,scrollCoordinates:{start:u.T,end:u.D},padding:c,paddingAbsolute:s,directionRTL:r,destroyed:i})},elements(){let{vt:t,ht:e,en:r,ot:n,bt:l,gt:o,Jt:i}=x.hn,{Bt:a,Yt:c}=x.gn,s=t=>{let{kt:e,Dt:r,Vt:n}=t;return{scrollbar:n,track:r,handle:e}},u=t=>{let{Ft:e,jt:r}=t;return tp({},s(e[0]),{clone:()=>{let t=s(r());return g({fn:!0}),t}})};return tp({},{target:t,host:e,padding:r||n,viewport:n,content:l||n,scrollOffsetElement:o,scrollEventElement:i,scrollbarHorizontal:u(a),scrollbarVertical:u(c)})},update:t=>g({At:t,It:!0}),destroy:ta(O,!1),plugin:t=>c[td(t)[0]]};return(P(a,[S]),e1(o,A),e8(e9,rb,[A,d,c]),eQ(x.hn.wt,!l&&t.cancel))?O(!0):(P(a,m()),b("initialized",[A]),A.update(!0)),A}return i};rb.plugin=t=>{let e=E(t),r=e?t:[t],n=r.map(t=>e8(t,rb)[0]);return e7(r),e?n:n[0]},rb.valid=t=>{let e=t&&t.elements,r=C(e)&&e();return T(r)&&!!e3(r.target)},rb.env=()=>{let{k:t,M:e,R:r,V:n,B:l,F:o,U:i,P:a,N:c,q:s}=eY();return tp({},{scrollbarsSize:t,scrollbarsOverlaid:e,scrollbarsHiding:r,scrollTimeline:n,staticDefaultInitialization:l,staticDefaultOptions:o,getDefaultInitialization:i,setDefaultInitialization:a,getDefaultOptions:c,setDefaultOptions:s})},rb.nonce=t=>{n=t};let rm=()=>{let t,e;let r=window,n="function"==typeof r.requestIdleCallback,l=r.requestAnimationFrame,o=r.cancelAnimationFrame,i=n?r.requestIdleCallback:l,a=n?r.cancelIdleCallback:o,c=()=>{a(t),o(e)};return[(r,o)=>{c(),t=i(n?()=>{c(),e=l(r)}:r,"object"==typeof o?o:{timeout:2233})},c]},rg=t=>{let{options:e,events:r,defer:n}=t||{},[l,i]=(0,o.useMemo)(rm,[]),a=(0,o.useRef)(null),c=(0,o.useRef)(n),s=(0,o.useRef)(e),u=(0,o.useRef)(r);return(0,o.useEffect)(()=>{c.current=n},[n]),(0,o.useEffect)(()=>{let{current:t}=a;s.current=e,rb.valid(t)&&t.options(e||{},!0)},[e]),(0,o.useEffect)(()=>{let{current:t}=a;u.current=r,rb.valid(t)&&t.on(r||{},!0)},[r]),(0,o.useEffect)(()=>()=>{var t;i(),null==(t=a.current)||t.destroy()},[]),(0,o.useMemo)(()=>[t=>{let e=a.current;if(rb.valid(e))return;let r=c.current,n=s.current||{},o=u.current||{},i=()=>a.current=rb(t,n,o);r?l(i,r):i()},()=>a.current],[])},rw=(0,o.forwardRef)((t,e)=>{let{element:r="div",options:n,events:l,defer:i,children:a,...c}=t,s=(0,o.useRef)(null),u=(0,o.useRef)(null),[d,p]=rg({options:n,events:l,defer:i});return(0,o.useEffect)(()=>{let{current:t}=s,{current:e}=u;if(t)return d("body"===r?{target:t,cancel:{body:null}}:{target:t,elements:{viewport:e,content:e}}),()=>{var t;return null==(t=p())?void 0:t.destroy()}},[d,r]),(0,o.useImperativeHandle)(e,()=>({osInstance:p,getElement:()=>s.current}),[]),o.createElement(r,{"data-overlayscrollbars-initialize":"",ref:s,...c},"body"===r?a:o.createElement("div",{"data-overlayscrollbars-contents":"",ref:u},a))})}}]);