(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const r of c.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(s){if(s.ep)return;s.ep=!0;const c=n(s);fetch(s.href,c)}})();/*!
 * OverlayScrollbars
 * Version: 2.9.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */const ut=(t,e)=>{const{o:n,i:o,u:s}=t;let c=n,r;const i=(a,u)=>{const b=c,E=a,y=u||(o?!o(b,E):b!==E);return(y||s)&&(c=E,r=b),[c,y,r]};return[e?a=>i(e(c,r),a):i,a=>[c,!!a,r]]},Xo=typeof window<"u"&&typeof HTMLElement<"u"&&!!window.document,it=Xo?window:{},no=Math.max,Yo=Math.min,je=Math.round,Ce=Math.abs,Rn=Math.sign,oo=it.cancelAnimationFrame,gn=it.requestAnimationFrame,Ee=it.setTimeout,Ue=it.clearTimeout,Le=t=>typeof it[t]<"u"?it[t]:void 0,Jo=Le("MutationObserver"),kn=Le("IntersectionObserver"),Ae=Le("ResizeObserver"),Ke=Le("ScrollTimeline"),vn=t=>t===void 0,hn=t=>t===null,xt=t=>typeof t=="number",re=t=>typeof t=="string",so=t=>typeof t=="boolean",gt=t=>typeof t=="function",Ot=t=>Array.isArray(t),$e=t=>typeof t=="object"&&!Ot(t)&&!hn(t),bn=t=>{const e=!!t&&t.length,n=xt(e)&&e>-1&&e%1==0;return Ot(t)||!gt(t)&&n?e>0&&$e(t)?e-1 in t:!0:!1},Te=t=>!!t&&t.constructor===Object,He=t=>t instanceof HTMLElement,De=t=>t instanceof Element;function Y(t,e){if(bn(t))for(let n=0;n<t.length&&e(t[n],n,t)!==!1;n++);else t&&Y(Object.keys(t),n=>e(t[n],n,t));return t}const Sn=(t,e)=>t.indexOf(e)>=0,Nt=(t,e)=>t.concat(e),ot=(t,e,n)=>(!re(e)&&bn(e)?Array.prototype.push.apply(t,e):t.push(e),t),zt=t=>Array.from(t||[]),ze=t=>Ot(t)?t:!re(t)&&bn(t)?zt(t):[t],We=t=>!!t&&!t.length,Ge=t=>zt(new Set(t)),pt=(t,e,n)=>{Y(t,s=>s&&s.apply(void 0,e||[])),!n&&(t.length=0)},co="paddingTop",ro="paddingRight",lo="paddingLeft",io="paddingBottom",ao="marginLeft",uo="marginRight",fo="marginBottom",Zo="overflowX",Qo="overflowY",Ut="width",Kt="height",Lt="visible",kt="hidden",Wt="scroll",ts=t=>{const e=String(t||"");return e?e[0].toUpperCase()+e.slice(1):""},Re=(t,e,n,o)=>{if(t&&e){let s=!0;return Y(n,c=>{const r=t[c],i=e[c];r!==i&&(s=!1)}),s}return!1},po=(t,e)=>Re(t,e,["w","h"]),we=(t,e)=>Re(t,e,["x","y"]),es=(t,e)=>Re(t,e,["t","r","b","l"]),Bt=()=>{},M=(t,...e)=>t.bind(0,...e),It=t=>{let e;const n=t?Ee:gn,o=t?Ue:oo;return[s=>{o(e),e=n(()=>s(),gt(t)?t():t)},()=>o(e)]},Xe=(t,e)=>{const{_:n,p:o,v:s,m:c}=e||{};let r,i,l,d,a=Bt;const u=function(A){a(),Ue(r),d=r=i=void 0,a=Bt,t.apply(this,A)},b=x=>c&&i?c(i,x):x,E=()=>{a!==Bt&&u(b(l)||l)},y=function(){const A=zt(arguments),D=gt(n)?n():n;if(xt(D)&&D>=0){const Z=gt(o)?o():o,C=xt(Z)&&Z>=0,I=D>0?Ee:gn,L=D>0?Ue:oo,q=b(A)||A,T=u.bind(0,q);let h;a(),s&&!d?(T(),d=!0,h=I(()=>d=void 0,D)):(h=I(T,D),C&&!r&&(r=Ee(E,Z))),a=()=>L(h),i=l=q}else u(A)};return y.S=E,y},yo=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),Ct=t=>t?Object.keys(t):[],G=(t,e,n,o,s,c,r)=>{const i=[e,n,o,s,c,r];return(typeof t!="object"||hn(t))&&!gt(t)&&(t={}),Y(i,l=>{Y(l,(d,a)=>{const u=l[a];if(t===u)return!0;const b=Ot(u);if(u&&Te(u)){const E=t[a];let y=E;b&&!Ot(E)?y=[]:!b&&!Te(E)&&(y={}),t[a]=G(y,u)}else t[a]=b?u.slice():u})}),t},mo=(t,e)=>Y(G({},t),(n,o,s)=>{n===void 0?delete s[o]:n&&Te(n)&&(s[o]=mo(n))}),wn=t=>!Ct(t).length,Ye=(t,e,n)=>no(t,Yo(e,n)),_t=t=>Ge((Ot(t)?t:(t||"").split(" ")).filter(e=>e)),xn=(t,e)=>t&&t.getAttribute(e),In=(t,e)=>t&&t.hasAttribute(e),At=(t,e,n)=>{Y(_t(e),o=>{t&&t.setAttribute(o,String(n||""))})},St=(t,e)=>{Y(_t(e),n=>t&&t.removeAttribute(n))},ke=(t,e)=>{const n=_t(xn(t,e)),o=M(At,t,e),s=(c,r)=>{const i=new Set(n);return Y(_t(c),l=>{i[r](l)}),zt(i).join(" ")};return{O:c=>o(s(c,"delete")),$:c=>o(s(c,"add")),C:c=>{const r=_t(c);return r.reduce((i,l)=>i&&n.includes(l),r.length>0)}}},go=(t,e,n)=>(ke(t,e).O(n),M(On,t,e,n)),On=(t,e,n)=>(ke(t,e).$(n),M(go,t,e,n)),Je=(t,e,n,o)=>(o?On:go)(t,e,n),Cn=(t,e,n)=>ke(t,e).C(n),vo=t=>ke(t,"class"),ho=(t,e)=>{vo(t).O(e)},En=(t,e)=>(vo(t).$(e),M(ho,t,e)),bo=(t,e)=>{const n=e?De(e)&&e:document;return n?zt(n.querySelectorAll(t)):[]},ns=(t,e)=>{const n=e?De(e)&&e:document;return n&&n.querySelector(t)},Ze=(t,e)=>De(t)&&t.matches(e),So=t=>Ze(t,"body"),Qe=t=>t?zt(t.childNodes):[],ne=t=>t&&t.parentElement,Vt=(t,e)=>De(t)&&t.closest(e),tn=t=>document.activeElement,os=(t,e,n)=>{const o=Vt(t,e),s=t&&ns(n,o),c=Vt(s,e)===o;return o&&s?o===t||s===t||c&&Vt(Vt(t,n),e)!==o:!1},Gt=t=>{Y(ze(t),e=>{const n=ne(e);e&&n&&n.removeChild(e)})},dt=(t,e)=>M(Gt,t&&e&&Y(ze(e),n=>{n&&t.appendChild(n)})),jt=t=>{const e=document.createElement("div");return At(e,"class",t),e},wo=t=>{const e=jt();return e.innerHTML=t.trim(),Y(Qe(e),n=>Gt(n))},Pn=(t,e)=>t.getPropertyValue(e)||t[e]||"",An=t=>{const e=t||0;return isFinite(e)?e:0},ve=t=>An(parseFloat(t||"")),Bn=t=>`${(An(t)*100).toFixed(3)}%`,en=t=>`${An(t)}px`;function oe(t,e){t&&e&&Y(e,(n,o)=>{try{const s=t.style,c=xt(n)?en(n):(n||"")+"";o.indexOf("--")===0?s.setProperty(o,c):s[o]=c}catch{}})}function Ft(t,e,n){const o=re(e);let s=o?"":{};if(t){const c=it.getComputedStyle(t,n)||t.style;s=o?Pn(c,e):zt(e).reduce((r,i)=>(r[i]=Pn(c,i),r),s)}return s}const _n=(t,e,n)=>{const o=e?`${e}-`:"",s=n?`-${n}`:"",c=`${o}top${s}`,r=`${o}right${s}`,i=`${o}bottom${s}`,l=`${o}left${s}`,d=Ft(t,[c,r,i,l]);return{t:ve(d[c]),r:ve(d[r]),b:ve(d[i]),l:ve(d[l])}},Fe=(t,e)=>`translate${$e(t)?`(${t.x},${t.y})`:`${e?"X":"Y"}(${t})`}`,ss=t=>!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length),cs={w:0,h:0},Ie=(t,e)=>e?{w:e[`${t}Width`],h:e[`${t}Height`]}:cs,rs=t=>Ie("inner",t||it),Qt=M(Ie,"offset"),xo=M(Ie,"client"),nn=M(Ie,"scroll"),$n=t=>{const e=parseFloat(Ft(t,Ut))||0,n=parseFloat(Ft(t,Kt))||0;return{w:e-je(e),h:n-je(n)}},te=t=>t.getBoundingClientRect(),Oo=t=>!!t&&ss(t),on=t=>!!(t&&(t[Kt]||t[Ut])),Co=(t,e)=>{const n=on(t);return!on(e)&&n},Nn=(t,e,n,o)=>{Y(_t(e),s=>{t&&t.removeEventListener(s,n,o)})},Q=(t,e,n,o)=>{var s;const c=(s=o&&o.H)!=null?s:!0,r=o&&o.I||!1,i=o&&o.A||!1,l={passive:c,capture:r};return M(pt,_t(e).map(d=>{const a=i?u=>{Nn(t,d,a,r),n&&n(u)}:n;return t&&t.addEventListener(d,a,l),M(Nn,t,d,a,r)}))},Eo=t=>t.stopPropagation(),sn=t=>t.preventDefault(),Ao=t=>Eo(t)||sn(t),wt=(t,e)=>{const{x:n,y:o}=xt(e)?{x:e,y:e}:e||{};xt(n)&&(t.scrollLeft=n),xt(o)&&(t.scrollTop=o)},ft=t=>({x:t.scrollLeft,y:t.scrollTop}),$o=()=>({T:{x:0,y:0},D:{x:0,y:0}}),ls=(t,e)=>{const{T:n,D:o}=t,{w:s,h:c}=e,r=(u,b,E)=>{let y=Rn(u)*E,x=Rn(b)*E;if(y===x){const A=Ce(u),D=Ce(b);x=A>D?0:x,y=A<D?0:y}return y=y===x?0:y,[y+0,x+0]},[i,l]=r(n.x,o.x,s),[d,a]=r(n.y,o.y,c);return{T:{x:i,y:d},D:{x:l,y:a}}},Fn=({T:t,D:e})=>{const n=(o,s)=>o===0&&o<=s;return{x:n(t.x,e.x),y:n(t.y,e.y)}},Vn=({T:t,D:e},n)=>{const o=(s,c,r)=>Ye(0,1,(s-r)/(s-c)||0);return{x:o(t.x,e.x,n.x),y:o(t.y,e.y,n.y)}},cn=t=>{t&&t.focus&&t.focus({preventScroll:!0})},qn=(t,e)=>{Y(ze(e),t)},rn=t=>{const e=new Map,n=(c,r)=>{if(c){const i=e.get(c);qn(l=>{i&&i[l?"delete":"clear"](l)},r)}else e.forEach(i=>{i.clear()}),e.clear()},o=(c,r)=>{if(re(c)){const d=e.get(c)||new Set;return e.set(c,d),qn(a=>{gt(a)&&d.add(a)},r),M(n,c,r)}so(r)&&r&&n();const i=Ct(c),l=[];return Y(i,d=>{const a=c[d];a&&ot(l,o(d,a))}),M(pt,l)},s=(c,r)=>{Y(zt(e.get(c)),i=>{r&&!We(r)?i.apply(0,r):i()})};return o(t||{}),[o,n,s]},jn=t=>JSON.stringify(t,(e,n)=>{if(gt(n))throw 0;return n}),Un=(t,e)=>t?`${e}`.split(".").reduce((n,o)=>n&&yo(n,o)?n[o]:void 0,t):void 0,is={paddingAbsolute:!1,showNativeOverlaidScrollbars:!1,update:{elementEvents:[["img","load"]],debounce:[0,33],attributes:null,ignoreMutation:null},overflow:{x:"scroll",y:"scroll"},scrollbars:{theme:"os-theme-dark",visibility:"auto",autoHide:"never",autoHideDelay:1300,autoHideSuspend:!1,dragScroll:!0,clickScroll:!1,pointers:["mouse","touch","pen"]}},To=(t,e)=>{const n={},o=Nt(Ct(e),Ct(t));return Y(o,s=>{const c=t[s],r=e[s];if($e(c)&&$e(r))G(n[s]={},To(c,r)),wn(n[s])&&delete n[s];else if(yo(e,s)&&r!==c){let i=!0;if(Ot(c)||Ot(r))try{jn(c)===jn(r)&&(i=!1)}catch{}i&&(n[s]=r)}}),n},Kn=(t,e,n)=>o=>[Un(t,o),n||Un(e,o)!==void 0],Xt="data-overlayscrollbars",xe="os-environment",he=`${xe}-scrollbar-hidden`,Ve=`${Xt}-initialize`,Oe="noClipping",Wn=`${Xt}-body`,Dt=Xt,as="host",Mt=`${Xt}-viewport`,us=Zo,ds=Qo,fs="arrange",Ho="measuring",Mo="scrollbarHidden",ps="scrollbarPressed",ys="noContent",ln=`${Xt}-padding`,Gn=`${Xt}-content`,Tn="os-size-observer",ms=`${Tn}-appear`,gs=`${Tn}-listener`,vs="os-trinsic-observer",hs="os-theme-none",yt="os-scrollbar",bs=`${yt}-rtl`,Ss=`${yt}-horizontal`,ws=`${yt}-vertical`,Lo=`${yt}-track`,Hn=`${yt}-handle`,xs=`${yt}-visible`,Os=`${yt}-cornerless`,Xn=`${yt}-interaction`,Yn=`${yt}-unusable`,an=`${yt}-auto-hide`,Jn=`${an}-hidden`,Zn=`${yt}-wheel`,Cs=`${Lo}-interactive`,Es=`${Hn}-interactive`;let Do;const As=()=>Do,$s=t=>{Do=t};let qe;const Ts=()=>{const t=(C,I,L)=>{dt(document.body,C),dt(document.body,C);const V=xo(C),q=Qt(C),T=$n(I);return L&&Gt(C),{x:q.h-V.h+T.h,y:q.w-V.w+T.w}},e=C=>{let I=!1;const L=En(C,he);try{I=Ft(C,"scrollbar-width")==="none"||Ft(C,"display","::-webkit-scrollbar")==="none"}catch{}return L(),I},n=`.${xe}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${xe} div{width:200%;height:200%;margin:10px 0}.${he}{scrollbar-width:none!important}.${he}::-webkit-scrollbar,.${he}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`,s=wo(`<div class="${xe}"><div></div><style>${n}</style></div>`)[0],c=s.firstChild,r=s.lastChild,i=As();i&&(r.nonce=i);const[l,,d]=rn(),[a,u]=ut({o:t(s,c),i:we},M(t,s,c,!0)),[b]=u(),E=e(s),y={x:b.x===0,y:b.y===0},x={elements:{host:null,padding:!E,viewport:C=>E&&So(C)&&C,content:!1},scrollbars:{slot:!0},cancel:{nativeScrollbarsOverlaid:!1,body:null}},A=G({},is),D=M(G,{},A),B=M(G,{},x),Z={k:b,M:y,R:E,V:!!Ke,L:M(l,"r"),U:B,P:C=>G(x,C)&&B(),N:D,q:C=>G(A,C)&&D(),B:G({},x),F:G({},A)};if(St(s,"style"),Gt(s),Q(it,"resize",()=>{d("r",[])}),gt(it.matchMedia)&&!E&&(!y.x||!y.y)){const C=I=>{const L=it.matchMedia(`(resolution: ${it.devicePixelRatio}dppx)`);Q(L,"change",()=>{I(),C(I)},{A:!0})};C(()=>{const[I,L]=a();G(Z.k,I),d("r",[L])})}return Z},Et=()=>(qe||(qe=Ts()),qe),zo=(t,e)=>gt(e)?e.apply(0,t):e,Hs=(t,e,n,o)=>{const s=vn(o)?n:o;return zo(t,s)||e.apply(0,t)},Ro=(t,e,n,o)=>{const s=vn(o)?n:o,c=zo(t,s);return!!c&&(He(c)?c:e.apply(0,t))},Ms=(t,e)=>{const{nativeScrollbarsOverlaid:n,body:o}=e||{},{M:s,R:c,U:r}=Et(),{nativeScrollbarsOverlaid:i,body:l}=r().cancel,d=n??i,a=vn(o)?l:o,u=(s.x||s.y)&&d,b=t&&(hn(a)?!c:a);return!!u||!!b},Mn=new WeakMap,Ls=(t,e)=>{Mn.set(t,e)},Ds=t=>{Mn.delete(t)},ko=t=>Mn.get(t),zs=(t,e,n)=>{let o=!1;const s=n?new WeakMap:!1,c=()=>{o=!0},r=i=>{if(s&&n){const l=n.map(d=>{const[a,u]=d||[];return[u&&a?(i||bo)(a,t):[],u]});Y(l,d=>Y(d[0],a=>{const u=d[1],b=s.get(a)||[];if(t.contains(a)&&u){const y=Q(a,u,x=>{o?(y(),s.delete(a)):e(x)});s.set(a,ot(b,y))}else pt(b),s.delete(a)}))}};return r(),[c,r]},Qn=(t,e,n,o)=>{let s=!1;const{j:c,X:r,Y:i,W:l,J:d,K:a}=o||{},u=Xe(()=>s&&n(!0),{_:33,p:99}),[b,E]=zs(t,u,i),y=c||[],x=r||[],A=Nt(y,x),D=(Z,C)=>{if(!We(C)){const I=d||Bt,L=a||Bt,V=[],q=[];let T=!1,h=!1;if(Y(C,p=>{const{attributeName:H,target:O,type:j,oldValue:P,addedNodes:N,removedNodes:F}=p,U=j==="attributes",tt=j==="childList",g=t===O,k=U&&H,_=k&&xn(O,H||""),$=re(_)?_:null,v=k&&P!==$,f=Sn(x,H)&&v;if(e&&(tt||!g)){const S=U&&v,m=S&&l&&Ze(O,l),z=(m?!I(O,H,P,$):!U||S)&&!L(p,!!m,t,o);Y(N,K=>ot(V,K)),Y(F,K=>ot(V,K)),h=h||z}!e&&g&&v&&!I(O,H,P,$)&&(ot(q,H),T=T||f)}),E(p=>Ge(V).reduce((H,O)=>(ot(H,bo(p,O)),Ze(O,p)?ot(H,O):H),[])),e)return!Z&&h&&n(!1),[!1];if(!We(q)||T){const p=[Ge(q),T];return!Z&&n.apply(0,p),p}}},B=new Jo(M(D,!1));return[()=>(B.observe(t,{attributes:!0,attributeOldValue:!0,attributeFilter:A,subtree:e,childList:e,characterData:e}),s=!0,()=>{s&&(b(),B.disconnect(),s=!1)}),()=>{if(s)return u.S(),D(!0,B.takeRecords())}]},Io={},Po={},Rs=t=>{Y(t,e=>Y(e,(n,o)=>{Io[o]=e[o]}))},Bo=(t,e,n)=>Ct(t).map(o=>{const{static:s,instance:c}=t[o],[r,i,l]=n||[],d=n?c:s;if(d){const a=n?d(r,i,e):d(e);return(l||Po)[o]=a}}),le=t=>Po[t],ks="__osOptionsValidationPlugin",Is="__osSizeObserverPlugin",Ps=(t,e)=>{const{M:n}=e,[o,s]=t("showNativeOverlaidScrollbars");return[o&&n.x&&n.y,s]},Me=t=>t.indexOf(Lt)===0,Bs=(t,e)=>{const n=(s,c,r,i)=>{const l=s===Lt?kt:s.replace(`${Lt}-`,""),d=Me(s),a=Me(r);return!c&&!i?kt:d&&a?Lt:d?c&&i?l:c?Lt:kt:c?l:a&&i?Lt:kt},o={x:n(e.x,t.x,e.y,t.y),y:n(e.y,t.y,e.x,t.x)};return{G:o,Z:{x:o.x===Wt,y:o.y===Wt}}},_o="__osScrollbarsHidingPlugin",_s="__osClickScrollPlugin",No=(t,e,n)=>{const{dt:o}=n||{},s=le(Is),[c]=ut({o:!1,u:!0});return()=>{const r=[],l=wo(`<div class="${Tn}"><div class="${gs}"></div></div>`)[0],d=l.firstChild,a=u=>{const b=u instanceof ResizeObserverEntry;let E=!1,y=!1;if(b){const[x,,A]=c(u.contentRect),D=on(x);y=Co(x,A),E=!y&&!D}else y=u===!0;E||e({ft:!0,dt:y})};if(Ae){const u=new Ae(b=>a(b.pop()));u.observe(d),ot(r,()=>{u.disconnect()})}else if(s){const[u,b]=s(d,a,o);ot(r,Nt([En(l,ms),Q(l,"animationstart",u)],b))}else return Bt;return M(pt,ot(r,dt(t,l)))}},Ns=(t,e)=>{let n;const o=l=>l.h===0||l.isIntersecting||l.intersectionRatio>0,s=jt(vs),[c]=ut({o:!1}),r=(l,d)=>{if(l){const a=c(o(l)),[,u]=a;return u&&!d&&e(a)&&[a]}},i=(l,d)=>r(d.pop(),l);return[()=>{const l=[];if(kn)n=new kn(M(i,!1),{root:t}),n.observe(s),ot(l,()=>{n.disconnect()});else{const d=()=>{const a=Qt(s);r(a)};ot(l,No(s,d)()),d()}return M(pt,ot(l,dt(t,s)))},()=>n&&i(!0,n.takeRecords())]},Fs=(t,e,n,o)=>{let s,c,r,i,l,d;const a=`[${Dt}]`,u=`[${Mt}]`,b=["id","class","style","open","wrap","cols","rows"],{vt:E,ht:y,ot:x,gt:A,bt:D,nt:B,wt:Z,yt:C,St:I}=t,L=v=>Ft(v,"direction")==="rtl",V={Ot:!1,ct:L(E)},q=Et(),T=le(_o),[h]=ut({i:po,o:{w:0,h:0}},()=>{const v=T&&T.tt(t,e,V,q,n).ut,S=!(Z&&B)&&Cn(y,Dt,Oe),m=!B&&C(fs),w=m&&ft(A),z=I(Ho,S),K=m&&v&&v()[0],R=nn(x),W=$n(x);return K&&K(),wt(A,w),S&&z(),{w:R.w+W.w,h:R.h+W.h}}),p=Xe(o,{_:()=>s,p:()=>c,m(v,f){const[S]=v,[m]=f;return[Nt(Ct(S),Ct(m)).reduce((w,z)=>(w[z]=S[z]||m[z],w),{})]}}),H=v=>{const f=L(E);G(v,{$t:d!==f}),G(V,{ct:f}),d=f},O=(v,f)=>{const[S,m]=v,w={Ct:m};return G(V,{Ot:S}),!f&&o(w),w},j=({ft:v,dt:f})=>{const m=!(v&&!f)&&q.R?p:o,w={ft:v||f,dt:f};H(w),m(w)},P=(v,f)=>{const[,S]=h(),m={xt:S};return H(m),S&&!f&&(v?o:p)(m),m},N=(v,f,S)=>{const m={Ht:f};return H(m),f&&!S&&p(m),m},[F,U]=D?Ns(y,O):[],tt=!B&&No(y,j,{dt:!0}),[g,k]=Qn(y,!1,N,{X:b,j:b}),_=B&&Ae&&new Ae(v=>{const f=v[v.length-1].contentRect;j({ft:!0,dt:Co(f,l)}),l=f}),$=Xe(()=>{const[,v]=h();o({xt:v})},{_:222,v:!0});return[()=>{_&&_.observe(y);const v=tt&&tt(),f=F&&F(),S=g(),m=q.L(w=>{w?p({Et:w}):$()});return()=>{_&&_.disconnect(),v&&v(),f&&f(),i&&i(),S(),m()}},({zt:v,It:f,At:S})=>{const m={},[w]=v("update.ignoreMutation"),[z,K]=v("update.attributes"),[R,W]=v("update.elementEvents"),[J,st]=v("update.debounce"),ct=W||K,et=f||S,at=X=>gt(w)&&w(X);if(ct){r&&r(),i&&i();const[X,rt]=Qn(D||x,!0,P,{j:Nt(b,z||[]),Y:R,W:a,K:(lt,vt)=>{const{target:ht,attributeName:nt}=lt;return(!vt&&nt&&!B?os(ht,a,u):!1)||!!Vt(ht,`.${yt}`)||!!at(lt)}});i=X(),r=rt}if(st)if(p.S(),Ot(J)){const X=J[0],rt=J[1];s=xt(X)&&X,c=xt(rt)&&rt}else xt(J)?(s=J,c=!1):(s=!1,c=!1);if(et){const X=k(),rt=U&&U(),lt=r&&r();X&&G(m,N(X[0],X[1],et)),rt&&G(m,O(rt[0],et)),lt&&G(m,P(lt[0],et))}return H(m),m},V]},Vs=(t,e,n,o)=>{const{U:s}=Et(),{scrollbars:c}=s(),{slot:r}=c,{vt:i,ht:l,ot:d,Tt:a,gt:u,wt:b,nt:E}=e,{scrollbars:y}=a?{}:t,{slot:x}=y||{},A=new Map,D=f=>Ke&&new Ke({source:u,axis:f}),B={x:D("x"),y:D("y")},Z=Ro([i,l,d],()=>E&&b?i:l,r,x),C=(f,S)=>{if(S){const W=f?Ut:Kt,{Dt:J,kt:st}=S,ct=te(st)[W],et=te(J)[W];return Ye(0,1,ct/et||0)}const m=f?"x":"y",{Mt:w,Rt:z}=n,K=z[m],R=w[m];return Ye(0,1,K/(K+R)||0)},I=(f,S,m)=>{const w=C(m,f);return 1/w*(1-w)*S},L=f=>G(f,{clear:["left"]}),V=f=>{A.forEach((S,m)=>{(f?Sn(ze(f),m):!0)&&(Y(S||[],z=>{z&&z.cancel()}),A.delete(m))})},q=(f,S,m,w)=>{const z=A.get(f)||[],K=z.find(R=>R&&R.timeline===S);K?K.effect=new KeyframeEffect(f,m,{composite:w}):A.set(f,Nt(z,[f.animate(m,{timeline:S,composite:w})]))},T=(f,S,m)=>{const w=m?En:ho;Y(f,z=>{w(z.Vt,S)})},h=(f,S)=>{Y(f,m=>{const[w,z]=S(m);oe(w,z)})},p=(f,S)=>{h(f,m=>{const{kt:w}=m;return[w,{[S?Ut:Kt]:Bn(C(S))}]})},H=(f,S)=>{const{Lt:m}=n,w=S?"x":"y",z=B[w],K=Fn(m)[w],R=(W,J)=>Fe(Bn(I(W,K?J:1-J,S)),S);z?Y(f,W=>{const{kt:J}=W;q(J,z,L({transform:[0,1].map(st=>R(W,st))}))}):h(f,W=>[W.kt,{transform:R(W,Vn(m,ft(u))[w])}])},O=f=>E&&!b&&ne(f)===d,j=[],P=[],N=[],F=(f,S,m)=>{const w=so(m),z=w?m:!0,K=w?!m:!0;z&&T(P,f,S),K&&T(N,f,S)},U=()=>{p(P,!0),p(N)},tt=()=>{H(P,!0),H(N)},g=()=>{if(E){const{Mt:f,Lt:S}=n,m=Fn(S),w=.5;if(B.x&&B.y)Y(Nt(N,P),({Vt:z})=>{if(O(z)){const K=R=>q(z,B[R],L({transform:[0,m[R]?1:-1].map(W=>Fe(en(W*(f[R]-w)),R==="x"))}),"add");K("x"),K("y")}else V(z)});else{const z=Vn(S,ft(u)),K=R=>{const{Vt:W}=R,J=O(W)&&W,st=(ct,et,at)=>{const X=et*ct;return en(at?X:-X)};return[J,J&&{transform:Fe({x:st(z.x,f.x,m.x),y:st(z.y,f.y,m.y)})}]};h(P,K),h(N,K)}}},k=f=>{const m=jt(`${yt} ${f?Ss:ws}`),w=jt(Lo),z=jt(Hn),K={Vt:m,Dt:w,kt:z};return ot(f?P:N,K),ot(j,[dt(m,w),dt(w,z),M(Gt,m),V,o(K,F,H,f)]),K},_=M(k,!0),$=M(k,!1),v=()=>(dt(Z,P[0].Vt),dt(Z,N[0].Vt),M(pt,j));return _(),$(),[{Ut:U,Pt:tt,Nt:g,qt:F,Bt:{V:B.x,Ft:P,jt:_,Xt:M(h,P)},Yt:{V:B.y,Ft:N,jt:$,Xt:M(h,N)}},v]},qs=(t,e,n,o)=>(s,c,r,i)=>{const{ht:l,ot:d,nt:a,gt:u,Wt:b,St:E}=e,{Vt:y,Dt:x,kt:A}=s,[D,B]=It(333),[Z,C]=It(444),I=M(r,[s],i),L=p=>{gt(u.scrollBy)&&u.scrollBy({behavior:"smooth",left:p.x,top:p.y})},V=i?Ut:Kt,q=()=>{const p="pointerup pointercancel lostpointercapture",H=`client${i?"X":"Y"}`,O=i?"left":"top",j=i?"w":"h",P=i?"x":"y",N=(F,U)=>tt=>{const{Mt:g}=n,k=Qt(x)[j]-Qt(A)[j],$=U*tt/k*g[P];wt(u,{[P]:F+$})};return Q(x,"pointerdown",F=>{const U=Vt(F.target,`.${Hn}`)===A,tt=U?A:x,g=t.scrollbars,{button:k,isPrimary:_,pointerType:$}=F,{pointers:v}=g;if(k===0&&_&&g[U?"dragScroll":"clickScroll"]&&(v||[]).includes($)){C();const S=!U&&F.shiftKey,m=M(te,A),w=M(te,x),z=(nt,mt)=>(nt||m())[O]-(mt||w())[O],K=je(te(u)[V])/Qt(u)[j]||1,R=N(ft(u)[P],1/K),W=F[H],J=m(),st=w(),ct=J[V],et=z(J,st)+ct/2,at=W-st[O],X=U?0:at-et,rt=nt=>{pt(ht),tt.releasePointerCapture(nt.pointerId)},lt=()=>E(ps,!0),vt=lt(),ht=[()=>{const nt=ft(u);vt();const mt=ft(u),Tt={x:mt.x-nt.x,y:mt.y-nt.y};(Ce(Tt.x)>3||Ce(Tt.y)>3)&&(lt(),wt(u,nt),L(Tt),Z(vt))},Q(b,p,rt),Q(b,"selectstart",nt=>sn(nt),{H:!1}),Q(x,p,rt),Q(x,"pointermove",nt=>{const mt=nt[H]-W;(U||S)&&R(X+mt)})];if(tt.setPointerCapture(F.pointerId),S)R(X);else if(!U){const nt=le(_s);nt&&ot(ht,nt(R,z,X,ct,at))}}})};let T=!0;const h=(p,H)=>{const[O,j]=It(),P=N=>N.target===p;return M(pt,[j,Q(p,"transitionstart",N=>{if(P(N)&&(!H||H(N))){const F=()=>{I(),O(F)};F()}}),Q(p,"transitionend transitioncancel",N=>{P(N)&&(j(),I())})])};return M(pt,[Q(A,"pointermove pointerleave",o),Q(y,"pointerenter",()=>{c(Xn,!0)}),Q(y,"pointerleave pointercancel",()=>{c(Xn,!1)}),!a&&Q(y,"mousedown",()=>{const p=tn();(In(p,Mt)||In(p,Dt)||p===document.body)&&Ee(M(cn,d),25)}),Q(y,"wheel",p=>{const{deltaX:H,deltaY:O,deltaMode:j}=p;T&&j===0&&ne(y)===l&&L({x:H,y:O}),T=!1,c(Zn,!0),D(()=>{T=!0,c(Zn)}),sn(p)},{H:!1,I:!0}),h(A,p=>p.propertyName.indexOf(V)>-1),h(y,p=>!["opacity","visibility"].includes(p.propertyName)),Q(y,"pointerdown",M(Q,b,"click",Ao,{A:!0,I:!0,H:!1}),{I:!0}),q(),B,C])},js=(t,e,n,o,s,c)=>{let r,i,l,d,a,u=Bt,b=0;const E=g=>g.pointerType==="mouse",[y,x]=It(),[A,D]=It(100),[B,Z]=It(100),[C,I]=It(()=>b),[L,V]=Vs(t,s,o,qs(e,s,o,g=>E(g)&&N())),{ht:q,Jt:T,wt:h}=s,{qt:p,Ut:H,Pt:O,Nt:j}=L,P=(g,k)=>{if(I(),g)p(Jn);else{const _=M(p,Jn,!0);b>0&&!k?C(_):_()}},N=()=>{(l?!r:!d)&&(P(!0),A(()=>{P(!1)}))},F=g=>{p(an,g,!0),p(an,g,!1)},U=g=>{E(g)&&(r=l,l&&P(!0))},tt=[I,D,Z,x,()=>u(),Q(q,"pointerover",U,{A:!0}),Q(q,"pointerenter",U),Q(q,"pointerleave",g=>{E(g)&&(r=!1,l&&P(!1))}),Q(q,"pointermove",g=>{E(g)&&i&&N()}),Q(T,"scroll",g=>{y(()=>{O(),N()}),c(g),j()})];return[()=>M(pt,ot(tt,V())),({zt:g,At:k,Kt:_,Gt:$})=>{const{Qt:v,Zt:f,tn:S,nn:m}=$||{},{$t:w,dt:z}=_||{},{ct:K}=n,{M:R}=Et(),{G:W,sn:J}=o,[st,ct]=g("showNativeOverlaidScrollbars"),[et,at]=g("scrollbars.theme"),[X,rt]=g("scrollbars.visibility"),[lt,vt]=g("scrollbars.autoHide"),[ht,nt]=g("scrollbars.autoHideSuspend"),[mt]=g("scrollbars.autoHideDelay"),[Tt,ie]=g("scrollbars.dragScroll"),[Rt,Yt]=g("scrollbars.clickScroll"),[ae,Pe]=g("overflow"),Be=z&&!k,_e=J.x||J.y,bt=v||f||m||w||k,Ne=S||rt||Pe,ue=st&&R.x&&R.y,de=(Ht,Jt,Zt)=>{const fe=Ht.includes(Wt)&&(X===Lt||X==="auto"&&Jt===Wt);return p(xs,fe,Zt),fe};if(b=mt,Be&&(ht&&_e?(F(!1),u(),B(()=>{u=Q(T,"scroll",M(F,!0),{A:!0})})):F(!0)),ct&&p(hs,ue),at&&(p(a),p(et,!0),a=et),nt&&!ht&&F(!0),vt&&(i=lt==="move",l=lt==="leave",d=lt==="never",P(d,!0)),ie&&p(Es,Tt),Yt&&p(Cs,Rt),Ne){const Ht=de(ae.x,W.x,!0),Jt=de(ae.y,W.y,!1);p(Os,!(Ht&&Jt))}bt&&(H(),O(),j(),p(Yn,!J.x,!0),p(Yn,!J.y,!1),p(bs,K&&!h))},{},L]},Us=t=>{const e=Et(),{U:n,R:o}=e,{elements:s}=n(),{padding:c,viewport:r,content:i}=s,l=He(t),d=l?{}:t,{elements:a}=d,{padding:u,viewport:b,content:E}=a||{},y=l?t:d.target,x=So(y),A=y.ownerDocument,D=A.documentElement,B=()=>A.defaultView||it,Z=M(Hs,[y]),C=M(Ro,[y]),I=M(jt,""),L=M(Z,I,r),V=M(C,I,i),q=L(b),T=q===y,h=T&&x,p=!T&&V(E),H=!T&&q===p,O=h?D:q,j=h?O:y,P=!T&&C(I,c,u),N=!H&&p,F=[N,O,P,j].map(R=>He(R)&&!ne(R)&&R),U=R=>R&&Sn(F,R),tt=U(O)?y:O,g={vt:y,ht:j,ot:O,en:P,bt:N,gt:h?D:O,Jt:h?A:O,cn:x?D:tt,Wt:A,wt:x,Tt:l,nt:T,rn:B,yt:R=>Cn(O,Mt,R),St:(R,W)=>Je(O,Mt,R,W)},{vt:k,ht:_,en:$,ot:v,bt:f}=g,S=[()=>{St(_,[Dt,Ve]),St(k,Ve),x&&St(D,[Ve,Dt])}];let m=Qe([f,v,$,_,k].find(R=>R&&!U(R)));const w=h?k:f||v,z=M(pt,S);return[g,()=>{const R=B(),W=tn(),J=X=>{dt(ne(X),Qe(X)),Gt(X)},st=X=>Q(X,"focusin focusout focus blur",Ao,{I:!0,H:!1}),ct="tabindex",et=xn(v,ct),at=st(W);return At(_,Dt,T?"":as),At($,ln,""),At(v,Mt,""),At(f,Gn,""),T||(At(v,ct,et||"-1"),x&&At(D,Wn,"")),dt(w,m),dt(_,$),dt($||_,!T&&v),dt(v,f),ot(S,[at,()=>{const X=tn(),rt=U(v),lt=rt&&X===v?k:X,vt=st(lt);St($,ln),St(f,Gn),St(v,Mt),x&&St(D,Wn),et?At(v,ct,et):St(v,ct),U(f)&&J(f),rt&&J(v),U($)&&J($),cn(lt),vt()}]),o&&!T&&(On(v,Mt,Mo),ot(S,M(St,v,Mt))),cn(!T&&x&&W===k&&R.top===R?v:W),at(),m=0,z},z]},Ks=({bt:t})=>({Kt:e,ln:n,At:o})=>{const{Ct:s}=e||{},{Ot:c}=n;t&&(s||o)&&oe(t,{[Kt]:c&&"100%"})},Ws=({ht:t,en:e,ot:n,nt:o},s)=>{const[c,r]=ut({i:es,o:_n()},M(_n,t,"padding",""));return({zt:i,Kt:l,ln:d,At:a})=>{let[u,b]=r(a);const{R:E}=Et(),{ft:y,xt:x,$t:A}=l||{},{ct:D}=d,[B,Z]=i("paddingAbsolute");(y||b||(a||x))&&([u,b]=c(a));const I=!o&&(Z||A||b);if(I){const L=!B||!e&&!E,V=u.r+u.l,q=u.t+u.b,T={[uo]:L&&!D?-V:0,[fo]:L?-q:0,[ao]:L&&D?-V:0,top:L?-u.t:0,right:L?D?-u.r:"auto":0,left:L?D?"auto":-u.l:0,[Ut]:L&&`calc(100% + ${V}px)`},h={[co]:L?u.t:0,[ro]:L?u.r:0,[io]:L?u.b:0,[lo]:L?u.l:0};oe(e||n,T),oe(n,h),G(s,{en:u,an:!L,rt:e?h:G({},T,h)})}return{un:I}}},Gs=(t,e)=>{const n=Et(),{ht:o,en:s,ot:c,nt:r,Jt:i,gt:l,wt:d,St:a,rn:u}=t,{R:b}=n,E=d&&r,y=M(no,0),x=["display","direction","flexDirection","writingMode"],A={i:po,o:{w:0,h:0}},D={i:we,o:{}},B=g=>{a(Ho,!E&&g)},Z=(g,k)=>{const _=it.devicePixelRatio%1!==0?1:0,$={w:y(g.w-k.w),h:y(g.h-k.h)};return{w:$.w>_?$.w:0,h:$.h>_?$.h:0}},[C,I]=ut(A,M($n,c)),[L,V]=ut(A,M(nn,c)),[q,T]=ut(A),[h]=ut(D),[p,H]=ut(A),[O]=ut(D),[j]=ut({i:(g,k)=>Re(g,k,x),o:{}},()=>Oo(c)?Ft(c,x):{}),[P,N]=ut({i:(g,k)=>we(g.T,k.T)&&we(g.D,k.D),o:$o()},()=>{B(!0);const g=ft(l),k=a(ys,!0),_=Q(i,Wt,m=>{const w=ft(l);m.isTrusted&&w.x===g.x&&w.y===g.y&&Eo(m)},{I:!0,A:!0});wt(l,{x:0,y:0}),k();const $=ft(l),v=nn(l);wt(l,{x:v.w,y:v.h});const f=ft(l);wt(l,{x:f.x-$.x<1&&-v.w,y:f.y-$.y<1&&-v.h});const S=ft(l);return wt(l,g),gn(()=>_()),{T:$,D:S}}),F=le(_o),U=(g,k)=>`${k?us:ds}${ts(g)}`,tt=g=>{const k=$=>[Lt,kt,Wt].map(v=>U(v,$)),_=k(!0).concat(k()).join(" ");a(_),a(Ct(g).map($=>U(g[$],$==="x")).join(" "),!0)};return({zt:g,Kt:k,ln:_,At:$},{un:v})=>{const{ft:f,xt:S,$t:m,dt:w,Et:z}=k||{},K=F&&F.tt(t,e,_,n,g),{it:R,ut:W,_t:J}=K||{},[st,ct]=Ps(g,n),[et,at]=g("overflow"),X=Me(et.x),rt=Me(et.y),lt=!0;let vt=I($),ht=V($),nt=T($),mt=H($);ct&&b&&a(Mo,!st);{Cn(o,Dt,Oe)&&B(!0);const[Dn]=W?W():[],[pe]=vt=C($),[ye]=ht=L($),me=xo(c),ge=E&&rs(u()),Go={w:y(ye.w+pe.w),h:y(ye.h+pe.h)},zn={w:y((ge?ge.w:me.w+y(me.w-ye.w))+pe.w),h:y((ge?ge.h:me.h+y(me.h-ye.h))+pe.h)};Dn&&Dn(),mt=p(zn),nt=q(Z(Go,zn),$)}const[Tt,ie]=mt,[Rt,Yt]=nt,[ae,Pe]=ht,[Be,_e]=vt,[bt,Ne]=h({x:Rt.w>0,y:Rt.h>0}),ue=X&&rt&&(bt.x||bt.y)||X&&bt.x&&!bt.y||rt&&bt.y&&!bt.x,de=v||m||z||_e||Pe||ie||Yt||at||ct||lt,Ht=Bs(bt,et),[Jt,Zt]=O(Ht.G),[,fe]=j($),Ln=m||w||fe||Ne||$,[Ko,Wo]=Ln?P($):N();return de&&(Zt&&tt(Ht.G),J&&R&&oe(c,J(Ht,_,R(Ht,ae,Be)))),B(!1),Je(o,Dt,Oe,ue),Je(s,ln,Oe,ue),G(e,{G:Jt,Rt:{x:Tt.w,y:Tt.h},Mt:{x:Rt.w,y:Rt.h},sn:bt,Lt:ls(Ko,Rt)}),{tn:Zt,Qt:ie,Zt:Yt,nn:Wo||Yt,_n:Ln}}},Xs=t=>{const[e,n,o]=Us(t),s={en:{t:0,r:0,b:0,l:0},an:!1,rt:{[uo]:0,[fo]:0,[ao]:0,[co]:0,[ro]:0,[io]:0,[lo]:0},Rt:{x:0,y:0},Mt:{x:0,y:0},G:{x:kt,y:kt},sn:{x:!1,y:!1},Lt:$o()},{vt:c,gt:r,nt:i}=e,{R:l,M:d}=Et(),a=!l&&(d.x||d.y),u=[Ks(e),Ws(e,s),Gs(e,s)];return[n,b=>{const E={},x=a&&ft(r);return Y(u,A=>{G(E,A(b,E)||{})}),wt(r,x),!i&&wt(c,0),E},s,e,o]},Ys=(t,e,n,o,s)=>{let c=!1;const r=Kn(e,{}),[i,l,d,a,u]=Xs(t),[b,E,y]=Fs(a,d,r,C=>{Z({},C)}),[x,A,,D]=js(t,e,y,d,a,s),B=C=>Ct(C).some(I=>!!C[I]),Z=(C,I)=>{const{dn:L,At:V,It:q,fn:T}=C,h=L||{},p=!!V||!c,H={zt:Kn(e,h,p),dn:h,At:p};if(n()||!Oo(a.ht))return!1;if(T)return A(H),!1;const O=I||E(G({},H,{It:q})),j=l(G({},H,{ln:y,Kt:O}));A(G({},H,{Kt:O,Gt:j}));const P=B(O),N=B(j),F=P||N||!wn(h)||p;return F&&o(C,{Kt:O,Gt:j}),c=!0,F};return[()=>{const{cn:C,gt:I}=a,L=ft(C),V=[b(),i(),x()];return wt(I,L),M(pt,V)},Z,()=>({pn:y,vn:d}),{hn:a,gn:D},u]},$t=(t,e,n)=>{const{N:o}=Et(),s=He(t),c=s?t:t.target,r=ko(c);if(e&&!r){let i=!1;const l=[],d={},a=h=>{const p=mo(h),H=le(ks);return H?H(p,!0):p},u=G({},o(),a(e)),[b,E,y]=rn(),[x,A,D]=rn(n),B=(h,p)=>{D(h,p),y(h,p)},[Z,C,I,L,V]=Ys(t,u,()=>i,({dn:h,At:p},{Kt:H,Gt:O})=>{const{ft:j,$t:P,Ct:N,xt:F,Ht:U,dt:tt}=H,{Qt:g,Zt:k,tn:_,nn:$}=O;B("updated",[T,{updateHints:{sizeChanged:!!j,directionChanged:!!P,heightIntrinsicChanged:!!N,overflowEdgeChanged:!!g,overflowAmountChanged:!!k,overflowStyleChanged:!!_,scrollCoordinatesChanged:!!$,contentMutation:!!F,hostMutation:!!U,appear:!!tt},changedOptions:h||{},force:!!p}])},h=>B("scroll",[T,h])),q=h=>{Ds(c),pt(l),i=!0,B("destroyed",[T,h]),E(),A()},T={options(h,p){if(h){const H=p?o():{},O=To(u,G(H,a(h)));wn(O)||(G(u,O),C({dn:O}))}return G({},u)},on:x,off:(h,p)=>{h&&p&&A(h,p)},state(){const{pn:h,vn:p}=I(),{ct:H}=h,{Rt:O,Mt:j,G:P,sn:N,en:F,an:U,Lt:tt}=p;return G({},{overflowEdge:O,overflowAmount:j,overflowStyle:P,hasOverflow:N,scrollCoordinates:{start:tt.T,end:tt.D},padding:F,paddingAbsolute:U,directionRTL:H,destroyed:i})},elements(){const{vt:h,ht:p,en:H,ot:O,bt:j,gt:P,Jt:N}=L.hn,{Bt:F,Yt:U}=L.gn,tt=k=>{const{kt:_,Dt:$,Vt:v}=k;return{scrollbar:v,track:$,handle:_}},g=k=>{const{Ft:_,jt:$}=k,v=tt(_[0]);return G({},v,{clone:()=>{const f=tt($());return C({fn:!0}),f}})};return G({},{target:h,host:p,padding:H||O,viewport:O,content:j||O,scrollOffsetElement:P,scrollEventElement:N,scrollbarHorizontal:g(F),scrollbarVertical:g(U)})},update:h=>C({At:h,It:!0}),destroy:M(q,!1),plugin:h=>d[Ct(h)[0]]};return ot(l,[V]),Ls(c,T),Bo(Io,$t,[T,b,d]),Ms(L.hn.wt,!s&&t.cancel)?(q(!0),T):(ot(l,Z()),B("initialized",[T]),T.update(!0),T)}return r};$t.plugin=t=>{const e=Ot(t),n=e?t:[t],o=n.map(s=>Bo(s,$t)[0]);return Rs(n),e?o:o[0]};$t.valid=t=>{const e=t&&t.elements,n=gt(e)&&e();return Te(n)&&!!ko(n.target)};$t.env=()=>{const{k:t,M:e,R:n,V:o,B:s,F:c,U:r,P:i,N:l,q:d}=Et();return G({},{scrollbarsSize:t,scrollbarsOverlaid:e,scrollbarsHiding:n,scrollTimeline:o,staticDefaultInitialization:s,staticDefaultOptions:c,getDefaultInitialization:r,setDefaultInitialization:i,getDefaultOptions:l,setDefaultOptions:d})};$t.nonce=$s;const Js=document.querySelector("#eventsSection"),to=document.querySelector("#events"),Zs=t=>{Js.style.display="",to.innerHTML="",Object.entries(t).forEach(([e,n])=>{const o=document.createElement("div");o.className=`event ${n.active?"active":""}`,o.textContent=`${e} (${n.count})`,to.append(o)})},Qs=()=>{let t=[];const e={},n={},o=r=>({active:t.includes(r),count:e[r]||0}),s=r=>{t=r,Zs({initialized:o("initialized"),destroyed:o("destroyed"),updated:o("updated"),scroll:o("scroll")})};return r=>{const i=e[r];e[r]=typeof i=="number"?i+1:1,s(Array.from(new Set([...t,r]))),clearTimeout(n[r]),n[r]=setTimeout(()=>{const l=new Set(t);l.delete(r),s(Array.from(l))},500)}};let Pt,un=!1,dn=!1,fn=!0;const be=Qs(),qt=document.querySelector("#target"),eo=document.querySelector("#targetContent"),Se=document.querySelector("#impostor"),pn=document.querySelector("#scrollButton"),se=document.querySelector("#toggleContentButton"),ce=document.querySelector("#toggleElementButton"),yn=document.querySelector("#toggleOverlayScrollbarsButton"),Fo=()=>{un?(eo.style.display="none",se.textContent="Show Content"):(eo.style.display="",se.textContent="Hide Content")},Vo=()=>{dn?(qt.style.display="none",ce.textContent="Show Element"):(qt.style.display="",ce.textContent="Hide Element")},qo=()=>{var t,e;fn?((t=Se.parentElement)==null||t.append(qt),Se.remove(),pn.style.display="",se.style.display="",ce.style.display="",yn.textContent="Destroy OverlayScrollbars",Pt=$t(qt,{},{initialized:()=>be("initialized"),destroyed:()=>be("destroyed"),updated:()=>be("updated"),scroll:()=>be("scroll")})):(Pt==null||Pt.destroy(),(e=qt.parentElement)==null||e.append(Se),qt.remove(),Se.style.display="",pn.style.display="none",se.style.display="none",ce.style.display="none",yn.textContent="Initialize OverlayScrollbars")};pn.addEventListener("click",()=>{if(!Pt)return;const{overflowAmount:t}=Pt.state(),{scrollOffsetElement:e}=Pt.elements(),{scrollLeft:n,scrollTop:o}=e;e.scrollTo({behavior:"smooth",left:Math.round((t.x-n)/t.x)*t.x,top:Math.round((t.y-o)/t.y)*t.y})});se.addEventListener("click",()=>{un=!un,Fo()});ce.addEventListener("click",()=>{dn=!dn,Vo()});yn.addEventListener("click",()=>{fn=!fn,qo()});Fo();Vo();qo();let ee=null;const jo=t=>$t({target:document.body,cancel:{body:t?!1:null}},{}).state().destroyed,tc=document.querySelector("#toggleBodyOverlayScrollbarsSection"),mn=document.querySelector("#toggleBodyOverlayScrollbarsButton"),Uo=()=>{ee===null&&(ee=!jo()),tc.style.display="",mn.style.display="",mn.textContent=`${ee?"Destroy":"Initialize"} Body OverlayScrollbars`};mn.addEventListener("click",()=>{const t=$t(document.body);t?(t.destroy(),ee=!1):ee=!jo(!0),Uo()});Uo();