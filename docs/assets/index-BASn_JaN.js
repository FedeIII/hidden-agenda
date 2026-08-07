var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o((e=>{var t=Symbol.for(`react.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.provider`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.iterator;function p(e){return typeof e!=`object`||!e?null:(e=f&&e[f]||e[`@@iterator`],typeof e==`function`?e:null)}var m={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},h=Object.assign,g={};function _(e,t,n){this.props=e,this.context=t,this.refs=g,this.updater=n||m}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`setState(...): takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function v(){}v.prototype=_.prototype;function y(e,t,n){this.props=e,this.context=t,this.refs=g,this.updater=n||m}var b=y.prototype=new v;b.constructor=y,h(b,_.prototype),b.isPureReactComponent=!0;var x=Array.isArray,S=Object.prototype.hasOwnProperty,C={current:null},w={key:!0,ref:!0,__self:!0,__source:!0};function T(e,n,r){var i,a={},o=null,s=null;if(n!=null)for(i in n.ref!==void 0&&(s=n.ref),n.key!==void 0&&(o=``+n.key),n)S.call(n,i)&&!w.hasOwnProperty(i)&&(a[i]=n[i]);var c=arguments.length-2;if(c===1)a.children=r;else if(1<c){for(var l=Array(c),u=0;u<c;u++)l[u]=arguments[u+2];a.children=l}if(e&&e.defaultProps)for(i in c=e.defaultProps,c)a[i]===void 0&&(a[i]=c[i]);return{$$typeof:t,type:e,key:o,ref:s,props:a,_owner:C.current}}function E(e,n){return{$$typeof:t,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function D(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function O(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var k=/\/+/g;function A(e,t){return typeof e==`object`&&e&&e.key!=null?O(``+e.key):t.toString(36)}function j(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0}}if(c)return c=e,o=o(c),e=a===``?`.`+A(c,0):a,x(o)?(i=``,e!=null&&(i=e.replace(k,`$&/`)+`/`),j(o,r,i,``,function(e){return e})):o!=null&&(D(o)&&(o=E(o,i+(!o.key||c&&c.key===o.key?``:(``+o.key).replace(k,`$&/`)+`/`)+e)),r.push(o)),1;if(c=0,a=a===``?`.`:a+`:`,x(e))for(var l=0;l<e.length;l++){s=e[l];var u=a+A(s,l);c+=j(s,r,i,u,o)}else if(u=p(e),typeof u==`function`)for(e=u.call(e),l=0;!(s=e.next()).done;)s=s.value,u=a+A(s,l++),c+=j(s,r,i,u,o);else if(s===`object`)throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`);return c}function M(e,t,n){if(e==null)return e;var r=[],i=0;return j(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function N(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var P={current:null},F={transition:null},I={ReactCurrentDispatcher:P,ReactCurrentBatchConfig:F,ReactCurrentOwner:C};function ee(){throw Error(`act(...) is not supported in production builds of React.`)}e.Children={map:M,forEach:function(e,t,n){M(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return M(e,function(){t++}),t},toArray:function(e){return M(e,function(e){return e})||[]},only:function(e){if(!D(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}},e.Component=_,e.Fragment=r,e.Profiler=a,e.PureComponent=y,e.StrictMode=i,e.Suspense=l,e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=I,e.act=ee,e.cloneElement=function(e,n,r){if(e==null)throw Error(`React.cloneElement(...): The argument must be a React element, but you passed `+e+`.`);var i=h({},e.props),a=e.key,o=e.ref,s=e._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,s=C.current),n.key!==void 0&&(a=``+n.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(l in n)S.call(n,l)&&!w.hasOwnProperty(l)&&(i[l]=n[l]===void 0&&c!==void 0?c[l]:n[l])}var l=arguments.length-2;if(l===1)i.children=r;else if(1<l){c=Array(l);for(var u=0;u<l;u++)c[u]=arguments[u+2];i.children=c}return{$$typeof:t,type:e.type,key:a,ref:o,props:i,_owner:s}},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:o,_context:e},e.Consumer=e},e.createElement=T,e.createFactory=function(e){var t=T.bind(null,e);return t.type=e,t},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=D,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:N}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=F.transition;F.transition={};try{e()}finally{F.transition=t}},e.unstable_act=ee,e.useCallback=function(e,t){return P.current.useCallback(e,t)},e.useContext=function(e){return P.current.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e){return P.current.useDeferredValue(e)},e.useEffect=function(e,t){return P.current.useEffect(e,t)},e.useId=function(){return P.current.useId()},e.useImperativeHandle=function(e,t,n){return P.current.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return P.current.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return P.current.useLayoutEffect(e,t)},e.useMemo=function(e,t){return P.current.useMemo(e,t)},e.useReducer=function(e,t,n){return P.current.useReducer(e,t,n)},e.useRef=function(e){return P.current.useRef(e)},e.useState=function(e){return P.current.useState(e)},e.useSyncExternalStore=function(e,t,n){return P.current.useSyncExternalStore(e,t,n)},e.useTransition=function(){return P.current.useTransition()},e.version=`18.3.1`})),u=o(((e,t)=>{t.exports=l()})),d=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=typeof setTimeout==`function`?setTimeout:null,_=typeof clearTimeout==`function`?clearTimeout:null,v=typeof setImmediate<`u`?setImmediate:null;typeof navigator<`u`&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function b(e){if(h=!1,y(e),!m)if(n(c)!==null)m=!0,M(x);else{var t=n(l);t!==null&&N(b,t.startTime-e)}}function x(t,i){m=!1,h&&(h=!1,_(w),w=-1),p=!0;var a=f;try{for(y(i),d=n(c);d!==null&&(!(d.expirationTime>i)||t&&!D());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=i);i=e.unstable_now(),typeof s==`function`?d.callback=s:d===n(c)&&r(c),y(i)}else r(c);d=n(c)}if(d!==null)var u=!0;else{var g=n(l);g!==null&&N(b,g.startTime-i),u=!1}return u}finally{d=null,f=a,p=!1}}var S=!1,C=null,w=-1,T=5,E=-1;function D(){return!(e.unstable_now()-E<T)}function O(){if(C!==null){var t=e.unstable_now();E=t;var n=!0;try{n=C(!0,t)}finally{n?k():(S=!1,C=null)}}else S=!1}var k;if(typeof v==`function`)k=function(){v(O)};else if(typeof MessageChannel<`u`){var A=new MessageChannel,j=A.port2;A.port1.onmessage=O,k=function(){j.postMessage(null)}}else k=function(){g(O,0)};function M(e){C=e,S||(S=!0,k())}function N(t,n){w=g(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_continueExecution=function(){m||p||(m=!0,M(x))},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):T=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(_(w),w=-1):h=!0,N(b,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,M(x))),r},e.unstable_shouldYield=D,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),f=o(((e,t)=>{t.exports=d()})),p=o((e=>{var t=u(),n=f();function r(e){for(var t=`https://reactjs.org/docs/error-decoder.html?invariant=`+e,n=1;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n]);return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}var i=new Set,a={};function o(e,t){s(e,t),s(e+`Capture`,t)}function s(e,t){for(a[e]=t,e=0;e<t.length;e++)i.add(t[e])}var c=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),l=Object.prototype.hasOwnProperty,d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,p={},m={};function h(e){return l.call(m,e)?!0:l.call(p,e)?!1:d.test(e)?m[e]=!0:(p[e]=!0,!1)}function g(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case`function`:case`symbol`:return!0;case`boolean`:return r?!1:n===null?(e=e.toLowerCase().slice(0,5),e!==`data-`&&e!==`aria-`):!n.acceptsBooleans;default:return!1}}function _(e,t,n,r){if(t==null||g(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function v(e,t,n,r,i,a,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=o}var y={};`children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style`.split(` `).forEach(function(e){y[e]=new v(e,0,!1,e,null,!1,!1)}),[[`acceptCharset`,`accept-charset`],[`className`,`class`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`]].forEach(function(e){var t=e[0];y[t]=new v(t,1,!1,e[1],null,!1,!1)}),[`contentEditable`,`draggable`,`spellCheck`,`value`].forEach(function(e){y[e]=new v(e,2,!1,e.toLowerCase(),null,!1,!1)}),[`autoReverse`,`externalResourcesRequired`,`focusable`,`preserveAlpha`].forEach(function(e){y[e]=new v(e,2,!1,e,null,!1,!1)}),`allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope`.split(` `).forEach(function(e){y[e]=new v(e,3,!1,e.toLowerCase(),null,!1,!1)}),[`checked`,`multiple`,`muted`,`selected`].forEach(function(e){y[e]=new v(e,3,!0,e,null,!1,!1)}),[`capture`,`download`].forEach(function(e){y[e]=new v(e,4,!1,e,null,!1,!1)}),[`cols`,`rows`,`size`,`span`].forEach(function(e){y[e]=new v(e,6,!1,e,null,!1,!1)}),[`rowSpan`,`start`].forEach(function(e){y[e]=new v(e,5,!1,e.toLowerCase(),null,!1,!1)});var b=/[\-:]([a-z])/g;function x(e){return e[1].toUpperCase()}`accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height`.split(` `).forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,null,!1,!1)}),`xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type`.split(` `).forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,`http://www.w3.org/1999/xlink`,!1,!1)}),[`xml:base`,`xml:lang`,`xml:space`].forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,`http://www.w3.org/XML/1998/namespace`,!1,!1)}),[`tabIndex`,`crossOrigin`].forEach(function(e){y[e]=new v(e,1,!1,e.toLowerCase(),null,!1,!1)}),y.xlinkHref=new v(`xlinkHref`,1,!1,`xlink:href`,`http://www.w3.org/1999/xlink`,!0,!1),[`src`,`href`,`action`,`formAction`].forEach(function(e){y[e]=new v(e,1,!1,e.toLowerCase(),null,!0,!0)});function S(e,t,n,r){var i=y.hasOwnProperty(t)?y[t]:null;(i===null?r||!(2<t.length)||t[0]!==`o`&&t[0]!==`O`||t[1]!==`n`&&t[1]!==`N`:i.type!==0)&&(_(t,n,i,r)&&(n=null),r||i===null?h(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,``+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type!==3&&``:n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&!0===n?``:``+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var C=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,w=Symbol.for(`react.element`),T=Symbol.for(`react.portal`),E=Symbol.for(`react.fragment`),D=Symbol.for(`react.strict_mode`),O=Symbol.for(`react.profiler`),k=Symbol.for(`react.provider`),A=Symbol.for(`react.context`),j=Symbol.for(`react.forward_ref`),M=Symbol.for(`react.suspense`),N=Symbol.for(`react.suspense_list`),P=Symbol.for(`react.memo`),F=Symbol.for(`react.lazy`),I=Symbol.for(`react.offscreen`),ee=Symbol.iterator;function te(e){return typeof e!=`object`||!e?null:(e=ee&&e[ee]||e[`@@iterator`],typeof e==`function`?e:null)}var ne=Object.assign,re;function L(e){if(re===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);re=t&&t[1]||``}return`
`+re+e}var R=!1;function z(e,t){if(!e||R)return``;R=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(t,[])}catch(e){var r=e}Reflect.construct(e,[],t)}else{try{t.call()}catch(e){r=e}e.call(t.prototype)}else{try{throw Error()}catch(e){r=e}e()}}catch(t){if(t&&r&&typeof t.stack==`string`){for(var i=t.stack.split(`
`),a=r.stack.split(`
`),o=i.length-1,s=a.length-1;1<=o&&0<=s&&i[o]!==a[s];)s--;for(;1<=o&&0<=s;o--,s--)if(i[o]!==a[s]){if(o!==1||s!==1)do if(o--,s--,0>s||i[o]!==a[s]){var c=`
`+i[o].replace(` at new `,` at `);return e.displayName&&c.includes(`<anonymous>`)&&(c=c.replace(`<anonymous>`,e.displayName)),c}while(1<=o&&0<=s);break}}}finally{R=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:``)?L(e):``}function ie(e){switch(e.tag){case 5:return L(e.type);case 16:return L(`Lazy`);case 13:return L(`Suspense`);case 19:return L(`SuspenseList`);case 0:case 2:case 15:return e=z(e.type,!1),e;case 11:return e=z(e.type.render,!1),e;case 1:return e=z(e.type,!0),e;default:return``}}function ae(e){if(e==null)return null;if(typeof e==`function`)return e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case E:return`Fragment`;case T:return`Portal`;case O:return`Profiler`;case D:return`StrictMode`;case M:return`Suspense`;case N:return`SuspenseList`}if(typeof e==`object`)switch(e.$$typeof){case A:return(e.displayName||`Context`)+`.Consumer`;case k:return(e._context.displayName||`Context`)+`.Provider`;case j:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case P:return t=e.displayName||null,t===null?ae(e.type)||`Memo`:t;case F:t=e._payload,e=e._init;try{return ae(e(t))}catch{}}return null}function oe(e){var t=e.type;switch(e.tag){case 24:return`Cache`;case 9:return(t.displayName||`Context`)+`.Consumer`;case 10:return(t._context.displayName||`Context`)+`.Provider`;case 18:return`DehydratedFragment`;case 11:return e=t.render,e=e.displayName||e.name||``,t.displayName||(e===``?`ForwardRef`:`ForwardRef(`+e+`)`);case 7:return`Fragment`;case 5:return t;case 4:return`Portal`;case 3:return`Root`;case 6:return`Text`;case 16:return ae(t);case 8:return t===D?`StrictMode`:`Mode`;case 22:return`Offscreen`;case 12:return`Profiler`;case 21:return`Scope`;case 13:return`Suspense`;case 19:return`SuspenseList`;case 25:return`TracingMarker`;case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t==`function`)return t.displayName||t.name||null;if(typeof t==`string`)return t}return null}function se(e){switch(typeof e){case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function ce(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function le(e){var t=ce(e)?`checked`:`value`,n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=``+e[t];if(!e.hasOwnProperty(t)&&n!==void 0&&typeof n.get==`function`&&typeof n.set==`function`){var i=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){r=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ue(e){e._valueTracker||=le(e)}function de(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=ce(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}function fe(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function pe(e,t){var n=t.checked;return ne({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function me(e,t){var n=t.defaultValue==null?``:t.defaultValue,r=t.checked==null?t.defaultChecked:t.checked;n=se(t.value==null?n:t.value),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type===`checkbox`||t.type===`radio`?t.checked!=null:t.value!=null}}function he(e,t){t=t.checked,t!=null&&S(e,`checked`,t,!1)}function ge(e,t){he(e,t);var n=se(t.value),r=t.type;if(n!=null)r===`number`?(n===0&&e.value===``||e.value!=n)&&(e.value=``+n):e.value!==``+n&&(e.value=``+n);else if(r===`submit`||r===`reset`){e.removeAttribute(`value`);return}t.hasOwnProperty(`value`)?B(e,t.type,n):t.hasOwnProperty(`defaultValue`)&&B(e,t.type,se(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function _e(e,t,n){if(t.hasOwnProperty(`value`)||t.hasOwnProperty(`defaultValue`)){var r=t.type;if(!(r!==`submit`&&r!==`reset`||t.value!==void 0&&t.value!==null))return;t=``+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==``&&(e.name=``),e.defaultChecked=!!e._wrapperState.initialChecked,n!==``&&(e.name=n)}function B(e,t,n){(t!==`number`||fe(e.ownerDocument)!==e)&&(n==null?e.defaultValue=``+e._wrapperState.initialValue:e.defaultValue!==``+n&&(e.defaultValue=``+n))}var ve=Array.isArray;function ye(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+se(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function be(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(r(91));return ne({},t,{value:void 0,defaultValue:void 0,children:``+e._wrapperState.initialValue})}function V(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(r(92));if(ve(n)){if(1<n.length)throw Error(r(93));n=n[0]}t=n}t??=``,n=t}e._wrapperState={initialValue:se(n)}}function xe(e,t){var n=se(t.value),r=se(t.defaultValue);n!=null&&(n=``+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=``+r)}function H(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==``&&t!==null&&(e.value=t)}function U(e){switch(e){case`svg`:return`http://www.w3.org/2000/svg`;case`math`:return`http://www.w3.org/1998/Math/MathML`;default:return`http://www.w3.org/1999/xhtml`}}function Se(e,t){return e==null||e===`http://www.w3.org/1999/xhtml`?U(t):e===`http://www.w3.org/2000/svg`&&t===`foreignObject`?`http://www.w3.org/1999/xhtml`:e}var Ce,we=function(e){return typeof MSApp<`u`&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!==`http://www.w3.org/2000/svg`||`innerHTML`in e)e.innerHTML=t;else{for(Ce||=document.createElement(`div`),Ce.innerHTML=`<svg>`+t.valueOf().toString()+`</svg>`,t=Ce.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Te(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},De=[`Webkit`,`ms`,`Moz`,`O`];Object.keys(Ee).forEach(function(e){De.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ee[t]=Ee[e]})});function Oe(e,t,n){return t==null||typeof t==`boolean`||t===``?``:n||typeof t!=`number`||t===0||Ee.hasOwnProperty(e)&&Ee[e]?(``+t).trim():t+`px`}function ke(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=n.indexOf(`--`)===0,i=Oe(n,t[n],r);n===`float`&&(n=`cssFloat`),r?e.setProperty(n,i):e[n]=i}}var Ae=ne({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function je(e,t){if(t){if(Ae[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(r(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(r(60));if(typeof t.dangerouslySetInnerHTML!=`object`||!(`__html`in t.dangerouslySetInnerHTML))throw Error(r(61))}if(t.style!=null&&typeof t.style!=`object`)throw Error(r(62))}}function Me(e,t){if(e.indexOf(`-`)===-1)return typeof t.is==`string`;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var Ne=null;function Pe(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Fe=null,Ie=null,Le=null;function Re(e){if(e=Li(e)){if(typeof Fe!=`function`)throw Error(r(280));var t=e.stateNode;t&&(t=zi(t),Fe(e.stateNode,e.type,t))}}function ze(e){Ie?Le?Le.push(e):Le=[e]:Ie=e}function Be(){if(Ie){var e=Ie,t=Le;if(Le=Ie=null,Re(e),t)for(e=0;e<t.length;e++)Re(t[e])}}function Ve(e,t){return e(t)}function He(){}var Ue=!1;function We(e,t,n){if(Ue)return e(t,n);Ue=!0;try{return Ve(e,t,n)}finally{Ue=!1,(Ie!==null||Le!==null)&&(He(),Be())}}function Ge(e,t){var n=e.stateNode;if(n===null)return null;var i=zi(n);if(i===null)return null;n=i[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(i=!i.disabled)||(e=e.type,i=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!i;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(r(231,t,typeof n));return n}var Ke=!1;if(c)try{var qe={};Object.defineProperty(qe,"passive",{get:function(){Ke=!0}}),window.addEventListener(`test`,qe,qe),window.removeEventListener(`test`,qe,qe)}catch{Ke=!1}function Je(e,t,n,r,i,a,o,s,c){var l=Array.prototype.slice.call(arguments,3);try{t.apply(n,l)}catch(e){this.onError(e)}}var Ye=!1,Xe=null,Ze=!1,Qe=null,$e={onError:function(e){Ye=!0,Xe=e}};function et(e,t,n,r,i,a,o,s,c){Ye=!1,Xe=null,Je.apply($e,arguments)}function tt(e,t,n,i,a,o,s,c,l){if(et.apply(this,arguments),Ye){if(Ye){var u=Xe;Ye=!1,Xe=null}else throw Error(r(198));Ze||(Ze=!0,Qe=u)}}function nt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function rt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function it(e){if(nt(e)!==e)throw Error(r(188))}function at(e){var t=e.alternate;if(!t){if(t=nt(e),t===null)throw Error(r(188));return t===e?e:null}for(var n=e,i=t;;){var a=n.return;if(a===null)break;var o=a.alternate;if(o===null){if(i=a.return,i!==null){n=i;continue}break}if(a.child===o.child){for(o=a.child;o;){if(o===n)return it(a),e;if(o===i)return it(a),t;o=o.sibling}throw Error(r(188))}if(n.return!==i.return)n=a,i=o;else{for(var s=!1,c=a.child;c;){if(c===n){s=!0,n=a,i=o;break}if(c===i){s=!0,i=a,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,i=a;break}if(c===i){s=!0,i=o,n=a;break}c=c.sibling}if(!s)throw Error(r(189))}}if(n.alternate!==i)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function ot(e){return e=at(e),e===null?null:st(e)}function st(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=st(e);if(t!==null)return t;e=e.sibling}return null}var ct=n.unstable_scheduleCallback,lt=n.unstable_cancelCallback,ut=n.unstable_shouldYield,W=n.unstable_requestPaint,dt=n.unstable_now,ft=n.unstable_getCurrentPriorityLevel,pt=n.unstable_ImmediatePriority,mt=n.unstable_UserBlockingPriority,ht=n.unstable_NormalPriority,gt=n.unstable_LowPriority,_t=n.unstable_IdlePriority,vt=null,yt=null;function bt(e){if(yt&&typeof yt.onCommitFiberRoot==`function`)try{yt.onCommitFiberRoot(vt,e,void 0,(e.current.flags&128)==128)}catch{}}var xt=Math.clz32?Math.clz32:wt,St=Math.log,Ct=Math.LN2;function wt(e){return e>>>=0,e===0?32:31-(St(e)/Ct|0)|0}var Tt=64,Et=4194304;function Dt(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ot(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,a=e.pingedLanes,o=n&268435455;if(o!==0){var s=o&~i;s===0?(a&=o,a!==0&&(r=Dt(a))):r=Dt(s)}else o=n&~i,o===0?a!==0&&(r=Dt(a)):r=Dt(o);if(r===0)return 0;if(t!==0&&t!==r&&(t&i)===0&&(i=r&-r,a=t&-t,i>=a||i===16&&a&4194240))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-xt(t),i=1<<n,r|=e[n],t&=~i;return r}function kt(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function At(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes;0<a;){var o=31-xt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=kt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}}function jt(e){return e=e.pendingLanes&-1073741825,e===0?e&1073741824?1073741824:0:e}function Mt(){var e=Tt;return Tt<<=1,!(Tt&4194240)&&(Tt=64),e}function Nt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Pt(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-xt(t),e[t]=n}function Ft(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-xt(n),a=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~a}}function It(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-xt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var Lt=0;function Rt(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var zt,Bt,Vt,Ht,Ut,Wt=!1,Gt=[],Kt=null,qt=null,Jt=null,Yt=new Map,G=new Map,Xt=[],Zt=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit`.split(` `);function Qt(e,t){switch(e){case`focusin`:case`focusout`:Kt=null;break;case`dragenter`:case`dragleave`:qt=null;break;case`mouseover`:case`mouseout`:Jt=null;break;case`pointerover`:case`pointerout`:Yt.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:G.delete(t.pointerId)}}function $t(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Li(t),t!==null&&Bt(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function en(e,t,n,r,i){switch(t){case`focusin`:return Kt=$t(Kt,e,t,n,r,i),!0;case`dragenter`:return qt=$t(qt,e,t,n,r,i),!0;case`mouseover`:return Jt=$t(Jt,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Yt.set(a,$t(Yt.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,G.set(a,$t(G.get(a)||null,e,t,n,r,i)),!0}return!1}function tn(e){var t=Ii(e.target);if(t!==null){var n=nt(t);if(n!==null){if(t=n.tag,t===13){if(t=rt(n),t!==null){e.blockedOn=t,Ut(e.priority,function(){Vt(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function nn(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=mn(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Ne=r,n.target.dispatchEvent(r),Ne=null}else return t=Li(n),t!==null&&Bt(t),e.blockedOn=n,!1;t.shift()}return!0}function rn(e,t,n){nn(e)&&n.delete(t)}function an(){Wt=!1,Kt!==null&&nn(Kt)&&(Kt=null),qt!==null&&nn(qt)&&(qt=null),Jt!==null&&nn(Jt)&&(Jt=null),Yt.forEach(rn),G.forEach(rn)}function on(e,t){e.blockedOn===t&&(e.blockedOn=null,Wt||(Wt=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,an)))}function sn(e){function t(t){return on(t,e)}if(0<Gt.length){on(Gt[0],e);for(var n=1;n<Gt.length;n++){var r=Gt[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Kt!==null&&on(Kt,e),qt!==null&&on(qt,e),Jt!==null&&on(Jt,e),Yt.forEach(t),G.forEach(t),n=0;n<Xt.length;n++)r=Xt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<Xt.length&&(n=Xt[0],n.blockedOn===null);)tn(n),n.blockedOn===null&&Xt.shift()}var cn=C.ReactCurrentBatchConfig,ln=!0;function un(e,t,n,r){var i=Lt,a=cn.transition;cn.transition=null;try{Lt=1,fn(e,t,n,r)}finally{Lt=i,cn.transition=a}}function dn(e,t,n,r){var i=Lt,a=cn.transition;cn.transition=null;try{Lt=4,fn(e,t,n,r)}finally{Lt=i,cn.transition=a}}function fn(e,t,n,r){if(ln){var i=mn(e,t,n,r);if(i===null)ci(e,t,r,pn,n),Qt(e,r);else if(en(i,e,t,n,r))r.stopPropagation();else if(Qt(e,r),t&4&&-1<Zt.indexOf(e)){for(;i!==null;){var a=Li(i);if(a!==null&&zt(a),a=mn(e,t,n,r),a===null&&ci(e,t,r,pn,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else ci(e,t,r,null,n)}}var pn=null;function mn(e,t,n,r){if(pn=null,e=Pe(r),e=Ii(e),e!==null)if(t=nt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=rt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return pn=e,null}function hn(e){switch(e){case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 1;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`toggle`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 4;case`message`:switch(ft()){case pt:return 1;case mt:return 4;case ht:case gt:return 16;case _t:return 536870912;default:return 16}default:return 16}}var gn=null,_n=null,vn=null;function yn(){if(vn)return vn;var e,t=_n,n=t.length,r,i=`value`in gn?gn.value:gn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return vn=i.slice(e,1<r?1-r:void 0)}function bn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function xn(){return!0}function Sn(){return!1}function Cn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?xn:Sn,this.isPropagationStopped=Sn,this}return ne(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=xn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=xn)},persist:function(){},isPersistent:xn}),t}var wn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Tn=Cn(wn),En=ne({},wn,{view:0,detail:0}),Dn=Cn(En),On,kn,An,jn=ne({},En,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Hn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==An&&(An&&e.type===`mousemove`?(On=e.screenX-An.screenX,kn=e.screenY-An.screenY):kn=On=0,An=e),On)},movementY:function(e){return`movementY`in e?e.movementY:kn}}),Mn=Cn(jn),Nn=Cn(ne({},jn,{dataTransfer:0})),Pn=Cn(ne({},En,{relatedTarget:0})),Fn=Cn(ne({},wn,{animationName:0,elapsedTime:0,pseudoElement:0})),In=Cn(ne({},wn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Ln=Cn(ne({},wn,{data:0})),Rn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},zn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Bn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Vn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Bn[e])?!!t[e]:!1}function Hn(){return Vn}var Un=Cn(ne({},En,{key:function(e){if(e.key){var t=Rn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=bn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?zn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Hn,charCode:function(e){return e.type===`keypress`?bn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?bn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Wn=Cn(ne({},jn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Gn=Cn(ne({},En,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Hn})),Kn=Cn(ne({},wn,{propertyName:0,elapsedTime:0,pseudoElement:0})),qn=Cn(ne({},jn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Jn=[9,13,27,32],Yn=c&&`CompositionEvent`in window,Xn=null;c&&`documentMode`in document&&(Xn=document.documentMode);var Zn=c&&`TextEvent`in window&&!Xn,Qn=c&&(!Yn||Xn&&8<Xn&&11>=Xn),$n=` `,er=!1;function tr(e,t){switch(e){case`keyup`:return Jn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function nr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var rr=!1;function ir(e,t){switch(e){case`compositionend`:return nr(t);case`keypress`:return t.which===32?(er=!0,$n):null;case`textInput`:return e=t.data,e===$n&&er?null:e;default:return null}}function ar(e,t){if(rr)return e===`compositionend`||!Yn&&tr(e,t)?(e=yn(),vn=_n=gn=null,rr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return Qn&&t.locale!==`ko`?null:t.data;default:return null}}var or={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function sr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!or[e.type]:t===`textarea`}function cr(e,t,n,r){ze(r),t=ui(t,`onChange`),0<t.length&&(n=new Tn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var lr=null,ur=null;function dr(e){ni(e,0)}function fr(e){if(de(Ri(e)))return e}function pr(e,t){if(e===`change`)return t}var mr=!1;if(c){var hr;if(c){var gr=`oninput`in document;if(!gr){var _r=document.createElement(`div`);_r.setAttribute(`oninput`,`return;`),gr=typeof _r.oninput==`function`}hr=gr}else hr=!1;mr=hr&&(!document.documentMode||9<document.documentMode)}function vr(){lr&&(lr.detachEvent(`onpropertychange`,yr),ur=lr=null)}function yr(e){if(e.propertyName===`value`&&fr(ur)){var t=[];cr(t,ur,e,Pe(e)),We(dr,t)}}function br(e,t,n){e===`focusin`?(vr(),lr=t,ur=n,lr.attachEvent(`onpropertychange`,yr)):e===`focusout`&&vr()}function xr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return fr(ur)}function Sr(e,t){if(e===`click`)return fr(t)}function Cr(e,t){if(e===`input`||e===`change`)return fr(t)}function wr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Tr=typeof Object.is==`function`?Object.is:wr;function Er(e,t){if(Tr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!l.call(t,i)||!Tr(e[i],t[i]))return!1}return!0}function Dr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Or(e,t){var n=Dr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Dr(n)}}function kr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?kr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ar(){for(var e=window,t=fe();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=fe(e.document)}return t}function jr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}function Mr(e){var t=Ar(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&kr(n.ownerDocument.documentElement,n)){if(r!==null&&jr(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),`selectionStart`in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,a=Math.min(r.start,i);r=r.end===void 0?a:Math.min(r.end,i),!e.extend&&a>r&&(i=r,r=a,a=i),i=Or(n,a);var o=Or(n,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus==`function`&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Nr=c&&`documentMode`in document&&11>=document.documentMode,Pr=null,Fr=null,Ir=null,Lr=!1;function Rr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Lr||Pr==null||Pr!==fe(r)||(r=Pr,`selectionStart`in r&&jr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ir&&Er(Ir,r)||(Ir=r,r=ui(Fr,`onSelect`),0<r.length&&(t=new Tn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Pr)))}function zr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Br={animationend:zr(`Animation`,`AnimationEnd`),animationiteration:zr(`Animation`,`AnimationIteration`),animationstart:zr(`Animation`,`AnimationStart`),transitionend:zr(`Transition`,`TransitionEnd`)},Vr={},Hr={};c&&(Hr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Br.animationend.animation,delete Br.animationiteration.animation,delete Br.animationstart.animation),`TransitionEvent`in window||delete Br.transitionend.transition);function Ur(e){if(Vr[e])return Vr[e];if(!Br[e])return e;var t=Br[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hr)return Vr[e]=t[n];return e}var Wr=Ur(`animationend`),Gr=Ur(`animationiteration`),Kr=Ur(`animationstart`),qr=Ur(`transitionend`),Jr=new Map,Yr=`abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);function Xr(e,t){Jr.set(e,t),o(t,[e])}for(var Zr=0;Zr<Yr.length;Zr++){var Qr=Yr[Zr];Xr(Qr.toLowerCase(),`on`+(Qr[0].toUpperCase()+Qr.slice(1)))}Xr(Wr,`onAnimationEnd`),Xr(Gr,`onAnimationIteration`),Xr(Kr,`onAnimationStart`),Xr(`dblclick`,`onDoubleClick`),Xr(`focusin`,`onFocus`),Xr(`focusout`,`onBlur`),Xr(qr,`onTransitionEnd`),s(`onMouseEnter`,[`mouseout`,`mouseover`]),s(`onMouseLeave`,[`mouseout`,`mouseover`]),s(`onPointerEnter`,[`pointerout`,`pointerover`]),s(`onPointerLeave`,[`pointerout`,`pointerover`]),o(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),o(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),o(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),o(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),o(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),o(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var $r=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),ei=new Set(`cancel close invalid load scroll toggle`.split(` `).concat($r));function ti(e,t,n){var r=e.type||`unknown-event`;e.currentTarget=n,tt(r,t,void 0,e),e.currentTarget=null}function ni(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;ti(i,s,l),a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;ti(i,s,l),a=c}}}if(Ze)throw e=Qe,Ze=!1,Qe=null,e}function ri(e,t){var n=t[Ni];n===void 0&&(n=t[Ni]=new Set);var r=e+`__bubble`;n.has(r)||(si(t,e,2,!1),n.add(r))}function ii(e,t,n){var r=0;t&&(r|=4),si(n,e,r,t)}var ai=`_reactListening`+Math.random().toString(36).slice(2);function oi(e){if(!e[ai]){e[ai]=!0,i.forEach(function(t){t!==`selectionchange`&&(ei.has(t)||ii(t,!1,e),ii(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ai]||(t[ai]=!0,ii(`selectionchange`,!1,t))}}function si(e,t,n,r){switch(hn(t)){case 1:var i=un;break;case 4:i=dn;break;default:i=fn}n=i.bind(null,t,n,e),i=void 0,!Ke||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function ci(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i||s.nodeType===8&&s.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===i||c.nodeType===8&&c.parentNode===i))return;o=o.return}for(;s!==null;){if(o=Ii(s),o===null)return;if(c=o.tag,c===5||c===6){r=a=o;continue a}s=s.parentNode}}r=r.return}We(function(){var r=a,i=Pe(n),o=[];a:{var s=Jr.get(e);if(s!==void 0){var c=Tn,l=e;switch(e){case`keypress`:if(bn(n)===0)break a;case`keydown`:case`keyup`:c=Un;break;case`focusin`:l=`focus`,c=Pn;break;case`focusout`:l=`blur`,c=Pn;break;case`beforeblur`:case`afterblur`:c=Pn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=Mn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=Nn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=Gn;break;case Wr:case Gr:case Kr:c=Fn;break;case qr:c=Kn;break;case`scroll`:c=Dn;break;case`wheel`:c=qn;break;case`copy`:case`cut`:case`paste`:c=In;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=Wn}var u=!!(t&4),d=!u&&e===`scroll`,f=u?s===null?null:s+`Capture`:s;u=[];for(var p=r,m;p!==null;){m=p;var h=m.stateNode;if(m.tag===5&&h!==null&&(m=h,f!==null&&(h=Ge(p,f),h!=null&&u.push(li(p,h,m)))),d)break;p=p.return}0<u.length&&(s=new c(s,l,null,n,i),o.push({event:s,listeners:u}))}}if(!(t&7)){a:{if(s=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,s&&n!==Ne&&(l=n.relatedTarget||n.fromElement)&&(Ii(l)||l[Mi]))break a;if((c||s)&&(s=i.window===i?i:(s=i.ownerDocument)?s.defaultView||s.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Ii(l):null,l!==null&&(d=nt(l),l!==d||l.tag!==5&&l.tag!==6)&&(l=null)):(c=null,l=r),c!==l)){if(u=Mn,h=`onMouseLeave`,f=`onMouseEnter`,p=`mouse`,(e===`pointerout`||e===`pointerover`)&&(u=Wn,h=`onPointerLeave`,f=`onPointerEnter`,p=`pointer`),d=c==null?s:Ri(c),m=l==null?s:Ri(l),s=new u(h,p+`leave`,c,n,i),s.target=d,s.relatedTarget=m,h=null,Ii(i)===r&&(u=new u(f,p+`enter`,l,n,i),u.target=m,u.relatedTarget=d,h=u),d=h,c&&l)b:{for(u=c,f=l,p=0,m=u;m;m=di(m))p++;for(m=0,h=f;h;h=di(h))m++;for(;0<p-m;)u=di(u),p--;for(;0<m-p;)f=di(f),m--;for(;p--;){if(u===f||f!==null&&u===f.alternate)break b;u=di(u),f=di(f)}u=null}else u=null;c!==null&&fi(o,s,c,u,!1),l!==null&&d!==null&&fi(o,d,l,u,!0)}}a:{if(s=r?Ri(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var g=pr;else if(sr(s))if(mr)g=Cr;else{g=xr;var _=br}else(c=s.nodeName)&&c.toLowerCase()===`input`&&(s.type===`checkbox`||s.type===`radio`)&&(g=Sr);if(g&&=g(e,r)){cr(o,g,n,i);break a}_&&_(e,s,r),e===`focusout`&&(_=s._wrapperState)&&_.controlled&&s.type===`number`&&B(s,`number`,s.value)}switch(_=r?Ri(r):window,e){case`focusin`:(sr(_)||_.contentEditable===`true`)&&(Pr=_,Fr=r,Ir=null);break;case`focusout`:Ir=Fr=Pr=null;break;case`mousedown`:Lr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Lr=!1,Rr(o,n,i);break;case`selectionchange`:if(Nr)break;case`keydown`:case`keyup`:Rr(o,n,i)}var v;if(Yn)b:{switch(e){case`compositionstart`:var y=`onCompositionStart`;break b;case`compositionend`:y=`onCompositionEnd`;break b;case`compositionupdate`:y=`onCompositionUpdate`;break b}y=void 0}else rr?tr(e,n)&&(y=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(y=`onCompositionStart`);y&&(Qn&&n.locale!==`ko`&&(rr||y!==`onCompositionStart`?y===`onCompositionEnd`&&rr&&(v=yn()):(gn=i,_n=`value`in gn?gn.value:gn.textContent,rr=!0)),_=ui(r,y),0<_.length&&(y=new Ln(y,e,null,n,i),o.push({event:y,listeners:_}),v?y.data=v:(v=nr(n),v!==null&&(y.data=v)))),(v=Zn?ir(e,n):ar(e,n))&&(r=ui(r,`onBeforeInput`),0<r.length&&(i=new Ln(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:i,listeners:r}),i.data=v))}ni(o,t)})}function li(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ui(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=Ge(e,n),a!=null&&r.unshift(li(e,a,i)),a=Ge(e,t),a!=null&&r.push(li(e,a,i))),e=e.return}return r}function di(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function fi(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(c!==null&&c===r)break;s.tag===5&&l!==null&&(s=l,i?(c=Ge(n,a),c!=null&&o.unshift(li(n,c,s))):i||(c=Ge(n,a),c!=null&&o.push(li(n,c,s)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var pi=/\r\n?/g,mi=/\u0000|\uFFFD/g;function hi(e){return(typeof e==`string`?e:``+e).replace(pi,`
`).replace(mi,``)}function gi(e,t,n){if(t=hi(t),hi(e)!==t&&n)throw Error(r(425))}function _i(){}var vi=null,yi=null;function bi(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var xi=typeof setTimeout==`function`?setTimeout:void 0,Si=typeof clearTimeout==`function`?clearTimeout:void 0,Ci=typeof Promise==`function`?Promise:void 0,wi=typeof queueMicrotask==`function`?queueMicrotask:Ci===void 0?xi:function(e){return Ci.resolve(null).then(e).catch(Ti)};function Ti(e){setTimeout(function(){throw e})}function Ei(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`){if(r===0){e.removeChild(i),sn(t);return}r--}else n!==`$`&&n!==`$?`&&n!==`$!`||r++;n=i}while(n);sn(t)}function Di(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`)break;if(t===`/$`)return null}}return e}function Oi(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`){if(t===0)return e;t--}else n===`/$`&&t++}e=e.previousSibling}return null}var ki=Math.random().toString(36).slice(2),Ai=`__reactFiber$`+ki,ji=`__reactProps$`+ki,Mi=`__reactContainer$`+ki,Ni=`__reactEvents$`+ki,Pi=`__reactListeners$`+ki,Fi=`__reactHandles$`+ki;function Ii(e){var t=e[Ai];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Mi]||n[Ai]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Oi(e);e!==null;){if(n=e[Ai])return n;e=Oi(e)}return t}e=n,n=e.parentNode}return null}function Li(e){return e=e[Ai]||e[Mi],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Ri(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(r(33))}function zi(e){return e[ji]||null}var Bi=[],Vi=-1;function Hi(e){return{current:e}}function Ui(e){0>Vi||(e.current=Bi[Vi],Bi[Vi]=null,Vi--)}function Wi(e,t){Vi++,Bi[Vi]=e.current,e.current=t}var Gi={},Ki=Hi(Gi),qi=Hi(!1),Ji=Gi;function Yi(e,t){var n=e.type.contextTypes;if(!n)return Gi;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in n)i[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function Xi(e){return e=e.childContextTypes,e!=null}function Zi(){Ui(qi),Ui(Ki)}function Qi(e,t,n){if(Ki.current!==Gi)throw Error(r(168));Wi(Ki,t),Wi(qi,n)}function $i(e,t,n){var i=e.stateNode;if(t=t.childContextTypes,typeof i.getChildContext!=`function`)return n;for(var a in i=i.getChildContext(),i)if(!(a in t))throw Error(r(108,oe(e)||`Unknown`,a));return ne({},n,i)}function ea(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Gi,Ji=Ki.current,Wi(Ki,e),Wi(qi,qi.current),!0}function ta(e,t,n){var i=e.stateNode;if(!i)throw Error(r(169));n?(e=$i(e,t,Ji),i.__reactInternalMemoizedMergedChildContext=e,Ui(qi),Ui(Ki),Wi(Ki,e)):Ui(qi),Wi(qi,n)}var na=null,ra=!1,ia=!1;function aa(e){na===null?na=[e]:na.push(e)}function oa(e){ra=!0,aa(e)}function sa(){if(!ia&&na!==null){ia=!0;var e=0,t=Lt;try{var n=na;for(Lt=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}na=null,ra=!1}catch(t){throw na!==null&&(na=na.slice(e+1)),ct(pt,sa),t}finally{Lt=t,ia=!1}}return null}var ca=[],la=0,ua=null,da=0,fa=[],pa=0,ma=null,ha=1,ga=``;function _a(e,t){ca[la++]=da,ca[la++]=ua,ua=e,da=t}function va(e,t,n){fa[pa++]=ha,fa[pa++]=ga,fa[pa++]=ma,ma=e;var r=ha;e=ga;var i=32-xt(r)-1;r&=~(1<<i),n+=1;var a=32-xt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,ha=1<<32-xt(t)+i|n<<i|r,ga=a+e}else ha=1<<a|n<<i|r,ga=e}function ya(e){e.return!==null&&(_a(e,1),va(e,1,0))}function ba(e){for(;e===ua;)ua=ca[--la],ca[la]=null,da=ca[--la],ca[la]=null;for(;e===ma;)ma=fa[--pa],fa[pa]=null,ga=fa[--pa],fa[pa]=null,ha=fa[--pa],fa[pa]=null}var xa=null,Sa=null,Ca=!1,wa=null;function Ta(e,t){var n=Zl(5,null,null,0);n.elementType=`DELETED`,n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ea(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null&&(e.stateNode=t,xa=e,Sa=Di(t.firstChild),!0);case 6:return t=e.pendingProps===``||t.nodeType!==3?null:t,t!==null&&(e.stateNode=t,xa=e,Sa=null,!0);case 13:return t=t.nodeType===8?t:null,t!==null&&(n=ma===null?null:{id:ha,overflow:ga},e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Zl(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,xa=e,Sa=null,!0);default:return!1}}function Da(e){return!!(e.mode&1)&&!(e.flags&128)}function Oa(e){if(Ca){var t=Sa;if(t){var n=t;if(!Ea(e,t)){if(Da(e))throw Error(r(418));t=Di(n.nextSibling);var i=xa;t&&Ea(e,t)?Ta(i,n):(e.flags=e.flags&-4097|2,Ca=!1,xa=e)}}else{if(Da(e))throw Error(r(418));e.flags=e.flags&-4097|2,Ca=!1,xa=e}}}function ka(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;xa=e}function Aa(e){if(e!==xa)return!1;if(!Ca)return ka(e),Ca=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!==`head`&&t!==`body`&&!bi(e.type,e.memoizedProps)),t&&=Sa){if(Da(e))throw ja(),Error(r(418));for(;t;)Ta(e,t),t=Di(t.nextSibling)}if(ka(e),e.tag===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(r(317));a:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`){if(t===0){Sa=Di(e.nextSibling);break a}t--}else n!==`$`&&n!==`$!`&&n!==`$?`||t++}e=e.nextSibling}Sa=null}}else Sa=xa?Di(e.stateNode.nextSibling):null;return!0}function ja(){for(var e=Sa;e;)e=Di(e.nextSibling)}function Ma(){Sa=xa=null,Ca=!1}function Na(e){wa===null?wa=[e]:wa.push(e)}var Pa=C.ReactCurrentBatchConfig;function Fa(e,t,n){if(e=n.ref,e!==null&&typeof e!=`function`&&typeof e!=`object`){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(r(309));var i=n.stateNode}if(!i)throw Error(r(147,e));var a=i,o=``+e;return t!==null&&t.ref!==null&&typeof t.ref==`function`&&t.ref._stringRef===o?t.ref:(t=function(e){var t=a.refs;e===null?delete t[o]:t[o]=e},t._stringRef=o,t)}if(typeof e!=`string`)throw Error(r(284));if(!n._owner)throw Error(r(290,e))}return e}function Ia(e,t){throw e=Object.prototype.toString.call(t),Error(r(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e))}function La(e){var t=e._init;return t(e._payload)}function Ra(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function i(e,t){for(e=new Map;t!==null;)t.key===null?e.set(t.index,t):e.set(t.key,t),t=t.sibling;return e}function a(e,t){return e=eu(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=2,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=2),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=iu(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===E?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===F&&La(i)===t.type)?(r=a(t,n.props),r.ref=Fa(e,t,n),r.return=e,r):(r=tu(n.type,n.key,n.props,null,e.mode,r),r.ref=Fa(e,t,n),r.return=e,r)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=au(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=nu(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`)return t=iu(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case w:return n=tu(t.type,t.key,t.props,null,e.mode,n),n.ref=Fa(e,null,t),n.return=e,n;case T:return t=au(t,e.mode,n),t.return=e,t;case F:var r=t._init;return f(e,r(t._payload),n)}if(ve(t)||te(t))return t=nu(t,e.mode,n,null),t.return=e,t;Ia(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case w:return n.key===i?l(e,t,n,r):null;case T:return n.key===i?u(e,t,n,r):null;case F:return i=n._init,p(e,t,i(n._payload),r)}if(ve(n)||te(n))return i===null?d(e,t,n,r,null):null;Ia(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case w:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case T:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case F:var a=r._init;return m(e,t,n,a(r._payload),i)}if(ve(r)||te(r))return e=e.get(n)||null,d(t,e,r,i,null);Ia(t,r)}return null}function h(r,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(r,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(r,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(r,d),Ca&&_a(r,h),l;if(d===null){for(;h<s.length;h++)d=f(r,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return Ca&&_a(r,h),l}for(d=i(r,d);h<s.length;h++)g=m(d,r,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(r,e)}),Ca&&_a(r,h),l}function g(a,s,c,l){var u=te(c);if(typeof u!=`function`)throw Error(r(150));if(c=u.call(c),c==null)throw Error(r(151));for(var d=u=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),Ca&&_a(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return Ca&&_a(a,g),u}for(h=i(a,h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),Ca&&_a(a,g),u}function _(e,r,i,o){if(typeof i==`object`&&i&&i.type===E&&i.key===null&&(i=i.props.children),typeof i==`object`&&i){switch(i.$$typeof){case w:a:{for(var c=i.key,l=r;l!==null;){if(l.key===c){if(c=i.type,c===E){if(l.tag===7){n(e,l.sibling),r=a(l,i.props.children),r.return=e,e=r;break a}}else if(l.elementType===c||typeof c==`object`&&c&&c.$$typeof===F&&La(c)===l.type){n(e,l.sibling),r=a(l,i.props),r.ref=Fa(e,l,i),r.return=e,e=r;break a}n(e,l);break}t(e,l),l=l.sibling}i.type===E?(r=nu(i.props.children,e.mode,o,i.key),r.return=e,e=r):(o=tu(i.type,i.key,i.props,null,e.mode,o),o.ref=Fa(e,r,i),o.return=e,e=o)}return s(e);case T:a:{for(l=i.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),r=a(r,i.children||[]),r.return=e,e=r;break a}else{n(e,r);break}t(e,r),r=r.sibling}r=au(i,e.mode,o),r.return=e,e=r}return s(e);case F:return l=i._init,_(e,r,l(i._payload),o)}if(ve(i))return h(e,r,i,o);if(te(i))return g(e,r,i,o);Ia(e,i)}return typeof i==`string`&&i!==``||typeof i==`number`?(i=``+i,r!==null&&r.tag===6?(n(e,r.sibling),r=a(r,i),r.return=e,e=r):(n(e,r),r=iu(i,e.mode,o),r.return=e,e=r),s(e)):n(e,r)}return _}var za=Ra(!0),Ba=Ra(!1),Va=Hi(null),Ha=null,Ua=null,Wa=null;function K(){Wa=Ua=Ha=null}function Ga(e){var t=Va.current;Ui(Va),e._currentValue=t}function Ka(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function qa(e,t){Ha=e,Wa=Ua=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Ls=!0),e.firstContext=null)}function Ja(e){var t=e._currentValue;if(Wa!==e)if(e={context:e,memoizedValue:t,next:null},Ua===null){if(Ha===null)throw Error(r(308));Ua=e,Ha.dependencies={lanes:0,firstContext:e}}else Ua=Ua.next=e;return t}var Ya=null;function Xa(e){Ya===null?Ya=[e]:Ya.push(e)}function Za(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,Xa(t)):(n.next=i.next,i.next=n),t.interleaved=n,Qa(e,r)}function Qa(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var $a=!1;function eo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function to(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function no(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ro(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,Gc&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,Qa(e,n)}return i=r.interleaved,i===null?(t.next=t,Xa(r)):(t.next=i.next,i.next=t),r.interleaved=t,Qa(e,n)}function io(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194240)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,It(e,n)}}function ao(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function oo(e,t,n,r){var i=e.updateQueue;$a=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane,p=s.eventTime;if((r&f)===f){u!==null&&(u=u.next={eventTime:p,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});a:{var m=e,h=s;switch(f=t,p=n,h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(p,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(p,d,f):m,f==null)break a;d=ne({},d,f);break a;case 2:$a=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,f=i.effects,f===null?i.effects=[s]:f.push(s))}else p={eventTime:p,lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;f=s,s=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(1);if(u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,t=i.shared.interleaved,t!==null){i=t;do o|=i.lane,i=i.next;while(i!==t)}else a===null&&(i.shared.lanes=0);$c|=o,e.lanes=o,e.memoizedState=d}}function so(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var i=e[t],a=i.callback;if(a!==null){if(i.callback=null,i=n,typeof a!=`function`)throw Error(r(191,a));a.call(i)}}}var co={},lo=Hi(co),uo=Hi(co),fo=Hi(co);function po(e){if(e===co)throw Error(r(174));return e}function mo(e,t){switch(Wi(fo,t),Wi(uo,e),Wi(lo,co),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Se(null,``);break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Se(t,e)}Ui(lo),Wi(lo,t)}function ho(){Ui(lo),Ui(uo),Ui(fo)}function go(e){po(fo.current);var t=po(lo.current),n=Se(t,e.type);t!==n&&(Wi(uo,e),Wi(lo,n))}function _o(e){uo.current===e&&(Ui(lo),Ui(uo))}var vo=Hi(0);function yo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data===`$?`||n.data===`$!`))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var bo=[];function xo(){for(var e=0;e<bo.length;e++)bo[e]._workInProgressVersionPrimary=null;bo.length=0}var So=C.ReactCurrentDispatcher,Co=C.ReactCurrentBatchConfig,wo=0,To=null,Eo=null,Do=null,Oo=!1,ko=!1,Ao=0,jo=0;function Mo(){throw Error(r(321))}function No(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Tr(e[n],t[n]))return!1;return!0}function Po(e,t,n,i,a,o){if(wo=o,To=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,So.current=e===null||e.memoizedState===null?_s:vs,e=n(i,a),ko){o=0;do{if(ko=!1,Ao=0,25<=o)throw Error(r(301));o+=1,Do=Eo=null,t.updateQueue=null,So.current=ys,e=n(i,a)}while(ko)}if(So.current=gs,t=Eo!==null&&Eo.next!==null,wo=0,Do=Eo=To=null,Oo=!1,t)throw Error(r(300));return e}function Fo(){var e=Ao!==0;return Ao=0,e}function Io(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Do===null?To.memoizedState=Do=e:Do=Do.next=e,Do}function Lo(){if(Eo===null){var e=To.alternate;e=e===null?null:e.memoizedState}else e=Eo.next;var t=Do===null?To.memoizedState:Do.next;if(t!==null)Do=t,Eo=e;else{if(e===null)throw Error(r(310));Eo=e,e={memoizedState:Eo.memoizedState,baseState:Eo.baseState,baseQueue:Eo.baseQueue,queue:Eo.queue,next:null},Do===null?To.memoizedState=Do=e:Do=Do.next=e}return Do}function Ro(e,t){return typeof t==`function`?t(e):t}function zo(e){var t=Lo(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var i=Eo,a=i.baseQueue,o=n.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}i.baseQueue=a=o,n.pending=null}if(a!==null){o=a.next,i=i.baseState;var c=s=null,l=null,u=o;do{var d=u.lane;if((wo&d)===d)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:e(i,u.action);else{var f={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(c=l=f,s=i):l=l.next=f,To.lanes|=d,$c|=d}u=u.next}while(u!==null&&u!==o);l===null?s=i:l.next=c,Tr(i,t.memoizedState)||(Ls=!0),t.memoizedState=i,t.baseState=s,t.baseQueue=l,n.lastRenderedState=i}if(e=n.interleaved,e!==null){a=e;do o=a.lane,To.lanes|=o,$c|=o,a=a.next;while(a!==e)}else a===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Bo(e){var t=Lo(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var i=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Tr(o,t.memoizedState)||(Ls=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,i]}function Vo(){}function Ho(e,t){var n=To,i=Lo(),a=t(),o=!Tr(i.memoizedState,a);if(o&&(i.memoizedState=a,Ls=!0),i=i.queue,es(Go.bind(null,n,i,e),[e]),i.getSnapshot!==t||o||Do!==null&&Do.memoizedState.tag&1){if(n.flags|=2048,Yo(9,Wo.bind(null,n,i,a,t),void 0,null),Kc===null)throw Error(r(349));wo&30||Uo(n,t,a)}return a}function Uo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=To.updateQueue,t===null?(t={lastEffect:null,stores:null},To.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Wo(e,t,n,r){t.value=n,t.getSnapshot=r,Ko(t)&&qo(e)}function Go(e,t,n){return n(function(){Ko(t)&&qo(e)})}function Ko(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Tr(e,n)}catch{return!0}}function qo(e){var t=Qa(e,1);t!==null&&yl(t,e,1,-1)}function Jo(e){var t=Io();return typeof e==`function`&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ro,lastRenderedState:e},t.queue=e,e=e.dispatch=fs.bind(null,To,e),[t.memoizedState,e]}function Yo(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=To.updateQueue,t===null?(t={lastEffect:null,stores:null},To.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Xo(){return Lo().memoizedState}function Zo(e,t,n,r){var i=Io();To.flags|=e,i.memoizedState=Yo(1|t,n,void 0,r===void 0?null:r)}function Qo(e,t,n,r){var i=Lo();r=r===void 0?null:r;var a=void 0;if(Eo!==null){var o=Eo.memoizedState;if(a=o.destroy,r!==null&&No(r,o.deps)){i.memoizedState=Yo(t,n,a,r);return}}To.flags|=e,i.memoizedState=Yo(1|t,n,a,r)}function $o(e,t){return Zo(8390656,8,e,t)}function es(e,t){return Qo(2048,8,e,t)}function ts(e,t){return Qo(4,2,e,t)}function ns(e,t){return Qo(4,4,e,t)}function rs(e,t){if(typeof t==`function`)return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function is(e,t,n){return n=n==null?null:n.concat([e]),Qo(4,4,rs.bind(null,t,e),n)}function as(){}function os(e,t){var n=Lo();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&No(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ss(e,t){var n=Lo();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&No(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function cs(e,t,n){return wo&21?(Tr(n,t)||(n=Mt(),To.lanes|=n,$c|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Ls=!0),e.memoizedState=n)}function ls(e,t){var n=Lt;Lt=n!==0&&4>n?n:4,e(!0);var r=Co.transition;Co.transition={};try{e(!1),t()}finally{Lt=n,Co.transition=r}}function us(){return Lo().memoizedState}function ds(e,t,n){var r=vl(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},ps(e))ms(t,n);else if(n=Za(e,t,n,r),n!==null){var i=_l();yl(n,e,r,i),hs(n,t,r)}}function fs(e,t,n){var r=vl(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(ps(e))ms(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Tr(s,o)){var c=t.interleaved;c===null?(i.next=i,Xa(t)):(i.next=c.next,c.next=i),t.interleaved=i;return}}catch{}n=Za(e,t,i,r),n!==null&&(i=_l(),yl(n,e,r,i),hs(n,t,r))}}function ps(e){var t=e.alternate;return e===To||t!==null&&t===To}function ms(e,t){ko=Oo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function hs(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,It(e,n)}}var gs={readContext:Ja,useCallback:Mo,useContext:Mo,useEffect:Mo,useImperativeHandle:Mo,useInsertionEffect:Mo,useLayoutEffect:Mo,useMemo:Mo,useReducer:Mo,useRef:Mo,useState:Mo,useDebugValue:Mo,useDeferredValue:Mo,useTransition:Mo,useMutableSource:Mo,useSyncExternalStore:Mo,useId:Mo,unstable_isNewReconciler:!1},_s={readContext:Ja,useCallback:function(e,t){return Io().memoizedState=[e,t===void 0?null:t],e},useContext:Ja,useEffect:$o,useImperativeHandle:function(e,t,n){return n=n==null?null:n.concat([e]),Zo(4194308,4,rs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Zo(4194308,4,e,t)},useInsertionEffect:function(e,t){return Zo(4,2,e,t)},useMemo:function(e,t){var n=Io();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Io();return t=n===void 0?t:n(t),r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=ds.bind(null,To,e),[r.memoizedState,e]},useRef:function(e){var t=Io();return e={current:e},t.memoizedState=e},useState:Jo,useDebugValue:as,useDeferredValue:function(e){return Io().memoizedState=e},useTransition:function(){var e=Jo(!1),t=e[0];return e=ls.bind(null,e[1]),Io().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var i=To,a=Io();if(Ca){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),Kc===null)throw Error(r(349));wo&30||Uo(i,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,$o(Go.bind(null,i,o,e),[e]),i.flags|=2048,Yo(9,Wo.bind(null,i,o,n,t),void 0,null),n},useId:function(){var e=Io(),t=Kc.identifierPrefix;if(Ca){var n=ga,r=ha;n=(r&~(1<<32-xt(r)-1)).toString(32)+n,t=`:`+t+`R`+n,n=Ao++,0<n&&(t+=`H`+n.toString(32)),t+=`:`}else n=jo++,t=`:`+t+`r`+n.toString(32)+`:`;return e.memoizedState=t},unstable_isNewReconciler:!1},vs={readContext:Ja,useCallback:os,useContext:Ja,useEffect:es,useImperativeHandle:is,useInsertionEffect:ts,useLayoutEffect:ns,useMemo:ss,useReducer:zo,useRef:Xo,useState:function(){return zo(Ro)},useDebugValue:as,useDeferredValue:function(e){return cs(Lo(),Eo.memoizedState,e)},useTransition:function(){return[zo(Ro)[0],Lo().memoizedState]},useMutableSource:Vo,useSyncExternalStore:Ho,useId:us,unstable_isNewReconciler:!1},ys={readContext:Ja,useCallback:os,useContext:Ja,useEffect:es,useImperativeHandle:is,useInsertionEffect:ts,useLayoutEffect:ns,useMemo:ss,useReducer:Bo,useRef:Xo,useState:function(){return Bo(Ro)},useDebugValue:as,useDeferredValue:function(e){var t=Lo();return Eo===null?t.memoizedState=e:cs(t,Eo.memoizedState,e)},useTransition:function(){return[Bo(Ro)[0],Lo().memoizedState]},useMutableSource:Vo,useSyncExternalStore:Ho,useId:us,unstable_isNewReconciler:!1};function bs(e,t){if(e&&e.defaultProps){for(var n in t=ne({},t),e=e.defaultProps,e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function xs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:ne({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ss={isMounted:function(e){return(e=e._reactInternals)?nt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=_l(),i=vl(e),a=no(r,i);a.payload=t,n!=null&&(a.callback=n),t=ro(e,a,i),t!==null&&(yl(t,e,i,r),io(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=_l(),i=vl(e),a=no(r,i);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=ro(e,a,i),t!==null&&(yl(t,e,i,r),io(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=_l(),r=vl(e),i=no(n,r);i.tag=2,t!=null&&(i.callback=t),t=ro(e,i,r),t!==null&&(yl(t,e,r,n),io(t,e,r))}};function Cs(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Er(n,r)||!Er(i,a):!0}function ws(e,t,n){var r=!1,i=Gi,a=t.contextType;return typeof a==`object`&&a?a=Ja(a):(i=Xi(t)?Ji:Ki.current,r=t.contextTypes,a=(r=r!=null)?Yi(e,i):Gi),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ss,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=a),t}function Ts(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ss.enqueueReplaceState(t,t.state,null)}function Es(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},eo(e);var a=t.contextType;typeof a==`object`&&a?i.context=Ja(a):(a=Xi(t)?Ji:Ki.current,i.context=Yi(e,a)),i.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a==`function`&&(xs(e,t,a,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps==`function`||typeof i.getSnapshotBeforeUpdate==`function`||typeof i.UNSAFE_componentWillMount!=`function`&&typeof i.componentWillMount!=`function`||(t=i.state,typeof i.componentWillMount==`function`&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount==`function`&&i.UNSAFE_componentWillMount(),t!==i.state&&Ss.enqueueReplaceState(i,i.state,null),oo(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount==`function`&&(e.flags|=4194308)}function Ds(e,t){try{var n=``,r=t;do n+=ie(r),r=r.return;while(r);var i=n}catch(e){i=`
Error generating stack: `+e.message+`
`+e.stack}return{value:e,source:t,stack:i,digest:null}}function Os(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ks(e,t){try{console.error(t.value)}catch(e){setTimeout(function(){throw e})}}var As=typeof WeakMap==`function`?WeakMap:Map;function js(e,t,n){n=no(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){sl||(sl=!0,cl=r),ks(e,t)},n}function Ms(e,t,n){n=no(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r==`function`){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){ks(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch==`function`&&(n.callback=function(){ks(e,t),typeof r!=`function`&&(ll===null?ll=new Set([this]):ll.add(this));var n=t.stack;this.componentDidCatch(t.value,{componentStack:n===null?``:n})}),n}function Ns(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new As;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=Wl.bind(null,e,t,n),t.then(e,e))}function Ps(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t===null||t.dehydrated!==null),t)return e;e=e.return}while(e!==null);return null}function Fs(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=no(-1,1),t.tag=2,ro(n,t,1))),n.lanes|=1),e)}var Is=C.ReactCurrentOwner,Ls=!1;function Rs(e,t,n,r){t.child=e===null?Ba(t,null,n,r):za(t,e.child,n,r)}function zs(e,t,n,r,i){n=n.render;var a=t.ref;return qa(t,i),r=Po(e,t,n,r,a,i),n=Fo(),e!==null&&!Ls?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,ic(e,t,i)):(Ca&&n&&ya(t),t.flags|=1,Rs(e,t,r,i),t.child)}function Bs(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!Ql(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Vs(e,t,a,r,i)):(e=tu(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&i)===0){var o=a.memoizedProps;if(n=n.compare,n=n===null?Er:n,n(o,r)&&e.ref===t.ref)return ic(e,t,i)}return t.flags|=1,e=eu(a,r),e.ref=t.ref,e.return=t,t.child=e}function Vs(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Er(a,r)&&e.ref===t.ref)if(Ls=!1,t.pendingProps=r=a,(e.lanes&i)!==0)e.flags&131072&&(Ls=!0);else return t.lanes=e.lanes,ic(e,t,i)}return Ws(e,t,n,r,i)}function Hs(e,t,n){var r=t.pendingProps,i=r.children,a=e===null?null:e.memoizedState;if(r.mode===`hidden`)if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Wi(Xc,Yc),Yc|=n;else{if(!(n&1073741824))return e=a===null?n:a.baseLanes|n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Wi(Xc,Yc),Yc|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a===null?n:a.baseLanes,Wi(Xc,Yc),Yc|=r}else a===null?r=n:(r=a.baseLanes|n,t.memoizedState=null),Wi(Xc,Yc),Yc|=r;return Rs(e,t,i,n),t.child}function Us(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ws(e,t,n,r,i){var a=Xi(n)?Ji:Ki.current;return a=Yi(t,a),qa(t,i),n=Po(e,t,n,r,a,i),r=Fo(),e!==null&&!Ls?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,ic(e,t,i)):(Ca&&r&&ya(t),t.flags|=1,Rs(e,t,n,i),t.child)}function q(e,t,n,r,i){if(Xi(n)){var a=!0;ea(t)}else a=!1;if(qa(t,i),t.stateNode===null)rc(e,t),ws(t,n,r),Es(t,n,r,i),r=!0;else if(e===null){var o=t.stateNode,s=t.memoizedProps;o.props=s;var c=o.context,l=n.contextType;typeof l==`object`&&l?l=Ja(l):(l=Xi(n)?Ji:Ki.current,l=Yi(t,l));var u=n.getDerivedStateFromProps,d=typeof u==`function`||typeof o.getSnapshotBeforeUpdate==`function`;d||typeof o.UNSAFE_componentWillReceiveProps!=`function`&&typeof o.componentWillReceiveProps!=`function`||(s!==r||c!==l)&&Ts(t,o,r,l),$a=!1;var f=t.memoizedState;o.state=f,oo(t,r,o,i),c=t.memoizedState,s!==r||f!==c||qi.current||$a?(typeof u==`function`&&(xs(t,n,u,r),c=t.memoizedState),(s=$a||Cs(t,n,s,r,f,c,l))?(d||typeof o.UNSAFE_componentWillMount!=`function`&&typeof o.componentWillMount!=`function`||(typeof o.componentWillMount==`function`&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount==`function`&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount==`function`&&(t.flags|=4194308)):(typeof o.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=c),o.props=r,o.state=c,o.context=l,r=s):(typeof o.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,to(e,t),s=t.memoizedProps,l=t.type===t.elementType?s:bs(t.type,s),o.props=l,d=t.pendingProps,f=o.context,c=n.contextType,typeof c==`object`&&c?c=Ja(c):(c=Xi(n)?Ji:Ki.current,c=Yi(t,c));var p=n.getDerivedStateFromProps;(u=typeof p==`function`||typeof o.getSnapshotBeforeUpdate==`function`)||typeof o.UNSAFE_componentWillReceiveProps!=`function`&&typeof o.componentWillReceiveProps!=`function`||(s!==d||f!==c)&&Ts(t,o,r,c),$a=!1,f=t.memoizedState,o.state=f,oo(t,r,o,i);var m=t.memoizedState;s!==d||f!==m||qi.current||$a?(typeof p==`function`&&(xs(t,n,p,r),m=t.memoizedState),(l=$a||Cs(t,n,l,r,f,m,c)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!=`function`&&typeof o.componentWillUpdate!=`function`||(typeof o.componentWillUpdate==`function`&&o.componentWillUpdate(r,m,c),typeof o.UNSAFE_componentWillUpdate==`function`&&o.UNSAFE_componentWillUpdate(r,m,c)),typeof o.componentDidUpdate==`function`&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof o.componentDidUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=m),o.props=r,o.state=m,o.context=c,r=l):(typeof o.componentDidUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return Gs(e,t,n,r,a,i)}function Gs(e,t,n,r,i,a){Us(e,t);var o=!!(t.flags&128);if(!r&&!o)return i&&ta(t,n,!1),ic(e,t,a);r=t.stateNode,Is.current=t;var s=o&&typeof n.getDerivedStateFromError!=`function`?null:r.render();return t.flags|=1,e!==null&&o?(t.child=za(t,e.child,null,a),t.child=za(t,null,s,a)):Rs(e,t,s,a),t.memoizedState=r.state,i&&ta(t,n,!0),t.child}function Ks(e){var t=e.stateNode;t.pendingContext?Qi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Qi(e,t.context,!1),mo(e,t.containerInfo)}function qs(e,t,n,r,i){return Ma(),Na(i),t.flags|=256,Rs(e,t,n,r),t.child}var Js={dehydrated:null,treeContext:null,retryLane:0};function Ys(e){return{baseLanes:e,cachePool:null,transitions:null}}function Xs(e,t,n){var r=t.pendingProps,i=vo.current,a=!1,o=!!(t.flags&128),s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:!!(i&2)),s?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),Wi(vo,i&1),e===null)return Oa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.lanes=t.mode&1?e.data===`$!`?8:1073741824:1,null):(o=r.children,e=r.fallback,a?(r=t.mode,a=t.child,o={mode:`hidden`,children:o},!(r&1)&&a!==null?(a.childLanes=0,a.pendingProps=o):a=ru(o,r,0,null),e=nu(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Ys(n),t.memoizedState=Js,e):Zs(t,o));if(i=e.memoizedState,i!==null&&(s=i.dehydrated,s!==null))return $s(e,t,o,r,s,i,n);if(a){a=r.fallback,o=t.mode,i=e.child,s=i.sibling;var c={mode:`hidden`,children:r.children};return!(o&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=c,t.deletions=null):(r=eu(i,c),r.subtreeFlags=i.subtreeFlags&14680064),s===null?(a=nu(a,o,n,null),a.flags|=2):a=eu(s,a),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,o=e.child.memoizedState,o=o===null?Ys(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},a.memoizedState=o,a.childLanes=e.childLanes&~n,t.memoizedState=Js,r}return a=e.child,e=a.sibling,r=eu(a,{mode:`visible`,children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Zs(e,t){return t=ru({mode:`visible`,children:t},e.mode,0,null),t.return=e,e.child=t}function Qs(e,t,n,r){return r!==null&&Na(r),za(t,e.child,null,n),e=Zs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function $s(e,t,n,i,a,o,s){if(n)return t.flags&256?(t.flags&=-257,i=Os(Error(r(422))),Qs(e,t,s,i)):t.memoizedState===null?(o=i.fallback,a=t.mode,i=ru({mode:`visible`,children:i.children},a,0,null),o=nu(o,a,s,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,t.mode&1&&za(t,e.child,null,s),t.child.memoizedState=Ys(s),t.memoizedState=Js,o):(t.child=e.child,t.flags|=128,null);if(!(t.mode&1))return Qs(e,t,s,null);if(a.data===`$!`){if(i=a.nextSibling&&a.nextSibling.dataset,i)var c=i.dgst;return i=c,o=Error(r(419)),i=Os(o,i,void 0),Qs(e,t,s,i)}if(c=(s&e.childLanes)!==0,Ls||c){if(i=Kc,i!==null){switch(s&-s){case 4:a=2;break;case 16:a=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:a=32;break;case 536870912:a=268435456;break;default:a=0}a=(a&(i.suspendedLanes|s))===0?a:0,a!==0&&a!==o.retryLane&&(o.retryLane=a,Qa(e,a),yl(i,e,a,-1))}return Nl(),i=Os(Error(r(421))),Qs(e,t,s,i)}return a.data===`$?`?(t.flags|=128,t.child=e.child,t=Kl.bind(null,e),a._reactRetry=t,null):(e=o.treeContext,Sa=Di(a.nextSibling),xa=t,Ca=!0,wa=null,e!==null&&(fa[pa++]=ha,fa[pa++]=ga,fa[pa++]=ma,ha=e.id,ga=e.overflow,ma=t),t=Zs(t,i.children),t.flags|=4096,t)}function ec(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ka(e.return,t,n)}function tc(e,t,n,r,i){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=i)}function nc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;if(Rs(e,t,r.children,n),r=vo.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ec(e,n,t);else if(e.tag===19)ec(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(Wi(vo,r),!(t.mode&1))t.memoizedState=null;else switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&yo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),tc(t,!1,i,n,a);break;case`backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&yo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}tc(t,!0,n,null,a);break;case`together`:tc(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function rc(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ic(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),$c|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=eu(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=eu(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ac(e,t,n){switch(t.tag){case 3:Ks(t),Ma();break;case 5:go(t);break;case 1:Xi(t.type)&&ea(t);break;case 4:mo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;Wi(Va,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(Wi(vo,vo.current&1),e=ic(e,t,n),e===null?null:e.sibling):Xs(e,t,n):(Wi(vo,vo.current&1),t.flags|=128,null);Wi(vo,vo.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return nc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Wi(vo,vo.current),r)break;return null;case 22:case 23:return t.lanes=0,Hs(e,t,n)}return ic(e,t,n)}var oc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},sc=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,po(lo.current);var o=null;switch(n){case`input`:i=pe(e,i),r=pe(e,r),o=[];break;case`select`:i=ne({},i,{value:void 0}),r=ne({},r,{value:void 0}),o=[];break;case`textarea`:i=be(e,i),r=be(e,r),o=[];break;default:typeof i.onClick!=`function`&&typeof r.onClick==`function`&&(e.onclick=_i)}je(n,r);var s;for(u in n=null,i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u===`style`){var c=i[u];for(s in c)c.hasOwnProperty(s)&&(n||={},n[s]=``)}else u!==`dangerouslySetInnerHTML`&&u!==`children`&&u!==`suppressContentEditableWarning`&&u!==`suppressHydrationWarning`&&u!==`autoFocus`&&(a.hasOwnProperty(u)?o||=[]:(o||=[]).push(u,null));for(u in r){var l=r[u];if(c=i?.[u],r.hasOwnProperty(u)&&l!==c&&(l!=null||c!=null))if(u===`style`)if(c){for(s in c)!c.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(n||={},n[s]=``);for(s in l)l.hasOwnProperty(s)&&c[s]!==l[s]&&(n||={},n[s]=l[s])}else n||(o||=[],o.push(u,n)),n=l;else u===`dangerouslySetInnerHTML`?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(o||=[]).push(u,l)):u===`children`?typeof l!=`string`&&typeof l!=`number`||(o||=[]).push(u,``+l):u!==`suppressContentEditableWarning`&&u!==`suppressHydrationWarning`&&(a.hasOwnProperty(u)?(l!=null&&u===`onScroll`&&ri(`scroll`,e),o||c===l||(o=[])):(o||=[]).push(u,l))}n&&(o||=[]).push(`style`,n);var u=o;(t.updateQueue=u)&&(t.flags|=4)}},cc=function(e,t,n,r){n!==r&&(t.flags|=4)};function lc(e,t){if(!Ca)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function uc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function dc(e,t,n){var i=t.pendingProps;switch(ba(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return uc(t),null;case 1:return Xi(t.type)&&Zi(),uc(t),null;case 3:return i=t.stateNode,ho(),Ui(qi),Ui(Ki),xo(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(e===null||e.child===null)&&(Aa(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,wa!==null&&(Cl(wa),wa=null))),uc(t),null;case 5:_o(t);var o=po(fo.current);if(n=t.type,e!==null&&t.stateNode!=null)sc(e,t,n,i,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!i){if(t.stateNode===null)throw Error(r(166));return uc(t),null}if(e=po(lo.current),Aa(t)){i=t.stateNode,n=t.type;var s=t.memoizedProps;switch(i[Ai]=t,i[ji]=s,e=!!(t.mode&1),n){case`dialog`:ri(`cancel`,i),ri(`close`,i);break;case`iframe`:case`object`:case`embed`:ri(`load`,i);break;case`video`:case`audio`:for(o=0;o<$r.length;o++)ri($r[o],i);break;case`source`:ri(`error`,i);break;case`img`:case`image`:case`link`:ri(`error`,i),ri(`load`,i);break;case`details`:ri(`toggle`,i);break;case`input`:me(i,s),ri(`invalid`,i);break;case`select`:i._wrapperState={wasMultiple:!!s.multiple},ri(`invalid`,i);break;case`textarea`:V(i,s),ri(`invalid`,i)}for(var c in je(n,s),o=null,s)if(s.hasOwnProperty(c)){var l=s[c];c===`children`?typeof l==`string`?i.textContent!==l&&(!0!==s.suppressHydrationWarning&&gi(i.textContent,l,e),o=[`children`,l]):typeof l==`number`&&i.textContent!==``+l&&(!0!==s.suppressHydrationWarning&&gi(i.textContent,l,e),o=[`children`,``+l]):a.hasOwnProperty(c)&&l!=null&&c===`onScroll`&&ri(`scroll`,i)}switch(n){case`input`:ue(i),_e(i,s,!0);break;case`textarea`:ue(i),H(i);break;case`select`:case`option`:break;default:typeof s.onClick==`function`&&(i.onclick=_i)}i=o,t.updateQueue=i,i!==null&&(t.flags|=4)}else{c=o.nodeType===9?o:o.ownerDocument,e===`http://www.w3.org/1999/xhtml`&&(e=U(n)),e===`http://www.w3.org/1999/xhtml`?n===`script`?(e=c.createElement(`div`),e.innerHTML=`<script><\/script>`,e=e.removeChild(e.firstChild)):typeof i.is==`string`?e=c.createElement(n,{is:i.is}):(e=c.createElement(n),n===`select`&&(c=e,i.multiple?c.multiple=!0:i.size&&(c.size=i.size))):e=c.createElementNS(e,n),e[Ai]=t,e[ji]=i,oc(e,t,!1,!1),t.stateNode=e;a:{switch(c=Me(n,i),n){case`dialog`:ri(`cancel`,e),ri(`close`,e),o=i;break;case`iframe`:case`object`:case`embed`:ri(`load`,e),o=i;break;case`video`:case`audio`:for(o=0;o<$r.length;o++)ri($r[o],e);o=i;break;case`source`:ri(`error`,e),o=i;break;case`img`:case`image`:case`link`:ri(`error`,e),ri(`load`,e),o=i;break;case`details`:ri(`toggle`,e),o=i;break;case`input`:me(e,i),o=pe(e,i),ri(`invalid`,e);break;case`option`:o=i;break;case`select`:e._wrapperState={wasMultiple:!!i.multiple},o=ne({},i,{value:void 0}),ri(`invalid`,e);break;case`textarea`:V(e,i),o=be(e,i),ri(`invalid`,e);break;default:o=i}for(s in je(n,o),l=o,l)if(l.hasOwnProperty(s)){var u=l[s];s===`style`?ke(e,u):s===`dangerouslySetInnerHTML`?(u=u?u.__html:void 0,u!=null&&we(e,u)):s===`children`?typeof u==`string`?(n!==`textarea`||u!==``)&&Te(e,u):typeof u==`number`&&Te(e,``+u):s!==`suppressContentEditableWarning`&&s!==`suppressHydrationWarning`&&s!==`autoFocus`&&(a.hasOwnProperty(s)?u!=null&&s===`onScroll`&&ri(`scroll`,e):u!=null&&S(e,s,u,c))}switch(n){case`input`:ue(e),_e(e,i,!1);break;case`textarea`:ue(e),H(e);break;case`option`:i.value!=null&&e.setAttribute(`value`,``+se(i.value));break;case`select`:e.multiple=!!i.multiple,s=i.value,s==null?i.defaultValue!=null&&ye(e,!!i.multiple,i.defaultValue,!0):ye(e,!!i.multiple,s,!1);break;default:typeof o.onClick==`function`&&(e.onclick=_i)}switch(n){case`button`:case`input`:case`select`:case`textarea`:i=!!i.autoFocus;break a;case`img`:i=!0;break a;default:i=!1}}i&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return uc(t),null;case 6:if(e&&t.stateNode!=null)cc(e,t,e.memoizedProps,i);else{if(typeof i!=`string`&&t.stateNode===null)throw Error(r(166));if(n=po(fo.current),po(lo.current),Aa(t)){if(i=t.stateNode,n=t.memoizedProps,i[Ai]=t,(s=i.nodeValue!==n)&&(e=xa,e!==null))switch(e.tag){case 3:gi(i.nodeValue,n,!!(e.mode&1));break;case 5:!0!==e.memoizedProps.suppressHydrationWarning&&gi(i.nodeValue,n,!!(e.mode&1))}s&&(t.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Ai]=t,t.stateNode=i}return uc(t),null;case 13:if(Ui(vo),i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Ca&&Sa!==null&&t.mode&1&&!(t.flags&128))ja(),Ma(),t.flags|=98560,s=!1;else if(s=Aa(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error(r(318));if(s=t.memoizedState,s=s===null?null:s.dehydrated,!s)throw Error(r(317));s[Ai]=t}else Ma(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;uc(t),s=!1}else wa!==null&&(Cl(wa),wa=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(i=i!==null,i!==(e!==null&&e.memoizedState!==null)&&i&&(t.child.flags|=8192,t.mode&1&&(e===null||vo.current&1?Zc===0&&(Zc=3):Nl())),t.updateQueue!==null&&(t.flags|=4),uc(t),null);case 4:return ho(),e===null&&oi(t.stateNode.containerInfo),uc(t),null;case 10:return Ga(t.type._context),uc(t),null;case 17:return Xi(t.type)&&Zi(),uc(t),null;case 19:if(Ui(vo),s=t.memoizedState,s===null)return uc(t),null;if(i=!!(t.flags&128),c=s.rendering,c===null)if(i)lc(s,!1);else{if(Zc!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(c=yo(e),c!==null){for(t.flags|=128,lc(s,!1),i=c.updateQueue,i!==null&&(t.updateQueue=i,t.flags|=4),t.subtreeFlags=0,i=n,n=t.child;n!==null;)s=n,e=i,s.flags&=14680066,c=s.alternate,c===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=c.childLanes,s.lanes=c.lanes,s.child=c.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=c.memoizedProps,s.memoizedState=c.memoizedState,s.updateQueue=c.updateQueue,s.type=c.type,e=c.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Wi(vo,vo.current&1|2),t.child}e=e.sibling}s.tail!==null&&dt()>al&&(t.flags|=128,i=!0,lc(s,!1),t.lanes=4194304)}else{if(!i)if(e=yo(c),e!==null){if(t.flags|=128,i=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),lc(s,!0),s.tail===null&&s.tailMode===`hidden`&&!c.alternate&&!Ca)return uc(t),null}else 2*dt()-s.renderingStartTime>al&&n!==1073741824&&(t.flags|=128,i=!0,lc(s,!1),t.lanes=4194304);s.isBackwards?(c.sibling=t.child,t.child=c):(n=s.last,n===null?t.child=c:n.sibling=c,s.last=c)}return s.tail===null?(uc(t),null):(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=dt(),t.sibling=null,n=vo.current,Wi(vo,i?n&1|2:n&1),t);case 22:case 23:return kl(),i=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==i&&(t.flags|=8192),i&&t.mode&1?Yc&1073741824&&(uc(t),t.subtreeFlags&6&&(t.flags|=8192)):uc(t),null;case 24:return null;case 25:return null}throw Error(r(156,t.tag))}function fc(e,t){switch(ba(t),t.tag){case 1:return Xi(t.type)&&Zi(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ho(),Ui(qi),Ui(Ki),xo(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return _o(t),null;case 13:if(Ui(vo),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));Ma()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ui(vo),null;case 4:return ho(),null;case 10:return Ga(t.type._context),null;case 22:case 23:return kl(),null;case 24:return null;default:return null}}var pc=!1,mc=!1,hc=typeof WeakSet==`function`?WeakSet:Set,J=null;function gc(e,t){var n=e.ref;if(n!==null)if(typeof n==`function`)try{n(null)}catch(n){Ul(e,t,n)}else n.current=null}function _c(e,t,n){try{n()}catch(n){Ul(e,t,n)}}var vc=!1;function yc(e,t){if(vi=ln,e=Ar(),jr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(yi={focusedElem:e,selectionRange:n},ln=!1,J=t;J!==null;)if(t=J,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,J=e;else for(;J!==null;){t=J;try{var h=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(h!==null){var g=h.memoizedProps,_=h.memoizedState,v=t.stateNode;v.__reactInternalSnapshotBeforeUpdate=v.getSnapshotBeforeUpdate(t.elementType===t.type?g:bs(t.type,g),_)}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent=``:y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(r(163))}}catch(e){Ul(t,t.return,e)}if(e=t.sibling,e!==null){e.return=t.return,J=e;break}J=t.return}return h=vc,vc=!1,h}function bc(e,t,n){var r=t.updateQueue;if(r=r===null?null:r.lastEffect,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var a=i.destroy;i.destroy=void 0,a!==void 0&&_c(t,n,a)}i=i.next}while(i!==r)}}function xc(e,t){if(t=t.updateQueue,t=t===null?null:t.lastEffect,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Sc(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t==`function`?t(e):t.current=e}}function Cc(e){var t=e.alternate;t!==null&&(e.alternate=null,Cc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ai],delete t[ji],delete t[Ni],delete t[Pi],delete t[Fi])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function wc(e){return e.tag===5||e.tag===3||e.tag===4}function Tc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||wc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ec(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=_i));else if(r!==4&&(e=e.child,e!==null))for(Ec(e,t,n),e=e.sibling;e!==null;)Ec(e,t,n),e=e.sibling}function Dc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Dc(e,t,n),e=e.sibling;e!==null;)Dc(e,t,n),e=e.sibling}var Oc=null,kc=!1;function Ac(e,t,n){for(n=n.child;n!==null;)jc(e,t,n),n=n.sibling}function jc(e,t,n){if(yt&&typeof yt.onCommitFiberUnmount==`function`)try{yt.onCommitFiberUnmount(vt,n)}catch{}switch(n.tag){case 5:mc||gc(n,t);case 6:var r=Oc,i=kc;Oc=null,Ac(e,t,n),Oc=r,kc=i,Oc!==null&&(kc?(e=Oc,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Oc.removeChild(n.stateNode));break;case 18:Oc!==null&&(kc?(e=Oc,n=n.stateNode,e.nodeType===8?Ei(e.parentNode,n):e.nodeType===1&&Ei(e,n),sn(e)):Ei(Oc,n.stateNode));break;case 4:r=Oc,i=kc,Oc=n.stateNode.containerInfo,kc=!0,Ac(e,t,n),Oc=r,kc=i;break;case 0:case 11:case 14:case 15:if(!mc&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var a=i,o=a.destroy;a=a.tag,o!==void 0&&(a&2||a&4)&&_c(n,t,o),i=i.next}while(i!==r)}Ac(e,t,n);break;case 1:if(!mc&&(gc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(e){Ul(n,t,e)}Ac(e,t,n);break;case 21:Ac(e,t,n);break;case 22:n.mode&1?(mc=(r=mc)||n.memoizedState!==null,Ac(e,t,n),mc=r):Ac(e,t,n);break;default:Ac(e,t,n)}}function Mc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new hc),t.forEach(function(t){var r=ql.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))})}}function Nc(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var a=n[i];try{var o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 5:Oc=c.stateNode,kc=!1;break a;case 3:Oc=c.stateNode.containerInfo,kc=!0;break a;case 4:Oc=c.stateNode.containerInfo,kc=!0;break a}c=c.return}if(Oc===null)throw Error(r(160));jc(o,s,a),Oc=null,kc=!1;var l=a.alternate;l!==null&&(l.return=null),a.return=null}catch(e){Ul(a,t,e)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Pc(t,e),t=t.sibling}function Pc(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Nc(t,e),Fc(e),i&4){try{bc(3,e,e.return),xc(3,e)}catch(t){Ul(e,e.return,t)}try{bc(5,e,e.return)}catch(t){Ul(e,e.return,t)}}break;case 1:Nc(t,e),Fc(e),i&512&&n!==null&&gc(n,n.return);break;case 5:if(Nc(t,e),Fc(e),i&512&&n!==null&&gc(n,n.return),e.flags&32){var a=e.stateNode;try{Te(a,``)}catch(t){Ul(e,e.return,t)}}if(i&4&&(a=e.stateNode,a!=null)){var o=e.memoizedProps,s=n===null?o:n.memoizedProps,c=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{c===`input`&&o.type===`radio`&&o.name!=null&&he(a,o),Me(c,s);var u=Me(c,o);for(s=0;s<l.length;s+=2){var d=l[s],f=l[s+1];d===`style`?ke(a,f):d===`dangerouslySetInnerHTML`?we(a,f):d===`children`?Te(a,f):S(a,d,f,u)}switch(c){case`input`:ge(a,o);break;case`textarea`:xe(a,o);break;case`select`:var p=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!o.multiple;var m=o.value;m==null?p!==!!o.multiple&&(o.defaultValue==null?ye(a,!!o.multiple,o.multiple?[]:``,!1):ye(a,!!o.multiple,o.defaultValue,!0)):ye(a,!!o.multiple,m,!1)}a[ji]=o}catch(t){Ul(e,e.return,t)}}break;case 6:if(Nc(t,e),Fc(e),i&4){if(e.stateNode===null)throw Error(r(162));a=e.stateNode,o=e.memoizedProps;try{a.nodeValue=o}catch(t){Ul(e,e.return,t)}}break;case 3:if(Nc(t,e),Fc(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{sn(t.containerInfo)}catch(t){Ul(e,e.return,t)}break;case 4:Nc(t,e),Fc(e);break;case 13:Nc(t,e),Fc(e),a=e.child,a.flags&8192&&(o=a.memoizedState!==null,a.stateNode.isHidden=o,!o||a.alternate!==null&&a.alternate.memoizedState!==null||(il=dt())),i&4&&Mc(e);break;case 22:if(d=n!==null&&n.memoizedState!==null,e.mode&1?(mc=(u=mc)||d,Nc(t,e),mc=u):Nc(t,e),Fc(e),i&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!d&&e.mode&1)for(J=e,d=e.child;d!==null;){for(f=J=d;J!==null;){switch(p=J,m=p.child,p.tag){case 0:case 11:case 14:case 15:bc(4,p,p.return);break;case 1:gc(p,p.return);var h=p.stateNode;if(typeof h.componentWillUnmount==`function`){i=p,n=p.return;try{t=i,h.props=t.memoizedProps,h.state=t.memoizedState,h.componentWillUnmount()}catch(e){Ul(i,n,e)}}break;case 5:gc(p,p.return);break;case 22:if(p.memoizedState!==null){zc(f);continue}}m===null?zc(f):(m.return=p,J=m)}d=d.sibling}a:for(d=null,f=e;;){if(f.tag===5){if(d===null){d=f;try{a=f.stateNode,u?(o=a.style,typeof o.setProperty==`function`?o.setProperty(`display`,`none`,`important`):o.display=`none`):(c=f.stateNode,l=f.memoizedProps.style,s=l!=null&&l.hasOwnProperty(`display`)?l.display:null,c.style.display=Oe(`display`,s))}catch(t){Ul(e,e.return,t)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=u?``:f.memoizedProps}catch(t){Ul(e,e.return,t)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break a;for(;f.sibling===null;){if(f.return===null||f.return===e)break a;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Nc(t,e),Fc(e),i&4&&Mc(e);break;case 21:break;default:Nc(t,e),Fc(e)}}function Fc(e){var t=e.flags;if(t&2){try{a:{for(var n=e.return;n!==null;){if(wc(n)){var i=n;break a}n=n.return}throw Error(r(160))}switch(i.tag){case 5:var a=i.stateNode;i.flags&32&&(Te(a,``),i.flags&=-33),Dc(e,Tc(e),a);break;case 3:case 4:var o=i.stateNode.containerInfo;Ec(e,Tc(e),o);break;default:throw Error(r(161))}}catch(t){Ul(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ic(e,t,n){J=e,Lc(e,t,n)}function Lc(e,t,n){for(var r=!!(e.mode&1);J!==null;){var i=J,a=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||pc;if(!o){var s=i.alternate,c=s!==null&&s.memoizedState!==null||mc;s=pc;var l=mc;if(pc=o,(mc=c)&&!l)for(J=i;J!==null;)o=J,c=o.child,o.tag===22&&o.memoizedState!==null||c===null?Bc(i):(c.return=o,J=c);for(;a!==null;)J=a,Lc(a,t,n),a=a.sibling;J=i,pc=s,mc=l}Rc(e,t,n)}else i.subtreeFlags&8772&&a!==null?(a.return=i,J=a):Rc(e,t,n)}}function Rc(e){for(;J!==null;){var t=J;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:mc||xc(5,t);break;case 1:var i=t.stateNode;if(t.flags&4&&!mc)if(n===null)i.componentDidMount();else{var a=t.elementType===t.type?n.memoizedProps:bs(t.type,n.memoizedProps);i.componentDidUpdate(a,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&so(t,o,i);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}so(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var l=t.memoizedProps;switch(t.type){case`button`:case`input`:case`select`:case`textarea`:l.autoFocus&&n.focus();break;case`img`:l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&sn(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(r(163))}mc||t.flags&512&&Sc(t)}catch(e){Ul(t,t.return,e)}}if(t===e){J=null;break}if(n=t.sibling,n!==null){n.return=t.return,J=n;break}J=t.return}}function zc(e){for(;J!==null;){var t=J;if(t===e){J=null;break}var n=t.sibling;if(n!==null){n.return=t.return,J=n;break}J=t.return}}function Bc(e){for(;J!==null;){var t=J;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{xc(4,t)}catch(e){Ul(t,n,e)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount==`function`){var i=t.return;try{r.componentDidMount()}catch(e){Ul(t,i,e)}}var a=t.return;try{Sc(t)}catch(e){Ul(t,a,e)}break;case 5:var o=t.return;try{Sc(t)}catch(e){Ul(t,o,e)}}}catch(e){Ul(t,t.return,e)}if(t===e){J=null;break}var s=t.sibling;if(s!==null){s.return=t.return,J=s;break}J=t.return}}var Vc=Math.ceil,Hc=C.ReactCurrentDispatcher,Uc=C.ReactCurrentOwner,Wc=C.ReactCurrentBatchConfig,Gc=0,Kc=null,qc=null,Jc=0,Yc=0,Xc=Hi(0),Zc=0,Qc=null,$c=0,el=0,tl=0,nl=null,rl=null,il=0,al=1/0,ol=null,sl=!1,cl=null,ll=null,ul=!1,dl=null,fl=0,pl=0,ml=null,hl=-1,gl=0;function _l(){return Gc&6?dt():hl===-1?hl=dt():hl}function vl(e){return e.mode&1?Gc&2&&Jc!==0?Jc&-Jc:Pa.transition===null?(e=Lt,e===0?(e=window.event,e=e===void 0?16:hn(e.type),e):e):(gl===0&&(gl=Mt()),gl):1}function yl(e,t,n,i){if(50<pl)throw pl=0,ml=null,Error(r(185));Pt(e,n,i),(!(Gc&2)||e!==Kc)&&(e===Kc&&(!(Gc&2)&&(el|=n),Zc===4&&Tl(e,Jc)),bl(e,i),n===1&&Gc===0&&!(t.mode&1)&&(al=dt()+500,ra&&sa()))}function bl(e,t){var n=e.callbackNode;At(e,t);var r=Ot(e,e===Kc?Jc:0);if(r===0)n!==null&&lt(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&lt(n),t===1)e.tag===0?oa(El.bind(null,e)):aa(El.bind(null,e)),wi(function(){!(Gc&6)&&sa()}),n=null;else{switch(Rt(r)){case 1:n=pt;break;case 4:n=mt;break;case 16:n=ht;break;case 536870912:n=_t;break;default:n=ht}n=Yl(n,xl.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function xl(e,t){if(hl=-1,gl=0,Gc&6)throw Error(r(327));var n=e.callbackNode;if(Vl()&&e.callbackNode!==n)return null;var i=Ot(e,e===Kc?Jc:0);if(i===0)return null;if(i&30||(i&e.expiredLanes)!==0||t)t=Pl(e,i);else{t=i;var a=Gc;Gc|=2;var o=Ml();(Kc!==e||Jc!==t)&&(ol=null,al=dt()+500,Al(e,t));do try{Il();break}catch(t){jl(e,t)}while(1);K(),Hc.current=o,Gc=a,qc===null?(Kc=null,Jc=0,t=Zc):t=0}if(t!==0){if(t===2&&(a=jt(e),a!==0&&(i=a,t=Sl(e,a))),t===1)throw n=Qc,Al(e,0),Tl(e,i),bl(e,dt()),n;if(t===6)Tl(e,i);else{if(a=e.current.alternate,!(i&30)&&!wl(a)&&(t=Pl(e,i),t===2&&(o=jt(e),o!==0&&(i=o,t=Sl(e,o))),t===1))throw n=Qc,Al(e,0),Tl(e,i),bl(e,dt()),n;switch(e.finishedWork=a,e.finishedLanes=i,t){case 0:case 1:throw Error(r(345));case 2:zl(e,rl,ol);break;case 3:if(Tl(e,i),(i&130023424)===i&&(t=il+500-dt(),10<t)){if(Ot(e,0)!==0)break;if(a=e.suspendedLanes,(a&i)!==i){_l(),e.pingedLanes|=e.suspendedLanes&a;break}e.timeoutHandle=xi(zl.bind(null,e,rl,ol),t);break}zl(e,rl,ol);break;case 4:if(Tl(e,i),(i&4194240)===i)break;for(t=e.eventTimes,a=-1;0<i;){var s=31-xt(i);o=1<<s,s=t[s],s>a&&(a=s),i&=~o}if(i=a,i=dt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Vc(i/1960))-i,10<i){e.timeoutHandle=xi(zl.bind(null,e,rl,ol),i);break}zl(e,rl,ol);break;case 5:zl(e,rl,ol);break;default:throw Error(r(329))}}}return bl(e,dt()),e.callbackNode===n?xl.bind(null,e):null}function Sl(e,t){var n=nl;return e.current.memoizedState.isDehydrated&&(Al(e,t).flags|=256),e=Pl(e,t),e!==2&&(t=rl,rl=n,t!==null&&Cl(t)),e}function Cl(e){rl===null?rl=e:rl.push.apply(rl,e)}function wl(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Tr(a(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Tl(e,t){for(t&=~tl,t&=~el,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-xt(t),r=1<<n;e[n]=-1,t&=~r}}function El(e){if(Gc&6)throw Error(r(327));Vl();var t=Ot(e,0);if(!(t&1))return bl(e,dt()),null;var n=Pl(e,t);if(e.tag!==0&&n===2){var i=jt(e);i!==0&&(t=i,n=Sl(e,i))}if(n===1)throw n=Qc,Al(e,0),Tl(e,t),bl(e,dt()),n;if(n===6)throw Error(r(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,zl(e,rl,ol),bl(e,dt()),null}function Dl(e,t){var n=Gc;Gc|=1;try{return e(t)}finally{Gc=n,Gc===0&&(al=dt()+500,ra&&sa())}}function Ol(e){dl!==null&&dl.tag===0&&!(Gc&6)&&Vl();var t=Gc;Gc|=1;var n=Wc.transition,r=Lt;try{if(Wc.transition=null,Lt=1,e)return e()}finally{Lt=r,Wc.transition=n,Gc=t,!(Gc&6)&&sa()}}function kl(){Yc=Xc.current,Ui(Xc)}function Al(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Si(n)),qc!==null)for(n=qc.return;n!==null;){var r=n;switch(ba(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Zi();break;case 3:ho(),Ui(qi),Ui(Ki),xo();break;case 5:_o(r);break;case 4:ho();break;case 13:Ui(vo);break;case 19:Ui(vo);break;case 10:Ga(r.type._context);break;case 22:case 23:kl()}n=n.return}if(Kc=e,qc=e=eu(e.current,null),Jc=Yc=t,Zc=0,Qc=null,tl=el=$c=0,rl=nl=null,Ya!==null){for(t=0;t<Ya.length;t++)if(n=Ya[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,a=n.pending;if(a!==null){var o=a.next;a.next=i,r.next=o}n.pending=r}Ya=null}return e}function jl(e,t){do{var n=qc;try{if(K(),So.current=gs,Oo){for(var i=To.memoizedState;i!==null;){var a=i.queue;a!==null&&(a.pending=null),i=i.next}Oo=!1}if(wo=0,Do=Eo=To=null,ko=!1,Ao=0,Uc.current=null,n===null||n.return===null){Zc=1,Qc=t,qc=null;break}a:{var o=e,s=n.return,c=n,l=t;if(t=Jc,c.flags|=32768,typeof l==`object`&&l&&typeof l.then==`function`){var u=l,d=c,f=d.tag;if(!(d.mode&1)&&(f===0||f===11||f===15)){var p=d.alternate;p?(d.updateQueue=p.updateQueue,d.memoizedState=p.memoizedState,d.lanes=p.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=Ps(s);if(m!==null){m.flags&=-257,Fs(m,s,c,o,t),m.mode&1&&Ns(o,u,t),t=m,l=u;var h=t.updateQueue;if(h===null){var g=new Set;g.add(l),t.updateQueue=g}else h.add(l);break a}if(!(t&1)){Ns(o,u,t),Nl();break a}l=Error(r(426))}else if(Ca&&c.mode&1){var _=Ps(s);if(_!==null){!(_.flags&65536)&&(_.flags|=256),Fs(_,s,c,o,t),Na(Ds(l,c));break a}}o=l=Ds(l,c),Zc!==4&&(Zc=2),nl===null?nl=[o]:nl.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var v=js(o,l,t);ao(o,v);break a;case 1:c=l;var y=o.type,b=o.stateNode;if(!(o.flags&128)&&(typeof y.getDerivedStateFromError==`function`||b!==null&&typeof b.componentDidCatch==`function`&&(ll===null||!ll.has(b)))){o.flags|=65536,t&=-t,o.lanes|=t;var x=Ms(o,c,t);ao(o,x);break a}}o=o.return}while(o!==null)}Rl(n)}catch(e){t=e,qc===n&&n!==null&&(qc=n=n.return);continue}break}while(1)}function Ml(){var e=Hc.current;return Hc.current=gs,e===null?gs:e}function Nl(){(Zc===0||Zc===3||Zc===2)&&(Zc=4),Kc===null||!($c&268435455)&&!(el&268435455)||Tl(Kc,Jc)}function Pl(e,t){var n=Gc;Gc|=2;var i=Ml();(Kc!==e||Jc!==t)&&(ol=null,Al(e,t));do try{Fl();break}catch(t){jl(e,t)}while(1);if(K(),Gc=n,Hc.current=i,qc!==null)throw Error(r(261));return Kc=null,Jc=0,Zc}function Fl(){for(;qc!==null;)Ll(qc)}function Il(){for(;qc!==null&&!ut();)Ll(qc)}function Ll(e){var t=Jl(e.alternate,e,Yc);e.memoizedProps=e.pendingProps,t===null?Rl(e):qc=t,Uc.current=null}function Rl(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=fc(n,t),n!==null){n.flags&=32767,qc=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Zc=6,qc=null;return}}else if(n=dc(n,t,Yc),n!==null){qc=n;return}if(t=t.sibling,t!==null){qc=t;return}qc=t=e}while(t!==null);Zc===0&&(Zc=5)}function zl(e,t,n){var r=Lt,i=Wc.transition;try{Wc.transition=null,Lt=1,Bl(e,t,n,r)}finally{Wc.transition=i,Lt=r}return null}function Bl(e,t,n,i){do Vl();while(dl!==null);if(Gc&6)throw Error(r(327));n=e.finishedWork;var a=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(r(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(Ft(e,o),e===Kc&&(qc=Kc=null,Jc=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ul||(ul=!0,Yl(ht,function(){return Vl(),null})),o=!!(n.flags&15990),n.subtreeFlags&15990||o){o=Wc.transition,Wc.transition=null;var s=Lt;Lt=1;var c=Gc;Gc|=4,Uc.current=null,yc(e,n),Pc(n,e),Mr(yi),ln=!!vi,yi=vi=null,e.current=n,Ic(n,e,a),W(),Gc=c,Lt=s,Wc.transition=o}else e.current=n;if(ul&&(ul=!1,dl=e,fl=a),o=e.pendingLanes,o===0&&(ll=null),bt(n.stateNode,i),bl(e,dt()),t!==null)for(i=e.onRecoverableError,n=0;n<t.length;n++)a=t[n],i(a.value,{componentStack:a.stack,digest:a.digest});if(sl)throw sl=!1,e=cl,cl=null,e;return fl&1&&e.tag!==0&&Vl(),o=e.pendingLanes,o&1?e===ml?pl++:(pl=0,ml=e):pl=0,sa(),null}function Vl(){if(dl!==null){var e=Rt(fl),t=Wc.transition,n=Lt;try{if(Wc.transition=null,Lt=16>e?16:e,dl===null)var i=!1;else{if(e=dl,dl=null,fl=0,Gc&6)throw Error(r(331));var a=Gc;for(Gc|=4,J=e.current;J!==null;){var o=J,s=o.child;if(J.flags&16){var c=o.deletions;if(c!==null){for(var l=0;l<c.length;l++){var u=c[l];for(J=u;J!==null;){var d=J;switch(d.tag){case 0:case 11:case 15:bc(8,d,o)}var f=d.child;if(f!==null)f.return=d,J=f;else for(;J!==null;){d=J;var p=d.sibling,m=d.return;if(Cc(d),d===u){J=null;break}if(p!==null){p.return=m,J=p;break}J=m}}}var h=o.alternate;if(h!==null){var g=h.child;if(g!==null){h.child=null;do{var _=g.sibling;g.sibling=null,g=_}while(g!==null)}}J=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,J=s;else b:for(;J!==null;){if(o=J,o.flags&2048)switch(o.tag){case 0:case 11:case 15:bc(9,o,o.return)}var v=o.sibling;if(v!==null){v.return=o.return,J=v;break b}J=o.return}}var y=e.current;for(J=y;J!==null;){s=J;var b=s.child;if(s.subtreeFlags&2064&&b!==null)b.return=s,J=b;else b:for(s=y;J!==null;){if(c=J,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:xc(9,c)}}catch(e){Ul(c,c.return,e)}if(c===s){J=null;break b}var x=c.sibling;if(x!==null){x.return=c.return,J=x;break b}J=c.return}}if(Gc=a,sa(),yt&&typeof yt.onPostCommitFiberRoot==`function`)try{yt.onPostCommitFiberRoot(vt,e)}catch{}i=!0}return i}finally{Lt=n,Wc.transition=t}}return!1}function Hl(e,t,n){t=Ds(n,t),t=js(e,t,1),e=ro(e,t,1),t=_l(),e!==null&&(Pt(e,1,t),bl(e,t))}function Ul(e,t,n){if(e.tag===3)Hl(e,e,n);else for(;t!==null;){if(t.tag===3){Hl(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(ll===null||!ll.has(r))){e=Ds(n,e),e=Ms(t,e,1),t=ro(t,e,1),e=_l(),t!==null&&(Pt(t,1,e),bl(t,e));break}}t=t.return}}function Wl(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=_l(),e.pingedLanes|=e.suspendedLanes&n,Kc===e&&(Jc&n)===n&&(Zc===4||Zc===3&&(Jc&130023424)===Jc&&500>dt()-il?Al(e,0):tl|=n),bl(e,t)}function Gl(e,t){t===0&&(e.mode&1?(t=Et,Et<<=1,!(Et&130023424)&&(Et=4194304)):t=1);var n=_l();e=Qa(e,t),e!==null&&(Pt(e,t,n),bl(e,n))}function Kl(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Gl(e,n)}function ql(e,t){var n=0;switch(e.tag){case 13:var i=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:i=e.stateNode;break;default:throw Error(r(314))}i!==null&&i.delete(t),Gl(e,n)}var Jl=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||qi.current)Ls=!0;else{if((e.lanes&n)===0&&!(t.flags&128))return Ls=!1,ac(e,t,n);Ls=!!(e.flags&131072)}else Ls=!1,Ca&&t.flags&1048576&&va(t,da,t.index);switch(t.lanes=0,t.tag){case 2:var i=t.type;rc(e,t),e=t.pendingProps;var a=Yi(t,Ki.current);qa(t,n),a=Po(null,t,i,e,a,n);var o=Fo();return t.flags|=1,typeof a==`object`&&a&&typeof a.render==`function`&&a.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xi(i)?(o=!0,ea(t)):o=!1,t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,eo(t),a.updater=Ss,t.stateNode=a,a._reactInternals=t,Es(t,i,e,n),t=Gs(null,t,i,!0,o,n)):(t.tag=0,Ca&&o&&ya(t),Rs(null,t,a,n),t=t.child),t;case 16:i=t.elementType;a:{switch(rc(e,t),e=t.pendingProps,a=i._init,i=a(i._payload),t.type=i,a=t.tag=$l(i),e=bs(i,e),a){case 0:t=Ws(null,t,i,e,n);break a;case 1:t=q(null,t,i,e,n);break a;case 11:t=zs(null,t,i,e,n);break a;case 14:t=Bs(null,t,i,bs(i.type,e),n);break a}throw Error(r(306,i,``))}return t;case 0:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:bs(i,a),Ws(e,t,i,a,n);case 1:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:bs(i,a),q(e,t,i,a,n);case 3:a:{if(Ks(t),e===null)throw Error(r(387));i=t.pendingProps,o=t.memoizedState,a=o.element,to(e,t),oo(t,i,null,n);var s=t.memoizedState;if(i=s.element,o.isDehydrated)if(o={element:i,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){a=Ds(Error(r(423)),t),t=qs(e,t,i,n,a);break a}else if(i!==a){a=Ds(Error(r(424)),t),t=qs(e,t,i,n,a);break a}else for(Sa=Di(t.stateNode.containerInfo.firstChild),xa=t,Ca=!0,wa=null,n=Ba(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ma(),i===a){t=ic(e,t,n);break a}Rs(e,t,i,n)}t=t.child}return t;case 5:return go(t),e===null&&Oa(t),i=t.type,a=t.pendingProps,o=e===null?null:e.memoizedProps,s=a.children,bi(i,a)?s=null:o!==null&&bi(i,o)&&(t.flags|=32),Us(e,t),Rs(e,t,s,n),t.child;case 6:return e===null&&Oa(t),null;case 13:return Xs(e,t,n);case 4:return mo(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=za(t,null,i,n):Rs(e,t,i,n),t.child;case 11:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:bs(i,a),zs(e,t,i,a,n);case 7:return Rs(e,t,t.pendingProps,n),t.child;case 8:return Rs(e,t,t.pendingProps.children,n),t.child;case 12:return Rs(e,t,t.pendingProps.children,n),t.child;case 10:a:{if(i=t.type._context,a=t.pendingProps,o=t.memoizedProps,s=a.value,Wi(Va,i._currentValue),i._currentValue=s,o!==null)if(Tr(o.value,s)){if(o.children===a.children&&!qi.current){t=ic(e,t,n);break a}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){s=o.child;for(var l=c.firstContext;l!==null;){if(l.context===i){if(o.tag===1){l=no(-1,n&-n),l.tag=2;var u=o.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?l.next=l:(l.next=d.next,d.next=l),u.pending=l}}o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Ka(o.return,n,t),c.lanes|=n;break}l=l.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(r(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),Ka(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}Rs(e,t,a.children,n),t=t.child}return t;case 9:return a=t.type,i=t.pendingProps.children,qa(t,n),a=Ja(a),i=i(a),t.flags|=1,Rs(e,t,i,n),t.child;case 14:return i=t.type,a=bs(i,t.pendingProps),a=bs(i.type,a),Bs(e,t,i,a,n);case 15:return Vs(e,t,t.type,t.pendingProps,n);case 17:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:bs(i,a),rc(e,t),t.tag=1,Xi(i)?(e=!0,ea(t)):e=!1,qa(t,n),ws(t,i,a),Es(t,i,a,n),Gs(null,t,i,!0,e,n);case 19:return nc(e,t,n);case 22:return Hs(e,t,n)}throw Error(r(156,t.tag))};function Yl(e,t){return ct(e,t)}function Xl(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Zl(e,t,n,r){return new Xl(e,t,n,r)}function Ql(e){return e=e.prototype,!(!e||!e.isReactComponent)}function $l(e){if(typeof e==`function`)return+!!Ql(e);if(e!=null){if(e=e.$$typeof,e===j)return 11;if(e===P)return 14}return 2}function eu(e,t){var n=e.alternate;return n===null?(n=Zl(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function tu(e,t,n,i,a,o){var s=2;if(i=e,typeof e==`function`)Ql(e)&&(s=1);else if(typeof e==`string`)s=5;else a:switch(e){case E:return nu(n.children,a,o,t);case D:s=8,a|=8;break;case O:return e=Zl(12,n,t,a|2),e.elementType=O,e.lanes=o,e;case M:return e=Zl(13,n,t,a),e.elementType=M,e.lanes=o,e;case N:return e=Zl(19,n,t,a),e.elementType=N,e.lanes=o,e;case I:return ru(n,a,o,t);default:if(typeof e==`object`&&e)switch(e.$$typeof){case k:s=10;break a;case A:s=9;break a;case j:s=11;break a;case P:s=14;break a;case F:s=16,i=null;break a}throw Error(r(130,e==null?e:typeof e,``))}return t=Zl(s,n,t,a),t.elementType=e,t.type=i,t.lanes=o,t}function nu(e,t,n,r){return e=Zl(7,e,r,t),e.lanes=n,e}function ru(e,t,n,r){return e=Zl(22,e,r,t),e.elementType=I,e.lanes=n,e.stateNode={isHidden:!1},e}function iu(e,t,n){return e=Zl(6,e,null,t),e.lanes=n,e}function au(e,t,n){return t=Zl(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ou(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Nt(0),this.expirationTimes=Nt(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Nt(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function su(e,t,n,r,i,a,o,s,c){return e=new ou(e,t,n,s,c),t===1?(t=1,!0===a&&(t|=8)):t=0,a=Zl(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},eo(a),e}function cu(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:T,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}function lu(e){if(!e)return Gi;e=e._reactInternals;a:{if(nt(e)!==e||e.tag!==1)throw Error(r(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break a;case 1:if(Xi(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break a}}t=t.return}while(t!==null);throw Error(r(171))}if(e.tag===1){var n=e.type;if(Xi(n))return $i(e,n,t)}return t}function uu(e,t,n,r,i,a,o,s,c){return e=su(n,r,!0,e,i,a,o,s,c),e.context=lu(null),n=e.current,r=_l(),i=vl(n),a=no(r,i),a.callback=t??null,ro(n,a,i),e.current.lanes=i,Pt(e,i,r),bl(e,r),e}function du(e,t,n,r){var i=t.current,a=_l(),o=vl(i);return n=lu(n),t.context===null?t.context=n:t.pendingContext=n,t=no(a,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=ro(i,t,o),e!==null&&(yl(e,i,o,a),io(e,i,o)),o}function fu(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function pu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function mu(e,t){pu(e,t),(e=e.alternate)&&pu(e,t)}function hu(){return null}var gu=typeof reportError==`function`?reportError:function(e){console.error(e)};function _u(e){this._internalRoot=e}vu.prototype.render=_u.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));du(e,t,null,null)},vu.prototype.unmount=_u.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ol(function(){du(null,e,null,null)}),t[Mi]=null}};function vu(e){this._internalRoot=e}vu.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ht();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Xt.length&&t!==0&&t<Xt[n].priority;n++);Xt.splice(n,0,e),n===0&&tn(e)}};function yu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function bu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==` react-mount-point-unstable `))}function xu(){}function Su(e,t,n,r,i){if(i){if(typeof r==`function`){var a=r;r=function(){var e=fu(o);a.call(e)}}var o=uu(t,r,e,0,null,!1,!1,``,xu);return e._reactRootContainer=o,e[Mi]=o.current,oi(e.nodeType===8?e.parentNode:e),Ol(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r==`function`){var s=r;r=function(){var e=fu(c);s.call(e)}}var c=su(e,0,!1,null,null,!1,!1,``,xu);return e._reactRootContainer=c,e[Mi]=c.current,oi(e.nodeType===8?e.parentNode:e),Ol(function(){du(t,c,n,r)}),c}function Cu(e,t,n,r,i){var a=n._reactRootContainer;if(a){var o=a;if(typeof i==`function`){var s=i;i=function(){var e=fu(o);s.call(e)}}du(t,o,e,i)}else o=Su(n,t,e,i,r);return fu(o)}zt=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Dt(t.pendingLanes);n!==0&&(It(t,n|1),bl(t,dt()),!(Gc&6)&&(al=dt()+500,sa()))}break;case 13:Ol(function(){var t=Qa(e,1);t!==null&&yl(t,e,1,_l())}),mu(e,1)}},Bt=function(e){if(e.tag===13){var t=Qa(e,134217728);t!==null&&yl(t,e,134217728,_l()),mu(e,134217728)}},Vt=function(e){if(e.tag===13){var t=vl(e),n=Qa(e,t);n!==null&&yl(n,e,t,_l()),mu(e,t)}},Ht=function(){return Lt},Ut=function(e,t){var n=Lt;try{return Lt=e,t()}finally{Lt=n}},Fe=function(e,t,n){switch(t){case`input`:if(ge(e,n),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name=`+JSON.stringify(``+t)+`][type="radio"]`),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var a=zi(i);if(!a)throw Error(r(90));de(i),ge(i,a)}}}break;case`textarea`:xe(e,n);break;case`select`:t=n.value,t!=null&&ye(e,!!n.multiple,t,!1)}},Ve=Dl,He=Ol;var wu={usingClientEntryPoint:!1,Events:[Li,Ri,zi,ze,Be,Dl]},Tu={findFiberByHostInstance:Ii,bundleType:0,version:`18.3.1`,rendererPackageName:`react-dom`},Eu={bundleType:Tu.bundleType,version:Tu.version,rendererPackageName:Tu.rendererPackageName,rendererConfig:Tu.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:C.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ot(e),e===null?null:e.stateNode},findFiberByHostInstance:Tu.findFiberByHostInstance||hu,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:`18.3.1-next-f1338f8080-20240426`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Du=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Du.isDisabled&&Du.supportsFiber)try{vt=Du.inject(Eu),yt=Du}catch{}}e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=wu,e.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!yu(t))throw Error(r(200));return cu(e,t,null,n)},e.createRoot=function(e,t){if(!yu(e))throw Error(r(299));var n=!1,i=``,a=gu;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=su(e,1,!1,null,null,n,!1,i,a),e[Mi]=t.current,oi(e.nodeType===8?e.parentNode:e),new _u(t)},e.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(r(188)):(e=Object.keys(e).join(`,`),Error(r(268,e)));return e=ot(t),e=e===null?null:e.stateNode,e},e.flushSync=function(e){return Ol(e)},e.hydrate=function(e,t,n){if(!bu(t))throw Error(r(200));return Cu(null,e,t,!0,n)},e.hydrateRoot=function(e,t,n){if(!yu(e))throw Error(r(405));var i=n!=null&&n.hydratedSources||null,a=!1,o=``,s=gu;if(n!=null&&(!0===n.unstable_strictMode&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=uu(t,null,e,1,n??null,a,!1,o,s),e[Mi]=t.current,oi(e),i)for(e=0;e<i.length;e++)n=i[e],a=n._getVersion,a=a(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,a]:t.mutableSourceEagerHydrationData.push(n,a);return new vu(t)},e.render=function(e,t,n){if(!bu(t))throw Error(r(200));return Cu(null,e,t,!1,n)},e.unmountComponentAtNode=function(e){if(!bu(e))throw Error(r(40));return e._reactRootContainer?(Ol(function(){Cu(null,null,e,!1,function(){e._reactRootContainer=null,e[Mi]=null})}),!0):!1},e.unstable_batchedUpdates=Dl,e.unstable_renderSubtreeIntoContainer=function(e,t,n,i){if(!bu(n))throw Error(r(200));if(e==null||e._reactInternals===void 0)throw Error(r(38));return Cu(e,t,n,!1,i)},e.version=`18.3.1-next-f1338f8080-20240426`})),m=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=p()})),h=o((e=>{var t=m();e.createRoot=t.createRoot,e.hydrateRoot=t.hydrateRoot})),g=o(((e,t)=>{(function(n){typeof e==`object`&&t!==void 0?t.exports=n(null):typeof define==`function`&&define.amd?define(n(null)):window.stylis=n(null)})(function e(t){var n=/^\0+/g,r=/[\0\r\f]/g,i=/: */g,a=/zoo|gra/,o=/([,: ])(transform)/g,s=/,+\s*(?![^(]*[)])/g,c=/ +\s*(?![^(]*[)])/g,l=/ *[\0] */g,u=/,\r+?/g,d=/([\t\r\n ])*\f?&/g,f=/:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g,p=/\W+/g,m=/@(k\w+)\s*(\S*)\s*/,h=/::(place)/g,g=/:(read-only)/g,_=/\s+(?=[{\];=:>])/g,v=/([[}=:>])\s+/g,y=/(\{[^{]+?);(?=\})/g,b=/\s{2,}/g,x=/([^\(])(:+) */g,S=/[svh]\w+-[tblr]{2}/,C=/\(\s*(.*)\s*\)/g,w=/([\s\S]*?);/g,T=/-self|flex-/g,E=/[^]*?(:[rp][el]a[\w-]+)[^]*/,D=/stretch|:\s*\w+\-(?:conte|avail)/,O=/([^-])(image-set\()/,k=`-webkit-`,A=`-moz-`,j=`-ms-`,M=1,N=1,P=0,F=1,I=1,ee=1,te=0,ne=0,re=0,L=[],R=[],z=0,ie=null,ae=-2,oe=-1,se=0,ce=1,le=2,ue=3,de=0,fe=1,pe=``,me=``,he=``;function ge(e,t,i,a,o){for(var s,c,u=0,d=0,f=0,p=0,_=0,v=0,y=0,b=0,S=0,w=0,T=0,E=0,D=0,O=0,k=0,A=0,j=0,te=0,R=0,ie=i.length,ae=ie-1,oe=``,B=``,H=``,U=``,Se=``,Ce=``;k<ie;){if(y=i.charCodeAt(k),k===ae&&d+p+f+u!==0&&(d!==0&&(y=d===47?10:47),p=f=u=0,ie++,ae++),d+p+f+u===0){if(k===ae&&(A>0&&(B=B.replace(r,``)),B.trim().length>0)){switch(y){case 32:case 9:case 59:case 13:case 10:break;default:B+=i.charAt(k)}y=59}if(j===1)switch(y){case 123:case 125:case 59:case 34:case 39:case 40:case 41:case 44:j=0;case 9:case 13:case 10:case 32:break;default:for(j=0,R=k,_=y,k--,y=59;R<ie;)switch(i.charCodeAt(R++)){case 10:case 13:case 59:++k,y=_,R=ie;break;case 58:A>0&&(++k,y=_);case 123:R=ie}}switch(y){case 123:for(_=(B=B.trim()).charCodeAt(0),T=1,R=++k;k<ie;){switch(y=i.charCodeAt(k)){case 123:T++;break;case 125:T--;break;case 47:switch(v=i.charCodeAt(k+1)){case 42:case 47:k=xe(v,k,ae,i)}break;case 91:y++;case 40:y++;case 34:case 39:for(;k++<ae&&i.charCodeAt(k)!==y;);}if(T===0)break;k++}switch(H=i.substring(R,k),_===0&&(_=(B=B.replace(n,``).trim()).charCodeAt(0)),_){case 64:switch(A>0&&(B=B.replace(r,``)),v=B.charCodeAt(1)){case 100:case 109:case 115:case 45:s=t;break;default:s=L}if(R=(H=ge(t,s,H,v,o+1)).length,re>0&&R===0&&(R=B.length),z>0&&(s=_e(L,B,te),c=V(ue,H,s,t,N,M,R,v,o,a),B=s.join(``),c!==void 0&&(R=(H=c.trim()).length)===0&&(v=0,H=``)),R>0)switch(v){case 115:B=B.replace(C,be);case 100:case 109:case 45:H=B+`{`+H+`}`;break;case 107:H=(B=B.replace(m,`$1 $2`+(fe>0?pe:``)))+`{`+H+`}`,H=I===1||I===2&&ye(`@`+H,3)?`@-webkit-`+H+`@`+H:`@`+H;break;default:H=B+H,a===112&&(U+=H,H=``)}else H=``;break;default:H=ge(t,_e(t,B,te),H,a,o+1)}Se+=H,E=0,j=0,O=0,A=0,te=0,D=0,B=``,H=``,y=i.charCodeAt(++k);break;case 125:case 59:if((R=(B=(A>0?B.replace(r,``):B).trim()).length)>1)switch(O===0&&((_=B.charCodeAt(0))===45||_>96&&_<123)&&(R=(B=B.replace(` `,`:`)).length),z>0&&(c=V(ce,B,t,e,N,M,U.length,a,o,a))!==void 0&&(R=(B=c.trim()).length)===0&&(B=`\0\0`),_=B.charCodeAt(0),v=B.charCodeAt(1),_){case 0:break;case 64:if(v===105||v===99){Ce+=B+i.charAt(k);break}default:if(B.charCodeAt(R-1)===58)break;U+=ve(B,_,v,B.charCodeAt(2))}E=0,j=0,O=0,A=0,te=0,B=``,y=i.charCodeAt(++k)}}switch(y){case 13:case 10:if(d+p+f+u+ne===0)switch(w){case 41:case 39:case 34:case 64:case 126:case 62:case 42:case 43:case 47:case 45:case 58:case 44:case 59:case 123:case 125:break;default:O>0&&(j=1)}d===47?d=0:F+E===0&&a!==107&&B.length>0&&(A=1,B+=`\0`),z*de>0&&V(se,B,t,e,N,M,U.length,a,o,a),M=1,N++;break;case 59:case 125:if(d+p+f+u===0){M++;break}default:switch(M++,oe=i.charAt(k),y){case 9:case 32:if(p+u+d===0)switch(b){case 44:case 58:case 9:case 32:oe=``;break;default:y!==32&&(oe=` `)}break;case 0:oe=`\\0`;break;case 12:oe=`\\f`;break;case 11:oe=`\\v`;break;case 38:p+d+u===0&&F>0&&(te=1,A=1,oe=`\f`+oe);break;case 108:if(p+d+u+P===0&&O>0)switch(k-O){case 2:b===112&&i.charCodeAt(k-3)===58&&(P=b);case 8:S===111&&(P=S)}break;case 58:p+d+u===0&&(O=k);break;case 44:d+f+p+u===0&&(A=1,oe+=`\r`);break;case 34:case 39:d===0&&(p=p===y?0:p===0?y:p);break;case 91:p+d+f===0&&u++;break;case 93:p+d+f===0&&u--;break;case 41:p+d+u===0&&f--;break;case 40:if(p+d+u===0){if(E===0)switch(2*b+3*S){case 533:break;default:T=0,E=1}f++}break;case 64:d+f+p+u+O+D===0&&(D=1);break;case 42:case 47:if(p+u+f>0)break;switch(d){case 0:switch(2*y+3*i.charCodeAt(k+1)){case 235:d=47;break;case 220:R=k,d=42}break;case 42:y===47&&b===42&&R+2!==k&&(i.charCodeAt(R+2)===33&&(U+=i.substring(R,k+1)),oe=``,d=0)}}if(d===0){if(F+p+u+D===0&&a!==107&&y!==59)switch(y){case 44:case 126:case 62:case 43:case 41:case 40:if(E===0){switch(b){case 9:case 32:case 10:case 13:oe+=`\0`;break;default:oe=`\0`+oe+(y===44?``:`\0`)}A=1}else switch(y){case 40:O+7===k&&b===108&&(O=0),E=++T;break;case 41:(E=--T)==0&&(A=1,oe+=`\0`)}break;case 9:case 32:switch(b){case 0:case 123:case 125:case 59:case 44:case 12:case 9:case 32:case 10:case 13:break;default:E===0&&(A=1,oe+=`\0`)}}B+=oe,y!==32&&y!==9&&(w=y)}}S=b,b=y,k++}if(R=U.length,re>0&&R===0&&Se.length===0&&t[0].length===0==0&&(a!==109||t.length===1&&(F>0?me:he)===t[0])&&(R=t.join(`,`).length+2),R>0){if(s=F===0&&a!==107?function(e){for(var t,n,i=0,a=e.length,o=Array(a);i<a;++i){for(var s=e[i].split(l),c=``,u=0,d=0,f=0,p=0,m=s.length;u<m;++u)if(!((d=(n=s[u]).length)===0&&m>1)){if(f=c.charCodeAt(c.length-1),p=n.charCodeAt(0),t=``,u!==0)switch(f){case 42:case 126:case 62:case 43:case 32:case 40:break;default:t=` `}switch(p){case 38:n=t+me;case 126:case 62:case 43:case 32:case 41:case 40:break;case 91:n=t+n+me;break;case 58:switch(2*n.charCodeAt(1)+3*n.charCodeAt(2)){case 530:if(ee>0){n=t+n.substring(8,d-1);break}default:(u<1||s[u-1].length<1)&&(n=t+me+n)}break;case 44:t=``;default:n=d>1&&n.indexOf(`:`)>0?t+n.replace(x,`$1`+me+`$2`):t+n+me}c+=n}o[i]=c.replace(r,``).trim()}return o}(t):t,z>0&&(c=V(le,U,s,e,N,M,R,a,o,a))!==void 0&&(U=c).length===0)return Ce+U+Se;if(U=s.join(`,`)+`{`+U+`}`,I*P!=0){switch(I===2&&!ye(U,2)&&(P=0),P){case 111:U=U.replace(g,`:-moz-$1`)+U;break;case 112:U=U.replace(h,`::-webkit-input-$1`)+U.replace(h,`::-moz-$1`)+U.replace(h,`:-ms-input-$1`)+U}P=0}}return Ce+U+Se}function _e(e,t,n){var r=t.trim().split(u),i=r,a=r.length,o=e.length;switch(o){case 0:case 1:for(var s=0,c=o===0?``:e[0]+` `;s<a;++s)i[s]=B(c,i[s],n,o).trim();break;default:s=0;var l=0;for(i=[];s<a;++s)for(var d=0;d<o;++d)i[l++]=B(e[d]+` `,r[s],n,o).trim()}return i}function B(e,t,n,r){var i=t,a=i.charCodeAt(0);switch(a<33&&(a=(i=i.trim()).charCodeAt(0)),a){case 38:switch(F+r){case 0:case 1:if(e.trim().length===0)break;default:return i.replace(d,`$1`+e.trim())}break;case 58:switch(i.charCodeAt(1)){case 103:if(ee>0&&F>0)return i.replace(f,`$1`).replace(d,`$1`+he);break;default:return e.trim()+i.replace(d,`$1`+e.trim())}default:if(n*F>0&&i.indexOf(`\f`)>0)return i.replace(d,(e.charCodeAt(0)===58?``:`$1`)+e.trim())}return e+i}function ve(e,t,n,r){var l,u=0,d=e+`;`,f=2*t+3*n+4*r;if(f===944)return function(e){var t=e.length,n=e.indexOf(`:`,9)+1,r=e.substring(0,n).trim(),i=e.substring(n,t-1).trim();switch(e.charCodeAt(9)*fe){case 0:break;case 45:if(e.charCodeAt(10)!==110)break;default:for(var a=i.split((i=``,s)),o=0,n=0,t=a.length;o<t;n=0,++o){for(var l=a[o],u=l.split(c);l=u[n];){var d=l.charCodeAt(0);if(fe===1&&(d>64&&d<90||d>96&&d<123||d===95||d===45&&l.charCodeAt(1)!==45))switch(isNaN(parseFloat(l))+(l.indexOf(`(`)!==-1)){case 1:switch(l){case`infinite`:case`alternate`:case`backwards`:case`running`:case`normal`:case`forwards`:case`both`:case`none`:case`linear`:case`ease`:case`ease-in`:case`ease-out`:case`ease-in-out`:case`paused`:case`reverse`:case`alternate-reverse`:case`inherit`:case`initial`:case`unset`:case`step-start`:case`step-end`:break;default:l+=pe}}u[n++]=l}i+=(o===0?``:`,`)+u.join(` `)}}return i=r+i+`;`,I===1||I===2&&ye(i,1)?k+i+i:i}(d);if(I===0||I===2&&!ye(d,1))return d;switch(f){case 1015:return d.charCodeAt(10)===97?k+d+d:d;case 951:return d.charCodeAt(3)===116?k+d+d:d;case 963:return d.charCodeAt(5)===110?k+d+d:d;case 1009:if(d.charCodeAt(4)!==100)break;case 969:case 942:return k+d+d;case 978:return k+d+A+d+d;case 1019:case 983:return k+d+A+d+j+d+d;case 883:return d.charCodeAt(8)===45?k+d+d:d.indexOf(`image-set(`,11)>0?d.replace(O,`$1-webkit-$2`)+d:d;case 932:if(d.charCodeAt(4)===45)switch(d.charCodeAt(5)){case 103:return`-webkit-box-`+d.replace(`-grow`,``)+k+d+j+d.replace(`grow`,`positive`)+d;case 115:return k+d+j+d.replace(`shrink`,`negative`)+d;case 98:return k+d+j+d.replace(`basis`,`preferred-size`)+d}return k+d+j+d+d;case 964:return k+d+`-ms-flex-`+d+d;case 1023:if(d.charCodeAt(8)!==99)break;return l=d.substring(d.indexOf(`:`,15)).replace(`flex-`,``).replace(`space-between`,`justify`),`-webkit-box-pack`+l+k+d+`-ms-flex-pack`+l+d;case 1005:return a.test(d)?d.replace(i,`:-webkit-`)+d.replace(i,`:-moz-`)+d:d;case 1e3:switch(u=(l=d.substring(13).trim()).indexOf(`-`)+1,l.charCodeAt(0)+l.charCodeAt(u)){case 226:l=d.replace(S,`tb`);break;case 232:l=d.replace(S,`tb-rl`);break;case 220:l=d.replace(S,`lr`);break;default:return d}return k+d+j+l+d;case 1017:if(d.indexOf(`sticky`,9)===-1)return d;case 975:switch(u=(d=e).length-10,f=(l=(d.charCodeAt(u)===33?d.substring(0,u):d).substring(e.indexOf(`:`,7)+1).trim()).charCodeAt(0)+(0|l.charCodeAt(7))){case 203:if(l.charCodeAt(8)<111)break;case 115:d=d.replace(l,k+l)+`;`+d;break;case 207:case 102:d=d.replace(l,k+(f>102?`inline-`:``)+`box`)+`;`+d.replace(l,k+l)+`;`+d.replace(l,j+l+`box`)+`;`+d}return d+`;`;case 938:if(d.charCodeAt(5)===45)switch(d.charCodeAt(6)){case 105:return l=d.replace(`-items`,``),k+d+`-webkit-box-`+l+`-ms-flex-`+l+d;case 115:return k+d+`-ms-flex-item-`+d.replace(T,``)+d;default:return k+d+`-ms-flex-line-pack`+d.replace(`align-content`,``).replace(T,``)+d}break;case 973:case 989:if(d.charCodeAt(3)!==45||d.charCodeAt(4)===122)break;case 931:case 953:if(!0===D.test(e))return(l=e.substring(e.indexOf(`:`)+1)).charCodeAt(0)===115?ve(e.replace(`stretch`,`fill-available`),t,n,r).replace(`:fill-available`,`:stretch`):d.replace(l,k+l)+d.replace(l,A+l.replace(`fill-`,``))+d;break;case 962:if(d=k+d+(d.charCodeAt(5)===102?j+d:``)+d,n+r===211&&d.charCodeAt(13)===105&&d.indexOf(`transform`,10)>0)return d.substring(0,d.indexOf(`;`,27)+1).replace(o,`$1-webkit-$2`)+d}return d}function ye(e,t){var n=e.indexOf(t===1?`:`:`{`),r=e.substring(0,t===3?10:n),i=e.substring(n+1,e.length-1);return ie(t===2?r.replace(E,`$1`):r,i,t)}function be(e,t){var n=ve(t,t.charCodeAt(0),t.charCodeAt(1),t.charCodeAt(2));return n===t+`;`?`(`+t+`)`:n.replace(w,` or ($1)`).substring(4)}function V(e,t,n,r,i,a,o,s,c,l){for(var u,d=0,f=t;d<z;++d)switch(u=R[d].call(U,e,f,n,r,i,a,o,s,c,l)){case void 0:case!1:case!0:case null:break;default:f=u}if(f!==t)return f}function xe(e,t,n,r){for(var i=t+1;i<n;++i)switch(r.charCodeAt(i)){case 47:if(e===42&&r.charCodeAt(i-1)===42&&t+2!==i)return i+1;break;case 10:if(e===47)return i+1}return i}function H(e){for(var t in e){var n=e[t];switch(t){case`keyframe`:fe=0|n;break;case`global`:ee=0|n;break;case`cascade`:F=0|n;break;case`compress`:te=0|n;break;case`semicolon`:ne=0|n;break;case`preserve`:re=0|n;break;case`prefix`:ie=null,n?typeof n==`function`?(I=2,ie=n):I=1:I=0}}return H}function U(t,n){if(this!==void 0&&this.constructor===U)return e(t);var i=t,a=i.charCodeAt(0);a<33&&(a=(i=i.trim()).charCodeAt(0)),fe>0&&(pe=i.replace(p,a===91?``:`-`)),a=1,F===1?he=i:me=i;var o,s=[he];z>0&&(o=V(oe,n,s,s,N,M,0,0,0,0))!==void 0&&typeof o==`string`&&(n=o);var c=ge(L,s,n,0,0);return z>0&&(o=V(ae,c,s,s,N,M,c.length,0,0,0))!==void 0&&typeof(c=o)!=`string`&&(a=0),pe=``,he=``,me=``,P=0,N=1,M=1,te*a==0?c:c.replace(r,``).replace(_,``).replace(v,`$1`).replace(y,`$1`).replace(b,` `)}return U.use=function e(t){switch(t){case void 0:case null:z=R.length=0;break;default:if(typeof t==`function`)R[z++]=t;else if(typeof t==`object`)for(var n=0,r=t.length;n<r;++n)e(t[n]);else de=0|!!t}return e},U.set=H,t!==void 0&&H(t),U})})),_=o(((e,t)=>{(function(n){typeof e==`object`&&t!==void 0?t.exports=n():typeof define==`function`&&define.amd?define(n()):window.stylisRuleSheet=n()})(function(){return function(e){var t=`/*|*/`,n=t+`}`;function r(t){if(t)try{e(t+`}`)}catch{}}return function(i,a,o,s,c,l,u,d,f,p){switch(i){case 1:if(f===0&&a.charCodeAt(0)===64)return e(a+`;`),``;break;case 2:if(d===0)return a+t;break;case 3:switch(d){case 102:case 112:return e(o[0]+a),``;default:return a+(p===0?t:``)}case-2:a.split(n).forEach(r)}}}})})),v=c(u()),y=h(),b=c(g()),x=c(_()),S={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},C=o((e=>{Object.defineProperty(e,"__esModule",{value:!0});var t=typeof Symbol==`function`&&Symbol.for,n=t?Symbol.for(`react.fragment`):60107,r=t?Symbol.for(`react.strict_mode`):60108,i=t?Symbol.for(`react.profiler`):60114,a=t?Symbol.for(`react.provider`):60109,o=t?Symbol.for(`react.context`):60110,s=t?Symbol.for(`react.concurrent_mode`):60111,c=t?Symbol.for(`react.forward_ref`):60112,l=t?Symbol.for(`react.suspense`):60113,u=t?Symbol.for(`react.memo`):60115,d=t?Symbol.for(`react.lazy`):60116;e.ForwardRef=c,e.isValidElementType=function(e){return typeof e==`string`||typeof e==`function`||e===n||e===s||e===i||e===r||e===l||typeof e==`object`&&!!e&&(e.$$typeof===d||e.$$typeof===u||e.$$typeof===a||e.$$typeof===o||e.$$typeof===c)}})),w=o(((e,t)=>{t.exports=C()}))();function T(e,t){if(e.length!==t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function E(e,t){t===void 0&&(t=T);var n,r=[],i,a=!1;return function(){var o=[...arguments];return a&&n===this&&t(o,r)?i:(i=e.apply(this,o),a=!0,n=this,r=o,i)}}var D=o(((e,t)=>{t.exports=`SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED`})),O=o(((e,t)=>{var n=D();function r(){}function i(){}i.resetWarningCache=r,t.exports=function(){function e(e,t,r,i,a,o){if(o!==n){var s=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name=`Invariant Violation`,s}}e.isRequired=e;function t(){return e}var a={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:r};return a.PropTypes=a,a}}));o(((e,t)=>{t.exports=O()()}))();function k(e){var t={};return function(n){return t[n]===void 0&&(t[n]=e(n)),t[n]}}var A=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,j=k(function(e){return A.test(e)||e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)<91});function M(e){return Object.prototype.toString.call(e).slice(8,-1)}function N(e){return M(e)===`Object`&&e.constructor===Object&&Object.getPrototypeOf(e)===Object.prototype}function P(e){return M(e)===`Array`}function F(e){return M(e)===`Symbol`}function I(e,t,n,r){var i=r.propertyIsEnumerable(t)?`enumerable`:`nonenumerable`;i===`enumerable`&&(e[t]=n),i===`nonenumerable`&&Object.defineProperty(e,t,{value:n,enumerable:!1,writable:!0,configurable:!0})}function ee(e,t,n){if(!N(t))return n&&P(n)&&n.forEach(function(n){t=n(e,t)}),t;var r={};if(N(e)){var i=Object.getOwnPropertyNames(e),a=Object.getOwnPropertySymbols(e);r=i.concat(a).reduce(function(n,r){var i=e[r];return(!F(r)&&!Object.getOwnPropertyNames(t).includes(r)||F(r)&&!Object.getOwnPropertySymbols(t).includes(r))&&I(n,r,i,e),n},{})}var o=Object.getOwnPropertyNames(t),s=Object.getOwnPropertySymbols(t);return o.concat(s).reduce(function(r,i){var a=t[i],o=N(e)?e[i]:void 0;return n&&P(n)&&n.forEach(function(e){a=e(o,a)}),o!==void 0&&N(a)&&(a=ee(o,a,n)),I(r,i,a,t),r},r)}function te(e){var t=[...arguments].slice(1),n=null,r=e;return N(e)&&e.extensions&&Object.keys(e).length===1&&(r={},n=e.extensions),t.reduce(function(e,t){return ee(e,t,n)},r)}var ne=(function(e,t){for(var n=[e[0]],r=0,i=t.length;r<i;r+=1)n.push(t[r],e[r+1]);return n}),re=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},L=function(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)},R=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ie=function(e,t){if(typeof t!=`function`&&t!==null)throw TypeError(`Super expression must either be null or a function, not `+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},ae=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n},oe=function(e,t){if(!e)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return t&&(typeof t==`object`||typeof t==`function`)?t:e},se=(function(e){return(e===void 0?`undefined`:re(e))===`object`&&e.constructor===Object}),ce=Object.freeze([]),le=Object.freeze({});function ue(e){return typeof e==`function`}function de(e){return e.displayName||e.name||`Component`}function fe(e){return typeof e==`function`&&!(e.prototype&&e.prototype.isReactComponent)}function pe(e){return e&&typeof e.styledComponentId==`string`}var me=typeof process<`u`&&({}.REACT_APP_SC_ATTR||{}.SC_ATTR)||`data-styled`,he=`data-styled-version`,ge=`data-styled-streamed`,_e=typeof window<`u`&&`HTMLElement`in window,B=typeof SC_DISABLE_SPEEDY==`boolean`&&SC_DISABLE_SPEEDY||typeof process<`u`&&({}.REACT_APP_SC_DISABLE_SPEEDY||{}.SC_DISABLE_SPEEDY)||!1,ve={},ye=function(e){ie(t,e);function t(n){L(this,t);var r=[...arguments].slice(1);if(1)var i=oe(this,e.call(this,`An error occurred. See https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/errors.md#`+n+` for more information.`+(r.length>0?` Additional arguments: `+r.join(`, `):``)));else var i;return oe(i)}return t}(Error),be=/^[^\S\n]*?\/\* sc-component-id:\s*(\S+)\s+\*\//gm,V=(function(e){var t=``+(e||``),n=[];return t.replace(be,function(e,t,r){return n.push({componentId:t,matchIndex:r}),e}),n.map(function(e,r){var i=e.componentId,a=e.matchIndex,o=n[r+1];return{componentId:i,cssFromDOM:o?t.slice(a,o.matchIndex):t.slice(a)}})}),xe=/^\s*\/\/.*$/gm,H=new b.default({global:!1,cascade:!0,keyframe:!1,prefix:!1,compress:!1,semicolon:!0}),U=new b.default({global:!1,cascade:!0,keyframe:!1,prefix:!0,compress:!1,semicolon:!1}),Se=[],Ce=function(e){if(e===-2){var t=Se;return Se=[],t}},we=(0,x.default)(function(e){Se.push(e)}),Te=void 0,Ee=void 0,De=void 0,Oe=function(e,t,n){return t>0&&n.slice(0,t).indexOf(Ee)!==-1&&n.slice(t-Ee.length,t)!==Ee?`.`+Te:e};U.use([function(e,t,n){e===2&&n.length&&n[0].lastIndexOf(Ee)>0&&(n[0]=n[0].replace(De,Oe))},we,Ce]),H.use([we,Ce]);var ke=function(e){return H(``,e)};function Ae(e,t,n){var r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:`&`,i=e.join(``).replace(xe,``),a=t&&n?n+` `+t+` { `+i+` }`:i;return Te=r,Ee=t,De=RegExp(`\\`+Ee+`\\b`,`g`),U(n||!t?``:t,a)}var je=(function(){return typeof __webpack_nonce__<`u`?__webpack_nonce__:null}),Me=function(e,t,n){if(n){var r=e[t]||(e[t]=Object.create(null));r[n]=!0}},Ne=function(e,t){e[t]=Object.create(null)},Pe=function(e){return function(t,n){return e[t]!==void 0&&e[t][n]}},Fe=function(e){var t=``;for(var n in e)t+=Object.keys(e[n]).join(` `)+` `;return t.trim()},Ie=function(e){var t=Object.create(null);for(var n in e)t[n]=z({},e[n]);return t},Le=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets.length,n=0;n<t;n+=1){var r=document.styleSheets[n];if(r.ownerNode===e)return r}throw new ye(10)},Re=function(e,t,n){if(!t)return!1;var r=e.cssRules.length;try{e.insertRule(t,n<=r?n:r)}catch{return!1}return!0},ze=function(e,t,n){for(var r=t-n,i=t;i>r;--i)e.deleteRule(i)},Be=function(e){return`
/* sc-component-id: `+e+` */
`},Ve=function(e,t){for(var n=0,r=0;r<=t;r+=1)n+=e[r];return n},He=function(e,t,n){var r=document.createElement(`style`);r.setAttribute(me,``),r.setAttribute(he,`4.3.2`);var i=je();if(i&&r.setAttribute(`nonce`,i),r.appendChild(document.createTextNode(``)),e&&!t)e.appendChild(r);else{if(!t||!e||!t.parentNode)throw new ye(6);t.parentNode.insertBefore(r,n?t:t.nextSibling)}return r},Ue=function(e,t){return function(n){var r=je();return`<style `+[r&&`nonce="`+r+`"`,me+`="`+Fe(t)+`"`,he+`="4.3.2"`,n].filter(Boolean).join(` `)+`>`+e()+`</style>`}},We=function(e,t){return function(){var n,r=(n={},n[me]=Fe(t),n[he]=`4.3.2`,n),i=je();return i&&(r.nonce=i),v.createElement(`style`,z({},r,{dangerouslySetInnerHTML:{__html:e()}}))}},Ge=function(e){return function(){return Object.keys(e)}},Ke=function(e,t){var n=Object.create(null),r=Object.create(null),i=[],a=t!==void 0,o=!1,s=function(e){var t=r[e];return t===void 0?(r[e]=i.length,i.push(0),Ne(n,e),r[e]):t},c=function(r,c,l){for(var u=s(r),d=Le(e),f=Ve(i,u),p=0,m=[],h=c.length,g=0;g<h;g+=1){var _=c[g],v=a;v&&_.indexOf(`@import`)!==-1?m.push(_):Re(d,_,f+p)&&(v=!1,p+=1)}a&&m.length>0&&(o=!0,t().insertRules(r+`-import`,m)),i[u]+=p,Me(n,r,l)},l=function(s){var c=r[s];if(c!==void 0){var l=i[c];ze(Le(e),Ve(i,c)-1,l),i[c]=0,Ne(n,s),a&&o&&t().removeRules(s+`-import`)}},u=function(){var t=Le(e).cssRules,n=``;for(var a in r){n+=Be(a);for(var o=r[a],s=Ve(i,o),c=s-i[o];c<s;c+=1){var l=t[c];l!==void 0&&(n+=l.cssText)}}return n};return{clone:function(){throw new ye(5)},css:u,getIds:Ge(r),hasNameForId:Pe(n),insertMarker:s,insertRules:c,removeRules:l,sealed:!1,styleTag:e,toElement:We(u,n),toHTML:Ue(u,n)}},qe=function(e){return document.createTextNode(Be(e))},Je=function(e,t){var n=Object.create(null),r=Object.create(null),i=t!==void 0,a=!1,o=function(t){var i=r[t];return i===void 0?(r[t]=qe(t),e.appendChild(r[t]),n[t]=Object.create(null),r[t]):i},s=function(e,r,s){for(var c=o(e),l=[],u=r.length,d=0;d<u;d+=1){var f=r[d],p=i;if(p&&f.indexOf(`@import`)!==-1)l.push(f);else{p=!1;var m=d===u-1?``:` `;c.appendData(``+f+m)}}Me(n,e,s),i&&l.length>0&&(a=!0,t().insertRules(e+`-import`,l))},c=function(o){var s=r[o];if(s!==void 0){var c=qe(o);e.replaceChild(c,s),r[o]=c,Ne(n,o),i&&a&&t().removeRules(o+`-import`)}},l=function(){var e=``;for(var t in r)e+=r[t].data;return e};return{clone:function(){throw new ye(5)},css:l,getIds:Ge(r),hasNameForId:Pe(n),insertMarker:o,insertRules:s,removeRules:c,sealed:!1,styleTag:e,toElement:We(l,n),toHTML:Ue(l,n)}},Ye=function e(t,n){var r=t===void 0?Object.create(null):t,i=n===void 0?Object.create(null):n,a=function(e){var t=i[e];return t===void 0?i[e]=[``]:t},o=function(e,t,n){var i=a(e);i[0]+=t.join(` `),Me(r,e,n)},s=function(e){var t=i[e];t!==void 0&&(t[0]=``,Ne(r,e))},c=function(){var e=``;for(var t in i){var n=i[t][0];n&&(e+=Be(t)+n)}return e};return{clone:function(){var t=Ie(r),n=Object.create(null);for(var a in i)n[a]=[i[a][0]];return e(t,n)},css:c,getIds:Ge(i),hasNameForId:Pe(r),insertMarker:a,insertRules:o,removeRules:s,sealed:!1,styleTag:null,toElement:We(c,r),toHTML:Ue(c,r)}},Xe=function(e,t,n,r,i){if(_e&&!n){var a=He(e,t,r);return B?Je(a,i):Ke(a,i)}return Ye()},Ze=function(e,t,n){for(var r=0,i=n.length;r<i;r+=1){var a=n[r],o=a.componentId,s=a.cssFromDOM,c=ke(s);e.insertRules(o,c)}for(var l=0,u=t.length;l<u;l+=1){var d=t[l];d.parentNode&&d.parentNode.removeChild(d)}},Qe=/\s+/,$e=void 0;$e=_e?B?40:1e3:-1;var et=0,tt=void 0,nt=function(){function e(){var t=this,n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:_e?document.head:null,r=arguments.length>1&&arguments[1]!==void 0&&arguments[1];L(this,e),this.getImportRuleTag=function(){var e=t.importRuleTag;if(e!==void 0)return e;var n=t.tags[0];return t.importRuleTag=Xe(t.target,n?n.styleTag:null,t.forceServer,!0)},et+=1,this.id=et,this.forceServer=r,this.target=r?null:n,this.tagMap={},this.deferred={},this.rehydratedNames={},this.ignoreRehydratedNames={},this.tags=[],this.capacity=1,this.clones=[]}return e.prototype.rehydrate=function(){if(!_e||this.forceServer)return this;var e=[],t=[],n=!1,r=document.querySelectorAll(`style[`+me+`][`+he+`="4.3.2"]`),i=r.length;if(!i)return this;for(var a=0;a<i;a+=1){var o=r[a];n||=!!o.getAttribute(ge);for(var s=(o.getAttribute(me)||``).trim().split(Qe),c=s.length,l=0,u;l<c;l+=1)u=s[l],this.rehydratedNames[u]=!0;t.push.apply(t,V(o.textContent)),e.push(o)}var d=t.length;if(!d)return this;var f=this.makeTag(null);Ze(f,e,t),this.capacity=Math.max(1,$e-d),this.tags.push(f);for(var p=0;p<d;p+=1)this.tagMap[t[p].componentId]=f;return this},e.reset=function(){tt=new e(void 0,arguments.length>0&&arguments[0]!==void 0&&arguments[0]).rehydrate()},e.prototype.clone=function(){var t=new e(this.target,this.forceServer);return this.clones.push(t),t.tags=this.tags.map(function(e){for(var n=e.getIds(),r=e.clone(),i=0;i<n.length;i+=1)t.tagMap[n[i]]=r;return r}),t.rehydratedNames=z({},this.rehydratedNames),t.deferred=z({},this.deferred),t},e.prototype.sealAllTags=function(){this.capacity=1,this.tags.forEach(function(e){e.sealed=!0})},e.prototype.makeTag=function(e){var t=e?e.styleTag:null;return Xe(this.target,t,this.forceServer,!1,this.getImportRuleTag)},e.prototype.getTagForId=function(e){var t=this.tagMap[e];if(t!==void 0&&!t.sealed)return t;var n=this.tags[this.tags.length-1];return--this.capacity,this.capacity===0&&(this.capacity=$e,n=this.makeTag(n),this.tags.push(n)),this.tagMap[e]=n},e.prototype.hasId=function(e){return this.tagMap[e]!==void 0},e.prototype.hasNameForId=function(e,t){if(this.ignoreRehydratedNames[e]===void 0&&this.rehydratedNames[t])return!0;var n=this.tagMap[e];return n!==void 0&&n.hasNameForId(e,t)},e.prototype.deferredInject=function(e,t){if(this.tagMap[e]===void 0){for(var n=this.clones,r=0;r<n.length;r+=1)n[r].deferredInject(e,t);this.getTagForId(e).insertMarker(e),this.deferred[e]=t}},e.prototype.inject=function(e,t,n){for(var r=this.clones,i=0;i<r.length;i+=1)r[i].inject(e,t,n);var a=this.getTagForId(e);if(this.deferred[e]!==void 0){var o=this.deferred[e].concat(t);a.insertRules(e,o,n),this.deferred[e]=void 0}else a.insertRules(e,t,n)},e.prototype.remove=function(e){var t=this.tagMap[e];if(t!==void 0){for(var n=this.clones,r=0;r<n.length;r+=1)n[r].remove(e);t.removeRules(e),this.ignoreRehydratedNames[e]=!0,this.deferred[e]=void 0}},e.prototype.toHTML=function(){return this.tags.map(function(e){return e.toHTML()}).join(``)},e.prototype.toReactElements=function(){var e=this.id;return this.tags.map(function(t,n){var r=`sc-`+e+`-`+n;return(0,v.cloneElement)(t.toElement(),{key:r})})},R(e,null,[{key:`master`,get:function(){return tt||=new e().rehydrate()}},{key:`instance`,get:function(){return e.master}}]),e}(),rt=function(){function e(t,n){var r=this;L(this,e),this.inject=function(e){e.hasNameForId(r.id,r.name)||e.inject(r.id,r.rules,r.name)},this.toString=function(){throw new ye(12,String(r.name))},this.name=t,this.rules=n,this.id=`sc-keyframes-`+t}return e.prototype.getName=function(){return this.name},e}(),it=/([A-Z])/g,at=/^ms-/;function ot(e){return e.replace(it,`-$1`).toLowerCase().replace(at,`-ms-`)}function st(e,t){return t==null||typeof t==`boolean`||t===``?``:typeof t==`number`&&t!==0&&!(e in S)?t+`px`:String(t).trim()}var ct=function(e){return e==null||e===!1||e===``},lt=function e(t,n){var r=[];return Object.keys(t).forEach(function(n){if(!ct(t[n])){if(se(t[n]))return r.push.apply(r,e(t[n],n)),r;if(ue(t[n]))return r.push(ot(n)+`:`,t[n],`;`),r;r.push(ot(n)+`: `+st(n,t[n])+`;`)}return r}),n?[n+` {`].concat(r,[`}`]):r};function ut(e,t,n){if(Array.isArray(e)){for(var r=[],i=0,a=e.length,o;i<a;i+=1)o=ut(e[i],t,n),o!==null&&(Array.isArray(o)?r.push.apply(r,o):r.push(o));return r}return ct(e)?null:pe(e)?`.`+e.styledComponentId:ue(e)?fe(e)&&t?ut(e(t),t,n):e:e instanceof rt?n?(e.inject(n),e.getName()):e:se(e)?lt(e):e.toString()}function W(e){var t=[...arguments].slice(1);return ue(e)||se(e)?ut(ne(ce,[e].concat(t))):ut(ne(e,t))}function dt(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:le;if(!(0,w.isValidElementType)(t))throw new ye(1,String(t));var r=function(){return e(t,n,W.apply(void 0,arguments))};return r.withConfig=function(r){return dt(e,t,z({},n,r))},r.attrs=function(r){return dt(e,t,z({},n,{attrs:Array.prototype.concat(n.attrs,r).filter(Boolean)}))},r}function ft(e){for(var t=e.length|0,n=t|0,r=0,i;t>=4;)i=e.charCodeAt(r)&255|(e.charCodeAt(++r)&255)<<8|(e.charCodeAt(++r)&255)<<16|(e.charCodeAt(++r)&255)<<24,i=1540483477*(i&65535)+((1540483477*(i>>>16)&65535)<<16),i^=i>>>24,i=1540483477*(i&65535)+((1540483477*(i>>>16)&65535)<<16),n=1540483477*(n&65535)+((1540483477*(n>>>16)&65535)<<16)^i,t-=4,++r;switch(t){case 3:n^=(e.charCodeAt(r+2)&255)<<16;case 2:n^=(e.charCodeAt(r+1)&255)<<8;case 1:n^=e.charCodeAt(r)&255,n=1540483477*(n&65535)+((1540483477*(n>>>16)&65535)<<16)}return n^=n>>>13,n=1540483477*(n&65535)+((1540483477*(n>>>16)&65535)<<16),(n^n>>>15)>>>0}var pt=52,mt=function(e){return String.fromCharCode(e+(e>25?39:97))};function ht(e){var t=``,n=void 0;for(n=e;n>pt;n=Math.floor(n/pt))t=mt(n%pt)+t;return mt(n%pt)+t}function gt(e){for(var t in e)if(ue(e[t]))return!0;return!1}function _t(e,t){for(var n=0;n<e.length;n+=1){var r=e[n];if(Array.isArray(r)&&!_t(r,t)||ue(r)&&!pe(r))return!1}return!t.some(function(e){return ue(e)||gt(e)})}var vt=function(e){return ht(ft(e))},yt=function(){function e(t,n,r){L(this,e),this.rules=t,this.isStatic=_t(t,n),this.componentId=r,nt.master.hasId(r)||nt.master.deferredInject(r,[])}return e.prototype.generateAndInjectStyles=function(e,t){var n=this.isStatic,r=this.componentId,i=this.lastClassName;if(_e&&n&&typeof i==`string`&&t.hasNameForId(r,i))return i;var a=ut(this.rules,e,t),o=vt(this.componentId+a.join(``));return t.hasNameForId(r,o)||t.inject(this.componentId,Ae(a,`.`+o,void 0,r),o),this.lastClassName=o,o},e.generateName=function(e){return vt(e)},e}(),bt=(function(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:le,r=n?e.theme===n.theme:!1;return e.theme&&!r?e.theme:t||n.theme}),xt=/[[\].#*$><+~=|^:(),"'`-]+/g,St=/(^-|-$)/g;function Ct(e){return e.replace(xt,`-`).replace(St,``)}function wt(e){return typeof e==`string`&&!0}function Tt(e){return wt(e)?`styled.`+e:`Styled(`+de(e)+`)`}var Et,Dt={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDerivedStateFromProps:!0,propTypes:!0,type:!0},Ot={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},kt=(Et={},Et[w.ForwardRef]={$$typeof:!0,render:!0},Et),At=Object.defineProperty,jt=Object.getOwnPropertyNames,Mt=Object.getOwnPropertySymbols,Nt=Mt===void 0?function(){return[]}:Mt,Pt=Object.getOwnPropertyDescriptor,Ft=Object.getPrototypeOf,It=Object.prototype,Lt=Array.prototype;function Rt(e,t,n){if(typeof t!=`string`){var r=Ft(t);r&&r!==It&&Rt(e,r,n);for(var i=Lt.concat(jt(t),Nt(t)),a=kt[e.$$typeof]||Dt,o=kt[t.$$typeof]||Dt,s=i.length,c=void 0,l=void 0;s--;)if(l=i[s],!Ot[l]&&!(n&&n[l])&&!(o&&o[l])&&!(a&&a[l])&&(c=Pt(t,l),c))try{At(e,l,c)}catch{}return e}return e}function zt(e){return!!(e&&e.prototype&&e.prototype.isReactComponent)}var Bt=(0,v.createContext)(),Vt=Bt.Consumer;(function(e){ie(t,e);function t(n){L(this,t);var r=oe(this,e.call(this,n));return r.getContext=E(r.getContext.bind(r)),r.renderInner=r.renderInner.bind(r),r}return t.prototype.render=function(){return this.props.children?v.createElement(Bt.Consumer,null,this.renderInner):null},t.prototype.renderInner=function(e){var t=this.getContext(this.props.theme,e);return v.createElement(Bt.Provider,{value:t},v.Children.only(this.props.children))},t.prototype.getTheme=function(e,t){if(ue(e))return e(t);if(e===null||Array.isArray(e)||(e===void 0?`undefined`:re(e))!==`object`)throw new ye(8);return z({},t,e)},t.prototype.getContext=function(e,t){return this.getTheme(e,t)},t})(v.Component),function(){function e(){L(this,e),this.masterSheet=nt.master,this.instance=this.masterSheet.clone(),this.sealed=!1}return e.prototype.seal=function(){if(!this.sealed){var e=this.masterSheet.clones.indexOf(this.instance);this.masterSheet.clones.splice(e,1),this.sealed=!0}},e.prototype.collectStyles=function(e){if(this.sealed)throw new ye(2);return v.createElement(Wt,{sheet:this.instance},e)},e.prototype.getStyleTags=function(){return this.seal(),this.instance.toHTML()},e.prototype.getStyleElement=function(){return this.seal(),this.instance.toReactElements()},e.prototype.interleaveWithNodeStream=function(e){throw new ye(3)},e}();var Ht=(0,v.createContext)(),Ut=Ht.Consumer,Wt=function(e){ie(t,e);function t(n){L(this,t);var r=oe(this,e.call(this,n));return r.getContext=E(r.getContext),r}return t.prototype.getContext=function(e,t){if(e)return e;if(t)return new nt(t);throw new ye(4)},t.prototype.render=function(){var e=this.props,t=e.children,n=e.sheet,r=e.target;return v.createElement(Ht.Provider,{value:this.getContext(n,r)},t)},t}(v.Component),Gt={};function Kt(e,t,n){var r=typeof t==`string`?Ct(t):`sc`,i=(Gt[r]||0)+1;Gt[r]=i;var a=r+`-`+e.generateName(r+i);return n?n+`-`+a:a}var qt=function(e){ie(t,e);function t(){L(this,t);var n=oe(this,e.call(this));return n.attrs={},n.renderOuter=n.renderOuter.bind(n),n.renderInner=n.renderInner.bind(n),n}return t.prototype.render=function(){return v.createElement(Ut,null,this.renderOuter)},t.prototype.renderOuter=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:nt.master;return this.styleSheet=e,this.props.forwardedComponent.componentStyle.isStatic?this.renderInner():v.createElement(Vt,null,this.renderInner)},t.prototype.renderInner=function(e){var t=this.props.forwardedComponent,n=t.componentStyle,r=t.defaultProps;t.displayName;var i=t.foldedComponentIds,a=t.styledComponentId,o=t.target,s=void 0;s=n.isStatic?this.generateAndInjectStyles(le,this.props):this.generateAndInjectStyles(bt(this.props,e,r)||le,this.props);var c=this.props.as||this.attrs.as||o,l=wt(c),u={},d=z({},this.attrs,this.props),f=void 0;for(f in d)if(f===`forwardedComponent`||f===`as`)continue;else f===`forwardedRef`?u.ref=d[f]:f===`forwardedAs`?u.as=d[f]:(!l||j(f))&&(u[f]=d[f]);return this.props.style&&this.attrs.style&&(u.style=z({},this.attrs.style,this.props.style)),u.className=Array.prototype.concat(i,this.props.className,a,this.attrs.className,s).filter(Boolean).join(` `),(0,v.createElement)(c,u)},t.prototype.buildExecutionContext=function(e,t,n){var r=this,i=z({},t,{theme:e});return n.length?(this.attrs={},n.forEach(function(e){var t=e,n=!1,a=void 0,o=void 0;for(o in ue(t)&&(t=t(i),n=!0),t)a=t[o],n||ue(a)&&!zt(a)&&!pe(a)&&(a=a(i)),r.attrs[o]=a,i[o]=a}),i):i},t.prototype.generateAndInjectStyles=function(e,t){var n=t.forwardedComponent,r=n.attrs,i=n.componentStyle;return n.warnTooManyClasses,i.isStatic&&!r.length?i.generateAndInjectStyles(le,this.styleSheet):i.generateAndInjectStyles(this.buildExecutionContext(e,t,r),this.styleSheet)},t}(v.Component);function Jt(e,t,n){var r=pe(e),i=!wt(e),a=t.displayName,o=a===void 0?Tt(e):a,s=t.componentId,c=s===void 0?Kt(yt,t.displayName,t.parentComponentId):s,l=t.ParentComponent,u=l===void 0?qt:l,d=t.attrs,f=d===void 0?ce:d,p=t.displayName&&t.componentId?Ct(t.displayName)+`-`+t.componentId:t.componentId||c,m=r&&e.attrs?Array.prototype.concat(e.attrs,f).filter(Boolean):f,h=new yt(r?e.componentStyle.rules.concat(n):n,m,p),g=void 0,_=function(e,t){return v.createElement(u,z({},e,{forwardedComponent:g,forwardedRef:t}))};return _.displayName=o,g=v.forwardRef(_),g.displayName=o,g.attrs=m,g.componentStyle=h,g.foldedComponentIds=r?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):ce,g.styledComponentId=p,g.target=r?e.target:e,g.withComponent=function(e){var r=t.componentId;return Jt(e,z({},ae(t,[`componentId`]),{attrs:m,componentId:r&&r+`-`+(wt(e)?e:Ct(de(e))),ParentComponent:u}),n)},Object.defineProperty(g,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(t){this._foldedDefaultProps=r?te(e.defaultProps,t):t}}),g.toString=function(){return`.`+g.styledComponentId},i&&Rt(g,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,styledComponentId:!0,target:!0,withComponent:!0}),g}var Yt=`a.abbr.address.area.article.aside.audio.b.base.bdi.bdo.big.blockquote.body.br.button.canvas.caption.cite.code.col.colgroup.data.datalist.dd.del.details.dfn.dialog.div.dl.dt.em.embed.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.iframe.img.input.ins.kbd.keygen.label.legend.li.link.main.map.mark.marquee.menu.menuitem.meta.meter.nav.noscript.object.ol.optgroup.option.output.p.param.picture.pre.progress.q.rp.rt.ruby.s.samp.script.section.select.small.source.span.strong.style.sub.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.title.tr.track.u.ul.var.video.wbr.circle.clipPath.defs.ellipse.foreignObject.g.image.line.linearGradient.marker.mask.path.pattern.polygon.polyline.radialGradient.rect.stop.svg.text.tspan`.split(`.`),G=function(e){return dt(Jt,e)};Yt.forEach(function(e){G[e]=G(e)});var Xt=function(){function e(t,n){L(this,e),this.rules=t,this.componentId=n,this.isStatic=_t(t,ce),nt.master.hasId(n)||nt.master.deferredInject(n,[])}return e.prototype.createStyles=function(e,t){var n=Ae(ut(this.rules,e,t),``);t.inject(this.componentId,n)},e.prototype.removeStyles=function(e){var t=this.componentId;e.hasId(t)&&e.remove(t)},e.prototype.renderStyles=function(e,t){this.removeStyles(t),this.createStyles(e,t)},e}();_e&&(window.scCGSHMRCache={});function Zt(e){var t=[...arguments].slice(1),n=W.apply(void 0,[e].concat(t)),r=`sc-global-`+ft(JSON.stringify(n)),i=new Xt(n,r),a=function(e){ie(t,e);function t(n){L(this,t);var r=oe(this,e.call(this,n)),i=r.constructor,a=i.globalStyle,o=i.styledComponentId;return _e&&(window.scCGSHMRCache[o]=(window.scCGSHMRCache[o]||0)+1),r.state={globalStyle:a,styledComponentId:o},r}return t.prototype.componentWillUnmount=function(){window.scCGSHMRCache[this.state.styledComponentId]&&--window.scCGSHMRCache[this.state.styledComponentId],window.scCGSHMRCache[this.state.styledComponentId]===0&&this.state.globalStyle.removeStyles(this.styleSheet)},t.prototype.render=function(){var e=this;return v.createElement(Ut,null,function(t){e.styleSheet=t||nt.master;var n=e.state.globalStyle;return n.isStatic?(n.renderStyles(ve,e.styleSheet),null):v.createElement(Vt,null,function(t){var r=e.constructor.defaultProps,i=z({},e.props);return t!==void 0&&(i.theme=bt(e.props,t,r)),n.renderStyles(i,e.styleSheet),null})})},t}(v.Component);return a.globalStyle=i,a.styledComponentId=r,a}var Qt={DOSSIER:`dossier`,BLUEPRINT:`blueprint`,VAULT:`vault`},$t=Object.values(Qt),en=Qt.DOSSIER;function tn(e){return $t.includes(e)}function nn(e=Math.random){return $t[Math.floor(e()*$t.length)%$t.length]}var rn={"--ha-friend":`mediumseagreen`,"--ha-foe":`indianred`,"--ha-team-0":`#3d3843`,"--ha-team-0-line":`#c7d2e3`,"--ha-team-0-ink":`#e6e9ee`,"--ha-team-1":`#c42b3a`,"--ha-team-1-line":`#e23048`,"--ha-team-1-ink":`#fff2f2`,"--ha-team-2":`#d5d3da`,"--ha-team-2-line":`#8f959f`,"--ha-team-2-ink":`#1b1e23`,"--ha-team-3":`#e9bb1c`,"--ha-team-3-line":`#a8842f`,"--ha-team-3-ink":`#2b2410`},an={"--ha-ground":`#c9b083`,"--ha-ground-wash":`radial-gradient(140% 110% at 8% -8%, rgba(255, 250, 235, 0.5), transparent 55%),
		repeating-linear-gradient(97deg, rgba(120, 92, 48, 0.055) 0 2px, transparent 2px 6px)`,"--ha-well":`#1c2b25`,"--ha-well-edge":`#0f1712`,"--ha-panel":`#ddc79a`,"--ha-panel-edge":`#8a6e3e`,"--ha-panel-texture":`none`,"--ha-panel-shadow":`1px 2px 0 rgba(90, 70, 36, 0.3)`,"--ha-panel-radius":`0`,"--ha-panel-ornament":`radial-gradient(circle 5px at 22% 7px, #1d1a14 98%, transparent 100%),
		radial-gradient(circle 5px at 78% 7px, #1d1a14 98%, transparent 100%)`,"--ha-ink":`#2c2620`,"--ha-ink-dim":`#6d5b38`,"--ha-ink-faint":`#7b6634`,"--ha-ink-on-accent":`#f0e4cc`,"--ha-rule":`rgba(90, 70, 36, 0.45)`,"--ha-accent":`#a3282b`,"--ha-accent-wash":`rgba(163, 40, 43, 0.16)`,"--ha-control-bg":`transparent`,"--ha-control-ink":`#a3282b`,"--ha-control-edge":`2px solid #a3282b`,"--ha-control-radius":`0`,"--ha-control-clip":`none`,"--ha-control-rotate":`-1.2deg`,"--ha-control-shadow":`none`,"--ha-control-shadow-hover":`none`,"--ha-control-ink-shadow":`0.6px 0.6px 0 rgba(163, 40, 43, 0.35)`,"--ha-control-bg-active":`#a3282b`,"--ha-control-ink-active":`#f0e4cc`,"--ha-control-bg-off":`transparent`,"--ha-control-ink-off":`#7c6a44`,"--ha-control-edge-off":`2px dashed #7c6a44`,"--ha-face":`'American Typewriter', 'Courier New', Courier, monospace`,"--ha-face-data":`'American Typewriter', 'Courier New', Courier, monospace`,"--ha-track":`0.2em`,"--ha-track-label":`0.16em`,"--ha-weight":`400`,"--ha-title-frame":`1px solid transparent`,"--ha-title-rule":`2px solid #2c2620`,"--ha-title-bg":`transparent`,"--ha-card-bg-mix":`rgba(241, 224, 213, 0.75)`,"--ha-card-edge":`1px solid rgba(90, 70, 36, 0.55)`,"--ha-card-shadow":`2px 3px 0 rgba(90, 60, 40, 0.28)`,"--ha-card-rotate":`-1deg`,"--ha-team-overlay":`none`,"--ha-team-tab":`block`,"--ha-card-note-ink":`#6a5834`,"--ha-card-label-fill":`0%`,"--ha-card-label-tint":`55%`,"--ha-card-label-ink":`#241f19`,"--ha-card-label-weight":`400`,"--ha-card-label-pad":`0 2px 1px`,"--ha-card-label-radius":`0`,"--ha-card-label-rule":`1px solid currentColor`,"--ha-card-label-shadow":`none`,"--ha-card-fig-friend":`''`,"--ha-card-fig-foe":`''`,"--ha-card-team-fill":`100%`,"--ha-card-team-edge":`1px solid rgba(44, 38, 32, 0.45)`,"--ha-card-team-side":`1px solid transparent`,"--ha-card-team-radius":`0`,"--ha-card-team-shadow":`none`,"--ha-card-chip-size":`26px`,"--ha-card-chip-radius":`0`,"--ha-card-chip-overlay":`none`,"--ha-card-chip-inner":`1px 1px 0 rgba(90, 70, 36, 0.35)`,"--ha-card-chip-glow":`0%`,"--ha-card-chip-rotate":`-2.5deg`,"--ha-card-swatch-bg":`transparent`,"--ha-card-swatch-edge":`1px solid transparent`,"--ha-card-swatch-radius":`0`,"--ha-card-swatch-pad":`0`,"--ha-card-swatch-shadow":`none`,"--ha-card-swatch-key":`'colour of record'`,"--ha-card-swatch-ref":`none`,"--ha-card-swatch-name":`none`,"--ha-hq-glass":`rgba(60, 44, 20, 0.1)`,"--ha-hq-inner":`inset 0 0 18px rgba(90, 70, 36, 0.22)`,"--ha-band-bg":`#2c2620`,"--ha-band-ink":`#e0cfa4`,"--ha-cell-divider":`1px dotted rgba(90, 70, 36, 0.55)`,"--ha-cell-bg":`transparent`,"--ha-hq-label-edge":`1px solid rgba(44, 38, 32, 0.5)`,"--ha-hq-label-radius":`0`,"--ha-hq-label-clip":`polygon(0 0, 100% 0, calc(100% - 7px) 100%, 0 100%)`,"--ha-hq-label-shadow":`1px 1px 0 rgba(90, 70, 36, 0.35)`,"--ha-claim-bg":`rgba(255, 250, 235, 0.72)`,"--ha-claim-ink":`#a3282b`,"--ha-claim-frame":`0 0 0 1px #a3282b`,"--ha-claim-rotate":`-2deg`,"--ha-claim-align":`left`,"--ha-claim-key":`'CONTROL: '`,"--ha-claim-empty":`'CONTROL: UNCLAIMED'`,"--ha-claim-rule":`1px solid transparent`,"--ha-claim-holder-ink":`#2c2620`,"--ha-claim-holder-rule":`1px solid #a3282b`,"--ha-mark-display":`none`,"--ha-mark-ink":`transparent`,"--ha-mark-rule":`transparent`,"--ha-control-radius-primary":`50% / 44%`,"--ha-mark-initials":`inline-flex`,"--ha-stamp-edge":`2px double #a3282b`,"--ha-stamp-ink":`#a3282b`,"--ha-stamp-rotate":`-2.5deg`,"--ha-tally-bg":`rgba(255, 250, 235, 0.4)`,"--ha-tally-edge":`1px dotted rgba(90, 70, 36, 0.55)`,"--ha-strip-mark":`''`,"--ha-strip-mark-display":`none`,"--ha-field-bg":`rgba(255, 250, 235, 0.55)`,"--ha-field-ink":`#2c2620`,"--ha-field-edge":`1px solid rgba(90, 70, 36, 0.5)`},on={"--ha-ground":`#143452`,"--ha-ground-wash":`url("data:image/svg+xml,%3Csvg xmlns='http:%2F%2Fwww.w3.org%2F2000%2Fsvg' width='760' height='420'%3E%3Ctext x='380' y='230' text-anchor='middle' transform='rotate%28-24 380 230%29' font-family='monospace' font-size='27' letter-spacing='9' fill='%23ffffff' fill-opacity='0.06'%3EPROPERTY OF %E2%96%88%E2%96%88%E2%96%88%E2%96%88%E2%96%88%E2%96%88 INDUSTRIES%3C/text%3E%3C/svg%3E"),
		radial-gradient(120% 100% at 50% -10%, rgba(255, 255, 255, 0.07), transparent 60%),
		repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px),
		repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px)`,"--ha-well":`rgba(8, 26, 42, 0.55)`,"--ha-well-edge":`rgba(220, 232, 242, 0.42)`,"--ha-panel":`rgba(8, 26, 42, 0.42)`,"--ha-panel-edge":`#dce8f2`,"--ha-panel-texture":`none`,"--ha-panel-shadow":`none`,"--ha-panel-radius":`0`,"--ha-panel-ornament":`none`,"--ha-ink":`#eaf2f8`,"--ha-ink-dim":`#9dbdd6`,"--ha-ink-faint":`#6f9fc4`,"--ha-ink-on-accent":`#10222f`,"--ha-rule":`rgba(220, 232, 242, 0.45)`,"--ha-accent":`#ff6b4a`,"--ha-accent-wash":`rgba(255, 107, 74, 0.18)`,"--ha-control-bg":`transparent`,"--ha-control-ink":`#eaf3f9`,"--ha-control-edge":`1px solid #9dc2dc`,"--ha-control-radius":`0`,"--ha-control-clip":`polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)`,"--ha-control-rotate":`0deg`,"--ha-control-shadow":`none`,"--ha-control-shadow-hover":`none`,"--ha-control-ink-shadow":`none`,"--ha-control-bg-active":`#ff6b4a`,"--ha-control-ink-active":`#17110d`,"--ha-control-bg-off":`transparent`,"--ha-control-ink-off":`#5d7f97`,"--ha-control-edge-off":`1px solid #3e5f76`,"--ha-face":`'Avenir Next Condensed', 'Roboto Condensed', 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif`,"--ha-face-data":`ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace`,"--ha-track":`0.19em`,"--ha-track-label":`0.2em`,"--ha-weight":`500`,"--ha-title-frame":`1px solid rgba(220, 232, 242, 0.6)`,"--ha-title-rule":`2px solid transparent`,"--ha-title-bg":`rgba(8, 26, 42, 0.45)`,"--ha-card-bg-mix":`rgba(8, 26, 42, 0.5)`,"--ha-card-edge":`1px solid #dce8f2`,"--ha-card-shadow":`none`,"--ha-card-rotate":`0deg`,"--ha-team-overlay":`none`,"--ha-team-tab":`none`,"--ha-card-note-ink":`#9dbdd6`,"--ha-card-label-fill":`100%`,"--ha-card-label-tint":`0%`,"--ha-card-label-ink":`#0d2033`,"--ha-card-label-weight":`600`,"--ha-card-label-pad":`2px 8px`,"--ha-card-label-radius":`0`,"--ha-card-label-rule":`1px solid transparent`,"--ha-card-label-shadow":`none`,"--ha-card-fig-friend":`'FIG. 1 — '`,"--ha-card-fig-foe":`'FIG. 2 — '`,"--ha-card-team-fill":`0%`,"--ha-card-team-ink":`#eaf2f8`,"--ha-card-team-edge":`1px solid rgba(220, 232, 242, 0.45)`,"--ha-card-team-side":`1px solid transparent`,"--ha-card-team-radius":`0`,"--ha-card-team-shadow":`none`,"--ha-card-chip-size":`22px`,"--ha-card-chip-radius":`0`,"--ha-card-chip-overlay":`repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.34) 0 2px, transparent 2px 4px)`,"--ha-card-chip-inner":`0 0 0 0 transparent`,"--ha-card-chip-glow":`0%`,"--ha-card-chip-rotate":`0deg`,"--ha-card-swatch-bg":`transparent`,"--ha-card-swatch-edge":`1px solid rgba(220, 232, 242, 0.5)`,"--ha-card-swatch-radius":`0`,"--ha-card-swatch-pad":`6px 7px`,"--ha-card-swatch-shadow":`none`,"--ha-card-swatch-key":`'colour ref'`,"--ha-card-swatch-ref":`block`,"--ha-card-swatch-name":`none`,"--ha-hq-glass":`rgba(10, 27, 43, 0.16)`,"--ha-hq-inner":`inset 0 0 18px rgba(0, 0, 0, 0.3)`,"--ha-band-bg":`rgba(220, 232, 242, 0.92)`,"--ha-band-ink":`#123049`,"--ha-cell-divider":`1px solid rgba(220, 232, 242, 0.6)`,"--ha-cell-bg":`rgba(8, 26, 42, 0.35)`,"--ha-hq-label-bg":`rgba(220, 232, 242, 0.92)`,"--ha-hq-label-ink":`#123049`,"--ha-hq-label-edge":`1px solid rgba(220, 232, 242, 0.92)`,"--ha-hq-label-radius":`0`,"--ha-hq-label-clip":`none`,"--ha-hq-label-shadow":`none`,"--ha-claim-bg":`transparent`,"--ha-claim-ink":`#85aecc`,"--ha-claim-frame":`none`,"--ha-claim-rotate":`0deg`,"--ha-claim-align":`left`,"--ha-claim-key":`'SIGNED OFF '`,"--ha-claim-empty":`'UNASSIGNED'`,"--ha-claim-rule":`1px dashed rgba(220, 232, 242, 0.35)`,"--ha-claim-holder-ink":`#ff6b4a`,"--ha-claim-holder-rule":`1px solid transparent`,"--ha-mark-display":`block`,"--ha-mark-ink":`#9dc2dc`,"--ha-mark-rule":`rgba(157, 194, 220, 0.75)`,"--ha-control-radius-primary":`0`,"--ha-mark-initials":`none`,"--ha-stamp-edge":`1px solid #ff6b4a`,"--ha-stamp-ink":`#ff6b4a`,"--ha-stamp-rotate":`0deg`,"--ha-tally-bg":`repeating-linear-gradient(45deg, transparent 0 3px, rgba(255, 107, 74, 0.22) 3px 4px)`,"--ha-tally-edge":`1px solid rgba(220, 232, 242, 0.4)`,"--ha-strip-mark":`'SECTION A–A'`,"--ha-strip-mark-display":`inline-flex`,"--ha-field-bg":`rgba(8, 26, 42, 0.55)`,"--ha-field-ink":`#eaf2f8`,"--ha-field-edge":`1px solid rgba(220, 232, 242, 0.5)`},sn={"--ha-ground":`#24282d`,"--ha-ground-wash":`linear-gradient(rgba(255, 255, 255, 0.05), transparent 45%),
		repeating-linear-gradient(92deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 3px)`,"--ha-well":`#14171a`,"--ha-well-edge":`#0c0e10`,"--ha-panel":`linear-gradient(#2b3035, #22262a)`,"--ha-panel-edge":`#14171a`,"--ha-panel-texture":`repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.09) 0 1px, transparent 1px 3px)`,"--ha-panel-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.1),
		inset 0 -8px 16px rgba(0, 0, 0, 0.4)`,"--ha-panel-radius":`2px`,"--ha-panel-ornament":`radial-gradient(circle 3px at 8px 8px, #c49a45 60%, #7d5e20 100%, transparent 100%),
		radial-gradient(circle 3px at calc(100% - 8px) 8px, #c49a45 60%, #7d5e20 100%, transparent 100%)`,"--ha-ink":`#e5e7ea`,"--ha-ink-dim":`#949ba2`,"--ha-ink-faint":`#7d848b`,"--ha-ink-on-accent":`#2a2210`,"--ha-rule":`rgba(255, 255, 255, 0.12)`,"--ha-accent":`#c49a45`,"--ha-accent-wash":`rgba(196, 154, 69, 0.18)`,"--ha-control-bg":`linear-gradient(#d9b464, #a8842f)`,"--ha-control-ink":`#2a2210`,"--ha-control-edge":`1px solid #7d5e20`,"--ha-control-radius":`2px`,"--ha-control-clip":`none`,"--ha-control-rotate":`0deg`,"--ha-control-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.45),
		0 2px 0 #6d5019,
		0 3px 5px rgba(0, 0, 0, 0.45)`,"--ha-control-shadow-hover":`inset 0 1px 0 rgba(255, 255, 255, 0.5),
		0 2px 0 #6d5019,
		0 5px 9px rgba(0, 0, 0, 0.5)`,"--ha-control-ink-shadow":`none`,"--ha-control-bg-active":`linear-gradient(#e05a4c, #b32e26)`,"--ha-control-ink-active":`#2a0f0c`,"--ha-control-bg-off":`linear-gradient(#4a5057, #3a4046)`,"--ha-control-ink-off":`#7d848b`,"--ha-control-edge-off":`1px solid #262b30`,"--ha-face":`'Helvetica Neue', Helvetica, Arial, sans-serif`,"--ha-face-data":`ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace`,"--ha-track":`0.17em`,"--ha-track-label":`0.19em`,"--ha-weight":`500`,"--ha-title-frame":`1px solid #171b1f`,"--ha-title-rule":`2px solid transparent`,"--ha-title-bg":`linear-gradient(#3b4148, #2c3137)`,"--ha-card-bg-mix":`rgba(20, 23, 26, 0.55)`,"--ha-card-edge":`1px solid #14171a`,"--ha-card-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 3px 8px rgba(0, 0, 0, 0.45)`,"--ha-card-rotate":`0deg`,"--ha-team-overlay":`linear-gradient(rgba(255, 255, 255, 0.22), transparent 60%)`,"--ha-team-tab":`none`,"--ha-card-note-ink":`#8b9199`,"--ha-card-label-fill":`100%`,"--ha-card-label-tint":`0%`,"--ha-card-label-ink":`#14171a`,"--ha-card-label-weight":`500`,"--ha-card-label-pad":`3px 9px 2px`,"--ha-card-label-radius":`2px`,"--ha-card-label-rule":`1px solid transparent`,"--ha-card-label-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)`,"--ha-card-fig-friend":`''`,"--ha-card-fig-foe":`''`,"--ha-card-team-fill":`100%`,"--ha-card-team-edge":`2px solid #a8842f`,"--ha-card-team-side":`2px solid #a8842f`,"--ha-card-team-radius":`2px`,"--ha-card-team-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 1px 3px rgba(0, 0, 0, 0.5)`,"--ha-card-chip-size":`22px`,"--ha-card-chip-radius":`50%`,"--ha-card-chip-overlay":`none`,"--ha-card-chip-inner":`inset 0 -2px 3px rgba(0, 0, 0, 0.5)`,"--ha-card-chip-glow":`55%`,"--ha-card-chip-rotate":`0deg`,"--ha-card-swatch-bg":`linear-gradient(#22262a, #191c1f)`,"--ha-card-swatch-edge":`1px solid #101315`,"--ha-card-swatch-radius":`2px`,"--ha-card-swatch-pad":`6px 8px`,"--ha-card-swatch-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.06)`,"--ha-card-swatch-key":`'anodised'`,"--ha-card-swatch-ref":`none`,"--ha-card-swatch-name":`block`,"--ha-hq-glass":`rgba(12, 15, 18, 0.16)`,"--ha-hq-inner":`inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -8px 16px rgba(0, 0, 0, 0.4)`,"--ha-band-bg":`linear-gradient(#3b4148, #2c3137)`,"--ha-band-ink":`#e9ecef`,"--ha-cell-divider":`1px solid #171b1f`,"--ha-cell-bg":`linear-gradient(#333940, #282d33)`,"--ha-hq-label-bg":`#1a1d21`,"--ha-hq-label-ink":`#e9ecef`,"--ha-hq-label-edge":`1px solid #101315`,"--ha-hq-label-radius":`3px`,"--ha-hq-label-clip":`none`,"--ha-hq-label-shadow":`inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 1px 2px rgba(0, 0, 0, 0.5)`,"--ha-claim-bg":`repeating-linear-gradient(45deg, #c49a45 0 6px, #9d7a33 6px 12px)`,"--ha-claim-ink":`#22150f`,"--ha-claim-frame":`0 1px 3px rgba(0, 0, 0, 0.5)`,"--ha-claim-rotate":`-3deg`,"--ha-claim-align":`center`,"--ha-claim-key":`'CLAIMED · '`,"--ha-claim-empty":`'UNCLAIMED'`,"--ha-claim-rule":`1px solid transparent`,"--ha-claim-holder-rule":`1px solid transparent`,"--ha-mark-display":`none`,"--ha-mark-ink":`transparent`,"--ha-mark-rule":`transparent`,"--ha-control-radius-primary":`2px`,"--ha-mark-initials":`none`,"--ha-stamp-edge":`1px solid #7d5e20`,"--ha-stamp-ink":`#c49a45`,"--ha-stamp-rotate":`0deg`,"--ha-tally-bg":`linear-gradient(#1f2327, #191c1f)`,"--ha-tally-edge":`1px solid #101315`,"--ha-strip-mark":`''`,"--ha-strip-mark-display":`none`,"--ha-field-bg":`linear-gradient(#1f2327, #191c1f)`,"--ha-field-ink":`#e5e7ea`,"--ha-field-edge":`1px solid #101315`},cn={[Qt.DOSSIER]:an,[Qt.BLUEPRINT]:on,[Qt.VAULT]:sn},ln={[Qt.DOSSIER]:{plinth:`#16211c`,plinthEdge:`#3a5145`,well:`#1c2b25`,wellAlpha:1},[Qt.BLUEPRINT]:{plinth:`#0a1b2b`,plinthEdge:`#38648a`,well:`#081a2a`,wellAlpha:.55},[Qt.VAULT]:{plinth:`#111417`,plinthEdge:`#3a3f45`,well:`#14171a`,wellAlpha:1}};function un(e){return Object.entries(e).map(([e,t])=>`\t${e}: ${t};`).join(`
`)}var dn=Zt`
  ${[`:root {\n${un(rn)}\n${un(cn[en])}\n}`,...$t.map(e=>`:root[data-skin='${e}'] {\n${un(cn[e])}\n}`)].join(`

`)}

  html {
    background-color: var(--ha-ground);
    /* The ground's texture belongs on the document, never on .game: the WebGL canvas is a sibling
       of .game and sits UNDER it, so a background anywhere inside the app is a filter over
       everything the renderer drew rather than a backdrop behind it. */
    background-image: var(--ha-ground-wash);
    background-attachment: fixed;
    /* Stops iOS inflating text in landscape, which is one reason labels overran their boxes. */
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--ha-face);
    font-size: 14px;
    letter-spacing: var(--ha-track);
    color: var(--ha-ink);
    margin: 0;
    width: 100%;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    /* This was overflow: hidden, which is why anything that did not fit was simply cut off and
       unreachable — on a phone that was the entire action bar. Content that overruns now
       scrolls. Horizontal stays hidden so one wide element cannot introduce a sideways scroll. */
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* The bare-class button, for the handful of places that are not the Button component. Kept in
     step with components/button.js by sharing its tokens rather than its rules. */
  .btn {
    font-family: var(--ha-face);
    font-size: 17px;
    letter-spacing: var(--ha-track);
    color: var(--ha-control-ink-off);
    background: var(--ha-control-bg-off);
    border: var(--ha-control-edge-off);
    border-radius: var(--ha-control-radius);
    padding: 5px 10px;

    &, &:focus, &:active {
      outline: none;
    }

    &--active {
      color: var(--ha-control-ink);
      background: var(--ha-control-bg);
      border: var(--ha-control-edge);
      text-shadow: var(--ha-control-ink-shadow);
      box-shadow: var(--ha-control-shadow);
      transform: rotate(var(--ha-control-rotate));
      transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;

      &:active {
        transform: rotate(0deg) scale(0.97);
      }

      &:hover {
        transform: rotate(0deg) scale(1.03);
        box-shadow: var(--ha-control-shadow-hover);
      }
    }

    &--small {
      font-size: 13px;
    }
  }

  /* Wide tracking on a small screen is the single biggest reason a label is wider than its box.
     Tightened rather than removed, so the look survives. Thresholds clear of 800x600, which the
     browser specs are pinned to. */
  @media (max-width: 780px), (max-height: 520px) {
    body {
      letter-spacing: 0.08em;
    }

    .btn {
      font-size: 14px;
      letter-spacing: 0.08em;
      padding: 5px 8px;
    }

    .btn--small {
      font-size: 12px;
    }
  }

  /* The skins lean on motion only for the press of a control, but a stamp that rotates and a brass
     switch that sinks are both motion this layer introduced. */
  @media (prefers-reduced-motion: reduce) {
    .btn--active,
    .btn--active:hover,
    .btn--active:active {
      transform: none;
      transition: none;
    }
  }
`,fn={START:`start`,ALIGNMENT:`alignment`,PLAY:`play`,END:`end`},pn={LOBBY:`lobby`,STARTED:`started`},mn=`A`,hn=`C`,gn=`S`,_n=`N`,vn={AGENT:mn,CEO:hn,SPY:gn,SNIPER:_n},yn={SELECTION:`selection`,DESELECTION:`deselection`,PLACEMENT:`placement`,MOVEMENT:`movement`,MOVEMENT2:`movement2`,MOVEMENT3:`movement3`,COLLOCATION:`collocation`},bn={[mn]:5,[gn]:10,[_n]:10,[hn]:20},xn=[`0-${mn}1`,`0-${mn}2`,`0-${mn}3`,`0-${mn}4`,`0-${mn}5`,`0-${hn}`,`0-${gn}`,`0-${_n}`,`1-${mn}1`,`1-${mn}2`,`1-${mn}3`,`1-${mn}4`,`1-${mn}5`,`1-${hn}`,`1-${gn}`,`1-${_n}`,`2-${mn}1`,`2-${mn}2`,`2-${mn}3`,`2-${mn}4`,`2-${mn}5`,`2-${hn}`,`2-${gn}`,`2-${_n}`,`3-${mn}1`,`3-${mn}2`,`3-${mn}3`,`3-${mn}4`,`3-${mn}5`,`3-${hn}`,`3-${gn}`,`3-${_n}`];function Sn(e,t){if(e&&t)return e[0]===t[0]&&e[1]===t[1]}function Cn(e,t){return!!t.find(([t,n]=[])=>Sn(e,[t,n]))}function wn(e){return e.reduce((e,t)=>e.includes(t)?e:[...e,t],[])}var Tn=[[1,1],[1,0],[0,0],[-1,0],[-1,1],[0,1]],En={findIndex(e){return Tn.findIndex(([t,n])=>Sn([t,n],e))},get(e){return Tn[e]},getAll(){return[...Tn]},getPrevious(e){let t=e-1;return t<0&&(t=Tn.length+t),Tn[t]},getFollowing(e){let t=e+1;return t>=Tn.length&&(t-=Tn.length),Tn[t]},getOpposite(e){return En.get(e<3?e+3:e-3)}},Dn=(function(){let e=e=>!(e instanceof Array)&&e instanceof Object?`${Object.values(e)}`:`${e}`,t=(...t)=>t.reduce((t,n)=>`${t}#${e(n)}`,``);return function(e){let n=function(...r){let i=t(...r),a=n.cache;if(a.has(i))return a.get(i);let o=e.apply(this,r);return n.cache=a.set(i,o),o};return n.cache=new Map,n}})(),On=[4,5,6,7,6,5,4],kn=On.map((e,t)=>t),An=[],jn=[null,null];function Mn(e,t){return function([n,r]=[]){let i=r===0?1:-1;e<3?n>0?i=-r:n<0&&(i=+!r):e===3?n!==0&&(i=-r):e>3&&(n>0?i=+!r:n<0&&(i=-r));let a=[e-n,t+i];if(Kn(a))return a}}function Nn(e,t){return function(...n){let r=[e,t];return n.map(e=>r&&=Un(r).getPositionInDirection(e))}}function Pn(){return function(...e){return this.getPositionsInDirections(...e).slice(-1)[0]}}function Fn(e,t){return function([n,r]=[],i=[]){let a=Un(i[i.length-1]||[e,t]).getPositionInDirection([n,r]);return Kn(a)?this.getPositionsInDirection([n,r],[...i,a]):i}}function In(e,t){if(e[0]>t[0])return 1;if(e[0]===t[0])return 0;if(e[0]<t[0])return-1}function Ln(e,t,n){if(n===0)return Bn(e,t);if(e[0]<3)return Rn(e,t,n);if(e[0]===3)return Bn(e,t);if(e[0]>3)return zn(e,t,n)}function Rn(e,t,n){if(n===1)return Bn(e,t);if(n===-1)return Vn(e,t)}function zn(e,t,n){if(n===1)return Vn(e,t);if(n===-1)return Bn(e,t)}function Bn(e,t){return+(e[1]>t[1])}function Vn(e,t){return+(e[1]>=t[1])}var Hn=[];On.forEach(e=>{let t=[];for(let n=0;n<e;n++){let e=An.length;t.push({position:[e,n],getPositionInDirection:Mn(e,n),getPositionsInDirections:Nn(e,n),getPositionAfterDirections:Pn(),getPositionsInDirection:Fn(e,n)}),Hn.push([e,n])}An.push(t)});function Un([e,t]=jn){return Kn([e,t])?An[e][t]:{position:jn,getPositionInDirection:()=>jn,getPositionsInDirections:()=>[jn],getPositionAfterDirections:()=>jn,getPositionsInDirection:()=>[jn]}}function Wn(){return Hn}function Gn(e,t){let n=In(e,t);return[n,Ln(e,t,n)]}function Kn([e,t]=jn){if(e>=0&&e<7&&t>=0&&t<On[e])return!0}function qn(e,t){return e&&e.length?(function e(n,r){return r?Sn(r,t)?[...n,r]:e([...n,r],Un(r).getPositionInDirection(Gn(r,t))):[...n,t]})([e],Un(e).getPositionInDirection(Gn(e,t))):[t]}var Jn={get:Un,getAllAvailablePositions:Wn,getDirection:Gn,inBoard:Kn,getMovementPositions:qn},Yn={0:`black`,1:`red`,2:`white`,3:`yellow`},Xn={0:Yn[0].toUpperCase(),1:Yn[1].toUpperCase(),2:Yn[2].toUpperCase(),3:Yn[3].toUpperCase()};function Zn(){return[{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1}]}function Qn(e,t,{pieces:n,teamControl:r,hasTurnEnded:i}){return i||!K.canClaimControl(t,n)?r:r.map($n(e,t,n))}function $n(e,t,n){return function(r,i){let{player:a,controlling:o}=r;return i==t?{player:e,prevPlayer:a,claimEnabled:!0,controlling:o}:a==e?{player:null,prevPlayer:a,claimEnabled:K.canClaimControl(i,n),controlling:!1}:r}}function er(e,{pieces:t,teamControl:n}){return n.map(tr(e,t))}function tr(e,t){return function(n,r){let{prevPlayer:i,controlling:a}=n;return r==e?{player:i,prevPlayer:null,claimEnabled:K.canClaimControl(e,t),controlling:a}:n}}function nr(e,{teamControl:t,pieces:n}){return t.map((t,r)=>{let i=t.player===e;return!i&&t.prevPlayer!==e?t:{player:i?null:t.player,prevPlayer:t.prevPlayer===e?null:t.prevPlayer,claimEnabled:K.canClaimControl(r,n),controlling:!i&&t.controlling}})}function rr(e,t){return Object.entries(K.getKilledPiecesByTeam(e,t)).reduce((e,[t,n])=>e+bn[t]*n,0)}function ir(e,t){return t.filter(t=>K.getTeam(t.id)===e&&t.position&&!t.killed).reduce((e,t)=>e+bn[K.getType(t.id)],0)}function ar(e,t){return rr(e,t)+ir(e,t)}function or(e,{teamControl:t,pieces:n}){return sr(e,n)?t.map(cr(e)):t}function sr(e,t){return K.isCeo(e)&&!K.getPieceById(e,t).position}function cr(e){let t=K.getTeam(e);return function(e,n){let{player:r}=e;return n==t?{player:r,prevPlayer:null,claimEnabled:!1,controlling:!!r}:e}}function lr(e,{teamControl:t,pieces:n}){let r=e.find(e=>e.turn);return t.map(dr(r.name,r.alignment.friend,n))}function ur(e,{teamControl:t,pieces:n}){let r=e.find(e=>e.turn);return t.map(dr(r.name,r.alignment.foe,n))}function dr(e,t,n){return function(r,i){let{player:a}=r;return i==t?{player:e,prevPlayer:null,claimEnabled:K.canClaimControl(t,n),controlling:!0}:a==e?{player:null,prevPlayer:null,claimEnabled:K.canClaimControl(i,n),controlling:!1}:r}}var fr={initControl:Zn,claimControl:Qn,cancelControl:er,releasePlayer:nr,getPointsForTeam:ar,movePieceForControl:or,revealFriend:lr,revealFoe:ur},pr={name:null,score:0};function mr(e){return e.map((e,t)=>({name:e,turn:t===0,alignment:{friend:void 0,foe:void 0},revealed:{friend:!1,foe:!1},exposed:{friend:null,foe:null},lastAccusation:null,allowedToAccuse:{friend:!0,foe:!0}}))}function hr(e){let t=e.findIndex(e=>e.turn),n=t+1>=e.length?0:t+1;return e.map((e,t)=>({...e,turn:t===n}))}function gr(e,t){let n=e.findIndex(e=>e.name===t);if(n===-1)return e;let r=e.filter(e=>e.name!==t);if(!r.length||!e[n].turn)return r;let i=e[(n+1)%e.length].name;return r.map(e=>({...e,turn:e.name===i}))}function _r(e,t,n,r){return e.map(e=>e.name===t?{...e,alignment:{friend:n===void 0?e.alignment.friend:n,foe:r===void 0?e.alignment.foe:r}}:e)}function vr(e){return e.find(e=>e.turn).name}function yr(e){let t=e.find(e=>e.turn);return!t.revealed.friend||!t.revealed.foe}function br(e){return e.find(e=>e.turn).revealed.friend}function xr(e){return e.find(e=>e.turn).revealed.foe}function Sr(e){let t=vr(e);return e.map(e=>e.name==t?{...e,revealed:{friend:!0,foe:e.revealed.foe}}:e)}function Cr(e){let t=vr(e);return e.map(e=>e.name==t?{...e,revealed:{foe:!0,friend:e.revealed.friend}}:e)}function wr(e,t){return jr.getTurn(e)==t.name}function Tr({accuser:e,accusee:t,alignment:n,team:r},i){let a=i.find(t=>t.name==e),o=i.find(e=>e.name==t);if(!a.allowedToAccuse[n])return i;let s=o.alignment[n]==r;return s&&o.revealed[n]?i:i.map(i=>{if(i.name==e)return{...i,allowedToAccuse:{...i.allowedToAccuse,[n]:s},lastAccusation:{accusee:t,alignment:n,team:r,correct:s}};if(i.name==t){let t=i.exposed||{friend:null,foe:null};return{...i,revealed:{...i.revealed,[n]:s},exposed:{...t,[n]:s?e:t[n]}}}return i})}function Er(e){let{friend:t,foe:n}=e.revealed||{};return 100-50*!!t-50*!!n}function Dr(e,t){let{friend:n,foe:r}=e.alignment,i=fr.getPointsForTeam(n,t),a=fr.getPointsForTeam(r,t);return Er(e)+i-a}function Or(e,t){return e.reduce((e,n)=>{let r=jr.getPoints(n,t);return e.score>r?e:{...n,score:r}},pr)}function kr(e,t){return e.slice().sort((e,n)=>Dr(n,t)-Dr(e,t))}function Ar(e,t){let n=0,r=null;return kr(e,t).map((e,i)=>{let a=Dr(e,t);return a!==r&&(n=i+1,r=a),{name:e.name,place:n}})}var jr={init:mr,nextTurn:hr,removePlayer:gr,setAlignment:_r,getTurn:vr,isRevealActive:yr,isOwnFriendRevealed:br,isOwnFoeRevealed:xr,revealFriend:Sr,revealFoe:Cr,isPlayerTurn:wr,accuse:Tr,getBaseScore:Er,getPoints:Dr,getWinner:Or,sortByPoints:kr,getPlacings:Ar},{AGENT:Mr,CEO:Nr,SPY:Pr,SNIPER:Fr}=vn,{SELECTION:Ir,MOVEMENT:Lr,MOVEMENT2:Rr,MOVEMENT3:zr,DESELECTION:Br,COLLOCATION:Vr,PLACEMENT:Hr}=yn;function Ur(e){return{id:e,position:void 0,direction:void 0,selectedDirection:void 0,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:void 0,teamKilledBy:void 0}}function Wr(){return xn.map(e=>Ur(e))}function Gr(e,t){let{hasTurnEnded:n,pieces:r,piecesPrevState:i}=e;return n?r:Ma(t)&&Ha(t,r).highlight?Yi(r,i,t):Kr(t,La(r),e)?r.map(e=>e.id===t?Yr(e):e):r}function Kr(e,t,{players:n,snipe:r,pieceState:i,pieces:a,teamControl:o,piecesPrevState:s}){return r||Jr(e,o,s,n,a)?!1:!t||!qr(e,a,i)&&t.id===e}function qr(e,t,n){if(!Aa(e))return!1;let r=Ha(e,t);return r.selected?n===Lr||r.buffed&&n===Rr:!1}function Jr(e,t,n,r,i){if(Jn.inBoard(Ha(e,i).position))return!1;let a=za(e);return t.map(({player:e,prevPlayer:t,controlling:n},r)=>({controlling:n,teamIndex:r,prevPlayer:t,player:e})).filter(({controlling:e,player:t,prevPlayer:n})=>e&&jr.getTurn(r)!=(n||t)).map(({teamIndex:e})=>String(e)).includes(a)}function Yr(e){return e.selected?{...e,selected:!1,showMoveCells:!1,direction:e.selectedDirection}:{...e,selected:!0,showMoveCells:!0}}function Xr(e,{pieces:t,pieceState:n,followMouse:r}){let i=La(t);if(qr(e,t,n)||i&&i.id!==e)return n;if(r)return Vr;let a=Ha(e,t);return a.selected?Br:Ma(a.id)&&a.position?Lr:Ir}function Zr(e){return Jn.getAllAvailablePositions().filter(t=>!Ta(t,e)).filter(t=>!Ki(t,e))}function Qr(e,t,n,r){let i=$r(e,t,n,r);return i=zi(i,t),i}function $r(e,t,n,r){return e.map(i=>i.id===t?ei(e,i,n,r,t):ni(i))}function ei(e,t,n,r){let i=ti(t,n,qi(t,n,e),r);return i?{...i,moved:!0}:t}function ti(e,t,n,r){switch(Ba(e.id)){case Mr:return ri(e,t,n);case Nr:return ii(e,t,n);case Pr:return ai(e,t,n,r);case Fr:return ci(e,t,n);default:return}}function ni(e){return e.moved?{...e,moved:!1}:e}function ri(e,t,n){let r=e.position?e.selectedDirection:[1,0],i=Oa(e)?e.direction:void 0;return{...e,position:t,direction:i,selectedDirection:r,showMoveCells:!1,throughSniperLineOf:n}}function ii(e,t,n){let r=e.position?Jn.getDirection(e.position,t):void 0,i=e.position?r:[1,0];return{...e,position:t,direction:r,selectedDirection:i,showMoveCells:!1,throughSniperLineOf:n}}function ai(e,t,n,r){let i=e.position?Jn.getDirection(e.position,t):void 0,a=e.position?i:[1,0];return{...e,position:t,direction:i,selectedDirection:a,showMoveCells:oi(e,r),selected:!si(e,r),throughSniperLineOf:n}}function oi(e,t){return!!(e.position&&t===Ir||e.buffed&&t===Lr)}function si(e,t){return Aa(e.id)&&!!e.position&&!oi(e,t)}function ci(e,t,n){let r=e.position?Jn.getDirection(e.position,t):void 0,i=e.position?r:[1,0];return{...e,position:t,direction:r,selectedDirection:i,showMoveCells:!1,throughSniperLineOf:n}}function li(e,{pieces:t,pieceState:n}){let r=Ha(e,t);if(!r.direction)return Hr;switch(Ba(r.id)){case Pr:return ui(r,n);default:return Lr}}function ui(e,t){return e.buffed?t===Lr?Rr:t===Rr?zr:Lr:t===Lr?Rr:Lr}function di(e,t,n){switch(Ba(e.id)){case Mr:return fi(e,t,n);case Nr:return pi(e);case Pr:return mi(e);case Fr:return hi();default:return[]}}function fi(e,t,n){return e.direction?n===Ir?[]:gi(e.direction):En.getAll()}function pi(e){return e.direction?[e.direction]:En.getAll()}function mi(e){return e.direction?[e.direction]:En.getAll()}function hi(){return En.getAll()}function gi(e){let t=En.findIndex(e);return[En.getPrevious(t),En.get(t),En.getFollowing(t)]}function _i(e,t){return{...e,selectedDirection:t}}function vi(e,t){let n=La(e);return e.map(e=>e.id===n.id?_i(e,t):e)}function yi(e,t){return e.reduce((n,r)=>r.showMoveCells?n.concat(bi(r,e,t)):n,[])}function bi(e,t,n){switch(Ba(e.id)){case Mr:return xi(e,t);case Nr:return Si(e,t);case Pr:return Ci(e,t,n);case Fr:return wi(e,t);default:return[]}}function xi(e,t){if(!e.position)return Zr(t);let n=Jn.get(e.position).getPositionInDirection(e.direction),r=Jn.get(e.position).getPositionAfterDirections(e.direction,e.direction);return e.buffed?Mi(e,t,n,r):Ni(e,t,n,r)}function Si(e,t){return e.position?En.getAll().reduce((n,r)=>n.concat(Li(Jn.get(e.position).getPositionsInDirection(r),t)),[]):Zr(t)}function Ci(e,t,n){return e.position?Pi(e.position).filter(e=>Jn.inBoard(e)).filter(r=>!Ti(e.buffed,n)||!ya(r,t)).filter(n=>!va(Fi(n,t),n,e)).filter(n=>!Ta(n,t)||Ea(n,t,e.position)):Zr(t)}function wi(e,t){return e.position?[]:Zr(t).filter(n=>$i(n,e,t))}function Ti(e,t){return t===Ir||e&&t===Lr}function Ei(e,t){let n=e.find(e=>e.showMoveCells&&Aa(e.id)&&e.position);return n?Di(n,e,t):[]}function Di(e,t,n){let r=[],i=[e.position],a=[e.position];for(let o of ki(e,n))a=Ai(a.reduce((n,r)=>n.concat(Oi(e,r,t,o)),[])),r.push(a.filter(e=>!Cn(e,i))),i.push(...a);return r.slice(1)}function Oi(e,t,n,r){let i=n.map(n=>n.id===e.id?{...n,position:t}:n);return Ci(Ha(e.id,i),i,r)}function ki(e,t){let n=e.buffed?zr:Rr,r=[],i=t;for(;i!==n;)r.push(i),i=ui(e,i);return r}function Ai(e){return e.reduce((e,t)=>Cn(t,e)?e:e.concat([t]),[])}function ji(e,t,n){let r=Fi(e,n);return!r||!ba(r,t)?[e]:[]}function Mi(e,t,n,r){let i=Fi(n,t)?ji(n,e,t):[n,...ji(r,e,t)];return i.some(e=>!e)?Zr(t):i}function Ni(e,t,n,r){return ga(e,t,n,r)?[]:r?[r]:Zr(t)}function Pi(e){return En.getAll().map(t=>Jn.get(e).getPositionInDirection(t))}function Fi(e,t){return t.find(t=>Sn(t.position,e))}function Ii(e){return gi(En.getOpposite(En.findIndex(e.direction))).map(t=>Jn.get(e.position).getPositionInDirection(t))}function Li(e,t){return e.length&&!ya(e[0],t)?[e[0]].concat(Li(e.slice(1),t)):[]}function Ri(e,t){return e.length?ya(e[0],t)?[e[0]]:[e[0]].concat(Ri(e.slice(1),t)):[]}function zi(e,t){let n=Ha(t,e);return!n||!Jn.inBoard(n.position)?e:Bi(e.map(e=>Sa(e,n)?Vi(e,t):e))}function Bi(e){return e.filter(e=>ja(e.id)&&e.teamKilledBy).reduce(Hi,e)}function Vi(e,t){let n={...e,killed:!0,position:jn,killedById:t};return ja(e.id)&&(n.teamKilledBy=t),n}function Hi(e,t){let n=t.teamKilledBy;return e.map(e=>e.id===t.id?{...e,teamKilledBy:void 0}:ba(e,t)&&!e.position?Vi(e,n):e)}function Ui(e,t){let n=Ba(t.id);return{...e,[n]:e[n]+1}}function Wi(e,t){return t.filter(t=>t.killedById&&za(t.killedById)===e).reduce(Ui,{A:0,S:0,N:0,C:0})}function Gi(e){return e.filter(e=>Ma(e.id))}function Ki(e,t){return Gi(t).filter(e=>!ba(e,La(t))).reduce((n,r)=>n||Cn(e,Zi(r,t)),!1)}function qi(e,t,n){if(e.position){let r=Xi(n,e),i=Jn.getMovementPositions(e.position,t);return Object.entries(r).reduce((e,[t,n])=>[...e,...i.reduce((e,r)=>Cn(r,n)?[...e,t]:e,[])],[])}return[]}function Ji(e){return e.map(e=>({...e,throughSniperLineOf:[]}))}function Yi(e,t,n){return Bi(e.map(e=>e.throughSniperLineOf.length?Vi(e,n):e.highlight?{...e,highlight:!1}:Ha(e.id,t)))}function Xi(e,t){return e.filter(e=>Ma(e.id)&&!ba(t,e)&&e.position).reduce((t,n)=>({...t,[n.id]:Zi(n,e)}),{})}function Zi(e,t){let n=Jn.get(e.position).getPositionsInDirection(e.direction);return e.buffed?n:Ri(n,t)}function Qi(e,t,n,r){return Jn.get(e).getPositionsInDirection(t).reduce((e,t)=>{let i=Fi(t,r);return e&&(!i||ba(i,n))},!0)}function $i(e,t,n){return En.getAll().reduce((r,i)=>r||Qi(e,i,t,n),!1)}function ea(e,t){if(!Ma(e.id))return e;let n=t.includes(e.id);return e.highlight===n?e:{...e,highlight:n}}function ta(e){let t=wn(e.filter(e=>ia(e)).reduce((e,t)=>[...e,...t.throughSniperLineOf],[]));return e.map(e=>ea(e,t))}function na(e){return e.map(e=>ea(e,[]))}function ra(e){return!!e.find(e=>Ba(e.id)===Fr&&Jn.inBoard(e.position))}function ia(e){return!!e.throughSniperLineOf.length}function aa(e){return e.some(ia)}function oa(e,t){return!Jn.inBoard(Ua(t,e).position)}function sa(e,{pieces:t,hasTurnEnded:n}){return n||!oa(e,t)?t:t.map(ca(e))}function ca(e){return function(t){return!ja(t.id)||za(t.id)!=e?t:Yr(t)}}function la(e,{pieces:t,teamControl:n,pieceState:r}){return n[e].player||!oa(e,t)?r:Ir}function ua(e,{pieces:t,teamControl:n}){return t.map(da(e,n))}function da(e,t){return function(n){return!ja(n.id)||za(n.id)!=e?n:t[e].player?Yr(n):n}}function fa(){return Br}function pa(e,t,n){return{...e,buffed:wa(e,n)}}function ma(e,t){return!e||!t?!e&&!t:!!Sn(e,t)}function ha(e,t){return e.some(e=>{let n=Ha(e.id,t);return!n||!e.killed!=!n.killed||!ma(e.position,n.position)||!ma(e.direction,n.direction)})}function ga(e,t,n,r){return t.filter(t=>_a(t,n)||va(t,r,e)).length!==0}function _a(e,t){return Sn(e.position,t)}function va(e,t,n){return e&&Sn(e.position,t)&&ba(e,n)}function ya(e,t){return Cn(e,t.reduce((e,{position:t})=>t?e.concat([t]):e,[]))}function ba(e,t){return za(e.id)===za(t.id)}function xa(e,t){return e.id!==t.id}function Sa(e,t){if(xa(e,t)&&Jn.inBoard(e.position)&&Jn.inBoard(t.position))return Sn(e.position,t.position)}function Ca(e,t,n){let r=Fi(t,n);if(r){let t=za(e.id),n=za(r.id);return ja(r.id)&&t==n}return!1}function wa(e,t){return Pi(e.position).reduce((n,r)=>n||Ca(e,r,t),!1)}function Ta(e,t){return!!Fi(e,t)}function Ea(e,t,n){return!!(Ta(e,t)&&t.find(e=>Da(e,n)))}function Da(e,t){return Cn(t,Ii(e))}function Oa({position:e,direction:t}){return Jn.inBoard(Jn.get(e).getPositionAfterDirections(t,t))}function ka(e){return Ba(e)===Mr}function Aa(e){return Ba(e)===Pr}function ja(e){return Ba(e)===Nr}function Ma(e){return Ba(e)===Fr}function Na(e){return e.filter(e=>ja(e.id)&&e.killed).length}function Pa(e){return Na(e)>=3}function Fa(e,t,n,r){let i=La(n);if(!i)return!1;let a=yi(n,r),o=Fi(t,n);return e||!Cn(t,a)?!o||o.id!==i.id:!1}function Ia(e,t,n,r){if(!La(n))return!1;let i=yi(n,r);return!e&&Cn(t,i)}function La(e){return e.find(e=>e.selected)}function Ra(e,t){return t.filter(t=>za(t.id)===e)}function za(e){return e.charAt(0)}function Ba(e){return e.charAt(2)}function Va(e){return e.charAt(3)||``}function Ha(e,t){return t.find(t=>t.id===e)}function Ua(e,t){return e.find(e=>ja(e.id)&&za(e.id)==t)}function Wa(e,t){return t.filter(t=>za(t.id)===e&&t.position&&!t.killed).reduce(Ui,{A:0,S:0,N:0,C:0})}var K={init:Wr,toggle:Gr,togglePieceState:Xr,move:Qr,movedPieceState:li,isSettledByMove:si,getPossibleDirections:di,changeSelectedPieceDirection:vi,getSelectedPiece:La,getHighlightedPositions:yi,getPreviewPositions:Ei,getPieceAtPosition:Fi,removeIsThroughSniperLine:Ji,killSnipedPiece:Yi,highlightSnipersWithSight:ta,isInSniperSight:ia,isAnyPieceThroughSniperLine:aa,clearSniperSights:na,canClaimControl:oa,claimControl:sa,claimControlPieceState:la,cancelControl:ua,cancelControlPieceState:fa,getKilledPiecesByTeam:Wi,setCeoBuffs:pa,isAgent:ka,isSpy:Aa,isCeo:ja,isSniper:Ma,isSniperOnBoard:ra,hasBoardChanged:ha,getKilledCeoCount:Na,hasGameFinished:Pa,isTogglePieceOnCellClick:Fa,isMovePieceOnCellClick:Ia,getTeam:za,getType:Ba,getNumber:Va,getPieceById:Ha,getSurvivorsForTeam:Wa,getAllTeamPieces:Ra,getCeo:Ua},Ga=`START_GAME`;function Ka(e){return{type:Ga,payload:e}}var qa=`SET_ALIGNMENT`;function Ja({name:e,friend:t,foe:n}){return{type:qa,payload:{name:e,friend:t,foe:n}}}var Ya=`NEXT_TURN`;function Xa(){return{type:Ya}}var Za=`REMOVE_PLAYER`,Qa=`TOGGLE_PIECE`;function $a(e){return{type:Qa,payload:{pieceId:e}}}var eo=`MOVE_PIECE`;function to(e,t){return{type:eo,payload:{pieceId:e,coords:t}}}var no=`DIRECT_PIECE`;function ro(e){return{type:no,payload:e}}var io=`SNIPE`;function ao(){return{type:io}}var oo=`CLAIM_CONTROL`;function so(e,t){return{payload:{playerName:e,team:t},type:oo}}var co=`CANCEL_CONTROL`;function lo(e){return{payload:{team:e},type:co}}var uo=`REVEAL_FRIEND`;function fo(){return{type:uo}}var po=`REVEAL_FOE`;function mo(){return{type:po}}var ho=`ACCUSE`;function go({accuser:e,accusee:t,alignment:n,team:r}){return{payload:{accuser:e,accusee:t,alignment:n,team:r},type:ho}}var _o=`SYNC_STATE`;function vo(e){return{payload:e,type:_o}}function yo({players:e},t){switch(t.type){case Ga:return jr.init(t.payload);case Ya:return jr.nextTurn(e);case Za:return jr.removePlayer(e,t.payload.name);case qa:{let{name:n,friend:r,foe:i}=t.payload;return jr.setAlignment(e,n,r,i)}case uo:return jr.revealFriend(e);case po:return jr.revealFoe(e);case ho:return jr.accuse(t.payload,e);default:return e}}var{AGENT:bo,CEO:xo,SPY:So,SNIPER:Co}=vn,{MOVEMENT:wo,PLACEMENT:To}=yn;function Eo(e,t,n){let r=K.getSelectedPiece(e);if(r&&r.id===n)switch(K.getType(r.id)){case bo:return t===To||t===wo;case xo:return t===To||t===wo;case So:return t===To;case Co:return t===To||t===wo;default:return!1}return!1}function Do(e,t){return K.hasBoardChanged(K.toggle(e,t),e.piecesPrevState)}function Oo(e,t){return e.hasTurnEnded?!0:Eo(e.pieces,e.pieceState,t)&&Do(e,t)}function ko(e,{pieceId:t,coords:n}){return K.isSettledByMove(K.getPieceById(t,e.pieces),e.pieceState)?K.hasBoardChanged(K.move(e.pieces,t,n,e.pieceState),e.piecesPrevState):!1}function Ao(e,t){return e&&K.isSniper(t)}function jo(e,t){return Oo(e,t)||Ao(e.snipe,t)}function Mo(e){return e.snipe?!K.getSelectedPiece(e.pieces)&&K.hasBoardChanged(e.pieces,e.piecesPrevState):!K.isAnyPieceThroughSniperLine(e.pieces)&&e.hasTurnEnded}function No(e,t){switch(t.type){case Ya:return!1;case Ga:return!1;case Qa:return jo(e,t.payload.pieceId);case eo:return ko(e,t.payload);case io:return Mo(e);default:return e.hasTurnEnded}}function Po(e,t){return K.toggle(e,t)}function Fo({pieces:e,pieceState:t},{pieceId:n,coords:r}){return K.move(e,n,r,t)}function Io(e,t){return K.changeSelectedPieceDirection(e,t)}function Lo(e){return K.removeIsThroughSniperLine(e).map(K.setCeoBuffs)}function Ro({pieces:e,snipe:t}){return t?K.clearSniperSights(e):K.highlightSnipersWithSight(e)}function zo(e,t){let{team:n}=e;return K.claimControl(n,t)}function Bo(e,t){let{team:n}=e;return K.cancelControl(n,t)}function Vo(e,t){switch(t.type){case Qa:return[...Po(e,t.payload.pieceId)];case eo:return[...Fo(e,t.payload)];case no:return[...Io(e.pieces,t.payload)];case Ya:return[...Lo(e.pieces)];case io:return[...Ro(e)];case oo:return[...zo(t.payload,e)];case co:return[...Bo(t.payload,e)];default:return e.pieces}}function Ho(e,t){let n;if(e.hasTurnEnded)n=e.pieceState;else switch(t.type){case Qa:n=K.togglePieceState(t.payload.pieceId,e);break;case eo:n=K.movedPieceState(t.payload.pieceId,e);break;case oo:n=K.claimControlPieceState(t.payload.team,e);break;case co:n=K.cancelControlPieceState();break;default:n=e.pieceState}return n}var{AGENT:Uo,CEO:Wo,SPY:Go,SNIPER:Ko}=vn,{COLLOCATION:qo}=yn;function Jo({pieces:e,followMouse:t,pieceState:n}){let r=K.getSelectedPiece(e);switch(K.getType(r.id)){case Uo:return!0;case Wo:return n===qo;case Go:return!1;case Ko:return!0;default:return t}}function Yo(e,t){switch(t.type){case eo:return Jo(e);case no:return!0;default:return!1}}function Xo(e){return e.some(e=>K.isInSniperSight(e))}function Zo(e,t){switch(t.type){case io:return!e.snipe&&Xo(e.pieces);case Ya:return!1;default:return e.snipe}}function Qo(e,t){switch(t.type){case Ya:return[...e.pieces];default:return e.piecesPrevState}}function $o(e,t){switch(t.type){case oo:return fr.claimControl(t.payload.playerName,t.payload.team,e);case Za:return fr.releasePlayer(t.payload.name,e);case co:return fr.cancelControl(t.payload.team,e);case eo:return fr.movePieceForControl(t.payload.pieceId,e);case uo:return fr.revealFriend(e.players,e);case po:return fr.revealFoe(e.players,e);default:return e.teamControl}}var es={players:yo,hasTurnEnded:No,pieces:Vo,pieceState:Ho,followMouse:Yo,snipe:Zo,piecesPrevState:Qo,teamControl:$o};function ts(e,t){return Object.entries(es).reduce((n,[r,i])=>({...n,[r]:i(e,t)}),{})}function ns(){return{players:[],hasTurnEnded:!1,pieces:K.init(),pieceState:void 0,followMouse:!1,snipe:!1,piecesPrevState:K.init(),teamControl:fr.initControl()}}function rs({debug:e=!1}={}){return function(t,n){let r=n.type===`SYNC_STATE`?n.payload:ts(t,n);return e&&console.log(n,`=>`,r),r}}rs();function is({initialState:e,debug:t=!1}={}){let n=rs({debug:t}),r=e||ns(),i=new Set;return{getState(){return r},subscribe(e){return i.add(e),()=>i.delete(e)},dispatch(e){let t=n(r,e);t!==r&&(r=t,i.forEach(e=>e()))}}}var as=`ha:name`,os=16;function ss(){try{let e=window.localStorage.getItem(as);return typeof e==`string`&&e.trim()?e.trim().slice(0,os):null}catch{return null}}function cs(e){if(!(typeof e!=`string`||!e.trim()))try{window.localStorage.setItem(as,e.trim().slice(0,os))}catch{}}var ls=/^[a-zA-Z0-9-]{8,64}$/;function us(e){return typeof e==`string`&&ls.test(e)}var ds={mu:25,sigma:25/3};1.5*ds.sigma,ds.sigma/100;var fs=`ha:player`;function ps(){let e=window.crypto;return e?.randomUUID?e.randomUUID():e?.getRandomValues?[...e.getRandomValues(new Uint8Array(16))].map(e=>e.toString(16).padStart(2,`0`)).join(``):`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function ms(){try{let e=window.localStorage.getItem(fs);if(us(e))return e;let t=ps();return window.localStorage.setItem(fs,t),t}catch{return null}}var hs=4e3,gs=500,_s=8e3,vs=25e3,ys=50,bs=new Set([Qa,eo,no,io,oo,co,Ya]),xs=`ha:room:`,Ss=`ha:seats`,Cs=8,ws=108e5;function Ts(e){try{return window.localStorage.getItem(xs+e)}catch{return null}}function Es(e,t){try{window.localStorage.setItem(xs+e,t)}catch{}}function Ds(e=Date.now()){try{let t=JSON.parse(window.localStorage.getItem(Ss)||`[]`);return Array.isArray(t)?t.filter(t=>t&&typeof t.code==`string`&&e-(t.at||0)<ws&&Ts(t.code)):[]}catch{return[]}}function Os(e){try{window.localStorage.setItem(Ss,JSON.stringify(e.slice(0,Cs)))}catch{}}function ks(e){let t=Date.now();Os([{...Ds(t).find(t=>t.code===e.code)||{},...e,at:t},...Ds(t).filter(t=>t.code!==e.code)])}function As(e){try{window.localStorage.removeItem(xs+e)}catch{}Os(Ds().filter(t=>t.code!==e))}function js(){return`${window.location.protocol===`https:`?`wss:`:`ws:`}//${window.location.host}/ws`}function Ms(e){let t=e,n=new Set;return{get:()=>t,set(e){t=e,n.forEach(e=>e())},update(e){this.set({...t,...e})},subscribe(e){return n.add(e),()=>n.delete(e)}}}function Ns({code:e=null,error:t=null,rated:n=null}={}){return{mode:`online`,status:e?`connecting`:`ready`,code:e,seatId:null,name:null,phase:null,seats:[],hostSeatId:null,error:t,roomName:null,roomPrivate:!1,rooms:[],roomsTotal:0,queue:null,rated:n,errorSeconds:null,resumable:Ds(),playerName:ss(),skin:en,synced:!1,turnstileRequired:!1}}function Ps({url:e=js(),roomCode:t=null}={}){let n=rs(),r=Ms(ns()),i=Ms(Ns({code:t})),a=r.get(),o=-1,s=0,c=t?Ts(t):null,l=null,u=null,d=null,f=null,p=null,m=gs,h=null,g=null,_=null,v=null,y=[],b=!1;function x(e){return p&&p.readyState===WebSocket.OPEN?(p.send(JSON.stringify(e)),!0):!1}function S(){_&&=(clearTimeout(_),null),v&&=(s+=1,y.push({seq:s,action:v}),x({type:`action`,seq:s,action:v}),null)}function C(){if(!l)return!1;let e=ms();return l.kind===`create`?x({type:`create`,name:l.name,room:l.room,private:l.private,playerId:e,turnstileToken:l.turnstileToken}):l.kind===`join`?x({type:`join`,code:l.code,name:l.name,playerId:e,turnstileToken:l.turnstileToken}):l.kind===`rejoin`&&x({type:`rejoin`,code:l.code,token:l.token,playerId:e})}function w({error:e=null}={}){let{code:t,rated:u}=i.get();As(t),l=null,c=null,o=-1,s=0,y=[],v=null,a=ns(),window.history.replaceState(null,``,`${window.location.pathname}${window.location.search}`),i.set(Ns({error:e,rated:u})),r.set(n(r.get(),vo(ns())))}function T(e){let t=y.reduce((e,t)=>n(e,t.action),e);return v&&(t=n(t,v)),t}function E(e){let t;try{t=JSON.parse(e)}catch{return}switch(t.type){case`seat`:c=t.token,Es(t.code,t.token),ks({code:t.code,name:t.name}),cs(t.name),window.history.replaceState(null,``,`#/r/${t.code}`),l={kind:`rejoin`,code:t.code,token:t.token},u=null,i.update({code:t.code,seatId:t.seatId,name:t.name,playerName:t.name,error:null,rooms:[],resumable:Ds()});break;case`rooms`:i.update({rooms:t.rooms||[],roomsTotal:t.total||0});break;case`config`:i.update({turnstileRequired:!!t.turnstileRequired});break;case`queued`:d=t.searching?d:null,i.update({queue:t.searching?{waiting:t.waiting,elapsed:t.elapsed,window:t.window,rating:t.rating}:null});break;case`rated`:i.update({rated:{code:t.code,players:t.players||[]}});break;case`left`:w({error:t.reason===`left_alone`?`left_alone`:null});break;case`room`:ks({code:t.code,room:t.name}),i.update({status:`ready`,phase:t.phase,seats:t.seats,hostSeatId:t.hostSeatId,roomName:t.name||t.code,roomPrivate:!!t.private,resumable:Ds(),skin:tn(t.skin)?t.skin:en});break;case`snapshot`:if(t.v<o)break;o=t.v,a=t.state,y=y.filter(e=>e.seq>(t.ack||0)),r.set(n(r.get(),vo(T(t.state)))),i.update({phase:t.phase,synced:!0});break;case`rejected`:{let e=y.findIndex(e=>e.seq===t.seq);y=e===-1?y:y.slice(0,e),r.set(T(a)),i.update({error:t.reason});break}case`error`:if(t.reason===`seat_lost`&&l?.kind===`rejoin`){let{code:e,name:t,retried:n}=l;if(As(e),i.update({resumable:Ds()}),t&&!n){l={kind:`join`,code:e,name:t,retried:!0},C();break}}i.update({error:t.reason,errorSeconds:Number.isFinite(t.seconds)?t.seconds:null,...i.get().status===`connecting`?{status:`ready`}:{}})}}function D(){b||h||(i.update({status:`reconnecting`}),h=setTimeout(()=>{h=null,O()},m),m=Math.min(_s,m*2))}function O(){p&&(p.readyState===WebSocket.CONNECTING||p.readyState===WebSocket.OPEN)||(p=new WebSocket(e),p.addEventListener(`open`,()=>{m=gs,C(),u!==null&&x({type:`list`,query:u}),d!==null&&x({type:`queue`,name:d,playerId:ms(),turnstileToken:f}),g=setInterval(()=>x({type:`ping`}),vs)}),p.addEventListener(`message`,e=>E(e.data)),p.addEventListener(`close`,e=>{if(clearInterval(g),e.code===hs){i.update({status:`displaced`});return}D()}),p.addEventListener(`error`,()=>{}))}function k(e){if(!(!e||typeof e.type!=`string`)){if(e.type===`DIRECT_PIECE`){r.set(n(r.get(),e)),v=e,_||=setTimeout(S,ys);return}S(),s+=1,bs.has(e.type)&&(r.set(n(r.get(),e)),y.push({seq:s,action:e})),x({type:`action`,seq:s,action:e})}}function A(e,{room:t=null,isPrivate:n=!1,turnstileToken:r=null}={}){l={kind:`create`,name:e,room:t||void 0,private:n,turnstileToken:r},i.update({status:`connecting`,error:null,errorSeconds:null,rated:null}),C()||O()}function j(e,t,n=null){let r=Ts(e);l=r?{kind:`rejoin`,code:e,token:r,name:t}:{kind:`join`,code:e,name:t,turnstileToken:n},i.update({status:`connecting`,error:null,errorSeconds:null,rated:null}),C()||O()}function M(e=``){u=e,x({type:`list`,query:e})||O()}function N(e,t=null){d=e,f=t,i.update({error:null,errorSeconds:null,rated:null}),x({type:`queue`,name:e,playerId:ms(),turnstileToken:t})||O()}function P(){d=null,f=null,i.update({queue:null}),x({type:`unqueue`})}function F(){b=!1,t&&c?(l={kind:`rejoin`,code:t,token:c},O()):t&&(i.update({status:`ready`,phase:null}),O())}return{getState:r.get,subscribe:r.subscribe,dispatch:k,open:F,getSession:i.get,subscribeSession:i.subscribe,createRoom:A,joinRoom:j,listRooms:M,queueUp:N,cancelQueue:P,stopListing:()=>{u=null},start:()=>x({type:`start`}),ready:()=>x({type:`ready`}),leave:()=>{x({type:`leave`}),w()},setSkin:e=>x({type:`skin`,skin:e}),close(){b=!0,clearInterval(g),clearTimeout(h),clearTimeout(_),p?.close()},get version(){return o}}}var Fs={play:{players:[{name:`FEDE`,turn:!0,alignment:{friend:`1`,foe:`0`},revealed:{friend:!1,foe:!1},allowedToAccuse:{friend:!0,foe:!0}},{name:`SARA`,turn:!1,alignment:{friend:`0`,foe:`3`},revealed:{friend:!1,foe:!1},allowedToAccuse:{friend:!0,foe:!0}}],hasTurnEnded:!1,pieces:[{id:`0-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1}],pieceState:`deselection`,followMouse:!1,snipe:!1,piecesPrevState:[{id:`0-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1}],teamControl:[{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1}]},endgame:{players:[{name:`ALICE`,turn:!1,alignment:{friend:`1`,foe:`0`},revealed:{foe:!0,friend:!0},allowedToAccuse:{friend:!0,foe:!0}},{name:`BOB`,turn:!0,alignment:{friend:`0`,foe:`3`},revealed:{friend:!0,foe:!1},allowedToAccuse:{friend:!0,foe:!0}},{name:`ALEX`,turn:!1,alignment:{friend:`1`,foe:`3`},revealed:{foe:!0,friend:!0},allowedToAccuse:{friend:!0,foe:!0}},{name:`AZYR`,turn:!0,alignment:{friend:`2`,foe:`3`},revealed:{friend:!1,foe:!1},allowedToAccuse:{friend:!0,foe:!0}},{name:`AZAZYRA`,turn:!1,alignment:{friend:`1`,foe:`2`},revealed:{foe:!0,friend:!0},allowedToAccuse:{friend:!0,foe:!0}},{name:`AZAROG`,turn:!0,alignment:{friend:`3`,foe:`2`},revealed:{friend:!1,foe:!1},allowedToAccuse:{friend:!0,foe:!0}}],hasTurnEnded:!1,pieces:[{id:`0-A1`,position:[-1,-1],direction:[-1,0],selectedDirection:[-1,0],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`2-A1`,moved:!1},{id:`0-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`0-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`0-A4`,selected:!0,killed:!1,showMoveCells:!0,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!0,position:[1,1],direction:[0,0],selectedDirection:[0,0]},{id:`0-A5`,position:[3,3],direction:[1,0],selectedDirection:[1,0],selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`0-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`0-S`,position:[-1,-1],direction:[1,1],selectedDirection:[1,1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`2-A1`,moved:!1},{id:`0-N`,position:[-1,-1],direction:[1,0],selectedDirection:[1,0],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`2-A1`,moved:!1},{id:`1-A1`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-A2`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-A3`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-A4`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-A5`,position:[3,5],direction:[0,0],selectedDirection:[0,0],selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`1-C`,position:[-1,-1],direction:[0,0],selectedDirection:[0,0],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-S`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`1-N`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A5`,moved:!1},{id:`2-A1`,position:[-1,-1],direction:[0,1],selectedDirection:[0,1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`1-A5`,moved:!1},{id:`2-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1,position:[6,2],direction:[1,0],selectedDirection:[1,0]},{id:`2-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1,position:[6,0],direction:[1,1],selectedDirection:[1,1]},{id:`2-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1,position:[6,1],direction:[0,0],selectedDirection:[0,0]},{id:`2-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1,position:[5,0],direction:[1,1],selectedDirection:[1,1]},{id:`2-C`,position:[1,3],direction:[0,0],selectedDirection:[0,0],selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1},{id:`2-S`,position:[-1,-1],direction:[0,0],selectedDirection:[0,0],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`1-A5`,moved:!1},{id:`2-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,moved:!1,position:[5,1],direction:[0,0],selectedDirection:[0,0]},{id:`3-A1`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-A2`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-A3`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-A4`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-A5`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-C`,position:[-1,-1],direction:[0,0],selectedDirection:[0,0],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-S`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1},{id:`3-N`,position:[-1,-1],selected:!1,killed:!0,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1,killedById:`0-A1`,moved:!1}],pieceState:`deselection`,followMouse:!1,snipe:!1,piecesPrevState:[{id:`0-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`0-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`1-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`2-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A1`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A2`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A3`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A4`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-A5`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-C`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-S`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1},{id:`3-N`,selected:!1,killed:!1,showMoveCells:!1,throughSniperLineOf:[],buffed:!1,highlight:!1}],teamControl:[{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1},{player:null,prevPlayer:null,claimEnabled:!0,controlling:!1}]}};function Is(){return typeof window>`u`?null:new URLSearchParams(window.location.search).get(`test`)}function Ls(){if(typeof window>`u`)return null;let e=new URLSearchParams(window.location.search).get(`skin`);return tn(e)?e:null}function Rs(){return typeof window>`u`?!1:new URLSearchParams(window.location.search).has(`hotseat`)}function zs(){if(typeof window>`u`)return null;let e=/^#\/r\/([A-Za-z0-9]{4})$/.exec(window.location.hash);return e?e[1].toUpperCase():null}function Bs(e){return e===`play`?fn.PLAY:e===`endgame`?fn.END:fn.START}function Vs(e,{rng:t=Math.random}={}){let n=Ls(),r={mode:`local`,status:`local`,phase:Bs(e),code:null,seatId:null,name:null,seats:[],hostSeatId:null,error:null,roomName:null,roomPrivate:!1,rooms:[],roomsTotal:0,queue:null,rated:null,errorSeconds:null,resumable:[],playerName:ss(),skin:n||en,synced:!0},i=!!n||!!e,a=new Set;return{get:()=>r,subscribe(e){return a.add(e),()=>a.delete(e)},advance(e){e===fn.ALIGNMENT&&!i?(i=!0,r={...r,phase:e,skin:nn(t)}):r={...r,phase:e},a.forEach(e=>e())},setSkin(e){r.phase!==fn.ALIGNMENT||!tn(e)||(i=!0,r={...r,skin:e},a.forEach(e=>e()))}}}function Hs({mode:e=`local`}={}){let t=Is();if(e===`online`){let n=Ps({roomCode:zs()});return{mode:e,test:t,store:n,open:n.open,session:{get:n.getSession,subscribe:n.subscribeSession},actions:{createRoom:n.createRoom,joinRoom:n.joinRoom,listRooms:n.listRooms,stopListing:n.stopListing,queueUp:n.queueUp,cancelQueue:n.cancelQueue,start:n.start,ready:n.ready,leave:n.leave,setSkin:n.setSkin,advance:()=>{}},close:n.close}}let n=t?Fs[t]:null,r=Vs(t);return{mode:e,test:t,store:is({initialState:n?{...n,test:!0}:void 0,debug:!1}),open:()=>{},session:{get:r.get,subscribe:r.subscribe},actions:{createRoom:()=>{},joinRoom:()=>{},listRooms:()=>{},stopListing:()=>{},queueUp:()=>{},cancelQueue:()=>{},start:()=>{},ready:()=>{},leave:()=>{},setSkin:r.setSkin,advance:r.advance},close:()=>{}}}function Us(e,t){return`${e}(${t.displayName||t.name||`Component`})`}var Ws=o((e=>{var t=u(),n=Symbol.for(`react.element`),r=Symbol.for(`react.fragment`),i=Object.prototype.hasOwnProperty,a=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,r){var s,c={},l=null,u=null;for(s in r!==void 0&&(l=``+r),t.key!==void 0&&(l=``+t.key),t.ref!==void 0&&(u=t.ref),t)i.call(t,s)&&!o.hasOwnProperty(s)&&(c[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps,t)c[s]===void 0&&(c[s]=t[s]);return{$$typeof:n,type:e,key:l,ref:u,props:c,_owner:a.current}}e.Fragment=r,e.jsx=s,e.jsxs=s})),q=o(((e,t)=>{t.exports=Ws()}))(),Gs=(0,v.createContext)(null),Ks=(0,v.createContext)(null),qs=(0,v.createContext)(null);function Js(){return zs()?`online`:Rs()||Is()?`local`:`online`}function Ys(e){if(typeof window>`u`||!window.history)return;let t=new URL(window.location.href);e===`local`?t.searchParams.set(`hotseat`,``):t.searchParams.delete(`hotseat`);let n=t.search.replace(/hotseat=(?=&|$)/,`hotseat`);window.history.replaceState(null,``,`${t.pathname}${n}${t.hash}`)}function Xs(e){function t(t){let[n,r]=(0,v.useState)(Js),i=(0,v.useMemo)(()=>Hs({mode:n}),[n]);(0,v.useEffect)(()=>(i.open(),i.close),[i]);let a=(0,v.useSyncExternalStore)(i.store.subscribe,i.store.getState),o=(0,v.useSyncExternalStore)(i.session.subscribe,i.session.get),s=(0,v.useCallback)(()=>{Ys(`online`),r(`online`)},[]),c=(0,v.useCallback)(()=>{Ys(`local`),r(`local`)},[]),l=(0,v.useMemo)(()=>[a,i.store.dispatch],[a,i.store.dispatch]),u=(0,v.useMemo)(()=>({...o,actions:{...i.actions,goOnline:s,goHotSeat:c}}),[o,i.actions,s,c]);return(0,q.jsx)(Ks.Provider,{value:i.test,children:(0,q.jsx)(qs.Provider,{value:u,children:(0,q.jsx)(Gs.Provider,{value:l,children:(0,q.jsx)(e,{...t})})})})}return t.displayName=Us(`WithState`,e),t}function Zs(){return(0,v.useContext)(qs)}function Qs(){let e=(0,v.useContext)(qs),[{players:t}]=(0,v.useContext)(Gs);return e.mode===`local`?!0:e.status!==`ready`||!t.length?!1:jr.getTurn(t)===e.name}function $s(){let e=(0,v.useContext)(qs),[{players:t}]=(0,v.useContext)(Gs);return e.mode===`local`?!0:e.status!==`ready`||!t.length?!1:jr.getTurn(t)!==e.name}function ec(){let[{followMouse:e,pieces:t,pieceState:n},r]=(0,v.useContext)(Gs),i=Qs();return(0,v.useCallback)(a=>{if(!i)return;let o=K.getSelectedPiece(t);K.isTogglePieceOnCellClick(e,a,t,n)?r($a(o.id)):K.isMovePieceOnCellClick(e,a,t,n)&&r(to(o.id,a))},[e,t,n,r,i])}var tc=new Map;function nc(e,t,n){tc.set(e,{x:t,y:n})}function rc(e){return tc.get(e)}var ic=null,ac=new Set;function oc(e){return ac.add(e),()=>ac.delete(e)}function sc(e){if(ic!==e){ic=e;for(let e of ac)e(ic)}}var cc=null;function lc(e){cc=e}function uc(){return cc}var dc=6,fc=.85,pc=(0,v.createContext)({startDrag:()=>{},isClickSuppressed:()=>!1});function mc(){return(0,v.useContext)(pc)}function hc(e,t){let n=document.elementFromPoint(e,t),r=n&&n.closest(`[id^="hex-"]`);if(!r)return null;let i=/^hex-(-?\d+)-(-?\d+)$/.exec(r.id);return i?[Number(i[1]),Number(i[2])]:null}function J({ghost:e}){return e?(0,q.jsx)(`img`,{src:e.src,alt:``,"aria-hidden":`true`,style:{position:`fixed`,left:e.x-e.width/2,top:e.y-e.height/2,width:e.width,height:e.height,opacity:fc,pointerEvents:`none`,zIndex:1e3}}):null}function gc({children:e}){let t=ec(),[n,r]=(0,v.useState)(null),i=(0,v.useRef)(t);(0,v.useEffect)(()=>{i.current=t},[t]);let a=(0,v.useRef)(null),o=(0,v.useRef)(!1),s=(0,v.useCallback)((e,{previewSrc:t,pieceId:n,onStart:r})=>{if(typeof e.button==`number`&&e.button!==0)return;let i=e.currentTarget.getBoundingClientRect();a.current={originX:e.clientX,originY:e.clientY,width:i.width,height:i.height,previewSrc:t,pieceId:n,onStart:r,dragging:!1,carried:!1}},[]),c=(0,v.useCallback)(()=>o.current,[]);return(0,v.useEffect)(()=>{function e(e){let t=a.current;if(!t)return;let n=e.clientX-t.originX,i=e.clientY-t.originY;if(!t.dragging){if(Math.sqrt(n*n+i*i)<dc)return;t.dragging=!0,t.onStart();let e=uc();t.carried=!!(e&&t.pieceId&&e.grab(t.pieceId)),t.carried&&sc(t.pieceId)}if(t.carried){uc().carryTo(e.clientX,e.clientY);return}r({src:t.previewSrc,x:e.clientX,y:e.clientY,width:t.width,height:t.height})}function t(e){let t=a.current;if(a.current=null,r(null),t&&t.carried){let e=uc();e&&e.drop(),sc(null)}if(!t||!t.dragging)return;o.current=!0,setTimeout(()=>{o.current=!1},0);let n=hc(e.clientX,e.clientY);n&&i.current(n)}return window.addEventListener(`pointermove`,e),window.addEventListener(`pointerup`,t),window.addEventListener(`pointercancel`,t),()=>{window.removeEventListener(`pointermove`,e),window.removeEventListener(`pointerup`,t),window.removeEventListener(`pointercancel`,t)}},[]),(0,q.jsxs)(pc.Provider,{value:{startDrag:s,isClickSuppressed:c},children:[e,(0,q.jsx)(J,{ghost:n})]})}function _c(){return Zs().skin||en}function vc(e){(0,v.useEffect)(()=>{document.documentElement.dataset.skin=e},[e])}function yc(){let e=Zs();return e.mode===`local`?e.phase===fn.ALIGNMENT:e.status!==`ready`||!e.seatId?!1:(e.phase===fn.START||e.phase===fn.ALIGNMENT)&&e.seatId===e.hostSeatId}function bc(){let{setSkin:e}=Zs().actions;return(0,v.useCallback)(t=>e(t),[e])}var xc=`@media (max-width: 780px)`,Sc=`@media (max-height: 520px)`,Cc=`@media (max-width: 780px), (max-height: 520px)`,wc=G.div`
	/* A drawing labels the section it is a view of. Held as a token rather than in the markup so the
	   two directions that have no sections contribute nothing at all rather than an empty box. */
	&::before {
		content: var(--ha-strip-mark);
		display: var(--ha-strip-mark-display);
		align-items: center;
		padding: 2px 8px 1px;
		font-family: var(--ha-face-data);
		font-size: 9px;
		letter-spacing: var(--ha-track-label);
		color: var(--ha-stamp-ink);
		border: var(--ha-stamp-edge);
	}

	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	flex-wrap: wrap;
	padding: 14px 22px;
	text-align: center;
	color: var(--ha-ink);
	font-weight: bold;
	font-size: 16px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	width: 90vw;
	background: var(--ha-title-bg);
	border: var(--ha-title-frame);
	border-bottom: var(--ha-title-rule);
	border-radius: var(--ha-panel-radius);

	${Cc} {
		padding: 7px 8px;
		font-size: 13px;
		gap: 8px;
		width: 100%;
	}
`,Tc=G.div`
	padding: 14px 20px;
	text-align: center;
	color: var(--ha-ink-dim);
	font-size: 16px;
	letter-spacing: var(--ha-track-label);

	${Cc} {
		padding: 8px 4px;
		font-size: 13px;
	}
`,Ec=G.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2000;
	padding: 6px 10px;
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	color: #1c1c1c;
	background: ${({lost:e})=>e?`#ff9a9a`:`#ffd479`};
`,Dc={connecting:`Connecting…`,reconnecting:`Connection lost — reconnecting…`,displaced:`This seat is open in another window — play there, or reload here to take it back.`};function Oc(){let{mode:e,status:t,seatId:n}=Zs();if(e!==`online`||t===`ready`||!n)return null;let r=Dc[t];return r?(0,q.jsx)(Ec,{id:`connection-banner`,lost:t!==`connecting`,children:r}):null}var kc=({small:e})=>{if(e)return W`
			font-size: 13px;
		`},Ac=W`
	color: var(--ha-control-ink-active);
	background: var(--ha-control-bg-active);
	border-color: transparent;
	border-radius: var(--ha-control-radius-primary);
`,jc=G.button.attrs(({active:e})=>({disabled:!e}))`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 17px;
	letter-spacing: var(--ha-track);
	text-transform: uppercase;
	padding: 5px 10px;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	cursor: ${({active:e})=>e?`pointer`:`not-allowed`};

	${kc}
	${({active:e,$primary:t})=>e?W`
			color: var(--ha-control-ink);
			background: var(--ha-control-bg);
			border: var(--ha-control-edge);
			text-shadow: var(--ha-control-ink-shadow);
			box-shadow: var(--ha-control-shadow);
			/* Dossier stamps sit slightly crooked; the other two are square, and say so with a
			   rotation of zero rather than by not having the rule. */
			transform: rotate(var(--ha-control-rotate));
			transition:
				transform 0.1s ease-out,
				box-shadow 0.1s ease-out,
				background 0.1s ease-out;

			&:hover {
				transform: rotate(0deg) scale(1.03);
				box-shadow: var(--ha-control-shadow-hover);
			}

			/* A stamp presses, a brass switch sinks. Same gesture, and the skin decides how far it
			   reads. */
			&:active {
				transform: rotate(0deg) scale(0.97);
				background: var(--ha-accent-wash);
			}

			@media (prefers-reduced-motion: reduce) {
				&,
				&:hover,
				&:active {
					transform: none;
					transition: none;
				}
			}

			${t&&Ac}
		`:W`
		color: var(--ha-control-ink-off);
		background: var(--ha-control-bg-off);
		border: var(--ha-control-edge-off);
	`}

  &,
  &:focus,
  &:active {
		outline: none;
	}

	/* A control has to be reachable from the keyboard, and the accent is the one colour every skin
	   has that is guaranteed to sit on its own ground. */
	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`,Mc=G.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	align-items: center;
	justify-content: center;
	text-align: center;
`,Nc=G.svg`
	width: 26px;
	height: 26px;
	flex-shrink: 0;

	${Cc} {
		width: 20px;
		height: 20px;
	}
`;function Pc(){return(0,q.jsxs)(Nc,{viewBox:`0 0 120 120`,"aria-hidden":`true`,focusable:`false`,children:[(0,q.jsx)(`polygon`,{points:`60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35`,fill:`none`,stroke:`#a3282b`,strokeWidth:`7`}),(0,q.jsx)(`text`,{x:`60`,y:`76`,textAnchor:`middle`,fontFamily:`'American Typewriter', 'Courier New', Courier, monospace`,fontWeight:`700`,fontSize:`44`,letterSpacing:`-1`,fill:`#a3282b`,children:`HA`})]})}var Fc=`0x4AAAAAAEH6zeWi0hWGU40M`,Ic=`turnstile-spin-v2`,Lc=100;function Rc(e){let t=(0,v.useRef)(null),n=(0,v.useRef)(null),[r,i]=(0,v.useState)(null);return(0,v.useEffect)(()=>{if(!e||!t.current)return;let r=!1,a=null;function o(){r||!window.turnstile||!t.current||(n.current=window.turnstile.render(t.current,{sitekey:Fc,action:Ic,callback:i,"error-callback":()=>i(null),"expired-callback":()=>i(null)}))}return window.turnstile?o():a=setInterval(()=>{window.turnstile&&(clearInterval(a),o())},Lc),()=>{r=!0,a&&clearInterval(a),n.current&&window.turnstile&&(window.turnstile.remove(n.current),n.current=null)}},[e]),{containerRef:t,token:r,reset:(0,v.useCallback)(()=>{i(null),n.current&&window.turnstile&&window.turnstile.reset(n.current)},[])}}var zc=G.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	flex-wrap: wrap;
	padding: 6px 0 2px;
`,Bc=G.span`
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`,Vc=G.div`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	justify-content: center;
`,Hc=G.button`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	padding: 4px 10px;
	cursor: pointer;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	/* A border of the same width whether or not this is the current option, so choosing one does not
	   nudge the other two sideways. Colour carries the state; width never does. */
	border: 1px solid ${({current:e})=>e?`var(--ha-accent)`:`var(--ha-rule)`};
	background: ${({current:e})=>e?`var(--ha-accent)`:`transparent`};
	color: ${({current:e})=>e?`var(--ha-ink-on-accent)`:`var(--ha-ink-dim)`};

	&:hover {
		color: ${({current:e})=>e?`var(--ha-ink-on-accent)`:`var(--ha-ink)`};
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}

	${Cc} {
		font-size: 10px;
		letter-spacing: 0.06em;
		padding: 4px 7px;
	}
`;function Uc(){let e=_c(),t=yc(),n=bc();return t?(0,q.jsxs)(zc,{id:`skin-picker`,children:[(0,q.jsx)(Bc,{children:`Style`}),(0,q.jsx)(Vc,{children:$t.map(t=>(0,q.jsx)(Hc,{id:`skin-option-${t}`,type:`button`,current:t===e,"aria-pressed":t===e,onClick:()=>n(t),children:t},t))})]}):null}function Wc({id:e=`leave-game`,label:t=`LEAVE`,small:n=!0,onClick:r}){let{mode:i,actions:a}=Zs();return i===`online`?(0,q.jsx)(jc,{id:e,small:n,active:!0,onClick:r||a.leave,children:t}):null}var Gc=`secret.hidden.silent.quiet.cunning.ruthless.patient.restless.nameless.faceless.double.crooked.loyal.wary.invisible.sleeping.burning.frozen.broken.gilded.hollow.velvet.brittle.candid.careless.discreet.elusive.forged.guarded.idle.jaded.keen.lonely.masked.nervous.obscure.polite.reckless.sealed.shadowed.sly.sombre.stolen.sunken.tangled.unseen.vacant.veiled.watchful.wounded.absent.bitter.clever.deadly.eager.false.grim.humble.impatient.unlucky`.split(`.`),Kc=`agent.spy.traitor.courier.handler.mole.cipher.dossier.envelope.ledger.whisper.rumour.alias.briefcase.keyhole.lantern.matchbook.notebook.passport.postcard.signal.stamp.telegram.typewriter.umbrella.vault.wireless.safehouse.sniper.chauffeur.diplomat.informant.defector.custodian.gatekeeper.interpreter.janitor.librarian.locksmith.messenger.minister.nightwatch.operator.photographer.quartermaster.receptionist.secretary.sentry.steward.switchboard.telephonist.understudy.waiter.watchman.cartographer.bookkeeper.clockmaker.tailor.translator.stenographer`.split(`.`);function qc(e=Math.random){return`${Gc[Math.floor(e()*Gc.length)%Gc.length]}-${Kc[Math.floor(e()*Kc.length)%Kc.length]}`}function Jc(e){return typeof e==`string`?e.trim().replace(/\s+/g,` `).replace(/-+/g,`-`):``}function Yc(e){let t=Jc(e);return t.length>=3&&t.length<=24&&/^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(t)}var Xc=[`The Basics`,`Playing a Turn`,`The Pieces`,`Combat & Control`,`Cards on the Table`,`Winning`],Zc=[{slug:`cheat-sheet`,title:`Cheat Sheet`,teaser:`Every rule, one screen, no scrolling.`,cheatSheet:[{heading:`The Idea`,points:[`4 teams, 32 pieces. Nobody owns one — you move anyone’s pieces.`,`2 secret cards: a **friend** (you want them to win) and a **foe** (you want them to lose).`]},{heading:`Your Turn`,points:[`Exactly **one** piece action: move a piece, deploy one, or turn a sniper.`,`Also free, any number of times: claim a team, reveal a card, accuse a player.`,`Press **NEXT TURN** when done.`]},{heading:`Making a Move`,points:[`Select it, move it, point it, confirm — in that order.`,`Deploying a piece from its HQ spends your one action too.`,`Only a team’s controller may deploy its pieces from HQ.`]},{heading:`The Pieces`,points:[`**Agent** — 2 cells dead ahead. Kills what’s there.`,`**CEO** — any distance, 6 directions. Never kills. Buffs neighbours.`,`**Spy** — 2 single steps, any directions. Kills only on the last step, from behind.`,`**Sniper** — never moves again. Turning it aims a line of fire.`]},{heading:`CEO Buffs`,intro:`Standing next to your own CEO:`,points:[`**Agent** moves 1 or 2 and kills at 1.`,`**Spy** gets a third step.`,`**Sniper**’s line passes straight through pieces.`]},{heading:`Taking Control`,points:[`Claim a team, then deploy its CEO — control becomes real.`,`Or reveal a card naming that team — instant control, no CEO needed.`,`A team whose CEO is already out can’t be claimed, only revealed.`]},{heading:`Cards on the Table`,points:[`**Reveal**: turn a card face up, −50 points, get that team at once.`,`**Accuse**, guess right: they pay 50 points and you may accuse again.`,`**Accuse**, guess wrong: you lose that guess for the rest of the game.`]},{heading:`How It Ends`,points:[`The game ends the instant the **third CEO** dies.`,`Score: 100, **−50** per your own revealed card, **+**friend’s points, **−**foe’s points.`,`Highest score wins.`]}]},{slug:`big-idea`,group:`The Basics`,title:`The Big Idea`,teaser:`Four teams. Nobody owns one. That is the whole game.`,image:{file:`big-idea.png`,alt:`The board and all four team stores, empty and ready to play`,caption:`Every game starts like this — nobody playing for a team yet`},body:[{p:`Four teams are fighting it out on the board: Black, Red, White, and Yellow. But here is the twist — nobody owns a team. Not even you.`},{p:`On your turn, you can move any piece from any team. Yours, your friend’s, anyone’s. Everybody moves everybody’s pieces.`},{p:`So what do you actually own? Two secret cards. One team is your **friend** — you want them to win. One team is your **foe** — you want them to lose. Nobody else knows which two you are holding.`},{p:`That is the whole game. Everyone is pushing everyone’s pieces around the board, and the real game is working out who wants what — before they work out you.`},{note:`You could be moving your own foe’s pieces right now, and nobody at the table would know why.`}]},{slug:`secret-cards`,group:`The Basics`,title:`Your Secret Cards`,teaser:`One friend, one foe. Never the same team. Never shown to anyone.`,image:{file:`secret-cards.png`,alt:`A Friend card naming Black and a Foe card naming Red, laid out side by side`,caption:`Yours to look at once, then keep face down for the rest of the evening`},body:[{p:`At the start of the game, you are dealt two cards. One says **FRIEND**. One says **FOE**. Each one names a team.`},{p:`Your friend’s points become your points. Your foe’s points come off your score. That is the entire reason to care who wins.`},{p:`Keep both cards secret. Look at them once, then put them face down. Nobody else gets to see them — unless you choose to show one yourself, or somebody guesses right (more on that later).`},{list:[`Two players can share the same friend.`,`Your friend can be someone else’s foe.`,`A team can be nobody’s friend at all — and nobody’s foe either.`]},{p:`Because nobody can see anyone’s cards, every move on the board is a clue. Is that player helping Black because Black is their friend? Or because they want you to think so? You will not know for certain until the cards come out.`}]},{slug:`the-pieces`,group:`The Basics`,title:`What’s on the Table`,teaser:`A hex board, four team stores, and 32 pieces waiting to come out.`,image:{file:`the-pieces.png`,alt:`The full board with all four HQs, each holding a full team of pieces`,caption:`Black, Red, White, Yellow — the same eight pieces each, every game`},body:[{p:`The board is one big hexagon, made up of 37 smaller ones you can actually stand on.`},{p:`Each of the four teams keeps its pieces in its own store beside the board, called an **HQ**. Every team starts with the same eight pieces:`},{list:[`**5 Agents** — the foot soldiers, worth 5 points each`,`**1 CEO** — worth 20 points, the most valuable piece on the team`,`**1 Spy** — worth 10 points, sneaky and hard to pin down`,`**1 Sniper** — worth 10 points, never moves but can strike from a distance`]},{p:`Every piece starts inside its HQ. Nothing is on the board until somebody brings it out.`},{p:`Every piece out on the board also **faces** a direction. That is not just for looks — which way a piece is looking decides where it can go, what it can hit, and what a sniper can see through it.`}]},{slug:`getting-ready`,group:`The Basics`,title:`Getting Ready to Play`,teaser:`Two to six players. A name each. A secret pair of cards. Then you begin.`,image:{file:`getting-ready.png`,alt:`The name-entry screen with two players typed in and a button to deal alignments`,caption:`Names in, then the cards go round the table`},body:[{p:`Gather 2 to 6 players and type in your names. The order you type them in is the order you will take turns.`},{p:`Everybody gets one **friend** card and one **foe** card, dealt in secret. Look at them, remember them, then keep them face down — you will need to check back on them all game.`},{p:`All 32 pieces start in their HQs. The board itself is completely empty.`},{p:`Whoever’s name was typed first goes first. Then play moves around the table, one player at a time.`},{note:`Playing on one screen? The cards get passed round, one player at a time, so nobody else peeks. Playing online? Each player only ever sees their own two cards — the server keeps everyone else’s hidden automatically.`}]},{slug:`your-turn`,group:`Playing a Turn`,title:`Taking Your Turn`,teaser:`One piece action. Then as many free moves as you like. Then pass it on.`,image:{file:`your-turn.png`,alt:`The turn strip and action bar, with a team just claimed and ready to deploy`,caption:`Everything you can do on your turn lives in this one bar`},body:[{p:`Every turn, you do exactly **one piece action** — bring a piece onto the board, move one, or turn a sniper. That part is compulsory. You cannot skip it.`},{p:`Alongside that one action, you can also do any of these, as many times as you like, for free:`},{list:[`**Claim a team**, or change your mind before you have moved its CEO`,`**Reveal** one of your own cards (twice a game at most — once per card)`,`**Accuse** another player, again and again, for as long as you keep guessing right`]},{p:`When you are done, press **NEXT TURN**. Play passes to the next player.`},{note:`You cannot simply pass. If every piece you would like to move is stuck, you have to find one that is not — the button will not light up until something has actually happened.`},{p:`One button on the screen is never yours: **SNIPE!** belongs to everyone *except* the player whose turn it is. It is how the rest of the table answers the move you just made.`}]},{slug:`making-a-move`,group:`Playing a Turn`,title:`Making a Move`,teaser:`Pick it up. Put it down. Point it somewhere. Confirm — from the board or straight out of HQ.`,imagesAtEnd:!0,images:[{file:`move-hq-idle.png`,label:`Idle`,alt:`An agent resting in its HQ, not selected`,caption:`Resting in HQ`},{file:`move-hq-selected.png`,label:`Selected`,alt:`The same agent selected, and the board’s nearest cells lighting up red`,caption:`Selected — and the board answers`},{file:`move-cells-highlighted.png`,label:`Cells`,alt:`Empty cells lit red around an enemy piece that is not lit`,caption:`Every empty cell lights up — an occupied one never does`},{file:`move-placed-default.png`,label:`Placed`,alt:`The agent freshly placed, facing its default direction`,caption:`Landed — facing the only way it can before you point it`},{file:`move-placed-turned.png`,label:`Faced`,alt:`The same agent now facing a different direction after a point click`,caption:`Pointed a different way — this is what confirms it`}],body:[{p:`Every piece moves in the same four beats, whether you click it or drag it, or whether it is stepping fresh out of its HQ:`},{list:[`**Select it** — its legal cells light up`,`**Move it** — click or drop it on a lit cell`,`**Point it** — hover to choose which way it faces`,`**Confirm** — click to lock it in`]},{list:[`You must move before you can turn — a sniper is the one exception, since turning *is* its whole move.`,`Selecting costs nothing. Only confirming a real change spends your turn.`,`Bringing a fresh piece out of its HQ works the same way, and costs your whole turn too — it just needs a landing cell that is **empty** and **safe from enemy snipers**.`]},{note:`Only the player who controls a team may bring its pieces out — see Taking Control of a Team.`},{note:`A spy is the one piece that cannot change its mind once it starts moving — more on that on its own page.`}]},{slug:`the-agent`,group:`The Pieces`,title:`The Agent`,teaser:`Five per team. Moves two cells dead ahead. Kills what it lands on.`,images:[{file:`agent-move.png`,label:`Move`,alt:`An agent selected, with the one cell two ahead of it lit up red`,caption:`Its only legal cell — two ahead, dead straight`},{file:`agent-kill.png`,label:`Kill`,alt:`An agent selected, its highlighted cell now standing on an enemy piece`,caption:`That same cell, with an enemy standing on it — landing there is the kill`}],body:[{p:`The Agent moves exactly **two cells straight ahead**, in whichever direction it is facing.`},{list:[`It is blocked if **anyone** — friend or enemy — is standing one cell ahead.`,`It is blocked if a **friendly** piece is two cells ahead.`,`It **kills** by landing on an **enemy** two cells ahead.`]},{p:`After it moves, it can turn — but only a little: straight ahead, or one step to either side. Never backwards.`},{p:`Walk it off the edge of the board, and it does not fall off — it comes straight back onto any free cell you like, exactly like a fresh deployment.`},{note:`Stand an Agent next to its own CEO and it gets stronger — it can move one cell *or* two, and it can kill at just one cell ahead. See CEO Buffs.`,buff:!0}]},{slug:`the-ceo`,group:`The Pieces`,title:`The CEO`,teaser:`The most valuable piece on the team — and the one that can never kill.`,images:[{file:`ceo-move.png`,label:`Move`,alt:`A CEO selected, with long lines of cells lit up red in every direction`,caption:`Any distance, any of six directions — as far as the board allows`},{file:`ceo-blocked.png`,label:`Blocked`,alt:`A CEO selected, its lit cells stopping short of an enemy piece further down the line`,caption:`It stops right before the enemy — a CEO can never land on, or kill, anyone`}],body:[{p:`The CEO moves **any distance, in a straight line, in any of the six directions** — as far as the board or the first piece in its way allows.`},{p:`It stops right before whoever is blocking it, friend or enemy. That is the trade-off for going so far: the CEO **can never kill**.`},{p:`It does not turn on its own — it always faces whichever way it just moved. Only when you first bring it onto the board can you point it wherever you like.`},{p:`Why the CEO matters so much:`},{list:[`It **buffs** every one of its own team’s pieces standing right next to it.`,`Bringing it onto the board is what turns a claim on a team into real control.`,`If it dies, **every piece of its team still waiting in the HQ dies with it.**`,`The game ends the instant the **third** CEO falls.`]}]},{slug:`the-spy`,group:`The Pieces`,title:`The Spy`,teaser:`Two quick steps, zig-zagging wherever it likes — and a kill from behind.`,images:[{file:`spy-move.png`,label:`Move`,alt:`A spy selected, its neighbouring cells lit red for its first step and the ring beyond them teal for its second`,caption:`Red is this step, teal is the next — the whole zig-zag, laid out`},{file:`spy-kill.png`,label:`Kill`,alt:`A spy selected, with an enemy piece two cells away standing on one of the teal second-step cells, its back turned`,caption:`Two steps off and already marked — and its back is turned, which is the only angle that counts`}],body:[{p:`The Spy takes **two single steps**, one cell at a time, choosing a new direction for each step. That means it can zig-zag anywhere within reach.`},{p:`Its first step has to land on an **empty** cell — a Spy cannot kill on the way, only right at the end.`},{p:`You do not have to work the zig-zag out in your head: while a Spy still has steps left, the board marks where the **later** ones could get to, each in a colour of its own — **teal** for the second step, **gold** for the third if it is buffed. Only the red cells are the ones you can click right now.`},{p:`On its last step, it can kill — but only by walking up on an enemy **from behind**: straight behind them, or from one of the two rear corners. Walk up to their face or their side, and it is simply not an option.`},{p:`Once a Spy has taken its first step, there is no putting it back — you must finish both steps before your turn can end.`},{p:`There is no aiming a Spy at the end: it ends up **facing the way it walked**, so its last step settles it where it lands and your turn is over. Coming out of its HQ is the one exception — it arrives with no heading of its own, so you point it as usual.`},{note:`Standing next to its own CEO, a Spy gets a third step instead of two.`,buff:!0}]},{slug:`the-sniper`,group:`The Pieces`,title:`The Sniper`,teaser:`It never moves again once it’s placed. It doesn’t need to.`,imagesAtEnd:!0,images:[{file:`sniper-place.png`,label:`Place`,alt:`The whole board, every legal deployment cell for a fresh sniper lit up red`,caption:`Every cell it could be placed on — each with a shot open from it`},{file:`sniper-line.png`,label:`Line`,alt:`A sniper in one corner of the board; a different team’s piece selected, its own legal cells lit everywhere except the diagonal the sniper is watching`,caption:`A different team’s own legal cells go dark in a line — that line is the shot`},{file:`sniper-blocked.png`,label:`Blocked`,alt:`The same board, but a piece part-way down the line has taken the cells behind it back off the dark stripe`,caption:`The first piece it hits ends the line — everything behind it lights back up`},{file:`sniper-kill.png`,label:`Kill`,alt:`A lit sniper, having marked an enemy piece that crossed its line of fire`,caption:`Lit and marked — SNIPE! is the only way it ever kills`}],body:[{p:`Once a Sniper is on the board, it never moves again. From then on, its whole "turn" is simply choosing a new direction to face.`},{p:`Facing a direction gives it a **line of fire**: every cell in a straight line that way, stopping at — and including — the first piece it hits.`},{p:`It can only be placed somewhere with **at least one** direction that has no enemy in the way — there always has to be a shot available from wherever it stands.`},{p:`A Sniper does not kill by walking into anyone. It kills by **watching** — see Snipers in Action for how that actually plays out.`},{note:`Stand a Sniper next to its own CEO, and its line of fire passes straight through pieces, all the way to the edge of the board.`,buff:!0}]},{slug:`quick-reference`,group:`The Pieces`,title:`Quick Reference`,teaser:`All four pieces, side by side, for whenever you forget.`,table:{headers:[``,`Move`,`Kills`,`Buffed`],rows:[[`Agent`,`exactly 2 ahead`,`enemy 2 ahead`,`1 *or* 2 ahead; kills at 1`],[`CEO`,`any distance, 6 directions`,`never`,`buffs others, gains nothing itself`],[`Spy`,`1 cell, twice, any directions`,`enemy on the last step, from behind`,`1 cell, three times`],[`Sniper`,`never — it only turns`,`via SNIPE!`,`sees straight through pieces`]]},body:[{p:`Every deployment cell, for every piece, also has to sit outside every enemy sniper’s line of fire.`}]},{slug:`killing`,group:`Combat & Control`,title:`Killing`,teaser:`Land on them, and they’re gone — to the cemetery.`,image:{file:`killing-hq.png`,alt:`The HQ card of the team that just made a kill, its cemetery tally reading one agent`,caption:`The tally at the foot of the card — the credit for a kill lands on the killer’s HQ`},body:[{p:`If a piece ends its move standing where somebody else already is, that piece **dies**. It is that simple — the game never lets you land somewhere that would kill a friend, so every landing you are ever offered is a kill of an enemy.`},{p:`A dead piece goes to the cemetery of whichever team killed it — which is also what earns that team the points for the kill.`},{p:`Killing a **CEO** is bigger than an ordinary kill: every piece of that team still waiting in its HQ dies too. Anything of theirs already out on the board is untouched, and anybody can still move it.`},{note:`A sniper’s kill counts exactly the same way — credited to the sniper’s own team, just like walking into someone.`}]},{slug:`ceo-buffs`,group:`Combat & Control`,title:`CEO Buffs`,teaser:`Stand next to your own CEO, and you get stronger.`,imagesAtEnd:!0,images:[{file:`buff-agent.png`,label:`Agent`,alt:`A glowing, buffed agent with both one and two cells ahead lit up red`,caption:`Buffed, both reachable cells light up — one or two ahead`},{file:`buff-spy.png`,label:`Spy`,alt:`A glowing, buffed spy beside its CEO, the board marked in three rings out from it — red, then teal, then gold`,caption:`Three steps, three colours — the gold ring is reach two never had`},{file:`buff-sniper.png`,label:`Sniper`,alt:`The board with a buffed sniper’s dark line running straight through a blocking piece`,caption:`Buffed, the line runs straight through the blocker instead of stopping at it`}],body:[{p:`Any piece standing right beside its **own team’s** CEO gets a boost, recalculated fresh at the start of every turn:`},{list:[`**Agent** — moves 1 *or* 2 cells ahead, and can kill at just 1 cell`,`**Spy** — gets a third step instead of two`,`**Sniper** — its line of fire now passes straight through pieces, all the way to the edge`,`**CEO** — nothing. A CEO does not buff itself.`]},{p:`Timing matters here: buffs are only worked out once, right when a new turn starts. Walk a piece next to a CEO mid-turn, and it is not buffed until the *next* turn begins.`}]},{slug:`snipers-in-action`,group:`Combat & Control`,title:`Snipers in Action`,teaser:`The one move that isn’t yours — it belongs to the rest of the table.`,images:[{file:`snipe-before.png`,label:`Before`,alt:`A piece sitting clear of a sniper’s line of fire`,caption:`Clear of the line — for now`},{file:`snipe-crossed.png`,label:`Crossed`,alt:`The same piece, having just moved through the sniper’s line of fire`,caption:`Moved through it — marked, though nothing shows it yet`},{file:`snipe-armed.png`,label:`Snipe!`,alt:`The sniper lit up, having marked the piece that crossed its line`,caption:`SNIPE! pressed — the mark lights the sniper up`},{file:`snipe-after.png`,label:`After`,alt:`The board after the sniper fired, the marked piece gone`,caption:`Fired — the piece is gone and the turn has passed on`}],body:[{p:`Whenever a piece moves **into, out of, or through** an enemy sniper’s line of fire, that sniper marks it. The whole path is checked, not just where it lands — cross the line and keep going, and you are still marked.`},{p:`Here is the twist: the shot does not belong to whoever’s turn it is. **SNIPE! belongs to everyone else.** It is how the rest of the table answers the move that was just made.`},{p:`Press SNIPE!, and every sniper with a marked target lights up. Click a lit sniper, and three things happen at once:`},{list:[`**Every piece it marked dies.**`,`**The rest of the board rolls back** to how it stood at the start of the turn — the move is undone, along with everything it did.`,`**The turn ends** and passes on as normal.`]},{p:`You only get one window to fire: the same turn the movement happened in. Once NEXT TURN is pressed, the mark is gone for good.`},{note:`Pressing SNIPE! freezes the board — nothing else can be clicked until the shot is taken. There is no arming it and changing your mind.`}]},{slug:`taking-control`,group:`Combat & Control`,title:`Taking Control of a Team`,teaser:`Only the person who controls a team may bring its pieces onto the board.`,imagesAtEnd:!0,imageGroups:[[{file:`control-claim-click.png`,label:`Claim`,alt:`An unclaimed team’s HQ, with its CLAIM button`,caption:`Press CLAIM`},{file:`control-place-ceo.png`,label:`Place CEO`,alt:`That team’s CEO landing on the board`,caption:`Bring its CEO onto the board`},{file:`control-alice.png`,label:`Control: Alice`,alt:`The HQ card now reading CONTROL: ALICE`,caption:`The team is really hers`}],[{file:`control-reveal-click.png`,label:`Reveal`,alt:`A Friend card turned face up, naming Yellow`,caption:`Turning one of your own cards face up`},{file:`control-bob.png`,label:`Control: Bob`,alt:`That team’s HQ card now reading CONTROL: BOB`,caption:`His at once — no CEO required`}]],body:[{p:`You can hold control of **one team at a time**. Taking a second team lets go of the first.`},{p:`There are two ways to take control:`},{list:[`**Claim it, then deploy its CEO.** Press that team’s CLAIM button, then bring its CEO onto the board. The moment it lands, the team is really yours.`,`**Reveal a card naming it.** Turning one of your own cards face up hands you that team immediately — CEO on the board or not.`]},{p:`Only the controller may bring new pieces out of that team’s HQ. Anything of theirs already on the board is public property — anyone whose turn it is can move it.`},{note:`A team whose CEO is already on the board cannot be claimed this way any more — the only way to take it from here is to reveal a card that names it.`}]},{slug:`revealing`,group:`Cards on the Table`,title:`Revealing`,teaser:`Turn a card face up. It costs you 50 points — and hands you a team.`,image:{file:`revealing.png`,alt:`A Friend card turned face up, naming Black, beside a Foe card still blank`,caption:`One card up, one still secret`},body:[{p:`On your turn, press REVEAL and turn your Friend or Foe card face up. Once it is up, it stays up for the rest of the game.`},{p:`It costs you **50 points** off your final score. Turn both cards over, and that is 100 points gone.`},{p:`In exchange, you get that team **immediately** — no CEO required.`},{p:`Revealing does not use up your turn. You can still make your piece move, and you can even reveal both cards in the same turn if you want to.`}]},{slug:`accusing`,group:`Cards on the Table`,title:`Accusing`,teaser:`Guess someone’s secret. Get it right, and they pay for it instead of you.`,image:{file:`accusing.png`,alt:`A correct accusation verdict, naming the accused player’s foe team`,caption:`A guess that landed — and someone else’s 50 points`},body:[{p:`On your turn, press ACCUSE, pick another player, choose Friend or Foe, and name a team.`},{p:`**Guess right**, and their card is turned face up — they pay the same 50 points a voluntary reveal costs. Best of all, it costs *you* nothing, and you can accuse again.`},{p:`**Guess wrong**, and you can never accuse that slot again for the rest of the game. Get somebody’s friend wrong, and you have lost the right to guess anyone’s friend, ever again — your foe accusations are untouched.`},{p:`Accusing does not spend your turn either. Keep guessing right, and you can keep going.`},{note:`An accusation that lands correctly does not hand you control of that team — only a voluntary reveal does that.`}]},{slug:`how-it-ends`,group:`Winning`,title:`How It Ends`,teaser:`The third CEO falls, and every card comes out.`,image:{file:`how-it-ends.png`,alt:`The final score sheet, with every player’s total and every team’s tally shown`,caption:`Every card face up, every point on the table`},body:[{p:`The game ends the instant the **third CEO** dies. One team is left standing with its CEO still alive.`},{p:`Every alignment card is turned face up — friend and foe alike — because working out who won needs to see all of them.`},{p:`Here is how your score is worked out:`},{list:[`Start at **100**.`,`**Lose 50** for each of your own cards that ended up face up — whether you revealed it yourself or someone guessed it right.`,`**Add** your friend team’s points.`,`**Subtract** your foe team’s points.`]},{p:`A team’s own points come from the value of everyone it killed, plus the value of its own pieces still standing on the board. Anything still waiting in the HQ counts for nothing — sitting it out is not the same as surviving.`},{p:`**Whoever has the highest score wins.**`},{note:`Build your friend up, tear your foe down, and try to stay unread — the 50 points you pay to seize a team is exactly the price of everyone at the table knowing what you are after.`}]},{slug:`playing-online`,group:`Winning`,title:`Playing Online`,teaser:`Same rules. Real people, wherever they are.`,image:{file:`playing-online.png`,alt:`The online lobby’s "Join a game" screen, with a public room listed`,caption:`A room, a code, and a seat waiting for you`},body:[{p:`Everything on these pages works exactly the same whether you are playing online or on one shared screen. What playing online adds is simple:`},{list:[`**Rooms** hold up to 6 seats, opened with a short code you can share.`,`**Your cards are yours alone.** The people you are playing with never even receive them — the server only ever sends you your own two.`,`**Only whoever’s turn it is may act** — except for SNIPE!, which belongs to everyone else, exactly as it does on one screen.`,`**A closed laptop cannot hold up the game.** If somebody vanishes for a minute, anyone can press NEXT TURN for them.`]},{p:`Open "Start a game" to host your own table, or "Join a game" to find one already waiting for you.`}]}];function Qc(e){return Zc.find(t=>t.slug===e)||null}var $c=G.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	padding: 0 28px;

	${xc} {
		gap: 6px;
		padding: 0 12px;
	}
`,el=G.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	width: 100%;
`,tl=G(Tc)`
	min-width: 0;
	padding-top: 0;
	padding-bottom: 0;
`,nl=G.span`
	flex: 0 0 ${`34px`};

	> button {
		width: 100%;
		padding-left: 0;
		padding-right: 0;
	}
`,rl=G.p`
	max-width: 520px;
	text-align: center;
	color: var(--ha-ink-dim);
	font-size: 15px;
	line-height: 1.5;
	margin: 0;
`,il=G.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	width: 100%;
	max-width: 420px;
	padding: 10px 16px;
	background: var(--ha-accent-wash);
	border: 1px solid var(--ha-accent);
	border-radius: var(--ha-panel-radius);
	cursor: pointer;
	text-align: center;

	&:hover {
		filter: brightness(1.05);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`,al=G.span`
	font-weight: bold;
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-accent);
`,ol=G.span`
	font-size: 12px;
	color: var(--ha-ink-dim);
`,sl=G.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px 20px;
	width: 100%;
	max-width: 1100px;

	${xc} {
		grid-template-columns: 1fr;
	}
`,cl=G.div`
	position: relative;
	break-inside: avoid;
	padding-top: 11px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		border-top: 1px dashed var(--ha-accent);
		opacity: 0.55;
	}

	&::after {
		content: '✦';
		position: absolute;
		top: -7px;
		left: 50%;
		width: 18px;
		margin-left: -9px;
		background: var(--ha-ground);
		font-size: 10px;
		line-height: 1;
		text-align: center;
		color: var(--ha-accent);
	}
`,ll=G.div`
	font-weight: bold;
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
	border-bottom: 1px solid var(--ha-rule);
	padding-bottom: 3px;
	margin-bottom: 4px;
`,ul=G.p`
	margin: 0 0 3px;
	font-size: 12px;
	line-height: 1.35;
	color: var(--ha-ink);
`,dl=G.ul`
	margin: 0;
	padding-left: 1.1em;
	font-size: 12px;
	line-height: 1.35;
	color: var(--ha-ink);

	li + li {
		margin-top: 3px;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`,fl=G.div`
	width: 100%;
	padding-top: 10px;
	margin-top: 4px;
	border-top: 1px solid var(--ha-rule);
	font-weight: bold;
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);
	text-align: center;
`,pl=G.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
	width: 100%;
`,ml=G.button`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 4px;
	flex: 1 1 220px;
	max-width: 250px;
	text-align: left;
	padding: 10px 12px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	box-shadow: var(--ha-panel-shadow);
	cursor: pointer;
	min-width: 0;

	&:hover {
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}

	/* A phone fits one card a row whatever the numbers say, and there the cap only insets it from
	   the panel it is the only thing in — so it is lifted rather than leaving a card narrower than
	   the cheat-sheet button above it for no reason a reader could see. */
	${xc} {
		flex-basis: 100%;
		max-width: none;
	}
`,hl=G.span`
	font-weight: bold;
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
`,gl=G.span`
	font-size: 12px;
	color: var(--ha-ink-dim);
	line-height: 1.4;
`,_l=G.div`
	width: 100%;
	overflow: hidden;
`,vl=G.div`
	color: var(--ha-ink);
	font-size: 15px;
	line-height: 1.55;

	> * {
		margin: 0 0 10px;
	}

	> *:last-child {
		margin-bottom: 0;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`,yl=G.ul`
	margin: 0;
	padding-left: 1.1em;

	li + li {
		margin-top: 6px;
	}
`,bl=G.div`
	position: relative;
	/* A block's own background spans its full declared width regardless of a float beside it —
	   only its *inline* content (text) actually narrows to avoid one. \`clear: both\` fixed the
	   overlap that fell out of that (the coloured band painting straight across the exhibit) but
	   overcorrected: it forced the note below the float even when there was room beside it, so it
	   stopped reading as part of the same page. \`display: flow-root\` is the same "establish a
	   new block formatting context" fix — a BFC box shrinks to fit the space beside a float
	   rather than ignoring the float's width outright, so the note sits alongside the exhibit
	   exactly the way a paragraph's *text* does — but unlike \`overflow: hidden\`, a BFC from
	   \`flow-root\` is not also a clipping box, so it does not cut off the CEO Buff badge, which
	   deliberately pokes above the note's own top edge.
	   Stacked explicitly above the exhibit rather than left to \`z-index: auto\`: a positioned
	   box like this one paints after a float by default regardless of DOM order, so without this
	   the badge's overhang could still end up drawn on top of an exhibit it happens to sit near. */
	z-index: 0;
	display: flow-root;
	padding: 8px 12px;
	background: var(--ha-accent-wash);
	border-left: 2px solid var(--ha-accent);
	font-size: 13px;
	font-style: italic;
	color: var(--ha-ink);
`,xl=G.span`
	position: absolute;
	top: -10px;
	left: 14px;
	padding: 2px 9px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-accent);
	border-radius: 3px;
	box-shadow: var(--ha-panel-shadow);
	font-size: 10px;
	font-weight: bold;
	font-style: normal;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
	transform: rotate(-4deg);
`,Sl=G.table`
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;

	th,
	td {
		padding: 7px 8px;
		border: 1px solid var(--ha-rule);
		text-align: left;
	}

	th {
		background: var(--ha-panel);
		letter-spacing: var(--ha-track-label);
		text-transform: uppercase;
		font-size: 11px;
		color: var(--ha-ink-dim);
	}

	td:first-child {
		font-weight: bold;
		white-space: nowrap;
	}

	strong {
		color: var(--ha-accent);
	}

	em {
		font-style: italic;
		color: var(--ha-ink-dim);
	}
`,Cl=G.figure`
	position: relative;
	/* Above a note's own z-index: 0 on purpose — a photograph is the page's primary content, and
	   if the two ever end up close enough to touch (a badge's overhang, a narrow viewport), the
	   exhibit should be the thing left intact rather than whatever happened to paint last. */
	z-index: 1;
	float: ${({$reverse:e})=>e?`right`:`left`};
	width: 380px;
	max-width: 100%;
	margin: ${({$reverse:e})=>e?`4px 0 14px 22px`:`4px 22px 14px 0`};
	/* No reserved strip at the foot for the caption. This was a flat 68px with the tag absolutely
	   positioned into it — a fixed height for text that wraps, so a caption needing a fourth line
	   simply grew upwards over the photograph, which two pages did on a phone. The tag flows now
	   and the mat sizes to whatever it is actually carrying. */
	padding: 10px;
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	box-shadow:
		var(--ha-panel-shadow),
		3px 5px 12px rgba(20, 15, 5, 0.35);
	transform: rotate(${({$reverse:e})=>e?`1.1deg`:`-1.1deg`});

	${xc} {
		float: none;
		width: 100%;
		margin: 4px 0 14px;
		transform: rotate(${({$reverse:e})=>e?`0.6deg`:`-0.6deg`});
	}
`,wl=G.span`
	position: absolute;
	top: -7px;
	${({$side:e})=>e===`left`?`left: 14px;`:`right: 14px;`}
	width: 34px;
	height: 16px;
	background: rgba(241, 224, 213, 0.82);
	border: 1px solid rgba(90, 70, 36, 0.35);
	box-shadow: 1px 1px 2px rgba(20, 15, 5, 0.25);
	transform: rotate(${({$side:e})=>e===`left`?`-6deg`:`6deg`});
`,Tl=G.img`
	display: block;
	width: 100%;
	height: auto;
	border: 1px solid rgba(44, 38, 32, 0.4);
	cursor: zoom-in;
`,El=G.div`
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px;
	background: rgba(10, 8, 4, 0.86);
	cursor: zoom-out;
`,Dl=G.img`
	display: block;
	max-width: min(92vw, 1100px);
	max-height: 86vh;
	width: auto;
	height: auto;
	border: 1px solid rgba(0, 0, 0, 0.4);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
	cursor: default;
`,Ol=G.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 18px;
	z-index: 101;
	text-align: center;
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: rgba(240, 230, 210, 0.75);
	pointer-events: none;
`,kl=G(Cl)`
	width: ${({$count:e,$full:t})=>t?`auto`:e===3?`660px`:e>=4?`560px`:`460px`};

	${({$full:e})=>e&&W`
			float: none;
			/* \`auto\` rather than a fixed 100% — a lone full-width exhibit still fills its block
			   container the way any block-level \`<figure>\` does with no width set, but this is
			   also what lets several of them share a row: inside \`ExhibitGroupRow\`'s flex context,
			   \`flex: 1\` divides the space evenly instead of every one of them claiming 100% and
			   wrapping onto its own line. */
			flex: 1 1 0;
			min-width: 0;
			margin: 16px 0 4px;
			transform: none;
		`}
`,Al=G.div`
	display: flex;
	align-items: flex-start;
	gap: 16px;
	width: 100%;

	${xc} {
		flex-direction: column;
	}
`,jl=G.div`
	display: grid;
	grid-template-columns: repeat(${({$count:e,$full:t})=>t?e:e>=4?2:e}, 1fr);
	gap: 8px;
`,Ml=G.div`
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4px;
`,Nl=G.span`
	font-size: 10px;
	font-weight: bold;
	text-align: center;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-dim);
`,Pl=G.figcaption`
	display: flex;
	flex-direction: column;
	gap: 1px;
	margin-top: 10px;
`,Fl=G.span`
	font-size: 10px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
`,Il=G.span`
	font-size: 11px;
	color: var(--ha-ink-dim);
	line-height: 1.3;
`;function Ll(e){let t=/\*\*(.+?)\*\*|\*(.+?)\*/g,n=[],r=0,i;for(;i=t.exec(e);)i.index>r&&n.push((0,q.jsx)(v.Fragment,{children:e.slice(r,i.index)},n.length)),n.push(i[1]===void 0?(0,q.jsx)(`em`,{children:i[2]},n.length):(0,q.jsx)(`strong`,{children:i[1]},n.length)),r=t.lastIndex;return r<e.length&&n.push((0,q.jsx)(v.Fragment,{children:e.slice(r)},n.length)),n}function Rl({block:e}){return e.p?(0,q.jsx)(`p`,{children:Ll(e.p)}):e.list?(0,q.jsx)(yl,{children:e.list.map((e,t)=>(0,q.jsx)(`li`,{children:Ll(e)},t))}):e.note?(0,q.jsxs)(bl,{children:[e.buff&&(0,q.jsx)(xl,{children:`CEO Buff`}),Ll(e.note)]}):null}function zl({image:e,index:t,onZoom:n}){let r=t%2==1;return(0,q.jsxs)(Cl,{$reverse:r,children:[(0,q.jsx)(wl,{$side:`left`}),(0,q.jsx)(wl,{$side:`right`}),(0,q.jsx)(Tl,{src:`img/rules/${e.file}`,alt:e.alt,onClick:()=>n(e)}),(0,q.jsxs)(Pl,{children:[(0,q.jsxs)(Fl,{children:[`Fig. `,t+1]}),(0,q.jsx)(Il,{children:e.caption})]})]})}function Bl({images:e,index:t,onZoom:n,full:r}){let i=t%2==1;return(0,q.jsxs)(kl,{$reverse:i,$count:e.length,$full:r,children:[(0,q.jsx)(wl,{$side:`left`}),(0,q.jsx)(wl,{$side:`right`}),(0,q.jsx)(jl,{$count:e.length,$full:r,children:e.map(e=>(0,q.jsxs)(Ml,{children:[(0,q.jsx)(Nl,{children:e.label}),(0,q.jsx)(Tl,{src:`img/rules/${e.file}`,alt:e.alt,onClick:()=>n(e)})]},e.file))}),(0,q.jsxs)(Pl,{children:[(0,q.jsxs)(Fl,{children:[`Fig. `,t+1]}),(0,q.jsx)(Il,{children:e.map(e=>e.caption).join(` · `)})]})]})}function Vl({image:e,onClose:t}){return(0,v.useEffect)(()=>{function e(e){e.key===`Escape`&&t()}return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[t]),(0,q.jsxs)(El,{id:`rules-lightbox`,onClick:t,children:[(0,q.jsx)(Dl,{src:`img/rules/${e.file}`,alt:e.alt,onClick:e=>e.stopPropagation()}),(0,q.jsx)(Ol,{children:`Esc or click outside to close`})]})}function Hl({onOpen:e,onBack:t}){return(0,q.jsxs)($c,{children:[(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`rules-main-menu`,small:!0,active:!0,onClick:t,children:`Main Menu`})}),(0,q.jsx)(Tc,{children:`How to Play`}),(0,q.jsx)(rl,{children:`Everybody moves everybody's pieces. Only two cards, held in secret, say whose side you are really on. Here is the whole game, in plain words — pick a page, or read it start to finish.`}),(0,q.jsxs)(il,{id:`rules-open-cheat-sheet`,type:`button`,onClick:()=>e(`cheat-sheet`),children:[(0,q.jsx)(al,{children:`Cheat Sheet`}),(0,q.jsx)(ol,{children:`Every rule, one screen, no scrolling`})]}),Xc.map(t=>(0,q.jsxs)(v.Fragment,{children:[(0,q.jsx)(fl,{children:t}),(0,q.jsx)(pl,{children:Zc.filter(e=>e.group===t).map(t=>(0,q.jsxs)(ml,{id:`rules-open-${t.slug}`,type:`button`,onClick:()=>e(t.slug),children:[(0,q.jsx)(hl,{children:t.title}),(0,q.jsx)(gl,{children:t.teaser})]},t.slug))})]},t))]})}function Ul({onBack:e,onIndex:t}){return(0,q.jsxs)(Mc,{children:[(0,q.jsx)(jc,{id:`rules-main-menu`,small:!0,active:!0,onClick:e,children:`Main Menu`}),(0,q.jsx)(jc,{id:`rules-index`,small:!0,active:!0,onClick:t,children:`Index`})]})}function Wl({title:e,prev:t,next:n,onOpen:r}){return(0,q.jsxs)(el,{children:[(0,q.jsx)(nl,{children:t&&(0,q.jsx)(jc,{id:`rules-prev-top`,small:!0,active:!0,"aria-label":`Back to ${t.title}`,title:t.title,onClick:()=>r(t.slug),children:`‹`})}),(0,q.jsx)(tl,{children:e}),(0,q.jsx)(nl,{children:n&&(0,q.jsx)(jc,{id:`rules-next-top`,small:!0,active:!0,"aria-label":`On to ${n.title}`,title:n.title,onClick:()=>r(n.slug),children:`›`})})]})}function Gl({prev:e,next:t,onOpen:n}){return!e&&!t?null:(0,q.jsxs)(Mc,{children:[e&&(0,q.jsxs)(jc,{id:`rules-prev-bottom`,small:!0,active:!0,onClick:()=>n(e.slug),children:[`‹ `,e.title]}),t&&(0,q.jsxs)(jc,{id:`rules-next-bottom`,small:!0,active:!0,onClick:()=>n(t.slug),children:[t.title,` ›`]})]})}function Kl({slug:e,onOpen:t,onBack:n,onIndex:r}){let i=Qc(e),[a,o]=(0,v.useState)(null);if(!i)return(0,q.jsxs)($c,{children:[(0,q.jsx)(Ul,{onBack:n,onIndex:r}),(0,q.jsx)(Tc,{children:`That page isn't here`})]});let s=Zc.findIndex(t=>t.slug===e),c=Zc[s-1],l=Zc[s+1];return i.cheatSheet?(0,q.jsxs)($c,{children:[(0,q.jsx)(Ul,{onBack:n,onIndex:r}),(0,q.jsx)(Wl,{title:i.title,prev:c,next:l,onOpen:t}),(0,q.jsx)(sl,{children:i.cheatSheet.map(e=>(0,q.jsxs)(cl,{children:[(0,q.jsx)(ll,{children:e.heading}),e.intro&&(0,q.jsx)(ul,{children:Ll(e.intro)}),(0,q.jsx)(dl,{children:e.points.map((e,t)=>(0,q.jsx)(`li`,{children:Ll(e)},t))})]},e.heading))}),(0,q.jsx)(Gl,{prev:c,next:l,onOpen:t})]}):(0,q.jsxs)($c,{children:[(0,q.jsx)(Ul,{onBack:n,onIndex:r}),(0,q.jsx)(Wl,{title:i.title,prev:c,next:l,onOpen:t}),(0,q.jsxs)(_l,{children:[!i.imagesAtEnd&&i.images&&(0,q.jsx)(Bl,{images:i.images,index:s,onZoom:o}),!i.imagesAtEnd&&i.image&&(0,q.jsx)(zl,{image:i.image,index:s,onZoom:o}),(0,q.jsxs)(vl,{children:[i.body.map((e,t)=>(0,q.jsx)(Rl,{block:e},t)),i.table&&(0,q.jsxs)(Sl,{children:[(0,q.jsx)(`thead`,{children:(0,q.jsx)(`tr`,{children:i.table.headers.map((e,t)=>(0,q.jsx)(`th`,{children:e},t))})}),(0,q.jsx)(`tbody`,{children:i.table.rows.map((e,t)=>(0,q.jsx)(`tr`,{children:e.map((e,t)=>(0,q.jsx)(`td`,{children:Ll(e)},t))},t))})]})]}),i.imagesAtEnd&&i.images&&(0,q.jsx)(Bl,{images:i.images,index:s,onZoom:o,full:!0}),i.imagesAtEnd&&i.imageGroups&&(0,q.jsx)(Al,{children:i.imageGroups.map((e,t)=>(0,q.jsx)(Bl,{images:e,index:s+t,onZoom:o,full:!0},e[0].file))}),i.imagesAtEnd&&i.image&&(0,q.jsx)(zl,{image:i.image,index:s,onZoom:o})]}),(0,q.jsx)(Gl,{prev:c,next:l,onOpen:t}),a&&(0,q.jsx)(Vl,{image:a,onClose:()=>o(null)})]})}var ql=G.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	padding: 24px 16px;

	${xc} {
		gap: 10px;
		padding: 12px 12px;
	}
`,Jl=G.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 420px;
	/* Room for the fixed turnstile footer below, so it never lands on top of the last button
	   instead of below it. Opt-in: every other Panel is unaffected. */
	${({$footerGap:e})=>e?`padding-bottom: 96px;`:``}
`,Yl=G.div`
	font-family: var(--ha-face-data);
	font-size: 42px;
	letter-spacing: 0.24em;
	padding-left: 0.24em;
	color: var(--ha-ink);
`,Xl=G.div`
	font-family: var(--ha-face-data);
	font-size: 12px;
	color: var(--ha-ink-dim);
	letter-spacing: var(--ha-track-label);
	word-break: break-all;
	text-align: center;
`,Zl=G.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 5px;
`,Ql=G.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: var(--ha-face-data);
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	padding: 7px 10px;
	color: var(--ha-ink);
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	opacity: ${({dim:e})=>e?.55:1};
`,$l=G.span`
	display: flex;
	gap: 8px;
	align-items: baseline;
	flex-shrink: 0;
`,eu=G.span`
	font-family: var(--ha-face-data);
	font-variant-numeric: tabular-nums;
	color: var(--ha-ink-faint);
`,tu=G.span`
	font-size: 11px;
	color: var(--ha-ink-faint);
	text-transform: uppercase;
`,nu=G.input`
	font-family: var(--ha-face-data);
	font-size: 17px;
	padding: 8px 10px;
	width: 100%;
	box-sizing: border-box;
	text-align: center;
	background: var(--ha-field-bg);
	color: var(--ha-field-ink);
	border: var(--ha-field-edge);
	border-radius: var(--ha-panel-radius);
	text-transform: ${({code:e})=>e?`uppercase`:`none`};
	letter-spacing: ${({code:e})=>e?`0.3em`:`var(--ha-track-label)`};

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`,ru=G.div`
	display: flex;
	gap: 8px;
	width: 100%;
`,iu=G.div`
	font-family: var(--ha-face-data);
	font-size: 13px;
	padding: 6px 10px;
	letter-spacing: var(--ha-track-label);
	color: ${({bad:e})=>e?`var(--ha-accent)`:`var(--ha-ink-dim)`};
`,au=G.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	padding-top: 6px;
	border-top: 1px solid var(--ha-rule);
`,ou=G.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 5px;
	/* Six rows and then it scrolls. The list is live — rooms fill up and start while it is on screen —
	   so it has to have an end, or the panels below it walk down the page as rooms appear. */
	max-height: 210px;
	overflow-y: auto;
`,su=G.button`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 10px;
	width: 100%;
	text-align: left;
	font-family: var(--ha-face-data);
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	padding: 7px 10px;
	color: var(--ha-ink);
	background: var(--ha-panel);
	border: 1px solid ${({joinable:e})=>e?`var(--ha-panel-edge)`:`var(--ha-rule)`};
	border-radius: var(--ha-panel-radius);
	cursor: ${({joinable:e})=>e?`pointer`:`not-allowed`};
	opacity: ${({joinable:e})=>e?1:.55};

	&:hover {
		border-color: ${({joinable:e})=>e?`var(--ha-accent)`:`var(--ha-rule)`};
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`,cu=G.span`
	font-variant-caps: all-small-caps;
	letter-spacing: 0.04em;
	overflow-wrap: anywhere;
`,lu=G.div`
	font-family: var(--ha-face-data);
	font-size: 22px;
	letter-spacing: 0.08em;
	font-variant-caps: all-small-caps;
	color: var(--ha-ink);
	text-align: center;
	overflow-wrap: anywhere;
`,uu=G.span`
	display: flex;
	gap: 8px;
	align-items: baseline;
	flex-shrink: 0;
	font-size: 11px;
	color: var(--ha-ink-faint);
	text-transform: uppercase;
`,du=G.span`
	color: ${({open:e})=>e?`var(--ha-accent)`:`var(--ha-ink-faint)`};
`,fu=G.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: center;
	width: 100%;
`,pu=G.button`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	padding: 4px 12px;
	cursor: pointer;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	border: 1px solid ${({current:e})=>e?`var(--ha-accent)`:`var(--ha-rule)`};
	background: ${({current:e})=>e?`var(--ha-accent)`:`transparent`};
	color: ${({current:e})=>e?`var(--ha-ink-on-accent)`:`var(--ha-ink-dim)`};

	&:hover {
		color: ${({current:e})=>e?`var(--ha-ink-on-accent)`:`var(--ha-ink)`};
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`,mu=G.span`
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`,hu=G.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
	align-self: center;
	width: auto;
	margin: 2px 0 8px;
	padding: 7px 26px 6px 18px;
	background: var(--ha-accent);
	border: 1px solid var(--ha-panel-edge);
	clip-path: var(--ha-hq-label-clip, polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%));
	transform: rotate(-1.4deg);
	box-shadow:
		var(--ha-panel-shadow),
		2px 4px 8px rgba(20, 15, 5, 0.35);
	cursor: pointer;
	transition: transform 0.1s ease-out;

	&:hover {
		transform: rotate(0deg) scale(1.03);
	}

	&:active {
		transform: rotate(0deg) scale(0.98);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-ink-on-accent);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		&,
		&:hover,
		&:active {
			transition: none;
		}
	}
`,gu=G.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-on-accent);
	opacity: 0.8;
`,_u=G.span`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 17px;
	letter-spacing: var(--ha-track);
	text-transform: uppercase;
	color: var(--ha-ink-on-accent);
`,vu=G.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;

	& > button {
		width: 100%;
	}
`,yu=G.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 20;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
	background: var(--ha-panel);
	border-top: 1px solid var(--ha-panel-edge);
	box-shadow: 0 -4px 14px rgba(20, 15, 5, 0.3);
`,bu=G.div`
	display: flex;
	justify-content: center;
	width: 100%;
`,xu=200,Su={no_such_room:`No room with that code.`,room_full:`That room is full.`,name_taken:`Somebody in that room already has that name.`,room_already_started:`That game has already started.`,not_enough_players:`Wait for at least 2 players.`,seat_lost:`Your seat is gone. Join again with a name.`,server_full:`The server is at its room limit. Try again shortly.`,slow_down:`Too many attempts. Wait a moment.`,not_host:`Only the player who made the room can start it.`,skin_locked:`The style cannot be changed once the game has started.`,bad_skin:`No such style.`,bad_room_name:`A room name is letters, digits, spaces and hyphens.`,already_seated:`You are already at a table.`,bad_turnstile:`Bot check failed. Try again.`,left_alone:`Everybody else left, so the game ended.`};function Cu(e){if(!Number.isFinite(e))return`You left a game in progress. Wait a moment before starting another.`;let t=Math.ceil(e/60);return`You left a game in progress. You can play again in ${e<60?`${e}s`:`${t} min`}.`}function wu(e,t=null){return e===`quit_timeout`?Cu(t):Su[e]||e}function Tu({canGo:e,onCreate:t}){let[n,r]=(0,v.useState)(qc),[i,a]=(0,v.useState)(!0),o=Yc(n);return(0,q.jsxs)(au,{children:[(0,q.jsx)(Tc,{children:`New room`}),(0,q.jsxs)(ru,{children:[(0,q.jsx)(nu,{id:`lobby-room-name`,value:n,maxLength:24,placeholder:`ROOM NAME`,onChange:e=>r(e.target.value)}),(0,q.jsx)(jc,{id:`lobby-room-reroll`,small:!0,active:!0,onClick:()=>r(qc()),children:`↻`})]}),(0,q.jsxs)(fu,{id:`lobby-visibility`,children:[(0,q.jsx)(mu,{children:`Listed`}),(0,q.jsx)(pu,{id:`lobby-visibility-public`,type:`button`,current:i,"aria-pressed":i,onClick:()=>a(!0),children:`Public`}),(0,q.jsx)(pu,{id:`lobby-visibility-private`,type:`button`,current:!i,"aria-pressed":!i,onClick:()=>a(!1),children:`Private`})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`lobby-create`,active:e&&o,onClick:()=>e&&o&&t({room:n.trim(),isPrivate:!i}),children:`NEW ROOM`})}),!o&&(0,q.jsx)(iu,{id:`lobby-room-name-bad`,children:wu(`bad_room_name`)}),!i&&(0,q.jsx)(iu,{id:`lobby-private-hint`,children:`A private room is found by its code alone.`})]})}function Eu({rooms:e,total:t,query:n,onQuery:r,canGo:i,held:a,onEnter:o,unreachable:s}){return(0,q.jsxs)(au,{children:[(0,q.jsx)(Tc,{children:`Find a room`}),(0,q.jsx)(nu,{id:`lobby-search`,value:n,maxLength:24,placeholder:`SEARCH BY NAME`,onChange:e=>r(e.target.value)}),s&&(0,q.jsx)(iu,{id:`lobby-rooms-offline`,children:`The room list needs a server to ask.`}),!s&&e.length===0&&(0,q.jsx)(iu,{id:`lobby-rooms-empty`,children:n.trim()?`No public room by that name.`:`No public rooms yet. Open one.`}),e.length>0&&(0,q.jsx)(ou,{id:`lobby-rooms`,children:e.map(e=>{let t=a.has(e.code),n=e.state===pn.LOBBY&&e.players<6,r=t||n&&i;return(0,q.jsx)(`li`,{children:(0,q.jsxs)(su,{id:`lobby-room-${e.code}`,type:`button`,joinable:r,disabled:!r,"data-room-name":e.name,"data-room-host":e.host||``,"data-room-players":e.players,"data-room-state":e.state,...Number.isFinite(e.rating)?{"data-room-rating":e.rating}:{},onClick:()=>o(e.code),children:[(0,q.jsx)(cu,{children:e.name}),(0,q.jsxs)(uu,{children:[(0,q.jsx)(`span`,{children:e.host}),Number.isFinite(e.rating)&&(0,q.jsx)(eu,{children:e.rating}),(0,q.jsxs)(`span`,{children:[e.players,`/`,6]}),(0,q.jsx)(du,{open:n,children:t?`yours`:e.state})]})]})},e.code)})}),t>e.length&&(0,q.jsxs)(iu,{id:`lobby-rooms-more`,children:[`Showing `,e.length,` of `,t,`. Search to narrow it.`]}),e.length>0&&!i&&(0,q.jsx)(iu,{id:`lobby-rooms-need-name`,children:`Say who you are first.`})]})}function Du({seats:e,onEnter:t}){return e.length?(0,q.jsxs)(au,{children:[(0,q.jsx)(Tc,{children:`You are in a game`}),(0,q.jsx)(ou,{id:`lobby-resume`,children:e.map(e=>(0,q.jsx)(`li`,{children:(0,q.jsxs)(su,{id:`lobby-resume-${e.code}`,type:`button`,joinable:!0,"data-room-name":e.room||e.code,onClick:()=>t(e.code),children:[(0,q.jsx)(cu,{children:e.room||e.code}),(0,q.jsxs)(uu,{children:[(0,q.jsx)(`span`,{children:e.name}),(0,q.jsx)(du,{open:!0,children:`resume`})]})]})},e.code))})]}):null}function Ou({canGo:e,queue:t,onQueue:n,onCancel:r}){let i=!!t;return(0,q.jsxs)(au,{children:[(0,q.jsx)(Tc,{children:`Automatch`}),(0,q.jsxs)(ru,{children:[(0,q.jsx)(jc,{id:`lobby-queue`,small:!0,active:e||i,onClick:i?r:n,children:i?`CANCEL`:`FIND ME A GAME`}),i&&(0,q.jsxs)(mu,{id:`lobby-queue-status`,"data-waiting":t.waiting,children:[`Searching — `,t.waiting,` waiting`,Number.isFinite(t.rating)?`, you are on ${t.rating}`:``,t.window===null?`, any rating`:``]})]}),!e&&!i&&(0,q.jsx)(iu,{id:`lobby-queue-need-name`,children:`Say who you are first.`})]})}function ku({rated:e,playerName:t}){let n=e?.players?.find(e=>e.name===t);return!n||!n.delta?null:(0,q.jsxs)(iu,{id:`lobby-last-game`,"data-delta":n.delta,children:[`Last game: `,n.delta>0?`+`:`−`,Math.abs(n.delta),` — you are on `,n.after,`.`]})}var Au=`menu`,ju=`start`,Mu=`join`,Nu=`rules`,Pu=`rules:`;function Fu(e){return e===ju?`#/start`:e===Mu?`#/join`:e===Nu?`#/rules`:e.startsWith(Pu)?`#/rules/${e.slice(6)}`:`#/`}function Iu(){let e=document.querySelector(`.game`);e&&(e.scrollTop=0)}function Lu(){let e=window.location.hash;if(e===`#/start`)return ju;if(e===`#/join`)return Mu;if(e===`#/rules`)return Nu;let t=/^#\/rules\/([a-z-]+)$/.exec(e);return t&&Qc(t[1])?`${Pu}${t[1]}`:Au}function Ru({session:e,unreachable:t}){let{code:n,rooms:r,roomsTotal:i,resumable:a,playerName:o,queue:s,rated:c,error:l,turnstileRequired:u,actions:d}=e,{createRoom:f,joinRoom:p,listRooms:m,stopListing:h,queueUp:g,cancelQueue:_,goHotSeat:y}=d,[b,x]=(0,v.useState)(()=>o||``),[S,C]=(0,v.useState)(n||``),[w,T]=(0,v.useState)(``),[E,D]=(0,v.useState)(Lu),O=(0,v.useRef)(!1),{containerRef:k,token:A,reset:j}=Rc(u),M=b.trim(),N=M.length>0&&(!u||!!A),P=new Set(a.map(e=>e.code));(0,v.useEffect)(()=>{let e=setTimeout(()=>m(w),xu);return()=>clearTimeout(e)},[w,m]),(0,v.useEffect)(()=>h,[h]),(0,v.useEffect)(()=>{l&&j()},[l,j]),(0,v.useEffect)(()=>{if(O.current)return;O.current=!0;let e=Lu();e!==Au&&(window.history.replaceState(null,``,`#/`),window.history.pushState(null,``,Fu(e)))},[]),(0,v.useEffect)(()=>{function e(){D(Lu())}return window.addEventListener(`popstate`,e),()=>window.removeEventListener(`popstate`,e)},[]),(0,v.useEffect)(()=>{if(E===Au)return;function e(e){e.key===`Escape`&&window.history.back()}return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[E]);let F=(0,v.useCallback)(e=>p(e,M,A),[p,M,A]),I=(0,v.useCallback)(e=>N&&f(M,{...e,turnstileToken:A}),[N,f,M,A]),ee=(0,v.useCallback)(()=>N&&S.trim().length===4&&F(S.trim().toUpperCase()),[N,F,S]),te=(0,v.useCallback)(e=>{D(e),window.history.pushState(null,``,Fu(e)),Iu()},[]),ne=(0,v.useCallback)(()=>window.history.back(),[]),re=(0,v.useCallback)(()=>te(Au),[te]);return E===Nu?(0,q.jsx)(Hl,{onOpen:e=>te(`${Pu}${e}`),onBack:re}):E.startsWith(Pu)?(0,q.jsx)(Kl,{slug:E.slice(6),onOpen:e=>te(`${Pu}${e}`),onBack:re,onIndex:()=>te(Nu)}):E===ju?(0,q.jsxs)(Jl,{children:[(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`lobby-back`,small:!0,active:!0,onClick:ne,children:`‹ Back`})}),(0,q.jsx)(Tc,{children:`Start a game`}),(0,q.jsx)(Ou,{canGo:N,queue:s,onQueue:()=>N&&g(M,A),onCancel:_}),(0,q.jsx)(Tu,{canGo:N,onCreate:I})]}):E===Mu?(0,q.jsxs)(Jl,{children:[(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`lobby-back`,small:!0,active:!0,onClick:ne,children:`‹ Back`})}),(0,q.jsx)(Tc,{children:`Join a game`}),(0,q.jsx)(Eu,{rooms:r,total:i,query:w,onQuery:T,canGo:N,held:P,onEnter:F,unreachable:t}),(0,q.jsxs)(au,{children:[(0,q.jsx)(Tc,{children:`Or join by code`}),(0,q.jsxs)(ru,{children:[(0,q.jsx)(nu,{id:`lobby-code`,code:!0,value:S,maxLength:4,placeholder:`CODE`,onChange:e=>C(e.target.value.toUpperCase())}),(0,q.jsx)(jc,{id:`lobby-join`,small:!0,active:N&&S.trim().length===4,onClick:ee,children:`JOIN`})]})]})]}):(0,q.jsxs)(Jl,{$footerGap:u,children:[(0,q.jsx)(Tc,{children:`Your name`}),(0,q.jsx)(nu,{id:`lobby-name`,value:b,maxLength:16,placeholder:`NAME`,onChange:e=>x(e.target.value.toUpperCase())}),u&&(0,q.jsxs)(yu,{children:[(0,q.jsx)(Tc,{children:`Verify you're human`}),(0,q.jsx)(bu,{id:`lobby-turnstile`,ref:k}),!A&&(0,q.jsx)(iu,{id:`lobby-turnstile-hint`,children:`Complete the check to continue.`})]}),(0,q.jsx)(ku,{rated:c,playerName:o}),(0,q.jsx)(Du,{seats:a,onEnter:F}),(0,q.jsxs)(hu,{id:`lobby-menu-rules`,type:`button`,onClick:()=>te(Nu),children:[(0,q.jsx)(gu,{children:`Case File`}),(0,q.jsx)(_u,{children:`How to Play`})]}),(0,q.jsxs)(au,{children:[(0,q.jsxs)(vu,{children:[(0,q.jsx)(jc,{id:`lobby-menu-start`,active:!0,onClick:()=>te(ju),children:`START A GAME`}),(0,q.jsx)(jc,{id:`lobby-menu-join`,active:!0,onClick:()=>te(Mu),children:`JOIN A GAME`}),(0,q.jsx)(jc,{id:`play-hotseat-btn`,small:!0,active:!0,onClick:y,children:`PLAY HOT-SEAT INSTEAD`})]}),t&&(0,q.jsx)(iu,{id:`lobby-no-server`,children:`No server answered. Hot-seat plays in this tab and needs none.`})]})]})}function zu({seats:e,hostSeatId:t,seatId:n}){return(0,q.jsx)(Zl,{id:`lobby-seats`,children:e.map(e=>(0,q.jsxs)(Ql,{dim:!e.connected,id:`lobby-seat-${e.name}`,...Number.isFinite(e.rating)?{"data-rating":e.rating}:{},children:[(0,q.jsxs)(`span`,{children:[e.name,e.id===n?` (you)`:``]}),(0,q.jsxs)($l,{children:[Number.isFinite(e.rating)&&(0,q.jsx)(eu,{children:e.rating}),(0,q.jsxs)(tu,{children:[e.id===t?`host`:``,e.connected?``:` offline`]})]})]},e.id))})}function Bu({session:e}){let{code:t,roomName:n,roomPrivate:r,seats:i,hostSeatId:a,seatId:o,actions:s}=e,c=o&&o===a,l=i.length>=2,u=`${window.location.origin}${window.location.pathname}#/r/${t}`;return(0,q.jsxs)(Jl,{children:[(0,q.jsx)(Tc,{children:r?`Private room`:`Room`}),(0,q.jsx)(lu,{id:`lobby-room-title`,children:n}),(0,q.jsx)(Tc,{children:`Room code`}),(0,q.jsx)(Yl,{id:`lobby-room-code`,children:t}),(0,q.jsx)(Xl,{id:`lobby-share`,children:u}),(0,q.jsxs)(Tc,{children:[`Players (`,i.length,`/`,6,`)`]}),(0,q.jsx)(zu,{seats:i,hostSeatId:a,seatId:o}),(0,q.jsx)(Uc,{}),(0,q.jsxs)(Mc,{children:[c?(0,q.jsx)(jc,{id:`lobby-start`,active:l,onClick:s.start,children:`START`}):(0,q.jsx)(iu,{id:`lobby-waiting`,children:`Waiting for the host to start…`}),(0,q.jsx)(Wc,{id:`lobby-leave`,label:`LEAVE ROOM`})]}),c&&!l&&(0,q.jsxs)(iu,{children:[`At least `,2,` players are needed.`]})]})}function Vu(){let e=Zs(),{status:t,seatId:n,error:r,errorSeconds:i}=e,a=!!n,o=t===`reconnecting`;return(0,q.jsxs)(ql,{children:[(0,q.jsxs)(wc,{children:[(0,q.jsx)(Pc,{}),`Hidden Agenda`]}),t===`connecting`&&(0,q.jsx)(iu,{id:`lobby-connecting`,children:`Connecting…`}),t===`reconnecting`&&a&&(0,q.jsx)(iu,{id:`lobby-reconnecting`,children:`Reconnecting…`}),r&&(0,q.jsx)(iu,{bad:!0,id:`lobby-error`,children:wu(r,i)}),a?(0,q.jsx)(Bu,{session:e}):(0,q.jsx)(Ru,{session:e,unreachable:o})]})}var Hu=G.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 40px;
	max-width: 960px;
	width: 66vw;

	@media (max-width: 780px) {
		width: 100%;
		padding: 18px 14px;
	}
`,Uu=G.div`
	width: 100%;
	background: var(--ha-panel);
	background-image: var(--ha-panel-texture);
	background-repeat: no-repeat;
	background-position: bottom;
	background-size: 100% 5px;
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	box-shadow: var(--ha-panel-shadow);
	color: var(--ha-ink);
`,Wu=G.div`
	display: flex;
	flex-direction: column;
`,Gu=G.div`
	color: var(--ha-band-ink);
	background: var(--ha-band-bg);
	padding: 6px 10px;
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`,Ku=G.div`
	font-size: 10px;
	padding: 5px 10px;
	color: var(--ha-ink-dim);
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`,qu=G.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	font-size: 20px;
	padding: 15px;
	accent-color: var(--ha-accent);
`,Ju=G.label`
	margin-left: 5px;
	color: var(--ha-ink);
`,Yu=G.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
`,Xu=G.div`
	border-top: 1px solid var(--ha-rule);
	border-right: 1px solid var(--ha-rule);
	flex-basis: 33%;
	flex-grow: 1;
`,Zu=G.input`
	margin: 5px 5px 10px 10px;
	padding: 5px 5px 2px 5px;
	background: var(--ha-field-bg);
	color: var(--ha-field-ink);
	font-size: 20px;
	position: relative;
	text-transform: uppercase;
	width: 75%;

	&,
	&:focus,
	&:active {
		border: none;
		border-bottom: var(--ha-field-edge);
		outline: none;
		font-family: var(--ha-face-data);
		letter-spacing: var(--ha-track);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`;function Qu({n:e,numberPlayers:t,onChange:n}){let r=(0,v.useCallback)(e=>n(parseInt(e.target.value,10)),[n]);return(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`input`,{type:`radio`,id:`players${e}`,name:`number-players`,value:e,defaultChecked:e===t,onChange:r}),(0,q.jsx)(Ju,{htmlFor:e,children:e})]},`players${e}`)}function $u({n:e,onChange:t}){let n=(0,v.useCallback)(e=>t(e.target.name,e.target.value),[t]);return(0,q.jsxs)(Xu,{children:[(0,q.jsxs)(Ku,{children:[`PLAYER `,e]}),(0,q.jsx)(Zu,{type:`text`,id:`player-name${e}`,name:`player${e}`,onChange:n})]},`player${e}`)}function ed(e,t,n){let[r,i]=(0,v.useContext)(Gs);return(0,v.useCallback)(()=>{n&&(i(Ka(Object.values(e))),t())},[e,i,t,n])}function td(e,t){return(0,v.useMemo)(()=>Object.values(t).filter(e=>e).length===e,[e,t])}function nd(e){let[t,n]=(0,v.useState)(Object.keys(e).length),[r,i]=(0,v.useState)(e),a=(0,v.useCallback)(e=>{n(e),i(Object.entries(r).slice(0,e).reduce((e,[t,n])=>({...e,[t]:n}),{}))},[r]),o=(0,v.useCallback)((e,t)=>i({...r,[e]:t.toUpperCase()}),[r]);return[{players:r,numberOfPlayers:t},{onNumberPlayersChange:a,onSelectPlayerOptions:o}]}function rd({onReady:e}){let[t,n]=nd({player1:void 0,player2:void 0}),{players:r,numberOfPlayers:i}=t,{onNumberPlayersChange:a,onSelectPlayerOptions:o}=n,s=td(i,r),c=ed(r,e,s),l=Zs();return(0,q.jsxs)(Hu,{children:[(0,q.jsxs)(Uu,{children:[(0,q.jsxs)(Wu,{children:[(0,q.jsx)(Gu,{children:`1. NUMBER OF PLAYERS`}),(0,q.jsx)(qu,{children:[,,,,,].fill().map((e,t)=>(0,q.jsx)(Qu,{n:t+2,numberPlayers:i,onChange:a},`${t+2}`))})]}),(0,q.jsx)(Gu,{children:`2. PLAYERS`}),(0,q.jsx)(Yu,{children:Array(i).fill().map((e,t)=>(0,q.jsx)($u,{n:t+1,onChange:o},t+1))})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`start-btn`,active:s,onClick:c,children:`GET ALIGNMENTS`})}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`play-online-btn`,small:!0,active:!0,onClick:l.actions.goOnline,children:`PLAY ONLINE INSTEAD`})})]})}var id=({alignment:e})=>e===`friend`?`var(--ha-friend)`:`var(--ha-foe)`,ad=({disabled:e})=>{if(!e)return W`
			filter: brightness(1.2);
		`},od=({team:e})=>{if(e!=null)return W`
		&::before {
			content: '';
			display: var(--ha-team-tab);
			position: absolute;
			top: -10px;
			right: 15px;
			width: 42px;
			height: 12px;
			background: var(--ha-team-${e});
			box-shadow: inset 0 0 0 1px var(--ha-team-${e}-line);
			clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%);
		}
	`},sd=({team:e})=>{if(e!=null)return W`
		background-color: color-mix(in srgb, var(--ha-team-${e}) var(--ha-card-team-fill), transparent);
		background-image: var(--ha-team-overlay);
		color: var(--ha-card-team-ink, var(--ha-team-${e}-ink));
	`},cd=({team:e})=>{if(e!=null)return W`
		background-color: var(--ha-team-${e});
		box-shadow:
			inset 0 0 0 1px var(--ha-team-${e}-line),
			var(--ha-card-chip-inner),
			0 0 8px color-mix(in srgb, var(--ha-team-${e}) var(--ha-card-chip-glow), transparent);
	`},ld=G.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	gap: 16px;
	/* The phase centres its column, so without a width of its own this row shrinks to its content
	   and space-evenly has nothing to distribute — the two cards end up edge to edge. */
	width: 100%;
	margin: 40px;

	${Cc} {
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}
`,ud=G.div`
	position: relative;
	width: 200px;
	height: 324px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 14px;
	background-color: ${id};
	/* The skin's own material, laid over the alignment colour rather than replacing it: carbon
	   flimsy, a cyanotype sheet, a dark plate. */
	background-image: linear-gradient(var(--ha-card-bg-mix), var(--ha-card-bg-mix));
	border: var(--ha-card-edge);
	box-shadow: var(--ha-card-shadow);
	transform: rotate(var(--ha-card-rotate));
	cursor: ${({active:e})=>e?`pointer`:`not-allowed`};

	${od}

	&:hover {
		${ad}
	}
`,dd=G.i`
	align-self: flex-start;
	font-style: normal;
	font-family: var(--ha-face);
	font-weight: var(--ha-card-label-weight);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	background: color-mix(in srgb, ${id} var(--ha-card-label-fill), transparent);
	color: color-mix(in srgb, ${id} var(--ha-card-label-tint), var(--ha-card-label-ink));
	padding: var(--ha-card-label-pad);
	border-radius: var(--ha-card-label-radius);
	/* A colour, never a width: the rule is Dossier's typed underline and the other two set it
	   transparent, so the word occupies the same box in all three. */
	border-bottom: var(--ha-card-label-rule);
	box-shadow: var(--ha-card-label-shadow);

	/* A pseudo-element rather than a word in the component, so the figure number is the direction's
	   business and not the card's. Playwright reads text with textContent, which does not see this. */
	&::before {
		content: ${({alignment:e})=>e===`friend`?`var(--ha-card-fig-friend)`:`var(--ha-card-fig-foe)`};
	}
`,fd=G.div`
	align-self: stretch;
	display: flex;
	flex-direction: column;
	gap: 10px;
`,pd=G.span`
	display: block;
	font-family: var(--ha-face);
	font-weight: bold;
	font-size: 22px;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	text-align: center;
	padding: 9px 4px;
	/* Ruled above and below and running the full width in two of the three: a typed page and a
	   drawing both rule a field rather than boxing it, and only the case has a bezel all round. */
	border-top: var(--ha-card-team-edge);
	border-bottom: var(--ha-card-team-edge);
	border-left: var(--ha-card-team-side);
	border-right: var(--ha-card-team-side);
	border-radius: var(--ha-card-team-radius);
	box-shadow: var(--ha-card-team-shadow);
	${sd}

	${Cc} {
		font-size: 18px;
	}
`,md=G.div`
	display: flex;
	align-items: center;
	gap: 9px;
	font-family: var(--ha-face-data);
	font-size: 7.5px;
	letter-spacing: 0.15em;
	line-height: 1.35;
	text-transform: uppercase;
	color: var(--ha-card-note-ink);
	background: var(--ha-card-swatch-bg);
	border: var(--ha-card-swatch-edge);
	border-radius: var(--ha-card-swatch-radius);
	box-shadow: var(--ha-card-swatch-shadow);
	padding: var(--ha-card-swatch-pad);
`,hd=G.span`
	display: block;
	flex: none;
	width: var(--ha-card-chip-size);
	height: var(--ha-card-chip-size);
	border-radius: var(--ha-card-chip-radius);
	/* Half hatched where a direction has to admit it is specifying a colour rather than printing it. */
	background-image: var(--ha-card-chip-overlay);
	transform: rotate(var(--ha-card-chip-rotate));
	${cd}
`,gd=G.span`
	display: block;

	&::before {
		content: var(--ha-card-swatch-key);
		display: block;
	}
`,_d=G.span`
	display: var(--ha-card-swatch-ref);
`,vd=G.span`
	display: var(--ha-card-swatch-name);
`,yd=G.span`
	align-self: stretch;
	font-family: var(--ha-face-data);
	font-size: 8.5px;
	letter-spacing: 0.16em;
	line-height: 1.4;
	text-transform: uppercase;
	color: var(--ha-card-note-ink);
`,bd={friend:`Friend`,foe:`Foe`},xd={friend:`their points are yours`,foe:`their points come off yours`};function Sd(e){let{children:t,team:n,alignment:r}=e,i=!!t&&n!=null;return(0,q.jsxs)(ud,{...e,children:[(0,q.jsx)(dd,{alignment:r,children:bd[r]}),i&&(0,q.jsxs)(fd,{children:[(0,q.jsx)(pd,{team:n,"data-team":n,children:t}),(0,q.jsxs)(md,{children:[(0,q.jsx)(hd,{team:n}),(0,q.jsxs)(gd,{children:[(0,q.jsxs)(_d,{children:[`team `,n]}),(0,q.jsx)(vd,{children:Xn[n]})]})]})]}),(0,q.jsx)(yd,{children:xd[r]})]})}function Cd(e){return(0,q.jsx)(Sd,{alignment:`friend`,...e})}function wd(e){return(0,q.jsx)(Sd,{alignment:`foe`,...e})}var Td=[`0`,`1`,`2`,`3`],Ed=2;function Dd(){return Td.reduce((e,t)=>e.concat(Array(Ed).fill(t)),[])}function Od(e,t,n){let r=e.filter(e=>e!==t),i=r.length?r:e,a=i[Math.floor(n()*i.length)];return e.splice(e.indexOf(a),1),a}function kd(e,t=Math.random){let n=Dd(),r=Dd();return e.map(e=>{let i=Od(n,void 0,t);return{name:e,friend:i,foe:Od(r,i,t)}})}var Ad=G.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	max-width: 960px;
	width: 100%;
	background-image: var(--ha-panel-ornament);
	background-repeat: no-repeat;

	@media (max-width: 780px) {
		padding: 18px 12px;
	}
`;function jd(e){let[t]=(0,v.useState)(()=>kd(e.map(e=>e.name)).reduce((e,t)=>({...e,[t.name]:t}),{}));return t}function Md(e){let[{players:t},n]=(0,v.useContext)(Gs),[r,i]=(0,v.useState)(t[0].name),a=jd(t),[o,s]=(0,v.useState)({friend:!1,foe:!1}),c=(0,v.useCallback)(()=>s({friend:!1,foe:!1}),[s]),l=(0,v.useCallback)(()=>{r||e(),c(),i(e=>{let n=t.findIndex(t=>t.name===e);return n===t.length-1?null:t[n+1].name})},[t,r,e,c,i]),u=(0,v.useMemo)(()=>{let e=t.find(e=>e.name===r);return e?e.alignment.friend:null},[t,r]),d=(0,v.useMemo)(()=>{let e=t.find(e=>e.name===r);return e?e.alignment.foe:null},[t,r]);return{cardsRevealed:o,revealFriend:(0,v.useCallback)(()=>{o.friend||(n(Ja({name:r,friend:a[r].friend})),s(e=>({friend:!0,foe:e.foe})))},[r,s,o,a,n]),revealFoe:(0,v.useCallback)(()=>{o.foe||(n(Ja({name:r,foe:a[r].foe})),s(e=>({friend:e.friend,foe:!0})))},[r,s,o,a,n]),playerTurn:r,currentFriend:u,currentFoe:d,nextTurn:l}}function Nd(e){return e?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(wc,{children:[`This is only for `,e,`'s eyes`]}),(0,q.jsx)(Tc,{children:`Expose your alignments`})]}):(0,q.jsx)(wc,{children:`You are all ready to start!`})}function Pd({onReady:e}){let[{players:t}]=(0,v.useContext)(Gs),n=Zs(),[r,i]=(0,v.useState)(!1),a=t.find(e=>e.name===n.name),o=(0,v.useCallback)(()=>{i(!0),e()},[e]);if(!a)return(0,q.jsx)(Ad,{children:(0,q.jsx)(wc,{children:`Waiting for the table…`})});let s=n.seats.filter(e=>e.ready).length;return(0,q.jsxs)(Ad,{children:[(0,q.jsxs)(wc,{children:[a.name,`, these are yours`]}),(0,q.jsx)(Tc,{children:`Nobody else can see them`}),(0,q.jsxs)(ld,{children:[(0,q.jsx)(Cd,{id:`alingnment-card-friend`,disabled:!0,player:a.name,team:a.alignment.friend,children:Xn[a.alignment.friend]}),(0,q.jsx)(wd,{id:`alingnment-card-foe`,disabled:!0,player:a.name,team:a.alignment.foe,children:Xn[a.alignment.foe]})]}),(0,q.jsxs)(Mc,{children:[(0,q.jsx)(jc,{id:`alignments-btn`,active:!r,onClick:o,children:r?`WAITING…`:`READY`}),(0,q.jsx)(Wc,{})]}),(0,q.jsxs)(Tc,{id:`alignment-ready-count`,children:[s,`/`,n.seats.length,` ready`]}),(0,q.jsx)(Uc,{})]})}function Fd({onReady:e}){let{cardsRevealed:t,revealFriend:n,revealFoe:r,playerTurn:i,currentFriend:a,currentFoe:o,nextTurn:s}=Md(e),c=Object.values(t).every(e=>e)||!i;return(0,q.jsxs)(Ad,{children:[Nd(i),i&&(0,q.jsxs)(ld,{children:[(0,q.jsx)(Cd,{id:`alingnment-card-friend`,player:i,team:a,disabled:t.friend,onClick:n,children:Xn[a]}),(0,q.jsx)(wd,{id:`alingnment-card-foe`,player:i,disabled:t.foe,team:o,onClick:r,children:Xn[o]})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`alignments-btn`,active:c,onClick:s,children:i?`NEXT PLAYER`:`START`})}),(0,q.jsx)(Uc,{})]})}function Id({online:e,onReady:t}){return e?(0,q.jsx)(Pd,{onReady:t}):(0,q.jsx)(Fd,{onReady:t})}var Ld=G.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 25%;
	max-width: 230px;
	flex-shrink: 0;

	/* Stacked layout: the pair sits side by side above (and below) the board rather than as a
	   tall column beside it. */
	${xc} {
		flex-direction: row;
		width: 100%;
		max-width: none;
		gap: 8px;
	}
`,{AGENT:Rd,CEO:zd,SPY:Bd,SNIPER:Vd}=vn,Hd=Math.sqrt(3)*1,Ud=1.5,Wd=3;function Gd(e){return On[e]===void 0?7-Math.abs(e-Wd):On[e]}function Kd(e,t){return{x:(t-(Gd(e)-1)/2)*Hd,z:(e-Wd)*Ud}}var qd={width:9*Hd,depth:9*Ud},Jd=qd.width/(qd.depth*Math.sin(52*Math.PI/180));function Yd(e,t){return e>=0&&e<kn.length&&t>=0&&t<On[e]}function Xd(){let e=[],t=[-1,...kn,kn.length];for(let n of t){let t=Gd(n);for(let r=-1;r<=t;r++)e.push({row:n,cell:r,playable:Yd(n,r),...Kd(n,r)})}return e}var Zd={"1,0":30,"1,1":-30,"0,0":90,"0,1":-90,"-1,0":150,"-1,1":-150};function Qd(e){if(!e)return 0;let t=Zd[`${e[0]},${e[1]}`];return t===void 0?0:t}var $d=[{type:Rd,number:`3`,column:0,row:0},{type:Rd,number:`2`,column:-.5,row:1},{type:Rd,number:`4`,column:.5,row:1},{type:Rd,number:`1`,column:-1,row:2},{type:zd,number:``,column:0,row:2},{type:Rd,number:`5`,column:1,row:2},{type:Bd,number:``,column:-.5,row:3},{type:Vd,number:``,column:.5,row:3}];function ef(){return $d.map(e=>({key:`${e.type}${e.number}`,x:e.column*Hd,z:(e.row-3/2)*Ud}))}function tf(e){return e.slice(2)}var nf=G.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 40px 60px;
	width: 100%;

	${Cc} {
		padding: 4px 8px 16px;
	}
`,rf=G.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-bottom: 20px;
	width: 90vw;
	height: 75vh;

	/* Upright, there is no room for HQ | board | HQ side by side: the HQs end up narrower than
	   their own "Claim Control" button. Stack instead — two HQs, the board, two HQs. */
	${xc} {
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: auto;
		margin-bottom: 12px;
	}

	/* On its side the board keeps the row layout, just shorter — enough that the action bar
	   lands above the fold instead of just below it. */
	${Sc} {
		height: 68vh;
		margin-bottom: 6px;
	}
`,af=G.div`
	width: 90vw;
	display: flex;
	justify-content: space-evenly;
	padding: 0;
	z-index: 10;

	/* Was a single non-wrapping row, so on a phone the last button hung off the screen — and
	   with the old overflow: hidden it was simply gone. */
	${Cc} {
		width: 100%;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
	}
`,of=G.div`
	flex-basis: 33%;
	display: flex;
	justify-content: center;
	/* The controls used to be one segmented strip held together by shared borders. Each direction
	   now gives a control an edge of its own — a stamp outline, a cut corner, a bevel — so they
	   need air between them instead. */
	gap: 8px;
	align-items: center;
	cursor: ${({active:e})=>e?`pointer`:`not-allowed`};

	/* An action holds more than one button: the middle one grows to ACCUSE + the alignment cards
	   the player has revealed + REVEAL. Without wrapping it outgrew the screen, and since it is
	   centred it hung off *both* edges at once — with .game clipping horizontally, ACCUSE and
	   REVEAL were not merely ugly but unreachable. */
	${Cc} {
		flex-basis: auto;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
		max-width: 100%;
	}
`,sf=G.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: center;
	padding: 2px 14px;
	background: var(--ha-cell-bg);
	border-left: var(--ha-cell-divider);

	&:first-child {
		border-left: none;
	}

	${Cc} {
		padding: 2px 7px;
		gap: 5px;
	}
`,cf=G.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
	font-weight: 400;

	${Cc} {
		font-size: 8px;
	}
`,lf=G.span`
	display: inline-flex;
	align-items: baseline;
	gap: 8px;
	padding: 2px 9px 1px;
	color: var(--ha-stamp-ink);
	border: var(--ha-stamp-edge);
	transform: rotate(var(--ha-stamp-rotate));
	text-shadow: var(--ha-control-ink-shadow);
`,uf=G.span`
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
	font-variant-numeric: tabular-nums;
	white-space: nowrap;

	${Cc} {
		font-size: 12px;
	}
`,df=G.span`
	display: var(--ha-mark-initials, inline-flex);
	gap: 3px;
`,ff=G.i`
	font-style: normal;
	font-family: var(--ha-face-data);
	font-size: 10px;
	line-height: 14px;
	width: 13px;
	text-align: center;
	border: 1px solid var(--ha-rule);
	color: ${({$on:e})=>e?`var(--ha-ink-on-accent)`:`var(--ha-ink-faint)`};
	background: ${({$on:e})=>e?`var(--ha-ink)`:`transparent`};
`,pf=G.div`
	position: fixed;
	inset: 0;
	z-index: 900;
	display: flex;
	/* flex-start plus auto margins on the body, not align-items: center. Centring a flex item that is
	   taller than its scroll container puts its top above the scrollable area, where it cannot be
	   reached — and two full-size cards are taller than the 800x600 the specs are pinned to. */
	align-items: flex-start;
	justify-content: center;
	padding: 20px;
	overflow-y: auto;
	background-color: var(--ha-ground);
	background-image: var(--ha-ground-wash);
`,mf=G.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	margin: auto 0;
	width: 100%;
	max-width: 720px;
	background-image: var(--ha-panel-ornament);
	background-repeat: no-repeat;
	padding-top: 18px;

	${Cc} {
		gap: 9px;
		padding-top: 12px;

		/* The cards are the ones the game deals, at the size it deals them. On a short screen that is
		   more height than there is, so they come down rather than the screen scrolling for something
		   that ought to be taken in at a glance. */
		${ud} {
			width: 132px;
			height: 208px;
		}
	}
`,hf=G.div`
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 12px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);

	${Cc} {
		font-size: 10px;
	}
`,gf=G.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 100%;
	max-width: 460px;
`,_f=G.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	padding: 5px 9px;
	background: ${({$own:e})=>e?`var(--ha-accent-wash)`:`transparent`};
	border: 1px solid ${({$own:e})=>e?`var(--ha-accent)`:`var(--ha-rule)`};
	border-radius: var(--ha-panel-radius);
`,vf=G.span`
	display: flex;
	align-items: baseline;
	gap: 8px;
`,yf=G.span`
	font-size: 13px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
	white-space: nowrap;
`,bf=G.span`
	display: inline-flex;
	align-items: baseline;
	gap: 5px;
	font-family: var(--ha-face-data);
	font-size: 11px;
	font-variant-caps: all-small-caps;
	font-variant-numeric: tabular-nums;
	letter-spacing: var(--ha-track-label);
	white-space: nowrap;
	color: ${({$spent:e})=>e?`var(--ha-accent)`:`var(--ha-ink)`};
`,xf=G.p`
	margin: 0;
	max-width: 460px;
	text-align: center;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`,Sf=G.span`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
`,Cf=G.span`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 1px 7px;
	font-family: var(--ha-face-data);
	font-size: 10px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);
	border-left: 3px solid ${({$alignment:e})=>e===`friend`?`var(--ha-friend)`:`var(--ha-foe)`};
`,wf=G.i`
	font-style: normal;
	color: var(--ha-ink-faint);
`,Tf=G.span`
	display: inline-block;
	width: 4.2em;
	height: 0.95em;
	background: var(--ha-ink);
	opacity: 0.82;
`,Ef=G.h2`
	margin: 0;
	text-align: center;
	font-family: var(--ha-face);
	font-size: 20px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink);

	${Cc} {
		font-size: 15px;
	}
`,Df=G.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	justify-content: center;
	width: 100%;
`,Of=G.button.attrs(({active:e})=>({disabled:!e}))`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	min-width: 150px;
	padding: 9px 12px;
	font-family: var(--ha-face);
	font-size: 14px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	cursor: ${({active:e})=>e?`pointer`:`not-allowed`};
	color: ${({active:e})=>e?`var(--ha-control-ink)`:`var(--ha-control-ink-off)`};
	background: ${({active:e})=>e?`var(--ha-control-bg)`:`var(--ha-control-bg-off)`};
	border: ${({active:e})=>e?`var(--ha-control-edge)`:`var(--ha-control-edge-off)`};
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`,kf=G.span`
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	opacity: 0.75;
	max-width: 22ch;
	white-space: normal;
	text-align: left;
`,Af=G.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 14px 18px;
	text-align: center;
	max-width: 460px;
	border: 2px solid ${({$correct:e})=>e?`var(--ha-friend)`:`var(--ha-foe)`};
	background: ${({$correct:e})=>e?`color-mix(in srgb, var(--ha-friend) 14%, transparent)`:`color-mix(in srgb, var(--ha-foe) 14%, transparent)`};
`,jf=G.strong`
	font-family: var(--ha-face);
	font-size: 22px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: ${({$correct:e})=>e?`var(--ha-friend)`:`var(--ha-foe)`};

	${Cc} {
		font-size: 17px;
	}
`,Mf=G.span`
	font-size: 14px;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink);
`,Nf=G.span`
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-accent);
`,Pf=G.i`
	font-style: normal;
	font-family: var(--ha-face-data);
	font-size: 8.5px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`,Ff=G.div`
	position: relative;
	width: 45%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 20px;
	/* A colour, never a width: 1px in all three directions, so a cell's box within the board is
	   identical whichever one is on. skin.test.js asserts exactly that. */
	border: 1px solid var(--ha-well-edge);

	${({dimensional:e})=>{if(!e)return W`
			background: var(--ha-well);
		`}}
	${({dimensional:e})=>{if(e)return W`
			&:before {
				content: '';
				display: block;
				flex: none;
				padding-top: ${100/Jd}%;
			}
		`}}

	/* Stacked, the board gets the full width — which is what makes it usable with a thumb. */
	${xc} {
		width: 100%;
		max-width: 96vw;
		padding: 0;
		margin: 4px 0;
	}
`,If=G.div`
	position: relative;
	display: flex;
	flex-direction: row;
	margin-top: 4.7%;
	justify-content: center;

	${({dimensional:e})=>{if(e)return W`
			position: static;
			height: 0;
			margin: 0;
		`}}
`,Lf=({dimensional:e})=>{if(e)return W`
			background-image: none;
			/* A hairline where the rack ends, so the cementery below it reads as the shelf under
			   the rack rather than as the panel running out of content. */
			box-shadow: 0 1px 0 var(--ha-rule);
		`},Rf=G.div`
	display: var(--ha-mark-display);
	position: absolute;
	inset: 0;
	pointer-events: none;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: 0.1em;
	color: var(--ha-mark-ink);
	z-index: 2;
`,zf=G.span`
	position: absolute;
	transform: translate(-50%, -50%);
	white-space: nowrap;
`,Bf=G.span`
	position: absolute;
	transform: translateY(-50%);
	white-space: nowrap;
	padding-left: 34px;
	color: var(--ha-mark-ink);

	&::before {
		content: '';
		position: absolute;
		left: 4px;
		top: 50%;
		width: 26px;
		border-top: 1px solid var(--ha-mark-rule);
	}

	/* Both the bubble and the label sit on a break in the ground, which is what a drawing does with a
	   leader label: the line is interrupted rather than drawn through the text. Without it the label
	   is chalk over slate tiles and unreadable exactly where a piece is. */
	i {
		font-style: normal;
		display: inline-block;
		min-width: 15px;
		height: 15px;
		line-height: 14px;
		text-align: center;
		border: 1px solid var(--ha-mark-rule);
		border-radius: 50%;
		margin-right: 6px;
		background: var(--ha-ground);
	}

	b {
		font-weight: 400;
		padding: 1px 5px;
		background: var(--ha-ground);
	}
`,Vf=G.span`
	position: absolute;
	left: 4%;
	right: 4%;
	top: 2px;
	border-top: 1px solid var(--ha-mark-rule);
	text-align: center;

	&::before,
	&::after {
		content: '';
		position: absolute;
		top: -4px;
		width: 1px;
		height: 9px;
		background: var(--ha-mark-rule);
	}

	&::before {
		left: 0;
	}

	&::after {
		right: 0;
	}

	span {
		position: relative;
		top: -11px;
		padding: 0 6px;
		background: var(--ha-ground);
	}
`,Hf=G.div`
	position: relative;
	width: 100%;
	flex: 1;
	min-height: 0;
	background-image: url('img/hexgrid.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-bottom: 8px;

	${Lf}
`,Uf=G.span`
	position: absolute;
	top: -11px;
	left: 6px;
	z-index: 3;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 2px 10px 1px;
	font-family: var(--ha-face-data);
	font-size: 9px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	/* Dossier leaves these unset so the tab takes the team's own colour; the other two set them,
	   because there the frame is already carrying team identity. The fallback has to live here rather
	   than in the token: see the note in theme/tokens.js. */
	background: var(--ha-hq-label-bg, var(--ha-hq-team));
	color: var(--ha-hq-label-ink, var(--ha-hq-team-ink));
	border: var(--ha-hq-label-edge);
	border-radius: var(--ha-hq-label-radius);
	clip-path: var(--ha-hq-label-clip);
	box-shadow: var(--ha-hq-label-shadow);
	/* A label, never a target. The card below it is full of sockets a thumb has to reach. */
	pointer-events: none;
	white-space: nowrap;

	${Cc} {
		font-size: 8px;
		padding: 1px 6px;
		top: -9px;
	}
`,Wf=G.b`
	font-weight: 400;
	opacity: 0.72;
	font-variant-numeric: tabular-nums;
`,Gf=G.div`
	display: flex;
	align-items: center;
	gap: 6px;
	flex: none;
	height: 20px;
	margin-top: 3px;
	/* The rule the line hangs under. A colour, never a width — Blueprint is the one direction that
	   draws it, and it draws it dashed. */
	border-top: var(--ha-claim-rule);
`,Kf=G.span`
	flex: 1;
	min-width: 0;
	text-align: var(--ha-claim-align);
	font-family: var(--ha-face-data);
	font-size: 9px;
	line-height: 12px;
	letter-spacing: var(--ha-track-label);
	padding: 2px 0 1px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	${({$held:e,$flat:t})=>e?W`
			background: var(--ha-claim-bg);
			color: var(--ha-claim-ink);
			box-shadow: var(--ha-claim-frame);
			transform: rotate(var(--ha-claim-rotate));

			&::before {
				content: var(--ha-claim-key);
			}
		`:W`
		/* Over the 3D rack the card is smoked glass and the skin's own faint ink is right. On the flat
		   path the card is painted in a raw team colour and states its own ink — the same reason
		   pieceCount picks its colour from the card rather than from the tokens. */
		color: ${t?`inherit`:`var(--ha-ink-faint)`};

		&::before {
			content: var(--ha-claim-empty);
		}
	`}
`,qf=G(jc)`
	flex: none;
	font-size: 8px;
	letter-spacing: var(--ha-track-label);
	/* Fixed, so the three directions' different border widths cannot make three different heights out
	   of the row the rack is measured against. */
	height: 15px;
	line-height: 13px;
	padding: 0 6px;

	/* The tracking goes rather than the type: this is the one control on the card and 7px of it is not
	   a target. The statement beside it ellipsises instead — it is saying something the button is
	   already offering. */
	${Cc} {
		letter-spacing: 0;
		padding: 0 4px;
	}
`,Jf=G.b`
	font-weight: inherit;
	color: var(--ha-claim-holder-ink, inherit);
	border-bottom: var(--ha-claim-holder-rule);
`,Yf=G(jc)`
	cursor: ${({active:e})=>e?`pointer`:`not-allowed`};
`,Xf=G(Yf)`
	background: var(--ha-team-${({team:e})=>e});
	color: var(--ha-team-${({team:e})=>e}-ink);
	border: 1px solid var(--ha-team-${({team:e})=>e}-line);
	text-shadow: none;
`,Zf=`#445873`,Qf={plinth:`#1a222d`,plinthEdge:`#42546b`,centre:`#d8c188`};function $f(e){return{...Qf,...ln[e]||ln[en]}}var ep=[[0,3,3,6],[3,2,4,2,3],[3,4,3,0,4,3],[6,2,0,0,3,2,0],[3,4,3,0,4,3],[3,2,4,2,3],[0,3,3,6]],tp={0:`#a1abb7`,2:`#7e8c9c`,3:`#6d7d8f`,4:`#606d7d`,6:`#464f5b`};function np(e){return[1,3,5].map(t=>parseInt(e.slice(t,t+2),16))}function rp(e,t,n){let r=np(e),i=np(t);return`#${r.map((e,t)=>Math.round(e+(i[t]-e)*n).toString(16).padStart(2,`0`)).join(``)}`}function ip(e,t){let n=tp[(ep[e]||[])[t]||0]||tp[0];return{face:n,chamfer:rp(n,`#dce6f2`,.34),wall:rp(n,`#0b0f14`,.55)}}var ap={0:{body:`#3d3843`,rim:`#c7d2e3`,collar:`#14171d`},1:{body:`#4b0313`,rim:`#e23048`,collar:`#14171d`},2:{body:`#bfbcc6`,rim:`#2a2d35`,collar:`#2a2d35`},3:{body:`#3a2f00`,rim:`#e9bb1c`,collar:`#14171d`}},op={0:{deck:`#8d949f`,socket:`#5d646f`,frame:`#c8ccd3`},1:{deck:`#5e2028`,socket:`#3b1219`,frame:`#d0293f`},2:{deck:`#2a2d34`,socket:`#191b20`,frame:`#8f959f`},3:{deck:`#6b5a1c`,socket:`#463a10`,frame:`#e9bb1c`}},sp=`#ff3b30`,cp=[{color:`#1fbfae`,fade:.85},{color:`#ffc400`,fade:.9}],lp=e=>cp[Math.min(e,cp.length)-1],up=`#ffe9b0`,dp=`#ff2d20`,fp=`#ffd77a`,pp=`#000000`,mp=`#8fc0ff`,hp=`#e8eef7`,gp=`#161b24`,_p=G.div`
	position: relative;
	${({team:e})=>W`
	--ha-hq-team: var(--ha-team-${e});
	--ha-hq-team-ink: var(--ha-team-${e}-ink);
`}
	height: 50%;
	max-height: 223px;
	display: flex;
	flex-direction: column;
	border: 2px solid gray;
	padding: 8px;
	margin-bottom: 20px;
	justify-content: space-between;
	${({team:e})=>{switch(e){default:case`0`:return W`
				background-color: ${Yn[2]};
				color: #1b1e23;
			`;case`1`:return W`
				background-color: ${Yn[1]};
				color: white;
			`;case`2`:return W`
				background-color: ${Yn[0]};
				color: white;
			`;case`3`:return W`
				background-color: ${Yn[3]};
				color: #2b2410;
			`}}}
	${({dimensional:e,team:t})=>{if(e)return W`
			background-color: var(--ha-hq-glass);
			background-image: var(--ha-panel-texture);
			background-repeat: no-repeat;
			background-position: bottom;
			background-size: 100% 5px;
			/* The team colour stays on the frame, where it reads as identity. It comes from the
			   tray palette rather than the tokens because it has to match the rack the renderer
			   drew behind it, to the pixel. */
			border-color: ${op[t].frame};
			border-radius: var(--ha-panel-radius);
			color: var(--ha-ink);
			box-shadow: var(--ha-hq-inner);
		`}}

	${xc} {
		flex: 1 1 0;
		min-width: 0;
		height: auto;
		aspect-ratio: 1 / 1.08;
		max-height: none;
		margin-bottom: 8px;
		padding: 5px;
	}

	${Sc} {
		margin-bottom: 8px;
		padding: 5px;
	}
`,vp=G.img`
	position: absolute;
	/* touch-action: without it a touch drag scrolls the page instead of emitting pointermove,
	   so pieces cannot be dragged on a phone. user-drag stops the browser's own image drag. */
	touch-action: none;
	-webkit-user-drag: none;
	user-select: none;
	width: 92%;
	top: -43%;
	bottom: 0;
	left: -6%;
	right: 0;
	margin-left: 10%;
	margin-top: 13%;
	z-index: 2;
	cursor: pointer;
	transition: all 0.2s ease-in-out;

	&:hover {
		filter: brightness(1.5);
	}

	${({pieceId:e=``})=>{if(K.getTeam(e)===`2`)return W`
			filter: brightness(1.2);
		`}}
	${({selectedDirection:e})=>{if(e)return W`
			transform: rotate(${Qd(e)}deg);
		`}}
	${({selectedDirection:e})=>{if(!e)return W`
			width: 20%;
			margin: 0;
		`}}
	${({selectedDirection:e,pieceId:t})=>{if(!e&&t)switch(`${K.getType(t)}${K.getNumber(t)}`){case`A1`:return W`
					top: 44%;
					left: 3%;
				`;case`A2`:return W`
					top: 24.5%;
					left: 21.5%;
				`;case`A3`:return W`
					top: 6%;
					left: 40%;
				`;case`A4`:return W`
					top: 24.5%;
					left: 58%;
				`;case`A5`:return W`
					top: 44%;
					left: 76.5%;
				`;case`C`:return W`
					top: 44%;
					left: 40%;
				`;case`S`:return W`
					top: 63.5%;
					left: 21.5%;
				`;case`N`:return W`
					top: 63.5%;
					left: 58%;
				`}}}
	${({killed:e})=>{if(e)return W`
			position: relative;
			top: 0;
			left: 0;
			width: 50%;
			margin-right: 2px;
		`}}
	${({selected:e,highlight:t})=>{if(e||t)return W`
			filter: brightness(2);

			&:hover {
				filter: brightness(2);
			}
		`}}
	${({projected:e})=>{if(e)return W`
			position: absolute;
			right: auto;
			bottom: auto;
			margin: 0;
			opacity: 0;
			/* Not "all". The box itself is set from the projection, and a projection changes when
			   the window does — a phone rotating, a URL bar collapsing. Transitioning that would
			   animate the hit box, which is the one thing it must never do. */
			transition: filter 0.2s ease-in-out;
		`}}
`,yp=G.div`
	letter-spacing: -3px;
	display: flex;
	min-height: 43px;
	align-items: end;
	justify-content: flex-start;
	width: 100%;
	background: var(--ha-tally-bg);
	border-top: var(--ha-tally-edge);
	border-radius: var(--ha-panel-radius);
`;function bp({team:e,dimensional:t}){return t?`inherit`:e===`1`||e===`2`?`white`:`black`}var xp=G.span`
	display: flex;
	color: ${bp};
	flex-flow: column;
	align-items: center;
	flex-basis: 25%;
`;function Sp(e){return e===`1`||e===`2`?`2`:`0`}function Cp({type:e,team:t}){let n=`img/${Sp(t)}-${e}.png`;return(0,q.jsx)(vp,{src:n,killed:!0})}function wp(e,t,n,r){return n(e,t).filter(([,e])=>e!==0).map(([e,n])=>(0,q.jsxs)(xp,{id:`piece-count-${t}-${e}`,team:t,dimensional:r,children:[(0,q.jsx)(Cp,{type:e,team:t}),` x `,n]},`piece-count-${t}-${e}`))}function Tp(e){let[{pieces:t}]=(0,v.useContext)(Gs);return[t,(0,v.useCallback)(()=>Object.entries(K.getKilledPiecesByTeam(e,t)),[e,t])]}function Ep({team:e,dimensional:t}){let[n,r]=Tp(e);return(0,q.jsx)(yp,{children:wp(n,e,r,t)})}function Dp(e){let[{pieces:t}]=(0,v.useContext)(Gs);return[t,(0,v.useCallback)(()=>Object.entries(K.getSurvivorsForTeam(e,t)),[e,t])]}function Op({team:e}){let[t,n]=Dp(e);return(0,q.jsx)(yp,{children:wp(t,e,n)})}var kp=1e3,Ap=1001,jp=1002,Mp=1003,Np=1004,Pp=1005,Fp=1006,Ip=1007,Lp=1008,Rp=1009,zp=1010,Bp=1011,Vp=1012,Hp=1013,Up=1014,Wp=1015,Gp=1016,Kp=1017,qp=1018,Jp=1020,Yp=35902,Xp=35899,Zp=1021,Qp=1022,$p=1023,em=1026,tm=1027,nm=1028,rm=1029,im=1030,am=1031,om=1033,sm=33776,cm=33777,lm=33778,um=33779,dm=35840,fm=35841,pm=35842,mm=35843,hm=36196,gm=37492,_m=37496,vm=37488,ym=37489,bm=37490,xm=37491,Sm=37808,Cm=37809,wm=37810,Tm=37811,Em=37812,Dm=37813,Om=37814,km=37815,Am=37816,jm=37817,Mm=37818,Nm=37819,Pm=37820,Fm=37821,Im=36492,Lm=36494,Rm=36495,zm=36283,Bm=36284,Vm=36285,Hm=36286,Um=2300,Wm=2301,Gm=2302,Km=2303,qm=2400,Jm=2401,Ym=2402,Xm=3200,Zm=`srgb`,Qm=`srgb-linear`,$m=`linear`,eh=`srgb`,th=7680,nh=35044,rh=2e3;function ih(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ah(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function oh(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function sh(){let e=oh(`canvas`);return e.style.display=`block`,e}var ch={};function lh(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function uh(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Y(...e){e=uh(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function X(...e){e=uh(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function dh(...e){let t=e.join(` `);t in ch||(ch[t]=!0,Y(...e))}function fh(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var ph={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},mh=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},hh=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),gh=1234567,_h=Math.PI/180,vh=180/Math.PI;function yh(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(hh[e&255]+hh[e>>8&255]+hh[e>>16&255]+hh[e>>24&255]+`-`+hh[t&255]+hh[t>>8&255]+`-`+hh[t>>16&15|64]+hh[t>>24&255]+`-`+hh[n&63|128]+hh[n>>8&255]+`-`+hh[n>>16&255]+hh[n>>24&255]+hh[r&255]+hh[r>>8&255]+hh[r>>16&255]+hh[r>>24&255]).toLowerCase()}function bh(e,t,n){return Math.max(t,Math.min(n,e))}function xh(e,t){return(e%t+t)%t}function Sh(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Ch(e,t,n){return e===t?0:(n-e)/(t-e)}function wh(e,t,n){return(1-n)*e+n*t}function Th(e,t,n,r){return wh(e,t,1-Math.exp(-n*r))}function Eh(e,t=1){return t-Math.abs(xh(e,t*2)-t)}function Dh(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Oh(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function kh(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Ah(e,t){return e+Math.random()*(t-e)}function jh(e){return e*(.5-Math.random())}function Mh(e){e!==void 0&&(gh=e);let t=gh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nh(e){return e*_h}function Ph(e){return e*vh}function Fh(e){return!(e&e-1)&&e!==0}function Ih(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Lh(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Rh(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:Y(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function zh(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Bh(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Vh={DEG2RAD:_h,RAD2DEG:vh,generateUUID:yh,clamp:bh,euclideanModulo:xh,mapLinear:Sh,inverseLerp:Ch,lerp:wh,damp:Th,pingpong:Eh,smoothstep:Dh,smootherstep:Oh,randInt:kh,randFloat:Ah,randFloatSpread:jh,seededRandom:Mh,degToRad:Nh,radToDeg:Ph,isPowerOfTwo:Fh,ceilPowerOfTwo:Ih,floorPowerOfTwo:Lh,setQuaternionFromProperEuler:Rh,normalize:Bh,denormalize:zh},Z=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=bh(this.x,e.x,t.x),this.y=bh(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=bh(this.x,e,t),this.y=bh(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bh(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(bh(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Hh=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Y(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bh(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Q=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=bh(this.x,e.x,t.x),this.y=bh(this.y,e.y,t.y),this.z=bh(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=bh(this.x,e,t),this.y=bh(this.y,e,t),this.z=bh(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bh(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Uh.copy(this).projectOnVector(e),this.sub(Uh)}reflect(e){return this.sub(Uh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(bh(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Uh=new Q,Wh=new Hh,Gh=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return dh(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Kh.makeScale(e,t)),this}rotate(e){return dh(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Kh.makeRotation(-e)),this}translate(e,t){return dh(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Kh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Kh=new Gh,qh=new Gh().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jh=new Gh().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yh(){let e={enabled:!0,workingColorSpace:Qm,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Zh(e.r),e.g=Zh(e.g),e.b=Zh(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Qh(e.r),e.g=Qh(e.g),e.b=Qh(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?$m:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return dh(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return dh(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Qm]:{primaries:t,whitePoint:r,transfer:$m,toXYZ:qh,fromXYZ:Jh,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Zm},outputColorSpaceConfig:{drawingBufferColorSpace:Zm}},[Zm]:{primaries:t,whitePoint:r,transfer:eh,toXYZ:qh,fromXYZ:Jh,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Zm}}}),e}var Xh=Yh();function Zh(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Qh(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var $h,eg=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{$h===void 0&&($h=oh(`canvas`)),$h.width=e.width,$h.height=e.height;let t=$h.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=$h}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=oh(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Zh(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Zh(t[e]/255)*255):t[e]=Zh(t[e]);return{data:t,width:e.width,height:e.height}}return Y(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},tg=0,ng=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:tg++}),this.uuid=yh(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(rg(r[t].image)):e.push(rg(r[t]))}else e=rg(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function rg(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?eg.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Y(`Texture: Unable to serialize Texture.`),{})}var ig=0,ag=new Q,og=class e extends mh{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=Ap,i=Ap,a=Fp,o=Lp,s=$p,c=Rp,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ig++}),this.uuid=yh(),this.name=``,this.source=new ng(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new Z(0,0),this.repeat=new Z(1,1),this.center=new Z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gh,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ag).x}get height(){return this.source.getSize(ag).y}get depth(){return this.source.getSize(ag).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Y(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case kp:e.x-=Math.floor(e.x);break;case Ap:e.x=e.x<0?0:1;break;case jp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case kp:e.y-=Math.floor(e.y);break;case Ap:e.y=e.y<0?0:1;break;case jp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};og.DEFAULT_IMAGE=null,og.DEFAULT_MAPPING=300,og.DEFAULT_ANISOTROPY=1;var sg=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=bh(this.x,e.x,t.x),this.y=bh(this.y,e.y,t.y),this.z=bh(this.z,e.z,t.z),this.w=bh(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=bh(this.x,e,t),this.y=bh(this.y,e,t),this.z=bh(this.z,e,t),this.w=bh(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bh(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cg=class extends mh{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fp,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new sg(0,0,e,t),this.scissorTest=!1,this.viewport=new sg(0,0,e,t),this.textures=[];let r=new og({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Fp,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new ng(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},lg=class extends cg{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ug=class extends og{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mp,this.minFilter=Mp,this.wrapR=Ap,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},dg=class extends og{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Mp,this.minFilter=Mp,this.wrapR=Ap,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},fg=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/pg.setFromMatrixColumn(e,0).length(),i=1/pg.setFromMatrixColumn(e,1).length(),a=1/pg.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hg,e,gg)}lookAt(e,t,n){let r=this.elements;return yg.subVectors(e,t),yg.lengthSq()===0&&(yg.z=1),yg.normalize(),_g.crossVectors(n,yg),_g.lengthSq()===0&&(Math.abs(n.z)===1?yg.x+=1e-4:yg.z+=1e-4,yg.normalize(),_g.crossVectors(n,yg)),_g.normalize(),vg.crossVectors(yg,_g),r[0]=_g.x,r[4]=vg.x,r[8]=yg.x,r[1]=_g.y,r[5]=vg.y,r[9]=yg.y,r[2]=_g.z,r[6]=vg.z,r[10]=yg.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=pg.set(r[0],r[1],r[2]).length(),o=pg.set(r[4],r[5],r[6]).length(),s=pg.set(r[8],r[9],r[10]).length();i<0&&(a=-a),mg.copy(this);let c=1/a,l=1/o,u=1/s;return mg.elements[0]*=c,mg.elements[1]*=c,mg.elements[2]*=c,mg.elements[4]*=l,mg.elements[5]*=l,mg.elements[6]*=l,mg.elements[8]*=u,mg.elements[9]*=u,mg.elements[10]*=u,t.setFromRotationMatrix(mg),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=rh,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=rh,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},pg=new Q,mg=new fg,hg=new Q(0,0,0),gg=new Q(1,1,1),_g=new Q,vg=new Q,yg=new Q,bg=new fg,xg=new Hh,Sg=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(bh(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-bh(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(bh(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-bh(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(bh(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-bh(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Y(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bg,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xg.setFromEuler(this),this.setFromQuaternion(xg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sg.DEFAULT_ORDER=`XYZ`;var Cg=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},wg=0,Tg=new Q,Eg=new Hh,Dg=new fg,Og=new Q,kg=new Q,Ag=new Q,jg=new Hh,Mg=new Q(1,0,0),Ng=new Q(0,1,0),Pg=new Q(0,0,1),Fg={type:`added`},Ig={type:`removed`},Lg={type:`childadded`,child:null},Rg={type:`childremoved`,child:null},zg=class e extends mh{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wg++}),this.uuid=yh(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Q,n=new Sg,r=new Hh,i=new Q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fg},normalMatrix:{value:new Gh}}),this.matrix=new fg,this.matrixWorld=new fg,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Eg.setFromAxisAngle(e,t),this.quaternion.multiply(Eg),this}rotateOnWorldAxis(e,t){return Eg.setFromAxisAngle(e,t),this.quaternion.premultiply(Eg),this}rotateX(e){return this.rotateOnAxis(Mg,e)}rotateY(e){return this.rotateOnAxis(Ng,e)}rotateZ(e){return this.rotateOnAxis(Pg,e)}translateOnAxis(e,t){return Tg.copy(e).applyQuaternion(this.quaternion),this.position.add(Tg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mg,e)}translateY(e){return this.translateOnAxis(Ng,e)}translateZ(e){return this.translateOnAxis(Pg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dg.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Og.copy(e):Og.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),kg.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dg.lookAt(kg,Og,this.up):Dg.lookAt(Og,kg,this.up),this.quaternion.setFromRotationMatrix(Dg),r&&(Dg.extractRotation(r.matrixWorld),Eg.setFromRotationMatrix(Dg),this.quaternion.premultiply(Eg.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(X(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fg),Lg.child=e,this.dispatchEvent(Lg),Lg.child=null):X(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ig),Rg.child=e,this.dispatchEvent(Rg),Rg.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dg.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dg.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dg),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fg),Lg.child=e,this.dispatchEvent(Lg),Lg.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kg,e,Ag),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kg,jg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material);if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};zg.DEFAULT_UP=new Q(0,1,0),zg.DEFAULT_MATRIX_AUTO_UPDATE=!0,zg.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bg=class extends zg{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Vg={type:`move`},Hg=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bg,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bg,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bg,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vg)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Bg;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ug={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wg={h:0,s:0,l:0},Gg={h:0,s:0,l:0};function Kg(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var qg=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zm){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xh.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Xh.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xh.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Xh.workingColorSpace){if(e=xh(e,1),t=bh(t,0,1),n=bh(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Kg(i,r,e+1/3),this.g=Kg(i,r,e),this.b=Kg(i,r,e-1/3)}return Xh.colorSpaceToWorking(this,r),this}setStyle(e,t=Zm){function n(t){t!==void 0&&parseFloat(t)<1&&Y(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Y(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Y(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zm){let n=Ug[e.toLowerCase()];return n===void 0?Y(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zh(e.r),this.g=Zh(e.g),this.b=Zh(e.b),this}copyLinearToSRGB(e){return this.r=Qh(e.r),this.g=Qh(e.g),this.b=Qh(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zm){return Xh.workingToColorSpace(Jg.copy(this),e),Math.round(bh(Jg.r*255,0,255))*65536+Math.round(bh(Jg.g*255,0,255))*256+Math.round(bh(Jg.b*255,0,255))}getHexString(e=Zm){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xh.workingColorSpace){Xh.workingToColorSpace(Jg.copy(this),t);let n=Jg.r,r=Jg.g,i=Jg.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Xh.workingColorSpace){return Xh.workingToColorSpace(Jg.copy(this),t),e.r=Jg.r,e.g=Jg.g,e.b=Jg.b,e}getStyle(e=Zm){Xh.workingToColorSpace(Jg.copy(this),e);let t=Jg.r,n=Jg.g,r=Jg.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Wg),this.setHSL(Wg.h+e,Wg.s+t,Wg.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wg),e.getHSL(Gg);let n=wh(Wg.h,Gg.h,t),r=wh(Wg.s,Gg.s,t),i=wh(Wg.l,Gg.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Jg=new qg;qg.NAMES=Ug;var Yg=class extends zg{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sg,this.environmentIntensity=1,this.environmentRotation=new Sg,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Xg=new Q,Zg=new Q,Qg=new Q,$g=new Q,e_=new Q,t_=new Q,n_=new Q,r_=new Q,i_=new Q,a_=new Q,o_=new sg,s_=new sg,c_=new sg,l_=class e{constructor(e=new Q,t=new Q,n=new Q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Xg.subVectors(e,t),r.cross(Xg);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Xg.subVectors(r,t),Zg.subVectors(n,t),Qg.subVectors(e,t);let a=Xg.dot(Xg),o=Xg.dot(Zg),s=Xg.dot(Qg),c=Zg.dot(Zg),l=Zg.dot(Qg),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,$g)!==null&&$g.x>=0&&$g.y>=0&&$g.x+$g.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,$g)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,$g.x),s.addScaledVector(a,$g.y),s.addScaledVector(o,$g.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return o_.setScalar(0),s_.setScalar(0),c_.setScalar(0),o_.fromBufferAttribute(e,t),s_.fromBufferAttribute(e,n),c_.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(o_,i.x),a.addScaledVector(s_,i.y),a.addScaledVector(c_,i.z),a}static isFrontFacing(e,t,n,r){return Xg.subVectors(n,t),Zg.subVectors(e,t),Xg.cross(Zg).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xg.subVectors(this.c,this.b),Zg.subVectors(this.a,this.b),Xg.cross(Zg).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;e_.subVectors(r,n),t_.subVectors(i,n),r_.subVectors(e,n);let s=e_.dot(r_),c=t_.dot(r_);if(s<=0&&c<=0)return t.copy(n);i_.subVectors(e,r);let l=e_.dot(i_),u=t_.dot(i_);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(e_,a);a_.subVectors(e,i);let f=e_.dot(a_),p=t_.dot(a_);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(t_,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return n_.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(n_,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(e_,a).addScaledVector(t_,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},u_=class{constructor(e=new Q(1/0,1/0,1/0),t=new Q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(f_.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(f_.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=f_.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,f_):f_.fromBufferAttribute(r,t),f_.applyMatrix4(e.matrixWorld),this.expandByPoint(f_);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),p_.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),p_.copy(e.boundingBox)),p_.applyMatrix4(e.matrixWorld),this.union(p_)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,f_),f_.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(b_),x_.subVectors(this.max,b_),m_.subVectors(e.a,b_),h_.subVectors(e.b,b_),g_.subVectors(e.c,b_),__.subVectors(h_,m_),v_.subVectors(g_,h_),y_.subVectors(m_,g_);let t=[0,-__.z,__.y,0,-v_.z,v_.y,0,-y_.z,y_.y,__.z,0,-__.x,v_.z,0,-v_.x,y_.z,0,-y_.x,-__.y,__.x,0,-v_.y,v_.x,0,-y_.y,y_.x,0];return!w_(t,m_,h_,g_,x_)||(t=[1,0,0,0,1,0,0,0,1],!w_(t,m_,h_,g_,x_))?!1:(S_.crossVectors(__,v_),t=[S_.x,S_.y,S_.z],w_(t,m_,h_,g_,x_))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,f_).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(f_).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(d_[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),d_[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),d_[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),d_[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),d_[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),d_[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),d_[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),d_[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(d_),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},d_=[new Q,new Q,new Q,new Q,new Q,new Q,new Q,new Q],f_=new Q,p_=new u_,m_=new Q,h_=new Q,g_=new Q,__=new Q,v_=new Q,y_=new Q,b_=new Q,x_=new Q,S_=new Q,C_=new Q;function w_(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){C_.fromArray(e,a);let o=i.x*Math.abs(C_.x)+i.y*Math.abs(C_.y)+i.z*Math.abs(C_.z),s=t.dot(C_),c=n.dot(C_),l=r.dot(C_);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var T_=new Q,E_=new Z,D_=0,O_=class extends mh{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:D_++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=nh,this.updateRanges=[],this.gpuType=Wp,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)E_.fromBufferAttribute(this,t),E_.applyMatrix3(e),this.setXY(t,E_.x,E_.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)T_.fromBufferAttribute(this,t),T_.applyMatrix3(e),this.setXYZ(t,T_.x,T_.y,T_.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)T_.fromBufferAttribute(this,t),T_.applyMatrix4(e),this.setXYZ(t,T_.x,T_.y,T_.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)T_.fromBufferAttribute(this,t),T_.applyNormalMatrix(e),this.setXYZ(t,T_.x,T_.y,T_.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)T_.fromBufferAttribute(this,t),T_.transformDirection(e),this.setXYZ(t,T_.x,T_.y,T_.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=zh(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Bh(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zh(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bh(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zh(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bh(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zh(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bh(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zh(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bh(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Bh(t,this.array),n=Bh(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Bh(t,this.array),n=Bh(n,this.array),r=Bh(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Bh(t,this.array),n=Bh(n,this.array),r=Bh(r,this.array),i=Bh(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},k_=class extends O_{constructor(e,t,n){super(new Uint16Array(e),t,n)}},A_=class extends O_{constructor(e,t,n){super(new Uint32Array(e),t,n)}},j_=class extends O_{constructor(e,t,n){super(new Float32Array(e),t,n)}},M_=new u_,N_=new Q,P_=new Q,F_=class{constructor(e=new Q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?M_.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;N_.subVectors(e,this.center);let t=N_.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(N_,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(P_.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(N_.copy(e.center).add(P_)),this.expandByPoint(N_.copy(e.center).sub(P_))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},I_=0,L_=new fg,R_=new zg,z_=new Q,B_=new u_,V_=new u_,H_=new Q,U_=class e extends mh{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:I_++}),this.uuid=yh(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(ih(e)?A_:k_)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Gh().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return L_.makeRotationFromQuaternion(e),this.applyMatrix4(L_),this}rotateX(e){return L_.makeRotationX(e),this.applyMatrix4(L_),this}rotateY(e){return L_.makeRotationY(e),this.applyMatrix4(L_),this}rotateZ(e){return L_.makeRotationZ(e),this.applyMatrix4(L_),this}translate(e,t,n){return L_.makeTranslation(e,t,n),this.applyMatrix4(L_),this}scale(e,t,n){return L_.makeScale(e,t,n),this.applyMatrix4(L_),this}lookAt(e){return R_.lookAt(e),R_.updateMatrix(),this.applyMatrix4(R_.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(z_).negate(),this.translate(z_.x,z_.y,z_.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new j_(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Y(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new u_);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){X(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Q(-1/0,-1/0,-1/0),new Q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];B_.setFromBufferAttribute(n),this.morphTargetsRelative?(H_.addVectors(this.boundingBox.min,B_.min),this.boundingBox.expandByPoint(H_),H_.addVectors(this.boundingBox.max,B_.max),this.boundingBox.expandByPoint(H_)):(this.boundingBox.expandByPoint(B_.min),this.boundingBox.expandByPoint(B_.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&X(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new F_);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){X(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Q,1/0);return}if(e){let n=this.boundingSphere.center;if(B_.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];V_.setFromBufferAttribute(n),this.morphTargetsRelative?(H_.addVectors(B_.min,V_.min),B_.expandByPoint(H_),H_.addVectors(B_.max,V_.max),B_.expandByPoint(H_)):(B_.expandByPoint(V_.min),B_.expandByPoint(V_.max))}B_.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)H_.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(H_));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)H_.fromBufferAttribute(a,t),o&&(z_.fromBufferAttribute(e,t),H_.add(z_)),r=Math.max(r,n.distanceToSquared(H_))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&X(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){X(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new O_(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Q,s[e]=new Q;let c=new Q,l=new Q,u=new Q,d=new Z,f=new Z,p=new Z,m=new Q,h=new Q;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Q,y=new Q,b=new Q,x=new Q;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new O_(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Q,i=new Q,a=new Q,o=new Q,s=new Q,c=new Q,l=new Q,u=new Q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)H_.fromBufferAttribute(e,t),H_.normalize(),e.setXYZ(t,H_.x,H_.y,H_.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new O_(a,r,i)}if(this.index===null)return Y(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},W_=0,G_=class extends mh{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:W_++}),this.uuid=yh(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qg(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=th,this.stencilZFail=th,this.stencilZPass=th,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Y(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qg().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new Z().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Z().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},K_=new Q,q_=new Q,J_=new Q,Y_=new Q,X_=new Q,Z_=new Q,Q_=new Q,$_=class{constructor(e=new Q,t=new Q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,K_)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=K_.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(K_.copy(this.origin).addScaledVector(this.direction,t),K_.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){q_.copy(e).add(t).multiplyScalar(.5),J_.copy(t).sub(e).normalize(),Y_.copy(this.origin).sub(q_);let i=e.distanceTo(t)*.5,a=-this.direction.dot(J_),o=Y_.dot(this.direction),s=-Y_.dot(J_),c=Y_.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0)if(u=a*s-o,d=a*o-s,p=i*l,u>=0)if(d>=-p)if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c);else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(q_).addScaledVector(J_,d),f}intersectSphere(e,t){K_.subVectors(e.center,this.origin);let n=K_.dot(this.direction),r=K_.dot(K_)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,K_)!==null}intersectTriangle(e,t,n,r,i){X_.subVectors(t,e),Z_.subVectors(n,e),Q_.crossVectors(X_,Z_);let a=this.direction.dot(Q_),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Y_.subVectors(this.origin,e);let s=o*this.direction.dot(Z_.crossVectors(Y_,Z_));if(s<0)return null;let c=o*this.direction.dot(X_.cross(Y_));if(c<0||s+c>a)return null;let l=-o*Y_.dot(Q_);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ev=class extends G_{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new qg(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sg,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},tv=new fg,nv=new $_,rv=new F_,iv=new Q,av=new Q,ov=new Q,sv=new Q,cv=new Q,lv=new Q,uv=new Q,dv=new Q,fv=class extends zg{constructor(e=new U_,t=new ev){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){lv.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(cv.fromBufferAttribute(s,e),a?lv.addScaledVector(cv,r):lv.addScaledVector(cv.sub(t),r))}t.add(lv)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),rv.copy(n.boundingSphere),rv.applyMatrix4(i),nv.copy(e.ray).recast(e.near),!(rv.containsPoint(nv.origin)===!1&&(nv.intersectSphere(rv,iv)===null||nv.origin.distanceToSquared(iv)>(e.far-e.near)**2))&&(tv.copy(i).invert(),nv.copy(e.ray).applyMatrix4(tv),(n.boundingBox===null||nv.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,nv)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null)if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=mv(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=mv(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(s!==void 0)if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=mv(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=mv(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}};function pv(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;dv.copy(s),dv.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(dv);return l<n.near||l>n.far?null:{distance:l,point:dv.clone(),object:e}}function mv(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,av),e.getVertexPosition(c,ov),e.getVertexPosition(l,sv);let u=pv(e,t,n,r,av,ov,sv,uv);if(u){let e=new Q;l_.getBarycoord(uv,av,ov,sv,e),i&&(u.uv=l_.getInterpolatedAttribute(i,s,c,l,e,new Z)),a&&(u.uv1=l_.getInterpolatedAttribute(a,s,c,l,e,new Z)),o&&(u.normal=l_.getInterpolatedAttribute(o,s,c,l,e,new Q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Q,materialIndex:0};l_.getNormal(av,ov,sv,t.normal),u.face=t,u.barycoord=e}return u}var hv=class extends og{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Mp,l=Mp,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},gv=new Q,_v=new Q,vv=new Gh,yv=class{constructor(e=new Q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=gv.subVectors(n,t).cross(_v.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(gv),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vv.getNormalMatrix(e),r=this.coplanarPoint(gv).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},bv=new F_,xv=new Z(.5,.5),Sv=new Q,Cv=class{constructor(e=new yv,t=new yv,n=new yv,r=new yv,i=new yv,a=new yv){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=rh,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bv.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bv.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bv)}intersectsSprite(e){return bv.center.set(0,0,0),bv.radius=.7071067811865476+xv.distanceTo(e.center),bv.applyMatrix4(e.matrixWorld),this.intersectsSphere(bv)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Sv.x=r.normal.x>0?e.max.x:e.min.x,Sv.y=r.normal.y>0?e.max.y:e.min.y,Sv.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Sv)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},wv=class extends og{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Tv=class extends og{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ev=class extends og{constructor(e,t,n=Up,r,i,a,o=Mp,s=Mp,c,l=em,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ng(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Dv=class extends Ev{constructor(e,t=Up,n=301,r,i,a=Mp,o=Mp,s,c=em){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ov=class extends og{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},kv=class e extends U_{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new j_(c,3)),this.setAttribute(`normal`,new j_(l,3)),this.setAttribute(`uv`,new j_(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Q;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Av=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Y(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new Z:new Q);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new Q,r=[],i=[],a=[],o=new Q,s=new fg;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new Q)}i[0]=new Q,a[0]=new Q;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(bh(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(bh(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},jv=class extends Av{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new Z){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Mv=class extends jv{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Nv(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Pv=new Q,Fv=new Q,Iv=new Nv,Lv=new Nv,Rv=new Nv,zv=class extends Av{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new Q){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Fv.subVectors(r[0],r[1]).add(r[0]),c=Fv);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Pv.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Pv),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Iv.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Lv.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Rv.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Iv.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Lv.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Rv.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Iv.calc(s),Lv.calc(s),Rv.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new Q().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Bv(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Vv(e,t){let n=1-e;return n*n*t}function Hv(e,t){return 2*(1-e)*e*t}function Uv(e,t){return e*e*t}function Wv(e,t,n,r){return Vv(e,t)+Hv(e,n)+Uv(e,r)}function Gv(e,t){let n=1-e;return n*n*n*t}function Kv(e,t){let n=1-e;return 3*n*n*e*t}function qv(e,t){return 3*(1-e)*e*e*t}function Jv(e,t){return e*e*e*t}function Yv(e,t,n,r,i){return Gv(e,t)+Kv(e,n)+qv(e,r)+Jv(e,i)}var Xv=class extends Av{constructor(e=new Z,t=new Z,n=new Z,r=new Z){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new Z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Yv(e,r.x,i.x,a.x,o.x),Yv(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Zv=class extends Av{constructor(e=new Q,t=new Q,n=new Q,r=new Q){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new Q){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Yv(e,r.x,i.x,a.x,o.x),Yv(e,r.y,i.y,a.y,o.y),Yv(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qv=class extends Av{constructor(e=new Z,t=new Z){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new Z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$v=class extends Av{constructor(e=new Q,t=new Q){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new Q){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Q){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ey=class extends Av{constructor(e=new Z,t=new Z,n=new Z){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Wv(e,r.x,i.x,a.x),Wv(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ty=class extends Av{constructor(e=new Q,t=new Q,n=new Q){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Q){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Wv(e,r.x,i.x,a.x),Wv(e,r.y,i.y,a.y),Wv(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ny=class extends Av{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new Z){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Bv(o,s.x,c.x,l.x,u.x),Bv(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new Z().fromArray(n))}return this}},ry=Object.freeze({__proto__:null,ArcCurve:Mv,CatmullRomCurve3:zv,CubicBezierCurve:Xv,CubicBezierCurve3:Zv,EllipseCurve:jv,LineCurve:Qv,LineCurve3:$v,QuadraticBezierCurve:ey,QuadraticBezierCurve3:ty,SplineCurve:ny}),iy=class extends Av{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ry[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ry[n.type]().fromJSON(n))}return this}},ay=class extends iy{constructor(e){super(),this.type=`Path`,this.currentPoint=new Z,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Qv(this.currentPoint.clone(),new Z(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ey(this.currentPoint.clone(),new Z(e,t),new Z(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Xv(this.currentPoint.clone(),new Z(e,t),new Z(n,r),new Z(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new ny([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new jv(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},oy=class extends ay{constructor(e){super(e),this.uuid=yh(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ay().fromJSON(n))}return this}};function sy(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=cy(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=hy(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return uy(a,o,n,s,c,l,0),o}function cy(e,t,n,r,i){let a;if(i===zy(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Iy(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Iy(i/r|0,e[i],e[i+1],a);return a&&Oy(a,a.next)&&(Ly(a),a=a.next),a}function ly(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Oy(n,n.next)||Dy(n.prev,n,n.next)===0)){if(Ly(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function uy(e,t,n,r,i,a,o){if(!e)return;!o&&a&&by(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?fy(e,r,i,a):dy(e)){t.push(c.i,e.i,l.i),Ly(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=py(ly(e),t),uy(e,t,n,r,i,a,2)):o===2&&my(e,t,n,r,i,a):uy(ly(e),t,n,r,i,a,1);break}}}function dy(e){let t=e.prev,n=e,r=e.next;if(Dy(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Ty(i,s,a,c,o,l,m.x,m.y)&&Dy(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function fy(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Dy(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Sy(p,m,t,n,r),v=Sy(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ty(s,u,c,d,l,f,y.x,y.y)&&Dy(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ty(s,u,c,d,l,f,b.x,b.y)&&Dy(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ty(s,u,c,d,l,f,y.x,y.y)&&Dy(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ty(s,u,c,d,l,f,b.x,b.y)&&Dy(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function py(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Oy(r,i)&&ky(r,n,n.next,i)&&Ny(r,i)&&Ny(i,r)&&(t.push(r.i,n.i,i.i),Ly(n),Ly(n.next),n=e=i),n=n.next}while(n!==e);return ly(n)}function my(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Ey(o,e)){let s=Fy(o,e);o=ly(o,o.next),s=ly(s,s.next),uy(o,t,n,r,i,a,0),uy(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function hy(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=cy(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Cy(o))}i.sort(gy);for(let e=0;e<i.length;e++)n=_y(i[e],n);return n}function gy(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function _y(e,t){let n=vy(e,t);if(!n)return t;let r=Fy(n,e);return ly(r,r.next),ly(n,n.next)}function vy(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Oy(e,n))return n;do{if(Oy(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&wy(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Ny(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&yy(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function yy(e,t){return Dy(e.prev,e,t.prev)<0&&Dy(t.next,e,e.next)<0}function by(e,t,n,r){let i=e;do i.z===0&&(i.z=Sy(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,xy(i)}function xy(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Sy(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Cy(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function wy(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Ty(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&wy(e,t,n,r,i,a,o,s)}function Ey(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!My(e,t)&&(Ny(e,t)&&Ny(t,e)&&Py(e,t)&&(Dy(e.prev,e,t.prev)||Dy(e,t.prev,t))||Oy(e,t)&&Dy(e.prev,e,e.next)>0&&Dy(t.prev,t,t.next)>0)}function Dy(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Oy(e,t){return e.x===t.x&&e.y===t.y}function ky(e,t,n,r){let i=jy(Dy(e,t,n)),a=jy(Dy(e,t,r)),o=jy(Dy(n,r,e)),s=jy(Dy(n,r,t));return!!(i!==a&&o!==s||i===0&&Ay(e,n,t)||a===0&&Ay(e,r,t)||o===0&&Ay(n,e,r)||s===0&&Ay(n,t,r))}function Ay(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function jy(e){return e>0?1:e<0?-1:0}function My(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&ky(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Ny(e,t){return Dy(e.prev,e,e.next)<0?Dy(e,t,e.next)>=0&&Dy(e,e.prev,t)>=0:Dy(e,t,e.prev)<0||Dy(e,e.next,t)<0}function Py(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Fy(e,t){let n=Ry(e.i,e.x,e.y),r=Ry(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Iy(e,t,n,r){let i=Ry(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Ly(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ry(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function zy(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var By=class{static triangulate(e,t,n=2){return sy(e,t,n)}},Vy=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Hy(e),Uy(n,e);let a=e.length;t.forEach(Hy);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Uy(n,t[e]);let o=By.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Hy(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Uy(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Wy=class e extends U_{constructor(e=new oy([new Z(.5,.5),new Z(-.5,.5),new Z(-.5,-.5),new Z(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new j_(r,3)),this.setAttribute(`uv`,new j_(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Gy:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new Q,b=new Q,x=new Q}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Vy.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Vy.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));if(s<=10000000000000001e-36*c*c){e.splice(r,1),n--;continue}t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||X(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new Z(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new Z(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,P=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),P=P.concat(N)}let F;if(p===0)F=Vy.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);L(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);L(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}F=Vy.triangulateShape(e,t)}let I=F.length,ee=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],P[e],ee):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),L(x.x,x.y,x.z)):L(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],P[t],ee):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),L(x.x,x.y,x.z)):L(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);L(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?L(i.x,i.y+g[s-1].y,g[s-1].x+n):L(i.x,i.y,c+n)}}}te(),ne();function te(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<I;e++){let n=F[e];R(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<I;e++){let n=F[e];R(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<I;e++){let t=F[e];R(t[2],t[1],t[0])}for(let e=0;e<I;e++){let t=F[e];R(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function ne(){let e=r.length/3,t=0;re(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];re(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function re(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);z(t+r+n,t+i+n,t+i+a,t+r+a)}}}function L(e,t,n){a.push(e),a.push(t),a.push(n)}function R(e,t,i){ie(e),ie(t),ie(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ae(o[0]),ae(o[1]),ae(o[2])}function z(e,t,i,a){ie(e),ie(t),ie(a),ie(t),ie(i),ie(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ae(s[0]),ae(s[1]),ae(s[3]),ae(s[1]),ae(s[2]),ae(s[3])}function ie(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ae(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ky(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new ry[i.type]().fromJSON(i)),new e(r,t.options)}},Gy={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new Z(a,o),new Z(s,c),new Z(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new Z(o,1-c),new Z(l,1-d),new Z(f,1-m),new Z(h,1-_)]:[new Z(s,1-c),new Z(u,1-d),new Z(p,1-m),new Z(g,1-_)]}};function Ky(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var qy=class e extends U_{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new j_(p,3)),this.setAttribute(`normal`,new j_(m,3)),this.setAttribute(`uv`,new j_(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Jy=class e extends U_{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new Q,p=new Z;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new j_(s,3)),this.setAttribute(`normal`,new j_(c,3)),this.setAttribute(`uv`,new j_(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};function Yy(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Zy(i))i.isRenderTargetTexture?(Y(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i))if(Zy(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice();else t[n][r]=i}}return t}function Xy(e){let t={};for(let n=0;n<e.length;n++){let r=Yy(e[n]);for(let e in r)t[e]=r[e]}return t}function Zy(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Qy(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function $y(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Xh.workingColorSpace}var eb={clone:Yy,merge:Xy},tb=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,rb=class extends G_{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tb,this.fragmentShader=nb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yy(e.uniforms),this.uniformsGroups=Qy(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new qg().setHex(r.value);break;case`v2`:this.uniforms[n].value=new Z().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Q().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new sg().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Gh().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new fg().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ib=class extends rb{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},ab=class extends G_{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new qg(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qg(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sg,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ob=class extends G_{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Xm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sb=class extends G_{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function cb(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var lb=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},ub=class extends lb{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qm,endingEnd:qm}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Jm:i=e,o=2*t-n;break;case Ym:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Jm:a=e,s=2*n-t;break;case Ym:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},db=class extends lb{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},fb=class extends lb{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},pb=class extends lb{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},mb=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=cb(t,this.TimeBufferType),this.values=cb(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:cb(e.times,Array),values:cb(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new fb(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new db(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ub(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new pb(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Um:t=this.InterpolantFactoryMethodDiscrete;break;case Wm:t=this.InterpolantFactoryMethodLinear;break;case Gm:t=this.InterpolantFactoryMethodSmooth;break;case Km:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t);return Y(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Um;case this.InterpolantFactoryMethodLinear:return Wm;case this.InterpolantFactoryMethodSmooth:return Gm;case this.InterpolantFactoryMethodBezier:return Km}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(X(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(X(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){X(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){X(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ah(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){X(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Gm,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0]))if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};mb.prototype.ValueTypeName=``,mb.prototype.TimeBufferType=Float32Array,mb.prototype.ValueBufferType=Float32Array,mb.prototype.DefaultInterpolation=Wm;var hb=class extends mb{constructor(e,t,n){super(e,t,n)}};hb.prototype.ValueTypeName=`bool`,hb.prototype.ValueBufferType=Array,hb.prototype.DefaultInterpolation=Um,hb.prototype.InterpolantFactoryMethodLinear=void 0,hb.prototype.InterpolantFactoryMethodSmooth=void 0;var gb=class extends mb{constructor(e,t,n,r){super(e,t,n,r)}};gb.prototype.ValueTypeName=`color`;var _b=class extends mb{constructor(e,t,n,r){super(e,t,n,r)}};_b.prototype.ValueTypeName=`number`;var vb=class extends lb{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Hh.slerpFlat(i,0,a,c-o,a,c,s);return i}},yb=class extends mb{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new vb(this.times,this.values,this.getValueSize(),e)}};yb.prototype.ValueTypeName=`quaternion`,yb.prototype.InterpolantFactoryMethodSmooth=void 0;var bb=class extends mb{constructor(e,t,n){super(e,t,n)}};bb.prototype.ValueTypeName=`string`,bb.prototype.ValueBufferType=Array,bb.prototype.DefaultInterpolation=Um,bb.prototype.InterpolantFactoryMethodLinear=void 0,bb.prototype.InterpolantFactoryMethodSmooth=void 0;var xb=class extends mb{constructor(e,t,n,r){super(e,t,n,r)}};xb.prototype.ValueTypeName=`vector`;var Sb={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Cb(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Cb(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Cb(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var wb=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Tb=class{constructor(e){this.manager=e===void 0?wb:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Tb.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Eb=new WeakMap,Db=class extends Tb{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Sb.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Eb.get(a);e===void 0&&(e=[],Eb.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=oh(`img`);function s(){l(),t&&t(this);let n=Eb.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Eb.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Sb.remove(`image:${e}`);let n=Eb.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Eb.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Sb.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Ob=class extends Tb{constructor(e){super(e)}load(e,t,n,r){let i=new og,a=new Db(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},kb=class extends zg{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new qg(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Ab=class extends kb{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(zg.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qg(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},jb=new fg,Mb=new Q,Nb=new Q,Pb=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Z(512,512),this.mapType=Rp,this.map=null,this.mapPass=null,this.matrix=new fg,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cv,this._frameExtents=new Z(1,1),this._viewportCount=1,this._viewports=[new sg(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Mb.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mb),Nb.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nb),t.updateMatrixWorld(),jb.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jb,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(jb)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Fb=new Q,Ib=new Hh,Lb=new Q,Rb=class extends zg{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new fg,this.projectionMatrix=new fg,this.projectionMatrixInverse=new fg,this.coordinateSystem=rh,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Fb,Ib,Lb),Lb.x===1&&Lb.y===1&&Lb.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fb,Ib,Lb.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Fb,Ib,Lb),Lb.x===1&&Lb.y===1&&Lb.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fb,Ib,Lb.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},zb=new Q,Bb=new Z,Vb=new Z,Hb=class extends Rb{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=vh*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(_h*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vh*2*Math.atan(Math.tan(_h*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zb.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zb.x,zb.y).multiplyScalar(-e/zb.z),zb.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zb.x,zb.y).multiplyScalar(-e/zb.z)}getViewSize(e,t){return this.getViewBounds(e,Bb,Vb),t.subVectors(Vb,Bb)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(_h*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ub=class extends Rb{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Wb=class extends Pb{constructor(){super(new Ub(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gb=class extends kb{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(zg.DEFAULT_UP),this.updateMatrix(),this.target=new zg,this.shadow=new Wb}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Kb=class extends kb{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},qb=-90,Jb=1,Yb=class extends zg{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Hb(qb,Jb,e,t);r.layers=this.layers,this.add(r);let i=new Hb(qb,Jb,e,t);i.layers=this.layers,this.add(i);let a=new Hb(qb,Jb,e,t);a.layers=this.layers,this.add(a);let o=new Hb(qb,Jb,e,t);o.layers=this.layers,this.add(o);let s=new Hb(qb,Jb,e,t);s.layers=this.layers,this.add(s);let c=new Hb(qb,Jb,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Xb=class extends Hb{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Zb=`\\[\\]\\.:\\/`,Qb=RegExp(`[\\[\\]\\.:\\/]`,`g`),$b=`[^\\[\\]\\.:\\/]`,ex=`[^`+Zb.replace(`\\.`,``)+`]`,tx=`((?:WC+[\\/:])*)`.replace(`WC`,$b),nx=`(WCOD+)?`.replace(`WCOD`,ex),rx=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,$b),ix=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,$b),ax=RegExp(`^`+tx+nx+rx+ix+`$`),ox=[`material`,`materials`,`bones`,`map`],sx=class{constructor(e,t,n){let r=n||cx.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},cx=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Qb,``)}static parseTrackName(e){let t=ax.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ox.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Y(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){X(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){X(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){X(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){X(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){X(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){X(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){X(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;X(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){X(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){X(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};cx.Composite=sx,cx.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},cx.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},cx.prototype.GetterByBindingType=[cx.prototype._getValue_direct,cx.prototype._getValue_array,cx.prototype._getValue_arrayElement,cx.prototype._getValue_toArray],cx.prototype.SetterByBindingTypeAndVersioning=[[cx.prototype._setValue_direct,cx.prototype._setValue_direct_setNeedsUpdate,cx.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[cx.prototype._setValue_array,cx.prototype._setValue_array_setNeedsUpdate,cx.prototype._setValue_array_setMatrixWorldNeedsUpdate],[cx.prototype._setValue_arrayElement,cx.prototype._setValue_arrayElement_setNeedsUpdate,cx.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[cx.prototype._setValue_fromArray,cx.prototype._setValue_fromArray_setNeedsUpdate,cx.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function lx(e,t,n,r){let i=ux(r);switch(n){case Zp:return e*t;case nm:return e*t/i.components*i.byteLength;case rm:return e*t/i.components*i.byteLength;case im:return e*t*2/i.components*i.byteLength;case am:return e*t*2/i.components*i.byteLength;case Qp:return e*t*3/i.components*i.byteLength;case $p:return e*t*4/i.components*i.byteLength;case om:return e*t*4/i.components*i.byteLength;case sm:case cm:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case lm:case um:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fm:case mm:return Math.max(e,16)*Math.max(t,8)/4;case dm:case pm:return Math.max(e,8)*Math.max(t,8)/2;case hm:case gm:case vm:case ym:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case _m:case bm:case xm:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Sm:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Cm:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case wm:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Tm:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Em:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Dm:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Om:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case km:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Am:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case jm:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Mm:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Nm:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Pm:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Fm:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Im:case Lm:case Rm:return Math.ceil(e/4)*Math.ceil(t/4)*16;case zm:case Bm:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Vm:case Hm:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ux(e){switch(e){case Rp:case zp:return{byteLength:1,components:1};case Vp:case Bp:case Gp:return{byteLength:2,components:1};case Kp:case qp:return{byteLength:2,components:4};case Up:case Hp:case Wp:return{byteLength:4,components:1};case Yp:case Xp:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?Y(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function dx(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function fx(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var px={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new qg(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gh},alphaMap:{value:null},alphaMapTransform:{value:new Gh},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gh}},envmap:{envMap:{value:null},envMapRotation:{value:new Gh},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gh}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gh}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gh},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gh},normalScale:{value:new Z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gh},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gh}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gh}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gh}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qg(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Q},probesMax:{value:new Q},probesResolution:{value:new Q}},points:{diffuse:{value:new qg(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gh},alphaTest:{value:0},uvTransform:{value:new Gh}},sprite:{diffuse:{value:new qg(16777215)},opacity:{value:1},center:{value:new Z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gh},alphaMap:{value:null},alphaMapTransform:{value:new Gh},alphaTest:{value:0}}},mx={basic:{uniforms:Xy([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:px.meshbasic_vert,fragmentShader:px.meshbasic_frag},lambert:{uniforms:Xy([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new qg(0)},envMapIntensity:{value:1}}]),vertexShader:px.meshlambert_vert,fragmentShader:px.meshlambert_frag},phong:{uniforms:Xy([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new qg(0)},specular:{value:new qg(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:px.meshphong_vert,fragmentShader:px.meshphong_frag},standard:{uniforms:Xy([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new qg(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:px.meshphysical_vert,fragmentShader:px.meshphysical_frag},toon:{uniforms:Xy([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new qg(0)}}]),vertexShader:px.meshtoon_vert,fragmentShader:px.meshtoon_frag},matcap:{uniforms:Xy([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:px.meshmatcap_vert,fragmentShader:px.meshmatcap_frag},points:{uniforms:Xy([$.points,$.fog]),vertexShader:px.points_vert,fragmentShader:px.points_frag},dashed:{uniforms:Xy([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:px.linedashed_vert,fragmentShader:px.linedashed_frag},depth:{uniforms:Xy([$.common,$.displacementmap]),vertexShader:px.depth_vert,fragmentShader:px.depth_frag},normal:{uniforms:Xy([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:px.meshnormal_vert,fragmentShader:px.meshnormal_frag},sprite:{uniforms:Xy([$.sprite,$.fog]),vertexShader:px.sprite_vert,fragmentShader:px.sprite_frag},background:{uniforms:{uvTransform:{value:new Gh},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:px.background_vert,fragmentShader:px.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gh}},vertexShader:px.backgroundCube_vert,fragmentShader:px.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:px.cube_vert,fragmentShader:px.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:px.equirect_vert,fragmentShader:px.equirect_frag},distance:{uniforms:Xy([$.common,$.displacementmap,{referencePosition:{value:new Q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:px.distance_vert,fragmentShader:px.distance_frag},shadow:{uniforms:Xy([$.lights,$.fog,{color:{value:new qg(0)},opacity:{value:1}}]),vertexShader:px.shadow_vert,fragmentShader:px.shadow_frag}};mx.physical={uniforms:Xy([mx.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gh},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gh},clearcoatNormalScale:{value:new Z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gh},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gh},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gh},sheen:{value:0},sheenColor:{value:new qg(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gh},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gh},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gh},transmissionSamplerSize:{value:new Z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gh},attenuationDistance:{value:0},attenuationColor:{value:new qg(0)},specularColor:{value:new qg(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gh},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gh},anisotropyVector:{value:new Z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gh}}]),vertexShader:px.meshphysical_vert,fragmentShader:px.meshphysical_frag};var hx={r:0,b:0,g:0},gx=new fg,_x=new Gh;_x.set(-1,0,0,0,1,0,0,0,1);function vx(e,t,n,r,i,a){let o=new qg(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new fv(new kv(1,1,1),new rb({name:`BackgroundCubeMaterial`,uniforms:Yy(mx.backgroundCube.uniforms),vertexShader:mx.backgroundCube.vertexShader,fragmentShader:mx.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(gx.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(_x),l.material.toneMapped=Xh.getTransfer(i.colorSpace)!==eh,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new fv(new qy(2,2),new rb({name:`BackgroundMaterial`,uniforms:Yy(mx.background.uniforms),vertexShader:mx.background.vertexShader,fragmentShader:mx.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Xh.getTransfer(i.colorSpace)!==eh,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(hx,$y(e)),n.buffers.color.setClear(hx.r,hx.g,hx.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function yx(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function bx(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function xx(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Y(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&Y(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Sx(e){let t=this,n=null,r=0,i=!1,a=!1,o=new yv,s=new Gh,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Cx=4,wx=[.125,.215,.35,.446,.526,.582],Tx=20,Ex=256,Dx=new Ub,Ox=new qg,kx=null,Ax=0,jx=0,Mx=!1,Nx=new Q,Px=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Nx}=i;kx=this._renderer.getRenderTarget(),Ax=this._renderer.getActiveCubeFace(),jx=this._renderer.getActiveMipmapLevel(),Mx=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(kx,Ax,jx),this._renderer.xr.enabled=Mx,e.scissorTest=!1,Lx(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),kx=this._renderer.getRenderTarget(),Ax=this._renderer.getActiveCubeFace(),jx=this._renderer.getActiveMipmapLevel(),Mx=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Fp,minFilter:Fp,generateMipmaps:!1,type:Gp,format:$p,colorSpace:Qm,depthBuffer:!1},r=Ix(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ix(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Fx(r)),this._blurMaterial=zx(r,e,t),this._ggxMaterial=Rx(r,e,t)}return r}_compileMaterial(e){let t=new fv(new U_,e);this._renderer.compile(t,Dx)}_sceneToCubeUV(e,t,n,r,i){let a=new Hb(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Ox),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new fv(new kv,new ev({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Ox),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Lx(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vx()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bx());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Lx(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Dx)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Cx?n-d+Cx:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Lx(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Dx),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Lx(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Dx)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&X(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Tx;m>Tx&&Y(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Tx}`);let h=[],g=0;for(let e=0;e<Tx;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Lx(t,3*v*(r>_-Cx?r-_+Cx:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Dx)}};function Fx(e){let t=[],n=[],r=[],i=e,a=e-Cx+1+wx.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-Cx?s=wx[o-e+Cx-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new U_;h.setAttribute(`position`,new O_(f,3)),h.setAttribute(`uv`,new O_(p,2)),h.setAttribute(`faceIndex`,new O_(m,1)),r.push(new fv(h,null)),i>Cx&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function Ix(e,t,n){let r=new lg(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Lx(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Rx(e,t,n){return new rb({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ex,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Hx(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function zx(e,t,n){let r=new Float32Array(Tx),i=new Q(0,1,0);return new rb({name:`SphericalGaussianBlur`,defines:{n:Tx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Hx(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Bx(){return new rb({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Hx(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Vx(){return new rb({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hx(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Hx(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Ux=class extends lg{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new wv(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new kv(5,5,5),i=new rb({name:`CubemapFromEquirect`,uniforms:Yy(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new fv(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Fp),new Yb(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Wx(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304)if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}else{let r=n.image;if(r&&r.height>0){let i=new Ux(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Px(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Px(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Gx(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&dh(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Kx(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?A_:k_)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function qx(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Jx(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:X(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Yx(e,t,n){let r=new WeakMap,i=new sg;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new ug(h,p,m,u);g.type=Wp,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new Z(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Xx(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Zx={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Qx(e,t,n,r,i,a){let o=new lg(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new Ev(t,n):void 0}),s=new lg(t,n,{type:Gp,depthBuffer:!1,stencilBuffer:!1}),c=new U_;c.setAttribute(`position`,new j_([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new j_([0,2,0,0,2,0],2));let l=new ib({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new fv(c,l),d=new Ub(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},Xh.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Zx[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var $x=new og,eS=new Ev(1,1),tS=new ug,nS=new dg,rS=new wv,iS=[],aS=[],oS=new Float32Array(16),sS=new Float32Array(9),cS=new Float32Array(4);function lS(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=iS[i];if(a===void 0&&(a=new Float32Array(i),iS[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function uS(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function dS(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function fS(e,t){let n=aS[t];n===void 0&&(n=new Int32Array(t),aS[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function pS(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function mS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(uS(n,t))return;e.uniform2fv(this.addr,t),dS(n,t)}}function hS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(uS(n,t))return;e.uniform3fv(this.addr,t),dS(n,t)}}function gS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(uS(n,t))return;e.uniform4fv(this.addr,t),dS(n,t)}}function _S(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(uS(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),dS(n,t)}else{if(uS(n,r))return;cS.set(r),e.uniformMatrix2fv(this.addr,!1,cS),dS(n,r)}}function vS(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(uS(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),dS(n,t)}else{if(uS(n,r))return;sS.set(r),e.uniformMatrix3fv(this.addr,!1,sS),dS(n,r)}}function yS(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(uS(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),dS(n,t)}else{if(uS(n,r))return;oS.set(r),e.uniformMatrix4fv(this.addr,!1,oS),dS(n,r)}}function bS(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function xS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(uS(n,t))return;e.uniform2iv(this.addr,t),dS(n,t)}}function SS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(uS(n,t))return;e.uniform3iv(this.addr,t),dS(n,t)}}function CS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(uS(n,t))return;e.uniform4iv(this.addr,t),dS(n,t)}}function wS(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function TS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(uS(n,t))return;e.uniform2uiv(this.addr,t),dS(n,t)}}function ES(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(uS(n,t))return;e.uniform3uiv(this.addr,t),dS(n,t)}}function DS(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(uS(n,t))return;e.uniform4uiv(this.addr,t),dS(n,t)}}function OS(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(eS.compareFunction=n.isReversedDepthBuffer()?518:515,a=eS):a=$x,n.setTexture2D(t||a,i)}function kS(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||nS,i)}function AS(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||rS,i)}function jS(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||tS,i)}function MS(e){switch(e){case 5126:return pS;case 35664:return mS;case 35665:return hS;case 35666:return gS;case 35674:return _S;case 35675:return vS;case 35676:return yS;case 5124:case 35670:return bS;case 35667:case 35671:return xS;case 35668:case 35672:return SS;case 35669:case 35673:return CS;case 5125:return wS;case 36294:return TS;case 36295:return ES;case 36296:return DS;case 35678:case 36198:case 36298:case 36306:case 35682:return OS;case 35679:case 36299:case 36307:return kS;case 35680:case 36300:case 36308:case 36293:return AS;case 36289:case 36303:case 36311:case 36292:return jS}}function NS(e,t){e.uniform1fv(this.addr,t)}function PS(e,t){let n=lS(t,this.size,2);e.uniform2fv(this.addr,n)}function FS(e,t){let n=lS(t,this.size,3);e.uniform3fv(this.addr,n)}function IS(e,t){let n=lS(t,this.size,4);e.uniform4fv(this.addr,n)}function LS(e,t){let n=lS(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function RS(e,t){let n=lS(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function zS(e,t){let n=lS(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function BS(e,t){e.uniform1iv(this.addr,t)}function VS(e,t){e.uniform2iv(this.addr,t)}function HS(e,t){e.uniform3iv(this.addr,t)}function US(e,t){e.uniform4iv(this.addr,t)}function WS(e,t){e.uniform1uiv(this.addr,t)}function GS(e,t){e.uniform2uiv(this.addr,t)}function KS(e,t){e.uniform3uiv(this.addr,t)}function qS(e,t){e.uniform4uiv(this.addr,t)}function JS(e,t,n){let r=this.cache,i=t.length,a=fS(n,i);uS(r,a)||(e.uniform1iv(this.addr,a),dS(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?eS:$x;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function YS(e,t,n){let r=this.cache,i=t.length,a=fS(n,i);uS(r,a)||(e.uniform1iv(this.addr,a),dS(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||nS,a[e])}function XS(e,t,n){let r=this.cache,i=t.length,a=fS(n,i);uS(r,a)||(e.uniform1iv(this.addr,a),dS(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||rS,a[e])}function ZS(e,t,n){let r=this.cache,i=t.length,a=fS(n,i);uS(r,a)||(e.uniform1iv(this.addr,a),dS(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||tS,a[e])}function QS(e){switch(e){case 5126:return NS;case 35664:return PS;case 35665:return FS;case 35666:return IS;case 35674:return LS;case 35675:return RS;case 35676:return zS;case 5124:case 35670:return BS;case 35667:case 35671:return VS;case 35668:case 35672:return HS;case 35669:case 35673:return US;case 5125:return WS;case 36294:return GS;case 36295:return KS;case 36296:return qS;case 35678:case 36198:case 36298:case 36306:case 35682:return JS;case 35679:case 36299:case 36307:return YS;case 35680:case 36300:case 36308:case 36293:return XS;case 36289:case 36303:case 36311:case 36292:return ZS}}var $S=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=MS(t.type)}},eC=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=QS(t.type)}},tC=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},nC=/(\w+)(\])?(\[|\.)?/g;function rC(e,t){e.seq.push(t),e.map[t.id]=t}function iC(e,t,n){let r=e.name,i=r.length;for(nC.lastIndex=0;;){let a=nC.exec(r),o=nC.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){rC(n,l===void 0?new $S(s,e,t):new eC(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new tC(s),rC(n,e)),n=e}}}var aC=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);iC(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function oC(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var sC=37297,cC=0;function lC(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var uC=new Gh;function dC(e){Xh._getMatrix(uC,Xh.workingColorSpace,e);let t=`mat3( ${uC.elements.map(e=>e.toFixed(4))} )`;switch(Xh.getTransfer(e)){case $m:return[t,`LinearTransferOETF`];case eh:return[t,`sRGBTransferOETF`];default:return Y(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function fC(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+lC(e.getShaderSource(t),r)}return i}function pC(e,t){let n=dC(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var mC={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function hC(e,t){let n=mC[t];return n===void 0?(Y(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var gC=new Q;function _C(){return Xh.getLuminanceCoefficients(gC),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${gC.x.toFixed(4)}, ${gC.y.toFixed(4)}, ${gC.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function vC(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(xC).join(`
`)}function yC(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function bC(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function xC(e){return e!==``}function SC(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function CC(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var wC=/^[ \t]*#include +<([\w\d./]+)>/gm;function TC(e){return e.replace(wC,DC)}var EC=new Map;function DC(e,t){let n=px[t];if(n===void 0){let e=EC.get(t);if(e!==void 0)n=px[e],Y(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return TC(n)}var OC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kC(e){return e.replace(OC,AC)}function AC(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function jC(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var MC={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function NC(e){return MC[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var PC={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function FC(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:PC[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var IC={302:`ENVMAP_MODE_REFRACTION`};function LC(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:IC[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var RC={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function zC(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:RC[e.combine]||`ENVMAP_BLENDING_NONE`}function BC(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function VC(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=NC(n),l=FC(n),u=LC(n),d=zC(n),f=BC(n),p=vC(n),m=yC(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(xC).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(xC).join(`
`),_.length>0&&(_+=`
`)):(g=[jC(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(xC).join(`
`),_=[jC(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:px.tonemapping_pars_fragment,n.toneMapping===0?``:hC(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,px.colorspace_pars_fragment,pC(`linearToOutputTexel`,n.outputColorSpace),_C(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(xC).join(`
`)),o=TC(o),o=SC(o,n),o=CC(o,n),s=TC(s),s=SC(s,n),s=CC(s,n),o=kC(o),s=kC(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=oC(i,i.VERTEX_SHADER,y),S=oC(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1)if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=fC(i,x,`vertex`),n=fC(i,S,`fragment`);X(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}else o===``?(s===``||c===``)&&(u=!1):Y(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new aC(i,h),T=bC(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,sC)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=cC++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var HC=0,UC=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new WC(e),t.set(e,n)),n}},WC=class{constructor(e){this.id=HC++,this.code=e,this.usedTimes=0}};function GC(e){return e===1030||e===37490||e===36285}function KC(e,t,n,r,i,a){let o=new Cg,s=new UC,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&Y(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=mx[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,I=!!i.matcap,ee=!!x,te=!!i.aoMap,ne=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,L=!!i.normalMap,R=!!i.displacementMap,z=!!i.emissiveMap,ie=!!i.metalnessMap,ae=!!i.roughnessMap,oe=i.anisotropy>0,se=i.clearcoat>0,ce=i.dispersion>0,le=i.iridescence>0,ue=i.sheen>0,de=i.transmission>0,fe=oe&&!!i.anisotropyMap,pe=se&&!!i.clearcoatMap,me=se&&!!i.clearcoatNormalMap,he=se&&!!i.clearcoatRoughnessMap,ge=le&&!!i.iridescenceMap,_e=le&&!!i.iridescenceThicknessMap,B=ue&&!!i.sheenColorMap,ve=ue&&!!i.sheenRoughnessMap,ye=!!i.specularMap,be=!!i.specularColorMap,V=!!i.specularIntensityMap,xe=de&&!!i.transmissionMap,H=de&&!!i.thicknessMap,U=!!i.gradientMap,Se=!!i.alphaMap,Ce=i.alphaTest>0,we=!!i.alphaHash,Te=!!i.extensions,Ee=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ee=e.toneMapping);let De={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Xh.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:I,envMap:ee,envMapMode:ee&&x.mapping,envMapCubeUVHeight:S,aoMap:te,lightMap:ne,bumpMap:re,normalMap:L,displacementMap:R,emissiveMap:z,normalMapObjectSpace:L&&i.normalMapType===1,normalMapTangentSpace:L&&i.normalMapType===0,packedNormalMap:L&&i.normalMapType===0&&GC(i.normalMap.format),metalnessMap:ie,roughnessMap:ae,anisotropy:oe,anisotropyMap:fe,clearcoat:se,clearcoatMap:pe,clearcoatNormalMap:me,clearcoatRoughnessMap:he,dispersion:ce,iridescence:le,iridescenceMap:ge,iridescenceThicknessMap:_e,sheen:ue,sheenColorMap:B,sheenRoughnessMap:ve,specularMap:ye,specularColorMap:be,specularIntensityMap:V,transmission:de,transmissionMap:xe,thicknessMap:H,gradientMap:U,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Se,alphaTest:Ce,alphaHash:we,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:te&&m(i.aoMap.channel),lightMapUv:ne&&m(i.lightMap.channel),bumpMapUv:re&&m(i.bumpMap.channel),normalMapUv:L&&m(i.normalMap.channel),displacementMapUv:R&&m(i.displacementMap.channel),emissiveMapUv:z&&m(i.emissiveMap.channel),metalnessMapUv:ie&&m(i.metalnessMap.channel),roughnessMapUv:ae&&m(i.roughnessMap.channel),anisotropyMapUv:fe&&m(i.anisotropyMap.channel),clearcoatMapUv:pe&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:B&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:ve&&m(i.sheenRoughnessMap.channel),specularMapUv:ye&&m(i.specularMap.channel),specularColorMapUv:be&&m(i.specularColorMap.channel),specularIntensityMapUv:V&&m(i.specularIntensityMap.channel),transmissionMapUv:xe&&m(i.transmissionMap.channel),thicknessMapUv:H&&m(i.thicknessMap.channel),alphaMapUv:Se&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(L||oe),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||Se),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&L===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ee,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&Xh.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:z&&i.emissiveMap.isVideoTexture===!0&&Xh.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Te&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Te&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return De.vertexUv1s=c.has(1),De.vertexUv2s=c.has(2),De.vertexUv3s=c.has(3),c.clear(),De}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=mx[t];n=eb.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new VC(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function qC(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function JC(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function YC(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function XC(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||JC),r.length>1&&r.sort(t||YC),i.length>1&&i.sort(t||YC),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function ZC(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new XC,e.set(t,[i])):n>=r.length?(i=new XC,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function QC(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new Q,color:new qg};break;case`SpotLight`:n={position:new Q,direction:new Q,color:new qg,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Q,color:new qg,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Q,skyColor:new qg,groundColor:new qg};break;case`RectAreaLight`:n={color:new qg,position:new Q,halfWidth:new Q,halfHeight:new Q}}return e[t.id]=n,n}}}function $C(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var ew=0;function tw(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function nw(e){let t=new QC,n=$C(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Q);let i=new Q,a=new fg,o=new fg;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(tw);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=ew++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function rw(e){let t=new nw(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function iw(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new rw(e),t.set(n,[a])):r>=i.length?(a=new rw(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var aw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ow=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,sw=[new Q(1,0,0),new Q(-1,0,0),new Q(0,1,0),new Q(0,-1,0),new Q(0,0,1),new Q(0,0,-1)],cw=[new Q(0,-1,0),new Q(0,-1,0),new Q(0,0,1),new Q(0,0,-1),new Q(0,-1,0),new Q(0,-1,0)],lw=new fg,uw=new Q,dw=new Q;function fw(e,t,n){let r=new Cv,i=new Z,a=new Z,o=new sg,s=new ob,c=new sb,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new rb({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Z},radius:{value:4}},vertexShader:aw,fragmentShader:ow}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new U_;m.setAttribute(`position`,new O_(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new fv(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Y(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Y(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Y(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new lg(i.x,i.y,{format:im,type:Gp,minFilter:Fp,magFilter:Fp,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Ev(i.x,i.y,Wp),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=em,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Mp,d.map.depthTexture.magFilter=Mp}else l.isPointLight?(d.map=new Ux(i.x),d.map.depthTexture=new Dv(i.x,Up)):(d.map=new lg(i.x,i.y),d.map.depthTexture=new Ev(i.x,i.y,Up)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=em,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Fp,d.map.depthTexture.magFilter=Fp):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Mp,d.map.depthTexture.magFilter=Mp);d.camera.updateProjectionMatrix()}let g=d.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<g;t++){if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),uw.setFromMatrixPosition(l.matrixWorld),e.position.copy(uw),dw.copy(e.position),dw.add(sw[t]),e.up.copy(cw[t]),e.lookAt(dw),e.updateMatrixWorld(),n.makeTranslation(-uw.x,-uw.y,-uw.z),lw.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(lw,e.coordinateSystem,e.reversedDepth)}else d.updateMatrices(l);r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new lg(i.x,i.y,{format:im,type:Gp})),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function pw(e,t){function n(){let t=!1,n=new sg,r=null,i=new sg(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ie(e.DEPTH_TEST):ae(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ph[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ie(e.STENCIL_TEST):ae(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new qg(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let I=null,ee={},te=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),re=new sg().fromArray(te),L=new sg().fromArray(ne);function R(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let z={};z[e.TEXTURE_2D]=R(e.TEXTURE_2D,e.TEXTURE_2D,1),z[e.TEXTURE_CUBE_MAP]=R(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),z[e.TEXTURE_2D_ARRAY]=R(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),z[e.TEXTURE_3D]=R(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ie(e.DEPTH_TEST),o.setFunc(3),pe(!1),me(1),ie(e.CULL_FACE),de(0);function ie(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ae(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function oe(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function se(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ce(t){return h!==t&&(e.useProgram(t),h=t,!0)}let le={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};le[103]=e.MIN,le[104]=e.MAX;let ue={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function de(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ae(e.BLEND),g=!1);return}if(g===!1&&(ie(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:X(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:X(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:X(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:X(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(le[n],le[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ue[r],ue[i],ue[o],ue[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function fe(t,n){t.side===2?ae(e.CULL_FACE):ie(e.CULL_FACE);let r=t.side===1;n&&(r=!r),pe(r),t.blending===1&&t.transparent===!1?de(0):de(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ge(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ie(e.SAMPLE_ALPHA_TO_COVERAGE):ae(e.SAMPLE_ALPHA_TO_COVERAGE)}function pe(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function me(t){t===0?ae(e.CULL_FACE):(ie(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function he(t){t!==k&&(N&&e.lineWidth(t),k=t)}function ge(t,n,r){t?(ie(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ae(e.POLYGON_OFFSET_FILL)}function _e(t){t?ie(e.SCISSOR_TEST):ae(e.SCISSOR_TEST)}function B(t){t===void 0&&(t=e.TEXTURE0+M-1),I!==t&&(e.activeTexture(t),I=t)}function ve(t,n,r){r===void 0&&(r=I===null?e.TEXTURE0+M-1:I);let i=ee[r];i===void 0&&(i={type:void 0,texture:void 0},ee[r]=i),(i.type!==t||i.texture!==n)&&(I!==r&&(e.activeTexture(r),I=r),e.bindTexture(t,n||z[t]),i.type=t,i.texture=n)}function ye(){let t=ee[I];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function be(){try{e.compressedTexImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function V(){try{e.compressedTexImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function xe(){try{e.texSubImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function H(){try{e.texSubImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function U(){try{e.compressedTexSubImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Se(){try{e.compressedTexSubImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Ce(){try{e.texStorage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function we(){try{e.texStorage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Te(){try{e.texImage2D(...arguments)}catch(e){X(`WebGLState:`,e)}}function Ee(){try{e.texImage3D(...arguments)}catch(e){X(`WebGLState:`,e)}}function De(t){return d[t]===void 0?e.getParameter(t):d[t]}function Oe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function ke(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Ae(t){L.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),L.copy(t))}function je(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Me(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Ne(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},I=null,ee={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new qg(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),L.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ie,disable:ae,bindFramebuffer:oe,drawBuffers:se,useProgram:ce,setBlending:de,setMaterial:fe,setFlipSided:pe,setCullFace:me,setLineWidth:he,setPolygonOffset:ge,setScissorTest:_e,activeTexture:B,bindTexture:ve,unbindTexture:ye,compressedTexImage2D:be,compressedTexImage3D:V,texImage2D:Te,texImage3D:Ee,pixelStorei:Oe,getParameter:De,updateUBOMapping:je,uniformBlockBinding:Me,texStorage2D:Ce,texStorage3D:we,texSubImage2D:xe,texSubImage3D:H,compressedTexSubImage2D:U,compressedTexSubImage3D:Se,scissor:ke,viewport:Ae,reset:Ne}}function mw(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Z,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):oh(`canvas`)}function g(e,t,n){let r=1,i=be(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Y(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}else return`data`in e&&Y(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e;return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Y(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Y(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?$m:Xh.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Y(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function M(){let e=O;return e>=i.maxTextures&&Y(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function N(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&ve(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Y(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Y(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ae(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ae(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function I(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){ae(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){oe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let te={[kp]:e.REPEAT,[Ap]:e.CLAMP_TO_EDGE,[jp]:e.MIRRORED_REPEAT},ne={[Mp]:e.NEAREST,[Np]:e.NEAREST_MIPMAP_NEAREST,[Pp]:e.NEAREST_MIPMAP_LINEAR,[Fp]:e.LINEAR,[Ip]:e.LINEAR_MIPMAP_NEAREST,[Lp]:e.LINEAR_MIPMAP_LINEAR},re={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function L(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Y(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,te[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,te[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,te[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ne[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ne[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,re[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function R(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=N(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function z(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ie(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=z(n.start,r.width,4),c=z(t.start,r.width,4);n.start<=i+1&&a===c&&z(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ae(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=R(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Xh.getPrimaries(Xh.workingColorSpace),r=o.colorSpace===``?null:Xh.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=ye(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);L(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===tm,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture)if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ie(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data);else if(o.isCompressedTexture)if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023)if(r!==null)if(C){if(T)if(o.layerUpdates.size>0){let t=lx(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0);else Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`);else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data)}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}else if(o.isDataArrayTexture)if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T)if(o.layerUpdates.size>0){let i=lx(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w)if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=be(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=be(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function oe(t,o,s){if(o.image.length!==6)return;let c=R(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Xh.getPrimaries(Xh.workingColorSpace),r=o.colorSpace===``?null:Xh.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=ye(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);L(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=be(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function se(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),B(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,_e(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ce(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;B(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,_e(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,_e(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);B(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,_e(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,_e(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function le(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),L(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=_e(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)B(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)B(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ue(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer)if(a)for(let e=0;e<6;e++)le(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?le(i.__webglFramebuffer[0],t,0):le(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ce(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ce(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function de(t,n,i){let a=r.get(t);n!==void 0&&se(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ue(t)}function fe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&B(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=_e(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ce(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),L(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)se(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else se(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),L(c,a),se(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),L(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)se(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else se(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ue(t)}function pe(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let me=[],he=[];function ge(t){if(t.samples>0){if(B(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(me.length=0,he.length=0,me.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(me.push(l),he.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,he)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,me))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function _e(e){return Math.min(i.maxSamples,e.samples)}function B(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function ve(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function ye(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Xh.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Y(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):X(`WebGLTextures: Unsupported texture color space:`,n)),t}function be(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=M,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=P,this.setTexture2DArray=F,this.setTexture3D=I,this.setTextureCube=ee,this.rebindTextures=de,this.setupRenderTarget=fe,this.updateRenderTargetMipmap=pe,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=ue,this.setupFrameBufferTexture=se,this.useMultisampledRTT=B,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function hw(e,t){function n(n,r=``){let i,a=Xh.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===`srgb`)if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var gw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_w=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,vw=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ov(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new rb({vertexShader:gw,fragmentShader:_w,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new fv(new qy(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},yw=class extends mh{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new vw,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new Z,C=null,w=new Hb;w.viewport=new sg;let T=new Hb;T.viewport=new sg;let E=[w,T],D=new Xb,O=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Hg,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Hg,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Hg,b[e]=t),t.getHandSpace()};function A(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function j(){r.removeEventListener(`select`,A),r.removeEventListener(`selectstart`,A),r.removeEventListener(`selectend`,A),r.removeEventListener(`squeeze`,A),r.removeEventListener(`squeezestart`,A),r.removeEventListener(`squeezeend`,A),r.removeEventListener(`end`,j),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}O=null,k=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,A),r.addEventListener(`selectstart`,A),r.addEventListener(`selectend`,A),r.addEventListener(`squeeze`,A),r.addEventListener(`squeezestart`,A),r.addEventListener(`squeezeend`,A),r.addEventListener(`end`,j),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?tm:em,a=_.stencil?Jp:Up);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new lg(d.textureWidth,d.textureHeight,{format:$p,type:Rp,depthTexture:new Ev(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new lg(f.framebufferWidth,f.framebufferHeight,{format:$p,type:Rp,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),re.setContext(r),re.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let N=new Q,P=new Q;function F(e,t,n){N.setFromMatrixPosition(t.matrixWorld),P.setFromMatrixPosition(n.matrixWorld);let r=N.distanceTo(P),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function I(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),D.near=T.near=w.near=t,D.far=T.far=w.far=n,(O!==D.near||k!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,k=D.far),D.layers.mask=e.layers.mask|6,w.layers.mask=D.layers.mask&-5,T.layers.mask=D.layers.mask&-3;let i=e.parent,a=D.cameras;I(D,i);for(let e=0;e<a.length;e++)I(a[e],i);a.length===2?F(D,w,T):D.projectionMatrix.copy(w.projectionMatrix),ee(e,D,i)};function ee(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=vh*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(D)},this.getCameraTexture=function(e){return g[e]};let te=null;function ne(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==D.cameras.length&&(D.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new Hb,o.layers.enable(n),o.viewport=new sg,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(D.matrix.copy(o.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),i===!0&&D.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Ov,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}te&&te(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let re=new dx;re.setAnimationLoop(ne),this.setAnimationLoop=function(e){te=e},this.dispose=function(){}}},bw=new fg,xw=new Gh;xw.set(-1,0,0,0,1,0,0,0,1);function Sw(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,$y(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(bw.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(xw),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Cw(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return X(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?Y(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):Y(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var ww=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Tw=null;function Ew(){return Tw===null&&(Tw=new hv(ww,16,16,im,Gp),Tw.name=`DFG_LUT`,Tw.minFilter=Fp,Tw.magFilter=Fp,Tw.wrapS=Ap,Tw.wrapT=Ap,Tw.generateMipmaps=!1,Tw.needsUpdate=!0),Tw}var Dw=class{constructor(e={}){let{canvas:t=sh(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Rp}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([om,am,rm]),g=new Set([Rp,Up,Vp,Jp,Kp,qp]),_=new Uint32Array(4),v=new Int32Array(4),y=new Q,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Zm;let j=0,M=0,N=null,P=-1,F=null,I=new sg,ee=new sg,te=null,ne=new qg(0),re=0,L=t.width,R=t.height,z=1,ie=null,ae=null,oe=new sg(0,0,L,R),se=new sg(0,0,L,R),ce=!1,le=new Cv,ue=!1,de=!1,fe=new fg,pe=new Q,me=new sg,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ge=!1;function _e(){return N===null?z:1}let B=n;function ve(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,Ve,!1),t.addEventListener(`webglcontextrestored`,He,!1),t.addEventListener(`webglcontextcreationerror`,Ue,!1),B===null){let t=`webgl2`;if(B=ve(t,e),B===null)throw ve(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw X(`WebGLRenderer: `+e.message),e}let ye,be,V,xe,H,U,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re;function ze(){ye=new Gx(B),ye.init(),Ie=new hw(B,ye),be=new xx(B,ye,e,Ie),V=new pw(B,ye),be.reversedDepthBuffer&&d&&V.buffers.depth.setReversed(!0),O=B.createFramebuffer(),k=B.createFramebuffer(),A=B.createFramebuffer(),xe=new Jx(B),H=new qC,U=new mw(B,ye,V,H,be,Ie,xe),Se=new Wx(T),Ce=new fx(B),Le=new yx(B,Ce),we=new Kx(B,Ce,xe,Le),Te=new Xx(B,we,Ce,Le,xe),Ne=new Yx(B,be,U),Ae=new Sx(H),Ee=new KC(T,Se,ye,be,Le,Ae),De=new Sw(T,H),Oe=new ZC,ke=new iw(ye),Me=new vx(T,Se,V,Te,p,s),je=new fw(T,Te,be),Re=new Cw(B,xe,be,V),Pe=new bx(B,ye,xe),Fe=new qx(B,ye,xe),xe.programs=Ee.programs,T.capabilities=be,T.extensions=ye,T.properties=H,T.renderLists=Oe,T.shadowMap=je,T.state=V,T.info=xe}ze(),m!==1009&&(w=new Qx(m,t.width,t.height,o,r,i));let Be=new yw(T,B);this.xr=Be,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let e=ye.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=ye.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(e){e!==void 0&&(z=e,this.setSize(L,R,!1))},this.getSize=function(e){return e.set(L,R)},this.setSize=function(e,n,r=!0){if(Be.isPresenting){Y(`WebGLRenderer: Can't change size while VR device is presenting.`);return}L=e,R=n,t.width=Math.floor(e*z),t.height=Math.floor(n*z),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(L*z,R*z).floor()},this.setDrawingBufferSize=function(e,n,r){L=e,R=n,z=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){X(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Y(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(I)},this.getViewport=function(e){return e.copy(oe)},this.setViewport=function(e,t,n,r){e.isVector4?oe.set(e.x,e.y,e.z,e.w):oe.set(e,t,n,r),V.viewport(I.copy(oe).multiplyScalar(z).round())},this.getScissor=function(e){return e.copy(se)},this.setScissor=function(e,t,n,r){e.isVector4?se.set(e.x,e.y,e.z,e.w):se.set(e,t,n,r),V.scissor(ee.copy(se).multiplyScalar(z).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(e){V.setScissorTest(ce=e)},this.setOpaqueSort=function(e){ie=e},this.setTransparentSort=function(e){ae=e},this.getClearColor=function(e){return e.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Me.getClearColor(),r=Me.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,B.clearBufferuiv(B.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,B.clearBufferiv(B.COLOR,0,v))}else r|=B.COLOR_BUFFER_BIT}t&&(r|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&B.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ve,!1),t.removeEventListener(`webglcontextrestored`,He,!1),t.removeEventListener(`webglcontextcreationerror`,Ue,!1),Me.dispose(),Oe.dispose(),ke.dispose(),H.dispose(),Se.dispose(),Te.dispose(),Le.dispose(),Re.dispose(),Ee.dispose(),Be.dispose(),Be.removeEventListener(`sessionstart`,Xe),Be.removeEventListener(`sessionend`,Ze),Qe.stop()};function Ve(e){e.preventDefault(),lh(`WebGLRenderer: Context Lost.`),E=!0}function He(){lh(`WebGLRenderer: Context Restored.`),E=!1;let e=xe.autoReset,t=je.enabled,n=je.autoUpdate,r=je.needsUpdate,i=je.type;ze(),xe.autoReset=e,je.enabled=t,je.autoUpdate=n,je.needsUpdate=r,je.type=i}function Ue(e){X(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function We(e){let t=e.target;t.removeEventListener(`dispose`,We),Ge(t)}function Ge(e){Ke(e),H.remove(e)}function Ke(e){let t=H.get(e).programs;t!==void 0&&(t.forEach(function(e){Ee.releaseProgram(e)}),e.isShaderMaterial&&Ee.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=he);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ct(e,t,n,r,i);V.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=we.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Le.setup(i,r,s,n,c);let h,g=Pe;if(c!==null&&(h=Ce.get(c),g=Fe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(V.setLineWidth(r.wireframeLinewidth*_e()),g.setMode(B.LINES)):g.setMode(B.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),V.setLineWidth(e*_e()),i.isLineSegments?g.setMode(B.LINES):i.isLineLoop?g.setMode(B.LINE_LOOP):g.setMode(B.LINE_STRIP)}else i.isPoints?g.setMode(B.POINTS):i.isSprite&&g.setMode(B.TRIANGLES);if(i.isBatchedMesh)if(ye.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ce.get(c).bytesPerElement:1,o=H.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(B,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function qe(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,it(e,t,n),e.side=0,e.needsUpdate=!0,it(e,t,n),e.side=2):it(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),x=ke.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];qe(a,n,e),r.add(a)}else qe(t,n,e),r.add(t)}),x=C.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){H.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}ye.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Je=null;function Ye(e){Je&&Je(e)}function Xe(){Qe.stop()}function Ze(){Qe.start()}let Qe=new dx;Qe.setAnimationLoop(Ye),typeof self<`u`&&Qe.setContext(self),this.setAnimationLoop=function(e){Je=e,Be.setAnimationLoop(e),e===null?Qe.stop():Qe.start()},Be.addEventListener(`sessionstart`,Xe),Be.addEventListener(`sessionend`,Ze),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){X(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Be.enabled===!0&&Be.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(t),t=Be.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=ke.get(e,C.length),x.init(t),x.state.textureUnits=U.getTextureUnits(),C.push(x),fe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),le.setFromProjectionMatrix(fe,rh,t.reversedDepth),de=this.localClippingEnabled,ue=Ae.init(this.clippingPlanes,de),b=Oe.get(e,S.length),b.init(),S.push(b),Be.enabled===!0&&Be.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&$e(e,t,-1/0,T.sortObjects)}$e(e,t,0,T.sortObjects),b.finish(),T.sortObjects===!0&&b.sort(ie,ae,t.reversedDepth),ge=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,ge&&Me.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ue===!0&&Ae.beginShadows();let i=x.state.shadowsArray;if(je.render(i,e,t),ue===!0&&Ae.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];tt(n,r,e,a)}ge&&Me.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];et(b,e,n,n.viewport)}}else r.length>0&&tt(n,r,e,t),ge&&Me.render(e),et(b,e,t)}N!==null&&M===0&&(U.updateMultisampleRenderTarget(N),U.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Le.resetDefaultState(),P=-1,F=null,C.pop(),C.length>0?(x=C[C.length-1],U.setTextureUnits(x.state.textureUnits),ue===!0&&Ae.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function $e(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||le.intersectsSprite(e)){r&&me.setFromMatrixPosition(e.matrixWorld).applyMatrix4(fe);let t=Te.update(e),i=e.material;i.visible&&b.push(e,t,i,n,me.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||le.intersectsObject(e))){let t=Te.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),me.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),me.copy(e.boundingSphere.center)),me.applyMatrix4(e.matrixWorld).applyMatrix4(fe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&b.push(e,t,s,n,me.z,o)}}else i.visible&&b.push(e,t,i,n,me.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)$e(i[e],t,n,r)}function et(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ue===!0&&Ae.setGlobalState(T.clippingPlanes,n),r&&V.viewport(I.copy(r)),i.length>0&&nt(i,t,n),a.length>0&&nt(a,t,n),o.length>0&&nt(o,t,n),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function tt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=ye.has(`EXT_color_buffer_half_float`)||ye.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new lg(1,1,{generateMipmaps:!0,type:e?Gp:Rp,minFilter:Lp,samples:Math.max(4,be.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xh.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||I;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ne),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),ge&&Me.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ue===!0&&Ae.setGlobalState(T.clippingPlanes,r),nt(e,n,r),U.updateMultisampleRenderTarget(a),U.updateRenderTargetMipmap(a),ye.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,rt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(U.updateMultisampleRenderTarget(a),U.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ne,re),d!==void 0&&(r.viewport=d),T.toneMapping=u}function nt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&rt(o,t,n,s,l,c)}}function rt(e,t,n,r,i,a){e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function it(e,t,n){t.isScene!==!0&&(t=he);let r=H.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ee.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ee.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Se.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,We),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return ot(e,s),d}else s.uniforms=Ee.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ee.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ae.uniform),ot(e,s),r.needsLights=ut(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function at(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=aC.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ot(e,t){let n=H.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function st(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function ct(e,t,n,r,i){t.isScene!==!0&&(t=he),U.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Xh.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Se.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=H.get(r),y=x.state.lights;if(ue===!0&&(de===!0||e!==F)){let t=e===F&&r.id===P;Ae.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ae.numPlanes||v.numIntersection!==Ae.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=it(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(V.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==P&&(P=r.id,w=!0),v.needsLights){let e=st(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||F!==e){V.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(B,`projectionMatrix`,e.projectionMatrix),O.setValue(B,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(B,pe.setFromMatrixPosition(e.matrixWorld)),be.logarithmicDepthBuffer&&O.setValue(B,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(B,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,w=!0,E=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&O.setValue(B,`directionalShadowMap`,y.state.directionalShadowMap,U),y.state.spotShadowMap.length>0&&O.setValue(B,`spotShadowMap`,y.state.spotShadowMap,U),y.state.pointShadowMap.length>0&&O.setValue(B,`pointShadowMap`,y.state.pointShadowMap,U)),i.isSkinnedMesh){O.setOptional(B,i,`bindMatrix`),O.setOptional(B,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(B,`boneTexture`,e.boneTexture,U))}i.isBatchedMesh&&(O.setOptional(B,i,`batchingTexture`),O.setValue(B,`batchingTexture`,i._matricesTexture,U),O.setOptional(B,i,`batchingIdTexture`),O.setValue(B,`batchingIdTexture`,i._indirectTexture,U),O.setOptional(B,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(B,`batchingColorTexture`,i._colorsTexture,U));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Ne.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(B,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Ew()),w){if(O.setValue(B,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&lt(k,E),a&&r.fog===!0&&De.refreshFogUniforms(k,a),De.refreshMaterialUniforms(k,r,z,R,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}aC.upload(B,at(v),k,U)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(aC.upload(B,at(v),k,U),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(B,`center`,i.center),O.setValue(B,`modelViewMatrix`,i.modelViewMatrix),O.setValue(B,`normalMatrix`,i.normalMatrix),O.setValue(B,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Re.update(n,S),Re.bind(n,S)}}return S}function lt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function ut(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=H.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),H.get(e.texture).__webglTexture=t,H.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=H.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=H.get(e);if(o.__useDefaultFramebuffer!==void 0){V.bindFramebuffer(B.FRAMEBUFFER,o.__webglFramebuffer),I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest,V.viewport(I),V.scissor(ee),V.setScissorTest(te),P=-1;return}if(o.__webglFramebuffer===void 0)U.setupRenderTarget(e);else if(o.__hasExternalTextures)U.rebindTextures(e,H.get(e.texture).__webglTexture,H.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&H.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);U.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=H.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&U.useMultisampledRTT(e)===!1?H.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest}else I.copy(oe).multiplyScalar(z).floor(),ee.copy(se).multiplyScalar(z).floor(),te=ce;if(n!==0&&(r=O),V.bindFramebuffer(B.FRAMEBUFFER,r)&&V.drawBuffers(e,r),V.viewport(I),V.scissor(ee),V.setScissorTest(te),i){let r=H.get(e.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=H.get(e.textures[t]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=H.get(e.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,t.__webglTexture,n)}P=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){V.bindFramebuffer(B.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+s),!be.textureFormatReadable(c)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!be.textureTypeReadable(l)){X(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&B.readPixels(t,n,r,i,Ie.convert(c),Ie.convert(l),a)}finally{let e=N===null?null:H.get(N).__webglFramebuffer;V.bindFramebuffer(B.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=H.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c)if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){V.bindFramebuffer(B.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+s),!be.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!be.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,d),B.bufferData(B.PIXEL_PACK_BUFFER,a.byteLength,B.STREAM_READ),B.readPixels(t,n,r,i,Ie.convert(l),Ie.convert(u),0);let f=N===null?null:H.get(N).__webglFramebuffer;V.bindFramebuffer(B.FRAMEBUFFER,f);let p=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await fh(B,p,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,d),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,a),B.deleteBuffer(d),B.deleteSync(p),a}else throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;U.setTexture2D(e,0),B.copyTexSubImage2D(B.TEXTURE_2D,n,0,0,o,s,i,a),V.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ie.convert(t.format),_=Ie.convert(t.type),v;t.isData3DTexture?(U.setTexture3D(t,0),v=B.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(U.setTexture2DArray(t,0),v=B.TEXTURE_2D_ARRAY):(U.setTexture2D(t,0),v=B.TEXTURE_2D),V.activeTexture(B.TEXTURE0),V.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,t.flipY),V.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),V.pixelStorei(B.UNPACK_ALIGNMENT,t.unpackAlignment);let y=V.getParameter(B.UNPACK_ROW_LENGTH),b=V.getParameter(B.UNPACK_IMAGE_HEIGHT),x=V.getParameter(B.UNPACK_SKIP_PIXELS),S=V.getParameter(B.UNPACK_SKIP_ROWS),C=V.getParameter(B.UNPACK_SKIP_IMAGES);V.pixelStorei(B.UNPACK_ROW_LENGTH,h.width),V.pixelStorei(B.UNPACK_IMAGE_HEIGHT,h.height),V.pixelStorei(B.UNPACK_SKIP_PIXELS,l),V.pixelStorei(B.UNPACK_SKIP_ROWS,u),V.pixelStorei(B.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=H.get(e),r=H.get(t),h=H.get(n.__renderTarget),g=H.get(r.__renderTarget);V.bindFramebuffer(B.READ_FRAMEBUFFER,h.__webglFramebuffer),V.bindFramebuffer(B.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,H.get(e).__webglTexture,i,d+n),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,H.get(t).__webglTexture,a,m+n)),B.blitFramebuffer(l,u,o,s,f,p,o,s,B.DEPTH_BUFFER_BIT,B.NEAREST);V.bindFramebuffer(B.READ_FRAMEBUFFER,null),V.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||H.has(e)){let n=H.get(e),r=H.get(t);V.bindFramebuffer(B.READ_FRAMEBUFFER,k),V.bindFramebuffer(B.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,n.__webglTexture,i),T?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,r.__webglTexture,a),i===0?T?B.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):B.copyTexSubImage2D(v,a,f,p,l,u,o,s):B.blitFramebuffer(l,u,o,s,f,p,o,s,B.COLOR_BUFFER_BIT,B.NEAREST);V.bindFramebuffer(B.READ_FRAMEBUFFER,null),V.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?B.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?B.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):B.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):B.texSubImage2D(B.TEXTURE_2D,a,f,p,o,s,g,_,h);V.pixelStorei(B.UNPACK_ROW_LENGTH,y),V.pixelStorei(B.UNPACK_IMAGE_HEIGHT,b),V.pixelStorei(B.UNPACK_SKIP_PIXELS,x),V.pixelStorei(B.UNPACK_SKIP_ROWS,S),V.pixelStorei(B.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&B.generateMipmap(v),V.unbindTexture()},this.initRenderTarget=function(e){H.get(e).__webglFramebuffer===void 0&&U.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?U.setTextureCube(e,0):e.isData3DTexture?U.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?U.setTexture2DArray(e,0):U.setTexture2D(e,0),V.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,V.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return rh}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Xh._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xh._getUnpackColorSpace()}},Ow=0,kw={flat:Ow,pointy:Math.PI/6};function Aw(e,t,n){return(r,i,a,o,s,c,l,u)=>(e.push(r,i,a),t.push(o,s,c),n.push(l,u),e.length/3-1)}function jw(e,t,n,r){let i=new U_,a=[];i.setAttribute(`position`,new O_(new Float32Array(e),3)),i.setAttribute(`normal`,new O_(new Float32Array(t),3)),i.setAttribute(`uv`,new O_(new Float32Array(n),2));for(let[e,t]of r.entries())t.length&&(i.addGroup(a.length,t.length,e),a.push(...t));return i.setIndex(a),i.computeBoundingSphere(),i}function Mw({radius:e,height:t,chamfer:n=e*.12,orientation:r=Ow}){let i=[0,1,2,3,4,5].map(e=>r+e*Math.PI/3),a=Math.max(...i.map(t=>Math.abs(e*Math.cos(t)))),o=Math.max(...i.map(t=>Math.abs(e*Math.sin(t)))),s=[],c=[],l=[],u=[],d=[],f=[],p=Aw(s,c,l),m=t-n,h=(e,t)=>[e/(2*a)+.5,.5-t/(2*o)],g=p(0,t,0,0,1,0,.5,.5),_=i.map(r=>{let i=(e-n)*Math.cos(r),a=(e-n)*Math.sin(r);return{index:p(i,t,a,0,1,0,...h(i,a)),x:i,z:a}});for(let e=0;e<6;e++)u.push(g,_[(e+1)%6].index,_[e].index);let v=Math.SQRT1_2;for(let n=0;n<6;n++){let r=i[n],a=i[(n+1)%6],o=(r+a)/2,s=Math.cos(o),c=Math.sin(o),l=[e*Math.cos(r),e*Math.sin(r)],u=[e*Math.cos(a),e*Math.sin(a)],h=_[n],g=_[(n+1)%6],y=p(h.x,t,h.z,s*v,v,c*v,0,1),b=p(g.x,t,g.z,s*v,v,c*v,1,1),x=p(l[0],m,l[1],s*v,v,c*v,0,0),S=p(u[0],m,u[1],s*v,v,c*v,1,0);d.push(y,S,x,y,b,S);let C=p(l[0],m,l[1],s,0,c,0,1),w=p(u[0],m,u[1],s,0,c,1,1),T=p(l[0],0,l[1],s,0,c,0,0),E=p(u[0],0,u[1],s,0,c,1,0);f.push(C,E,T,C,w,E)}let y=p(0,0,0,0,-1,0,.5,.5),b=i.map(t=>p(e*Math.cos(t),0,e*Math.sin(t),0,-1,0,.5,.5));for(let e=0;e<6;e++)f.push(y,b[e],b[(e+1)%6]);return jw(s,c,l,[u,d,f])}function Nw({inner:e,outer:t,baseHalf:n,tipHalf:r,bottom:i,top:a}){let o=[],s=[],c=[],l=[],u=Aw(o,s,c),d=(e,...t)=>{let[n,r,i,a]=t.map(([t,n,r])=>u(t,n,r,...e,0,0));l.push(n,r,i,n,i,a)},f=Math.atan2(t-e,Math.max(n-r,1e-6)),p=[Math.sin(f),0,-Math.cos(f)];return d([0,1,0],[-n,a,-e],[n,a,-e],[r,a,-t],[-r,a,-t]),d([0,-1,0],[-n,i,-e],[-r,i,-t],[r,i,-t],[n,i,-e]),d([0,0,-1],[-r,a,-t],[r,a,-t],[r,i,-t],[-r,i,-t]),d([-p[0],0,p[2]],[-n,a,-e],[-r,a,-t],[-r,i,-t],[-n,i,-e]),d(p,[n,a,-e],[n,i,-e],[r,i,-t],[r,a,-t]),d([0,0,1],[-n,a,-e],[-n,i,-e],[n,i,-e],[n,a,-e]),jw(o,s,c,[l])}var Pw,Fw=/swiftshader|llvmpipe|software|basic render/i;function Iw(){if(typeof window>`u`||typeof document>`u`||new URLSearchParams(window.location.search).has(`flat`))return{webgl:!1,software:!1};try{let e=document.createElement(`canvas`).getContext(`webgl2`);if(!e)return{webgl:!1,software:!1};let t=e.getExtension(`WEBGL_debug_renderer_info`),n=String(t?e.getParameter(t.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER)),r=e.getExtension(`WEBGL_lose_context`);return r&&r.loseContext(),{webgl:!0,software:Fw.test(n)}}catch{return{webgl:!1,software:!1}}}function Lw(){return Pw||=Iw(),Pw}function Rw(){return Lw().webgl}function zw(){return Lw().software}var Bw=2,Vw=6,Hw=null,Uw=!1,Ww=new Set;function Gw(){if(!Uw){Uw=!0;for(let e of Ww)e()}}function Kw(e){return Ww.add(e),()=>Ww.delete(e)}function qw(){return Uw}function Jw(){return typeof window<`u`&&!!window.matchMedia&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function Yw(){let e=document.createElement(`canvas`);return e.id=`three-stage`,e.setAttribute(`aria-hidden`,`true`),Object.assign(e.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,display:`block`,pointerEvents:`none`,zIndex:`0`}),e}var Xw={left:-1/0,top:-1/0,right:1/0,bottom:1/0};function Zw(){let e=document.querySelector(`.game`);return e?e.getBoundingClientRect():Xw}function Qw(){let e=Yw(),t,n;try{n=zw(),t=new Dw({canvas:e,antialias:!n,alpha:!0,powerPreference:`high-performance`})}catch{return null}let r=()=>n?1:Math.min(window.devicePixelRatio||1,Bw);Xh.enabled=!0,t.outputColorSpace=Zm,t.toneMapping=7,t.toneMappingExposure=1.05,t.setClearColor(Zf,0),t.shadowMap.enabled=!1,t.autoClear=!1,document.body.appendChild(e);let i=new Set,a=0,o=0,s=null,c=0,l=!0,u=!1,d=0;function f(){let e=window.innerWidth,n=window.innerHeight;(e!==a||n!==o)&&(a=e,o=n,t.setPixelRatio(r()),t.setSize(a,o,!1),l=!0)}function p(e){let n=Math.min((e-c)/1e3,.1);if(c=e,!l&&!u&&++d<Vw)return;d=0,f();let r=[],s=l;u=!1,l=!1;let p=Zw();for(let e of i){let t=e.element.getBoundingClientRect();if(t.width<1||t.height<1)continue;(e.rect.width!==t.width||e.rect.height!==t.height||e.rect.left!==t.left||e.rect.top!==t.top)&&((e.rect.width!==t.width||e.rect.height!==t.height)&&e.onResize(t.width,t.height),e.rect=t,s=!0),e.update(n)&&(u=!0,s=!0),e.dirty&&(s=!0),e.dirty=!1;let i=e.overlay()?null:e.extent(),c=i?Math.max(t.left+i.left,t.left,p.left,0):Math.max(p.left,0),l=i?Math.min(t.left+i.right,t.right,p.right,a):Math.min(p.right,a),d=i?Math.max(t.top+i.top,t.top,p.top,0):Math.max(p.top,0),f=i?Math.min(t.top+i.bottom,t.bottom,p.bottom,o):Math.min(p.bottom,o);if(l-c<1||f-d<1)continue;let m=i?t:{left:c,top:d,right:l,bottom:f,width:l-c,height:f-d};e.widen&&e.widen(i?null:{left:m.left-t.left,top:m.top-t.top,width:m.width,height:m.height}),r.push({viewport:m,scissor:{left:c,top:d,right:l,bottom:f},well:e.well?e.well():null,inside:{left:Math.max(t.left,p.left,0),top:Math.max(t.top,p.top,0),right:Math.min(t.right,p.right,a),bottom:Math.min(t.bottom,p.bottom,o)},scene:e.scene,camera:e.camera,order:e.order})}if(r.sort((e,t)=>e.order-t.order),s){t.setScissorTest(!1),t.clear(),t.setScissorTest(!0);for(let{viewport:e,scissor:n,well:i,inside:a,scene:s,camera:c}of r)i&&a.right-a.left>=1&&a.bottom-a.top>=1&&(t.setScissor(a.left,o-a.bottom,a.right-a.left,a.bottom-a.top),t.setClearColor(i.color,i.alpha),t.clear(!0,!1,!1),t.setClearColor(Zf,0)),t.setViewport(e.left,o-e.bottom,e.width,e.height),t.setScissor(n.left,o-n.bottom,n.right-n.left,n.bottom-n.top),t.clearDepth(),t.render(s,c);t.setScissorTest(!1)}}function m(e){s=requestAnimationFrame(m);try{p(e)}catch(e){console.error(`three: giving up on the 3D board`,e),h(),Gw()}}function h(){s!==null&&(cancelAnimationFrame(s),s=null),i.clear(),t.dispose(),e.remove(),Hw=null}function g(){s===null&&i.size&&(c=performance.now(),s=requestAnimationFrame(m))}return e.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),h(),Gw()},!1),{renderer:t,addView(e){let n={...e,order:e.order||0,overlay:e.overlay||(()=>!1),rect:{width:0,height:0,left:0,top:0},dirty:!0};return i.add(n),l=!0,g(),{invalidate(){n.dirty=!0,l=!0},remove(){i.delete(n),l=!0,!i.size&&s!==null&&(cancelAnimationFrame(s),s=null,t.setScissorTest(!1),t.clear())}}},invalidateAll(){l=!0},dispose:h}}function $w(){if(Uw)return null;if(!Hw){if(!Rw())return Gw(),null;Hw=Qw(),Hw||Gw()}return Hw}var eT=.95,tT=.36,nT=.74,rT=.34,iT=.78,aT=.055,oT=.84,sT={tileRadius:eT,tileHeight:tT,tokenRadius:nT,tokenHeight:rT},cT=new Map;function lT(e,t){return cT.has(e)||cT.set(e,t()),cT.get(e)}var uT=()=>lT(`tile`,()=>Mw({radius:eT,height:tT,chamfer:eT*.14,orientation:kw.pointy})),dT=()=>lT(`token`,()=>Mw({radius:nT,height:rT,chamfer:nT*.16,orientation:kw.flat})),fT=()=>lT(`collar`,()=>Mw({radius:iT,height:aT,chamfer:iT*.1,orientation:kw.flat})),pT=()=>lT(`prow`,()=>Nw({inner:nT*Math.cos(Math.PI/6),outer:oT,baseHalf:.13,tipHalf:.028,bottom:.13,top:rT-.06})),mT=new Ob;function hT(e,t){return lT(`face-${e}-${t}`,()=>{let n=mT.load(`img/${e}-${t}.png`,()=>{let e=$w();e&&e.invalidateAll()},void 0,()=>{});return n.colorSpace=Zm,n.anisotropy=4,n})}var gT=()=>lT(`fade`,()=>{let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,`rgba(255,255,255,0.55)`),n.addColorStop(.55,`rgba(255,255,255,0.28)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64);let r=new Tv(e);return r.colorSpace=Zm,r.minFilter=Fp,r});function _T(e,t){let n=ip(e,t);return lT(`tile-${n.face}`,()=>[new ab({color:n.face,roughness:.68,metalness:.05}),new ab({color:n.chamfer,roughness:.3,metalness:.22}),new ab({color:n.wall,roughness:.55,metalness:.14})])}var vT=e=>lT(`collar-${e}`,()=>new ab({color:ap[e].collar,roughness:.5,metalness:.18}));function yT(e){let t=K.getTeam(e),n=K.getType(e);return{face:lT(`faceMaterial-${t}-${n}`,()=>new ab({map:hT(t,n),roughness:.45,metalness:.04})),chamfer:new ab({color:ap[t].rim,roughness:.28,metalness:.4,emissive:up,emissiveIntensity:0}),wall:new ab({color:ap[t].body,roughness:.34,metalness:.2})}}function bT(e,{key:t=3.05,rim:n=1,fill:r=.9,ambient:i=.62}={}){let a=new Gb(`#fff3e0`,t);a.position.set(-6,11,6);let o=new Gb(`#8fc0ff`,n);o.position.set(7,5,-8);let s=new Ab(`#b9cee8`,`#2c3646`,r),c=new Kb(`#6f7f99`,i);return e.add(a,o,s,c),{keyLight:a,rimLight:o,sky:s,ambient:c}}var xT=new Q(0,1,0),ST=22,CT=16;function wT(e){let t=Vh.degToRad(e);return new Q(0,Math.sin(t),Math.cos(t)).normalize()}function TT(e,t,n){return n.copy(t).project(e),n}function ET(e,t,n,r,i,a){let o=n/r,s=1-i,c=wT(a),l=new Q;for(let e of t)l.add(e);l.divideScalar(t.length||1),e.fov=ST,e.aspect=o,e.near=.1,e.updateProjectionMatrix();let u=new Q,d=new Q,f=new Q,p=new Q,m=40;for(let n=0;n<CT;n++){e.position.copy(c).multiplyScalar(m).add(l),e.up.copy(xT),e.lookAt(l),e.updateMatrixWorld(!0),e.updateProjectionMatrix();let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let o of t)TT(e,o,u),n=Math.min(n,u.x),r=Math.max(r,u.x),i=Math.min(i,u.y),a=Math.max(a,u.y);let h=Math.max((r-n)/(2*s),(a-i)/(2*s)),g=(n+r)/2,_=(i+a)/2,v=Math.tan(Vh.degToRad(ST)/2)*m,y=v*o;e.matrixWorld.extractBasis(d,f,p),l.addScaledVector(d,g*y).addScaledVector(f,_*v),m*=h}return e.position.copy(c).multiplyScalar(m).add(l),e.up.copy(xT),e.lookAt(l),e.far=m*3,e.updateProjectionMatrix(),e.updateMatrixWorld(!0),e}function DT(e,t,n,r,i,a){let o=e.project(t-i,r,n),s=e.project(t+i,r,n),c=e.project(t,r,n-a),l=e.project(t,r,n+a);return{left:`${o.x.toFixed(2)}px`,top:`${c.y.toFixed(2)}px`,width:`${(s.x-o.x).toFixed(2)}px`,height:`${(l.y-c.y).toFixed(2)}px`}}function OT({bounds:e,padding:t=.04,elevation:n=52}){let r=new Hb,i=new Hb,a=new Q,o=1,s=1,c={left:0,top:0,right:1,bottom:1};return{camera:i,resize(a,l){o=Math.max(a,1),s=Math.max(l,1),ET(r,e,o,s,t,n),i.copy(r);let u=1/0,d=1/0,f=-1/0,p=-1/0;for(let t of e){let e=this.project(t.x,t.y,t.z);u=Math.min(u,e.x),f=Math.max(f,e.x),d=Math.min(d,e.y),p=Math.max(p,e.y)}let m=Math.max(o,s)*.05;c={left:u-m,top:d-m,right:f+m,bottom:p+m}},extent(){return c},widen(e){if(!e){i.view&&i.view.enabled&&i.clearViewOffset();return}i.setViewOffset(o,s,e.left,e.top,e.width,e.height)},project(e,t,n){return TT(r,a.set(e,t,n),a),{x:(a.x*.5+.5)*o,y:(-a.y*.5+.5)*s}},unproject(e,t,n){if(a.set(e/o*2-1,-(t/s)*2+1,.5).unproject(r),a.sub(r.position).normalize(),Math.abs(a.y)<1e-6)return null;let i=(n-r.position.y)/a.y;return i<0?null:{x:r.position.x+a.x*i,z:r.position.z+a.z*i}}}}var kT=sT.tokenHeight*1.2,AT=sT.tokenHeight*3.4,jT={lift:22,travel:10,turn:16,glow:14,halo:6},MT=.42,NT=.004,PT=.8,FT,IT;function LT(){return FT||(FT=new qy(sT.tokenRadius*3.2,sT.tokenRadius*3.2),FT.rotateX(-Math.PI/2)),FT}function RT(){return IT||(IT=new qy(sT.tokenRadius*4,sT.tokenRadius*4),IT.rotateX(-Math.PI/2)),IT}function zT(e,t,n,r){return Jw()?t:e+(t-e)*(1-Math.exp(-n*r))}var BT=new qg(up),VT=new qg(dp);function HT(e){let{face:t,chamfer:n,wall:r}=yT(e),i=K.getTeam(e),a=new Bg,o=new Bg;a.add(o);let s=new fv(dT(),[t,n,r]),c=new fv(fT(),vT(i)),l=new fv(pT(),n);l.visible=!1,o.add(s,c,l);let u=new fv(LT(),new ev({map:gT(),color:pp,transparent:!0,depthWrite:!1,opacity:.8}));u.position.y=.012,u.renderOrder=-2,a.add(u);let d=new fv(RT(),new ev({map:gT(),color:new qg(fp),transparent:!0,depthWrite:!1,opacity:0}));d.position.y=.02,d.renderOrder=-3,d.visible=!1,a.add(d);let f={lift:0,glow:0,halo:0,angle:0,x:0,z:0,placed:!1},p={lift:0,glow:0,halo:0,angle:0,x:0,z:0},m=!1,h=0,g={x:0,z:0};return{pieceId:e,object:a,placeAt(e,t,n=0){f.x=e,f.z=t,f.lift=n,f.placed=!0,p.x=e,p.z=t,p.lift=n},distanceToGo(){return Math.hypot(f.x-p.x,f.z-p.z)},state(){return g},set(e){let{x:t,z:r,direction:i,selected:a,snipe:o,buffed:s,immediate:c,carried:u}=e;g=e,p.x=t,p.z=r,p.angle=Vh.degToRad(-Qd(i)),p.lift=u?AT:a?kT:0,p.glow=a||o?1:0,p.halo=s?.32:0,l.visible=!!i,m=!!o,n.emissive.copy(o?VT:BT),(c||!f.placed)&&(f.x=t,f.z=r,f.angle=p.angle,f.placed=!0),f.angle+=Math.PI*2*Math.round((p.angle-f.angle)/(Math.PI*2))},update(e){h+=e,f.x=zT(f.x,p.x,jT.travel,e),f.z=zT(f.z,p.z,jT.travel,e),f.lift=zT(f.lift,p.lift,jT.lift,e),f.angle=zT(f.angle,p.angle,jT.turn,e),f.halo=zT(f.halo,p.halo,jT.halo,e);let t=m&&!Jw(),r=t?.775+.225*Math.sin(h*PT*Math.PI*2):p.glow;f.glow=zT(f.glow,r,jT.glow,e);let i=Math.abs(f.x-p.x)>NT||Math.abs(f.z-p.z)>NT||Math.abs(f.lift-p.lift)>NT||Math.abs(f.angle-p.angle)>NT||Math.abs(f.halo-p.halo)>NT||Math.abs(f.glow-r)>NT;i||(f.x=p.x,f.z=p.z,f.lift=p.lift,f.angle=p.angle,f.halo=p.halo,f.glow=r);let s=Math.min(Math.hypot(f.x-p.x,f.z-p.z)*MT,AT),c=f.lift+s;a.position.set(f.x,0,f.z),o.position.y=c,o.rotation.y=f.angle,n.emissiveIntensity=f.glow*.85;let l=Math.max(0,1-c/kT);return u.material.opacity=.45+.35*l,u.scale.setScalar(1+Math.min(c/kT,3)*.35),d.visible=f.halo>.005,d.material.opacity=f.halo,t||i},dispose(){n.dispose(),r.dispose(),u.material.dispose(),d.material.dispose()}}}var UT=sT.tokenRadius*1.18,WT=.55,GT=.8,KT=9,qT={left:0,top:0,right:1/0,bottom:1/0},JT=.09;function YT(e,t,n,r){let i=new oy,a=e/2-n,o=t/2-n;i.moveTo(-a,-o-n),i.lineTo(a,-o-n),i.quadraticCurveTo(a+n,-o-n,a+n,-o),i.lineTo(a+n,o),i.quadraticCurveTo(a+n,o+n,a,o+n),i.lineTo(-a,o+n),i.quadraticCurveTo(-a-n,o+n,-a-n,o),i.lineTo(-a-n,-o),i.quadraticCurveTo(-a-n,-o-n,-a,-o-n);let s=new Wy(i,{depth:r,bevelEnabled:!0,bevelThickness:JT,bevelSize:JT,bevelSegments:2,curveSegments:4});return s.rotateX(-Math.PI/2),s.translate(0,-(r+JT),0),s}function XT(e,t){let n=new Jy(e,t,6,1,Math.PI/2);return n.rotateX(-Math.PI/2),n}var ZT={};function QT(e,t){return ZT[e]||(ZT[e]=t()),ZT[e]}function $T(e,t){let n=new Yg,r=op[e];bT(n,{key:2.7,rim:1.25,fill:1,ambient:.68});let i=ef(),a=Math.max(...i.map(e=>Math.abs(e.x)))+Hd/2,o=Math.max(...i.map(e=>Math.abs(e.z)))+Ud/2,s=new fv(QT(`deck`,()=>YT(2*(a+GT)+KT,2*(o+GT)+KT,.5,WT)),QT(`deckMaterial-${e}`,()=>new ab({color:r.deck,roughness:.55,metalness:.12})));n.add(s);for(let t of i){let i=new fv(QT(`well`,()=>XT(0,UT)),QT(`wellMaterial-${e}`,()=>new ev({color:r.socket,transparent:!0,opacity:.85,depthWrite:!1}))),a=new fv(QT(`lip`,()=>XT(UT*.9,UT)),QT(`lipMaterial-${e}`,()=>new ab({color:r.frame,roughness:.35,metalness:.35})));i.position.set(t.x,.004,t.z),a.position.set(t.x,.008,t.z),i.rotation.y=Math.PI/6,a.rotation.y=Math.PI/6,n.add(i,a)}let c=[];for(let e of i)for(let t of[0,sT.tokenHeight])c.push(new Q(e.x-Hd/2,t,e.z-Ud/2),new Q(e.x+Hd/2,t,e.z+Ud/2));let l=OT({bounds:c,padding:.03,elevation:44}),u=new Map(i.map(e=>[e.key,e])),d=new Map,f=null,p=null;return{scene:n,camera:l.camera,resize(e,t){l.resize(e,t)},extent:()=>qT,layout(){let e={};for(let t of i)e[t.key]=DT(l,t.x,t.z,0,Hd/2,Ud/2);return e},setDragging(e){p=e;for(let[e,t]of d)t.object.visible=e!==p},setState({pieces:e}){let r=e.map(e=>`${e.id}${e.selected?`!`:``}`).join();if(r===f)return!1;f=r;let i=t.getBoundingClientRect(),a=new Set;for(let t of e){let e=u.get(tf(t.id));if(!e)continue;if(a.add(t.id),!d.has(t.id)){let e=HT(t.id);d.set(t.id,e),n.add(e.object)}d.get(t.id).set({x:e.x,z:e.z,direction:void 0,selected:t.selected,snipe:!1,buffed:!1}),d.get(t.id).object.visible=t.id!==p;let r=l.project(e.x,0,e.z);nc(t.id,i.left+r.x,i.top+r.y)}for(let[e,t]of d)a.has(e)||(n.remove(t.object),t.dispose(),d.delete(e));return!0},update(e){let t=!1;for(let n of d.values())n.update(e)&&(t=!0);return t},dispose(){for(let e of d.values())e.dispose();d.clear()}}}var eE=()=>Rw()&&!qw(),tE=()=>!1;function nE(){return(0,v.useSyncExternalStore)(Kw,eE,tE)}function rE(e,t,n){let r=nE(),[i,a]=(0,v.useState)(null),o=(0,v.useRef)(null),s=(0,v.useRef)(null),c=(0,v.useRef)(null),l=(0,v.useRef)(n);return(0,v.useEffect)(()=>{l.current=n}),(0,v.useLayoutEffect)(()=>{let n=e.current;if(!r||!n)return;let i=$w();if(!i)return;let u=t(n);o.current=u,u.setState(l.current);let d=0,f=0;function p(){let e=n.getBoundingClientRect();e.width<1||e.height<1||(e.width!==d||e.height!==f)&&(d=e.width,f=e.height,u.resize(d,f),a(u.layout()))}p(),c.current=p;let m=i.addView({element:n,scene:u.scene,camera:u.camera,onResize:p,extent:u.extent,well:u.well,overlay:u.overlay,widen:u.widen,order:u.order,update:e=>u.update(e)});s.current=m;let h=u.setDragging?oc(e=>{u.setDragging(e),m.invalidate()}):null;return()=>{h&&h(),m.remove(),u.dispose(),o.current=null,s.current=null,c.current=null,a(null)}},[r,e,t]),(0,v.useLayoutEffect)(()=>{c.current&&c.current()}),(0,v.useEffect)(()=>{let e=o.current;e&&e.setState(n)!==!1&&s.current&&s.current.invalidate()},[n]),r?i:null}function iE(e,t,[n,r]=[]){return n===void 0||r===void 0?`img/${e}-${t}.png`:`img/${e}-${t}-${n}${r}.png`}function aE({id:e,selectedDirection:t,selected:n,highlight:r,box:i}){let a=K.getTeam(e),o=K.getType(e),s=`img/${a}-${o}.png`,[{snipe:c},l]=(0,v.useContext)(Gs),{startDrag:u,isClickSuppressed:d}=mc(),f=Qs(),p=$s(),m=c&&r&&K.isSniper(e)?p:f,h=(0,v.useCallback)(()=>{d()||!m||l($a(e))},[l,e,d,m]),g=(0,v.useCallback)(r=>u(r,{previewSrc:iE(a,o,t),pieceId:e,onStart:()=>{!n&&m&&l($a(e))}}),[u,a,o,t,n,l,e,m]);return(0,q.jsx)(vp,{id:`pz-${e}`,className:`piece-styled`,src:s,draggable:`false`,pieceId:e,selected:n,highlight:r,selectedDirection:t,projected:!!i,style:i,onClick:h,onPointerDown:g})}function oE(e,t){return K.getAllTeamPieces(t,e).filter(e=>!e.position)}function sE({team:e}){let[{pieces:t,players:n,teamControl:r,hasTurnEnded:i},a]=(0,v.useContext)(Gs),o=(0,v.useRef)(null),s=r[e].player,c=r[e].prevPlayer,l=r[e].claimEnabled,u=r[e].controlling,d=jr.getTurn(n),f=s&&!u||!!c,p=(s||c)&&u,m=!!l||f,h=!!l&&!i,g=(0,v.useCallback)(()=>{f?a(lo(e)):l&&a(so(d,e))},[f,l,a,e,d]),_=(0,v.useMemo)(()=>oE(t,e),[t,e]),y=rE(o,(0,v.useCallback)(t=>$T(e,t),[e]),(0,v.useMemo)(()=>({pieces:_}),[_]));return(0,q.jsxs)(_p,{team:e,dimensional:!!y,children:[(0,q.jsxs)(Uf,{id:`hq-label-${e}`,children:[Xn[e],(0,q.jsx)(Wf,{children:String(Number(e)+1).padStart(2,`0`)})]}),(0,q.jsx)(Hf,{id:`store-${e}`,ref:o,dimensional:!!y,children:_.map(e=>(0,q.jsx)(aE,{...e,box:y&&y[tf(e.id)]},e.id))}),(0,q.jsx)(Ep,{team:e,dimensional:!!y}),(0,q.jsxs)(Gf,{children:[(0,q.jsx)(Kf,{id:`hq-control-${e}`,$held:!!p,$flat:!y,children:p&&(0,q.jsx)(Jf,{id:`controlled-${e}`,children:c||s})}),m&&(0,q.jsx)(qf,{id:`claim-${e}`,active:h,onClick:g,children:f?`CANCEL`:`CLAIM`})]})]},`team${e}`)}var cE=sT.tileHeight,lE=.4,uE=.05,dE=(3*Ud+sT.tileRadius+.45)/Math.cos(Math.PI/6),fE=.75,pE={};function mE(e,t){return pE[e]||(pE[e]=t()),pE[e]}function hE(e,t){let n=new Jy(e,t,6,1,Math.PI/2);return n.rotateX(-Math.PI/2),n}function gE(e,t,n,r,i){return new fv(mE(`ring-${e}`,()=>hE(t,n)),mE(`ringMaterial-${e}`,()=>new ev({color:r,transparent:!0,opacity:i,depthWrite:!1})))}function _E(e){let t=$f(e),n=new fv(mE(`plinth`,()=>Mw({radius:dE,height:fE,chamfer:.3,orientation:kw.flat})),mE(`plinthMaterials-${e}`,()=>[new ab({color:t.plinth,roughness:.85,metalness:.1}),new ab({color:t.plinthEdge,roughness:.4,metalness:.3}),new ab({color:t.plinth,roughness:.85,metalness:.1})]));return n.position.y=-fE,n}var vE=[{key:`wash`,inner:0,outer:sT.tileRadius*.84,color:sp,signal:!0,opacity:.09,lift:.006,order:1},{key:`rim`,inner:sT.tileRadius*.855,outer:sT.tileRadius*.9,color:sp,signal:!0,opacity:.8,lift:.008,order:2},{key:`keyline`,inner:sT.tileRadius*.9,outer:sT.tileRadius*.912,color:gp,opacity:.85,lift:.008,order:3}];function yE(e,t){return mE(`ringMaterial-${e.key}-${t}`,()=>{let n=t&&lp(t);return new ev({color:n&&e.signal?n.color:e.color,transparent:!0,opacity:n?e.opacity*n.fade:e.opacity,depthWrite:!1})})}function bE(){let e=new Bg,t=vE.map(e=>{let t=new fv(mE(`ring-${e.key}`,()=>hE(e.inner,e.outer)),yE(e,0));return t.position.y=cE+e.lift,t.renderOrder=e.order,t});return e.add(...t),e.visible=!1,Object.assign(e,{setLevel(e){t.forEach((t,n)=>{t.material=yE(vE[n],e)})}})}var xE=6;function SE(){let e=gE(`aim`,sT.tileRadius*.66,sT.tileRadius*.86,mp,.62);return e.renderOrder=2,e.visible=!1,e}function CE(e,t){let n=new Yg,{well:r,wellAlpha:i}=$f(t),a=Object.freeze({color:r,alpha:i});bT(n),n.add(_E(t));let o=Xd(),s=new Map,c=new Map;for(let e of o){if(!e.playable)continue;let t=new fv(uT(),_T(e.row,e.cell));t.position.set(e.x,0,e.z);let r=bE();t.add(r),n.add(t),s.set(`${e.row}-${e.cell}`,{tile:t,rise:0,wanted:0}),c.set(`${e.row}-${e.cell}`,r)}let l=new fv(mE(`centreGeometry`,()=>hE(sT.tileRadius*.14,sT.tileRadius*.3)),mE(`centreMaterial`,()=>new ab({color:Qf.centre,roughness:.35,metalness:.45})));l.position.set(0,cE+.004,0),s.get(`3-3`).tile.add(l);let u=gE(`hover`,sT.tileRadius*.9,sT.tileRadius*.99,hp,.5);u.position.y=cE+.01,u.renderOrder=1,u.visible=!1;let d=[];for(let e=0;e<xE;e++){let e=SE();d.push(e),n.add(e)}let f=[];for(let e of o)for(let t of[0,cE])f.push(new Q(e.x-Hd/2,t,e.z-Ud/2),new Q(e.x+Hd/2,t,e.z+Ud/2));let p=OT({bounds:f,padding:.02}),m=new Map,h=new Map,g=null,_=null,v=!1;function y(t,n,r){let i=e.getBoundingClientRect();return i.width<1||i.height<1?null:p.unproject(t-i.left,n-i.top,r)}function b(){let e=$w();e&&e.invalidateAll()}function x(t){let n=e.getBoundingClientRect(),r=p.project(t.object.position.x,cE,t.object.position.z);return{x:n.left+r.x,y:n.top+r.y}}let S=new Bg;S.position.y=cE,n.add(S,u);function C(e){if(!m.has(e)){let t=HT(e),n=rc(e),r=n&&y(n.x,n.y,cE);m.set(e,t),S.add(t.object),r&&t.placeAt(r.x,r.z,AT*.5)}return m.get(e)}let w={scene:n,camera:p.camera,order:1,resize(e,t){p.resize(e,t)},extent:p.extent,well:()=>a,overlay:()=>!!_||v,widen:p.widen,grab(e){let t=m.has(e),n=C(e);return _={pieceId:e,onBoard:t},n.set({...n.state(),carried:!0}),b(),!0},carryTo(e,t){let n=_&&m.get(_.pieceId),r=n&&y(e,t,cE+AT);r&&(n.placeAt(r.x,r.z,AT),nc(_.pieceId,e,t))},drop(){if(!_)return;let{pieceId:e,onBoard:t}=_,n=m.get(e);if(_=null,b(),n){if(t){n.set({...n.state(),carried:!1});return}S.remove(n.object),n.dispose(),m.delete(e)}},layout(){let e={};for(let t of o)e[`${t.row}-${t.cell}`]=DT(p,t.x,t.z,cE,Hd/2,Ud/2);return e},setState({pieces:e,highlightedPositions:t,previewPositions:n=[],snipe:r,aim:i,hovered:a}){let o=[e.filter(e=>e.position&&!e.killed).map(e=>`${e.id}@${e.position}/${e.selectedDirection}${e.selected?`s`:``}${e.highlight?`h`:``}${e.buffed?`b`:``}`).join(),t.join(`;`),n.map(e=>e.join(`;`)).join(`+`),r?`snipe`:``,i?`${i.from}>${i.directions.join(`;`)}`:``].join(`|`);if(o===g)return!1;g=o;for(let e of c.values())e.visible=!1;for(let e of s.values())e.wanted=0;n.forEach((e,t)=>{for(let[n,r]of e){let e=c.get(`${n}-${r}`);e&&(e.setLevel(t+1),e.visible=!0)}});for(let[e,n]of t){let t=`${e}-${n}`,r=c.get(t);r&&(r.setLevel(0),r.visible=!0,s.get(t).wanted=uE)}for(let e of d)e.visible=!1;if(i){let e=Kd(i.from[0],i.from[1]);i.directions.slice(0,xE).forEach((t,n)=>{let r=Qd(t)*Math.PI/180,i=d[n];i.position.set(e.x+Hd*Math.sin(r),cE+.01,e.z-Hd*Math.cos(r)),i.visible=!0})}let l=a&&s.get(`${a[0]}-${a[1]}`);if(u.visible=!!l,l){let e=Kd(a[0],a[1]);u.position.set(e.x,cE+.01,e.z)}let f=new Set;for(let t of e){if(t.killed||!t.position||!Yd(t.position[0],t.position[1]))continue;let{x:e,z:n}=Kd(t.position[0],t.position[1]),i=C(t.id);f.add(t.id),h.set(t.id,`${t.position[0]}-${t.position[1]}`),!(_&&_.pieceId===t.id)&&i.set({x:e,z:n,direction:t.selectedDirection,selected:t.selected,snipe:!!r&&t.highlight&&K.isSniper(t.id),buffed:t.buffed})}for(let[e,t]of m)_&&_.pieceId===e||f.has(e)||(S.remove(t.object),t.dispose(),m.delete(e),h.delete(e));return!0},update(e){let t=!!_,n=!!_,r=Jw();for(let n of s.values())!r&&Math.abs(n.rise-n.wanted)>uE*.02?(n.rise+=(n.wanted-n.rise)*(1-Math.exp(-18*e)),t=!0):n.rise=n.wanted,n.tile.position.y=n.rise;for(let[r,i]of m){i.update(e)&&(t=!0);let a=s.get(h.get(r));i.object.position.y=a?a.rise:0,i.distanceToGo()>lE&&(n=!0);let o=x(i);nc(r,o.x,o.y)}return v=n,t},dispose(){lc(null);for(let e of m.values())e.dispose();m.clear()}};return lc(w),w}function wE(){return wE=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},wE.apply(this,arguments)}function TE(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function EE(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function DE(e){return DE=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},DE(e)}function OE(e,t){return OE=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},OE(e,t)}function kE(e){return Function.toString.call(e).indexOf(`[native code]`)!==-1}function AE(){if(typeof Reflect>`u`||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy==`function`)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function jE(e,t,n){return jE=AE()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var i=new(Function.bind.apply(e,r));return n&&OE(i,n.prototype),i},jE.apply(null,arguments)}function ME(e){var t=typeof Map==`function`?new Map:void 0;return ME=function(e){if(e===null||!kE(e))return e;if(typeof e!=`function`)throw TypeError(`Super expression must either be null or a function`);if(t!==void 0){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return jE(e,arguments,DE(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),OE(n,e)},ME(e)}function NE(e,t){return t||=e.slice(0),e.raw=t,e}var PE=function(e){EE(t,e);function t(t){return TE(e.call(this,`An error occurred. See https://github.com/styled-components/polished/blob/master/src/internalHelpers/errors.md#`+t+` for more information.`)||this)}return t}(ME(Error));function FE(e){for(var t=``,n=[...arguments].slice(1),r=0;r<e.length;r+=1)if(t+=e[r],r===n.length-1&&n[r]){var i=n.filter(function(e){return!!e});i.length>1?(t=t.slice(0,-1),t+=`, `+n[r]):i.length===1&&(t+=``+n[r])}else n[r]&&(t+=n[r]+` `);return t.trim()}function IE(){var e=NE([`linear-gradient(`,``,`)`]);return IE=function(){return e},e}function LE(e){var t=e.colorStops,n=e.fallback,r=e.toDirection,i=r===void 0?``:r;if(!t||t.length<2)throw new PE(56);return{backgroundColor:n||t[0].split(` `)[0],backgroundImage:FE(IE(),i,t.join(`, `))}}function RE(){var e=NE([`radial-gradient(`,``,``,``,`)`]);return RE=function(){return e},e}function zE(e){var t=e.colorStops,n=e.extent,r=n===void 0?``:n,i=e.fallback,a=e.position,o=a===void 0?``:a,s=e.shape,c=s===void 0?``:s;if(!t||t.length<2)throw new PE(57);return{backgroundColor:i||t[0].split(` `)[0],backgroundImage:FE(RE(),o,c,r,t.join(`, `))}}function BE(e){return Math.round(e*255)}function VE(e,t,n){return BE(e)+`,`+BE(t)+`,`+BE(n)}function HE(e,t,n,r){if(r===void 0&&(r=VE),t===0)return r(n,n,n);var i=(e%360+360)%360/60,a=(1-Math.abs(2*n-1))*t,o=a*(1-Math.abs(i%2-1)),s=0,c=0,l=0;i>=0&&i<1?(s=a,c=o):i>=1&&i<2?(s=o,c=a):i>=2&&i<3?(c=a,l=o):i>=3&&i<4?(c=o,l=a):i>=4&&i<5?(s=o,l=a):i>=5&&i<6&&(s=a,l=o);var u=n-a/2,d=s+u,f=c+u,p=l+u;return r(d,f,p)}var UE={aliceblue:`f0f8ff`,antiquewhite:`faebd7`,aqua:`00ffff`,aquamarine:`7fffd4`,azure:`f0ffff`,beige:`f5f5dc`,bisque:`ffe4c4`,black:`000`,blanchedalmond:`ffebcd`,blue:`0000ff`,blueviolet:`8a2be2`,brown:`a52a2a`,burlywood:`deb887`,cadetblue:`5f9ea0`,chartreuse:`7fff00`,chocolate:`d2691e`,coral:`ff7f50`,cornflowerblue:`6495ed`,cornsilk:`fff8dc`,crimson:`dc143c`,cyan:`00ffff`,darkblue:`00008b`,darkcyan:`008b8b`,darkgoldenrod:`b8860b`,darkgray:`a9a9a9`,darkgreen:`006400`,darkgrey:`a9a9a9`,darkkhaki:`bdb76b`,darkmagenta:`8b008b`,darkolivegreen:`556b2f`,darkorange:`ff8c00`,darkorchid:`9932cc`,darkred:`8b0000`,darksalmon:`e9967a`,darkseagreen:`8fbc8f`,darkslateblue:`483d8b`,darkslategray:`2f4f4f`,darkslategrey:`2f4f4f`,darkturquoise:`00ced1`,darkviolet:`9400d3`,deeppink:`ff1493`,deepskyblue:`00bfff`,dimgray:`696969`,dimgrey:`696969`,dodgerblue:`1e90ff`,firebrick:`b22222`,floralwhite:`fffaf0`,forestgreen:`228b22`,fuchsia:`ff00ff`,gainsboro:`dcdcdc`,ghostwhite:`f8f8ff`,gold:`ffd700`,goldenrod:`daa520`,gray:`808080`,green:`008000`,greenyellow:`adff2f`,grey:`808080`,honeydew:`f0fff0`,hotpink:`ff69b4`,indianred:`cd5c5c`,indigo:`4b0082`,ivory:`fffff0`,khaki:`f0e68c`,lavender:`e6e6fa`,lavenderblush:`fff0f5`,lawngreen:`7cfc00`,lemonchiffon:`fffacd`,lightblue:`add8e6`,lightcoral:`f08080`,lightcyan:`e0ffff`,lightgoldenrodyellow:`fafad2`,lightgray:`d3d3d3`,lightgreen:`90ee90`,lightgrey:`d3d3d3`,lightpink:`ffb6c1`,lightsalmon:`ffa07a`,lightseagreen:`20b2aa`,lightskyblue:`87cefa`,lightslategray:`789`,lightslategrey:`789`,lightsteelblue:`b0c4de`,lightyellow:`ffffe0`,lime:`0f0`,limegreen:`32cd32`,linen:`faf0e6`,magenta:`f0f`,maroon:`800000`,mediumaquamarine:`66cdaa`,mediumblue:`0000cd`,mediumorchid:`ba55d3`,mediumpurple:`9370db`,mediumseagreen:`3cb371`,mediumslateblue:`7b68ee`,mediumspringgreen:`00fa9a`,mediumturquoise:`48d1cc`,mediumvioletred:`c71585`,midnightblue:`191970`,mintcream:`f5fffa`,mistyrose:`ffe4e1`,moccasin:`ffe4b5`,navajowhite:`ffdead`,navy:`000080`,oldlace:`fdf5e6`,olive:`808000`,olivedrab:`6b8e23`,orange:`ffa500`,orangered:`ff4500`,orchid:`da70d6`,palegoldenrod:`eee8aa`,palegreen:`98fb98`,paleturquoise:`afeeee`,palevioletred:`db7093`,papayawhip:`ffefd5`,peachpuff:`ffdab9`,peru:`cd853f`,pink:`ffc0cb`,plum:`dda0dd`,powderblue:`b0e0e6`,purple:`800080`,rebeccapurple:`639`,red:`f00`,rosybrown:`bc8f8f`,royalblue:`4169e1`,saddlebrown:`8b4513`,salmon:`fa8072`,sandybrown:`f4a460`,seagreen:`2e8b57`,seashell:`fff5ee`,sienna:`a0522d`,silver:`c0c0c0`,skyblue:`87ceeb`,slateblue:`6a5acd`,slategray:`708090`,slategrey:`708090`,snow:`fffafa`,springgreen:`00ff7f`,steelblue:`4682b4`,tan:`d2b48c`,teal:`008080`,thistle:`d8bfd8`,tomato:`ff6347`,turquoise:`40e0d0`,violet:`ee82ee`,wheat:`f5deb3`,white:`fff`,whitesmoke:`f5f5f5`,yellow:`ff0`,yellowgreen:`9acd32`};function WE(e){if(typeof e!=`string`)return e;var t=e.toLowerCase();return UE[t]?`#`+UE[t]:e}var GE=/^#[a-fA-F0-9]{6}$/,KE=/^#[a-fA-F0-9]{8}$/,qE=/^#[a-fA-F0-9]{3}$/,JE=/^#[a-fA-F0-9]{4}$/,YE=/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i,XE=/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i,ZE=/^hsl\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i,QE=/^hsla\(\s*(\d{0,3}[.]?[0-9]+)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/i;function $E(e){if(typeof e!=`string`)throw new PE(3);var t=WE(e);if(t.match(GE))return{red:parseInt(``+t[1]+t[2],16),green:parseInt(``+t[3]+t[4],16),blue:parseInt(``+t[5]+t[6],16)};if(t.match(KE)){var n=parseFloat((parseInt(``+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(``+t[1]+t[2],16),green:parseInt(``+t[3]+t[4],16),blue:parseInt(``+t[5]+t[6],16),alpha:n}}if(t.match(qE))return{red:parseInt(``+t[1]+t[1],16),green:parseInt(``+t[2]+t[2],16),blue:parseInt(``+t[3]+t[3],16)};if(t.match(JE)){var r=parseFloat((parseInt(``+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(``+t[1]+t[1],16),green:parseInt(``+t[2]+t[2],16),blue:parseInt(``+t[3]+t[3],16),alpha:r}}var i=YE.exec(t);if(i)return{red:parseInt(``+i[1],10),green:parseInt(``+i[2],10),blue:parseInt(``+i[3],10)};var a=XE.exec(t);if(a)return{red:parseInt(``+a[1],10),green:parseInt(``+a[2],10),blue:parseInt(``+a[3],10),alpha:parseFloat(``+a[4])};var o=ZE.exec(t);if(o){var s=`rgb(`+HE(parseInt(``+o[1],10),parseInt(``+o[2],10)/100,parseInt(``+o[3],10)/100)+`)`,c=YE.exec(s);if(!c)throw new PE(4,t,s);return{red:parseInt(``+c[1],10),green:parseInt(``+c[2],10),blue:parseInt(``+c[3],10)}}var l=QE.exec(t);if(l){var u=`rgb(`+HE(parseInt(``+l[1],10),parseInt(``+l[2],10)/100,parseInt(``+l[3],10)/100)+`)`,d=YE.exec(u);if(!d)throw new PE(4,t,u);return{red:parseInt(``+d[1],10),green:parseInt(``+d[2],10),blue:parseInt(``+d[3],10),alpha:parseFloat(``+l[4])}}throw new PE(5)}function eD(e){var t=e.red/255,n=e.green/255,r=e.blue/255,i=Math.max(t,n,r),a=Math.min(t,n,r),o=(i+a)/2;if(i===a)return e.alpha===void 0?{hue:0,saturation:0,lightness:o}:{hue:0,saturation:0,lightness:o,alpha:e.alpha};var s,c=i-a,l=o>.5?c/(2-i-a):c/(i+a);switch(i){case t:s=(n-r)/c+(n<r?6:0);break;case n:s=(r-t)/c+2;break;default:s=(t-n)/c+4}return s*=60,e.alpha===void 0?{hue:s,saturation:l,lightness:o}:{hue:s,saturation:l,lightness:o,alpha:e.alpha}}function tD(e){return eD($E(e))}var nD=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?`#`+e[1]+e[3]+e[5]:e};function rD(e){var t=e.toString(16);return t.length===1?`0`+t:t}function iD(e){return rD(Math.round(e*255))}function aD(e,t,n){return nD(`#`+iD(e)+iD(t)+iD(n))}function oD(e,t,n){return HE(e,t,n,aD)}function sD(e,t,n){if(typeof e==`number`&&typeof t==`number`&&typeof n==`number`)return oD(e,t,n);if(typeof e==`object`&&t===void 0&&n===void 0)return oD(e.hue,e.saturation,e.lightness);throw new PE(1)}function cD(e,t,n,r){if(typeof e==`number`&&typeof t==`number`&&typeof n==`number`&&typeof r==`number`)return r>=1?oD(e,t,n):`rgba(`+HE(e,t,n)+`,`+r+`)`;if(typeof e==`object`&&t===void 0&&n===void 0&&r===void 0)return e.alpha>=1?oD(e.hue,e.saturation,e.lightness):`rgba(`+HE(e.hue,e.saturation,e.lightness)+`,`+e.alpha+`)`;throw new PE(2)}function lD(e,t,n){if(typeof e==`number`&&typeof t==`number`&&typeof n==`number`)return nD(`#`+rD(e)+rD(t)+rD(n));if(typeof e==`object`&&t===void 0&&n===void 0)return nD(`#`+rD(e.red)+rD(e.green)+rD(e.blue));throw new PE(6)}function uD(e,t,n,r){if(typeof e==`string`&&typeof t==`number`){var i=$E(e);return`rgba(`+i.red+`,`+i.green+`,`+i.blue+`,`+t+`)`}if(typeof e==`number`&&typeof t==`number`&&typeof n==`number`&&typeof r==`number`)return r>=1?lD(e,t,n):`rgba(`+e+`,`+t+`,`+n+`,`+r+`)`;if(typeof e==`object`&&t===void 0&&n===void 0&&r===void 0)return e.alpha>=1?lD(e.red,e.green,e.blue):`rgba(`+e.red+`,`+e.green+`,`+e.blue+`,`+e.alpha+`)`;throw new PE(7)}var dD=function(e){return typeof e.red==`number`&&typeof e.green==`number`&&typeof e.blue==`number`&&(typeof e.alpha!=`number`||e.alpha===void 0)},fD=function(e){return typeof e.red==`number`&&typeof e.green==`number`&&typeof e.blue==`number`&&typeof e.alpha==`number`},pD=function(e){return typeof e.hue==`number`&&typeof e.saturation==`number`&&typeof e.lightness==`number`&&(typeof e.alpha!=`number`||e.alpha===void 0)},mD=function(e){return typeof e.hue==`number`&&typeof e.saturation==`number`&&typeof e.lightness==`number`&&typeof e.alpha==`number`};function hD(e){if(typeof e!=`object`)throw new PE(8);if(fD(e))return uD(e);if(dD(e))return lD(e);if(mD(e))return cD(e);if(pD(e))return sD(e);throw new PE(8)}function gD(e,t,n){return function(){var r=n.concat(Array.prototype.slice.call(arguments));return r.length>=t?e.apply(this,r):gD(e,t,r)}}function _D(e){return gD(e,e.length,[])}function vD(e,t,n){return Math.max(e,Math.min(t,n))}function yD(e,t){if(t===`transparent`)return t;var n=tD(t);return hD(wE({},n,{lightness:vD(0,1,n.lightness-parseFloat(e))}))}var bD=_D(yD);function xD(e,t){if(t===`transparent`)return t;var n=tD(t);return hD(wE({},n,{lightness:vD(0,1,n.lightness+parseFloat(e))}))}var SD=_D(xD),CD=.3,wD=`#a1abb7`,TD=[[0,3,3,6],[3,2,4,2,3],[3,4,3,0,4,3],[6,2,0,0,3,2,0],[3,4,3,0,4,3],[3,2,4,2,3],[0,3,3,6]],ED=(e,t)=>TD[e][t],DD=(e,t)=>ED(e,t)*6/100,OD=(e,t)=>bD(DD(e,t),wD),kD=(e,t)=>{let n=0;return e>3&&(n=180),e===3&&t<4&&(n=270),e===3&&t>=4&&(n=90),n},AD=(e,t,n)=>LE({colorStops:[`${e} 0%`,`${t} 100%`],toDirection:`${n}deg`}),jD=(e,t,n)=>zE({shape:`circle`,colorStops:[`${SD(n,e)} 0%`,`${SD(n,t)} 100%`]}),MD=e=>Dn(({row:t,cell:n})=>{let r=OD(t,n),i=SD(CD/2,r),a=bD(CD/2,r),o=bD(CD/4,i),s=SD(CD/4,a),c=kD(t,n),l=[o,s];t===3&&(l=[i,a]);let u=[AD(l[0],l[1],c),AD(i,a,c-60),AD(i,a,c+60),AD(SD(.05,l[0]),SD(.05,l[1]),c),AD(SD(.05,i),SD(.05,a),c-60),AD(SD(.05,i),SD(.05,a),c+60)];return t===3&&n===3&&(u=[jD(o,s,.1),jD(o,s,.1),jD(o,s,.1),jD(o,s,.15),jD(o,s,.15),jD(o,s,.15)]),u[e].backgroundImage}),ND=4,PD=7,FD=28,ID=0,LD=1,RD=2,zD=3,BD=4,VD=5,HD=e=>{if(!e)return`red`;let{color:t,fade:n}=lp(e);return uD(t,n)},UD=({highlighted:e,preview:t})=>{if(e||t){let n=HD(e?0:t),r=e?W`
					&:hover {
						cursor: pointer;
					}
				`:``;return W`
			box-sizing: border-box;
			border-left: 2px solid ${n};
			border-right: 2px solid ${n};

			${r}

			&:before {
				box-sizing: border-box;
				border-left: 2px solid ${n};
				border-right: 2px solid ${n};

				${r}
			}

			&:after {
				box-sizing: border-box;
				border-left: 2px solid ${n};
				border-right: 2px solid ${n};

				${r}
			}
		`}},WD=7,GD=e=>({"-1":14,0:WD,1:0,2:-7,3:-14,4:-7,5:0,6:WD,7:14})[e],KD=e=>e<0||e>=kn.length,qD=(e,t)=>t<0||t>=(On[e]||3),JD=e=>[LD,RD,BD,VD].includes(e),YD=(e,t,n)=>JD(n)||qD(e,t)?`absolute`:`relative`,XD=(e,t)=>KD(e)&&!qD(e,t)?`initial`:t>=0?`unset`:`${GD(e)}%`,ZD=(e,t)=>KD(e)&&!qD(e,t)?`initial`:t<0?`unset`:`${GD(e)}%`,QD=e=>({row:t,cell:n,edge:r})=>r?W`
				background: none;
				position: ${YD(t,n,e)};
				left: ${XD(t,n)};
				right: ${ZD(t,n)};
				z-index: 1;
			`:W`
			background: ${MD(e)({row:t,cell:n})};
		`,$D=G.div`
	width: calc((100% - ${FD}px) / ${PD});
	height: 0;
	padding-bottom: 7.8%;
	position: relative;
	margin-right: ${ND}px;

	${UD}
	${QD(ID)};

	&:before,
	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
	}

	&:before {
		transform: rotate(60deg);
		${QD(LD)};
	}

	&:after {
		transform: rotate(-60deg);
		${QD(RD)};
	}

	&:hover {
		${QD(zD)};

		&:before {
			${QD(BD)};
		}

		&:after {
			${QD(VD)};
		}
	}

	/* Last, so it wins — but deliberately without touching the red border onHighlighted sets.
	   That border is invisible under opacity: 0 and is read by the suite to tell a legal cell
	   from an illegal one; box-sizing: border-box keeps it from resizing the box either way. */
	${({projected:e})=>{if(e)return W`
			position: absolute;
			padding-bottom: 0;
			margin: 0;
			opacity: 0;
			background: none;

			/* The two rotated copies that made the hexagon shape. They stick out past the box,
			   which for something being hit-tested is a liability rather than a look. */
			&:before,
			&:after {
				display: none;
			}
		`}}
`,eO={left:`6%`,top:`-6%`,width:`88%`,height:`96%`};function tO({row:e,cell:t,piece:n,highlighted:r,preview:i,edge:a,aim:o,box:s,onHover:c}){let[l,u]=(0,v.useContext)(Gs),d=ec(),{isClickSuppressed:f}=mc(),p=(0,v.useCallback)(n=>{n&&n.preventDefault&&n.preventDefault(),n&&n.stopPropagation&&n.stopPropagation(),!f()&&d([e,t])},[d,f,e,t]),m=(0,v.useCallback)(()=>{if(c&&c([e,t]),!o)return;let n=Jn.getDirection(o.from,[e,t]);Cn(n,o.directions)&&u(ro(n))},[o,u,c,e,t]);return(0,q.jsx)($D,{id:`hex-${e}-${t}`,highlighted:r,preview:i,row:e,cell:t,edge:a,projected:!!s,style:s,onClick:p,onMouseEnter:m,children:n&&(0,q.jsx)(aE,{...n,box:s&&eO})})}var nO=3,rO=On.indexOf(Math.max(...On)),iO=On.reduce((e,t)=>e+t,0),aO=Math.max(...On),oO={A:`AGENT`,C:`CEO`,S:`SPY`,N:`SNIPER`};function sO(e,t){return t.findIndex(t=>Cn(e,t))+1}function cO(e,t,n){let r=[];for(let i=-1;i<=t;i++)r.push((0,q.jsx)(tO,{row:e,cell:i,edge:i===-1||i===t||e<0||e>=kn.length,piece:K.getPieceAtPosition([e,i],n.pieces),highlighted:Cn([e,i],n.highlightedPositions),preview:sO([e,i],n.previewPositions),aim:n.aim,onHover:n.onHover,box:n.layout&&n.layout[`${e}-${i}`]},`hex-${e}-${i}`));return(0,q.jsx)(If,{dimensional:!!n.layout,children:r},`row-${e}`)}function lO(e){return e?{x:parseFloat(e.left)+parseFloat(e.width)/2,y:parseFloat(e.top)+parseFloat(e.height)/2}:null}function uO({layout:e,piece:t}){if(!t||!t.position)return null;let n=lO(e[`${t.position[0]}-${t.position[1]}`]);return n?(0,q.jsxs)(Bf,{style:{left:`${n.x}px`,top:`${n.y}px`},children:[(0,q.jsx)(`i`,{children:K.getNumber(t.id)||K.getType(t.id)}),(0,q.jsxs)(`b`,{children:[t.id,` · `,oO[K.getType(t.id)],`, TEAM `,K.getTeam(t.id)]})]}):null}function dO({layout:e,selected:t}){if(!e)return null;let n=lO(e[`${kn.length}-1`]);return(0,q.jsxs)(Rf,{"aria-hidden":`true`,children:[(0,q.jsx)(Vf,{children:(0,q.jsxs)(`span`,{children:[aO,` CELLS · `,iO,` PLAYABLE`]})}),kn.map(t=>{let n=lO(e[`${t}--1`]);return n&&(0,q.jsx)(zf,{style:{left:`${n.x}px`,top:`${n.y}px`},children:t},`row-${t}`)}),n&&On.map((t,r)=>{let i=lO(e[`${rO}-${r}`]);return i&&(0,q.jsx)(zf,{style:{left:`${i.x}px`,top:`${n.y}px`},children:r},`cell-${r}`)}),(0,q.jsx)(uO,{layout:e,piece:t})]})}function fO(){let[{pieces:e,pieceState:t,snipe:n}]=(0,v.useContext)(Gs),r=(0,v.useRef)(null),i=_c(),[a,o]=(0,v.useState)(null),s=(0,v.useCallback)(e=>o(t=>t&&e&&t[0]===e[0]&&t[1]===e[1]?t:e),[]),c=(0,v.useCallback)(()=>o(null),[]),l=(0,v.useMemo)(()=>K.getHighlightedPositions(e,t),[e,t]),u=(0,v.useMemo)(()=>K.getPreviewPositions(e,t),[e,t]),d=K.getSelectedPiece(e),f=!!d&&!!d.position&&!l.length,p=(0,v.useMemo)(()=>f?{from:d.position,directions:K.getPossibleDirections(d,e,t)}:null,[f,d,e,t]),m=(0,v.useMemo)(()=>({pieces:e,highlightedPositions:l,previewPositions:u,snipe:n,aim:p,hovered:a}),[e,l,u,n,p,a]),h=rE(r,(0,v.useCallback)(e=>CE(e,i),[i]),m),g={pieces:e,highlightedPositions:l,previewPositions:u,layout:h,aim:p,onHover:h?s:void 0};return(0,q.jsxs)(Ff,{id:`board`,ref:r,dimensional:!!h,onMouseLeave:c,children:[(0,q.jsx)(dO,{layout:h,selected:d}),cO(-1,nO,g),kn.map(e=>cO(e,On[e],g)),cO(kn.length,nO,g)]})}function pO(e){let[t,n]=(0,v.useState)(e);return[t,(0,v.useCallback)(()=>n(!0),[]),(0,v.useCallback)(()=>n(!1),[])]}var mO={friend:`friend`,foe:`foe`};function hO(e){let t=[];return e.revealed.friend&&t.push(`friend: ${Xn[e.alignment.friend]}`),e.revealed.foe&&t.push(`foe: ${Xn[e.alignment.foe]}`),t.length?t.join(` · `):`nothing public yet`}function gO(e,t,n){return e.allowedToAccuse[n]?t.revealed[n]?`already public`:null:`you guessed a ${mO[n]} wrong already`}function _O({onClose:e}){let[{players:t},n]=(0,v.useContext)(Gs),[r,i]=(0,v.useState)(null),[a,o]=(0,v.useState)(null),[s,c]=(0,v.useState)(!1),l=t.find(e=>e.turn),u=t.find(e=>e.name===r)||null,d=s?l.lastAccusation:null,f=(0,v.useCallback)(e=>{n(go({accuser:l.name,accusee:r,alignment:a,team:e})),i(null),o(null),c(!0)},[n,l.name,r,a]);if(d){let t=d.accusee,n=mO[d.alignment];return(0,q.jsx)(pf,{id:`accuse-screen`,role:`dialog`,"aria-modal":`true`,"aria-label":`Your accusation`,children:(0,q.jsxs)(mf,{children:[(0,q.jsx)(Ef,{children:`Your accusation`}),(0,q.jsxs)(Af,{id:`accuse-verdict`,$correct:d.correct,children:[(0,q.jsx)(jf,{id:`accuse-outcome`,$correct:d.correct,children:d.correct?`Correct`:`Wrong`}),(0,q.jsxs)(Mf,{id:`accuse-detail`,children:[t,`'s `,n,` `,d.correct?`is`:`is not`,` `,Xn[d.team]]}),(0,q.jsx)(Nf,{id:`accuse-consequence`,children:d.correct?`it is public now, and it cost ${t} 50 points`:`you may never accuse a ${n} again`})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`accuse-close`,active:!0,onClick:e,children:`BACK TO THE BOARD`})})]})})}return(0,q.jsx)(pf,{id:`accuse-screen`,role:`dialog`,"aria-modal":`true`,"aria-label":`Accuse a player`,children:(0,q.jsxs)(mf,{children:[!u&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Ef,{children:`Accuse whom?`}),(0,q.jsx)(hf,{children:`a wrong guess costs you that accusation for the rest of the game`}),(0,q.jsx)(Df,{children:t.map((e,n)=>jr.isPlayerTurn(t,e)?null:(0,q.jsxs)(Of,{id:`accuse-player-${n}`,type:`button`,active:!0,onClick:()=>i(e.name),children:[e.name,(0,q.jsx)(kf,{children:hO(e)})]},e.name))})]}),u&&!a&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(Ef,{children:[u.name,`'s what?`]}),(0,q.jsx)(Df,{children:[`friend`,`foe`].map(e=>{let t=gO(l,u,e);return(0,q.jsxs)(Of,{id:`accuse-${e}`,type:`button`,active:!t,onClick:()=>!t&&o(e),children:[mO[e],t&&(0,q.jsx)(kf,{children:t})]},e)})})]}),u&&a&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(Ef,{children:[u.name,`'s `,mO[a],` is which team?`]}),(0,q.jsx)(Df,{children:Object.keys(Xn).map(e=>(0,q.jsx)(Xf,{id:`accuse-team-${e}`,active:!0,team:e,onClick:()=>f(e),children:Xn[e]},e))})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`accuse-close`,active:!0,onClick:e,children:`CANCEL`})})]})})}function vO({onClose:e}){let[{players:t},n]=(0,v.useContext)(Gs),r=t.find(e=>e.turn),i=jr.isOwnFriendRevealed(t),a=jr.isOwnFoeRevealed(t),o=(0,v.useCallback)(()=>!i&&n(fo()),[i,n]),s=(0,v.useCallback)(()=>!a&&n(mo()),[a,n]),c=i&&a;return(0,q.jsx)(pf,{id:`reveal-screen`,role:`dialog`,"aria-modal":`true`,"aria-label":`Reveal an alignment`,children:(0,q.jsxs)(mf,{children:[(0,q.jsx)(Ef,{children:c?`Both are public now`:`Reveal an alignment`}),(0,q.jsx)(hf,{id:`reveal-note`,children:c?`nothing left to give away`:`costs 50 points, and hands you that team at once`}),(0,q.jsxs)(ld,{children:[(0,q.jsx)(Cd,{id:`reveal-friend`,active:!i,disabled:i,player:r.name,team:i?r.alignment.friend:void 0,onClick:o,children:i?Xn[r.alignment.friend]:null}),(0,q.jsx)(wd,{id:`reveal-foe`,active:!a,disabled:a,player:r.name,team:a?r.alignment.foe:void 0,onClick:s,children:a?Xn[r.alignment.foe]:null})]}),(i||a)&&(0,q.jsxs)(Nf,{id:`reveal-spent`,children:[`−`,50*(Number(i)+Number(a)),` points spent on revealing`]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`reveal-close`,active:!0,onClick:e,children:i||a?`BACK TO THE BOARD`:`REVEAL NOTHING`})})]})})}function yO(){let e=Zs(),[{players:t}]=(0,v.useContext)(Gs);return(0,v.useMemo)(()=>e.mode===`online`?t.find(t=>t.name===e.name)||null:t.find(e=>e.turn)||null,[e.mode,e.name,t])}function bO(e,t){let n=e.exposed&&e.exposed[t];return n?`accused by ${n}`:`revealed`}function xO({player:e}){let t=jr.getBaseScore(e);return(0,q.jsxs)(bf,{id:`ledger-score-${e.name}`,"data-base":t,$spent:t<100,children:[(0,q.jsx)(wf,{children:`on`}),t]})}function SO({players:e,own:t}){return(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(gf,{id:`friend-foe-ledger`,children:e.map(e=>{let n=!!t&&e.name===t.name,{friend:r,foe:i}=e.alignment;return(0,q.jsxs)(_f,{$own:n,children:[(0,q.jsxs)(vf,{children:[(0,q.jsxs)(yf,{children:[e.name,n?` (you)`:``]}),(0,q.jsx)(xO,{player:e})]}),(0,q.jsxs)(Sf,{children:[(0,q.jsxs)(Cf,{$alignment:`friend`,children:[(0,q.jsx)(wf,{children:`friend`}),n||e.revealed.friend?Xn[r]:(0,q.jsx)(Tf,{"aria-label":`withheld`}),e.revealed.friend&&(0,q.jsx)(Pf,{children:bO(e,`friend`)})]}),(0,q.jsxs)(Cf,{$alignment:`foe`,children:[(0,q.jsx)(wf,{children:`foe`}),n||e.revealed.foe?Xn[i]:(0,q.jsx)(Tf,{"aria-label":`withheld`}),e.revealed.foe&&(0,q.jsx)(Pf,{children:bO(e,`foe`)})]})]})]},e.name)})}),(0,q.jsxs)(xf,{id:`friend-foe-base-note`,children:[`everyone is on `,100,` · an alignment becoming public costs its owner `,50,` · the teams are counted at the end`]})]})}function CO({onClose:e}){let[{players:t}]=(0,v.useContext)(Gs),n=Zs(),r=yO(),i=n.mode===`online`,[a,o]=(0,v.useState)(i),s=r?r.name:``;return(0,q.jsx)(pf,{id:`friend-foe-screen`,role:`dialog`,"aria-modal":`true`,"aria-label":`Your friend and foe`,children:(0,q.jsxs)(mf,{children:[(0,q.jsx)(hf,{id:`friend-foe-eyes`,children:i?`nobody else can see these`:`only for ${s}'s eyes`}),!a&&(0,q.jsx)(Mc,{children:(0,q.jsxs)(jc,{id:`friend-foe-confirm`,active:!0,onClick:()=>o(!0),children:[s,` IS LOOKING`]})}),a&&r&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(ld,{children:[(0,q.jsx)(Cd,{id:`friend-foe-friend`,disabled:!0,player:r.name,team:r.alignment.friend,children:Xn[r.alignment.friend]}),(0,q.jsx)(wd,{id:`friend-foe-foe`,disabled:!0,player:r.name,team:r.alignment.foe,children:Xn[r.alignment.foe]})]}),(0,q.jsx)(SO,{players:t,own:r})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(jc,{id:`friend-foe-close`,active:!0,onClick:e,children:`PUT IT AWAY`})})]})})}function wO({onClose:e}){let[{players:t}]=(0,v.useContext)(Gs),{actions:n}=Zs(),r=t.length-1<2;return(0,q.jsx)(pf,{id:`leave-screen`,role:`dialog`,"aria-modal":`true`,"aria-label":`Leave the game`,children:(0,q.jsxs)(mf,{children:[(0,q.jsx)(Ef,{children:r?`End the game?`:`Leave the game?`}),(0,q.jsx)(hf,{id:`leave-note`,children:r?`a game needs 2, so the last player leaves with you`:`the game carries on without you`}),(0,q.jsx)(Nf,{id:`leave-cost`,children:r?`nobody scores, and the room is gone`:`a started room takes no new seats, so there is no way back`}),(0,q.jsx)(Nf,{id:`leave-rating-cost`,children:`counts as a loss, and the next game waits on a timer`}),(0,q.jsxs)(Df,{children:[(0,q.jsx)(jc,{id:`leave-confirm`,active:!0,onClick:n.leave,children:r?`END IT`:`LEAVE`}),(0,q.jsx)(jc,{id:`leave-close`,active:!0,onClick:e,children:`BACK TO THE BOARD`})]})]})})}function TO(){let[{pieces:e,snipe:t},n]=(0,v.useContext)(Gs),r=$s(),i=K.isSniperOnBoard(e);return[r,(0,v.useCallback)(()=>{i&&r&&n(ao())},[i,r,n]),t]}function EO(){let[e,t,n]=pO(!1),[r,i,a]=pO(!1),[o,s,c]=pO(!1),[l,u,d]=pO(!1);return{accuse:{shown:e,show:t,hide:n},reveal:{shown:r,show:i,hide:a},alignment:{shown:o,show:s,hide:c},leave:{shown:l,show:u,hide:d}}}function DO(){let[{players:e}]=(0,v.useContext)(Gs),t=Qs(),[n,r,i]=TO(),a=EO(),o=e.find(e=>e.turn),s=jr.isRevealActive(e)&&t,c=(o.allowedToAccuse.friend||o.allowedToAccuse.foe)&&t;return(0,q.jsxs)(af,{children:[(0,q.jsx)(of,{children:(0,q.jsx)(jc,{id:`snipe`,small:!0,$primary:!0,active:n,onClick:r,children:i?`STAND DOWN`:`SNIPE!`})}),(0,q.jsxs)(of,{children:[(0,q.jsx)(Yf,{id:`accuse`,active:c,onClick:()=>c&&a.accuse.show(),children:`ACCUSE`}),(0,q.jsx)(Yf,{id:`reveal`,active:s,onClick:()=>s&&a.reveal.show(),children:`REVEAL`})]}),(0,q.jsxs)(of,{children:[(0,q.jsx)(jc,{id:`friend-foe`,small:!0,active:!0,onClick:a.alignment.show,children:`FRIEND & FOE`}),(0,q.jsx)(Wc,{onClick:a.leave.show})]}),a.accuse.shown&&(0,q.jsx)(_O,{onClose:a.accuse.hide}),a.reveal.shown&&(0,q.jsx)(vO,{onClose:a.reveal.hide}),a.alignment.shown&&(0,q.jsx)(CO,{onClose:a.alignment.hide}),a.leave.shown&&(0,q.jsx)(wO,{onClose:a.leave.hide})]})}function OO(){let[{players:e,pieces:t,hasTurnEnded:n},r]=(0,v.useContext)(Gs),i=Qs(),a=jr.getTurn(e),o=K.getKilledCeoCount(t),s=e.findIndex(e=>e.turn);return(0,q.jsxs)(wc,{children:[(0,q.jsxs)(sf,{children:[(0,q.jsx)(cf,{children:`on the desk of`}),(0,q.jsx)(uf,{id:`turn-player`,children:a}),(0,q.jsx)(df,{"aria-hidden":`true`,children:e.map((e,t)=>(0,q.jsx)(ff,{$on:t<s,children:e.name.charAt(0)},e.name))})]}),(0,q.jsx)(sf,{children:(0,q.jsxs)(lf,{children:[(0,q.jsx)(cf,{children:`ceos down`}),(0,q.jsxs)(uf,{id:`ceos-down`,children:[o,` / `,3]})]})}),(0,q.jsx)(sf,{children:(0,q.jsx)(jc,{small:!0,id:`next-turn`,active:n&&i,onClick:()=>n&&r(Xa()),children:`NEXT TURN`})})]})}function kO(){return(0,q.jsxs)(nf,{children:[(0,q.jsx)(OO,{}),(0,q.jsxs)(rf,{children:[(0,q.jsxs)(Ld,{children:[(0,q.jsx)(sE,{team:`0`}),(0,q.jsx)(sE,{team:`1`})]}),(0,q.jsx)(fO,{}),(0,q.jsxs)(Ld,{children:[(0,q.jsx)(sE,{team:`2`}),(0,q.jsx)(sE,{team:`3`})]})]}),(0,q.jsx)(DO,{})]})}var AO=G.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	padding: 10px 40px 60px;
	margin-top: 40px;
	align-items: center;

	/* Was a fixed three-across row, so on a phone the two team columns were simply off-screen. */
	${xc} {
		flex-direction: column;
		align-items: stretch;
		padding: 8px;
		margin-top: 8px;
		gap: 10px;
	}
`,jO=G.div`
	text-align: center;
	font-size: 50px;
	padding: 15px;
	color: inherit;

	${Cc} {
		font-size: 30px;
		padding: 6px;
	}
`,MO=G.sup`
	font-size: 16px;
`,NO=G.div`
	margin-bottom: 8px;

	&:last-child {
		margin-bottom: 0;
	}
`,PO=G.span`
	display: inline-block;
	margin-bottom: 8px;
	color: inherit;
	opacity: 0.72;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`,FO=W`
	background: var(--ha-panel);
	background-image: var(--ha-panel-texture);
	background-repeat: no-repeat;
	background-position: bottom;
	background-size: 100% 5px;
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	box-shadow: var(--ha-panel-shadow);
	color: var(--ha-ink);
`,IO=G.div`
	${FO}
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 10px 8px;
	margin-bottom: 12px;

	${Cc} {
		flex-direction: row;
		padding: 8px;
		margin-bottom: 10px;
	}
`,LO=G.div`
	letter-spacing: -3px;
	display: flex;
	align-items: end;
	justify-content: space-evenly;
	margin: 0 0 8px;
`,RO=G.span`
	display: flex;
	color: ${({team:e})=>e==null?`var(--ha-ink)`:`var(--ha-team-${e})`};
	flex-flow: column;
	align-items: center;
	flex-basis: 33%;
	justify-content: space-evenly;
	font-size: 18px;
	font-weight: bold;
	flex-shrink: ${({big:e})=>e?`0`:`initial`};
`,zO=G.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 46%;
	min-width: 0;
	flex-shrink: 0;
	max-height: 100%;

	${xc} {
		width: 100%;
		order: -1;
	}
`,BO=G.div`
	${FO}
	padding: 12px 10px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;

	${Cc} {
		padding: 8px 6px;
		margin-bottom: 10px;
	}
`,VO=G.div`
	color: var(--ha-ink-dim);
	align-self: center;
	margin: 30px auto 10px;
	font-size: 18px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`,HO=G.div`
	color: var(--ha-ink);
	align-self: center;
	font-size: 32px;
	font-weight: bold;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
`,UO=G.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`,WO=G.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: center;
	gap: 10px;
	padding: 5px 2px;
	border-bottom: 1px solid var(--ha-rule);

	&:last-of-type {
		border-bottom: none;
	}
`,GO=G.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
`,KO=G.div`
	display: flex;
	align-items: baseline;
	gap: 8px;
`,qO=G.div`
	color: var(--ha-ink);
	font-weight: bold;
	font-size: 15px;
	letter-spacing: 0;
	white-space: nowrap;
`,JO=G.span`
	font-family: var(--ha-face-data);
	font-variant-numeric: tabular-nums;
	font-size: 11px;
	font-weight: normal;
	letter-spacing: var(--ha-track-label);
	color: var(--ha-ink-faint);
	white-space: nowrap;
`,YO=G.div`
	color: var(--ha-ink);
	font-size: 15px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	opacity: 0.8;
`,XO=G.div`
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	padding: 2px 8px;
	border: 2px solid;
	border-radius: 3px;
	${({alignment:e})=>e===`friend`?W`
				border-color: var(--ha-friend);
			`:W`
				border-color: var(--ha-foe);
			`}
`,ZO=G.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 62px;
	padding: 1px 5px;
	font-size: 11px;
	font-weight: bold;
	letter-spacing: 0;
	background: var(--ha-team-${({team:e})=>e});
	color: var(--ha-team-${({team:e})=>e}-ink);
	border: 1px solid var(--ha-team-${({team:e})=>e}-line);
`,QO=G.span`
	font-size: 15px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	color: var(--ha-ink);
	margin-left: auto;
	/* Without this "+ 135" breaks at the space and the sign lands on its own line above the
	   number, which is exactly what made the old table unreadable. */
	white-space: nowrap;

	${xc} {
		margin-left: 0;
	}
`,$O=G.span`
	font-size: 13px;
	font-weight: bold;
	letter-spacing: 0;
	font-variant-numeric: tabular-nums;
	color: var(--ha-accent);
	padding-left: 6px;
	border-left: 1px dashed var(--ha-rule);
	white-space: nowrap;
`,ek=G.div`
	color: var(--ha-ink);
	font-size: 26px;
	font-weight: bold;
	letter-spacing: 0;
	text-align: right;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	min-width: 56px;
`;function tk({type:e}){let t=`img/0-${e}.png`;return(0,q.jsx)(vp,{src:t,killed:!0})}function nk(){return(0,q.jsxs)(IO,{children:[(0,q.jsxs)(LO,{children:[(0,q.jsxs)(RO,{children:[(0,q.jsx)(tk,{type:`A`}),` 5 pts`]}),(0,q.jsxs)(RO,{children:[(0,q.jsx)(tk,{type:`S`}),` 10 pts`]})]}),(0,q.jsxs)(LO,{children:[(0,q.jsxs)(RO,{children:[(0,q.jsx)(tk,{type:`N`}),` 10 pts`]}),(0,q.jsxs)(RO,{children:[(0,q.jsx)(tk,{type:`C`}),` 20 pts`]})]})]})}function rk(e,t){return`${e===`friend`?`+`:`−`} ${t}`}function ik({alignment:e,team:t,points:n,revealed:r}){return(0,q.jsxs)(XO,{alignment:e,"data-alignment":e,children:[(0,q.jsx)(ZO,{team:t,children:Xn[t]}),(0,q.jsx)(QO,{"data-term":e===`friend`?n:-n,children:rk(e,n)}),r&&(0,q.jsxs)($O,{"data-term":-50,children:[`− `,50]})]})}function ak({name:e}){let{rated:t}=Zs(),n=t?.players?.find(t=>t.name===e);return n?(0,q.jsxs)(JO,{"data-delta":n.delta,"data-rating":n.after,children:[n.delta>=0?`+`:`−`,Math.abs(n.delta),` → `,n.after]}):null}function ok({player:e}){let[{pieces:t}]=(0,v.useContext)(Gs),n=fr.getPointsForTeam(e.alignment.friend,t),r=fr.getPointsForTeam(e.alignment.foe,t);return(0,q.jsxs)(WO,{"data-player":e.name,children:[(0,q.jsxs)(GO,{children:[(0,q.jsxs)(KO,{children:[(0,q.jsx)(qO,{children:e.name}),(0,q.jsx)(ak,{name:e.name}),(0,q.jsx)(YO,{"data-term":100,children:100})]}),(0,q.jsx)(ik,{alignment:`friend`,team:e.alignment.friend,points:n,revealed:e.revealed.friend}),(0,q.jsx)(ik,{alignment:`foe`,team:e.alignment.foe,points:r,revealed:e.revealed.foe})]}),(0,q.jsx)(ek,{"data-total":jr.getPoints(e,t),children:jr.getPoints(e,t)})]})}function sk(){let[{players:e,pieces:t}]=(0,v.useContext)(Gs);return(0,q.jsxs)(BO,{children:[(0,q.jsx)(UO,{children:jr.sortByPoints(e,t).map(e=>(0,q.jsx)(ok,{player:e},e.name))}),(0,q.jsx)(VO,{big:!0,children:`Winner: `}),(0,q.jsx)(HO,{big:!0,children:jr.getWinner(e,t).name})]})}function ck({team:e}){let[{pieces:t}]=(0,v.useContext)(Gs);return(0,q.jsxs)(jO,{children:[fr.getPointsForTeam(e,t),(0,q.jsx)(MO,{children:`pts`})]})}function lk({team:e}){return(0,q.jsxs)(_p,{team:e,children:[(0,q.jsx)(ck,{team:e}),(0,q.jsxs)(NO,{children:[(0,q.jsx)(PO,{children:`Killed:`}),(0,q.jsx)(Ep,{team:e})]}),(0,q.jsxs)(NO,{children:[(0,q.jsx)(PO,{children:`Survivors:`}),(0,q.jsx)(Op,{team:e})]})]})}function uk(){return(0,q.jsxs)(AO,{children:[(0,q.jsxs)(Ld,{children:[(0,q.jsx)(lk,{team:`0`}),(0,q.jsx)(lk,{team:`1`})]}),(0,q.jsxs)(zO,{children:[(0,q.jsx)(nk,{}),(0,q.jsx)(sk,{})]}),(0,q.jsxs)(Ld,{children:[(0,q.jsx)(lk,{team:`2`}),(0,q.jsx)(lk,{team:`3`})]}),(0,q.jsx)(Mc,{children:(0,q.jsx)(Wc,{id:`end-leave`,label:`LEAVE GAME`})})]})}var{START:dk,ALIGNMENT:fk,PLAY:pk,END:mk}=fn,hk=[fk,pk,mk];function gk(){let[{pieces:e}]=(0,v.useContext)(Gs),t=Zs(),n=t.mode===`online`;vc(_c());let r=(n?t.phase===mk:K.hasGameFinished(e))?mk:t.phase,i=hk.includes(r)&&!t.synced;return(0,q.jsxs)(gc,{children:[(0,q.jsx)(dn,{}),(0,q.jsx)(Oc,{}),i?(0,q.jsx)(wc,{children:`Loading the game…`}):(0,q.jsxs)(q.Fragment,{children:[(r===dk||r===null)&&(n?(0,q.jsx)(Vu,{}):(0,q.jsx)(rd,{onReady:()=>t.actions.advance(fk)})),r===fk&&(0,q.jsx)(Id,{online:n,onReady:()=>n?t.actions.ready():t.actions.advance(pk)}),r===pk&&(0,q.jsx)(kO,{}),r===mk&&(0,q.jsx)(uk,{})]})]})}var _k=Xs(gk);(0,y.createRoot)(document.querySelector(`.game`)).render((0,q.jsx)(v.StrictMode,{children:(0,q.jsx)(_k,{})}));
//# sourceMappingURL=index-BASn_JaN.js.map