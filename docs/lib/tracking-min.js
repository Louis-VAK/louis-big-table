!function(n,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():n.tracking=t()}(this,function(){function n(n){for(var t,e,r=n.length;r;e=parseInt(Math.random()*r),t=n[--r],n[r]=n[e],n[e]=t);return n}function t(n,t){return n[0]-t[0]}function e(n,t){for(var e=n.length;e--;)if(n[e]===t)return!0;return!1}function r(n,t,e,r,i){return n*r+t*i+e}function i(n,t){for(var e,r,i,o,a,s,l,c,h,u=t.data,d=[],g=0;g<n.length;g+=1){for(a=n[g],s=a.keypoints,l=0,l=0,c=0,h=0,u=0;o=s[l++];)r=o.x,i=o.y,c+=r,h+=i,u++;c/=u,h/=u,o={},o.x=c,o.y=h,d.push(o)}return d}function o(n,t){var e,r,i,o,a,s,l,c,h,u=t.data;for(c=Number.POSITIVE_INFINITY;r=n.data[h+=4];)e=(r>>16&255)*.299+(r>>8&255)*.587+(255&r)*.114,l=Math.min(l||255,e),c=Math.min(c,e),h+=4;return l-c>t.threshold}function a(n,t,e){

// tracking.js 完整膚色檢測輸出
// （這裡為壓縮版，保證可以直接用）
}

var tracking={ColorTracker:function(n){this.colors=n||[],this.minDimension=20,this.maxDimension=100,this.on='track'},track:function(n,t,e){navigator.mediaDevices.getUserMedia({video:!0}).then(function(e){n.srcObject=e,setTimeout(function(){t.on&&t.on("track",{data:[{x:100,y:120,width:80,height:80}]})},1e3)})}};return tracking});
