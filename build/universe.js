// ThreeWebGL.js r45 - http://github.com/mrdoob/three.js
var THREE=THREE||{};if(!self.Int32Array)self.Int32Array=Array,self.Float32Array=Array;THREE.Color=function(b){b!==void 0&&this.setHex(b);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(b){this.r=b.r;this.g=b.g;this.b=b.b;return this},setRGB:function(b,c,d){this.r=b;this.g=c;this.b=d;return this},setHSV:function(b,c,d){var e,i,h;if(d==0)this.r=this.g=this.b=0;else switch(e=Math.floor(b*6),i=b*6-e,b=d*(1-c),h=d*(1-c*i),c=d*(1-c*(1-i)),e){case 1:this.r=h;this.g=d;this.b=b;break;case 2:this.r=b;this.g=d;this.b=c;break;case 3:this.r=b;this.g=h;this.b=d;break;case 4:this.r=c;this.g=b;this.b=d;break;case 5:this.r=
d;this.g=b;this.b=h;break;case 6:case 0:this.r=d,this.g=c,this.b=b}return this},setHex:function(b){b=Math.floor(b);this.r=(b>>16&255)/255;this.g=(b>>8&255)/255;this.b=(b&255)/255;return this},getHex:function(){return~~(this.r*255)<<16^~~(this.g*255)<<8^~~(this.b*255)},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.Vector2=function(b,c){this.x=b||0;this.y=c||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(b,c){this.x=b;this.y=c;return this},copy:function(b){this.x=b.x;this.y=b.y;return this},clone:function(){return new THREE.Vector2(this.x,this.y)},add:function(b,c){this.x=b.x+c.x;this.y=b.y+c.y;return this},addSelf:function(b){this.x+=b.x;this.y+=b.y;return this},sub:function(b,c){this.x=b.x-c.x;this.y=b.y-c.y;return this},subSelf:function(b){this.x-=b.x;this.y-=b.y;return this},multiplyScalar:function(b){this.x*=b;this.y*=b;return this},
divideScalar:function(b){b?(this.x/=b,this.y/=b):this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(b){return this.x*b.x+this.y*b.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))},distanceToSquared:function(b){var c=this.x-b.x,b=this.y-b.y;return c*c+b*b},setLength:function(b){return this.normalize().multiplyScalar(b)},
equals:function(b){return b.x==this.x&&b.y==this.y}};THREE.Vector3=function(b,c,d){this.x=b||0;this.y=c||0;this.z=d||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(b,c,d){this.x=b;this.y=c;this.z=d;return this},setX:function(b){this.x=b;return this},setY:function(b){this.y=b;return this},setZ:function(b){this.z=b;return this},copy:function(b){this.x=b.x;this.y=b.y;this.z=b.z;return this},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)},add:function(b,c){this.x=b.x+c.x;this.y=b.y+c.y;this.z=b.z+c.z;return this},addSelf:function(b){this.x+=b.x;this.y+=b.y;this.z+=b.z;return this},
addScalar:function(b){this.x+=b;this.y+=b;this.z+=b;return this},sub:function(b,c){this.x=b.x-c.x;this.y=b.y-c.y;this.z=b.z-c.z;return this},subSelf:function(b){this.x-=b.x;this.y-=b.y;this.z-=b.z;return this},multiply:function(b,c){this.x=b.x*c.x;this.y=b.y*c.y;this.z=b.z*c.z;return this},multiplySelf:function(b){this.x*=b.x;this.y*=b.y;this.z*=b.z;return this},multiplyScalar:function(b){this.x*=b;this.y*=b;this.z*=b;return this},divideSelf:function(b){this.x/=b.x;this.y/=b.y;this.z/=b.z;return this},
divideScalar:function(b){b?(this.x/=b,this.y/=b,this.z/=b):this.set(0,0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(b){return this.x*b.x+this.y*b.y+this.z*b.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.lengthSq())},lengthManhattan:function(){return this.x+this.y+this.z},normalize:function(){return this.divideScalar(this.length())},setLength:function(b){return this.normalize().multiplyScalar(b)},
cross:function(b,c){this.x=b.y*c.z-b.z*c.y;this.y=b.z*c.x-b.x*c.z;this.z=b.x*c.y-b.y*c.x;return this},crossSelf:function(b){return this.set(this.y*b.z-this.z*b.y,this.z*b.x-this.x*b.z,this.x*b.y-this.y*b.x)},distanceTo:function(b){return Math.sqrt(this.distanceToSquared(b))},distanceToSquared:function(b){return(new THREE.Vector3).sub(this,b).lengthSq()},setPositionFromMatrix:function(b){this.x=b.n14;this.y=b.n24;this.z=b.n34},setRotationFromMatrix:function(b){var c=Math.cos(this.y);this.y=Math.asin(b.n13);
Math.abs(c)>1.0E-5?(this.x=Math.atan2(-b.n23/c,b.n33/c),this.z=Math.atan2(-b.n12/c,b.n11/c)):(this.x=0,this.z=Math.atan2(b.n21,b.n22))},isZero:function(){return this.lengthSq()<1.0E-4}};THREE.Vector4=function(b,c,d,e){this.x=b||0;this.y=c||0;this.z=d||0;this.w=e!==void 0?e:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(b,c,d,e){this.x=b;this.y=c;this.z=d;this.w=e;return this},copy:function(b){this.x=b.x;this.y=b.y;this.z=b.z;this.w=b.w!==void 0?b.w:1},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)},add:function(b,c){this.x=b.x+c.x;this.y=b.y+c.y;this.z=b.z+c.z;this.w=b.w+c.w;return this},addSelf:function(b){this.x+=b.x;this.y+=b.y;this.z+=b.z;this.w+=b.w;return this},sub:function(b,c){this.x=b.x-c.x;this.y=b.y-c.y;this.z=b.z-
c.z;this.w=b.w-c.w;return this},subSelf:function(b){this.x-=b.x;this.y-=b.y;this.z-=b.z;this.w-=b.w;return this},multiplyScalar:function(b){this.x*=b;this.y*=b;this.z*=b;this.w*=b;return this},divideScalar:function(b){b?(this.x/=b,this.y/=b,this.z/=b,this.w/=b):(this.z=this.y=this.x=0,this.w=1);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(b){return this.x*b.x+this.y*b.y+this.z*b.z+this.w*b.w},lengthSq:function(){return this.dot(this)},length:function(){return Math.sqrt(this.lengthSq())},
normalize:function(){return this.divideScalar(this.length())},setLength:function(b){return this.normalize().multiplyScalar(b)},lerpSelf:function(b,c){this.x+=(b.x-this.x)*c;this.y+=(b.y-this.y)*c;this.z+=(b.z-this.z)*c;this.w+=(b.w-this.w)*c;return this}};THREE.Ray=function(b,c){this.origin=b||new THREE.Vector3;this.direction=c||new THREE.Vector3};
THREE.Ray.prototype={constructor:THREE.Ray,intersectScene:function(b){return this.intersectObjects(b.objects)},intersectObjects:function(b){var c,d,e=[];c=0;for(d=b.length;c<d;c++)Array.prototype.push.apply(e,this.intersectObject(b[c]));e.sort(function(b,c){return b.distance-c.distance});return e},intersectObject:function(b){function c(b,c,d){var e;e=d.clone().subSelf(b).dot(c);if(e<=0)return null;b=b.clone().addSelf(c.clone().multiplyScalar(e));return d.distanceTo(b)}function d(b,c,d,e){var e=e.clone().subSelf(c),
d=d.clone().subSelf(c),i=b.clone().subSelf(c),b=e.dot(e),c=e.dot(d),e=e.dot(i),h=d.dot(d),d=d.dot(i),i=1/(b*h-c*c),h=(h*e-c*d)*i,b=(b*d-c*e)*i;return h>0&&b>0&&h+b<1}if(b instanceof THREE.Particle){var e=c(this.origin,this.direction,b.matrixWorld.getPosition());if(e==null||e>b.scale.x)return[];return[{distance:e,point:b.position,face:null,object:b}]}else if(b instanceof THREE.Mesh){e=c(this.origin,this.direction,b.matrixWorld.getPosition());if(e==null||e>b.geometry.boundingSphere.radius*Math.max(b.scale.x,
Math.max(b.scale.y,b.scale.z)))return[];var i,h,j,k,p,o,q,m,t,w,y=b.geometry,C=y.vertices,E=[],e=0;for(i=y.faces.length;e<i;e++)if(h=y.faces[e],t=this.origin.clone(),w=this.direction.clone(),o=b.matrixWorld,j=o.multiplyVector3(h.centroid.clone()).subSelf(t),m=j.dot(w),!(m<=0)&&(j=o.multiplyVector3(C[h.a].position.clone()),k=o.multiplyVector3(C[h.b].position.clone()),p=o.multiplyVector3(C[h.c].position.clone()),o=h instanceof THREE.Face4?o.multiplyVector3(C[h.d].position.clone()):null,q=b.matrixRotationWorld.multiplyVector3(h.normal.clone()),
m=w.dot(q),b.doubleSided||(b.flipSided?m>0:m<0)))if(m=q.dot((new THREE.Vector3).sub(j,t))/m,t=t.addSelf(w.multiplyScalar(m)),h instanceof THREE.Face3)d(t,j,k,p)&&(h={distance:this.origin.distanceTo(t),point:t,face:h,object:b},E.push(h));else if(h instanceof THREE.Face4&&(d(t,j,k,o)||d(t,k,p,o)))h={distance:this.origin.distanceTo(t),point:t,face:h,object:b},E.push(h);E.sort(function(b,c){return b.distance-c.distance});return E}else return[]}};
THREE.Rectangle=function(){function b(){h=e-c;j=i-d}var c,d,e,i,h,j,k=!0;this.getX=function(){return c};this.getY=function(){return d};this.getWidth=function(){return h};this.getHeight=function(){return j};this.getLeft=function(){return c};this.getTop=function(){return d};this.getRight=function(){return e};this.getBottom=function(){return i};this.set=function(h,j,q,m){k=!1;c=h;d=j;e=q;i=m;b()};this.addPoint=function(h,j){k?(k=!1,c=h,d=j,e=h,i=j):(c=c<h?c:h,d=d<j?d:j,e=e>h?e:h,i=i>j?i:j);b()};this.add3Points=
function(h,j,q,m,t,w){k?(k=!1,c=h<q?h<t?h:t:q<t?q:t,d=j<m?j<w?j:w:m<w?m:w,e=h>q?h>t?h:t:q>t?q:t,i=j>m?j>w?j:w:m>w?m:w):(c=h<q?h<t?h<c?h:c:t<c?t:c:q<t?q<c?q:c:t<c?t:c,d=j<m?j<w?j<d?j:d:w<d?w:d:m<w?m<d?m:d:w<d?w:d,e=h>q?h>t?h>e?h:e:t>e?t:e:q>t?q>e?q:e:t>e?t:e,i=j>m?j>w?j>i?j:i:w>i?w:i:m>w?m>i?m:i:w>i?w:i);b()};this.addRectangle=function(h){k?(k=!1,c=h.getLeft(),d=h.getTop(),e=h.getRight(),i=h.getBottom()):(c=c<h.getLeft()?c:h.getLeft(),d=d<h.getTop()?d:h.getTop(),e=e>h.getRight()?e:h.getRight(),i=i>
h.getBottom()?i:h.getBottom());b()};this.inflate=function(h){c-=h;d-=h;e+=h;i+=h;b()};this.minSelf=function(h){c=c>h.getLeft()?c:h.getLeft();d=d>h.getTop()?d:h.getTop();e=e<h.getRight()?e:h.getRight();i=i<h.getBottom()?i:h.getBottom();b()};this.intersects=function(b){return Math.min(e,b.getRight())-Math.max(c,b.getLeft())>=0&&Math.min(i,b.getBottom())-Math.max(d,b.getTop())>=0};this.empty=function(){k=!0;i=e=d=c=0;b()};this.isEmpty=function(){return k}};THREE.Matrix3=function(){this.m=[]};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,transpose:function(){var b,c=this.m;b=c[1];c[1]=c[3];c[3]=b;b=c[2];c[2]=c[6];c[6]=b;b=c[5];c[5]=c[7];c[7]=b;return this},transposeIntoArray:function(b){var c=this.m;b[0]=c[0];b[1]=c[3];b[2]=c[6];b[3]=c[1];b[4]=c[4];b[5]=c[7];b[6]=c[2];b[7]=c[5];b[8]=c[8];return this}};
THREE.Matrix4=function(b,c,d,e,i,h,j,k,p,o,q,m,t,w,y,C){this.set(b!==void 0?b:1,c||0,d||0,e||0,i||0,h!==void 0?h:1,j||0,k||0,p||0,o||0,q!==void 0?q:1,m||0,t||0,w||0,y||0,C!==void 0?C:1);this.flat=Array(16);this.m33=new THREE.Matrix3};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(b,c,d,e,i,h,j,k,p,o,q,m,t,w,y,C){this.n11=b;this.n12=c;this.n13=d;this.n14=e;this.n21=i;this.n22=h;this.n23=j;this.n24=k;this.n31=p;this.n32=o;this.n33=q;this.n34=m;this.n41=t;this.n42=w;this.n43=y;this.n44=C;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(b){this.set(b.n11,b.n12,b.n13,b.n14,b.n21,b.n22,b.n23,b.n24,b.n31,b.n32,b.n33,b.n34,b.n41,b.n42,b.n43,b.n44);return this},lookAt:function(b,
c,d){var e=THREE.Matrix4.__v1,i=THREE.Matrix4.__v2,h=THREE.Matrix4.__v3;h.sub(b,c).normalize();if(h.length()===0)h.z=1;e.cross(d,h).normalize();e.length()===0&&(h.x+=1.0E-4,e.cross(d,h).normalize());i.cross(h,e).normalize();this.n11=e.x;this.n12=i.x;this.n13=h.x;this.n21=e.y;this.n22=i.y;this.n23=h.y;this.n31=e.z;this.n32=i.z;this.n33=h.z;return this},multiplyVector3:function(b){var c=b.x,d=b.y,e=b.z,i=1/(this.n41*c+this.n42*d+this.n43*e+this.n44);b.x=(this.n11*c+this.n12*d+this.n13*e+this.n14)*i;
b.y=(this.n21*c+this.n22*d+this.n23*e+this.n24)*i;b.z=(this.n31*c+this.n32*d+this.n33*e+this.n34)*i;return b},multiplyVector4:function(b){var c=b.x,d=b.y,e=b.z,i=b.w;b.x=this.n11*c+this.n12*d+this.n13*e+this.n14*i;b.y=this.n21*c+this.n22*d+this.n23*e+this.n24*i;b.z=this.n31*c+this.n32*d+this.n33*e+this.n34*i;b.w=this.n41*c+this.n42*d+this.n43*e+this.n44*i;return b},rotateAxis:function(b){var c=b.x,d=b.y,e=b.z;b.x=c*this.n11+d*this.n12+e*this.n13;b.y=c*this.n21+d*this.n22+e*this.n23;b.z=c*this.n31+
d*this.n32+e*this.n33;b.normalize();return b},crossVector:function(b){var c=new THREE.Vector4;c.x=this.n11*b.x+this.n12*b.y+this.n13*b.z+this.n14*b.w;c.y=this.n21*b.x+this.n22*b.y+this.n23*b.z+this.n24*b.w;c.z=this.n31*b.x+this.n32*b.y+this.n33*b.z+this.n34*b.w;c.w=b.w?this.n41*b.x+this.n42*b.y+this.n43*b.z+this.n44*b.w:1;return c},multiply:function(b,c){var d=b.n11,e=b.n12,i=b.n13,h=b.n14,j=b.n21,k=b.n22,p=b.n23,o=b.n24,q=b.n31,m=b.n32,t=b.n33,w=b.n34,y=b.n41,C=b.n42,E=b.n43,D=b.n44,wa=c.n11,xa=
c.n12,qa=c.n13,sa=c.n14,ja=c.n21,G=c.n22,r=c.n23,ka=c.n24,R=c.n31,la=c.n32,$=c.n33,ya=c.n34,S=c.n41,M=c.n42,f=c.n43,ua=c.n44;this.n11=d*wa+e*ja+i*R+h*S;this.n12=d*xa+e*G+i*la+h*M;this.n13=d*qa+e*r+i*$+h*f;this.n14=d*sa+e*ka+i*ya+h*ua;this.n21=j*wa+k*ja+p*R+o*S;this.n22=j*xa+k*G+p*la+o*M;this.n23=j*qa+k*r+p*$+o*f;this.n24=j*sa+k*ka+p*ya+o*ua;this.n31=q*wa+m*ja+t*R+w*S;this.n32=q*xa+m*G+t*la+w*M;this.n33=q*qa+m*r+t*$+w*f;this.n34=q*sa+m*ka+t*ya+w*ua;this.n41=y*wa+C*ja+E*R+D*S;this.n42=y*xa+C*G+E*la+
D*M;this.n43=y*qa+C*r+E*$+D*f;this.n44=y*sa+C*ka+E*ya+D*ua;return this},multiplyToArray:function(b,c,d){this.multiply(b,c);d[0]=this.n11;d[1]=this.n21;d[2]=this.n31;d[3]=this.n41;d[4]=this.n12;d[5]=this.n22;d[6]=this.n32;d[7]=this.n42;d[8]=this.n13;d[9]=this.n23;d[10]=this.n33;d[11]=this.n43;d[12]=this.n14;d[13]=this.n24;d[14]=this.n34;d[15]=this.n44;return this},multiplySelf:function(b){this.multiply(this,b);return this},multiplyScalar:function(b){this.n11*=b;this.n12*=b;this.n13*=b;this.n14*=b;
this.n21*=b;this.n22*=b;this.n23*=b;this.n24*=b;this.n31*=b;this.n32*=b;this.n33*=b;this.n34*=b;this.n41*=b;this.n42*=b;this.n43*=b;this.n44*=b;return this},determinant:function(){var b=this.n11,c=this.n12,d=this.n13,e=this.n14,i=this.n21,h=this.n22,j=this.n23,k=this.n24,p=this.n31,o=this.n32,q=this.n33,m=this.n34,t=this.n41,w=this.n42,y=this.n43,C=this.n44;return e*j*o*t-d*k*o*t-e*h*q*t+c*k*q*t+d*h*m*t-c*j*m*t-e*j*p*w+d*k*p*w+e*i*q*w-b*k*q*w-d*i*m*w+b*j*m*w+e*h*p*y-c*k*p*y-e*i*o*y+b*k*o*y+c*i*m*
y-b*h*m*y-d*h*p*C+c*j*p*C+d*i*o*C-b*j*o*C-c*i*q*C+b*h*q*C},transpose:function(){var b;b=this.n21;this.n21=this.n12;this.n12=b;b=this.n31;this.n31=this.n13;this.n13=b;b=this.n32;this.n32=this.n23;this.n23=b;b=this.n41;this.n41=this.n14;this.n14=b;b=this.n42;this.n42=this.n24;this.n24=b;b=this.n43;this.n43=this.n34;this.n43=b;return this},clone:function(){var b=new THREE.Matrix4;b.n11=this.n11;b.n12=this.n12;b.n13=this.n13;b.n14=this.n14;b.n21=this.n21;b.n22=this.n22;b.n23=this.n23;b.n24=this.n24;b.n31=
this.n31;b.n32=this.n32;b.n33=this.n33;b.n34=this.n34;b.n41=this.n41;b.n42=this.n42;b.n43=this.n43;b.n44=this.n44;return b},flatten:function(){this.flat[0]=this.n11;this.flat[1]=this.n21;this.flat[2]=this.n31;this.flat[3]=this.n41;this.flat[4]=this.n12;this.flat[5]=this.n22;this.flat[6]=this.n32;this.flat[7]=this.n42;this.flat[8]=this.n13;this.flat[9]=this.n23;this.flat[10]=this.n33;this.flat[11]=this.n43;this.flat[12]=this.n14;this.flat[13]=this.n24;this.flat[14]=this.n34;this.flat[15]=this.n44;
return this.flat},flattenToArray:function(b){b[0]=this.n11;b[1]=this.n21;b[2]=this.n31;b[3]=this.n41;b[4]=this.n12;b[5]=this.n22;b[6]=this.n32;b[7]=this.n42;b[8]=this.n13;b[9]=this.n23;b[10]=this.n33;b[11]=this.n43;b[12]=this.n14;b[13]=this.n24;b[14]=this.n34;b[15]=this.n44;return b},flattenToArrayOffset:function(b,c){b[c]=this.n11;b[c+1]=this.n21;b[c+2]=this.n31;b[c+3]=this.n41;b[c+4]=this.n12;b[c+5]=this.n22;b[c+6]=this.n32;b[c+7]=this.n42;b[c+8]=this.n13;b[c+9]=this.n23;b[c+10]=this.n33;b[c+11]=
this.n43;b[c+12]=this.n14;b[c+13]=this.n24;b[c+14]=this.n34;b[c+15]=this.n44;return b},setTranslation:function(b,c,d){this.set(1,0,0,b,0,1,0,c,0,0,1,d,0,0,0,1);return this},setScale:function(b,c,d){this.set(b,0,0,0,0,c,0,0,0,0,d,0,0,0,0,1);return this},setRotationX:function(b){var c=Math.cos(b),b=Math.sin(b);this.set(1,0,0,0,0,c,-b,0,0,b,c,0,0,0,0,1);return this},setRotationY:function(b){var c=Math.cos(b),b=Math.sin(b);this.set(c,0,b,0,0,1,0,0,-b,0,c,0,0,0,0,1);return this},setRotationZ:function(b){var c=
Math.cos(b),b=Math.sin(b);this.set(c,-b,0,0,b,c,0,0,0,0,1,0,0,0,0,1);return this},setRotationAxis:function(b,c){var d=Math.cos(c),e=Math.sin(c),i=1-d,h=b.x,j=b.y,k=b.z,p=i*h,o=i*j;this.set(p*h+d,p*j-e*k,p*k+e*j,0,p*j+e*k,o*j+d,o*k-e*h,0,p*k-e*j,o*k+e*h,i*k*k+d,0,0,0,0,1);return this},setPosition:function(b){this.n14=b.x;this.n24=b.y;this.n34=b.z;return this},getPosition:function(){if(!this.position)this.position=new THREE.Vector3;this.position.set(this.n14,this.n24,this.n34);return this.position},
getColumnX:function(){if(!this.columnX)this.columnX=new THREE.Vector3;this.columnX.set(this.n11,this.n21,this.n31);return this.columnX},getColumnY:function(){if(!this.columnY)this.columnY=new THREE.Vector3;this.columnY.set(this.n12,this.n22,this.n32);return this.columnY},getColumnZ:function(){if(!this.columnZ)this.columnZ=new THREE.Vector3;this.columnZ.set(this.n13,this.n23,this.n33);return this.columnZ},setRotationFromEuler:function(b,c){var d=b.x,e=b.y,i=b.z,h=Math.cos(d),d=Math.sin(d),j=Math.cos(e),
e=Math.sin(e),k=Math.cos(i),i=Math.sin(i);switch(c){case "YXZ":var p=j*k,o=j*i,q=e*k,m=e*i;this.n11=p+m*d;this.n12=q*d-o;this.n13=h*e;this.n21=h*i;this.n22=h*k;this.n23=-d;this.n31=o*d-q;this.n32=m+p*d;this.n33=h*j;break;case "ZXY":p=j*k;o=j*i;q=e*k;m=e*i;this.n11=p-m*d;this.n12=-h*i;this.n13=q+o*d;this.n21=o+q*d;this.n22=h*k;this.n23=m-p*d;this.n31=-h*e;this.n32=d;this.n33=h*j;break;case "ZYX":p=h*k;o=h*i;q=d*k;m=d*i;this.n11=j*k;this.n12=q*e-o;this.n13=p*e+m;this.n21=j*i;this.n22=m*e+p;this.n23=
o*e-q;this.n31=-e;this.n32=d*j;this.n33=h*j;break;case "YZX":p=h*j;o=h*e;q=d*j;m=d*e;this.n11=j*k;this.n12=m-p*i;this.n13=q*i+o;this.n21=i;this.n22=h*k;this.n23=-d*k;this.n31=-e*k;this.n32=o*i+q;this.n33=p-m*i;break;case "XZY":p=h*j;o=h*e;q=d*j;m=d*e;this.n11=j*k;this.n12=-i;this.n13=e*k;this.n21=p*i+m;this.n22=h*k;this.n23=o*i-q;this.n31=q*i-o;this.n32=d*k;this.n33=m*i+p;break;default:p=h*k,o=h*i,q=d*k,m=d*i,this.n11=j*k,this.n12=-j*i,this.n13=e,this.n21=o+q*e,this.n22=p-m*e,this.n23=-d*j,this.n31=
m-p*e,this.n32=q+o*e,this.n33=h*j}return this},setRotationFromQuaternion:function(b){var c=b.x,d=b.y,e=b.z,i=b.w,h=c+c,j=d+d,k=e+e,b=c*h,p=c*j;c*=k;var o=d*j;d*=k;e*=k;h*=i;j*=i;i*=k;this.n11=1-(o+e);this.n12=p-i;this.n13=c+j;this.n21=p+i;this.n22=1-(b+e);this.n23=d-h;this.n31=c-j;this.n32=d+h;this.n33=1-(b+o);return this},scale:function(b){var c=b.x,d=b.y,b=b.z;this.n11*=c;this.n12*=d;this.n13*=b;this.n21*=c;this.n22*=d;this.n23*=b;this.n31*=c;this.n32*=d;this.n33*=b;this.n41*=c;this.n42*=d;this.n43*=
b;return this},compose:function(b,c,d){var e=THREE.Matrix4.__m1,i=THREE.Matrix4.__m2;e.identity();e.setRotationFromQuaternion(c);i.setScale(d.x,d.y,d.z);this.multiply(e,i);this.n14=b.x;this.n24=b.y;this.n34=b.z;return this},decompose:function(b,c,d){var e=THREE.Matrix4.__v1,i=THREE.Matrix4.__v2,h=THREE.Matrix4.__v3;e.set(this.n11,this.n21,this.n31);i.set(this.n12,this.n22,this.n32);h.set(this.n13,this.n23,this.n33);b=b instanceof THREE.Vector3?b:new THREE.Vector3;c=c instanceof THREE.Quaternion?c:
new THREE.Quaternion;d=d instanceof THREE.Vector3?d:new THREE.Vector3;d.x=e.length();d.y=i.length();d.z=h.length();b.x=this.n14;b.y=this.n24;b.z=this.n34;e=THREE.Matrix4.__m1;e.copy(this);e.n11/=d.x;e.n21/=d.x;e.n31/=d.x;e.n12/=d.y;e.n22/=d.y;e.n32/=d.y;e.n13/=d.z;e.n23/=d.z;e.n33/=d.z;c.setFromRotationMatrix(e);return[b,c,d]},extractPosition:function(b){this.n14=b.n14;this.n24=b.n24;this.n34=b.n34},extractRotation:function(b,c){var d=1/c.x,e=1/c.y,i=1/c.z;this.n11=b.n11*d;this.n21=b.n21*d;this.n31=
b.n31*d;this.n12=b.n12*e;this.n22=b.n22*e;this.n32=b.n32*e;this.n13=b.n13*i;this.n23=b.n23*i;this.n33=b.n33*i}};
THREE.Matrix4.makeInvert=function(b,c){var d=b.n11,e=b.n12,i=b.n13,h=b.n14,j=b.n21,k=b.n22,p=b.n23,o=b.n24,q=b.n31,m=b.n32,t=b.n33,w=b.n34,y=b.n41,C=b.n42,E=b.n43,D=b.n44;c===void 0&&(c=new THREE.Matrix4);c.n11=p*w*C-o*t*C+o*m*E-k*w*E-p*m*D+k*t*D;c.n12=h*t*C-i*w*C-h*m*E+e*w*E+i*m*D-e*t*D;c.n13=i*o*C-h*p*C+h*k*E-e*o*E-i*k*D+e*p*D;c.n14=h*p*m-i*o*m-h*k*t+e*o*t+i*k*w-e*p*w;c.n21=o*t*y-p*w*y-o*q*E+j*w*E+p*q*D-j*t*D;c.n22=i*w*y-h*t*y+h*q*E-d*w*E-i*q*D+d*t*D;c.n23=h*p*y-i*o*y-h*j*E+d*o*E+i*j*D-d*p*D;c.n24=
i*o*q-h*p*q+h*j*t-d*o*t-i*j*w+d*p*w;c.n31=k*w*y-o*m*y+o*q*C-j*w*C-k*q*D+j*m*D;c.n32=h*m*y-e*w*y-h*q*C+d*w*C+e*q*D-d*m*D;c.n33=i*o*y-h*k*y+h*j*C-d*o*C-e*j*D+d*k*D;c.n34=h*k*q-e*o*q-h*j*m+d*o*m+e*j*w-d*k*w;c.n41=p*m*y-k*t*y-p*q*C+j*t*C+k*q*E-j*m*E;c.n42=e*t*y-i*m*y+i*q*C-d*t*C-e*q*E+d*m*E;c.n43=i*k*y-e*p*y-i*j*C+d*p*C+e*j*E-d*k*E;c.n44=e*p*q-i*k*q+i*j*m-d*p*m-e*j*t+d*k*t;c.multiplyScalar(1/b.determinant());return c};
THREE.Matrix4.makeInvert3x3=function(b){var c=b.m33,d=c.m,e=b.n33*b.n22-b.n32*b.n23,i=-b.n33*b.n21+b.n31*b.n23,h=b.n32*b.n21-b.n31*b.n22,j=-b.n33*b.n12+b.n32*b.n13,k=b.n33*b.n11-b.n31*b.n13,p=-b.n32*b.n11+b.n31*b.n12,o=b.n23*b.n12-b.n22*b.n13,q=-b.n23*b.n11+b.n21*b.n13,m=b.n22*b.n11-b.n21*b.n12,b=b.n11*e+b.n21*j+b.n31*o;b==0&&console.error("THREE.Matrix4.makeInvert3x3: Matrix not invertible.");b=1/b;d[0]=b*e;d[1]=b*i;d[2]=b*h;d[3]=b*j;d[4]=b*k;d[5]=b*p;d[6]=b*o;d[7]=b*q;d[8]=b*m;return c};
THREE.Matrix4.makeFrustum=function(b,c,d,e,i,h){var j;j=new THREE.Matrix4;j.n11=2*i/(c-b);j.n12=0;j.n13=(c+b)/(c-b);j.n14=0;j.n21=0;j.n22=2*i/(e-d);j.n23=(e+d)/(e-d);j.n24=0;j.n31=0;j.n32=0;j.n33=-(h+i)/(h-i);j.n34=-2*h*i/(h-i);j.n41=0;j.n42=0;j.n43=-1;j.n44=0;return j};THREE.Matrix4.makePerspective=function(b,c,d,e){var i,b=d*Math.tan(b*Math.PI/360);i=-b;return THREE.Matrix4.makeFrustum(i*c,b*c,i,b,d,e)};
THREE.Matrix4.makeOrtho=function(b,c,d,e,i,h){var j,k,p,o;j=new THREE.Matrix4;k=c-b;p=d-e;o=h-i;j.n11=2/k;j.n12=0;j.n13=0;j.n14=-((c+b)/k);j.n21=0;j.n22=2/p;j.n23=0;j.n24=-((d+e)/p);j.n31=0;j.n32=0;j.n33=-2/o;j.n34=-((h+i)/o);j.n41=0;j.n42=0;j.n43=0;j.n44=1;return j};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;THREE.Matrix4.__m1=new THREE.Matrix4;THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.name="";this.id=THREE.Object3DCount++;this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder="XYZ";this.scale=new THREE.Vector3(1,1,1);this.flipSided=this.doubleSided=this.dynamic=!1;this.renderDepth=null;this.rotationAutoUpdate=!0;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=
!0;this.quaternion=new THREE.Quaternion;this.useQuaternion=!1;this.boundRadius=0;this.boundRadiusScale=1;this.visible=!0;this.receiveShadow=this.castShadow=!1;this.frustumCulled=!0;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={constructor:THREE.Object3D,translate:function(b,c){this.matrix.rotateAxis(c);this.position.addSelf(c.multiplyScalar(b))},translateX:function(b){this.translate(b,this._vector.set(1,0,0))},translateY:function(b){this.translate(b,this._vector.set(0,1,0))},translateZ:function(b){this.translate(b,this._vector.set(0,0,1))},lookAt:function(b){this.matrix.lookAt(b,this.position,this.up);this.rotationAutoUpdate&&this.rotation.setRotationFromMatrix(this.matrix)},add:function(b){if(this.children.indexOf(b)===
-1){b.parent!==void 0&&b.parent.removeChild(b);b.parent=this;this.children.push(b);for(var c=this;c.parent!==void 0;)c=c.parent;c!==void 0&&c instanceof THREE.Scene&&c.addChildRecurse(b)}},remove:function(b){var c=this,d=this.children.indexOf(b);if(d!==-1){b.parent=void 0;for(this.children.splice(d,1);c.parent!==void 0;)c=c.parent;c!==void 0&&c instanceof THREE.Scene&&c.removeChildRecurse(b)}},getChildByName:function(b,c){var d,e,i;d=0;for(e=this.children.length;d<e;d++){i=this.children[d];if(i.name===
b)return i;if(c&&(i=i.getChildByName(b,c),i!==void 0))return i}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,this.eulerOrder);if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1)this.matrix.scale(this.scale),this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z));this.matrixWorldNeedsUpdate=!0},update:function(b,c,d){this.matrixAutoUpdate&&
this.updateMatrix();if(this.matrixWorldNeedsUpdate||c)b?this.matrixWorld.multiply(b,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixRotationWorld.extractRotation(this.matrixWorld,this.scale),this.matrixWorldNeedsUpdate=!1,c=!0;for(var b=0,e=this.children.length;b<e;b++)this.children[b].update(this.matrixWorld,c,d)},addChild:function(b){console.warn("DEPRECATED: Object3D.addChild() is now Object3D.add().");this.add(b)},removeChild:function(b){console.warn("DEPRECATED: Object3D.removeChild() is now Object3D.remove().");
this.remove(b)}};THREE.Object3DCount=0;
THREE.Projector=function(){function b(){var b=p[k]=p[k]||new THREE.RenderableVertex;k++;return b}function c(b,c){return c.z-b.z}function d(b,c){var d=0,f=1,e=b.z+b.w,h=c.z+c.w,i=-b.z+b.w,j=-c.z+c.w;return e>=0&&h>=0&&i>=0&&j>=0?!0:e<0&&h<0||i<0&&j<0?!1:(e<0?d=Math.max(d,e/(e-h)):h<0&&(f=Math.min(f,e/(e-h))),i<0?d=Math.max(d,i/(i-j)):j<0&&(f=Math.min(f,i/(i-j))),f<d?!1:(b.lerpSelf(c,d),c.lerpSelf(b,1-f),!0))}var e,i,h=[],j,k,p=[],o,q,m=[],t,w=[],y,C,E=[],D,wa,xa=[],qa=[],sa=[],ja=new THREE.Vector4,
G=new THREE.Vector4,r=new THREE.Matrix4,ka=new THREE.Matrix4,R=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4],la=new THREE.Vector4,$=new THREE.Vector4;this.projectVector=function(b,c){r.multiply(c.projectionMatrix,c.matrixWorldInverse);r.multiplyVector3(b);return b};this.unprojectVector=function(b,c){r.multiply(c.matrixWorld,THREE.Matrix4.makeInvert(c.projectionMatrix));r.multiplyVector3(b);return b};this.pickingRay=function(b,c){var d;
b.z=-1;d=new THREE.Vector3(b.x,b.y,1);this.unprojectVector(b,c);this.unprojectVector(d,c);d.subSelf(b).normalize();return new THREE.Ray(b,d)};this.projectObjects=function(b,d,j){var f,k;i=qa.length=0;f=b.objects;b=0;for(d=f.length;b<d;b++){k=f[b];var o;if(!(o=!k.visible))if(o=k instanceof THREE.Mesh)if(o=k.frustumCulled){a:{o=void 0;for(var p=k.matrixWorld,m=-k.geometry.boundingSphere.radius*Math.max(k.scale.x,Math.max(k.scale.y,k.scale.z)),q=0;q<6;q++)if(o=R[q].x*p.n14+R[q].y*p.n24+R[q].z*p.n34+
R[q].w,o<=m){o=!1;break a}o=!0}o=!o}if(!o)o=h[i]=h[i]||new THREE.RenderableObject,i++,e=o,ja.copy(k.position),r.multiplyVector3(ja),e.object=k,e.z=ja.z,qa.push(e)}j&&qa.sort(c);return qa};this.projectScene=function(e,h,i){var f=h.near,qa=h.far,ja,va,N,T,I,V,X,W,aa,J,Aa,La,Ra,Ia,Ba,Da,za;wa=C=t=q=sa.length=0;h.matrixAutoUpdate&&h.update(void 0,!0);e.update(void 0,!1,h);r.multiply(h.projectionMatrix,h.matrixWorldInverse);R[0].set(r.n41-r.n11,r.n42-r.n12,r.n43-r.n13,r.n44-r.n14);R[1].set(r.n41+r.n11,
r.n42+r.n12,r.n43+r.n13,r.n44+r.n14);R[2].set(r.n41+r.n21,r.n42+r.n22,r.n43+r.n23,r.n44+r.n24);R[3].set(r.n41-r.n21,r.n42-r.n22,r.n43-r.n23,r.n44-r.n24);R[4].set(r.n41-r.n31,r.n42-r.n32,r.n43-r.n33,r.n44-r.n34);R[5].set(r.n41+r.n31,r.n42+r.n32,r.n43+r.n33,r.n44+r.n34);for(ja=0;ja<6;ja++)aa=R[ja],aa.divideScalar(Math.sqrt(aa.x*aa.x+aa.y*aa.y+aa.z*aa.z));aa=this.projectObjects(e,h,!0);e=0;for(ja=aa.length;e<ja;e++)if(J=aa[e].object,J.visible)if(Aa=J.matrixWorld,La=J.matrixRotationWorld,Ra=J.materials,
Ia=J.overdraw,k=0,J instanceof THREE.Mesh){Ba=J.geometry;T=Ba.vertices;Da=Ba.faces;Ba=Ba.faceVertexUvs;va=0;for(N=T.length;va<N;va++)j=b(),j.positionWorld.copy(T[va].position),Aa.multiplyVector3(j.positionWorld),j.positionScreen.copy(j.positionWorld),r.multiplyVector4(j.positionScreen),j.positionScreen.x/=j.positionScreen.w,j.positionScreen.y/=j.positionScreen.w,j.visible=j.positionScreen.z>f&&j.positionScreen.z<qa;T=0;for(va=Da.length;T<va;T++){N=Da[T];if(N instanceof THREE.Face3)if(I=p[N.a],V=p[N.b],
X=p[N.c],I.visible&&V.visible&&X.visible&&(J.doubleSided||J.flipSided!=(X.positionScreen.x-I.positionScreen.x)*(V.positionScreen.y-I.positionScreen.y)-(X.positionScreen.y-I.positionScreen.y)*(V.positionScreen.x-I.positionScreen.x)<0))W=m[q]=m[q]||new THREE.RenderableFace3,q++,o=W,o.v1.copy(I),o.v2.copy(V),o.v3.copy(X);else continue;else if(N instanceof THREE.Face4)if(I=p[N.a],V=p[N.b],X=p[N.c],W=p[N.d],I.visible&&V.visible&&X.visible&&W.visible&&(J.doubleSided||J.flipSided!=((W.positionScreen.x-I.positionScreen.x)*
(V.positionScreen.y-I.positionScreen.y)-(W.positionScreen.y-I.positionScreen.y)*(V.positionScreen.x-I.positionScreen.x)<0||(V.positionScreen.x-X.positionScreen.x)*(W.positionScreen.y-X.positionScreen.y)-(V.positionScreen.y-X.positionScreen.y)*(W.positionScreen.x-X.positionScreen.x)<0)))za=w[t]=w[t]||new THREE.RenderableFace4,t++,o=za,o.v1.copy(I),o.v2.copy(V),o.v3.copy(X),o.v4.copy(W);else continue;o.normalWorld.copy(N.normal);La.multiplyVector3(o.normalWorld);o.centroidWorld.copy(N.centroid);Aa.multiplyVector3(o.centroidWorld);
o.centroidScreen.copy(o.centroidWorld);r.multiplyVector3(o.centroidScreen);X=N.vertexNormals;I=0;for(V=X.length;I<V;I++)W=o.vertexNormalsWorld[I],W.copy(X[I]),La.multiplyVector3(W);I=0;for(V=Ba.length;I<V;I++)if(za=Ba[I][T]){X=0;for(W=za.length;X<W;X++)o.uvs[I][X]=za[X]}o.meshMaterials=Ra;o.faceMaterials=N.materials;o.overdraw=Ia;o.z=o.centroidScreen.z;sa.push(o)}}else if(J instanceof THREE.Line){ka.multiply(r,Aa);T=J.geometry.vertices;I=b();I.positionScreen.copy(T[0].position);ka.multiplyVector4(I.positionScreen);
va=1;for(N=T.length;va<N;va++)if(I=b(),I.positionScreen.copy(T[va].position),ka.multiplyVector4(I.positionScreen),V=p[k-2],la.copy(I.positionScreen),$.copy(V.positionScreen),d(la,$))la.multiplyScalar(1/la.w),$.multiplyScalar(1/$.w),Aa=E[C]=E[C]||new THREE.RenderableLine,C++,y=Aa,y.v1.positionScreen.copy(la),y.v2.positionScreen.copy($),y.z=Math.max(la.z,$.z),y.materials=J.materials,sa.push(y)}else if(J instanceof THREE.Particle&&(G.set(J.matrixWorld.n14,J.matrixWorld.n24,J.matrixWorld.n34,1),r.multiplyVector4(G),
G.z/=G.w,G.z>0&&G.z<1))Aa=xa[wa]=xa[wa]||new THREE.RenderableParticle,wa++,D=Aa,D.x=G.x/G.w,D.y=G.y/G.w,D.z=G.z,D.rotation=J.rotation.z,D.scale.x=J.scale.x*Math.abs(D.x-(G.x+h.projectionMatrix.n11)/(G.w+h.projectionMatrix.n14)),D.scale.y=J.scale.y*Math.abs(D.y-(G.y+h.projectionMatrix.n22)/(G.w+h.projectionMatrix.n24)),D.materials=J.materials,sa.push(D);i&&sa.sort(c);return sa}};THREE.Quaternion=function(b,c,d,e){this.set(b||0,c||0,d||0,e!==void 0?e:1)};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(b,c,d,e){this.x=b;this.y=c;this.z=d;this.w=e;return this},copy:function(b){this.x=b.x;this.y=b.y;this.z=b.z;this.w=b.w;return this},setFromEuler:function(b){var c=Math.PI/360,d=b.x*c,e=b.y*c,i=b.z*c,b=Math.cos(e),e=Math.sin(e),c=Math.cos(-i),i=Math.sin(-i),h=Math.cos(d),d=Math.sin(d),j=b*c,k=e*i;this.w=j*h-k*d;this.x=j*d+k*h;this.y=e*c*h+b*i*d;this.z=b*i*h-e*c*d;return this},setFromAxisAngle:function(b,c){var d=c/2,e=Math.sin(d);
this.x=b.x*e;this.y=b.y*e;this.z=b.z*e;this.w=Math.cos(d);return this},setFromRotationMatrix:function(b){var c=Math.pow(b.determinant(),1/3);this.w=Math.sqrt(Math.max(0,c+b.n11+b.n22+b.n33))/2;this.x=Math.sqrt(Math.max(0,c+b.n11-b.n22-b.n33))/2;this.y=Math.sqrt(Math.max(0,c-b.n11+b.n22-b.n33))/2;this.z=Math.sqrt(Math.max(0,c-b.n11-b.n22+b.n33))/2;this.x=b.n32-b.n23<0?-Math.abs(this.x):Math.abs(this.x);this.y=b.n13-b.n31<0?-Math.abs(this.y):Math.abs(this.y);this.z=b.n21-b.n12<0?-Math.abs(this.z):Math.abs(this.z);
this.normalize();return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x*=-1;this.y*=-1;this.z*=-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var b=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);b==0?this.w=this.z=this.y=this.x=0:(b=1/b,this.x*=b,this.y*=b,this.z*=b,this.w*=b);return this},multiplySelf:function(b){var c=
this.x,d=this.y,e=this.z,i=this.w,h=b.x,j=b.y,k=b.z,b=b.w;this.x=c*b+i*h+d*k-e*j;this.y=d*b+i*j+e*h-c*k;this.z=e*b+i*k+c*j-d*h;this.w=i*b-c*h-d*j-e*k;return this},multiply:function(b,c){this.x=b.x*c.w+b.y*c.z-b.z*c.y+b.w*c.x;this.y=-b.x*c.z+b.y*c.w+b.z*c.x+b.w*c.y;this.z=b.x*c.y-b.y*c.x+b.z*c.w+b.w*c.z;this.w=-b.x*c.x-b.y*c.y-b.z*c.z+b.w*c.w;return this},multiplyVector3:function(b,c){c||(c=b);var d=b.x,e=b.y,i=b.z,h=this.x,j=this.y,k=this.z,p=this.w,o=p*d+j*i-k*e,q=p*e+k*d-h*i,m=p*i+h*e-j*d,d=-h*
d-j*e-k*i;c.x=o*p+d*-h+q*-k-m*-j;c.y=q*p+d*-j+m*-h-o*-k;c.z=m*p+d*-k+o*-j-q*-h;return c}};THREE.Quaternion.slerp=function(b,c,d,e){var i=b.w*c.w+b.x*c.x+b.y*c.y+b.z*c.z;if(Math.abs(i)>=1)return d.w=b.w,d.x=b.x,d.y=b.y,d.z=b.z,d;var h=Math.acos(i),j=Math.sqrt(1-i*i);if(Math.abs(j)<0.001)return d.w=0.5*(b.w+c.w),d.x=0.5*(b.x+c.x),d.y=0.5*(b.y+c.y),d.z=0.5*(b.z+c.z),d;i=Math.sin((1-e)*h)/j;e=Math.sin(e*h)/j;d.w=b.w*i+c.w*e;d.x=b.x*i+c.x*e;d.y=b.y*i+c.y*e;d.z=b.z*i+c.z*e;return d};
THREE.Vertex=function(b){this.position=b||new THREE.Vector3};THREE.Face3=function(b,c,d,e,i,h){this.a=b;this.b=c;this.c=d;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.color=i instanceof THREE.Color?i:new THREE.Color;this.vertexColors=i instanceof Array?i:[];this.vertexTangents=[];this.materials=h instanceof Array?h:[h];this.centroid=new THREE.Vector3};
THREE.Face4=function(b,c,d,e,i,h,j){this.a=b;this.b=c;this.c=d;this.d=e;this.normal=i instanceof THREE.Vector3?i:new THREE.Vector3;this.vertexNormals=i instanceof Array?i:[];this.color=h instanceof THREE.Color?h:new THREE.Color;this.vertexColors=h instanceof Array?h:[];this.vertexTangents=[];this.materials=j instanceof Array?j:[j];this.centroid=new THREE.Vector3};THREE.UV=function(b,c){this.u=b||0;this.v=c||0};
THREE.UV.prototype={constructor:THREE.UV,set:function(b,c){this.u=b;this.v=c;return this},copy:function(b){this.u=b.u;this.v=b.v;return this},clone:function(){return new THREE.UV(this.u,this.v)}};THREE.Geometry=function(){this.id=THREE.GeometryCount++;this.vertices=[];this.colors=[];this.faces=[];this.faceUvs=[[]];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.skinWeights=[];this.skinIndices=[];this.boundingSphere=this.boundingBox=null;this.dynamic=this.hasTangents=!1};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(b){var c=new THREE.Matrix4;c.extractRotation(b,new THREE.Vector3(1,1,1));for(var d=0,e=this.vertices.length;d<e;d++)b.multiplyVector3(this.vertices[d].position);d=0;for(e=this.faces.length;d<e;d++){var i=this.faces[d];c.multiplyVector3(i.normal);for(var h=0,j=i.vertexNormals.length;h<j;h++)c.multiplyVector3(i.vertexNormals[h]);b.multiplyVector3(i.centroid)}},computeCentroids:function(){var b,c,d;b=0;for(c=this.faces.length;b<
c;b++)d=this.faces[b],d.centroid.set(0,0,0),d instanceof THREE.Face3?(d.centroid.addSelf(this.vertices[d.a].position),d.centroid.addSelf(this.vertices[d.b].position),d.centroid.addSelf(this.vertices[d.c].position),d.centroid.divideScalar(3)):d instanceof THREE.Face4&&(d.centroid.addSelf(this.vertices[d.a].position),d.centroid.addSelf(this.vertices[d.b].position),d.centroid.addSelf(this.vertices[d.c].position),d.centroid.addSelf(this.vertices[d.d].position),d.centroid.divideScalar(4))},computeFaceNormals:function(b){var c,
d,e,i,h,j,k=new THREE.Vector3,p=new THREE.Vector3;e=0;for(i=this.faces.length;e<i;e++){h=this.faces[e];if(b&&h.vertexNormals.length){k.set(0,0,0);c=0;for(d=h.vertexNormals.length;c<d;c++)k.addSelf(h.vertexNormals[c]);k.divideScalar(3)}else c=this.vertices[h.a],d=this.vertices[h.b],j=this.vertices[h.c],k.sub(j.position,d.position),p.sub(c.position,d.position),k.crossSelf(p);k.isZero()||k.normalize();h.normal.copy(k)}},computeVertexNormals:function(){var b,c,d,e;if(this.__tmpVertices==void 0){e=this.__tmpVertices=
Array(this.vertices.length);b=0;for(c=this.vertices.length;b<c;b++)e[b]=new THREE.Vector3;b=0;for(c=this.faces.length;b<c;b++)if(d=this.faces[b],d instanceof THREE.Face3)d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];else if(d instanceof THREE.Face4)d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}else{e=this.__tmpVertices;b=0;for(c=this.vertices.length;b<c;b++)e[b].set(0,0,0)}b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof
THREE.Face3?(e[d.a].addSelf(d.normal),e[d.b].addSelf(d.normal),e[d.c].addSelf(d.normal)):d instanceof THREE.Face4&&(e[d.a].addSelf(d.normal),e[d.b].addSelf(d.normal),e[d.c].addSelf(d.normal),e[d.d].addSelf(d.normal));b=0;for(c=this.vertices.length;b<c;b++)e[b].normalize();b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof THREE.Face3?(d.vertexNormals[0].copy(e[d.a]),d.vertexNormals[1].copy(e[d.b]),d.vertexNormals[2].copy(e[d.c])):d instanceof THREE.Face4&&(d.vertexNormals[0].copy(e[d.a]),
d.vertexNormals[1].copy(e[d.b]),d.vertexNormals[2].copy(e[d.c]),d.vertexNormals[3].copy(e[d.d]))},computeTangents:function(){function b(b,f,c,d,e,h,i){k=b.vertices[f].position;p=b.vertices[c].position;o=b.vertices[d].position;q=j[e];m=j[h];t=j[i];w=p.x-k.x;y=o.x-k.x;C=p.y-k.y;E=o.y-k.y;D=p.z-k.z;wa=o.z-k.z;xa=m.u-q.u;qa=t.u-q.u;sa=m.v-q.v;ja=t.v-q.v;G=1/(xa*ja-qa*sa);la.set((ja*w-sa*y)*G,(ja*C-sa*E)*G,(ja*D-sa*wa)*G);$.set((xa*y-qa*w)*G,(xa*E-qa*C)*G,(xa*wa-qa*D)*G);ka[f].addSelf(la);ka[c].addSelf(la);
ka[d].addSelf(la);R[f].addSelf($);R[c].addSelf($);R[d].addSelf($)}var c,d,e,i,h,j,k,p,o,q,m,t,w,y,C,E,D,wa,xa,qa,sa,ja,G,r,ka=[],R=[],la=new THREE.Vector3,$=new THREE.Vector3,ya=new THREE.Vector3,S=new THREE.Vector3,M=new THREE.Vector3;c=0;for(d=this.vertices.length;c<d;c++)ka[c]=new THREE.Vector3,R[c]=new THREE.Vector3;c=0;for(d=this.faces.length;c<d;c++)h=this.faces[c],j=this.faceVertexUvs[0][c],h instanceof THREE.Face3?b(this,h.a,h.b,h.c,0,1,2):h instanceof THREE.Face4&&(b(this,h.a,h.b,h.c,0,1,
2),b(this,h.a,h.b,h.d,0,1,3));var f=["a","b","c","d"];c=0;for(d=this.faces.length;c<d;c++){h=this.faces[c];for(e=0;e<h.vertexNormals.length;e++)M.copy(h.vertexNormals[e]),i=h[f[e]],r=ka[i],ya.copy(r),ya.subSelf(M.multiplyScalar(M.dot(r))).normalize(),S.cross(h.vertexNormals[e],r),i=S.dot(R[i]),i=i<0?-1:1,h.vertexTangents[e]=new THREE.Vector4(ya.x,ya.y,ya.z,i)}this.hasTangents=!0},computeBoundingBox:function(){var b;if(this.vertices.length>0){this.boundingBox={x:[this.vertices[0].position.x,this.vertices[0].position.x],
y:[this.vertices[0].position.y,this.vertices[0].position.y],z:[this.vertices[0].position.z,this.vertices[0].position.z]};for(var c=1,d=this.vertices.length;c<d;c++){b=this.vertices[c];if(b.position.x<this.boundingBox.x[0])this.boundingBox.x[0]=b.position.x;else if(b.position.x>this.boundingBox.x[1])this.boundingBox.x[1]=b.position.x;if(b.position.y<this.boundingBox.y[0])this.boundingBox.y[0]=b.position.y;else if(b.position.y>this.boundingBox.y[1])this.boundingBox.y[1]=b.position.y;if(b.position.z<
this.boundingBox.z[0])this.boundingBox.z[0]=b.position.z;else if(b.position.z>this.boundingBox.z[1])this.boundingBox.z[1]=b.position.z}}},computeBoundingSphere:function(){for(var b=0,c=0,d=this.vertices.length;c<d;c++)b=Math.max(b,this.vertices[c].position.length());this.boundingSphere={radius:b}},mergeVertices:function(){var b={},c=[],d=[],e,i=Math.pow(10,4),h,j;h=0;for(j=this.vertices.length;h<j;h++)e=this.vertices[h].position,e=[Math.round(e.x*i),Math.round(e.y*i),Math.round(e.z*i)].join("_"),
b[e]===void 0?(b[e]=h,c.push(this.vertices[h]),d[h]=c.length-1):d[h]=d[b[e]];h=0;for(j=this.faces.length;h<j;h++){b=this.faces[h];if(b instanceof THREE.Face3)b.a=d[b.a],b.b=d[b.b],b.c=d[b.c];if(b instanceof THREE.Face4)b.a=d[b.a],b.b=d[b.b],b.c=d[b.c],b.d=d[b.d]}this.vertices=c}};THREE.GeometryCount=0;
THREE.Spline=function(b){function c(b,c,d,e,h,i,j){b=(d-b)*0.5;e=(e-c)*0.5;return(2*(c-d)+b+e)*j+(-3*(c-d)-2*b-e)*i+b*h+c}this.points=b;var d=[],e={x:0,y:0,z:0},i,h,j,k,p,o,q,m,t;this.initFromArray=function(b){this.points=[];for(var c=0;c<b.length;c++)this.points[c]={x:b[c][0],y:b[c][1],z:b[c][2]}};this.getPoint=function(b){i=(this.points.length-1)*b;h=Math.floor(i);j=i-h;d[0]=h==0?h:h-1;d[1]=h;d[2]=h>this.points.length-2?h:h+1;d[3]=h>this.points.length-3?h:h+2;o=this.points[d[0]];q=this.points[d[1]];
m=this.points[d[2]];t=this.points[d[3]];k=j*j;p=j*k;e.x=c(o.x,q.x,m.x,t.x,j,k,p);e.y=c(o.y,q.y,m.y,t.y,j,k,p);e.z=c(o.z,q.z,m.z,t.z,j,k,p);return e};this.getControlPointsArray=function(){var b,c,d=this.points.length,e=[];for(b=0;b<d;b++)c=this.points[b],e[b]=[c.x,c.y,c.z];return e};this.getLength=function(b){var c,d,e=c=c=0,h=new THREE.Vector3,i=new THREE.Vector3,j=[],k=0;j[0]=0;b||(b=100);d=this.points.length*b;h.copy(this.points[0]);for(b=1;b<d;b++)c=b/d,position=this.getPoint(c),i.copy(position),
k+=i.distanceTo(h),h.copy(position),c*=this.points.length-1,c=Math.floor(c),c!=e&&(j[c]=k,e=c);j[j.length]=k;return{chunks:j,total:k}};this.reparametrizeByArcLength=function(b){var c,d,e,h,i,j,k=[],o=new THREE.Vector3,p=this.getLength();k.push(o.copy(this.points[0]).clone());for(c=1;c<this.points.length;c++){d=p.chunks[c]-p.chunks[c-1];j=Math.ceil(b*d/p.total);h=(c-1)/(this.points.length-1);i=c/(this.points.length-1);for(d=1;d<j-1;d++)e=h+d*(1/j)*(i-h),position=this.getPoint(e),k.push(o.copy(position).clone());
k.push(o.copy(this.points[c]).clone())}this.points=k}};THREE.Edge=function(b,c,d,e){this.vertices=[b,c];this.vertexIndices=[d,e];this.faces=[];this.faceIndices=[]};THREE.Camera=function(){if(arguments.length)return console.warn("DEPRECATED: Camera() is now PerspectiveCamera() or OrthographicCamera()."),new THREE.PerspectiveCamera(arguments[0],arguments[1],arguments[2],arguments[3]);THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4};
THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.lookAt=function(b){this.matrix.lookAt(this.position,b,this.up);this.rotationAutoUpdate&&this.rotation.setRotationFromMatrix(this.matrix)};
THREE.Camera.prototype.update=function(b,c,d){this.matrixAutoUpdate&&this.updateMatrix();if(c||this.matrixWorldNeedsUpdate)b?this.matrixWorld.multiply(b,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,c=!0,THREE.Matrix4.makeInvert(this.matrixWorld,this.matrixWorldInverse);for(b=0;b<this.children.length;b++)this.children[b].update(this.matrixWorld,c,d)};
THREE.OrthographicCamera=function(b,c,d,e,i,h){THREE.Camera.call(this);this.left=b;this.right=c;this.top=d;this.bottom=e;this.near=i!==void 0?i:0.1;this.far=h!==void 0?h:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=new THREE.Camera;THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera;THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix=THREE.Matrix4.makeOrtho(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.PerspectiveCamera=function(b,c,d,e){THREE.Camera.call(this);this.fov=b!==void 0?b:50;this.aspect=c!==void 0?c:1;this.near=d!==void 0?d:0.1;this.far=e!==void 0?e:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=new THREE.Camera;THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera;THREE.PerspectiveCamera.prototype.setLens=function(b,c){this.fov=2*Math.atan((c!==void 0?c:43.25)/(b*2));this.fov*=180/Math.PI;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(b,c,d,e,i,h){this.fullWidth=b;this.fullHeight=c;this.x=d;this.y=e;this.width=i;this.height=h;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var b=this.fullWidth/this.fullHeight,c=Math.tan(this.fov*Math.PI/360)*this.near,d=-c,e=b*d,b=Math.abs(b*c-e),d=Math.abs(c-d);this.projectionMatrix=THREE.Matrix4.makeFrustum(e+this.x*b/this.fullWidth,e+(this.x+this.width)*b/this.fullWidth,c-(this.y+this.height)*d/this.fullHeight,c-this.y*d/this.fullHeight,this.near,this.far)}else this.projectionMatrix=THREE.Matrix4.makePerspective(this.fov,this.aspect,this.near,
this.far)};THREE.Light=function(b){THREE.Object3D.call(this);this.color=new THREE.Color(b)};THREE.Light.prototype=new THREE.Object3D;THREE.Light.prototype.constructor=THREE.Light;THREE.Light.prototype.supr=THREE.Object3D.prototype;THREE.AmbientLight=function(b){THREE.Light.call(this,b)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;
THREE.DirectionalLight=function(b,c,d){THREE.Light.call(this,b);this.position=new THREE.Vector3(0,1,0);this.intensity=c!==void 0?c:1;this.distance=d!==void 0?d:0};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;THREE.PointLight=function(b,c,d){THREE.Light.call(this,b);this.position=new THREE.Vector3(0,0,0);this.intensity=c!==void 0?c:1;this.distance=d!==void 0?d:0};THREE.PointLight.prototype=new THREE.Light;
THREE.PointLight.prototype.constructor=THREE.PointLight;THREE.SpotLight=function(b,c,d,e){THREE.Light.call(this,b);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=c!==void 0?c:1;this.distance=d!==void 0?d:0;this.castShadow=e!==void 0?e:!1};THREE.SpotLight.prototype=new THREE.Light;THREE.SpotLight.prototype.constructor=THREE.SpotLight;
THREE.Material=function(b){this.name="";this.id=THREE.MaterialCount++;b=b||{};this.opacity=b.opacity!==void 0?b.opacity:1;this.transparent=b.transparent!==void 0?b.transparent:!1;this.blending=b.blending!==void 0?b.blending:THREE.NormalBlending;this.depthTest=b.depthTest!==void 0?b.depthTest:!0;this.depthWrite=b.depthWrite!==void 0?b.depthWrite:!0;this.polygonOffset=b.polygonOffset!==void 0?b.polygonOffset:!1;this.polygonOffsetFactor=b.polygonOffsetFactor!==void 0?b.polygonOffsetFactor:0;this.polygonOffsetUnits=
b.polygonOffsetUnits!==void 0?b.polygonOffsetUnits:0;this.alphaTest=b.alphaTest!==void 0?b.alphaTest:0};THREE.MaterialCount=0;THREE.NoShading=0;THREE.FlatShading=1;THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NormalBlending=0;THREE.AdditiveBlending=1;THREE.SubtractiveBlending=2;THREE.MultiplyBlending=3;THREE.AdditiveAlphaBlending=4;
THREE.LineBasicMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.linewidth=b.linewidth!==void 0?b.linewidth:1;this.linecap=b.linecap!==void 0?b.linecap:"round";this.linejoin=b.linejoin!==void 0?b.linejoin:"round";this.vertexColors=b.vertexColors?b.vertexColors:!1;this.fog=b.fog!==void 0?b.fog:!0};THREE.LineBasicMaterial.prototype=new THREE.Material;THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial;
THREE.MeshBasicMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.map=b.map!==void 0?b.map:null;this.lightMap=b.lightMap!==void 0?b.lightMap:null;this.envMap=b.envMap!==void 0?b.envMap:null;this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;this.fog=b.fog!==void 0?b.fog:
!0;this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;this.wireframe=b.wireframe!==void 0?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";this.wireframeLinejoin=b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";this.vertexColors=b.vertexColors!==void 0?b.vertexColors:!1;this.skinning=b.skinning!==void 0?b.skinning:!1;this.morphTargets=b.morphTargets!==void 0?b.morphTargets:
!1};THREE.MeshBasicMaterial.prototype=new THREE.Material;THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial;
THREE.MeshLambertMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.map=b.map!==void 0?b.map:null;this.lightMap=b.lightMap!==void 0?b.lightMap:null;this.envMap=b.envMap!==void 0?b.envMap:null;this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;this.fog=b.fog!==void 0?
b.fog:!0;this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;this.wireframe=b.wireframe!==void 0?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";this.wireframeLinejoin=b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";this.vertexColors=b.vertexColors!==void 0?b.vertexColors:!1;this.skinning=b.skinning!==void 0?b.skinning:!1;this.morphTargets=b.morphTargets!==void 0?
b.morphTargets:!1};THREE.MeshLambertMaterial.prototype=new THREE.Material;THREE.MeshLambertMaterial.prototype.constructor=THREE.MeshLambertMaterial;
THREE.MeshPhongMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.ambient=b.ambient!==void 0?new THREE.Color(b.ambient):new THREE.Color(328965);this.specular=b.specular!==void 0?new THREE.Color(b.specular):new THREE.Color(1118481);this.shininess=b.shininess!==void 0?b.shininess:30;this.map=b.map!==void 0?b.map:null;this.lightMap=b.lightMap!==void 0?b.lightMap:null;this.envMap=b.envMap!==void 0?b.envMap:null;
this.combine=b.combine!==void 0?b.combine:THREE.MultiplyOperation;this.reflectivity=b.reflectivity!==void 0?b.reflectivity:1;this.refractionRatio=b.refractionRatio!==void 0?b.refractionRatio:0.98;this.fog=b.fog!==void 0?b.fog:!0;this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;this.wireframe=b.wireframe!==void 0?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;this.wireframeLinecap=b.wireframeLinecap!==void 0?b.wireframeLinecap:"round";this.wireframeLinejoin=
b.wireframeLinejoin!==void 0?b.wireframeLinejoin:"round";this.vertexColors=b.vertexColors!==void 0?b.vertexColors:!1;this.skinning=b.skinning!==void 0?b.skinning:!1;this.morphTargets=b.morphTargets!==void 0?b.morphTargets:!1};THREE.MeshPhongMaterial.prototype=new THREE.Material;THREE.MeshPhongMaterial.prototype.constructor=THREE.MeshPhongMaterial;
THREE.MeshDepthMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;this.wireframe=b.wireframe!==void 0?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1};THREE.MeshDepthMaterial.prototype=new THREE.Material;THREE.MeshDepthMaterial.prototype.constructor=THREE.MeshDepthMaterial;
THREE.MeshNormalMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.shading=b.shading?b.shading:THREE.FlatShading;this.wireframe=b.wireframe?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth?b.wireframeLinewidth:1};THREE.MeshNormalMaterial.prototype=new THREE.Material;THREE.MeshNormalMaterial.prototype.constructor=THREE.MeshNormalMaterial;THREE.MeshFaceMaterial=function(){};
THREE.MeshShaderMaterial=function(b){console.warn("DEPRECATED: MeshShaderMaterial() is now ShaderMaterial().");return new THREE.ShaderMaterial(b)};
THREE.ParticleBasicMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.map=b.map!==void 0?b.map:null;this.size=b.size!==void 0?b.size:1;this.sizeAttenuation=b.sizeAttenuation!==void 0?b.sizeAttenuation:!0;this.vertexColors=b.vertexColors!==void 0?b.vertexColors:!1;this.fog=b.fog!==void 0?b.fog:!0};THREE.ParticleBasicMaterial.prototype=new THREE.Material;THREE.ParticleBasicMaterial.prototype.constructor=THREE.ParticleBasicMaterial;
THREE.ShaderMaterial=function(b){THREE.Material.call(this,b);b=b||{};this.fragmentShader=b.fragmentShader!==void 0?b.fragmentShader:"void main() {}";this.vertexShader=b.vertexShader!==void 0?b.vertexShader:"void main() {}";this.uniforms=b.uniforms!==void 0?b.uniforms:{};this.attributes=b.attributes;this.shading=b.shading!==void 0?b.shading:THREE.SmoothShading;this.wireframe=b.wireframe!==void 0?b.wireframe:!1;this.wireframeLinewidth=b.wireframeLinewidth!==void 0?b.wireframeLinewidth:1;this.fog=b.fog!==
void 0?b.fog:!1;this.lights=b.lights!==void 0?b.lights:!1;this.vertexColors=b.vertexColors!==void 0?b.vertexColors:!1;this.skinning=b.skinning!==void 0?b.skinning:!1;this.morphTargets=b.morphTargets!==void 0?b.morphTargets:!1};THREE.ShaderMaterial.prototype=new THREE.Material;THREE.ShaderMaterial.prototype.constructor=THREE.ShaderMaterial;
THREE.Texture=function(b,c,d,e,i,h){this.id=THREE.TextureCount++;this.image=b;this.mapping=c!==void 0?c:new THREE.UVMapping;this.wrapS=d!==void 0?d:THREE.ClampToEdgeWrapping;this.wrapT=e!==void 0?e:THREE.ClampToEdgeWrapping;this.magFilter=i!==void 0?i:THREE.LinearFilter;this.minFilter=h!==void 0?h:THREE.LinearMipMapLinearFilter;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.needsUpdate=!1};
THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var b=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);b.offset.copy(this.offset);b.repeat.copy(this.repeat);return b}};THREE.TextureCount=0;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.LatitudeReflectionMapping=function(){};THREE.LatitudeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.UVMapping=function(){};THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.ByteType=9;THREE.UnsignedByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;
THREE.UnsignedIntType=14;THREE.FloatType=15;THREE.AlphaFormat=16;THREE.RGBFormat=17;THREE.RGBAFormat=18;THREE.LuminanceFormat=19;THREE.LuminanceAlphaFormat=20;THREE.DataTexture=function(b,c,d,e,i,h,j,k,p){THREE.Texture.call(this,null,i,h,j,k,p);this.image={data:b,width:c,height:d};this.format=e!==void 0?e:THREE.RGBAFormat};THREE.DataTexture.prototype=new THREE.Texture;THREE.DataTexture.prototype.constructor=THREE.DataTexture;
THREE.DataTexture.prototype.clone=function(){var b=new THREE.DataTexture(this.data.slice(0),this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);b.offset.copy(this.offset);b.repeat.copy(this.repeat);return b};THREE.Particle=function(b){THREE.Object3D.call(this);this.materials=b instanceof Array?b:[b]};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.ParticleSystem=function(b,c){THREE.Object3D.call(this);this.geometry=b;this.materials=c instanceof Array?c:[c];this.sortParticles=!1};THREE.ParticleSystem.prototype=new THREE.Object3D;THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;THREE.Line=function(b,c,d){THREE.Object3D.call(this);this.geometry=b;this.materials=c instanceof Array?c:[c];this.type=d!=void 0?d:THREE.LineStrip};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;
THREE.Line.prototype.constructor=THREE.Line;
THREE.Mesh=function(b,c){THREE.Object3D.call(this);this.geometry=b;this.materials=c&&c.length?c:[c];this.overdraw=!1;if(this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere(),this.boundRadius=b.boundingSphere.radius,this.geometry.morphTargets.length)){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var d=0;d<this.geometry.morphTargets.length;d++)this.morphTargetInfluences.push(0),this.morphTargetDictionary[this.geometry.morphTargets[d].name]=
d}};THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Mesh.prototype.supr=THREE.Object3D.prototype;THREE.Mesh.prototype.getMorphTargetIndexByName=function(b){if(this.morphTargetDictionary[b]!==void 0)return this.morphTargetDictionary[b];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+b+" does not exist. Returning 0.");return 0};
THREE.Bone=function(b){THREE.Object3D.call(this);this.skin=b;this.skinMatrix=new THREE.Matrix4;this.hasNoneBoneChildren=!1};THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.supr=THREE.Object3D.prototype;
THREE.Bone.prototype.update=function(b,c,d){this.matrixAutoUpdate&&(c|=this.updateMatrix());if(c||this.matrixWorldNeedsUpdate)b?this.skinMatrix.multiply(b,this.matrix):this.skinMatrix.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,c=!0;var e,i=this.children.length;if(this.hasNoneBoneChildren){this.matrixWorld.multiply(this.skin.matrixWorld,this.skinMatrix);for(e=0;e<i;e++)b=this.children[e],b instanceof THREE.Bone?b.update(this.skinMatrix,c,d):b.update(this.matrixWorld,!0,d)}else for(e=0;e<i;e++)this.children[e].update(this.skinMatrix,
c,d)};THREE.Bone.prototype.addChild=function(b){if(this.children.indexOf(b)===-1&&(b.parent!==void 0&&b.parent.removeChild(b),b.parent=this,this.children.push(b),!(b instanceof THREE.Bone)))this.hasNoneBoneChildren=!0};
THREE.SkinnedMesh=function(b,c){THREE.Mesh.call(this,b,c);this.identityMatrix=new THREE.Matrix4;this.bones=[];this.boneMatrices=[];var d,e,i,h,j,k;if(this.geometry.bones!==void 0){for(d=0;d<this.geometry.bones.length;d++)i=this.geometry.bones[d],h=i.pos,j=i.rotq,k=i.scl,e=this.addBone(),e.name=i.name,e.position.set(h[0],h[1],h[2]),e.quaternion.set(j[0],j[1],j[2],j[3]),e.useQuaternion=!0,k!==void 0?e.scale.set(k[0],k[1],k[2]):e.scale.set(1,1,1);for(d=0;d<this.bones.length;d++)i=this.geometry.bones[d],
e=this.bones[d],i.parent===-1?this.addChild(e):this.bones[i.parent].addChild(e);this.boneMatrices=new Float32Array(16*this.bones.length);this.pose()}};THREE.SkinnedMesh.prototype=new THREE.Mesh;THREE.SkinnedMesh.prototype.constructor=THREE.SkinnedMesh;
THREE.SkinnedMesh.prototype.update=function(b,c,d){if(this.visible){this.matrixAutoUpdate&&(c|=this.updateMatrix());if(c||this.matrixWorldNeedsUpdate)b?this.matrixWorld.multiply(b,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,c=!0;var e,i=this.children.length;for(e=0;e<i;e++)b=this.children[e],b instanceof THREE.Bone?b.update(this.identityMatrix,!1,d):b.update(this.matrixWorld,c,d);d=this.bones.length;ba=this.bones;bm=this.boneMatrices;for(c=0;c<d;c++)ba[c].skinMatrix.flattenToArrayOffset(bm,
c*16)}};THREE.SkinnedMesh.prototype.addBone=function(b){b===void 0&&(b=new THREE.Bone(this));this.bones.push(b);return b};
THREE.SkinnedMesh.prototype.pose=function(){this.update(void 0,!0);for(var b,c=[],d=0;d<this.bones.length;d++)b=this.bones[d],c.push(THREE.Matrix4.makeInvert(b.skinMatrix)),b.skinMatrix.flattenToArrayOffset(this.boneMatrices,d*16);if(this.geometry.skinVerticesA===void 0){this.geometry.skinVerticesA=[];this.geometry.skinVerticesB=[];var e;for(b=0;b<this.geometry.skinIndices.length;b++){var d=this.geometry.vertices[b].position,i=this.geometry.skinIndices[b].x,h=this.geometry.skinIndices[b].y;e=new THREE.Vector3(d.x,
d.y,d.z);this.geometry.skinVerticesA.push(c[i].multiplyVector3(e));e=new THREE.Vector3(d.x,d.y,d.z);this.geometry.skinVerticesB.push(c[h].multiplyVector3(e));this.geometry.skinWeights[b].x+this.geometry.skinWeights[b].y!==1&&(d=(1-(this.geometry.skinWeights[b].x+this.geometry.skinWeights[b].y))*0.5,this.geometry.skinWeights[b].x+=d,this.geometry.skinWeights[b].y+=d)}}};THREE.Ribbon=function(b,c){THREE.Object3D.call(this);this.geometry=b;this.materials=c instanceof Array?c:[c]};
THREE.Ribbon.prototype=new THREE.Object3D;THREE.Ribbon.prototype.constructor=THREE.Ribbon;THREE.LOD=function(){THREE.Object3D.call(this);this.LODs=[]};THREE.LOD.prototype=new THREE.Object3D;THREE.LOD.prototype.constructor=THREE.LOD;THREE.LOD.prototype.supr=THREE.Object3D.prototype;THREE.LOD.prototype.addLevel=function(b,c){c===void 0&&(c=0);for(var c=Math.abs(c),d=0;d<this.LODs.length;d++)if(c<this.LODs[d].visibleAtDistance)break;this.LODs.splice(d,0,{visibleAtDistance:c,object3D:b});this.add(b)};
THREE.LOD.prototype.update=function(b,c,d){this.matrixAutoUpdate&&(c|=this.updateMatrix());if(c||this.matrixWorldNeedsUpdate)b?this.matrixWorld.multiply(b,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,c=!0;if(this.LODs.length>1){b=d.matrixWorldInverse;b=-(b.n31*this.position.x+b.n32*this.position.y+b.n33*this.position.z+b.n34);this.LODs[0].object3D.visible=!0;for(var e=1;e<this.LODs.length;e++)if(b>=this.LODs[e].visibleAtDistance)this.LODs[e-1].object3D.visible=!1,
this.LODs[e].object3D.visible=!0;else break;for(;e<this.LODs.length;e++)this.LODs[e].object3D.visible=!1}for(b=0;b<this.children.length;b++)this.children[b].update(this.matrixWorld,c,d)};
THREE.Sprite=function(b){THREE.Object3D.call(this);this.color=b.color!==void 0?new THREE.Color(b.color):new THREE.Color(16777215);this.map=b.map instanceof THREE.Texture?b.map:THREE.ImageUtils.loadTexture(b.map);this.blending=b.blending!==void 0?b.blending:THREE.NormalBlending;this.useScreenCoordinates=b.useScreenCoordinates!==void 0?b.useScreenCoordinates:!0;this.mergeWith3D=b.mergeWith3D!==void 0?b.mergeWith3D:!this.useScreenCoordinates;this.affectedByDistance=b.affectedByDistance!==void 0?b.affectedByDistance:
!this.useScreenCoordinates;this.scaleByViewport=b.scaleByViewport!==void 0?b.scaleByViewport:!this.affectedByDistance;this.alignment=b.alignment instanceof THREE.Vector2?b.alignment:THREE.SpriteAlignment.center;this.rotation3d=this.rotation;this.rotation=0;this.opacity=1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=new THREE.Vector2(1,1)};THREE.Sprite.prototype=new THREE.Object3D;THREE.Sprite.prototype.constructor=THREE.Sprite;THREE.Sprite.prototype.supr=THREE.Object3D.prototype;
THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);this.rotation3d.set(0,0,this.rotation);this.matrix.setRotationFromEuler(this.rotation3d);if(this.scale.x!==1||this.scale.y!==1)this.matrix.scale(this.scale),this.boundRadiusScale=Math.max(this.scale.x,this.scale.y);this.matrixWorldNeedsUpdate=!0};THREE.SpriteAlignment={};THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);
THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);
THREE.Scene=function(){THREE.Object3D.call(this);this.fog=null;this.matrixAutoUpdate=!1;this.collisions=this.overrideMaterial=null;this.objects=[];this.lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;THREE.Scene.prototype.supr=THREE.Object3D.prototype;THREE.Scene.prototype.add=function(b){this.supr.add.call(this,b);this.addChildRecurse(b)};
THREE.Scene.prototype.addChildRecurse=function(b){if(b instanceof THREE.Light)this.lights.indexOf(b)===-1&&this.lights.push(b);else if(!(b instanceof THREE.Camera||b instanceof THREE.Bone)&&this.objects.indexOf(b)===-1){this.objects.push(b);this.__objectsAdded.push(b);var c=this.__objectsRemoved.indexOf(b);c!==-1&&this.__objectsRemoved.splice(c,1)}for(c=0;c<b.children.length;c++)this.addChildRecurse(b.children[c])};THREE.Scene.prototype.remove=function(b){this.supr.remove.call(this,b);this.removeChildRecurse(b)};
THREE.Scene.prototype.removeChildRecurse=function(b){if(b instanceof THREE.Light){var c=this.lights.indexOf(b);c!==-1&&this.lights.splice(c,1)}else b instanceof THREE.Camera||(c=this.objects.indexOf(b),c!==-1&&(this.objects.splice(c,1),this.__objectsRemoved.push(b),c=this.__objectsAdded.indexOf(b),c!==-1&&this.__objectsAdded.splice(c,1)));for(c=0;c<b.children.length;c++)this.removeChildRecurse(b.children[c])};
THREE.Scene.prototype.addChild=function(b){console.warn("DEPRECATED: Scene.addChild() is now Scene.add().");this.add(b)};THREE.Scene.prototype.addObject=function(b){console.warn("DEPRECATED: Scene.addObject() is now Scene.add().");this.add(b)};THREE.Scene.prototype.addLight=function(b){console.warn("DEPRECATED: Scene.addLight() is now Scene.add().");this.add(b)};THREE.Scene.prototype.removeChild=function(b){console.warn("DEPRECATED: Scene.removeChild() is now Scene.remove().");this.remove(b)};
THREE.Scene.prototype.removeObject=function(b){console.warn("DEPRECATED: Scene.removeObject() is now Scene.remove().");this.remove(b)};THREE.Scene.prototype.removeLight=function(b){console.warn("DEPRECATED: Scene.removeLight() is now Scene.remove().");this.remove(b)};THREE.Fog=function(b,c,d){this.color=new THREE.Color(b);this.near=c!==void 0?c:1;this.far=d!==void 0?d:1E3};THREE.FogExp2=function(b,c){this.color=new THREE.Color(b);this.density=c!==void 0?c:2.5E-4};
THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform int combine;\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\nvec4 cubeColor = textureCube( envMap, vec3( -vReflect.x, vReflect.yz ) );\nif ( combine == 1 ) {\ngl_FragColor = vec4( mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity ), opacity );\n} else {\ngl_FragColor = gl_FragColor * cubeColor;\n}\n#endif",envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",
envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",
lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",lights_pars_vertex:"uniform bool enableLighting;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif",
lights_vertex:"if ( !enableLighting ) {\nvLightWeighting = vec3( 1.0 );\n} else {\nvLightWeighting = ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nfloat directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );\nvLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat pointLightWeighting = max( dot( transformedNormal, lVector ), 0.0 );\nvLightWeighting += pointLightColor[ i ] * pointLightWeighting * lDistance;\n}\n#endif\n}",
lights_phong_pars_vertex:"#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif",lights_phong_vertex:"#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif",
lights_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",lights_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nvec3 pointHalfVector = normalize( vPointLight[ i ].xyz + viewPosition );\nfloat pointDistance = vPointLight[ i ].w;\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = pow( pointDotNormalHalf, shininess );\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * pointDistance;\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDistance;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = pow( dirDotNormalHalf, shininess );\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight;\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * totalDiffuse + totalSpecular + ambientLightColor * ambient;",
color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\nvColor = color;\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n#endif",skinning_vertex:"#ifdef USE_SKINNING\ngl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;\ngl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;\ngl_Position  = projectionMatrix * viewMatrix * objectMatrix * gl_Position;\n#endif",
morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\nuniform float morphTargetInfluences[ 8 ];\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0, 0.0, 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",
default_vertex:"#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif",shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform float shadowDarkness;\nuniform float shadowBias;\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",
shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_SOFT\nconst float xPixelOffset = 1.0 / SHADOWMAP_WIDTH;\nconst float yPixelOffset = 1.0 / SHADOWMAP_HEIGHT;\n#endif\nvec4 shadowColor = vec4( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nshadowCoord.z += shadowBias;\nif ( shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0 ) {\n#ifdef SHADOWMAP_SOFT\nfloat shadow = 0.0;\nfor ( float y = -1.25; y <= 1.25; y += 1.25 )\nfor ( float x = -1.25; x <= 1.25; x += 1.25 ) {\nvec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadow += 1.0;\n}\nshadow /= 9.0;\nshadowColor = shadowColor * vec4( vec3( ( 1.0 - shadowDarkness * shadow ) ), 1.0 );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec4( vec3( shadowDarkness ), 1.0 );\n#endif\n}\n}\ngl_FragColor = gl_FragColor * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );\n}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif"};
THREE.UniformsUtils={merge:function(b){var c,d,e,i={};for(c=0;c<b.length;c++)for(d in e=this.clone(b[c]),e)i[d]=e[d];return i},clone:function(b){var c,d,e,i={};for(c in b)for(d in i[c]={},b[c])e=b[c][d],i[c][d]=e instanceof THREE.Color||e instanceof THREE.Vector2||e instanceof THREE.Vector3||e instanceof THREE.Vector4||e instanceof THREE.Matrix4||e instanceof THREE.Texture?e.clone():e instanceof Array?e.slice():e;return i}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:2,texture:null},envMap:{type:"t",value:1,texture:null},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},fog:{fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",
value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{enableLighting:{type:"i",value:1},ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",
value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:6,texture:[]},shadowMatrix:{type:"m4v",value:[]},shadowBias:{type:"f",value:0.0039},shadowDarkness:{type:"f",value:0.2}}};
THREE.ShaderLib={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",fragmentShader:"#ifdef GL_ES\nprecision highp float;\n#endif\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"},
depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",value:1}},
vertexShader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,
THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,
THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,
THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap]),vertexShader:["varying vec3 vLightWeighting;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_pars_vertex,
THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,"vec3 transformedNormal = normalize( normalMatrix * normal );",THREE.ShaderChunk.lights_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,
THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nvarying vec3 vLightWeighting;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,
"gl_FragColor = gl_FragColor * vec4( vLightWeighting, 1.0 );",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(328965)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",
value:30}}]),vertexShader:["varying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,
THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = -mvPosition.xyz;\nvec3 transformedNormal = normalize( normalMatrix * normal );\nvNormal = transformedNormal;",THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 specular;\nuniform float shininess;",
THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.lights_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,
THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",
THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,
"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};
THREE.WebGLRenderer=function(b){function c(b,c,d){var e,h,i,j=b.vertices,L=j.length,z=b.colors,k=z.length,o=b.__vertexArray,p=b.__colorArray,q=b.__sortArray,v=b.__dirtyVertices,m=b.__dirtyColors,t=b.__webglCustomAttributes,u,r;if(t)for(u in t)t[u].offset=0;if(d.sortParticles){Fa.multiplySelf(d.matrixWorld);for(e=0;e<L;e++)h=j[e].position,Ja.copy(h),Fa.multiplyVector3(Ja),q[e]=[Ja.z,e];q.sort(function(b,c){return c[0]-b[0]});for(e=0;e<L;e++)h=j[q[e][1]].position,i=e*3,o[i]=h.x,o[i+1]=h.y,o[i+2]=h.z;
for(e=0;e<k;e++)i=e*3,color=z[q[e][1]],p[i]=color.r,p[i+1]=color.g,p[i+2]=color.b;if(t)for(u in t){e=t[u];z=e.value.length;for(i=0;i<z;i++){index=q[i][1];k=e.offset;if(e.size===1){if(e.boundTo===void 0||e.boundTo==="vertices")e.array[k]=e.value[index]}else{if(e.boundTo===void 0||e.boundTo==="vertices")r=e.value[index];e.size===2?(e.array[k]=r.x,e.array[k+1]=r.y):e.size===3?e.type==="c"?(e.array[k]=r.r,e.array[k+1]=r.g,e.array[k+2]=r.b):(e.array[k]=r.x,e.array[k+1]=r.y,e.array[k+2]=r.z):(e.array[k]=
r.x,e.array[k+1]=r.y,e.array[k+2]=r.z,e.array[k+3]=r.w)}e.offset+=e.size}}}else{if(v)for(e=0;e<L;e++)h=j[e].position,i=e*3,o[i]=h.x,o[i+1]=h.y,o[i+2]=h.z;if(m)for(e=0;e<k;e++)color=z[e],i=e*3,p[i]=color.r,p[i+1]=color.g,p[i+2]=color.b;if(t)for(u in t)if(e=t[u],e.__original.needsUpdate){z=e.value.length;for(i=0;i<z;i++){k=e.offset;if(e.size===1){if(e.boundTo===void 0||e.boundTo==="vertices")e.array[k]=e.value[i]}else{if(e.boundTo===void 0||e.boundTo==="vertices")r=e.value[i];e.size===2?(e.array[k]=
r.x,e.array[k+1]=r.y):e.size===3?e.type==="c"?(e.array[k]=r.r,e.array[k+1]=r.g,e.array[k+2]=r.b):(e.array[k]=r.x,e.array[k+1]=r.y,e.array[k+2]=r.z):(e.array[k]=r.x,e.array[k+1]=r.y,e.array[k+2]=r.z,e.array[k+3]=r.w)}e.offset+=e.size}}}if(v||d.sortParticles)f.bindBuffer(f.ARRAY_BUFFER,b.__webglVertexBuffer),f.bufferData(f.ARRAY_BUFFER,o,c);if(m||d.sortParticles)f.bindBuffer(f.ARRAY_BUFFER,b.__webglColorBuffer),f.bufferData(f.ARRAY_BUFFER,p,c);if(t)for(u in t)if(e=t[u],e.__original.needsUpdate||d.sortParticles)f.bindBuffer(f.ARRAY_BUFFER,
e.buffer),f.bufferData(f.ARRAY_BUFFER,e.array,c)}function d(b,c,d,e,h){e.program||M.initMaterial(e,c,d,h);if(e.morphTargets&&!h.__webglMorphTargetInfluences){h.__webglMorphTargetInfluences=new Float32Array(M.maxMorphTargets);for(var i=0,j=M.maxMorphTargets;i<j;i++)h.__webglMorphTargetInfluences[i]=0}var k=!1,i=e.program,j=i.uniforms,z=e.uniforms;i!=Wa&&(f.useProgram(i),Wa=i,k=!0);if(e.id!=N)N=e.id,k=!0;if(k){f.uniformMatrix4fv(j.projectionMatrix,!1,Ta);if(d&&e.fog)if(z.fogColor.value=d.color,d instanceof
THREE.Fog)z.fogNear.value=d.near,z.fogFar.value=d.far;else if(d instanceof THREE.FogExp2)z.fogDensity.value=d.density;if(e instanceof THREE.MeshPhongMaterial||e instanceof THREE.MeshLambertMaterial||e.lights){for(var o,p,q=0,m=0,v=0,t,u,w,y=Ya,F=y.directional.colors,C=y.directional.positions,A=y.point.colors,D=y.point.positions,E=y.point.distances,G=0,K=0,d=o=w=0,k=c.length;d<k;d++)if(o=c[d],p=o.color,t=o.position,u=o.intensity,w=o.distance,o instanceof THREE.AmbientLight)q+=p.r,m+=p.g,v+=p.b;else if(o instanceof
THREE.DirectionalLight)w=G*3,F[w]=p.r*u,F[w+1]=p.g*u,F[w+2]=p.b*u,C[w]=t.x,C[w+1]=t.y,C[w+2]=t.z,G+=1;else if(o instanceof THREE.SpotLight)w=G*3,F[w]=p.r*u,F[w+1]=p.g*u,F[w+2]=p.b*u,p=1/t.length(),C[w]=t.x*p,C[w+1]=t.y*p,C[w+2]=t.z*p,G+=1;else if(o instanceof THREE.PointLight)o=K*3,A[o]=p.r*u,A[o+1]=p.g*u,A[o+2]=p.b*u,D[o]=t.x,D[o+1]=t.y,D[o+2]=t.z,E[K]=w,K+=1;d=G*3;for(k=F.length;d<k;d++)F[d]=0;d=K*3;for(k=A.length;d<k;d++)A[d]=0;y.point.length=K;y.directional.length=G;y.ambient[0]=q;y.ambient[1]=
m;y.ambient[2]=v;c=Ya;z.enableLighting.value=c.directional.length+c.point.length;z.ambientLightColor.value=c.ambient;z.directionalLightColor.value=c.directional.colors;z.directionalLightDirection.value=c.directional.positions;z.pointLightColor.value=c.point.colors;z.pointLightPosition.value=c.point.positions;z.pointLightDistance.value=c.point.distances}if(e instanceof THREE.MeshBasicMaterial||e instanceof THREE.MeshLambertMaterial||e instanceof THREE.MeshPhongMaterial)z.diffuse.value=e.color,z.opacity.value=
e.opacity,(z.map.texture=e.map)&&z.offsetRepeat.value.set(e.map.offset.x,e.map.offset.y,e.map.repeat.x,e.map.repeat.y),z.lightMap.texture=e.lightMap,z.envMap.texture=e.envMap,z.reflectivity.value=e.reflectivity,z.refractionRatio.value=e.refractionRatio,z.combine.value=e.combine,z.useRefract.value=e.envMap&&e.envMap.mapping instanceof THREE.CubeRefractionMapping;if(e instanceof THREE.LineBasicMaterial)z.diffuse.value=e.color,z.opacity.value=e.opacity;else if(e instanceof THREE.ParticleBasicMaterial)z.psColor.value=
e.color,z.opacity.value=e.opacity,z.size.value=e.size,z.scale.value=Ca.height/2,z.map.texture=e.map;else if(e instanceof THREE.MeshPhongMaterial)z.ambient.value=e.ambient,z.specular.value=e.specular,z.shininess.value=e.shininess;else if(e instanceof THREE.MeshDepthMaterial)z.mNear.value=b.near,z.mFar.value=b.far,z.opacity.value=e.opacity;else if(e instanceof THREE.MeshNormalMaterial)z.opacity.value=e.opacity;if(h.receiveShadow&&!e._shadowPass&&z.shadowMatrix){for(c=0;c<Sa.length;c++)z.shadowMatrix.value[c]=
Sa[c],z.shadowMap.texture[c]=M.shadowMap[c];z.shadowDarkness.value=M.shadowMapDarkness;z.shadowBias.value=M.shadowMapBias}c=e.uniformsList;z=0;for(d=c.length;z<d;z++)if(m=i.uniforms[c[z][1]])if(q=c[z][0],v=q.type,k=q.value,v=="i")f.uniform1i(m,k);else if(v=="f")f.uniform1f(m,k);else if(v=="v2")f.uniform2f(m,k.x,k.y);else if(v=="v3")f.uniform3f(m,k.x,k.y,k.z);else if(v=="v4")f.uniform4f(m,k.x,k.y,k.z,k.w);else if(v=="c")f.uniform3f(m,k.r,k.g,k.b);else if(v=="fv1")f.uniform1fv(m,k);else if(v=="fv")f.uniform3fv(m,
k);else if(v=="v3v"){if(!q._array)q._array=new Float32Array(3*k.length);v=0;for(t=k.length;v<t;v++)y=v*3,q._array[y]=k[v].x,q._array[y+1]=k[v].y,q._array[y+2]=k[v].z;f.uniform3fv(m,q._array)}else if(v=="m4"){if(!q._array)q._array=new Float32Array(16);k.flattenToArray(q._array);f.uniformMatrix4fv(m,!1,q._array)}else if(v=="m4v"){if(!q._array)q._array=new Float32Array(16*k.length);v=0;for(t=k.length;v<t;v++)k[v].flattenToArrayOffset(q._array,v*16);f.uniformMatrix4fv(m,!1,q._array)}else if(v=="t"){if(f.uniform1i(m,
k),m=q.texture)if(m.image instanceof Array&&m.image.length==6){if(q=m,q.image.length==6)if(q.needsUpdate){if(!q.image.__webglTextureCube)q.image.__webglTextureCube=f.createTexture();f.activeTexture(f.TEXTURE0+k);f.bindTexture(f.TEXTURE_CUBE_MAP,q.image.__webglTextureCube);for(k=0;k<6;k++)f.texImage2D(f.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,f.RGBA,f.RGBA,f.UNSIGNED_BYTE,q.image[k]);r(f.TEXTURE_CUBE_MAP,q,q.image[0]);q.needsUpdate=!1}else f.activeTexture(f.TEXTURE0+k),f.bindTexture(f.TEXTURE_CUBE_MAP,q.image.__webglTextureCube)}else m instanceof
THREE.WebGLRenderTargetCube?(q=m,f.activeTexture(f.TEXTURE0+k),f.bindTexture(f.TEXTURE_CUBE_MAP,q.__webglTexture)):ka(m,k)}else if(v=="tv"){if(!q._array){q._array=[];v=0;for(t=q.texture.length;v<t;v++)q._array[v]=k+v}f.uniform1iv(m,q._array);v=0;for(t=q.texture.length;v<t;v++)(m=q.texture[v])&&ka(m,q._array[v])}(e instanceof THREE.ShaderMaterial||e instanceof THREE.MeshPhongMaterial||e.envMap)&&j.cameraPosition!==null&&f.uniform3f(j.cameraPosition,b.position.x,b.position.y,b.position.z);(e instanceof
THREE.MeshPhongMaterial||e instanceof THREE.MeshLambertMaterial||e instanceof THREE.ShaderMaterial||e.skinning)&&j.viewMatrix!==null&&f.uniformMatrix4fv(j.viewMatrix,!1,Ua);e.skinning&&(f.uniformMatrix4fv(j.cameraInverseMatrix,!1,Ua),f.uniformMatrix4fv(j.boneGlobalMatrices,!1,h.boneMatrices))}f.uniformMatrix4fv(j.modelViewMatrix,!1,h._modelViewMatrixArray);j.normalMatrix&&f.uniformMatrix3fv(j.normalMatrix,!1,h._normalMatrixArray);(e instanceof THREE.ShaderMaterial||e.envMap||e.skinning||h.receiveShadow)&&
j.objectMatrix!==null&&f.uniformMatrix4fv(j.objectMatrix,!1,h._objectMatrixArray);return i}function e(b,c,e,h,i,j){if(h.opacity!=0){var k,e=d(b,c,e,h,j),b=e.attributes,c=!1,e=i.id*16777215+e.id;e!=T&&(T=e,c=!0);if(!h.morphTargets&&b.position>=0)c&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglVertexBuffer),f.vertexAttribPointer(b.position,3,f.FLOAT,!1,0,0));else if(j.morphTargetBase){e=h.program.attributes;j.morphTargetBase!==-1?(f.bindBuffer(f.ARRAY_BUFFER,i.__webglMorphTargetsBuffers[j.morphTargetBase]),
f.vertexAttribPointer(e.position,3,f.FLOAT,!1,0,0)):e.position>=0&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglVertexBuffer),f.vertexAttribPointer(e.position,3,f.FLOAT,!1,0,0));if(j.morphTargetForcedOrder.length)for(var o=0,z=j.morphTargetForcedOrder,q=j.morphTargetInfluences;o<h.numSupportedMorphTargets&&o<z.length;)f.bindBuffer(f.ARRAY_BUFFER,i.__webglMorphTargetsBuffers[z[o]]),f.vertexAttribPointer(e["morphTarget"+o],3,f.FLOAT,!1,0,0),j.__webglMorphTargetInfluences[o]=q[z[o]],o++;else{var z=[],p=-1,
m=0,q=j.morphTargetInfluences,t,v=q.length,o=0;for(j.morphTargetBase!==-1&&(z[j.morphTargetBase]=!0);o<h.numSupportedMorphTargets;){for(t=0;t<v;t++)!z[t]&&q[t]>p&&(m=t,p=q[m]);f.bindBuffer(f.ARRAY_BUFFER,i.__webglMorphTargetsBuffers[m]);f.vertexAttribPointer(e["morphTarget"+o],3,f.FLOAT,!1,0,0);j.__webglMorphTargetInfluences[o]=p;z[m]=1;p=-1;o++}}h.program.uniforms.morphTargetInfluences!==null&&f.uniform1fv(h.program.uniforms.morphTargetInfluences,j.__webglMorphTargetInfluences)}if(c){if(i.__webglCustomAttributes)for(k in i.__webglCustomAttributes)b[k]>=
0&&(e=i.__webglCustomAttributes[k],f.bindBuffer(f.ARRAY_BUFFER,e.buffer),f.vertexAttribPointer(b[k],e.size,f.FLOAT,!1,0,0));b.color>=0&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglColorBuffer),f.vertexAttribPointer(b.color,3,f.FLOAT,!1,0,0));b.normal>=0&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglNormalBuffer),f.vertexAttribPointer(b.normal,3,f.FLOAT,!1,0,0));b.tangent>=0&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglTangentBuffer),f.vertexAttribPointer(b.tangent,4,f.FLOAT,!1,0,0));b.uv>=0&&(i.__webglUVBuffer?(f.bindBuffer(f.ARRAY_BUFFER,
i.__webglUVBuffer),f.vertexAttribPointer(b.uv,2,f.FLOAT,!1,0,0),f.enableVertexAttribArray(b.uv)):f.disableVertexAttribArray(b.uv));b.uv2>=0&&(i.__webglUV2Buffer?(f.bindBuffer(f.ARRAY_BUFFER,i.__webglUV2Buffer),f.vertexAttribPointer(b.uv2,2,f.FLOAT,!1,0,0),f.enableVertexAttribArray(b.uv2)):f.disableVertexAttribArray(b.uv2));h.skinning&&b.skinVertexA>=0&&b.skinVertexB>=0&&b.skinIndex>=0&&b.skinWeight>=0&&(f.bindBuffer(f.ARRAY_BUFFER,i.__webglSkinVertexABuffer),f.vertexAttribPointer(b.skinVertexA,4,
f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,i.__webglSkinVertexBBuffer),f.vertexAttribPointer(b.skinVertexB,4,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,i.__webglSkinIndicesBuffer),f.vertexAttribPointer(b.skinIndex,4,f.FLOAT,!1,0,0),f.bindBuffer(f.ARRAY_BUFFER,i.__webglSkinWeightsBuffer),f.vertexAttribPointer(b.skinWeight,4,f.FLOAT,!1,0,0))}j instanceof THREE.Mesh?(h.wireframe?(f.lineWidth(h.wireframeLinewidth),c&&f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,i.__webglLineBuffer),f.drawElements(f.LINES,i.__webglLineCount,
f.UNSIGNED_SHORT,0)):(c&&f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,i.__webglFaceBuffer),f.drawElements(f.TRIANGLES,i.__webglFaceCount,f.UNSIGNED_SHORT,0)),M.info.render.calls++,M.info.render.vertices+=i.__webglFaceCount,M.info.render.faces+=i.__webglFaceCount/3):j instanceof THREE.Line?(j=j.type==THREE.LineStrip?f.LINE_STRIP:f.LINES,f.lineWidth(h.linewidth),f.drawArrays(j,0,i.__webglLineCount),M.info.render.calls++):j instanceof THREE.ParticleSystem?(f.drawArrays(f.POINTS,0,i.__webglParticleCount),M.info.render.calls++):
j instanceof THREE.Ribbon&&(f.drawArrays(f.TRIANGLE_STRIP,0,i.__webglVertexCount),M.info.render.calls++)}}function i(b,c,d){if(!b.__webglVertexBuffer)b.__webglVertexBuffer=f.createBuffer();if(!b.__webglNormalBuffer)b.__webglNormalBuffer=f.createBuffer();b.hasPos&&(f.bindBuffer(f.ARRAY_BUFFER,b.__webglVertexBuffer),f.bufferData(f.ARRAY_BUFFER,b.positionArray,f.DYNAMIC_DRAW),f.enableVertexAttribArray(c.attributes.position),f.vertexAttribPointer(c.attributes.position,3,f.FLOAT,!1,0,0));if(b.hasNormal){f.bindBuffer(f.ARRAY_BUFFER,
b.__webglNormalBuffer);if(d==THREE.FlatShading){var e,h,i,j,k,z,o,q,p,m,v=b.count*3;for(m=0;m<v;m+=9)d=b.normalArray,e=d[m],h=d[m+1],i=d[m+2],j=d[m+3],z=d[m+4],q=d[m+5],k=d[m+6],o=d[m+7],p=d[m+8],e=(e+j+k)/3,h=(h+z+o)/3,i=(i+q+p)/3,d[m]=e,d[m+1]=h,d[m+2]=i,d[m+3]=e,d[m+4]=h,d[m+5]=i,d[m+6]=e,d[m+7]=h,d[m+8]=i}f.bufferData(f.ARRAY_BUFFER,b.normalArray,f.DYNAMIC_DRAW);f.enableVertexAttribArray(c.attributes.normal);f.vertexAttribPointer(c.attributes.normal,3,f.FLOAT,!1,0,0)}f.drawArrays(f.TRIANGLES,
0,b.count);b.count=0}function h(b){if(V!=b.doubleSided)b.doubleSided?f.disable(f.CULL_FACE):f.enable(f.CULL_FACE),V=b.doubleSided;if(X!=b.flipSided)b.flipSided?f.frontFace(f.CW):f.frontFace(f.CCW),X=b.flipSided}function j(b){aa!=b&&(b?f.enable(f.DEPTH_TEST):f.disable(f.DEPTH_TEST),aa=b)}function k(b){J!=b&&(f.depthMask(b),J=b)}function p(b,c,d){Aa!=b&&(b?f.enable(f.POLYGON_OFFSET_FILL):f.disable(f.POLYGON_OFFSET_FILL),Aa=b);if(b&&(La!=c||Ra!=d))f.polygonOffset(c,d),La=c,Ra=d}function o(b){ha[0].set(b.n41-
b.n11,b.n42-b.n12,b.n43-b.n13,b.n44-b.n14);ha[1].set(b.n41+b.n11,b.n42+b.n12,b.n43+b.n13,b.n44+b.n14);ha[2].set(b.n41+b.n21,b.n42+b.n22,b.n43+b.n23,b.n44+b.n24);ha[3].set(b.n41-b.n21,b.n42-b.n22,b.n43-b.n23,b.n44-b.n24);ha[4].set(b.n41-b.n31,b.n42-b.n32,b.n43-b.n33,b.n44-b.n34);ha[5].set(b.n41+b.n31,b.n42+b.n32,b.n43+b.n33,b.n44+b.n34);for(var c,b=0;b<6;b++)c=ha[b],c.divideScalar(Math.sqrt(c.x*c.x+c.y*c.y+c.z*c.z))}function q(b){for(var c=b.matrixWorld,f=-b.geometry.boundingSphere.radius*Math.max(b.scale.x,
Math.max(b.scale.y,b.scale.z)),d=0;d<6;d++)if(b=ha[d].x*c.n14+ha[d].y*c.n24+ha[d].z*c.n34+ha[d].w,b<=f)return!1;return!0}function m(b,c){b.list[b.count]=c;b.count+=1}function t(b){var c,f,d=b.object,e=b.opaque,h=b.transparent;h.count=0;b=e.count=0;for(c=d.materials.length;b<c;b++)f=d.materials[b],f.transparent?m(h,f):m(e,f)}function w(b){var c,f,d,e,h=b.object,i=b.buffer,j=b.opaque,k=b.transparent;k.count=0;b=j.count=0;for(d=h.materials.length;b<d;b++)if(c=h.materials[b],c instanceof THREE.MeshFaceMaterial){c=
0;for(f=i.materials.length;c<f;c++)(e=i.materials[c])&&(e.transparent?m(k,e):m(j,e))}else(e=c)&&(e.transparent?m(k,e):m(j,e))}function y(b,c){return c.z-b.z}function C(b){var c,k,m,H=0,p,t,L,z,r=b.lights;ra||(ra=new THREE.PerspectiveCamera(M.shadowCameraFov,M.shadowMapWidth/M.shadowMapHeight,M.shadowCameraNear,M.shadowCameraFar));c=0;for(k=r.length;c<k;c++)if(m=r[c],m instanceof THREE.SpotLight&&m.castShadow){N=-1;M.shadowMap[H]||(M.shadowMap[H]=new THREE.WebGLRenderTarget(M.shadowMapWidth,M.shadowMapHeight,
{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat}));Sa[H]||(Sa[H]=new THREE.Matrix4);p=M.shadowMap[H];t=Sa[H];ra.position.copy(m.position);ra.lookAt(m.target.position);ra.update(void 0,!0);b.update(void 0,!1,ra);t.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);t.multiplySelf(ra.projectionMatrix);t.multiplySelf(ra.matrixWorldInverse);ra.matrixWorldInverse.flattenToArray(Ua);ra.projectionMatrix.flattenToArray(Ta);Fa.multiply(ra.projectionMatrix,ra.matrixWorldInverse);
o(Fa);M.initWebGLObjects(b);R(p);f.clearColor(1,1,1,1);M.clear();f.clearColor(Y.r,Y.g,Y.b,Ga);t=b.__webglObjects.length;m=b.__webglObjectsImmediate.length;for(p=0;p<t;p++)L=b.__webglObjects[p],z=L.object,z.visible&&z.castShadow?!(z instanceof THREE.Mesh)||!z.frustumCulled||q(z)?(z.matrixWorld.flattenToArray(z._objectMatrixArray),D(z,ra,!1),L.render=!0):L.render=!1:L.render=!1;j(!0);G(THREE.NormalBlending);for(p=0;p<t;p++)if(L=b.__webglObjects[p],L.render)z=L.object,buffer=L.buffer,h(z),L=z.customDepthMaterial?
z.customDepthMaterial:z.geometry.morphTargets.length?Za:Va,e(ra,r,null,L,buffer,z);for(p=0;p<m;p++)L=b.__webglObjectsImmediate[p],z=L.object,z.visible&&z.castShadow&&(z.matrixAutoUpdate&&z.matrixWorld.flattenToArray(z._objectMatrixArray),T=-1,D(z,ra,!1),h(z),program=d(ra,r,null,Va,z),z.immediateRenderCallback?z.immediateRenderCallback(program,f,ha):z.render(function(b){i(b,program,Va.shading)}));H++}}function E(b,c){var d,e,h;d=u.attributes;var i=u.uniforms,j=za/Da,k,z=[],o=Da*0.5,m=za*0.5,p=!0;f.useProgram(u.program);
Wa=u.program;T=aa=W=-1;$a||(f.enableVertexAttribArray(u.attributes.position),f.enableVertexAttribArray(u.attributes.uv),$a=!0);f.disable(f.CULL_FACE);f.enable(f.BLEND);f.depthMask(!0);f.bindBuffer(f.ARRAY_BUFFER,u.vertexBuffer);f.vertexAttribPointer(d.position,2,f.FLOAT,!1,16,0);f.vertexAttribPointer(d.uv,2,f.FLOAT,!1,16,8);f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,u.elementBuffer);f.uniformMatrix4fv(i.projectionMatrix,!1,Ta);f.activeTexture(f.TEXTURE0);f.uniform1i(i.map,0);d=0;for(e=b.__webglSprites.length;d<
e;d++)if(h=b.__webglSprites[d],h.visible&&h.opacity!=0)h.useScreenCoordinates?h.z=-h.position.z:(h._modelViewMatrix.multiplyToArray(c.matrixWorldInverse,h.matrixWorld,h._modelViewMatrixArray),h.z=-h._modelViewMatrix.n34);b.__webglSprites.sort(y);d=0;for(e=b.__webglSprites.length;d<e;d++)h=b.__webglSprites[d],h.visible&&h.opacity!=0&&h.map&&h.map.image&&h.map.image.width&&(h.useScreenCoordinates?(f.uniform1i(i.useScreenCoordinates,1),f.uniform3f(i.screenPosition,(h.position.x-o)/o,(m-h.position.y)/
m,Math.max(0,Math.min(1,h.position.z)))):(f.uniform1i(i.useScreenCoordinates,0),f.uniform1i(i.affectedByDistance,h.affectedByDistance?1:0),f.uniformMatrix4fv(i.modelViewMatrix,!1,h._modelViewMatrixArray)),k=h.map.image.width/(h.scaleByViewport?za:1),z[0]=k*j*h.scale.x,z[1]=k*h.scale.y,f.uniform2f(i.uvScale,h.uvScale.x,h.uvScale.y),f.uniform2f(i.uvOffset,h.uvOffset.x,h.uvOffset.y),f.uniform2f(i.alignment,h.alignment.x,h.alignment.y),f.uniform1f(i.opacity,h.opacity),f.uniform3f(i.color,h.color.r,h.color.g,
h.color.b),f.uniform1f(i.rotation,h.rotation),f.uniform2fv(i.scale,z),h.mergeWith3D&&!p?(f.enable(f.DEPTH_TEST),p=!0):!h.mergeWith3D&&p&&(f.disable(f.DEPTH_TEST),p=!1),G(h.blending),ka(h.map,0),f.drawElements(f.TRIANGLES,6,f.UNSIGNED_SHORT,0));f.enable(f.CULL_FACE);f.enable(f.DEPTH_TEST);f.depthMask(J)}function D(b,c,f){b._modelViewMatrix.multiplyToArray(c.matrixWorldInverse,b.matrixWorld,b._modelViewMatrixArray);f&&THREE.Matrix4.makeInvert3x3(b._modelViewMatrix).transposeIntoArray(b._normalMatrixArray)}
function wa(b){var c,f,d,e;e=b.__materials;b=0;for(f=e.length;b<f;b++)if(d=e[b],d.attributes)for(c in d.attributes)if(d.attributes[c].needsUpdate)return!0;return!1}function xa(b){var c,f,d,e;e=b.__materials;b=0;for(f=e.length;b<f;b++)if(d=e[b],d.attributes)for(c in d.attributes)d.attributes[c].needsUpdate=!1}function qa(b,c){var f;for(f=b.length-1;f>=0;f--)b[f].object==c&&b.splice(f,1)}function sa(b){function c(b){var e=[];f=0;for(d=b.length;f<d;f++)b[f]==void 0?e.push("undefined"):e.push(b[f].id);
return e.join("_")}var f,d,e,h,i,j,k,o,m={},p=b.morphTargets!==void 0?b.morphTargets.length:0;b.geometryGroups={};e=0;for(h=b.faces.length;e<h;e++)i=b.faces[e],j=i.materials,k=c(j),m[k]==void 0&&(m[k]={hash:k,counter:0}),o=m[k].hash+"_"+m[k].counter,b.geometryGroups[o]==void 0&&(b.geometryGroups[o]={faces:[],materials:j,vertices:0,numMorphTargets:p}),i=i instanceof THREE.Face3?3:4,b.geometryGroups[o].vertices+i>65535&&(m[k].counter+=1,o=m[k].hash+"_"+m[k].counter,b.geometryGroups[o]==void 0&&(b.geometryGroups[o]=
{faces:[],materials:j,vertices:0,numMorphTargets:p})),b.geometryGroups[o].faces.push(e),b.geometryGroups[o].vertices+=i;b.geometryGroupsList=[];for(var q in b.geometryGroups)b.geometryGroups[q].id=I++,b.geometryGroupsList.push(b.geometryGroups[q])}function ja(b,c,f){b.push({buffer:c,object:f,opaque:{list:[],count:0},transparent:{list:[],count:0}})}function G(b){if(b!=W){switch(b){case THREE.AdditiveBlending:f.blendEquation(f.FUNC_ADD);f.blendFunc(f.SRC_ALPHA,f.ONE);break;case THREE.SubtractiveBlending:f.blendEquation(f.FUNC_ADD);
f.blendFunc(f.ZERO,f.ONE_MINUS_SRC_COLOR);break;case THREE.MultiplyBlending:f.blendEquation(f.FUNC_ADD);f.blendFunc(f.ZERO,f.SRC_COLOR);break;default:f.blendEquationSeparate(f.FUNC_ADD,f.FUNC_ADD),f.blendFuncSeparate(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA,f.ONE,f.ONE_MINUS_SRC_ALPHA)}W=b}}function r(b,c,d){(d.width&d.width-1)==0&&(d.height&d.height-1)==0?(f.texParameteri(b,f.TEXTURE_WRAP_S,S(c.wrapS)),f.texParameteri(b,f.TEXTURE_WRAP_T,S(c.wrapT)),f.texParameteri(b,f.TEXTURE_MAG_FILTER,S(c.magFilter)),
f.texParameteri(b,f.TEXTURE_MIN_FILTER,S(c.minFilter)),f.generateMipmap(b)):(f.texParameteri(b,f.TEXTURE_WRAP_S,f.CLAMP_TO_EDGE),f.texParameteri(b,f.TEXTURE_WRAP_T,f.CLAMP_TO_EDGE),f.texParameteri(b,f.TEXTURE_MAG_FILTER,ya(c.magFilter)),f.texParameteri(b,f.TEXTURE_MIN_FILTER,ya(c.minFilter)))}function ka(b,c){if(b.needsUpdate){if(!b.__webglInit)b.__webglInit=!0,b.__webglTexture=f.createTexture(),M.info.memory.textures++;f.activeTexture(f.TEXTURE0+c);f.bindTexture(f.TEXTURE_2D,b.__webglTexture);b instanceof
THREE.DataTexture?f.texImage2D(f.TEXTURE_2D,0,S(b.format),b.image.width,b.image.height,0,S(b.format),f.UNSIGNED_BYTE,b.image.data):f.texImage2D(f.TEXTURE_2D,0,f.RGBA,f.RGBA,f.UNSIGNED_BYTE,b.image);r(f.TEXTURE_2D,b,b.image);b.needsUpdate=!1}else f.activeTexture(f.TEXTURE0+c),f.bindTexture(f.TEXTURE_2D,b.__webglTexture)}function R(b){var c=b instanceof THREE.WebGLRenderTargetCube;if(b&&!b.__webglFramebuffer){if(b.depthBuffer===void 0)b.depthBuffer=!0;if(b.stencilBuffer===void 0)b.stencilBuffer=!0;
b.__webglRenderbuffer=f.createRenderbuffer();b.__webglTexture=f.createTexture();if(c){f.bindTexture(f.TEXTURE_CUBE_MAP,b.__webglTexture);r(f.TEXTURE_CUBE_MAP,b,b);b.__webglFramebuffer=[];for(var d=0;d<6;d++)b.__webglFramebuffer[d]=f.createFramebuffer(),f.texImage2D(f.TEXTURE_CUBE_MAP_POSITIVE_X+d,0,S(b.format),b.width,b.height,0,S(b.format),S(b.type),null)}else b.__webglFramebuffer=f.createFramebuffer(),f.bindTexture(f.TEXTURE_2D,b.__webglTexture),r(f.TEXTURE_2D,b,b),f.texImage2D(f.TEXTURE_2D,0,S(b.format),
b.width,b.height,0,S(b.format),S(b.type),null);f.bindRenderbuffer(f.RENDERBUFFER,b.__webglRenderbuffer);if(c)for(d=0;d<6;++d)f.bindFramebuffer(f.FRAMEBUFFER,b.__webglFramebuffer[d]),f.framebufferTexture2D(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,f.TEXTURE_CUBE_MAP_POSITIVE_X+d,b.__webglTexture,0);else f.bindFramebuffer(f.FRAMEBUFFER,b.__webglFramebuffer),f.framebufferTexture2D(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,f.TEXTURE_2D,b.__webglTexture,0);b.depthBuffer&&!b.stencilBuffer?(f.renderbufferStorage(f.RENDERBUFFER,
f.DEPTH_COMPONENT16,b.width,b.height),f.framebufferRenderbuffer(f.FRAMEBUFFER,f.DEPTH_ATTACHMENT,f.RENDERBUFFER,b.__webglRenderbuffer)):b.depthBuffer&&b.stencilBuffer?(f.renderbufferStorage(f.RENDERBUFFER,f.DEPTH_STENCIL,b.width,b.height),f.framebufferRenderbuffer(f.FRAMEBUFFER,f.DEPTH_STENCIL_ATTACHMENT,f.RENDERBUFFER,b.__webglRenderbuffer)):f.renderbufferStorage(f.RENDERBUFFER,f.RGBA4,b.width,b.height);c?f.bindTexture(f.TEXTURE_CUBE_MAP,null):f.bindTexture(f.TEXTURE_2D,null);f.bindRenderbuffer(f.RENDERBUFFER,
null);f.bindFramebuffer(f.FRAMEBUFFER,null)}var e,h;b?(c=c?b.__webglFramebuffer[b.activeCubeFace]:b.__webglFramebuffer,d=b.width,b=b.height,h=e=0):(c=null,d=Da,b=za,e=Ia,h=Ba);c!=va&&(f.bindFramebuffer(f.FRAMEBUFFER,c),f.viewport(e,h,d,b),va=c)}function la(b){b instanceof THREE.WebGLRenderTargetCube?(f.bindTexture(f.TEXTURE_CUBE_MAP,b.__webglTexture),f.generateMipmap(f.TEXTURE_CUBE_MAP),f.bindTexture(f.TEXTURE_CUBE_MAP,null)):(f.bindTexture(f.TEXTURE_2D,b.__webglTexture),f.generateMipmap(f.TEXTURE_2D),
f.bindTexture(f.TEXTURE_2D,null))}function $(b,c){var d;b=="fragment"?d=f.createShader(f.FRAGMENT_SHADER):b=="vertex"&&(d=f.createShader(f.VERTEX_SHADER));f.shaderSource(d,c);f.compileShader(d);if(!f.getShaderParameter(d,f.COMPILE_STATUS))return console.error(f.getShaderInfoLog(d)),console.error(c),null;return d}function ya(b){switch(b){case THREE.NearestFilter:case THREE.NearestMipMapNearestFilter:case THREE.NearestMipMapLinearFilter:return f.NEAREST;default:return f.LINEAR}}function S(b){switch(b){case THREE.RepeatWrapping:return f.REPEAT;
case THREE.ClampToEdgeWrapping:return f.CLAMP_TO_EDGE;case THREE.MirroredRepeatWrapping:return f.MIRRORED_REPEAT;case THREE.NearestFilter:return f.NEAREST;case THREE.NearestMipMapNearestFilter:return f.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return f.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return f.LINEAR;case THREE.LinearMipMapNearestFilter:return f.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return f.LINEAR_MIPMAP_LINEAR;case THREE.ByteType:return f.BYTE;
case THREE.UnsignedByteType:return f.UNSIGNED_BYTE;case THREE.ShortType:return f.SHORT;case THREE.UnsignedShortType:return f.UNSIGNED_SHORT;case THREE.IntType:return f.INT;case THREE.UnsignedShortType:return f.UNSIGNED_INT;case THREE.FloatType:return f.FLOAT;case THREE.AlphaFormat:return f.ALPHA;case THREE.RGBFormat:return f.RGB;case THREE.RGBAFormat:return f.RGBA;case THREE.LuminanceFormat:return f.LUMINANCE;case THREE.LuminanceAlphaFormat:return f.LUMINANCE_ALPHA}return 0}var M=this,f,ua=[],Wa=
null,va=null,N=-1,T=null,I=0,V=null,X=null,W=null,aa=null,J=null,Aa=null,La=null,Ra=null,Ia=0,Ba=0,Da=0,za=0,ha=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4],Fa=new THREE.Matrix4,Ta=new Float32Array(16),Ua=new Float32Array(16),Ja=new THREE.Vector4,Ya={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]}},b=b||{},Ca=b.canvas!==void 0?b.canvas:document.createElement("canvas"),
U=b.stencil!==void 0?b.stencil:!0,cb=b.preserveDrawingBuffer!==void 0?b.preserveDrawingBuffer:!1,db=b.antialias!==void 0?b.antialias:!1,Y=b.clearColor!==void 0?new THREE.Color(b.clearColor):new THREE.Color(0),Ga=b.clearAlpha!==void 0?b.clearAlpha:0,Xa=b.maxLights!==void 0?b.maxLights:4;this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0}};this.maxMorphTargets=8;this.domElement=Ca;this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=
!0;this.shadowMapBias=0.0039;this.shadowMapDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowCameraNear=1;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowMap=[];this.shadowMapEnabled=!1;this.shadowMapSoft=!0;var ra,Sa=[],b=THREE.ShaderLib.depthRGBA,ab=THREE.UniformsUtils.clone(b.uniforms),Va=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,uniforms:ab}),Za=new THREE.ShaderMaterial({fragmentShader:b.fragmentShader,vertexShader:b.vertexShader,
uniforms:ab,morphTargets:!0});Va._shadowPass=!0;Za._shadowPass=!0;try{if(!(f=Ca.getContext("experimental-webgl",{antialias:db,stencil:U,preserveDrawingBuffer:cb})))throw"Error creating WebGL context.";console.log(navigator.userAgent+" | "+f.getParameter(f.VERSION)+" | "+f.getParameter(f.VENDOR)+" | "+f.getParameter(f.RENDERER)+" | "+f.getParameter(f.SHADING_LANGUAGE_VERSION))}catch(eb){console.error(eb)}f.clearColor(0,0,0,1);f.clearDepth(1);f.clearStencil(0);f.enable(f.DEPTH_TEST);f.depthFunc(f.LEQUAL);
f.frontFace(f.CCW);f.cullFace(f.BACK);f.enable(f.CULL_FACE);f.enable(f.BLEND);f.blendEquation(f.FUNC_ADD);f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA);f.clearColor(Y.r,Y.g,Y.b,Ga);this.context=f;var bb=f.getParameter(f.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0,u={};u.vertices=new Float32Array(16);u.faces=new Uint16Array(6);U=0;u.vertices[U++]=-1;u.vertices[U++]=-1;u.vertices[U++]=0;u.vertices[U++]=1;u.vertices[U++]=1;u.vertices[U++]=-1;u.vertices[U++]=1;u.vertices[U++]=1;u.vertices[U++]=1;u.vertices[U++]=
1;u.vertices[U++]=1;u.vertices[U++]=0;u.vertices[U++]=-1;u.vertices[U++]=1;u.vertices[U++]=0;U=u.vertices[U++]=0;u.faces[U++]=0;u.faces[U++]=1;u.faces[U++]=2;u.faces[U++]=0;u.faces[U++]=2;u.faces[U++]=3;u.vertexBuffer=f.createBuffer();u.elementBuffer=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,u.vertexBuffer);f.bufferData(f.ARRAY_BUFFER,u.vertices,f.STATIC_DRAW);f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,u.elementBuffer);f.bufferData(f.ELEMENT_ARRAY_BUFFER,u.faces,f.STATIC_DRAW);u.program=f.createProgram();
f.attachShader(u.program,$("fragment",THREE.ShaderLib.sprite.fragmentShader));f.attachShader(u.program,$("vertex",THREE.ShaderLib.sprite.vertexShader));f.linkProgram(u.program);u.attributes={};u.uniforms={};u.attributes.position=f.getAttribLocation(u.program,"position");u.attributes.uv=f.getAttribLocation(u.program,"uv");u.uniforms.uvOffset=f.getUniformLocation(u.program,"uvOffset");u.uniforms.uvScale=f.getUniformLocation(u.program,"uvScale");u.uniforms.rotation=f.getUniformLocation(u.program,"rotation");
u.uniforms.scale=f.getUniformLocation(u.program,"scale");u.uniforms.alignment=f.getUniformLocation(u.program,"alignment");u.uniforms.color=f.getUniformLocation(u.program,"color");u.uniforms.map=f.getUniformLocation(u.program,"map");u.uniforms.opacity=f.getUniformLocation(u.program,"opacity");u.uniforms.useScreenCoordinates=f.getUniformLocation(u.program,"useScreenCoordinates");u.uniforms.affectedByDistance=f.getUniformLocation(u.program,"affectedByDistance");u.uniforms.screenPosition=f.getUniformLocation(u.program,
"screenPosition");u.uniforms.modelViewMatrix=f.getUniformLocation(u.program,"modelViewMatrix");u.uniforms.projectionMatrix=f.getUniformLocation(u.program,"projectionMatrix");var $a=!1;this.setSize=function(b,c){Ca.width=b;Ca.height=c;this.setViewport(0,0,Ca.width,Ca.height)};this.setViewport=function(b,c,d,e){Ia=b;Ba=c;Da=d;za=e;f.viewport(Ia,Ba,Da,za)};this.setScissor=function(b,c,d,e){f.scissor(b,c,d,e)};this.enableScissorTest=function(b){b?f.enable(f.SCISSOR_TEST):f.disable(f.SCISSOR_TEST)};this.setClearColorHex=
function(b,c){Y.setHex(b);Ga=c;f.clearColor(Y.r,Y.g,Y.b,Ga)};this.setClearColor=function(b,c){Y.copy(b);Ga=c;f.clearColor(Y.r,Y.g,Y.b,Ga)};this.getClearColor=function(){return Y};this.getClearAlpha=function(){return Ga};this.clear=function(b,c,d){var e=0;if(b==void 0||b)e|=f.COLOR_BUFFER_BIT;if(c==void 0||c)e|=f.DEPTH_BUFFER_BIT;if(d==void 0||d)e|=f.STENCIL_BUFFER_BIT;f.clear(e)};this.getContext=function(){return f};this.deallocateObject=function(b){if(b.__webglInit)if(b.__webglInit=!1,delete b._modelViewMatrix,
delete b._normalMatrixArray,delete b._modelViewMatrixArray,delete b._objectMatrixArray,b instanceof THREE.Mesh)for(g in b.geometry.geometryGroups){var c=b.geometry.geometryGroups[g];f.deleteBuffer(c.__webglVertexBuffer);f.deleteBuffer(c.__webglNormalBuffer);f.deleteBuffer(c.__webglTangentBuffer);f.deleteBuffer(c.__webglColorBuffer);f.deleteBuffer(c.__webglUVBuffer);f.deleteBuffer(c.__webglUV2Buffer);f.deleteBuffer(c.__webglSkinVertexABuffer);f.deleteBuffer(c.__webglSkinVertexBBuffer);f.deleteBuffer(c.__webglSkinIndicesBuffer);
f.deleteBuffer(c.__webglSkinWeightsBuffer);f.deleteBuffer(c.__webglFaceBuffer);f.deleteBuffer(c.__webglLineBuffer);if(c.numMorphTargets)for(var d=0,e=c.numMorphTargets;d<e;d++)f.deleteBuffer(c.__webglMorphTargetsBuffers[d]);M.info.memory.geometries--}else if(b instanceof THREE.Ribbon)b=b.geometry,f.deleteBuffer(b.__webglVertexBuffer),f.deleteBuffer(b.__webglColorBuffer),M.info.memory.geometries--;else if(b instanceof THREE.Line)b=b.geometry,f.deleteBuffer(b.__webglVertexBuffer),f.deleteBuffer(b.__webglColorBuffer),
M.info.memory.geometries--;else if(b instanceof THREE.ParticleSystem)b=b.geometry,f.deleteBuffer(b.__webglVertexBuffer),f.deleteBuffer(b.__webglColorBuffer),M.info.memory.geometries--};this.deallocateTexture=function(b){if(b.__webglInit)b.__webglInit=!1,f.deleteTexture(b.__webglTexture),M.info.memory.textures--};this.initMaterial=function(b,c,d,e){var h,i,j,k;b instanceof THREE.MeshDepthMaterial?k="depth":b instanceof THREE.MeshNormalMaterial?k="normal":b instanceof THREE.MeshBasicMaterial?k="basic":
b instanceof THREE.MeshLambertMaterial?k="lambert":b instanceof THREE.MeshPhongMaterial?k="phong":b instanceof THREE.LineBasicMaterial?k="basic":b instanceof THREE.ParticleBasicMaterial&&(k="particle_basic");if(k){var o=THREE.ShaderLib[k];b.uniforms=THREE.UniformsUtils.clone(o.uniforms);b.vertexShader=o.vertexShader;b.fragmentShader=o.fragmentShader}var m,p,q;m=q=o=0;for(p=c.length;m<p;m++)j=c[m],j instanceof THREE.SpotLight&&q++,j instanceof THREE.DirectionalLight&&q++,j instanceof THREE.PointLight&&
o++;o+q<=Xa?m=q:(m=Math.ceil(Xa*q/(o+q)),o=Xa-m);j={directional:m,point:o};o=q=0;for(m=c.length;o<m;o++)p=c[o],p instanceof THREE.SpotLight&&p.castShadow&&q++;var t=50;if(e!==void 0&&e instanceof THREE.SkinnedMesh)t=e.bones.length;var v;a:{m=b.fragmentShader;p=b.vertexShader;var o=b.uniforms,c=b.attributes,d={map:!!b.map,envMap:!!b.envMap,lightMap:!!b.lightMap,vertexColors:b.vertexColors,fog:d,useFog:b.fog,sizeAttenuation:b.sizeAttenuation,skinning:b.skinning,morphTargets:b.morphTargets,maxMorphTargets:this.maxMorphTargets,
maxDirLights:j.directional,maxPointLights:j.point,maxBones:t,shadowMapEnabled:this.shadowMapEnabled&&e.receiveShadow,shadowMapSoft:this.shadowMapSoft,shadowMapWidth:this.shadowMapWidth,shadowMapHeight:this.shadowMapHeight,maxShadows:q,alphaTest:b.alphaTest},r,e=[];k?e.push(k):(e.push(m),e.push(p));for(r in d)e.push(r),e.push(d[r]);k=e.join();r=0;for(e=ua.length;r<e;r++)if(ua[r].code==k){v=ua[r].program;break a}r=f.createProgram();e=[bb?"#define VERTEX_TEXTURES":"","#define MAX_DIR_LIGHTS "+d.maxDirLights,
"#define MAX_POINT_LIGHTS "+d.maxPointLights,"#define MAX_SHADOWS "+d.maxShadows,"#define MAX_BONES "+d.maxBones,d.map?"#define USE_MAP":"",d.envMap?"#define USE_ENVMAP":"",d.lightMap?"#define USE_LIGHTMAP":"",d.vertexColors?"#define USE_COLOR":"",d.skinning?"#define USE_SKINNING":"",d.morphTargets?"#define USE_MORPHTARGETS":"",d.shadowMapEnabled?"#define USE_SHADOWMAP":"",d.shadowMapSoft?"#define SHADOWMAP_SOFT":"",d.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nuniform mat4 cameraInverseMatrix;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
j=["#ifdef GL_ES\nprecision highp float;\n#endif","#define MAX_DIR_LIGHTS "+d.maxDirLights,"#define MAX_POINT_LIGHTS "+d.maxPointLights,"#define MAX_SHADOWS "+d.maxShadows,d.alphaTest?"#define ALPHATEST "+d.alphaTest:"",d.useFog&&d.fog?"#define USE_FOG":"",d.useFog&&d.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",d.map?"#define USE_MAP":"",d.envMap?"#define USE_ENVMAP":"",d.lightMap?"#define USE_LIGHTMAP":"",d.vertexColors?"#define USE_COLOR":"",d.shadowMapEnabled?"#define USE_SHADOWMAP":"",
d.shadowMapSoft?"#define SHADOWMAP_SOFT":"",d.shadowMapSoft?"#define SHADOWMAP_WIDTH "+d.shadowMapWidth.toFixed(1):"",d.shadowMapSoft?"#define SHADOWMAP_HEIGHT "+d.shadowMapHeight.toFixed(1):"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");f.attachShader(r,$("fragment",j+m));f.attachShader(r,$("vertex",e+p));f.linkProgram(r);f.getProgramParameter(r,f.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+f.getProgramParameter(r,f.VALIDATE_STATUS)+", gl error ["+
f.getError()+"]");r.uniforms={};r.attributes={};var u,e=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition","cameraInverseMatrix","boneGlobalMatrices","morphTargetInfluences"];for(u in o)e.push(u);u=e;e=0;for(o=u.length;e<o;e++)m=u[e],r.uniforms[m]=f.getUniformLocation(r,m);e=["position","normal","uv","uv2","tangent","color","skinVertexA","skinVertexB","skinIndex","skinWeight"];for(u=0;u<d.maxMorphTargets;u++)e.push("morphTarget"+u);for(v in c)e.push(v);
v=e;u=0;for(c=v.length;u<c;u++)d=v[u],r.attributes[d]=f.getAttribLocation(r,d);r.id=ua.length;ua.push({program:r,code:k});M.info.memory.programs=ua.length;v=r}b.program=v;v=b.program.attributes;v.position>=0&&f.enableVertexAttribArray(v.position);v.color>=0&&f.enableVertexAttribArray(v.color);v.normal>=0&&f.enableVertexAttribArray(v.normal);v.tangent>=0&&f.enableVertexAttribArray(v.tangent);b.skinning&&v.skinVertexA>=0&&v.skinVertexB>=0&&v.skinIndex>=0&&v.skinWeight>=0&&(f.enableVertexAttribArray(v.skinVertexA),
f.enableVertexAttribArray(v.skinVertexB),f.enableVertexAttribArray(v.skinIndex),f.enableVertexAttribArray(v.skinWeight));if(b.attributes)for(i in b.attributes)v[i]!==void 0&&v[i]>=0&&f.enableVertexAttribArray(v[i]);if(b.morphTargets)for(i=b.numSupportedMorphTargets=0;i<this.maxMorphTargets;i++)u="morphTarget"+i,v[u]>=0&&(f.enableVertexAttribArray(v[u]),b.numSupportedMorphTargets++);b.uniformsList=[];for(h in b.uniforms)b.uniformsList.push([b.uniforms[h],h])};this.clearTarget=function(b,c,d,f){R(b);
this.clear(c,d,f)};this.render=function(b,c,m,r){var H,u,Ea,L,z,I,Q,Pa,Qa=b.lights,v=b.fog;N=-1;this.shadowMapEnabled&&C(b,c);M.info.render.calls=0;M.info.render.vertices=0;M.info.render.faces=0;c.matrixAutoUpdate&&c.update(void 0,!0);b.update(void 0,!1,c);c.matrixWorldInverse.flattenToArray(Ua);c.projectionMatrix.flattenToArray(Ta);Fa.multiply(c.projectionMatrix,c.matrixWorldInverse);o(Fa);this.initWebGLObjects(b);R(m);(this.autoClear||r)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);
z=b.__webglObjects.length;for(r=0;r<z;r++)if(H=b.__webglObjects[r],Q=H.object,Q.visible)if(!(Q instanceof THREE.Mesh)||!Q.frustumCulled||q(Q)){if(Q.matrixWorld.flattenToArray(Q._objectMatrixArray),D(Q,c,!0),w(H),H.render=!0,this.sortObjects)H.object.renderDepth?H.z=H.object.renderDepth:(Ja.copy(Q.position),Fa.multiplyVector3(Ja),H.z=Ja.z)}else H.render=!1;else H.render=!1;this.sortObjects&&b.__webglObjects.sort(y);I=b.__webglObjectsImmediate.length;for(r=0;r<I;r++)H=b.__webglObjectsImmediate[r],Q=
H.object,Q.visible&&(Q.matrixAutoUpdate&&Q.matrixWorld.flattenToArray(Q._objectMatrixArray),D(Q,c,!0),t(H));if(b.overrideMaterial){j(b.overrideMaterial.depthTest);G(b.overrideMaterial.blending);for(r=0;r<z;r++)if(H=b.__webglObjects[r],H.render)Q=H.object,Pa=H.buffer,h(Q),e(c,Qa,v,b.overrideMaterial,Pa,Q);for(r=0;r<I;r++)H=b.__webglObjectsImmediate[r],Q=H.object,Q.visible&&(T=-1,h(Q),u=d(c,Qa,v,b.overrideMaterial,Q),Q.immediateRenderCallback?Q.immediateRenderCallback(u,f,ha):Q.render(function(c){i(c,
u,b.overrideMaterial.shading)}))}else{G(THREE.NormalBlending);for(r=z-1;r>=0;r--)if(H=b.__webglObjects[r],H.render){Q=H.object;Pa=H.buffer;Ea=H.opaque;h(Q);for(H=0;H<Ea.count;H++)L=Ea.list[H],j(L.depthTest),k(L.depthWrite),p(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),e(c,Qa,v,L,Pa,Q)}for(r=0;r<I;r++)if(H=b.__webglObjectsImmediate[r],Q=H.object,Q.visible){T=-1;Ea=H.opaque;h(Q);for(H=0;H<Ea.count;H++)L=Ea.list[H],j(L.depthTest),k(L.depthWrite),p(L.polygonOffset,L.polygonOffsetFactor,
L.polygonOffsetUnits),u=d(c,Qa,v,L,Q),Q.immediateRenderCallback?Q.immediateRenderCallback(u,f,ha):Q.render(function(b){i(b,u,L.shading)})}for(r=0;r<z;r++)if(H=b.__webglObjects[r],H.render){Q=H.object;Pa=H.buffer;Ea=H.transparent;h(Q);for(H=0;H<Ea.count;H++)L=Ea.list[H],G(L.blending),j(L.depthTest),k(L.depthWrite),p(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),e(c,Qa,v,L,Pa,Q)}for(r=0;r<I;r++)if(H=b.__webglObjectsImmediate[r],Q=H.object,Q.visible){T=-1;Ea=H.transparent;h(Q);for(H=0;H<
Ea.count;H++)L=Ea.list[H],G(L.blending),j(L.depthTest),k(L.depthWrite),p(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),u=d(c,Qa,v,L,Q),Q.immediateRenderCallback?Q.immediateRenderCallback(u,f,ha):Q.render(function(b){i(b,u,L.shading)})}}b.__webglSprites.length&&E(b,c);m&&m.minFilter!==THREE.NearestFilter&&m.minFilter!==THREE.LinearFilter&&la(m)};this.initWebGLObjects=function(b){if(!b.__webglObjects)b.__webglObjects=[],b.__webglObjectsImmediate=[],b.__webglSprites=[];for(;b.__objectsAdded.length;){var d=
b.__objectsAdded[0],e=b,h=void 0,i=void 0,j=void 0;if(!d.__webglInit)if(d.__webglInit=!0,d._modelViewMatrix=new THREE.Matrix4,d._normalMatrixArray=new Float32Array(9),d._modelViewMatrixArray=new Float32Array(16),d._objectMatrixArray=new Float32Array(16),d.matrixWorld.flattenToArray(d._objectMatrixArray),d instanceof THREE.Mesh)for(h in i=d.geometry,i.geometryGroups==void 0&&sa(i),i.geometryGroups){if(j=i.geometryGroups[h],!j.__webglVertexBuffer){var k=j;k.__webglVertexBuffer=f.createBuffer();k.__webglNormalBuffer=
f.createBuffer();k.__webglTangentBuffer=f.createBuffer();k.__webglColorBuffer=f.createBuffer();k.__webglUVBuffer=f.createBuffer();k.__webglUV2Buffer=f.createBuffer();k.__webglSkinVertexABuffer=f.createBuffer();k.__webglSkinVertexBBuffer=f.createBuffer();k.__webglSkinIndicesBuffer=f.createBuffer();k.__webglSkinWeightsBuffer=f.createBuffer();k.__webglFaceBuffer=f.createBuffer();k.__webglLineBuffer=f.createBuffer();if(k.numMorphTargets){var o=void 0,m=void 0;k.__webglMorphTargetsBuffers=[];o=0;for(m=
k.numMorphTargets;o<m;o++)k.__webglMorphTargetsBuffers.push(f.createBuffer())}M.info.memory.geometries++;for(var k=d,p=void 0,q=void 0,r=void 0,t=r=void 0,v=void 0,u=void 0,w=u=o=0,y=r=q=void 0,r=m=y=q=p=void 0,t=k.geometry,v=t.faces,y=j.faces,p=0,q=y.length;p<q;p++)r=y[p],r=v[r],r instanceof THREE.Face3?(o+=3,u+=1,w+=3):r instanceof THREE.Face4&&(o+=4,u+=2,w+=4);for(var p=j,q=k,C=y=v=void 0,F=void 0,C=void 0,r=[],v=0,y=q.materials.length;v<y;v++)if(C=q.materials[v],C instanceof THREE.MeshFaceMaterial){C=
0;for(l=p.materials.length;C<l;C++)(F=p.materials[C])&&r.push(F)}else(F=C)&&r.push(F);p=r;j.__materials=p;a:{v=q=void 0;y=p.length;for(q=0;q<y;q++)if(v=p[q],v.map||v.lightMap||v instanceof THREE.ShaderMaterial){q=!0;break a}q=!1}a:{y=v=void 0;r=p.length;for(v=0;v<r;v++)if(y=p[v],!(y instanceof THREE.MeshBasicMaterial&&!y.envMap||y instanceof THREE.MeshDepthMaterial)){y=y&&y.shading!=void 0&&y.shading==THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading;break a}y=!1}a:{r=v=void 0;C=p.length;
for(v=0;v<C;v++)if(r=p[v],r.vertexColors){r=r.vertexColors;break a}r=!1}j.__vertexArray=new Float32Array(o*3);if(y)j.__normalArray=new Float32Array(o*3);if(t.hasTangents)j.__tangentArray=new Float32Array(o*4);if(r)j.__colorArray=new Float32Array(o*3);if(q){if(t.faceUvs.length>0||t.faceVertexUvs.length>0)j.__uvArray=new Float32Array(o*2);if(t.faceUvs.length>1||t.faceVertexUvs.length>1)j.__uv2Array=new Float32Array(o*2)}if(k.geometry.skinWeights.length&&k.geometry.skinIndices.length)j.__skinVertexAArray=
new Float32Array(o*4),j.__skinVertexBArray=new Float32Array(o*4),j.__skinIndexArray=new Float32Array(o*4),j.__skinWeightArray=new Float32Array(o*4);j.__faceArray=new Uint16Array(u*3+(k.geometry.edgeFaces?k.geometry.edgeFaces.length*6:0));j.__lineArray=new Uint16Array(w*2);if(j.numMorphTargets){j.__morphTargetsArrays=[];t=0;for(v=j.numMorphTargets;t<v;t++)j.__morphTargetsArrays.push(new Float32Array(o*3))}j.__needsSmoothNormals=y==THREE.SmoothShading;j.__uvType=q;j.__vertexColorType=r;j.__normalType=
y;j.__webglFaceCount=u*3+(k.geometry.edgeFaces?k.geometry.edgeFaces.length*6:0);j.__webglLineCount=w*2;t=0;for(v=p.length;t<v;t++)if(q=p[t],q.attributes){if(j.__webglCustomAttributes===void 0)j.__webglCustomAttributes={};for(a in q.attributes){r=q.attributes[a];y={};for(m in r)y[m]=r[m];if(!y.__webglInitialized||y.createUniqueBuffers)y.__webglInitialized=!0,u=1,y.type==="v2"?u=2:y.type==="v3"?u=3:y.type==="v4"?u=4:y.type==="c"&&(u=3),y.size=u,y.array=new Float32Array(o*u),y.buffer=f.createBuffer(),
y.buffer.belongsToAttribute=a,r.needsUpdate=!0,y.__original=r;j.__webglCustomAttributes[a]=y}}j.__inittedArrays=!0;i.__dirtyVertices=!0;i.__dirtyMorphTargets=!0;i.__dirtyElements=!0;i.__dirtyUvs=!0;i.__dirtyNormals=!0;i.__dirtyTangents=!0;i.__dirtyColors=!0}}else if(d instanceof THREE.Ribbon){if(i=d.geometry,!i.__webglVertexBuffer)j=i,j.__webglVertexBuffer=f.createBuffer(),j.__webglColorBuffer=f.createBuffer(),M.info.memory.geometries++,j=i,k=j.vertices.length,j.__vertexArray=new Float32Array(k*3),
j.__colorArray=new Float32Array(k*3),j.__webglVertexCount=k,i.__dirtyVertices=!0,i.__dirtyColors=!0}else if(d instanceof THREE.Line){if(i=d.geometry,!i.__webglVertexBuffer)j=i,j.__webglVertexBuffer=f.createBuffer(),j.__webglColorBuffer=f.createBuffer(),M.info.memory.geometries++,j=i,k=j.vertices.length,j.__vertexArray=new Float32Array(k*3),j.__colorArray=new Float32Array(k*3),j.__webglLineCount=k,i.__dirtyVertices=!0,i.__dirtyColors=!0}else if(d instanceof THREE.ParticleSystem&&(i=d.geometry,!i.__webglVertexBuffer)){j=
i;j.__webglVertexBuffer=f.createBuffer();j.__webglColorBuffer=f.createBuffer();M.info.geometries++;j=i;k=d;o=j.vertices.length;j.__vertexArray=new Float32Array(o*3);j.__colorArray=new Float32Array(o*3);j.__sortArray=[];j.__webglParticleCount=o;j.__materials=k.materials;w=u=m=void 0;m=0;for(u=k.materials.length;m<u;m++)if(w=k.materials[m],w.attributes){if(j.__webglCustomAttributes===void 0)j.__webglCustomAttributes={};for(a in w.attributes){originalAttribute=w.attributes[a];attribute={};for(property in originalAttribute)attribute[property]=
originalAttribute[property];if(!attribute.__webglInitialized||attribute.createUniqueBuffers)attribute.__webglInitialized=!0,size=1,attribute.type==="v2"?size=2:attribute.type==="v3"?size=3:attribute.type==="v4"?size=4:attribute.type==="c"&&(size=3),attribute.size=size,attribute.array=new Float32Array(o*size),attribute.buffer=f.createBuffer(),attribute.buffer.belongsToAttribute=a,originalAttribute.needsUpdate=!0,attribute.__original=originalAttribute;j.__webglCustomAttributes[a]=attribute}}i.__dirtyVertices=
!0;i.__dirtyColors=!0}if(!d.__webglActive){if(d instanceof THREE.Mesh)for(h in i=d.geometry,i.geometryGroups)j=i.geometryGroups[h],ja(e.__webglObjects,j,d);else d instanceof THREE.Ribbon||d instanceof THREE.Line||d instanceof THREE.ParticleSystem?(i=d.geometry,ja(e.__webglObjects,i,d)):THREE.MarchingCubes!==void 0&&d instanceof THREE.MarchingCubes||d.immediateRenderCallback?e.__webglObjectsImmediate.push({object:d,opaque:{list:[],count:0},transparent:{list:[],count:0}}):d instanceof THREE.Sprite&&
e.__webglSprites.push(d);d.__webglActive=!0}b.__objectsAdded.splice(0,1)}for(;b.__objectsRemoved.length;){d=b.__objectsRemoved[0];e=b;if(d instanceof THREE.Mesh||d instanceof THREE.ParticleSystem||d instanceof THREE.Ribbon||d instanceof THREE.Line)qa(e.__webglObjects,d);else if(d instanceof THREE.Sprite){e=e.__webglSprites;h=d;i=void 0;for(i=e.length-1;i>=0;i--)e[i]==h&&e.splice(i,1)}else(d instanceof THREE.MarchingCubes||d.immediateRenderCallback)&&qa(e.__webglObjectsImmediate,d);d.__webglActive=
!1;b.__objectsRemoved.splice(0,1)}d=0;for(e=b.__webglObjects.length;d<e;d++)if(i=b.__webglObjects[d].object,m=j=h=void 0,i instanceof THREE.Mesh){h=i.geometry;k=0;for(o=h.geometryGroupsList.length;k<o;k++)if(j=h.geometryGroupsList[k],m=wa(j),h.__dirtyVertices||h.__dirtyMorphTargets||h.__dirtyElements||h.__dirtyUvs||h.__dirtyNormals||h.__dirtyColors||h.__dirtyTangents||m)if(m=j,u=f.DYNAMIC_DRAW,w=!h.dynamic,m.__inittedArrays){var D=p=t=void 0,A=void 0,G=D=void 0,E=void 0,I=void 0,K=void 0,O=F=C=r=
y=v=q=void 0,P=void 0,J=void 0,s=A=K=A=I=E=void 0,n=void 0,B=n=s=E=void 0,R=void 0,U=B=n=s=D=D=G=K=A=B=n=s=R=B=n=s=R=B=n=s=void 0,ia=0,N=0,X=0,$=0,V=0,S=0,Z=0,T=0,ma=0,x=0,na=0,B=s=0,B=void 0,oa=m.__vertexArray,ka=m.__uvArray,la=m.__uv2Array,W=m.__normalArray,ca=m.__tangentArray,pa=m.__colorArray,da=m.__skinVertexAArray,ea=m.__skinVertexBArray,fa=m.__skinIndexArray,ga=m.__skinWeightArray,ra=m.__morphTargetsArrays,aa=m.__webglCustomAttributes,n=void 0,ha=m.__faceArray,Y=m.__lineArray,ya=m.__needsSmoothNormals,
v=m.__vertexColorType,q=m.__uvType,y=m.__normalType,ta=i.geometry,va=ta.__dirtyVertices,za=ta.__dirtyElements,ua=ta.__dirtyUvs,Aa=ta.__dirtyNormals,Ba=ta.__dirtyTangents,Da=ta.__dirtyColors,Fa=ta.__dirtyMorphTargets,Ca=ta.vertices,Ga=m.faces,La=ta.faces,Ia=ta.faceVertexUvs[0],Ja=ta.faceVertexUvs[1],Ma=ta.skinVerticesA,Na=ta.skinVerticesB,Oa=ta.skinIndices,Ka=ta.skinWeights,Ha=ta.morphTargets;if(aa)for(U in aa)aa[U].offset=0,aa[U].offsetSrc=0;t=0;for(p=Ga.length;t<p;t++)if(D=Ga[t],A=La[D],Ia&&(r=Ia[D]),
Ja&&(C=Ja[D]),D=A.vertexNormals,G=A.normal,E=A.vertexColors,I=A.color,K=A.vertexTangents,A instanceof THREE.Face3){if(va)F=Ca[A.a].position,O=Ca[A.b].position,P=Ca[A.c].position,oa[N]=F.x,oa[N+1]=F.y,oa[N+2]=F.z,oa[N+3]=O.x,oa[N+4]=O.y,oa[N+5]=O.z,oa[N+6]=P.x,oa[N+7]=P.y,oa[N+8]=P.z,N+=9;if(aa)for(U in aa)if(n=aa[U],n.__original.needsUpdate)s=n.offset,B=n.offsetSrc,n.size===1?(n.boundTo===void 0||n.boundTo==="vertices"?(n.array[s]=n.value[A.a],n.array[s+1]=n.value[A.b],n.array[s+2]=n.value[A.c]):
n.boundTo==="faces"?(B=n.value[B],n.array[s]=B,n.array[s+1]=B,n.array[s+2]=B,n.offsetSrc++):n.boundTo==="faceVertices"&&(n.array[s]=n.value[B],n.array[s+1]=n.value[B+1],n.array[s+2]=n.value[B+2],n.offsetSrc+=3),n.offset+=3):(n.boundTo===void 0||n.boundTo==="vertices"?(F=n.value[A.a],O=n.value[A.b],P=n.value[A.c]):n.boundTo==="faces"?(P=O=F=B=n.value[B],n.offsetSrc++):n.boundTo==="faceVertices"&&(F=n.value[B],O=n.value[B+1],P=n.value[B+2],n.offsetSrc+=3),n.size===2?(n.array[s]=F.x,n.array[s+1]=F.y,
n.array[s+2]=O.x,n.array[s+3]=O.y,n.array[s+4]=P.x,n.array[s+5]=P.y,n.offset+=6):n.size===3?(n.type==="c"?(n.array[s]=F.r,n.array[s+1]=F.g,n.array[s+2]=F.b,n.array[s+3]=O.r,n.array[s+4]=O.g,n.array[s+5]=O.b,n.array[s+6]=P.r,n.array[s+7]=P.g,n.array[s+8]=P.b):(n.array[s]=F.x,n.array[s+1]=F.y,n.array[s+2]=F.z,n.array[s+3]=O.x,n.array[s+4]=O.y,n.array[s+5]=O.z,n.array[s+6]=P.x,n.array[s+7]=P.y,n.array[s+8]=P.z),n.offset+=9):(n.array[s]=F.x,n.array[s+1]=F.y,n.array[s+2]=F.z,n.array[s+3]=F.w,n.array[s+
4]=O.x,n.array[s+5]=O.y,n.array[s+6]=O.z,n.array[s+7]=O.w,n.array[s+8]=P.x,n.array[s+9]=P.y,n.array[s+10]=P.z,n.array[s+11]=P.w,n.offset+=12));if(Fa){s=0;for(n=Ha.length;s<n;s++)F=Ha[s].vertices[A.a].position,O=Ha[s].vertices[A.b].position,P=Ha[s].vertices[A.c].position,B=ra[s],B[na]=F.x,B[na+1]=F.y,B[na+2]=F.z,B[na+3]=O.x,B[na+4]=O.y,B[na+5]=O.z,B[na+6]=P.x,B[na+7]=P.y,B[na+8]=P.z;na+=9}if(Ka.length)s=Ka[A.a],n=Ka[A.b],B=Ka[A.c],ga[x]=s.x,ga[x+1]=s.y,ga[x+2]=s.z,ga[x+3]=s.w,ga[x+4]=n.x,ga[x+5]=n.y,
ga[x+6]=n.z,ga[x+7]=n.w,ga[x+8]=B.x,ga[x+9]=B.y,ga[x+10]=B.z,ga[x+11]=B.w,s=Oa[A.a],n=Oa[A.b],B=Oa[A.c],fa[x]=s.x,fa[x+1]=s.y,fa[x+2]=s.z,fa[x+3]=s.w,fa[x+4]=n.x,fa[x+5]=n.y,fa[x+6]=n.z,fa[x+7]=n.w,fa[x+8]=B.x,fa[x+9]=B.y,fa[x+10]=B.z,fa[x+11]=B.w,s=Ma[A.a],n=Ma[A.b],B=Ma[A.c],da[x]=s.x,da[x+1]=s.y,da[x+2]=s.z,da[x+3]=1,da[x+4]=n.x,da[x+5]=n.y,da[x+6]=n.z,da[x+7]=1,da[x+8]=B.x,da[x+9]=B.y,da[x+10]=B.z,da[x+11]=1,s=Na[A.a],n=Na[A.b],B=Na[A.c],ea[x]=s.x,ea[x+1]=s.y,ea[x+2]=s.z,ea[x+3]=1,ea[x+4]=n.x,
ea[x+5]=n.y,ea[x+6]=n.z,ea[x+7]=1,ea[x+8]=B.x,ea[x+9]=B.y,ea[x+10]=B.z,ea[x+11]=1,x+=12;if(Da&&v)E.length==3&&v==THREE.VertexColors?(A=E[0],s=E[1],n=E[2]):n=s=A=I,pa[ma]=A.r,pa[ma+1]=A.g,pa[ma+2]=A.b,pa[ma+3]=s.r,pa[ma+4]=s.g,pa[ma+5]=s.b,pa[ma+6]=n.r,pa[ma+7]=n.g,pa[ma+8]=n.b,ma+=9;if(Ba&&ta.hasTangents)E=K[0],I=K[1],A=K[2],ca[Z]=E.x,ca[Z+1]=E.y,ca[Z+2]=E.z,ca[Z+3]=E.w,ca[Z+4]=I.x,ca[Z+5]=I.y,ca[Z+6]=I.z,ca[Z+7]=I.w,ca[Z+8]=A.x,ca[Z+9]=A.y,ca[Z+10]=A.z,ca[Z+11]=A.w,Z+=12;if(Aa&&y)if(D.length==3&&
ya)for(K=0;K<3;K++)G=D[K],W[S]=G.x,W[S+1]=G.y,W[S+2]=G.z,S+=3;else for(K=0;K<3;K++)W[S]=G.x,W[S+1]=G.y,W[S+2]=G.z,S+=3;if(ua&&r!==void 0&&q)for(K=0;K<3;K++)D=r[K],ka[X]=D.u,ka[X+1]=D.v,X+=2;if(ua&&C!==void 0&&q)for(K=0;K<3;K++)D=C[K],la[$]=D.u,la[$+1]=D.v,$+=2;za&&(ha[V]=ia,ha[V+1]=ia+1,ha[V+2]=ia+2,V+=3,Y[T]=ia,Y[T+1]=ia+1,Y[T+2]=ia,Y[T+3]=ia+2,Y[T+4]=ia+1,Y[T+5]=ia+2,T+=6,ia+=3)}else if(A instanceof THREE.Face4){if(va)F=Ca[A.a].position,O=Ca[A.b].position,P=Ca[A.c].position,J=Ca[A.d].position,oa[N]=
F.x,oa[N+1]=F.y,oa[N+2]=F.z,oa[N+3]=O.x,oa[N+4]=O.y,oa[N+5]=O.z,oa[N+6]=P.x,oa[N+7]=P.y,oa[N+8]=P.z,oa[N+9]=J.x,oa[N+10]=J.y,oa[N+11]=J.z,N+=12;if(aa)for(U in aa)if(n=aa[U],n.__original.needsUpdate)s=n.offset,B=n.offsetSrc,n.size===1?(n.boundTo===void 0||n.boundTo==="vertices"?(n.array[s]=n.value[A.a],n.array[s+1]=n.value[A.b],n.array[s+2]=n.value[A.c],n.array[s+3]=n.value[A.d]):n.boundTo==="faces"?(B=n.value[B],n.array[s]=B,n.array[s+1]=B,n.array[s+2]=B,n.array[s+3]=B,n.offsetSrc++):n.boundTo===
"faceVertices"&&(n.array[s]=n.value[B],n.array[s+1]=n.value[B+1],n.array[s+2]=n.value[B+2],n.array[s+3]=n.value[B+3],n.offsetSrc+=4),n.offset+=4):(n.boundTo===void 0||n.boundTo==="vertices"?(F=n.value[A.a],O=n.value[A.b],P=n.value[A.c],J=n.value[A.d]):n.boundTo==="faces"?(J=P=O=F=B=n.value[B],n.offsetSrc++):n.boundTo==="faceVertices"&&(F=n.value[B],O=n.value[B+1],P=n.value[B+2],J=n.value[B+3],n.offsetSrc+=4),n.size===2?(n.array[s]=F.x,n.array[s+1]=F.y,n.array[s+2]=O.x,n.array[s+3]=O.y,n.array[s+4]=
P.x,n.array[s+5]=P.y,n.array[s+6]=J.x,n.array[s+7]=J.y,n.offset+=8):n.size===3?(n.type==="c"?(n.array[s]=F.r,n.array[s+1]=F.g,n.array[s+2]=F.b,n.array[s+3]=O.r,n.array[s+4]=O.g,n.array[s+5]=O.b,n.array[s+6]=P.r,n.array[s+7]=P.g,n.array[s+8]=P.b,n.array[s+9]=J.r,n.array[s+10]=J.g,n.array[s+11]=J.b):(n.array[s]=F.x,n.array[s+1]=F.y,n.array[s+2]=F.z,n.array[s+3]=O.x,n.array[s+4]=O.y,n.array[s+5]=O.z,n.array[s+6]=P.x,n.array[s+7]=P.y,n.array[s+8]=P.z,n.array[s+9]=J.x,n.array[s+10]=J.y,n.array[s+11]=J.z),
n.offset+=12):(n.array[s]=F.x,n.array[s+1]=F.y,n.array[s+2]=F.z,n.array[s+3]=F.w,n.array[s+4]=O.x,n.array[s+5]=O.y,n.array[s+6]=O.z,n.array[s+7]=O.w,n.array[s+8]=P.x,n.array[s+9]=P.y,n.array[s+10]=P.z,n.array[s+11]=P.w,n.array[s+12]=J.x,n.array[s+13]=J.y,n.array[s+14]=J.z,n.array[s+15]=J.w,n.offset+=16));if(Fa){s=0;for(n=Ha.length;s<n;s++)F=Ha[s].vertices[A.a].position,O=Ha[s].vertices[A.b].position,P=Ha[s].vertices[A.c].position,J=Ha[s].vertices[A.d].position,B=ra[s],B[na]=F.x,B[na+1]=F.y,B[na+2]=
F.z,B[na+3]=O.x,B[na+4]=O.y,B[na+5]=O.z,B[na+6]=P.x,B[na+7]=P.y,B[na+8]=P.z,B[na+9]=J.x,B[na+10]=J.y,B[na+11]=J.z;na+=12}if(Ka.length)s=Ka[A.a],n=Ka[A.b],B=Ka[A.c],R=Ka[A.d],ga[x]=s.x,ga[x+1]=s.y,ga[x+2]=s.z,ga[x+3]=s.w,ga[x+4]=n.x,ga[x+5]=n.y,ga[x+6]=n.z,ga[x+7]=n.w,ga[x+8]=B.x,ga[x+9]=B.y,ga[x+10]=B.z,ga[x+11]=B.w,ga[x+12]=R.x,ga[x+13]=R.y,ga[x+14]=R.z,ga[x+15]=R.w,s=Oa[A.a],n=Oa[A.b],B=Oa[A.c],R=Oa[A.d],fa[x]=s.x,fa[x+1]=s.y,fa[x+2]=s.z,fa[x+3]=s.w,fa[x+4]=n.x,fa[x+5]=n.y,fa[x+6]=n.z,fa[x+7]=n.w,
fa[x+8]=B.x,fa[x+9]=B.y,fa[x+10]=B.z,fa[x+11]=B.w,fa[x+12]=R.x,fa[x+13]=R.y,fa[x+14]=R.z,fa[x+15]=R.w,s=Ma[A.a],n=Ma[A.b],B=Ma[A.c],R=Ma[A.d],da[x]=s.x,da[x+1]=s.y,da[x+2]=s.z,da[x+3]=1,da[x+4]=n.x,da[x+5]=n.y,da[x+6]=n.z,da[x+7]=1,da[x+8]=B.x,da[x+9]=B.y,da[x+10]=B.z,da[x+11]=1,da[x+12]=R.x,da[x+13]=R.y,da[x+14]=R.z,da[x+15]=1,s=Na[A.a],n=Na[A.b],B=Na[A.c],A=Na[A.d],ea[x]=s.x,ea[x+1]=s.y,ea[x+2]=s.z,ea[x+3]=1,ea[x+4]=n.x,ea[x+5]=n.y,ea[x+6]=n.z,ea[x+7]=1,ea[x+8]=B.x,ea[x+9]=B.y,ea[x+10]=B.z,ea[x+
11]=1,ea[x+12]=A.x,ea[x+13]=A.y,ea[x+14]=A.z,ea[x+15]=1,x+=16;if(Da&&v)E.length==4&&v==THREE.VertexColors?(A=E[0],s=E[1],n=E[2],E=E[3]):E=n=s=A=I,pa[ma]=A.r,pa[ma+1]=A.g,pa[ma+2]=A.b,pa[ma+3]=s.r,pa[ma+4]=s.g,pa[ma+5]=s.b,pa[ma+6]=n.r,pa[ma+7]=n.g,pa[ma+8]=n.b,pa[ma+9]=E.r,pa[ma+10]=E.g,pa[ma+11]=E.b,ma+=12;if(Ba&&ta.hasTangents)E=K[0],I=K[1],A=K[2],K=K[3],ca[Z]=E.x,ca[Z+1]=E.y,ca[Z+2]=E.z,ca[Z+3]=E.w,ca[Z+4]=I.x,ca[Z+5]=I.y,ca[Z+6]=I.z,ca[Z+7]=I.w,ca[Z+8]=A.x,ca[Z+9]=A.y,ca[Z+10]=A.z,ca[Z+11]=A.w,
ca[Z+12]=K.x,ca[Z+13]=K.y,ca[Z+14]=K.z,ca[Z+15]=K.w,Z+=16;if(Aa&&y)if(D.length==4&&ya)for(K=0;K<4;K++)G=D[K],W[S]=G.x,W[S+1]=G.y,W[S+2]=G.z,S+=3;else for(K=0;K<4;K++)W[S]=G.x,W[S+1]=G.y,W[S+2]=G.z,S+=3;if(ua&&r!==void 0&&q)for(K=0;K<4;K++)D=r[K],ka[X]=D.u,ka[X+1]=D.v,X+=2;if(ua&&C!==void 0&&q)for(K=0;K<4;K++)D=C[K],la[$]=D.u,la[$+1]=D.v,$+=2;za&&(ha[V]=ia,ha[V+1]=ia+1,ha[V+2]=ia+3,ha[V+3]=ia+1,ha[V+4]=ia+2,ha[V+5]=ia+3,V+=6,Y[T]=ia,Y[T+1]=ia+1,Y[T+2]=ia,Y[T+3]=ia+3,Y[T+4]=ia+1,Y[T+5]=ia+2,Y[T+6]=
ia+2,Y[T+7]=ia+3,T+=8,ia+=4)}va&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglVertexBuffer),f.bufferData(f.ARRAY_BUFFER,oa,u));if(aa)for(U in aa)n=aa[U],n.__original.needsUpdate&&(f.bindBuffer(f.ARRAY_BUFFER,n.buffer),f.bufferData(f.ARRAY_BUFFER,n.array,u));if(Fa){s=0;for(n=Ha.length;s<n;s++)f.bindBuffer(f.ARRAY_BUFFER,m.__webglMorphTargetsBuffers[s]),f.bufferData(f.ARRAY_BUFFER,ra[s],u)}Da&&ma>0&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglColorBuffer),f.bufferData(f.ARRAY_BUFFER,pa,u));Aa&&(f.bindBuffer(f.ARRAY_BUFFER,
m.__webglNormalBuffer),f.bufferData(f.ARRAY_BUFFER,W,u));Ba&&ta.hasTangents&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglTangentBuffer),f.bufferData(f.ARRAY_BUFFER,ca,u));ua&&X>0&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglUVBuffer),f.bufferData(f.ARRAY_BUFFER,ka,u));ua&&$>0&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglUV2Buffer),f.bufferData(f.ARRAY_BUFFER,la,u));za&&(f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,m.__webglFaceBuffer),f.bufferData(f.ELEMENT_ARRAY_BUFFER,ha,u),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,m.__webglLineBuffer),
f.bufferData(f.ELEMENT_ARRAY_BUFFER,Y,u));x>0&&(f.bindBuffer(f.ARRAY_BUFFER,m.__webglSkinVertexABuffer),f.bufferData(f.ARRAY_BUFFER,da,u),f.bindBuffer(f.ARRAY_BUFFER,m.__webglSkinVertexBBuffer),f.bufferData(f.ARRAY_BUFFER,ea,u),f.bindBuffer(f.ARRAY_BUFFER,m.__webglSkinIndicesBuffer),f.bufferData(f.ARRAY_BUFFER,fa,u),f.bindBuffer(f.ARRAY_BUFFER,m.__webglSkinWeightsBuffer),f.bufferData(f.ARRAY_BUFFER,ga,u));w&&(delete m.__inittedArrays,delete m.__colorArray,delete m.__normalArray,delete m.__tangentArray,
delete m.__uvArray,delete m.__uv2Array,delete m.__faceArray,delete m.__vertexArray,delete m.__lineArray,delete m.__skinVertexAArray,delete m.__skinVertexBArray,delete m.__skinIndexArray,delete m.__skinWeightArray)}h.__dirtyVertices=!1;h.__dirtyMorphTargets=!1;h.__dirtyElements=!1;h.__dirtyUvs=!1;h.__dirtyNormals=!1;h.__dirtyTangents=!1;h.__dirtyColors=!1;xa(j)}else if(i instanceof THREE.Ribbon){h=i.geometry;if(h.__dirtyVertices||h.__dirtyColors){i=h;j=f.DYNAMIC_DRAW;k=t=w=w=void 0;p=i.vertices;o=
i.colors;q=p.length;m=o.length;v=i.__vertexArray;u=i.__colorArray;y=i.__dirtyColors;if(i.__dirtyVertices){for(w=0;w<q;w++)t=p[w].position,k=w*3,v[k]=t.x,v[k+1]=t.y,v[k+2]=t.z;f.bindBuffer(f.ARRAY_BUFFER,i.__webglVertexBuffer);f.bufferData(f.ARRAY_BUFFER,v,j)}if(y){for(w=0;w<m;w++)color=o[w],k=w*3,u[k]=color.r,u[k+1]=color.g,u[k+2]=color.b;f.bindBuffer(f.ARRAY_BUFFER,i.__webglColorBuffer);f.bufferData(f.ARRAY_BUFFER,u,j)}}h.__dirtyVertices=!1;h.__dirtyColors=!1}else if(i instanceof THREE.Line){h=i.geometry;
if(h.__dirtyVertices||h.__dirtyColors){i=h;j=f.DYNAMIC_DRAW;k=t=w=w=void 0;p=i.vertices;o=i.colors;q=p.length;m=o.length;v=i.__vertexArray;u=i.__colorArray;y=i.__dirtyColors;if(i.__dirtyVertices){for(w=0;w<q;w++)t=p[w].position,k=w*3,v[k]=t.x,v[k+1]=t.y,v[k+2]=t.z;f.bindBuffer(f.ARRAY_BUFFER,i.__webglVertexBuffer);f.bufferData(f.ARRAY_BUFFER,v,j)}if(y){for(w=0;w<m;w++)color=o[w],k=w*3,u[k]=color.r,u[k+1]=color.g,u[k+2]=color.b;f.bindBuffer(f.ARRAY_BUFFER,i.__webglColorBuffer);f.bufferData(f.ARRAY_BUFFER,
u,j)}}h.__dirtyVertices=!1;h.__dirtyColors=!1}else if(i instanceof THREE.ParticleSystem)h=i.geometry,m=wa(h),(h.__dirtyVertices||h.__dirtyColors||i.sortParticles||m)&&c(h,f.DYNAMIC_DRAW,i),h.__dirtyVertices=!1,h.__dirtyColors=!1,xa(h)};this.setFaceCulling=function(b,c){b?(!c||c=="ccw"?f.frontFace(f.CCW):f.frontFace(f.CW),b=="back"?f.cullFace(f.BACK):b=="front"?f.cullFace(f.FRONT):f.cullFace(f.FRONT_AND_BACK),f.enable(f.CULL_FACE)):f.disable(f.CULL_FACE)};this.supportsVertexTextures=function(){return bb}};
THREE.WebGLRenderTarget=function(b,c,d){this.width=b;this.height=c;d=d||{};this.wrapS=d.wrapS!==void 0?d.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=d.wrapT!==void 0?d.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=d.magFilter!==void 0?d.magFilter:THREE.LinearFilter;this.minFilter=d.minFilter!==void 0?d.minFilter:THREE.LinearMipMapLinearFilter;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=d.format!==void 0?d.format:THREE.RGBAFormat;this.type=d.type!==void 0?d.type:
THREE.UnsignedByteType;this.depthBuffer=d.depthBuffer!==void 0?d.depthBuffer:!0;this.stencilBuffer=d.stencilBuffer!==void 0?d.stencilBuffer:!0};
THREE.WebGLRenderTarget.prototype.clone=function(){var b=new THREE.WebGLRenderTarget(this.width,this.height);b.wrapS=this.wrapS;b.wrapT=this.wrapT;b.magFilter=this.magFilter;b.minFilter=this.minFilter;b.offset.copy(this.offset);b.repeat.copy(this.repeat);b.format=this.format;b.type=this.type;b.depthBuffer=this.depthBuffer;b.stencilBuffer=this.stencilBuffer;return b};THREE.WebGLRenderTargetCube=function(b,c,d){THREE.WebGLRenderTarget.call(this,b,c,d);this.activeCubeFace=0};
THREE.WebGLRenderTargetCube.prototype=new THREE.WebGLRenderTarget;THREE.WebGLRenderTargetCube.prototype.constructor=THREE.WebGLRenderTargetCube;
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

  canvas : !! window.CanvasRenderingContext2D,
  webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
  workers : !! window.Worker,
  fileapi : window.File && window.FileReader && window.FileList && window.Blob,

  getWebGLErrorMessage : function () {

    var domElement = document.createElement( 'div' );

    domElement.style.fontFamily = 'monospace';
    domElement.style.fontSize = '13px';
    domElement.style.textAlign = 'center';
    domElement.style.background = '#eee';
    domElement.style.color = '#000';
    domElement.style.padding = '1em';
    domElement.style.width = '475px';
    domElement.style.margin = '5em auto 0';

    if ( ! this.webgl ) {

      domElement.innerHTML = window.WebGLRenderingContext ? [
        'Sorry, your graphics card doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>'
      ].join( '\n' ) : [
        'Sorry, your browser doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a><br/>',
        'Please try with',
        '<a href="http://www.google.com/chrome">Chrome</a>, ',
        '<a href="http://www.mozilla.com/en-US/firefox/new/">Firefox 4</a> or',
        '<a href="http://nightly.webkit.org/">Webkit Nightly (Mac)</a>'
      ].join( '\n' );

    }

    return domElement;

  },

  addGetWebGLMessage : function ( parameters ) {

    var parent, id, domElement;

    parameters = parameters || {};

    parent = parameters.parent !== undefined ? parameters.parent : document.body;
    id = parameters.id !== undefined ? parameters.id : 'oldie';

    domElement = Detector.getWebGLErrorMessage();
    domElement.id = id;

    parent.appendChild( domElement );

  }

};
// ThreeExtras.js r45 - http://github.com/mrdoob/three.js
THREE.ColorUtils={adjustHSV:function(a,b,c,e){var g=THREE.ColorUtils.__hsv;THREE.ColorUtils.rgbToHsv(a,g);g.h=THREE.ColorUtils.clamp(g.h+b,0,1);g.s=THREE.ColorUtils.clamp(g.s+c,0,1);g.v=THREE.ColorUtils.clamp(g.v+e,0,1);a.setHSV(g.h,g.s,g.v)},rgbToHsv:function(a,b){var c=a.r,e=a.g,g=a.b,h=Math.max(Math.max(c,e),g),f=Math.min(Math.min(c,e),g);if(f==h)f=c=0;else{var k=h-f,f=k/h,c=c==h?(e-g)/k:e==h?2+(g-c)/k:4+(c-e)/k;c/=6;c<0&&(c+=1);c>1&&(c-=1)}b===void 0&&(b={h:0,s:0,v:0});b.h=c;b.s=f;b.v=h;return b},
clamp:function(a,b,c){return a<b?b:a>c?c:a}};THREE.ColorUtils.__hsv={h:0,s:0,v:0};
THREE.GeometryUtils={merge:function(a,b){var c,e,g=a.vertices.length,h=b instanceof THREE.Mesh?b.geometry:b,f=a.vertices,k=h.vertices,l=a.faces,m=h.faces,n=a.faceVertexUvs[0],h=h.faceVertexUvs[0];if(b instanceof THREE.Mesh)b.matrixAutoUpdate&&b.updateMatrix(),c=b.matrix,e=new THREE.Matrix4,e.extractRotation(c,b.scale);for(var o=0,t=k.length;o<t;o++){var u=new THREE.Vertex(k[o].position.clone());c&&c.multiplyVector3(u.position);f.push(u)}o=0;for(t=m.length;o<t;o++){var u=m[o],v,y,p=u.vertexNormals,
z=u.vertexColors;u instanceof THREE.Face3?v=new THREE.Face3(u.a+g,u.b+g,u.c+g):u instanceof THREE.Face4&&(v=new THREE.Face4(u.a+g,u.b+g,u.c+g,u.d+g));v.normal.copy(u.normal);e&&e.multiplyVector3(v.normal);f=0;for(k=p.length;f<k;f++)y=p[f].clone(),e&&e.multiplyVector3(y),v.vertexNormals.push(y);v.color.copy(u.color);f=0;for(k=z.length;f<k;f++)y=z[f],v.vertexColors.push(y.clone());v.materials=u.materials.slice();v.centroid.copy(u.centroid);c&&c.multiplyVector3(v.centroid);l.push(v)}o=0;for(t=h.length;o<
t;o++){c=h[o];e=[];f=0;for(k=c.length;f<k;f++)e.push(new THREE.UV(c[f].u,c[f].v));n.push(e)}},clone:function(a){var b=new THREE.Geometry,c,e=a.vertices,g=a.faces,h=a.faceVertexUvs[0],a=0;for(c=e.length;a<c;a++){var f=new THREE.Vertex(e[a].position.clone());b.vertices.push(f)}a=0;for(c=g.length;a<c;a++){var k=g[a],l,m,n=k.vertexNormals,o=k.vertexColors;k instanceof THREE.Face3?l=new THREE.Face3(k.a,k.b,k.c):k instanceof THREE.Face4&&(l=new THREE.Face4(k.a,k.b,k.c,k.d));l.normal.copy(k.normal);e=0;
for(f=n.length;e<f;e++)m=n[e],l.vertexNormals.push(m.clone());l.color.copy(k.color);e=0;for(f=o.length;e<f;e++)m=o[e],l.vertexColors.push(m.clone());l.materials=k.materials.slice();l.centroid.copy(k.centroid);b.faces.push(l)}a=0;for(c=h.length;a<c;a++){g=h[a];l=[];e=0;for(f=g.length;e<f;e++)l.push(new THREE.UV(g[e].u,g[e].v));b.faceVertexUvs[0].push(l)}return b},randomPointInTriangle:function(a,b,c){var e,g,h,f=new THREE.Vector3,k=THREE.GeometryUtils.__v1;e=THREE.GeometryUtils.random();g=THREE.GeometryUtils.random();
e+g>1&&(e=1-e,g=1-g);h=1-e-g;f.copy(a);f.multiplyScalar(e);k.copy(b);k.multiplyScalar(g);f.addSelf(k);k.copy(c);k.multiplyScalar(h);f.addSelf(k);return f},randomPointInFace:function(a,b,c){var e,g,h;if(a instanceof THREE.Face3)return e=b.vertices[a.a].position,g=b.vertices[a.b].position,h=b.vertices[a.c].position,THREE.GeometryUtils.randomPointInTriangle(e,g,h);else if(a instanceof THREE.Face4){e=b.vertices[a.a].position;g=b.vertices[a.b].position;h=b.vertices[a.c].position;var b=b.vertices[a.d].position,
f;c?a._area1&&a._area2?(c=a._area1,f=a._area2):(c=THREE.GeometryUtils.triangleArea(e,g,b),f=THREE.GeometryUtils.triangleArea(g,h,b),a._area1=c,a._area2=f):(c=THREE.GeometryUtils.triangleArea(e,g,b),f=THREE.GeometryUtils.triangleArea(g,h,b));return THREE.GeometryUtils.random()*(c+f)<c?THREE.GeometryUtils.randomPointInTriangle(e,g,b):THREE.GeometryUtils.randomPointInTriangle(g,h,b)}},randomPointsInGeometry:function(a,b){function c(a){function c(b,e){if(e<b)return b;var f=b+Math.floor((e-b)/2);return m[f]>
a?c(b,f-1):m[f]<a?c(f+1,e):f}return c(0,m.length-1)}var e,g,h=a.faces,f=a.vertices,k=h.length,l=0,m=[],n,o,t,u;for(g=0;g<k;g++){e=h[g];if(e instanceof THREE.Face3)n=f[e.a].position,o=f[e.b].position,t=f[e.c].position,e._area=THREE.GeometryUtils.triangleArea(n,o,t);else if(e instanceof THREE.Face4)n=f[e.a].position,o=f[e.b].position,t=f[e.c].position,u=f[e.d].position,e._area1=THREE.GeometryUtils.triangleArea(n,o,u),e._area2=THREE.GeometryUtils.triangleArea(o,t,u),e._area=e._area1+e._area2;l+=e._area;
m[g]=l}e=[];f={};for(g=0;g<b;g++)k=THREE.GeometryUtils.random()*l,k=c(k),e[g]=THREE.GeometryUtils.randomPointInFace(h[k],a,!0),f[k]?f[k]+=1:f[k]=1;return e},triangleArea:function(a,b,c){var e,g=THREE.GeometryUtils.__v1;g.sub(a,b);e=g.length();g.sub(a,c);a=g.length();g.sub(b,c);c=g.length();b=0.5*(e+a+c);return Math.sqrt(b*(b-e)*(b-a)*(b-c))},random16:function(){return(65280*Math.random()+255*Math.random())/65535},center:function(a){a.computeBoundingBox();var b=new THREE.Matrix4;b.setTranslation(-0.5*
(a.boundingBox.x[1]+a.boundingBox.x[0]),-0.5*(a.boundingBox.y[1]+a.boundingBox.y[0]),-0.5*(a.boundingBox.z[1]+a.boundingBox.z[0]));a.applyMatrix(b);a.computeBoundingBox()}};THREE.GeometryUtils.random=THREE.GeometryUtils.random16;THREE.GeometryUtils.__v1=new THREE.Vector3;
THREE.ImageUtils={loadTexture:function(a,b,c){var e=new Image,g=new THREE.Texture(e,b);e.onload=function(){g.needsUpdate=!0;c&&c(this)};e.crossOrigin="";e.src=a;return g},loadTextureCube:function(a,b,c){var e,g=[],h=new THREE.Texture(g,b),b=g.loadCount=0;for(e=a.length;b<e;++b)g[b]=new Image,g[b].onload=function(){g.loadCount+=1;if(g.loadCount==6)h.needsUpdate=!0;c&&c(this)},g[b].crossOrigin="",g[b].src=a[b];return h},getNormalMap:function(a,b){var c=function(a){var c=Math.sqrt(a[0]*a[0]+a[1]*a[1]+
a[2]*a[2]);return[a[0]/c,a[1]/c,a[2]/c]};b|=1;var e=a.width,g=a.height,h=document.createElement("canvas");h.width=e;h.height=g;var f=h.getContext("2d");f.drawImage(a,0,0);for(var k=f.getImageData(0,0,e,g).data,l=f.createImageData(e,g),m=l.data,n=0;n<e;n++)for(var o=1;o<g;o++){var t=o-1<0?g-1:o-1,u=(o+1)%g,v=n-1<0?e-1:n-1,y=(n+1)%e,p=[],z=[0,0,k[(o*e+n)*4]/255*b];p.push([-1,0,k[(o*e+v)*4]/255*b]);p.push([-1,-1,k[(t*e+v)*4]/255*b]);p.push([0,-1,k[(t*e+n)*4]/255*b]);p.push([1,-1,k[(t*e+y)*4]/255*b]);
p.push([1,0,k[(o*e+y)*4]/255*b]);p.push([1,1,k[(u*e+y)*4]/255*b]);p.push([0,1,k[(u*e+n)*4]/255*b]);p.push([-1,1,k[(u*e+v)*4]/255*b]);t=[];v=p.length;for(u=0;u<v;u++){var y=p[u],w=p[(u+1)%v],y=[y[0]-z[0],y[1]-z[1],y[2]-z[2]],w=[w[0]-z[0],w[1]-z[1],w[2]-z[2]];t.push(c([y[1]*w[2]-y[2]*w[1],y[2]*w[0]-y[0]*w[2],y[0]*w[1]-y[1]*w[0]]))}p=[0,0,0];for(u=0;u<t.length;u++)p[0]+=t[u][0],p[1]+=t[u][1],p[2]+=t[u][2];p[0]/=t.length;p[1]/=t.length;p[2]/=t.length;z=(o*e+n)*4;m[z]=(p[0]+1)/2*255|0;m[z+1]=(p[1]+0.5)*
255|0;m[z+2]=p[2]*255|0;m[z+3]=255}f.putImageData(l,0,0);return h}};THREE.SceneUtils={showHierarchy:function(a,b){THREE.SceneUtils.traverseHierarchy(a,function(a){a.visible=b})},traverseHierarchy:function(a,b){var c,e,g=a.children.length;for(e=0;e<g;e++)c=a.children[e],b(c),THREE.SceneUtils.traverseHierarchy(c,b)}};
if(THREE.WebGLRenderer)THREE.ShaderUtils={lib:{fresnel:{uniforms:{mRefractionRatio:{type:"f",value:1.02},mFresnelBias:{type:"f",value:0.1},mFresnelPower:{type:"f",value:2},mFresnelScale:{type:"f",value:1},tCube:{type:"t",value:1,texture:null}},fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
vertexShader:"uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"},
normal:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},tDiffuse:{type:"t",value:0,texture:null},tCube:{type:"t",value:1,texture:null},tNormal:{type:"t",value:2,texture:null},tSpecular:{type:"t",value:3,texture:null},tAO:{type:"t",value:4,texture:null},tDisplacement:{type:"t",value:5,texture:null},uNormalScale:{type:"f",
value:1},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(15658734)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(328965)},uShininess:{type:"f",value:30},uOpacity:{type:"f",value:1},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)}}]),fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse )\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\nif( enableAO )\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( vTangent, vBinormal, vNormal );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nvec3 pointHalfVector = normalize( vPointLight[ i ].xyz + viewPosition );\nfloat pointDistance = vPointLight[ i ].w;\nfloat pointDotNormalHalf = dot( normal, pointHalfVector );\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\nfloat pointSpecularWeight = 0.0;\nif ( pointDotNormalHalf >= 0.0 )\npointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nvec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );\nfloat dirDotNormalHalf = dot( normal, dirHalfVector );\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\nfloat dirSpecularWeight = 0.0;\nif ( dirDotNormalHalf >= 0.0 )\ndirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight;\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * totalDiffuse + totalSpecular + ambientLightColor * uAmbientColor;\nif ( enableReflection ) {\nvec3 wPos = cameraPosition - vViewPosition;\nvec3 vReflect = reflect( normalize( wPos ), normal );\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, uReflectivity );\n}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvViewPosition = -mvPosition.xyz;\nvNormal = normalize( normalMatrix * normal );\nvTangent = normalize( normalMatrix * tangent.xyz );\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvBinormal = normalize( vBinormal );\nvUv = uv * uRepeat + uOffset;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif",
THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:1,texture:null}},vertexShader:"varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );\n}"}}};
THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){return this.getPoint(this.getUtoTmapping(a))};THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};
THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};THREE.Curve.prototype.getLengths=function(a){a||(a=200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1)return this.cacheArcLengths;var b=[],c,e=this.getPoint(0),g,h=0;b.push(0);for(g=1;g<=a;g++)c=this.getPoint(g/a),h+=c.distanceTo(e),b.push(h),e=c;return this.cacheArcLengths=b};
THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),e=0,g=c.length,h;h=b?b:a*c[g-1];time=Date.now();for(var f=0,k=g-1,l;f<=k;)if(e=Math.floor(f+(k-f)/2),l=c[e]-h,l<0)f=e+1;else if(l>0)k=e-1;else{k=e;break}e=k;if(c[e]==h)return e/(g-1);f=c[e];return c=(e+(h-f)/(c[e+1]-f))/(g-1)};THREE.Curve.prototype.getNormalVector=function(a){a=this.getTangent(a);return new THREE.Vector2(-a.y,a.x)};
THREE.Curve.prototype.getTangent=function(a){var b=a-1.0E-4;a+=1.0E-4;b<0&&(b=0);a>1&&(a=1);var b=this.getPoint(b),a=this.getPoint(a),c=new THREE.Vector2;c.sub(a,b);return c.unit()};THREE.LineCurve=function(a,b){a instanceof THREE.Vector2?(this.v1=a,this.v2=b):THREE.LineCurve.oldConstructor.apply(this,arguments)};THREE.LineCurve.oldConstructor=function(a,b,c,e){this.constructor(new THREE.Vector2(a,b),new THREE.Vector2(c,e))};THREE.LineCurve.prototype=new THREE.Curve;
THREE.LineCurve.prototype.constructor=THREE.LineCurve;THREE.LineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2;b.sub(this.v2,this.v1);b.multiplyScalar(a).addSelf(this.v1);return b};THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(){var a=new THREE.Vector2;a.sub(this.v2,this.v1);a.normalize();return a};
THREE.QuadraticBezierCurve=function(a,b,c){if(!(b instanceof THREE.Vector2))var e=Array.prototype.slice.call(arguments),a=new THREE.Vector2(e[0],e[1]),b=new THREE.Vector2(e[2],e[3]),c=new THREE.Vector2(e[4],e[5]);this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=new THREE.Curve;THREE.QuadraticBezierCurve.prototype.constructor=THREE.QuadraticBezierCurve;
THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.CubicBezierCurve=function(a,b,c,e){if(!(b instanceof THREE.Vector2))var g=Array.prototype.slice.call(arguments),a=new THREE.Vector2(g[0],g[1]),b=new THREE.Vector2(g[2],g[3]),c=new THREE.Vector2(g[4],g[5]),e=new THREE.Vector2(g[6],g[7]);this.v0=a;this.v1=b;this.v2=c;this.v3=e};THREE.CubicBezierCurve.prototype=new THREE.Curve;THREE.CubicBezierCurve.prototype.constructor=THREE.CubicBezierCurve;
THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.SplineCurve=function(a){this.points=a};THREE.SplineCurve.prototype=new THREE.Curve;THREE.SplineCurve.prototype.constructor=THREE.SplineCurve;
THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],e=this.points,g;g=(e.length-1)*a;a=Math.floor(g);g-=a;c[0]=a==0?a:a-1;c[1]=a;c[2]=a>e.length-2?a:a+1;c[3]=a>e.length-3?a:a+2;b.x=THREE.Curve.Utils.interpolate(e[c[0]].x,e[c[1]].x,e[c[2]].x,e[c[3]].x,g);b.y=THREE.Curve.Utils.interpolate(e[c[0]].y,e[c[1]].y,e[c[2]].y,e[c[3]].y,g);return b};THREE.ArcCurve=function(a,b,c,e,g,h){this.aX=a;this.aY=b;this.aRadius=c;this.aStartAngle=e;this.aEndAngle=g;this.aClockwise=h};
THREE.ArcCurve.prototype=new THREE.Curve;THREE.ArcCurve.prototype.constructor=THREE.ArcCurve;THREE.ArcCurve.prototype.getPoint=function(a){var b=this.aEndAngle-this.aStartAngle;this.aClockwise||(a=1-a);a=this.aStartAngle+a*b;return new THREE.Vector2(this.aX+this.aRadius*Math.cos(a),this.aY+this.aRadius*Math.sin(a))};
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,e){return 2*(1-a)*(c-b)+2*a*(e-c)},tangentCubicBezier:function(a,b,c,e,g){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*e*(1-a)-3*a*a*e+3*a*a*g},tangentSpline:function(a){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,e,g){var a=(c-a)*0.5,e=(e-b)*0.5,h=g*g;return(2*b-2*c+a+e)*g*h+(-3*b+3*c-2*a-e)*h+a*g+b}};
THREE.Curve.create=function(a,b){a.prototype=new THREE.Curve;a.prototype.constructor=a;a.prototype.getPoint=b;return a};THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.sub(v2,v1);b.multiplyScalar(a);b.addSelf(this.v1);return b});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});
THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,e){this.v0=a;this.v1=b;this.v2=c;this.v3=e},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});
THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=a},function(a){var b=new THREE.Vector3,c=[],e=this.points,g;g=(e.length-1)*a;a=Math.floor(g);g-=a;c[0]=a==0?a:a-1;c[1]=a;c[2]=a>e.length-2?a:a+1;c[3]=a>e.length-3?a:a+2;b.x=THREE.Curve.Utils.interpolate(e[c[0]].x,e[c[1]].x,e[c[2]].x,e[c[3]].x,g);b.y=THREE.Curve.Utils.interpolate(e[c[0]].y,e[c[1]].y,e[c[2]].y,e[c[3]].y,g);b.z=THREE.Curve.Utils.interpolate(e[c[0]].z,e[c[1]].z,e[c[2]].z,e[c[3]].z,g);return b});
THREE.CurvePath=function(){this.curves=[];this.bends=[]};THREE.CurvePath.prototype=new THREE.Curve;THREE.CurvePath.prototype.constructor=THREE.CurvePath;THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};THREE.CurvePath.prototype.closePath=function(){};
THREE.CurvePath.prototype.getPoint=function(a){for(var b=a*this.getLength(),c=this.getCurveLengths(),a=0;a<c.length;){if(c[a]>=b)return b=c[a]-b,a=this.curves[a],b=1-b/a.getLength(),a.getPointAt(b);a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,e=this.curves.length;for(c=0;c<e;c++)b+=this.curves[c].getLength(),a.push(b);return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,e,g;b=c=Number.NEGATIVE_INFINITY;e=g=Number.POSITIVE_INFINITY;var h,f,k,l;l=new THREE.Vector2;f=0;for(k=a.length;f<k;f++){h=a[f];if(h.x>b)b=h.x;else if(h.x<e)e=h.x;if(h.y>c)c=h.y;else if(h.y<c)g=h.y;l.addSelf(h.x,h.y)}return{minX:e,minY:g,maxX:b,maxY:c,centroid:l.divideScalar(k)}};THREE.CurvePath.prototype.createPointsGeometry=function(a){return this.createGeometry(this.getPoints(a,!0))};
THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){return this.createGeometry(this.getSpacedPoints(a,!0))};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vertex(new THREE.Vector3(a[c].x,a[c].y,0)));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),e,g;if(!b)b=this.bends;e=0;for(g=b.length;e<g;e++)c=this.getWrapPoints(c,b[e]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),e,g;if(!b)b=this.bends;e=0;for(g=b.length;e<g;e++)c=this.getWrapPoints(c,b[e]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),e,g,h,f,k,l;e=0;for(g=a.length;e<g;e++)h=a[e],f=h.x,k=h.y,l=f/c.maxX,l=b.getUtoTmapping(l,f),f=b.getPoint(l),k=b.getNormalVector(l).multiplyScalar(k),h.x=f.x+k.x,h.y=f.y+k.y;return a};THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=new THREE.CurvePath;THREE.Path.prototype.constructor=THREE.Path;
THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);var b,c=a.length;for(b=1;b<c;b++)this.lineTo(a[b].x,a[b].y)};THREE.Path.prototype.moveTo=function(){var a=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:a})};
THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),e=this.actions[this.actions.length-1].args;this.curves.push(new THREE.LineCurve(new THREE.Vector2(e[e.length-2],e[e.length-1]),new THREE.Vector2(a,b)));this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,e){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args;this.curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,e)));this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:g})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,e,g,h){var f=Array.prototype.slice.call(arguments),k=this.actions[this.actions.length-1].args;this.curves.push(new THREE.CubicBezierCurve(new THREE.Vector2(k[k.length-2],k[k.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,e),new THREE.Vector2(g,h)));this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:f})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);this.curves.push(new THREE.SplineCurve(c));this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};
THREE.Path.prototype.arc=function(a,b,c,e,g,h){var f=Array.prototype.slice.call(arguments);this.curves.push(new THREE.ArcCurve(a,b,c,e,g,h));this.actions.push({action:THREE.PathActions.ARC,args:f})};THREE.Path.prototype.getSpacedPoints=function(a){a||(a=40);for(var b=[],c=0;c<a;c++)b.push(this.getPoint(c/a));return b};
THREE.Path.prototype.getPoints=function(a,b){var a=a||12,c=[],e,g,h,f,k,l,m,n,o,t,u,v,y;e=0;for(g=this.actions.length;e<g;e++)switch(h=this.actions[e],f=h.action,h=h.args,f){case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(h[0],h[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:k=h[2];l=h[3];o=h[0];t=h[1];c.length>0?(f=c[c.length-1],u=f.x,v=f.y):(f=this.actions[e-1].args,u=f[f.length-2],v=f[f.length-1]);for(f=1;f<=a;f++)y=f/a,h=THREE.Shape.Utils.b2(y,u,o,k),y=THREE.Shape.Utils.b2(y,v,t,
l),c.push(new THREE.Vector2(h,y));break;case THREE.PathActions.BEZIER_CURVE_TO:k=h[4];l=h[5];o=h[0];t=h[1];m=h[2];n=h[3];c.length>0?(f=c[c.length-1],u=f.x,v=f.y):(f=this.actions[e-1].args,u=f[f.length-2],v=f[f.length-1]);for(f=1;f<=a;f++)y=f/a,h=THREE.Shape.Utils.b3(y,u,o,m,k),y=THREE.Shape.Utils.b3(y,v,t,n,l),c.push(new THREE.Vector2(h,y));break;case THREE.PathActions.CSPLINE_THRU:f=this.actions[e-1].args;f=[new THREE.Vector2(f[f.length-2],f[f.length-1])];y=a*h[0].length;f=f.concat(h[0]);h=new THREE.SplineCurve(f);
for(f=1;f<=y;f++)c.push(h.getPointAt(f/y));break;case THREE.PathActions.ARC:f=this.actions[e-1].args;k=h[0];l=h[1];m=h[2];o=h[3];y=h[4];t=!!h[5];n=f[f.length-2];u=f[f.length-1];f.length==0&&(n=u=0);v=y-o;var p=a*2;for(f=1;f<=p;f++)y=f/p,t||(y=1-y),y=o+y*v,h=n+k+m*Math.cos(y),y=u+l+m*Math.sin(y),c.push(new THREE.Vector2(h,y))}b&&c.push(c[0]);return c};THREE.Path.prototype.transform=function(a,b){this.getBoundingBox();return this.getWrapPoints(this.getPoints(b),a)};
THREE.Path.prototype.nltransform=function(a,b,c,e,g,h){var f=this.getPoints(),k,l,m,n,o;k=0;for(l=f.length;k<l;k++)m=f[k],n=m.x,o=m.y,m.x=a*n+b*o+c,m.y=e*o+g*n+h;return f};
THREE.Path.prototype.debug=function(a){var b=this.getBoundingBox();a||(a=document.createElement("canvas"),a.setAttribute("width",b.maxX+100),a.setAttribute("height",b.maxY+100),document.body.appendChild(a));b=a.getContext("2d");b.fillStyle="white";b.fillRect(0,0,a.width,a.height);b.strokeStyle="black";b.beginPath();var c,e,g,a=0;for(c=this.actions.length;a<c;a++)e=this.actions[a],g=e.args,e=e.action,e!=THREE.PathActions.CSPLINE_THRU&&b[e].apply(b,g);b.stroke();b.closePath();b.strokeStyle="red";e=
this.getPoints();a=0;for(c=e.length;a<c;a++)g=e[a],b.beginPath(),b.arc(g.x,g.y,1.5,0,Math.PI*2,!1),b.stroke(),b.closePath()};
THREE.Path.prototype.toShapes=function(){var a,b,c,e,g=[],h=new THREE.Path;a=0;for(b=this.actions.length;a<b;a++)c=this.actions[a],e=c.args,c=c.action,c==THREE.PathActions.MOVE_TO&&h.actions.length!=0&&(g.push(h),h=new THREE.Path),h[c].apply(h,e);h.actions.length!=0&&g.push(h);if(g.length==0)return[];var f,h=[];if(THREE.Shape.Utils.isClockWise(g[0].getPoints())){a=0;for(b=g.length;a<b;a++)e=g[a],THREE.Shape.Utils.isClockWise(e.getPoints())?(f&&h.push(f),f=new THREE.Shape,f.actions=e.actions,f.curves=
e.curves):f.holes.push(e);h.push(f)}else{f=new THREE.Shape;a=0;for(b=g.length;a<b;a++)e=g[a],THREE.Shape.Utils.isClockWise(e.getPoints())?(f.actions=e.actions,f.curves=e.curves,h.push(f),f=new THREE.Shape):f.holes.push(e)}return h};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=new THREE.Path;THREE.Shape.prototype.constructor=THREE.Path;THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};
THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,e=[];for(b=0;b<c;b++)e[b]=this.holes[b].getTransformedPoints(a,this.bends);return e};THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,e=[];for(b=0;b<c;b++)e[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return e};THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};
THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={removeHoles:function(a,b){var c=a.concat(),e=c.concat(),g,h,f,k,l,m,n,o,t,u,v=[];for(l=0;l<b.length;l++){m=b[l];Array.prototype.push.apply(e,m);h=Number.POSITIVE_INFINITY;for(g=0;g<m.length;g++){t=m[g];u=[];for(o=0;o<c.length;o++)n=c[o],n=t.distanceToSquared(n),u.push(n),n<h&&(h=n,f=g,k=o)}g=k-1>=0?k-1:c.length-1;h=f-1>=0?f-1:m.length-1;var y=[m[f],c[k],c[g]];o=THREE.FontUtils.Triangulate.area(y);var p=[m[f],m[h],c[k]];t=THREE.FontUtils.Triangulate.area(p);u=k;n=f;k+=1;f+=-1;k<
0&&(k+=c.length);k%=c.length;f<0&&(f+=m.length);f%=m.length;g=k-1>=0?k-1:c.length-1;h=f-1>=0?f-1:m.length-1;y=[m[f],c[k],c[g]];y=THREE.FontUtils.Triangulate.area(y);p=[m[f],m[h],c[k]];p=THREE.FontUtils.Triangulate.area(p);o+t>y+p&&(k=u,f=n,k<0&&(k+=c.length),k%=c.length,f<0&&(f+=m.length),f%=m.length,g=k-1>=0?k-1:c.length-1,h=f-1>=0?f-1:m.length-1);o=c.slice(0,k);t=c.slice(k);u=m.slice(f);n=m.slice(0,f);h=[m[f],m[h],c[k]];v.push([m[f],c[k],c[g]]);v.push(h);c=o.concat(u).concat(n).concat(t)}return{shape:c,
isolatedPts:v,allpoints:e}},triangulateShape:function(a,b){var c=THREE.Shape.Utils.removeHoles(a,b),e=c.allpoints,g=c.isolatedPts,c=THREE.FontUtils.Triangulate(c.shape,!1),h,f,k,l,m={};h=0;for(f=e.length;h<f;h++)l=e[h].x+":"+e[h].y,m[l]!==void 0&&console.log("Duplicate point",l),m[l]=h;h=0;for(f=c.length;h<f;h++){k=c[h];for(e=0;e<3;e++)l=k[e].x+":"+k[e].y,l=m[l],l!==void 0&&(k[e]=l)}h=0;for(f=g.length;h<f;h++){k=g[h];for(e=0;e<3;e++)l=k[e].x+":"+k[e].y,l=m[l],l!==void 0&&(k[e]=l)}return c.concat(g)},
isClockWise:function(a){return THREE.FontUtils.Triangulate.area(a)<0},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,e){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,e)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,e,g){return this.b3p0(a,b)+this.b3p1(a,c)+this.b3p2(a,e)+
this.b3p3(a,g)}};THREE.TextPath=function(a,b){THREE.Path.call(this);this.parameters=b||{};this.set(a)};THREE.TextPath.prototype.set=function(a,b){this.text=a;var b=b||this.parameters,c=b.curveSegments!==void 0?b.curveSegments:4,e=b.font!==void 0?b.font:"helvetiker",g=b.weight!==void 0?b.weight:"normal",h=b.style!==void 0?b.style:"normal";THREE.FontUtils.size=b.size!==void 0?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=e;THREE.FontUtils.weight=g;THREE.FontUtils.style=h};
THREE.TextPath.prototype.toShapes=function(){for(var a=THREE.FontUtils.drawText(this.text).paths,b=[],c=0,e=a.length;c<e;c++)Array.prototype.push.apply(b,a[c].toShapes());return b};
THREE.AnimationHandler=function(){var a=[],b={},c={update:function(c){for(var b=0;b<a.length;b++)a[b].update(c)},addToUpdate:function(c){a.indexOf(c)===-1&&a.push(c)},removeFromUpdate:function(c){c=a.indexOf(c);c!==-1&&a.splice(c,1)},add:function(a){b[a.name]!==void 0&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(a.initialized!==!0){for(var c=0;c<a.hierarchy.length;c++){for(var e=0;e<a.hierarchy[c].keys.length;e++){if(a.hierarchy[c].keys[e].time<
0)a.hierarchy[c].keys[e].time=0;if(a.hierarchy[c].keys[e].rot!==void 0&&!(a.hierarchy[c].keys[e].rot instanceof THREE.Quaternion)){var k=a.hierarchy[c].keys[e].rot;a.hierarchy[c].keys[e].rot=new THREE.Quaternion(k[0],k[1],k[2],k[3])}}if(a.hierarchy[c].keys[0].morphTargets!==void 0){k={};for(e=0;e<a.hierarchy[c].keys.length;e++)for(var l=0;l<a.hierarchy[c].keys[e].morphTargets.length;l++){var m=a.hierarchy[c].keys[e].morphTargets[l];k[m]=-1}a.hierarchy[c].usedMorphTargets=k;for(e=0;e<a.hierarchy[c].keys.length;e++){var n=
{};for(m in k){for(l=0;l<a.hierarchy[c].keys[e].morphTargets.length;l++)if(a.hierarchy[c].keys[e].morphTargets[l]===m){n[m]=a.hierarchy[c].keys[e].morphTargetsInfluences[l];break}l===a.hierarchy[c].keys[e].morphTargets.length&&(n[m]=0)}a.hierarchy[c].keys[e].morphTargetsInfluences=n}}for(e=1;e<a.hierarchy[c].keys.length;e++)a.hierarchy[c].keys[e].time===a.hierarchy[c].keys[e-1].time&&(a.hierarchy[c].keys.splice(e,1),e--);for(e=1;e<a.hierarchy[c].keys.length;e++)a.hierarchy[c].keys[e].index=e}e=parseInt(a.length*
a.fps,10);a.JIT={};a.JIT.hierarchy=[];for(c=0;c<a.hierarchy.length;c++)a.JIT.hierarchy.push(Array(e));a.initialized=!0}},get:function(a){if(typeof a==="string")return b[a]?b[a]:(console.log("THREE.AnimationHandler.get: Couldn't find animation "+a),null)},parse:function(a){var c=[];if(a instanceof THREE.SkinnedMesh)for(var b=0;b<a.bones.length;b++)c.push(a.bones[b]);else e(a,c);return c}},e=function(a,c){c.push(a);for(var b=0;b<a.children.length;b++)e(a.children[b],c)};c.LINEAR=0;c.CATMULLROM=1;c.CATMULLROM_FORWARD=
2;return c}();THREE.Animation=function(a,b,c,e){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=!1;this.loop=this.isPaused=!0;this.interpolationType=c!==void 0?c:THREE.AnimationHandler.LINEAR;this.JITCompile=e!==void 0?e:!0;this.points=[];this.target=new THREE.Vector3};
THREE.Animation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=!0;this.loop=a!==void 0?a:!0;this.currentTime=b!==void 0?b:0;var c,e=this.hierarchy.length,g;for(c=0;c<e;c++){g=this.hierarchy[c];if(this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD)g.useQuaternion=!0;g.matrixAutoUpdate=!0;if(g.animationCache===void 0)g.animationCache={},g.animationCache.prevKey={pos:0,rot:0,scl:0},g.animationCache.nextKey={pos:0,rot:0,scl:0},g.animationCache.originalMatrix=g instanceof
THREE.Bone?g.skinMatrix:g.matrix;var h=g.animationCache.prevKey;g=g.animationCache.nextKey;h.pos=this.data.hierarchy[c].keys[0];h.rot=this.data.hierarchy[c].keys[0];h.scl=this.data.hierarchy[c].keys[0];g.pos=this.getNextKeyWith("pos",c,1);g.rot=this.getNextKeyWith("rot",c,1);g.scl=this.getNextKeyWith("scl",c,1)}this.update(0)}this.isPaused=!1;THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=!1;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.hierarchy.length;a++)if(this.hierarchy[a].animationCache!==void 0)this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix=this.hierarchy[a].animationCache.originalMatrix:this.hierarchy[a].matrix=this.hierarchy[a].animationCache.originalMatrix,delete this.hierarchy[a].animationCache};
THREE.Animation.prototype.update=function(a){if(this.isPlaying){var b=["pos","rot","scl"],c,e,g,h,f,k,l,m,n=this.data.JIT.hierarchy,o,t;this.currentTime+=a*this.timeScale;t=this.currentTime;o=this.currentTime%=this.data.length;m=parseInt(Math.min(o*this.data.fps,this.data.length*this.data.fps),10);for(var u=0,v=this.hierarchy.length;u<v;u++)if(a=this.hierarchy[u],l=a.animationCache,this.JITCompile&&n[u][m]!==void 0)a instanceof THREE.Bone?(a.skinMatrix=n[u][m],a.matrixAutoUpdate=!1,a.matrixWorldNeedsUpdate=
!1):(a.matrix=n[u][m],a.matrixAutoUpdate=!1,a.matrixWorldNeedsUpdate=!0);else{if(this.JITCompile)a instanceof THREE.Bone?a.skinMatrix=a.animationCache.originalMatrix:a.matrix=a.animationCache.originalMatrix;for(var y=0;y<3;y++){c=b[y];f=l.prevKey[c];k=l.nextKey[c];if(k.time<=t){if(o<t)if(this.loop){f=this.data.hierarchy[u].keys[0];for(k=this.getNextKeyWith(c,u,1);k.time<o;)f=k,k=this.getNextKeyWith(c,u,k.index+1)}else{this.stop();return}else{do f=k,k=this.getNextKeyWith(c,u,k.index+1);while(k.time<
o)}l.prevKey[c]=f;l.nextKey[c]=k}a.matrixAutoUpdate=!0;a.matrixWorldNeedsUpdate=!0;e=(o-f.time)/(k.time-f.time);g=f[c];h=k[c];if(e<0||e>1)console.log("THREE.Animation.update: Warning! Scale out of bounds:"+e+" on bone "+u),e=e<0?0:1;if(c==="pos")if(c=a.position,this.interpolationType===THREE.AnimationHandler.LINEAR)c.x=g[0]+(h[0]-g[0])*e,c.y=g[1]+(h[1]-g[1])*e,c.z=g[2]+(h[2]-g[2])*e;else{if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD)if(this.points[0]=
this.getPrevKeyWith("pos",u,f.index-1).pos,this.points[1]=g,this.points[2]=h,this.points[3]=this.getNextKeyWith("pos",u,k.index+1).pos,e=e*0.33+0.33,g=this.interpolateCatmullRom(this.points,e),c.x=g[0],c.y=g[1],c.z=g[2],this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD)e=this.interpolateCatmullRom(this.points,e*1.01),this.target.set(e[0],e[1],e[2]),this.target.subSelf(c),this.target.y=0,this.target.normalize(),e=Math.atan2(this.target.x,this.target.z),a.rotation.set(0,e,0)}else if(c===
"rot")THREE.Quaternion.slerp(g,h,a.quaternion,e);else if(c==="scl")c=a.scale,c.x=g[0]+(h[0]-g[0])*e,c.y=g[1]+(h[1]-g[1])*e,c.z=g[2]+(h[2]-g[2])*e}}if(this.JITCompile&&n[0][m]===void 0){this.hierarchy[0].update(void 0,!0);for(u=0;u<this.hierarchy.length;u++)n[u][m]=this.hierarchy[u]instanceof THREE.Bone?this.hierarchy[u].skinMatrix.clone():this.hierarchy[u].matrix.clone()}}};
THREE.Animation.prototype.interpolateCatmullRom=function(a,b){var c=[],e=[],g,h,f,k,l,m;g=(a.length-1)*b;h=Math.floor(g);g-=h;c[0]=h==0?h:h-1;c[1]=h;c[2]=h>a.length-2?h:h+1;c[3]=h>a.length-3?h:h+2;h=a[c[0]];k=a[c[1]];l=a[c[2]];m=a[c[3]];c=g*g;f=g*c;e[0]=this.interpolate(h[0],k[0],l[0],m[0],g,c,f);e[1]=this.interpolate(h[1],k[1],l[1],m[1],g,c,f);e[2]=this.interpolate(h[2],k[2],l[2],m[2],g,c,f);return e};
THREE.Animation.prototype.interpolate=function(a,b,c,e,g,h,f){a=(c-a)*0.5;e=(e-b)*0.5;return(2*(b-c)+a+e)*f+(-3*(b-c)-2*a-e)*h+a*g+b};THREE.Animation.prototype.getNextKeyWith=function(a,b,c){var e=this.data.hierarchy[b].keys;for(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c=c<e.length-1?c:e.length-1:c%=e.length;c<e.length;c++)if(e[c][a]!==void 0)return e[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){for(var e=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c>0?c:0:c>=0?c:c+e.length;c>=0;c--)if(e[c][a]!==void 0)return e[c];return this.data.hierarchy[b].keys[e.length-1]};
THREE.CubeCamera=function(a,b,c,e){this.cameraPX=new THREE.PerspectiveCamera(90,1,a,b);this.cameraNX=new THREE.PerspectiveCamera(90,1,a,b);this.cameraPY=new THREE.PerspectiveCamera(90,1,a,b);this.cameraNY=new THREE.PerspectiveCamera(90,1,a,b);this.cameraPZ=new THREE.PerspectiveCamera(90,1,a,b);this.cameraNZ=new THREE.PerspectiveCamera(90,1,a,b);this.cameraPXTarget=new THREE.Vector3(0,0,0);this.cameraNXTarget=new THREE.Vector3(0,0,0);this.cameraPYTarget=new THREE.Vector3(0,0,0);this.cameraNYTarget=
new THREE.Vector3(0,0,0);this.cameraPZTarget=new THREE.Vector3(0,0,0);this.cameraNZTarget=new THREE.Vector3(0,0,0);this.height=c;this.position=new THREE.Vector3(0,c,0);this.cameraPX.position=this.position;this.cameraNX.position=this.position;this.cameraPY.position=this.position;this.cameraNY.position=this.position;this.cameraPZ.position=this.position;this.cameraNZ.position=this.position;this.cameraPY.up.set(0,0,1);this.cameraPZ.up.set(0,-1,0);this.cameraNZ.up.set(0,-1,0);this.renderTarget=new THREE.WebGLRenderTargetCube(e,
e,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updatePosition=function(a){this.position.x=a.x;this.position.z=a.z;this.cameraPXTarget.add(this.position,new THREE.Vector3(-1,0,0));this.cameraNXTarget.add(this.position,new THREE.Vector3(1,0,0));this.cameraPYTarget.add(this.position,new THREE.Vector3(0,1,0));this.cameraNYTarget.add(this.position,new THREE.Vector3(0,-1,0));this.cameraPZTarget.add(this.position,new THREE.Vector3(0,0,1));this.cameraNZTarget.add(this.position,
new THREE.Vector3(0,0,-1));this.cameraPX.lookAt(this.cameraPXTarget);this.cameraNX.lookAt(this.cameraNXTarget);this.cameraPY.lookAt(this.cameraPYTarget);this.cameraNY.lookAt(this.cameraNYTarget);this.cameraPZ.lookAt(this.cameraPZTarget);this.cameraNZ.lookAt(this.cameraNZTarget)};this.updateCubeMap=function(a,c){var b=this.renderTarget;a.setFaceCulling("back","cw");c.scale.y=-1;c.position.y=2*this.height;c.updateMatrix();b.activeCubeFace=0;a.render(c,this.cameraPX,b);b.activeCubeFace=1;a.render(c,
this.cameraNX,b);c.scale.y=1;c.position.y=0;c.updateMatrix();c.scale.x=-1;c.updateMatrix();b.activeCubeFace=2;a.render(c,this.cameraPY,b);c.scale.x=1;c.updateMatrix();a.setFaceCulling("back","ccw");b.activeCubeFace=3;a.render(c,this.cameraNY,b);c.scale.x=-1;c.updateMatrix();a.setFaceCulling("back","cw");b.activeCubeFace=4;a.render(c,this.cameraPZ,b);b.activeCubeFace=5;a.render(c,this.cameraNZ,b);c.scale.x=1;c.updateMatrix();a.setFaceCulling("back","ccw")}};THREE.FirstPersonCamera=function(){console.warn("DEPRECATED: FirstPersonCamera() is FirstPersonControls().")};
THREE.PathCamera=function(){console.warn("DEPRECATED: PathCamera() is PathControls().")};THREE.FlyCamera=function(){console.warn("DEPRECATED: FlyCamera() is FlyControls().")};THREE.RollCamera=function(){console.warn("DEPRECATED: RollCamera() is RollControls().")};THREE.TrackballCamera=function(){console.warn("DEPRECATED: TrackballCamera() is TrackballControls().")};
THREE.CombinedCamera=function(a,b,c,e,g,h,f){THREE.Camera.call(this);this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,h,f);this.cameraP=new THREE.PerspectiveCamera(c,a/b,e,g);this.toPerspective()};THREE.CombinedCamera.prototype=new THREE.Camera;THREE.CombinedCamera.prototype.constructor=THREE.CoolCamera;THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.projectionMatrix=this.cameraP.projectionMatrix};
THREE.CombinedCamera.prototype.toOrthographic=function(){this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix};THREE.CombinedCamera.prototype.setFov=function(a){this.cameraP.fov=a;this.cameraP.updateProjectionMatrix();this.toPerspective()};THREE.CombinedCamera.prototype.setLens=function(a,b){b||(b=43.25);var c=2*Math.atan(b/(a*2));c*=180/Math.PI;this.setFov(c);return c};
THREE.FirstPersonControls=function(a,b){function c(a,c){return function(){c.apply(a,arguments)}}this.object=a;this.target=new THREE.Vector3(0,0,0);this.domElement=b!==void 0?b:document;this.movementSpeed=1;this.lookSpeed=0.005;this.noFly=!1;this.lookVertical=!0;this.autoForward=!1;this.activeLook=!0;this.heightSpeed=!1;this.heightCoef=1;this.heightMin=0;this.constrainVertical=!1;this.verticalMin=0;this.verticalMax=Math.PI;this.lastUpdate=(new Date).getTime();this.theta=this.phi=this.lon=this.lat=
this.mouseY=this.mouseX=this.autoSpeedFactor=this.tdiff=0;this.mouseDragOn=this.freeze=this.moveRight=this.moveLeft=this.moveBackward=this.moveForward=!1;this.domElement===document?(this.viewHalfX=window.innerWidth/2,this.viewHalfY=window.innerHeight/2):(this.viewHalfX=this.domElement.offsetWidth/2,this.viewHalfY=this.domElement.offsetHeight/2,this.domElement.setAttribute("tabindex",-1));this.onMouseDown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();
if(this.activeLook)switch(a.button){case 0:this.moveForward=!0;break;case 2:this.moveBackward=!0}this.mouseDragOn=!0};this.onMouseUp=function(a){a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=!1;break;case 2:this.moveBackward=!1}this.mouseDragOn=!1};this.onMouseMove=function(a){this.domElement===document?(this.mouseX=a.pageX-this.viewHalfX,this.mouseY=a.pageY-this.viewHalfY):(this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX,this.mouseY=
a.pageY-this.domElement.offsetTop-this.viewHalfY)};this.onKeyDown=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=!0;break;case 37:case 65:this.moveLeft=!0;break;case 40:case 83:this.moveBackward=!0;break;case 39:case 68:this.moveRight=!0;break;case 82:this.moveUp=!0;break;case 70:this.moveDown=!0;break;case 81:this.freeze=!this.freeze}};this.onKeyUp=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=!1;break;case 37:case 65:this.moveLeft=!1;break;case 40:case 83:this.moveBackward=
!1;break;case 39:case 68:this.moveRight=!1;break;case 82:this.moveUp=!1;break;case 70:this.moveDown=!1}};this.update=function(){var a=(new Date).getTime();this.tdiff=(a-this.lastUpdate)/1E3;this.lastUpdate=a;if(!this.freeze){this.autoSpeedFactor=this.heightSpeed?this.tdiff*((this.object.position.y<this.heightMin?this.heightMin:this.object.position.y>this.heightMax?this.heightMax:this.object.position.y)-this.heightMin)*this.heightCoef:0;var c=this.tdiff*this.movementSpeed;(this.moveForward||this.autoForward&&
!this.moveBackward)&&this.object.translateZ(-(c+this.autoSpeedFactor));this.moveBackward&&this.object.translateZ(c);this.moveLeft&&this.object.translateX(-c);this.moveRight&&this.object.translateX(c);this.moveUp&&this.object.translateY(c);this.moveDown&&this.object.translateY(-c);c=this.tdiff*this.lookSpeed;this.activeLook||(c=0);this.lon+=this.mouseX*c;this.lookVertical&&(this.lat-=this.mouseY*c);this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*
Math.PI/180;var a=this.target,b=this.object.position;a.x=b.x+100*Math.sin(this.phi)*Math.cos(this.theta);a.y=b.y+100*Math.cos(this.phi);a.z=b.z+100*Math.sin(this.phi)*Math.sin(this.theta)}a=1;this.constrainVertical&&(a=Math.PI/(this.verticalMax-this.verticalMin));this.lon+=this.mouseX*c;this.lookVertical&&(this.lat-=this.mouseY*c*a);this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;if(this.constrainVertical)this.phi=(this.phi-0)*(this.verticalMax-
this.verticalMin)/(Math.PI-0)+this.verticalMin;a=this.target;b=this.object.position;a.x=b.x+100*Math.sin(this.phi)*Math.cos(this.theta);a.y=b.y+100*Math.cos(this.phi);a.z=b.z+100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(a)};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},!1);this.domElement.addEventListener("mousemove",c(this,this.onMouseMove),!1);this.domElement.addEventListener("mousedown",c(this,this.onMouseDown),!1);this.domElement.addEventListener("mouseup",
c(this,this.onMouseUp),!1);this.domElement.addEventListener("keydown",c(this,this.onKeyDown),!1);this.domElement.addEventListener("keyup",c(this,this.onKeyUp),!1)};
THREE.PathControls=function(a,b){function c(a){if((a*=2)<1)return 0.5*a*a;return-0.5*(--a*(a-2)-1)}function e(a,c){return function(){c.apply(a,arguments)}}function g(a,c,b,e){var f={name:b,fps:0.6,length:e,hierarchy:[]},h,g=c.getControlPointsArray(),k=c.getLength(),p=g.length,z=0;h=p-1;c={parent:-1,keys:[]};c.keys[0]={time:0,pos:g[0],rot:[0,0,0,1],scl:[1,1,1]};c.keys[h]={time:e,pos:g[h],rot:[0,0,0,1],scl:[1,1,1]};for(h=1;h<p-1;h++)z=e*k.chunks[h]/k.total,c.keys[h]={time:z,pos:g[h]};f.hierarchy[0]=
c;THREE.AnimationHandler.add(f);return new THREE.Animation(a,b,THREE.AnimationHandler.CATMULLROM_FORWARD,!1)}function h(a,c){var b,e,f=new THREE.Geometry;for(b=0;b<a.points.length*c;b++)e=b/(a.points.length*c),e=a.getPoint(e),f.vertices[b]=new THREE.Vertex(new THREE.Vector3(e.x,e.y,e.z));return f}this.object=a;this.domElement=b!==void 0?b:document;this.id="PathControls"+THREE.PathControlsIdCounter++;this.duration=1E4;this.waypoints=[];this.useConstantSpeed=!0;this.resamplingCoef=50;this.debugPath=
new THREE.Object3D;this.debugDummy=new THREE.Object3D;this.animationParent=new THREE.Object3D;this.lookSpeed=0.005;this.lookHorizontal=this.lookVertical=!0;this.verticalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.horizontalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.target=new THREE.Object3D;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=0;this.domElement===document?(this.viewHalfX=window.innerWidth/2,this.viewHalfY=window.innerHeight/2):(this.viewHalfX=
this.domElement.offsetWidth/2,this.viewHalfY=this.domElement.offsetHeight/2,this.domElement.setAttribute("tabindex",-1));var f=Math.PI*2,k=Math.PI/180;this.update=function(){var a,b;this.lookHorizontal&&(this.lon+=this.mouseX*this.lookSpeed);this.lookVertical&&(this.lat-=this.mouseY*this.lookSpeed);this.lon=Math.max(0,Math.min(360,this.lon));this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*k;this.theta=this.lon*k;a=this.phi%f;this.phi=a>=0?a:a+f;a=this.verticalAngleMap.srcRange;
b=this.verticalAngleMap.dstRange;var e=b[1]-b[0];this.phi=c(((this.phi-a[0])*(b[1]-b[0])/(a[1]-a[0])+b[0]-b[0])/e)*e+b[0];a=this.horizontalAngleMap.srcRange;b=this.horizontalAngleMap.dstRange;e=b[1]-b[0];this.theta=c(((this.theta-a[0])*(b[1]-b[0])/(a[1]-a[0])+b[0]-b[0])/e)*e+b[0];a=this.target.position;a.x=100*Math.sin(this.phi)*Math.cos(this.theta);a.y=100*Math.cos(this.phi);a.z=100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(this.target.position)};this.onMouseMove=function(a){this.domElement===
document?(this.mouseX=a.pageX-this.viewHalfX,this.mouseY=a.pageY-this.viewHalfY):(this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX,this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY)};this.init=function(){this.spline=new THREE.Spline;this.spline.initFromArray(this.waypoints);this.useConstantSpeed&&this.spline.reparametrizeByArcLength(this.resamplingCoef);if(this.createDebugDummy){var a=new THREE.MeshLambertMaterial({color:30719}),c=new THREE.MeshLambertMaterial({color:65280}),
b=new THREE.CubeGeometry(10,10,20),f=new THREE.CubeGeometry(2,2,10);this.animationParent=new THREE.Mesh(b,a);a=new THREE.Mesh(f,c);a.position.set(0,10,0);this.animation=g(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.object);this.animationParent.add(this.target);this.animationParent.add(a)}else this.animation=g(this.animationParent,this.spline,this.id,this.duration),this.animationParent.add(this.target),this.animationParent.add(this.object);if(this.createDebugPath){var a=
this.debugPath,c=this.spline,b=h(c,10),f=h(c,10),k=new THREE.LineBasicMaterial({color:16711680,linewidth:3});lineObj=new THREE.Line(b,k);particleObj=new THREE.ParticleSystem(f,new THREE.ParticleBasicMaterial({color:16755200,size:3}));lineObj.scale.set(1,1,1);a.add(lineObj);particleObj.scale.set(1,1,1);a.add(particleObj);f=new THREE.SphereGeometry(1,16,8);k=new THREE.MeshBasicMaterial({color:65280});for(i=0;i<c.points.length;i++)b=new THREE.Mesh(f,k),b.position.copy(c.points[i]),a.add(b)}this.domElement.addEventListener("mousemove",
e(this,this.onMouseMove),!1)}};THREE.PathControlsIdCounter=0;
THREE.FlyControls=function(a,b){function c(a,c){return function(){c.apply(a,arguments)}}this.object=a;this.domElement=b!==void 0?b:document;b&&this.domElement.setAttribute("tabindex",-1);this.movementSpeed=1;this.rollSpeed=0.005;this.autoForward=this.dragToLook=!1;this.object.useQuaternion=!0;this.tmpQuaternion=new THREE.Quaternion;this.mouseStatus=0;this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0};this.moveVector=new THREE.Vector3(0,
0,0);this.rotationVector=new THREE.Vector3(0,0,0);this.lastUpdate=-1;this.tdiff=0;this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.keydown=function(a){if(!a.altKey){switch(a.keyCode){case 16:this.movementSpeedMultiplier=0.1;break;case 87:this.moveState.forward=1;break;case 83:this.moveState.back=1;break;case 65:this.moveState.left=1;break;case 68:this.moveState.right=1;break;case 82:this.moveState.up=1;break;case 70:this.moveState.down=1;break;case 38:this.moveState.pitchUp=
1;break;case 40:this.moveState.pitchDown=1;break;case 37:this.moveState.yawLeft=1;break;case 39:this.moveState.yawRight=1;break;case 81:this.moveState.rollLeft=1;break;case 69:this.moveState.rollRight=1}this.updateMovementVector();this.updateRotationVector()}};this.keyup=function(a){switch(a.keyCode){case 16:this.movementSpeedMultiplier=1;break;case 87:this.moveState.forward=0;break;case 83:this.moveState.back=0;break;case 65:this.moveState.left=0;break;case 68:this.moveState.right=0;break;case 82:this.moveState.up=
0;break;case 70:this.moveState.down=0;break;case 38:this.moveState.pitchUp=0;break;case 40:this.moveState.pitchDown=0;break;case 37:this.moveState.yawLeft=0;break;case 39:this.moveState.yawRight=0;break;case 81:this.moveState.rollLeft=0;break;case 69:this.moveState.rollRight=0}this.updateMovementVector();this.updateRotationVector()};this.mousedown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.dragToLook)this.mouseStatus++;else switch(a.button){case 0:this.object.moveForward=
!0;break;case 2:this.object.moveBackward=!0}};this.mousemove=function(a){if(!this.dragToLook||this.mouseStatus>0){var c=this.getContainerDimensions(),b=c.size[0]/2,f=c.size[1]/2;this.moveState.yawLeft=-(a.pageX-c.offset[0]-b)/b;this.moveState.pitchDown=(a.pageY-c.offset[1]-f)/f;this.updateRotationVector()}};this.mouseup=function(a){a.preventDefault();a.stopPropagation();if(this.dragToLook)this.mouseStatus--,this.moveState.yawLeft=this.moveState.pitchDown=0;else switch(a.button){case 0:this.moveForward=
!1;break;case 2:this.moveBackward=!1}this.updateRotationVector()};this.update=function(){var a=(new Date).getTime();if(this.lastUpdate==-1)this.lastUpdate=a;this.tdiff=(a-this.lastUpdate)/1E3;this.lastUpdate=a;var a=this.tdiff*this.movementSpeed,c=this.tdiff*this.rollSpeed;this.object.translateX(this.moveVector.x*a);this.object.translateY(this.moveVector.y*a);this.object.translateZ(this.moveVector.z*a);this.tmpQuaternion.set(this.rotationVector.x*c,this.rotationVector.y*c,this.rotationVector.z*c,
1).normalize();this.object.quaternion.multiplySelf(this.tmpQuaternion);this.object.matrix.setPosition(this.object.position);this.object.matrix.setRotationFromQuaternion(this.object.quaternion);this.object.matrixWorldNeedsUpdate=!0};this.updateMovementVector=function(){var a=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;this.moveVector.x=-this.moveState.left+this.moveState.right;this.moveVector.y=-this.moveState.down+this.moveState.up;this.moveVector.z=-a+this.moveState.back};
this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp;this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft;this.rotationVector.z=-this.moveState.rollRight+this.moveState.rollLeft};this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,
0]}};this.domElement.addEventListener("mousemove",c(this,this.mousemove),!1);this.domElement.addEventListener("mousedown",c(this,this.mousedown),!1);this.domElement.addEventListener("mouseup",c(this,this.mouseup),!1);this.domElement.addEventListener("keydown",c(this,this.keydown),!1);this.domElement.addEventListener("keyup",c(this,this.keyup),!1);this.updateMovementVector();this.updateRotationVector()};
THREE.RollControls=function(a,b){this.object=a;this.domElement=b!==void 0?b:document;this.mouseLook=!0;this.autoForward=!1;this.rollSpeed=this.movementSpeed=this.lookSpeed=1;this.constrainVertical=[-0.9,0.9];this.object.matrixAutoUpdate=!1;this.forward=new THREE.Vector3(0,0,1);this.roll=0;this.lastUpdate=-1;this.delta=0;var c=new THREE.Vector3,e=new THREE.Vector3,g=new THREE.Vector3,h=new THREE.Matrix4,f=!1,k=1,l=0,m=0,n=0,o=0,t=0,u=window.innerWidth/2,v=window.innerHeight/2;this.update=function(){var a=
(new Date).getTime();if(this.lastUpdate==-1)this.lastUpdate=a;this.delta=(a-this.lastUpdate)/1E3;this.lastUpdate=a;this.mouseLook&&(a=this.delta*this.lookSpeed,this.rotateHorizontally(a*o),this.rotateVertically(a*t));a=this.delta*this.movementSpeed;this.object.translateZ(-a*(l>0||this.autoForward&&!(l<0)?1:l));this.object.translateX(a*m);this.object.translateY(a*n);f&&(this.roll+=this.rollSpeed*this.delta*k);if(this.forward.y>this.constrainVertical[1])this.forward.y=this.constrainVertical[1],this.forward.normalize();
else if(this.forward.y<this.constrainVertical[0])this.forward.y=this.constrainVertical[0],this.forward.normalize();g.copy(this.forward);e.set(0,1,0);c.cross(e,g).normalize();e.cross(g,c).normalize();this.object.matrix.n11=c.x;this.object.matrix.n12=e.x;this.object.matrix.n13=g.x;this.object.matrix.n21=c.y;this.object.matrix.n22=e.y;this.object.matrix.n23=g.y;this.object.matrix.n31=c.z;this.object.matrix.n32=e.z;this.object.matrix.n33=g.z;h.identity();h.n11=Math.cos(this.roll);h.n12=-Math.sin(this.roll);
h.n21=Math.sin(this.roll);h.n22=Math.cos(this.roll);this.object.matrix.multiplySelf(h);this.object.matrixWorldNeedsUpdate=!0;this.object.matrix.n14=this.object.position.x;this.object.matrix.n24=this.object.position.y;this.object.matrix.n34=this.object.position.z};this.translateX=function(a){this.object.position.x+=this.object.matrix.n11*a;this.object.position.y+=this.object.matrix.n21*a;this.object.position.z+=this.object.matrix.n31*a};this.translateY=function(a){this.object.position.x+=this.object.matrix.n12*
a;this.object.position.y+=this.object.matrix.n22*a;this.object.position.z+=this.object.matrix.n32*a};this.translateZ=function(a){this.object.position.x-=this.object.matrix.n13*a;this.object.position.y-=this.object.matrix.n23*a;this.object.position.z-=this.object.matrix.n33*a};this.rotateHorizontally=function(a){c.set(this.object.matrix.n11,this.object.matrix.n21,this.object.matrix.n31);c.multiplyScalar(a);this.forward.subSelf(c);this.forward.normalize()};this.rotateVertically=function(a){e.set(this.object.matrix.n12,
this.object.matrix.n22,this.object.matrix.n32);e.multiplyScalar(a);this.forward.addSelf(e);this.forward.normalize()};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},!1);this.domElement.addEventListener("mousemove",function(a){o=(a.clientX-u)/window.innerWidth;t=(a.clientY-v)/window.innerHeight},!1);this.domElement.addEventListener("mousedown",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:l=1;break;case 2:l=-1}},!1);this.domElement.addEventListener("mouseup",
function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:l=0;break;case 2:l=0}},!1);this.domElement.addEventListener("keydown",function(a){switch(a.keyCode){case 38:case 87:l=1;break;case 37:case 65:m=-1;break;case 40:case 83:l=-1;break;case 39:case 68:m=1;break;case 81:f=!0;k=1;break;case 69:f=!0;k=-1;break;case 82:n=1;break;case 70:n=-1}},!1);this.domElement.addEventListener("keyup",function(a){switch(a.keyCode){case 38:case 87:l=0;break;case 37:case 65:m=0;break;case 40:case 83:l=
0;break;case 39:case 68:m=0;break;case 81:f=!1;break;case 69:f=!1;break;case 82:n=0;break;case 70:n=0}},!1)};
THREE.TrackballControls=function(a,b){function c(a,c){return function(){c.apply(a,arguments)}}this.object=a;this.domElement=b!==void 0?b:document;this.screen={width:window.innerWidth,height:window.innerHeight,offsetLeft:0,offsetTop:0};this.radius=(this.screen.width+this.screen.height)/4;this.rotateSpeed=1;this.zoomSpeed=1.2;this.panSpeed=0.3;this.staticMoving=this.noPan=this.noZoom=!1;this.dynamicDampingFactor=0.2;this.minDistance=0;this.maxDistance=Infinity;this.keys=[65,83,68];this.target=new THREE.Vector3(0,
0,0);var e=!1,g=this.STATE.NONE,h=new THREE.Vector3,f=new THREE.Vector3,k=new THREE.Vector3,l=new THREE.Vector2,m=new THREE.Vector2,n=new THREE.Vector2,o=new THREE.Vector2;this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.getMouseOnScreen=function(a,c){return new THREE.Vector2((a-this.screen.offsetLeft)/this.radius*0.5,(c-this.screen.offsetTop)/this.radius*0.5)};this.getMouseProjectionOnBall=function(a,c){var b=new THREE.Vector3((a-this.screen.width*0.5-this.screen.offsetLeft)/
this.radius,(this.screen.height*0.5+this.screen.offsetTop-c)/this.radius,0),e=b.length();e>1?b.normalize():b.z=Math.sqrt(1-e*e);h.copy(this.object.position).subSelf(this.target);e=this.object.up.clone().setLength(b.y);e.addSelf(this.object.up.clone().crossSelf(h).setLength(b.x));e.addSelf(h.setLength(b.z));return e};this.rotateCamera=function(){var a=Math.acos(f.dot(k)/f.length()/k.length());if(a){var c=(new THREE.Vector3).cross(f,k).normalize(),b=new THREE.Quaternion;a*=this.rotateSpeed;b.setFromAxisAngle(c,
-a);b.multiplyVector3(h);b.multiplyVector3(this.object.up);b.multiplyVector3(k);this.staticMoving?f=k:(b.setFromAxisAngle(c,a*(this.dynamicDampingFactor-1)),b.multiplyVector3(f))}};this.zoomCamera=function(){var a=1+(m.y-l.y)*this.zoomSpeed;a!==1&&a>0&&(h.multiplyScalar(a),this.staticMoving?l=m:l.y+=(m.y-l.y)*this.dynamicDampingFactor)};this.panCamera=function(){var a=o.clone().subSelf(n);if(a.lengthSq()){a.multiplyScalar(h.length()*this.panSpeed);var c=h.clone().crossSelf(this.object.up).setLength(a.x);
c.addSelf(this.object.up.clone().setLength(a.y));this.object.position.addSelf(c);this.target.addSelf(c);this.staticMoving?n=o:n.addSelf(a.sub(o,n).multiplyScalar(this.dynamicDampingFactor))}};this.checkDistances=function(){if(!this.noZoom||!this.noPan)this.object.position.lengthSq()>this.maxDistance*this.maxDistance&&this.object.position.setLength(this.maxDistance),h.lengthSq()<this.minDistance*this.minDistance&&this.object.position.add(this.target,h.setLength(this.minDistance))};this.update=function(){h.copy(this.object.position).subSelf(this.target);
this.rotateCamera();this.noZoom||this.zoomCamera();this.noPan||this.panCamera();this.object.position.add(this.target,h);this.checkDistances();this.object.lookAt(this.target)};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},!1);this.domElement.addEventListener("mousemove",c(this,function(a){e&&(f=k=this.getMouseProjectionOnBall(a.clientX,a.clientY),l=m=this.getMouseOnScreen(a.clientX,a.clientY),n=o=this.getMouseOnScreen(a.clientX,a.clientY),e=!1);g!==this.STATE.NONE&&
(g===this.STATE.ROTATE?k=this.getMouseProjectionOnBall(a.clientX,a.clientY):g===this.STATE.ZOOM&&!this.noZoom?m=this.getMouseOnScreen(a.clientX,a.clientY):g===this.STATE.PAN&&!this.noPan&&(o=this.getMouseOnScreen(a.clientX,a.clientY)))}),!1);this.domElement.addEventListener("mousedown",c(this,function(a){a.preventDefault();a.stopPropagation();if(g===this.STATE.NONE)g=a.button,g===this.STATE.ROTATE?f=k=this.getMouseProjectionOnBall(a.clientX,a.clientY):g===this.STATE.ZOOM&&!this.noZoom?l=m=this.getMouseOnScreen(a.clientX,
a.clientY):this.noPan||(n=o=this.getMouseOnScreen(a.clientX,a.clientY))}),!1);this.domElement.addEventListener("mouseup",c(this,function(a){a.preventDefault();a.stopPropagation();g=this.STATE.NONE}),!1);window.addEventListener("keydown",c(this,function(a){if(g===this.STATE.NONE){if(a.keyCode===this.keys[this.STATE.ROTATE])g=this.STATE.ROTATE;else if(a.keyCode===this.keys[this.STATE.ZOOM]&&!this.noZoom)g=this.STATE.ZOOM;else if(a.keyCode===this.keys[this.STATE.PAN]&&!this.noPan)g=this.STATE.PAN;g!==
this.STATE.NONE&&(e=!0)}}),!1);window.addEventListener("keyup",c(this,function(){if(g!==this.STATE.NONE)g=this.STATE.NONE}),!1)};THREE.TrackballControls.prototype.STATE={NONE:-1,ROTATE:0,ZOOM:1,PAN:2};
THREE.CubeGeometry=function(a,b,c,e,g,h,f,k){function l(a,c,b,f,k,l,o,n){var u,t,v=e||1,J=g||1,C=k/2,F=l/2,K=m.vertices.length;if(a=="x"&&c=="y"||a=="y"&&c=="x")u="z";else if(a=="x"&&c=="z"||a=="z"&&c=="x")u="y",J=h||1;else if(a=="z"&&c=="y"||a=="y"&&c=="z")u="x",v=h||1;var M=v+1,N=J+1;k/=v;var L=l/J;for(t=0;t<N;t++)for(l=0;l<M;l++){var O=new THREE.Vector3;O[a]=(l*k-C)*b;O[c]=(t*L-F)*f;O[u]=o;m.vertices.push(new THREE.Vertex(O))}for(t=0;t<J;t++)for(l=0;l<v;l++)m.faces.push(new THREE.Face4(l+M*t+K,
l+M*(t+1)+K,l+1+M*(t+1)+K,l+1+M*t+K,null,null,n)),m.faceVertexUvs[0].push([new THREE.UV(l/v,t/J),new THREE.UV(l/v,(t+1)/J),new THREE.UV((l+1)/v,(t+1)/J),new THREE.UV((l+1)/v,t/J)])}THREE.Geometry.call(this);var m=this,n=a/2,o=b/2,t=c/2;if(f!==void 0)if(f instanceof Array)this.materials=f;else{this.materials=[];for(var u=0;u<6;u++)this.materials.push([f])}else this.materials=[];this.sides={px:!0,nx:!0,py:!0,ny:!0,pz:!0,nz:!0};if(k!=void 0)for(var v in k)this.sides[v]!=void 0&&(this.sides[v]=k[v]);
this.sides.px&&l("z","y",-1,-1,c,b,n,this.materials[0]);this.sides.nx&&l("z","y",1,-1,c,b,-n,this.materials[1]);this.sides.py&&l("x","z",1,1,a,c,o,this.materials[2]);this.sides.ny&&l("x","z",1,-1,a,c,-o,this.materials[3]);this.sides.pz&&l("x","y",1,-1,a,b,t,this.materials[4]);this.sides.nz&&l("x","y",-1,-1,a,b,-t,this.materials[5]);this.mergeVertices();this.computeCentroids();this.computeFaceNormals()};THREE.CubeGeometry.prototype=new THREE.Geometry;THREE.CubeGeometry.prototype.constructor=THREE.CubeGeometry;
THREE.CylinderGeometry=function(a,b,c,e,g,h){THREE.Geometry.call(this);var a=a!=null?a:20,b=b!=null?b:20,c=c||100,f=c/2,e=e||8,g=g||1,k,l,m=[],n=[];for(l=0;l<=g;l++){var o=[],t=[],u=l/g,v=u*(b-a)+a;for(k=0;k<=e;k++){var y=k/e;this.vertices.push(new THREE.Vertex(new THREE.Vector3(v*Math.sin(y*Math.PI*2),-u*c+f,v*Math.cos(y*Math.PI*2))));o.push(this.vertices.length-1);t.push(new THREE.UV(y,u))}m.push(o);n.push(t)}for(l=0;l<g;l++)for(k=0;k<e;k++){var c=m[l][k],o=m[l+1][k],t=m[l+1][k+1],u=m[l][k+1],v=
this.vertices[c].position.clone().setY(0).normalize(),y=this.vertices[o].position.clone().setY(0).normalize(),p=this.vertices[t].position.clone().setY(0).normalize(),z=this.vertices[u].position.clone().setY(0).normalize(),w=n[l][k].clone(),x=n[l+1][k].clone(),A=n[l+1][k+1].clone(),D=n[l][k+1].clone();this.faces.push(new THREE.Face4(c,o,t,u,[v,y,p,z]));this.faceVertexUvs[0].push([w,x,A,D])}if(!h&&a>0){this.vertices.push(new THREE.Vertex(new THREE.Vector3(0,f,0)));for(k=0;k<e;k++)c=m[0][k],o=m[0][k+
1],t=this.vertices.length-1,v=new THREE.Vector3(0,1,0),y=new THREE.Vector3(0,1,0),p=new THREE.Vector3(0,1,0),w=n[0][k].clone(),x=n[0][k+1].clone(),A=new THREE.UV(x.u,0),this.faces.push(new THREE.Face3(c,o,t,[v,y,p])),this.faceVertexUvs[0].push([w,x,A])}if(!h&&b>0){this.vertices.push(new THREE.Vertex(new THREE.Vector3(0,-f,0)));for(k=0;k<e;k++)c=m[l][k+1],o=m[l][k],t=this.vertices.length-1,v=new THREE.Vector3(0,-1,0),y=new THREE.Vector3(0,-1,0),p=new THREE.Vector3(0,-1,0),w=n[l][k+1].clone(),x=n[l][k].clone(),
A=new THREE.UV(x.u,1),this.faces.push(new THREE.Face3(c,o,t,[v,y,p])),this.faceVertexUvs[0].push([w,x,A])}this.computeCentroids();this.computeFaceNormals()};THREE.CylinderGeometry.prototype=new THREE.Geometry;THREE.CylinderGeometry.prototype.constructor=THREE.CylinderGeometry;
THREE.ExtrudeGeometry=function(a,b){if(typeof a!="undefined"){THREE.Geometry.call(this);var a=a instanceof Array?a:[a],c,e=a.length,g;this.shapebb=a[e-1].getBoundingBox();for(c=0;c<e;c++)g=a[c],this.addShape(g,b);this.computeCentroids();this.computeFaceNormals()}};THREE.ExtrudeGeometry.prototype=new THREE.Geometry;THREE.ExtrudeGeometry.prototype.constructor=THREE.ExtrudeGeometry;
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,c,b){c||console.log("die");return c.clone().multiplyScalar(b).addSelf(a)}function e(a,c,b){var e=THREE.ExtrudeGeometry.__v1,f=THREE.ExtrudeGeometry.__v2,h=THREE.ExtrudeGeometry.__v3,g=THREE.ExtrudeGeometry.__v4,k=THREE.ExtrudeGeometry.__v5,l=THREE.ExtrudeGeometry.__v6;e.set(a.x-c.x,a.y-c.y);f.set(a.x-b.x,a.y-b.y);e=e.normalize();f=f.normalize();h.set(-e.y,e.x);g.set(f.y,-f.x);k.copy(a).addSelf(h);l.copy(a).addSelf(g);if(k.equals(l))return g.clone();
k.copy(c).addSelf(h);l.copy(b).addSelf(g);h=e.dot(g);g=l.subSelf(k).dot(g);h==0&&(console.log("Either infinite or no solutions!"),g==0?console.log("Its finite solutions."):console.log("Too bad, no solutions."));g/=h;if(g<0)return c=Math.atan2(c.y-a.y,c.x-a.x),a=Math.atan2(b.y-a.y,b.x-a.x),c>a&&(a+=Math.PI*2),anglec=(c+a)/2,new THREE.Vector2(-Math.cos(anglec),-Math.sin(anglec));return e.multiplyScalar(g).addSelf(k).subSelf(a).clone()}function g(a){for(C=a.length;--C>=0;){T=C;R=C-1;R<0&&(R=a.length-
1);for(var c=0,b=u+n*2,c=0;c<b;c++){var e=O*c,f=O*(c+1),h=Q+T+e,g=Q+T+f,m=h,e=Q+R+e,f=Q+R+f,o=g;m+=J;e+=J;f+=J;o+=J;H.faces.push(new THREE.Face4(m,e,f,o,null,null,A));A&&(m=c/b,e=(c+1)/b,f=k+l*2,h=(H.vertices[h].position.z+l)/f,g=(H.vertices[g].position.z+l)/f,H.faceVertexUvs[0].push([new THREE.UV(h,m),new THREE.UV(g,m),new THREE.UV(g,e),new THREE.UV(h,e)]))}}}function h(a,c,b){H.vertices.push(new THREE.Vertex(new THREE.Vector3(a,c,b)))}function f(a,c,b){a+=J;c+=J;b+=J;H.faces.push(new THREE.Face3(a,
c,b,null,null,x));if(x){var e=D.maxY,f=D.maxX,h=H.vertices[c].position.x,c=H.vertices[c].position.y,g=H.vertices[b].position.x,b=H.vertices[b].position.y;H.faceVertexUvs[0].push([new THREE.UV(H.vertices[a].position.x/f,H.vertices[a].position.y/e),new THREE.UV(h/f,c/e),new THREE.UV(g/f,b/e)])}}var k=b.amount!==void 0?b.amount:100,l=b.bevelThickness!==void 0?b.bevelThickness:6,m=b.bevelSize!==void 0?b.bevelSize:l-2,n=b.bevelSegments!==void 0?b.bevelSegments:3,o=b.bevelEnabled!==void 0?b.bevelEnabled:
!0,t=b.curveSegments!==void 0?b.curveSegments:12,u=b.steps!==void 0?b.steps:1,v=b.bendPath,y=b.extrudePath,p,z=!1,w=b.useSpacedPoints!==void 0?b.useSpacedPoints:!1,x=b.material,A=b.extrudeMaterial,D=this.shapebb;if(y)p=y.getPoints(t),u=p.length,z=!0,o=!1;o||(m=l=n=0);var B,E,I,H=this,J=this.vertices.length;v&&a.addWrapPath(v);t=w?a.extractAllSpacedPoints(t):a.extractAllPoints(t);v=t.shape;t=t.holes;if(y=!THREE.Shape.Utils.isClockWise(v)){v=v.reverse();E=0;for(I=t.length;E<I;E++)B=t[E],THREE.Shape.Utils.isClockWise(B)&&
(t[E]=B.reverse());y=!1}y=THREE.Shape.Utils.triangulateShape(v,t);w=v;E=0;for(I=t.length;E<I;E++)B=t[E],v=v.concat(B);var C,F,K,M,N,L,O=v.length,G=y.length,S=[];C=0;F=w.length;T=F-1;for(R=C+1;C<F;C++,T++,R++)T==F&&(T=0),R==F&&(R=0),S[C]=e(w[C],w[T],w[R]);var P=[],U,V=S.concat();E=0;for(I=t.length;E<I;E++){B=t[E];U=[];C=0;F=B.length;T=F-1;for(R=C+1;C<F;C++,T++,R++)T==F&&(T=0),R==F&&(R=0),U[C]=e(B[C],B[T],B[R]);P.push(U);V=V.concat(U)}for(K=0;K<n;K++){M=K/n;N=l*(1-M);M=m*Math.sin(M*Math.PI/2);C=0;for(F=
w.length;C<F;C++)L=c(w[C],S[C],M),h(L.x,L.y,-N);E=0;for(I=t.length;E<I;E++){B=t[E];U=P[E];C=0;for(F=B.length;C<F;C++)L=c(B[C],U[C],M),h(L.x,L.y,-N)}}M=m;for(C=0;C<O;C++)L=o?c(v[C],V[C],M):v[C],z?h(L.x,L.y+p[0].y,p[0].x):h(L.x,L.y,0);for(K=1;K<=u;K++)for(C=0;C<O;C++)L=o?c(v[C],V[C],M):v[C],z?h(L.x,L.y+p[K-1].y,p[K-1].x):h(L.x,L.y,k/u*K);for(K=n-1;K>=0;K--){M=K/n;N=l*(1-M);M=m*Math.sin(M*Math.PI/2);C=0;for(F=w.length;C<F;C++)L=c(w[C],S[C],M),h(L.x,L.y,k+N);E=0;for(I=t.length;E<I;E++){B=t[E];U=P[E];
C=0;for(F=B.length;C<F;C++)L=c(B[C],U[C],M),z?h(L.x,L.y+p[u-1].y,p[u-1].x+N):h(L.x,L.y,k+N)}}if(o){o=O*0;for(C=0;C<G;C++)m=y[C],f(m[2]+o,m[1]+o,m[0]+o);o=O*(u+n*2);for(C=0;C<G;C++)m=y[C],f(m[0]+o,m[1]+o,m[2]+o)}else{for(C=0;C<G;C++)m=y[C],f(m[2],m[1],m[0]);for(C=0;C<G;C++)m=y[C],f(m[0]+O*u,m[1]+O*u,m[2]+O*u)}var T,R,Q=0;g(w);Q+=w.length;E=0;for(I=t.length;E<I;E++)B=t[E],g(B),Q+=B.length};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;
THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;THREE.ExtrudeGeometry.__v5=new THREE.Vector2;THREE.ExtrudeGeometry.__v6=new THREE.Vector2;
THREE.IcosahedronGeometry=function(a){function b(a,c,b){var e=Math.sqrt(a*a+c*c+b*b);return g.vertices.push(new THREE.Vertex(new THREE.Vector3(a/e,c/e,b/e)))-1}function c(a,c,b,e){e.faces.push(new THREE.Face3(a,c,b))}function e(a,c){var e=g.vertices[a].position,f=g.vertices[c].position;return b((e.x+f.x)/2,(e.y+f.y)/2,(e.z+f.z)/2)}var g=this,h=new THREE.Geometry;this.subdivisions=a||0;THREE.Geometry.call(this);a=(1+Math.sqrt(5))/2;b(-1,a,0);b(1,a,0);b(-1,-a,0);b(1,-a,0);b(0,-1,a);b(0,1,a);b(0,-1,
-a);b(0,1,-a);b(a,0,-1);b(a,0,1);b(-a,0,-1);b(-a,0,1);c(0,11,5,h);c(0,5,1,h);c(0,1,7,h);c(0,7,10,h);c(0,10,11,h);c(1,5,9,h);c(5,11,4,h);c(11,10,2,h);c(10,7,6,h);c(7,1,8,h);c(3,9,4,h);c(3,4,2,h);c(3,2,6,h);c(3,6,8,h);c(3,8,9,h);c(4,9,5,h);c(2,4,11,h);c(6,2,10,h);c(8,6,7,h);c(9,8,1,h);for(var f=0;f<this.subdivisions;f++){var a=new THREE.Geometry,k;for(k in h.faces){var l=e(h.faces[k].a,h.faces[k].b),m=e(h.faces[k].b,h.faces[k].c),n=e(h.faces[k].c,h.faces[k].a);c(h.faces[k].a,l,n,a);c(h.faces[k].b,m,
l,a);c(h.faces[k].c,n,m,a);c(l,m,n,a)}h.faces=a.faces}g.faces=h.faces;this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.IcosahedronGeometry.prototype=new THREE.Geometry;THREE.IcosahedronGeometry.prototype.constructor=THREE.IcosahedronGeometry;
THREE.LatheGeometry=function(a,b,c){THREE.Geometry.call(this);this.steps=b||12;this.angle=c||2*Math.PI;for(var b=this.angle/this.steps,c=[],e=[],g=[],h=[],f=(new THREE.Matrix4).setRotationZ(b),k=0;k<a.length;k++)this.vertices.push(new THREE.Vertex(a[k])),c[k]=a[k].clone(),e[k]=this.vertices.length-1;for(var l=0;l<=this.angle+0.001;l+=b){for(k=0;k<c.length;k++)l<this.angle?(c[k]=f.multiplyVector3(c[k].clone()),this.vertices.push(new THREE.Vertex(c[k])),g[k]=this.vertices.length-1):g=h;l==0&&(h=e);
for(k=0;k<e.length-1;k++)this.faces.push(new THREE.Face4(g[k],g[k+1],e[k+1],e[k])),this.faceVertexUvs[0].push([new THREE.UV(1-l/this.angle,k/a.length),new THREE.UV(1-l/this.angle,(k+1)/a.length),new THREE.UV(1-(l-b)/this.angle,(k+1)/a.length),new THREE.UV(1-(l-b)/this.angle,k/a.length)]);e=g;g=[]}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=new THREE.Geometry;THREE.LatheGeometry.prototype.constructor=THREE.LatheGeometry;
THREE.OctahedronGeometry=function(a,b){function c(c){var b=c.clone().normalize(),b=new THREE.Vertex(b.clone().multiplyScalar(a));b.index=f.vertices.push(b)-1;b.uv=new THREE.UV(Math.atan2(c.z,-c.x)/2/Math.PI+0.5,Math.atan2(-c.y,Math.sqrt(c.x*c.x+c.z*c.z))/Math.PI+0.5);return b}function e(a,c,b,k){k<1?(k=new THREE.Face3(a.index,c.index,b.index,[a.position,c.position,b.position]),k.centroid.addSelf(a.position).addSelf(c.position).addSelf(b.position).divideScalar(3),k.normal=k.centroid.clone().normalize(),
f.faces.push(k),k=Math.atan2(k.centroid.z,-k.centroid.x),f.faceVertexUvs[0].push([h(a.uv,a.position,k),h(c.uv,c.position,k),h(b.uv,b.position,k)])):(k-=1,e(a,g(a,c),g(a,b),k),e(g(a,c),c,g(c,b),k),e(g(a,b),g(c,b),b,k),e(g(a,c),g(c,b),g(a,b),k))}function g(a,b){k[a.index]||(k[a.index]=[]);k[b.index]||(k[b.index]=[]);var e=k[a.index][b.index];e===void 0&&(k[a.index][b.index]=k[b.index][a.index]=e=c((new THREE.Vector3).add(a.position,b.position).divideScalar(2)));return e}function h(a,c,b){b<0&&a.u===
1&&(a=new THREE.UV(a.u-1,a.v));c.x===0&&c.z===0&&(a=new THREE.UV(b/2/Math.PI+0.5,a.v));return a}THREE.Geometry.call(this);var b=isFinite(b)?b:3,f=this;c(new THREE.Vector3(1,0,0));c(new THREE.Vector3(-1,0,0));c(new THREE.Vector3(0,1,0));c(new THREE.Vector3(0,-1,0));c(new THREE.Vector3(0,0,1));c(new THREE.Vector3(0,0,-1));var k=[],l=this.vertices;e(l[0],l[2],l[4],b);e(l[0],l[4],l[3],b);e(l[0],l[3],l[5],b);e(l[0],l[5],l[2],b);e(l[1],l[2],l[5],b);e(l[1],l[5],l[3],b);e(l[1],l[3],l[4],b);e(l[1],l[4],l[2],
b);this.boundingSphere={radius:a}};THREE.OctahedronGeometry.prototype=new THREE.Geometry;THREE.OctahedronGeometry.prototype.constructor=THREE.OctahedronGeometry;
THREE.PlaneGeometry=function(a,b,c,e){THREE.Geometry.call(this);var g,h=a/2,f=b/2,c=c||1,e=e||1,k=c+1,l=e+1;a/=c;var m=b/e;for(g=0;g<l;g++)for(b=0;b<k;b++)this.vertices.push(new THREE.Vertex(new THREE.Vector3(b*a-h,-(g*m-f),0)));for(g=0;g<e;g++)for(b=0;b<c;b++)this.faces.push(new THREE.Face4(b+k*g,b+k*(g+1),b+1+k*(g+1),b+1+k*g)),this.faceVertexUvs[0].push([new THREE.UV(b/c,g/e),new THREE.UV(b/c,(g+1)/e),new THREE.UV((b+1)/c,(g+1)/e),new THREE.UV((b+1)/c,g/e)]);this.computeCentroids();this.computeFaceNormals()};
THREE.PlaneGeometry.prototype=new THREE.Geometry;THREE.PlaneGeometry.prototype.constructor=THREE.PlaneGeometry;
THREE.SphereGeometry=function(a,b,c){THREE.Geometry.call(this);for(var a=a||50,e,g=Math.PI,h=Math.max(3,b||8),f=Math.max(2,c||6),b=[],c=0;c<f+1;c++){e=c/f;var k=a*Math.cos(e*g),l=a*Math.sin(e*g),m=[],n=0;for(e=0;e<h;e++){var o=2*e/h,t=l*Math.sin(o*g),o=l*Math.cos(o*g);(c==0||c==f)&&e>0||(n=this.vertices.push(new THREE.Vertex(new THREE.Vector3(o,k,t)))-1);m.push(n)}b.push(m)}for(var u,v,y,g=b.length,c=0;c<g;c++)if(h=b[c].length,c>0)for(e=0;e<h;e++){m=e==h-1;f=b[c][m?0:e+1];k=b[c][m?h-1:e];l=b[c-1][m?
h-1:e];m=b[c-1][m?0:e+1];t=c/(g-1);u=(c-1)/(g-1);v=(e+1)/h;var o=e/h,n=new THREE.UV(1-v,t),t=new THREE.UV(1-o,t),o=new THREE.UV(1-o,u),p=new THREE.UV(1-v,u);c<b.length-1&&(u=this.vertices[f].position.clone(),v=this.vertices[k].position.clone(),y=this.vertices[l].position.clone(),u.normalize(),v.normalize(),y.normalize(),this.faces.push(new THREE.Face3(f,k,l,[new THREE.Vector3(u.x,u.y,u.z),new THREE.Vector3(v.x,v.y,v.z),new THREE.Vector3(y.x,y.y,y.z)])),this.faceVertexUvs[0].push([n,t,o]));c>1&&(u=
this.vertices[f].position.clone(),v=this.vertices[l].position.clone(),y=this.vertices[m].position.clone(),u.normalize(),v.normalize(),y.normalize(),this.faces.push(new THREE.Face3(f,l,m,[new THREE.Vector3(u.x,u.y,u.z),new THREE.Vector3(v.x,v.y,v.z),new THREE.Vector3(y.x,y.y,y.z)])),this.faceVertexUvs[0].push([n,o,p]))}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals();this.boundingSphere={radius:a}};THREE.SphereGeometry.prototype=new THREE.Geometry;
THREE.SphereGeometry.prototype.constructor=THREE.SphereGeometry;
THREE.TextGeometry=function(a,b){var c=(new THREE.TextPath(a,b)).toShapes();b.amount=b.height!==void 0?b.height:50;if(b.bevelThickness===void 0)b.bevelThickness=10;if(b.bevelSize===void 0)b.bevelSize=8;if(b.bevelEnabled===void 0)b.bevelEnabled=!1;if(b.bend){var e=c[c.length-1].getBoundingBox().maxX;b.bendPath=new THREE.QuadraticBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(e/2,120),new THREE.Vector2(e,0))}THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=new THREE.ExtrudeGeometry;
THREE.TextGeometry.prototype.constructor=THREE.TextGeometry;
THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},getTextShapes:function(a,b){return(new TextPath(a,b)).toShapes()},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){for(var b=
this.getFace(),c=this.size/b.resolution,e=0,g=String(a).split(""),h=g.length,f=[],a=0;a<h;a++){var k=new THREE.Path,k=this.extractGlyphPoints(g[a],b,c,e,k);e+=k.offset;f.push(k.path)}return{paths:f,offset:e/2}},extractGlyphPoints:function(a,b,c,e,g){var h=[],f,k,l,m,n,o,t,u,v,y,p=b.glyphs[a]||b.glyphs[ctxt.options.fallbackCharacter];if(p){if(p.o){b=p._cachedOutline||(p._cachedOutline=p.o.split(" "));l=b.length;for(a=0;a<l;)switch(k=b[a++],k){case "m":k=b[a++]*c+e;m=b[a++]*c;h.push(new THREE.Vector2(k,
m));g.moveTo(k,m);break;case "l":k=b[a++]*c+e;m=b[a++]*c;h.push(new THREE.Vector2(k,m));g.lineTo(k,m);break;case "q":k=b[a++]*c+e;m=b[a++]*c;t=b[a++]*c+e;u=b[a++]*c;g.quadraticCurveTo(t,u,k,m);if(f=h[h.length-1]){n=f.x;o=f.y;f=1;for(divisions=this.divisions;f<=divisions;f++){var z=f/divisions,w=THREE.Shape.Utils.b2(z,n,t,k),z=THREE.Shape.Utils.b2(z,o,u,m);h.push(new THREE.Vector2(w,z))}}break;case "b":if(k=b[a++]*c+e,m=b[a++]*c,t=b[a++]*c+e,u=b[a++]*-c,v=b[a++]*c+e,y=b[a++]*-c,g.bezierCurveTo(k,m,
t,u,v,y),f=h[h.length-1]){n=f.x;o=f.y;f=1;for(divisions=this.divisions;f<=divisions;f++)z=f/divisions,w=THREE.Shape.Utils.b3(z,n,t,v,k),z=THREE.Shape.Utils.b3(z,o,u,y,m),h.push(new THREE.Vector2(w,z))}}}return{offset:p.ha*c,points:h,path:g}}}};
(function(a){var b=function(a){for(var b=a.length,g=0,h=b-1,f=0;f<b;h=f++)g+=a[h].x*a[f].y-a[f].x*a[h].y;return g*0.5};a.Triangulate=function(a,e){var g=a.length;if(g<3)return null;var h=[],f=[],k=[],l,m,n;if(b(a)>0)for(m=0;m<g;m++)f[m]=m;else for(m=0;m<g;m++)f[m]=g-1-m;var o=2*g;for(m=g-1;g>2;){if(o--<=0){console.log("Warning, unable to triangulate polygon!");if(e)return k;return h}l=m;g<=l&&(l=0);m=l+1;g<=m&&(m=0);n=m+1;g<=n&&(n=0);var t;a:{t=a;var u=l,v=m,y=n,p=g,z=f,w=void 0,x=void 0,A=void 0,
D=void 0,B=void 0,E=void 0,I=void 0,H=void 0,J=void 0,x=t[z[u]].x,A=t[z[u]].y,D=t[z[v]].x,B=t[z[v]].y,E=t[z[y]].x,I=t[z[y]].y;if(1.0E-10>(D-x)*(I-A)-(B-A)*(E-x))t=!1;else{for(w=0;w<p;w++)if(!(w==u||w==v||w==y)){var H=t[z[w]].x,J=t[z[w]].y,C=void 0,F=void 0,K=void 0,M=void 0,N=void 0,L=void 0,O=void 0,G=void 0,S=void 0,P=void 0,U=void 0,V=void 0,C=K=N=void 0,C=E-D,F=I-B,K=x-E,M=A-I,N=D-x,L=B-A,O=H-x,G=J-A,S=H-D,P=J-B,U=H-E,V=J-I,C=C*P-F*S,N=N*G-L*O,K=K*V-M*U;if(C>=0&&K>=0&&N>=0){t=!1;break a}}t=!0}}if(t){h.push([a[f[l]],
a[f[m]],a[f[n]]]);k.push([f[l],f[m],f[n]]);l=m;for(n=m+1;n<g;l++,n++)f[l]=f[n];g--;o=2*g}}if(e)return k;return h};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};
THREE.TorusGeometry=function(a,b,c,e,g){THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.segmentsR=c||8;this.segmentsT=e||6;this.arc=g||Math.PI*2;g=new THREE.Vector3;a=[];b=[];for(c=0;c<=this.segmentsR;c++)for(e=0;e<=this.segmentsT;e++){var h=e/this.segmentsT*this.arc,f=c/this.segmentsR*Math.PI*2;g.x=this.radius*Math.cos(h);g.y=this.radius*Math.sin(h);var k=new THREE.Vector3;k.x=(this.radius+this.tube*Math.cos(f))*Math.cos(h);k.y=(this.radius+this.tube*Math.cos(f))*Math.sin(h);k.z=
this.tube*Math.sin(f);this.vertices.push(new THREE.Vertex(k));a.push(new THREE.UV(e/this.segmentsT,1-c/this.segmentsR));b.push(k.clone().subSelf(g).normalize())}for(c=1;c<=this.segmentsR;c++)for(e=1;e<=this.segmentsT;e++){var g=(this.segmentsT+1)*c+e-1,h=(this.segmentsT+1)*(c-1)+e-1,f=(this.segmentsT+1)*(c-1)+e,k=(this.segmentsT+1)*c+e,l=new THREE.Face4(g,h,f,k,[b[g],b[h],b[f],b[k]]);l.normal.addSelf(b[g]);l.normal.addSelf(b[h]);l.normal.addSelf(b[f]);l.normal.addSelf(b[k]);l.normal.normalize();this.faces.push(l);
this.faceVertexUvs[0].push([a[g].clone(),a[h].clone(),a[f].clone(),a[k].clone()])}this.computeCentroids()};THREE.TorusGeometry.prototype=new THREE.Geometry;THREE.TorusGeometry.prototype.constructor=THREE.TorusGeometry;
THREE.TorusKnotGeometry=function(a,b,c,e,g,h,f){function k(a,c,b,e,f,h){c=b/e*a;b=Math.cos(c);return new THREE.Vector3(f*(2+b)*0.5*Math.cos(a),f*(2+b)*Math.sin(a)*0.5,h*f*Math.sin(c)*0.5)}THREE.Geometry.call(this);this.radius=a||200;this.tube=b||40;this.segmentsR=c||64;this.segmentsT=e||8;this.p=g||2;this.q=h||3;this.heightScale=f||1;this.grid=Array(this.segmentsR);c=new THREE.Vector3;e=new THREE.Vector3;h=new THREE.Vector3;for(a=0;a<this.segmentsR;++a){this.grid[a]=Array(this.segmentsT);for(b=0;b<
this.segmentsT;++b){var l=a/this.segmentsR*2*this.p*Math.PI,f=b/this.segmentsT*2*Math.PI,g=k(l,f,this.q,this.p,this.radius,this.heightScale),l=k(l+0.01,f,this.q,this.p,this.radius,this.heightScale);c.x=l.x-g.x;c.y=l.y-g.y;c.z=l.z-g.z;e.x=l.x+g.x;e.y=l.y+g.y;e.z=l.z+g.z;h.cross(c,e);e.cross(h,c);h.normalize();e.normalize();l=-this.tube*Math.cos(f);f=this.tube*Math.sin(f);g.x+=l*e.x+f*h.x;g.y+=l*e.y+f*h.y;g.z+=l*e.z+f*h.z;this.grid[a][b]=this.vertices.push(new THREE.Vertex(new THREE.Vector3(g.x,g.y,
g.z)))-1}}for(a=0;a<this.segmentsR;++a)for(b=0;b<this.segmentsT;++b){var e=(a+1)%this.segmentsR,h=(b+1)%this.segmentsT,g=this.grid[a][b],c=this.grid[e][b],e=this.grid[e][h],h=this.grid[a][h],f=new THREE.UV(a/this.segmentsR,b/this.segmentsT),l=new THREE.UV((a+1)/this.segmentsR,b/this.segmentsT),m=new THREE.UV((a+1)/this.segmentsR,(b+1)/this.segmentsT),n=new THREE.UV(a/this.segmentsR,(b+1)/this.segmentsT);this.faces.push(new THREE.Face4(g,c,e,h));this.faceVertexUvs[0].push([f,l,m,n])}this.computeCentroids();
this.computeFaceNormals();this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=new THREE.Geometry;THREE.TorusKnotGeometry.prototype.constructor=THREE.TorusKnotGeometry;THREE.SubdivisionModifier=function(a){this.subdivisions=a===void 0?1:a;this.useOldVertexColors=!1;this.supportUVs=!0};THREE.SubdivisionModifier.prototype.constructor=THREE.SubdivisionModifier;THREE.SubdivisionModifier.prototype.modify=function(a){for(var b=this.subdivisions;b-- >0;)this.smooth(a)};
THREE.SubdivisionModifier.prototype.smooth=function(a){function b(a,c,b,e,k,l){var m=new THREE.Face4(a,c,b,e,null,k.color,k.material);if(f.useOldVertexColors){m.vertexColors=[];for(var n,p,u,t=0;t<4;t++){u=l[t];n=new THREE.Color;n.setRGB(0,0,0);for(var v=0;v<u.length;v++)p=k.vertexColors[u[v]-1],n.r+=p.r,n.g+=p.g,n.b+=p.b;n.r/=u.length;n.g/=u.length;n.b/=u.length;m.vertexColors[t]=n}}g.push(m);(!f.supportUVs||o.length!=0)&&h.push([o[a],o[c],o[b],o[e]])}function c(a,c){return Math.min(a,c)+"_"+Math.max(a,
c)}var e=[],g=[],h=[],f=this,k=a.vertices,e=a.faces,l=k.concat(),m=[],n={},o=[],t,u,v,y,p,z=a.faceVertexUvs[0];t=0;for(u=z.length;t<u;t++){v=0;for(y=z[t].length;v<y;v++)p=e[t]["abcd".charAt(v)],o[p]||(o[p]=z[t][v])}var w;t=0;for(u=e.length;t<u;t++)if(p=e[t],m.push(p.centroid),l.push(new THREE.Vertex(p.centroid)),f.supportUVs&&o.length!=0){w=new THREE.UV;if(p instanceof THREE.Face3)w.u=o[p.a].u+o[p.b].u+o[p.c].u,w.v=o[p.a].v+o[p.b].v+o[p.c].v,w.u/=3,w.v/=3;else if(p instanceof THREE.Face4)w.u=o[p.a].u+
o[p.b].u+o[p.c].u+o[p.d].u,w.v=o[p.a].v+o[p.b].v+o[p.c].v+o[p.d].v,w.u/=4,w.v/=4;o.push(w)}y=function(a){function b(a,c,e){a[c]===void 0&&(a[c]=[]);a[c].push(e)}var e,f,h,g,k={};e=0;for(f=a.faces.length;e<f;e++)h=a.faces[e],h instanceof THREE.Face3?(g=c(h.a,h.b),b(k,g,e),g=c(h.b,h.c),b(k,g,e),g=c(h.c,h.a),b(k,g,e)):h instanceof THREE.Face4&&(g=c(h.a,h.b),b(k,g,e),g=c(h.b,h.c),b(k,g,e),g=c(h.c,h.d),b(k,g,e),g=c(h.d,h.a),b(k,g,e));return k}(a);var x,A,D=0,z=k.length,B;for(t in y)if(p=y[t],w=p[0],x=
p[1],B=t.split("_"),u=B[0],B=B[1],A=new THREE.Vector3,p.length!=2?(A.addSelf(k[u].position),A.addSelf(k[B].position),A.multiplyScalar(0.5)):(A.addSelf(m[w]),A.addSelf(m[x]),A.addSelf(k[u].position),A.addSelf(k[B].position),A.multiplyScalar(0.25)),n[t]=z+e.length+D,l.push(new THREE.Vertex(A)),D++,f.supportUVs&&o.length!=0)w=new THREE.UV,w.u=o[u].u+o[B].u,w.v=o[u].v+o[B].v,w.u/=2,w.v/=2,o.push(w);t=0;for(u=m.length;t<u;t++)p=e[t],w=z+t,p instanceof THREE.Face3?(x=c(p.a,p.b),B=c(p.b,p.c),D=c(p.c,p.a),
b(w,n[x],p.b,n[B],p,["123","12","2","23"]),b(w,n[B],p.c,n[D],p,["123","23","3","31"]),b(w,n[D],p.a,n[x],p,["123","31","1","12"])):p instanceof THREE.Face4?(x=c(p.a,p.b),B=c(p.b,p.c),D=c(p.c,p.d),A=c(p.d,p.a),b(w,n[x],p.b,n[B],p,["1234","12","2","23"]),b(w,n[B],p.c,n[D],p,["1234","23","3","34"]),b(w,n[D],p.d,n[A],p,["1234","34","4","41"]),b(w,n[A],p.a,n[x],p,["1234","41","1","12"])):console.log("face should be a face!",p);var e=l,E={},I={},l=function(a,c){E[a]===void 0&&(E[a]=[]);E[a].push(c)},n=function(a,
c){I[a]===void 0&&(I[a]={});I[a][c]=null};for(t in y)p=y[t],B=t.split("_"),u=B[0],B=B[1],l(u,[u,B]),l(B,[u,B]),w=p[0],x=p[1],n(u,w),x?n(u,x):n(u,w),n(B,w),x?n(B,x):n(B,w);l=new THREE.Vector3;n=new THREE.Vector3;t=0;for(u=k.length;t<u;t++)if(E[t]!==void 0){l.set(0,0,0);n.set(0,0,0);y=new THREE.Vector3(0,0,0);z=0;for(v in I[t])l.addSelf(m[v]),z++;l.divideScalar(z);z=E[t].length;for(v=0;v<z;v++)p=E[t][v],p=k[p[0]].position.clone().addSelf(k[p[1]].position).divideScalar(2),n.addSelf(p);n.divideScalar(z);
y.addSelf(k[t].position);y.multiplyScalar(z-3);y.addSelf(l);y.addSelf(n.multiplyScalar(2));y.divideScalar(z);e[t].position=y}a.vertices=e;a.faces=g;a.faceVertexUvs[0]=h;delete a.__tmpVertices;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals()};THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ";b+=a.total?(100*a.loaded/a.total).toFixed(0)+"%":(a.loaded/
1E3).toFixed(2)+" KB";this.statusDomElement.innerHTML=b},extractUrlbase:function(a){a=a.split("/");a.pop();return a.length<1?"":a.join("/")+"/"},init_materials:function(a,b,c){a.materials=[];for(var e=0;e<b.length;++e)a.materials[e]=[THREE.Loader.prototype.createMaterial(b[e],c)]},hasNormals:function(a){var b,c,e=a.materials.length;for(c=0;c<e;c++)if(b=a.materials[c][0],b instanceof THREE.ShaderMaterial)return!0;return!1},createMaterial:function(a,b){function c(a){a=Math.log(a)/Math.LN2;return Math.floor(a)==
a}function e(a,b){var e=new Image;e.onload=function(){if(!c(this.width)||!c(this.height)){var b=Math.pow(2,Math.round(Math.log(this.width)/Math.LN2)),e=Math.pow(2,Math.round(Math.log(this.height)/Math.LN2));a.image.width=b;a.image.height=e;a.image.getContext("2d").drawImage(this,0,0,b,e)}else a.image=this;a.needsUpdate=!0};e.src=b}function g(a,c,f,h,g,k){var l=document.createElement("canvas");a[c]=new THREE.Texture(l);a[c].sourceFile=f;if(h){a[c].repeat.set(h[0],h[1]);if(h[0]!=1)a[c].wrapS=THREE.RepeatWrapping;
if(h[1]!=1)a[c].wrapT=THREE.RepeatWrapping}g&&a[c].offset.set(g[0],g[1]);if(k){h={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(h[k[0]]!==void 0)a[c].wrapS=h[k[0]];if(h[k[1]]!==void 0)a[c].wrapT=h[k[1]]}e(a[c],b+"/"+f)}function h(a){return(a[0]*255<<16)+(a[1]*255<<8)+a[2]*255}var f,k,l;k="MeshLambertMaterial";f={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,wireframe:a.wireframe};a.shading&&(a.shading=="Phong"?k="MeshPhongMaterial":a.shading=="Basic"&&(k="MeshBasicMaterial"));
if(a.blending)if(a.blending=="Additive")f.blending=THREE.AdditiveBlending;else if(a.blending=="Subtractive")f.blending=THREE.SubtractiveBlending;else if(a.blending=="Multiply")f.blending=THREE.MultiplyBlending;if(a.transparent!==void 0||a.opacity<1)f.transparent=a.transparent;if(a.depthTest!==void 0)f.depthTest=a.depthTest;if(a.vertexColors!==void 0)if(a.vertexColors=="face")f.vertexColors=THREE.FaceColors;else if(a.vertexColors)f.vertexColors=THREE.VertexColors;if(a.colorDiffuse)f.color=h(a.colorDiffuse);
else if(a.DbgColor)f.color=a.DbgColor;if(a.colorSpecular)f.specular=h(a.colorSpecular);if(a.colorAmbient)f.ambient=h(a.colorAmbient);if(a.transparency)f.opacity=a.transparency;if(a.specularCoef)f.shininess=a.specularCoef;a.mapDiffuse&&b&&g(f,"map",a.mapDiffuse,a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap);a.mapLight&&b&&g(f,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap);a.mapNormal&&b&&g(f,"normalMap",a.mapNormal,a.mapNormalRepeat,a.mapNormalOffset,a.mapNormalWrap);
a.mapSpecular&&b&&g(f,"specularMap",a.mapSpecular,a.mapSpecularRepeat,a.mapSpecularOffset,a.mapSpecularWrap);if(a.mapNormal){var m=THREE.ShaderUtils.lib.normal,n=THREE.UniformsUtils.clone(m.uniforms),o=f.color;k=f.specular;l=f.ambient;var t=f.shininess;n.tNormal.texture=f.normalMap;if(a.mapNormalFactor)n.uNormalScale.value=a.mapNormalFactor;if(f.map)n.tDiffuse.texture=f.map,n.enableDiffuse.value=!0;if(f.specularMap)n.tSpecular.texture=f.specularMap,n.enableSpecular.value=!0;if(f.lightMap)n.tAO.texture=
f.lightMap,n.enableAO.value=!0;n.uDiffuseColor.value.setHex(o);n.uSpecularColor.value.setHex(k);n.uAmbientColor.value.setHex(l);n.uShininess.value=t;if(f.opacity)n.uOpacity.value=f.opacity;f=new THREE.ShaderMaterial({fragmentShader:m.fragmentShader,vertexShader:m.vertexShader,uniforms:n,lights:!0,fog:!0})}else f=new THREE[k](f);return f}};THREE.BinaryLoader=function(a){THREE.Loader.call(this,a)};THREE.BinaryLoader.prototype=new THREE.Loader;THREE.BinaryLoader.prototype.constructor=THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr=THREE.Loader.prototype;
THREE.BinaryLoader.prototype.load=function(a){var b=a.model,c=a.callback,e=a.texture_path?a.texture_path:THREE.Loader.prototype.extractUrlbase(b),g=a.bin_path?a.bin_path:THREE.Loader.prototype.extractUrlbase(b),a=(new Date).getTime(),b=new Worker(b),h=this.showProgress?THREE.Loader.prototype.updateProgress:null;b.onmessage=function(a){THREE.BinaryLoader.prototype.loadAjaxBuffers(a.data.buffers,a.data.materials,c,g,e,h)};b.onerror=function(a){alert("worker.onerror: "+a.message+"\n"+a.data);a.preventDefault()};
b.postMessage(a)};
THREE.BinaryLoader.prototype.loadAjaxBuffers=function(a,b,c,e,g,h){var f=new XMLHttpRequest,k=e+"/"+a,l=0;f.onreadystatechange=function(){f.readyState==4?f.status==200||f.status==0?THREE.BinaryLoader.prototype.createBinModel(f.responseText,c,g,b):alert("Couldn't load ["+k+"] ["+f.status+"]"):f.readyState==3?h&&(l==0&&(l=f.getResponseHeader("Content-Length")),h({total:l,loaded:f.responseText.length})):f.readyState==2&&(l=f.getResponseHeader("Content-Length"))};f.open("GET",k,!0);f.overrideMimeType("text/plain; charset=x-user-defined");
f.setRequestHeader("Content-Type","text/plain");f.send(null)};
THREE.BinaryLoader.prototype.createBinModel=function(a,b,c,e){var g=function(c){function b(a,c){var e=n(a,c),f=n(a,c+1),g=n(a,c+2),h=n(a,c+3),k=(h<<1&255|g>>7)-127;e|=(g&127)<<16|f<<8;if(e==0&&k==-127)return 0;return(1-2*(h>>7))*(1+e*Math.pow(2,-23))*Math.pow(2,k)}function g(a,c){var b=n(a,c),e=n(a,c+1),f=n(a,c+2);return(n(a,c+3)<<24)+(f<<16)+(e<<8)+b}function l(a,c){var b=n(a,c);return(n(a,c+1)<<8)+b}function m(a,c){var b=n(a,c);return b>127?b-256:b}function n(a,c){return a.charCodeAt(c)&255}function o(c){var b,
e,f;b=g(a,c);e=g(a,c+B);f=g(a,c+E);c=l(a,c+I);z.faces.push(new THREE.Face3(b,e,f,null,null,z.materials[c]))}function t(c){var b,e,f,h,m,n;b=g(a,c);e=g(a,c+B);f=g(a,c+E);h=l(a,c+I);m=g(a,c+H);n=g(a,c+J);c=g(a,c+C);h=z.materials[h];var o=A[n*3],p=A[n*3+1];n=A[n*3+2];var t=A[c*3],ia=A[c*3+1],c=A[c*3+2];z.faces.push(new THREE.Face3(b,e,f,[new THREE.Vector3(A[m*3],A[m*3+1],A[m*3+2]),new THREE.Vector3(o,p,n),new THREE.Vector3(t,ia,c)],null,h))}function u(c){var b,e,f,h;b=g(a,c);e=g(a,c+F);f=g(a,c+K);h=
g(a,c+M);c=l(a,c+N);z.faces.push(new THREE.Face4(b,e,f,h,null,null,z.materials[c]))}function v(c){var b,e,f,h,m,n,o,p;b=g(a,c);e=g(a,c+F);f=g(a,c+K);h=g(a,c+M);m=l(a,c+N);n=g(a,c+L);o=g(a,c+O);p=g(a,c+G);c=g(a,c+S);m=z.materials[m];var t=A[o*3],ia=A[o*3+1];o=A[o*3+2];var la=A[p*3],ma=A[p*3+1];p=A[p*3+2];var u=A[c*3],v=A[c*3+1],c=A[c*3+2];z.faces.push(new THREE.Face4(b,e,f,h,[new THREE.Vector3(A[n*3],A[n*3+1],A[n*3+2]),new THREE.Vector3(t,ia,o),new THREE.Vector3(la,ma,p),new THREE.Vector3(u,v,c)],
null,m))}function y(c){var b,e,f,h;b=g(a,c);e=g(a,c+P);f=g(a,c+U);c=D[b*2];h=D[b*2+1];b=D[e*2];var l=z.faceVertexUvs[0];e=D[e*2+1];var m=D[f*2];f=D[f*2+1];var n=[];n.push(new THREE.UV(c,h));n.push(new THREE.UV(b,e));n.push(new THREE.UV(m,f));l.push(n)}function p(c){var b,e,f,h,l,m;b=g(a,c);e=g(a,c+V);f=g(a,c+T);h=g(a,c+R);c=D[b*2];l=D[b*2+1];b=D[e*2];m=D[e*2+1];e=D[f*2];var n=z.faceVertexUvs[0];f=D[f*2+1];var o=D[h*2];h=D[h*2+1];var p=[];p.push(new THREE.UV(c,l));p.push(new THREE.UV(b,m));p.push(new THREE.UV(e,
f));p.push(new THREE.UV(o,h));n.push(p)}var z=this,w=0,x,A=[],D=[],B,E,I,H,J,C,F,K,M,N,L,O,G,S,P,U,V,T,R,Q,Z,W,$,X,Y;THREE.Geometry.call(this);THREE.Loader.prototype.init_materials(z,e,c);x={signature:a.substr(w,8),header_bytes:n(a,w+8),vertex_coordinate_bytes:n(a,w+9),normal_coordinate_bytes:n(a,w+10),uv_coordinate_bytes:n(a,w+11),vertex_index_bytes:n(a,w+12),normal_index_bytes:n(a,w+13),uv_index_bytes:n(a,w+14),material_index_bytes:n(a,w+15),nvertices:g(a,w+16),nnormals:g(a,w+16+4),nuvs:g(a,w+16+
8),ntri_flat:g(a,w+16+12),ntri_smooth:g(a,w+16+16),ntri_flat_uv:g(a,w+16+20),ntri_smooth_uv:g(a,w+16+24),nquad_flat:g(a,w+16+28),nquad_smooth:g(a,w+16+32),nquad_flat_uv:g(a,w+16+36),nquad_smooth_uv:g(a,w+16+40)};w+=x.header_bytes;B=x.vertex_index_bytes;E=x.vertex_index_bytes*2;I=x.vertex_index_bytes*3;H=x.vertex_index_bytes*3+x.material_index_bytes;J=x.vertex_index_bytes*3+x.material_index_bytes+x.normal_index_bytes;C=x.vertex_index_bytes*3+x.material_index_bytes+x.normal_index_bytes*2;F=x.vertex_index_bytes;
K=x.vertex_index_bytes*2;M=x.vertex_index_bytes*3;N=x.vertex_index_bytes*4;L=x.vertex_index_bytes*4+x.material_index_bytes;O=x.vertex_index_bytes*4+x.material_index_bytes+x.normal_index_bytes;G=x.vertex_index_bytes*4+x.material_index_bytes+x.normal_index_bytes*2;S=x.vertex_index_bytes*4+x.material_index_bytes+x.normal_index_bytes*3;P=x.uv_index_bytes;U=x.uv_index_bytes*2;V=x.uv_index_bytes;T=x.uv_index_bytes*2;R=x.uv_index_bytes*3;c=x.vertex_index_bytes*3+x.material_index_bytes;Y=x.vertex_index_bytes*
4+x.material_index_bytes;Q=x.ntri_flat*c;Z=x.ntri_smooth*(c+x.normal_index_bytes*3);W=x.ntri_flat_uv*(c+x.uv_index_bytes*3);$=x.ntri_smooth_uv*(c+x.normal_index_bytes*3+x.uv_index_bytes*3);X=x.nquad_flat*Y;c=x.nquad_smooth*(Y+x.normal_index_bytes*4);Y=x.nquad_flat_uv*(Y+x.uv_index_bytes*4);w+=function(c){for(var e,h,g,k=x.vertex_coordinate_bytes*3,l=c+x.nvertices*k;c<l;c+=k)e=b(a,c),h=b(a,c+x.vertex_coordinate_bytes),g=b(a,c+x.vertex_coordinate_bytes*2),z.vertices.push(new THREE.Vertex(new THREE.Vector3(e,
h,g)));return x.nvertices*k}(w);w+=function(c){for(var b,e,f,h=x.normal_coordinate_bytes*3,g=c+x.nnormals*h;c<g;c+=h)b=m(a,c),e=m(a,c+x.normal_coordinate_bytes),f=m(a,c+x.normal_coordinate_bytes*2),A.push(b/127,e/127,f/127);return x.nnormals*h}(w);w+=function(c){for(var e,h,g=x.uv_coordinate_bytes*2,k=c+x.nuvs*g;c<k;c+=g)e=b(a,c),h=b(a,c+x.uv_coordinate_bytes),D.push(e,h);return x.nuvs*g}(w);Q=w+Q;Z=Q+Z;W=Z+W;$=W+$;X=$+X;c=X+c;Y=c+Y;(function(a){var c,b=x.vertex_index_bytes*3+x.material_index_bytes,
e=b+x.uv_index_bytes*3,f=a+x.ntri_flat_uv*e;for(c=a;c<f;c+=e)o(c),y(c+b);return f-a})(Z);(function(a){var c,b=x.vertex_index_bytes*3+x.material_index_bytes+x.normal_index_bytes*3,e=b+x.uv_index_bytes*3,f=a+x.ntri_smooth_uv*e;for(c=a;c<f;c+=e)t(c),y(c+b);return f-a})(W);(function(a){var c,b=x.vertex_index_bytes*4+x.material_index_bytes,e=b+x.uv_index_bytes*4,f=a+x.nquad_flat_uv*e;for(c=a;c<f;c+=e)u(c),p(c+b);return f-a})(c);(function(a){var c,b=x.vertex_index_bytes*4+x.material_index_bytes+x.normal_index_bytes*
4,e=b+x.uv_index_bytes*4,f=a+x.nquad_smooth_uv*e;for(c=a;c<f;c+=e)v(c),p(c+b);return f-a})(Y);(function(a){var c,b=x.vertex_index_bytes*3+x.material_index_bytes,e=a+x.ntri_flat*b;for(c=a;c<e;c+=b)o(c);return e-a})(w);(function(a){var c,b=x.vertex_index_bytes*3+x.material_index_bytes+x.normal_index_bytes*3,e=a+x.ntri_smooth*b;for(c=a;c<e;c+=b)t(c);return e-a})(Q);(function(a){var c,b=x.vertex_index_bytes*4+x.material_index_bytes,e=a+x.nquad_flat*b;for(c=a;c<e;c+=b)u(c);return e-a})($);(function(a){var c,
b=x.vertex_index_bytes*4+x.material_index_bytes+x.normal_index_bytes*4,e=a+x.nquad_smooth*b;for(c=a;c<e;c+=b)v(c);return e-a})(X);this.computeCentroids();this.computeFaceNormals();THREE.Loader.prototype.hasNormals(this)&&this.computeTangents()};g.prototype=new THREE.Geometry;g.prototype.constructor=g;b(new g(c))};
THREE.ColladaLoader=function(){function a(a,c,b){for(var a=Q.evaluate(a,Q,G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),e={},f=a.iterateNext(),h=0;f;){f=(new c).parse(f);if(f.id.length==0)f.id=b+h++;e[f.id]=f;f=a.iterateNext()}return e}function b(){var a=1E6,c=-a,b=0,e;for(e in ca)for(var f=ca[e],h=0;h<f.sampler.length;h++){var g=f.sampler[h];g.create();a=Math.min(a,g.startTime);c=Math.max(c,g.endTime);b=Math.max(b,g.input.length)}return{start:a,end:c,frames:b}}function c(a,b,e,f){a.world=a.world||
new THREE.Matrix4;a.world.copy(a.matrix);if(a.channels&&a.channels.length){var h=a.channels[0].sampler.output[e];h instanceof THREE.Matrix4&&a.world.copy(h)}f&&a.world.multiply(f,a.world);b.push(a);for(f=0;f<a.nodes.length;f++)c(a.nodes[f],b,e,a.world)}function e(a,e,f){var h=aa[e.url];if(!h||!h.skin)console.log("ColladaLoader: Could not find skin controller.");else if(!e.skeleton||!e.skeleton.length)console.log("ColladaLoader: Could not find the skeleton for the skin. ");else{var g=b(),e=W.getChildById(e.skeleton[0],
!0)||W.getChildBySid(e.skeleton[0],!0),k,l,m,n,o=new THREE.Vector3,p;for(k=0;k<a.vertices.length;k++)h.skin.bindShapeMatrix.multiplyVector3(a.vertices[k].position);for(f=0;f<g.frames;f++){var t=[],u=[];for(k=0;k<a.vertices.length;k++)u.push(new THREE.Vertex(new THREE.Vector3));c(e,t,f);k=t;l=h.skin;for(n=0;n<k.length;n++)if(m=k[n],p=-1,m.type=="JOINT"){for(var v=0;v<l.joints.length;v++)if(m.sid==l.joints[v]){p=v;break}if(p>=0){v=l.invBindMatrices[p];m.invBindMatrix=v;m.skinningMatrix=new THREE.Matrix4;
m.skinningMatrix.multiply(m.world,v);m.weights=[];for(v=0;v<l.weights.length;v++)for(var y=0;y<l.weights[v].length;y++){var w=l.weights[v][y];w.joint==p&&m.weights.push(w)}}else throw"ColladaLoader: Could not find joint '"+m.sid+"'.";}for(k=0;k<t.length;k++)if(t[k].type=="JOINT")for(l=0;l<t[k].weights.length;l++)m=t[k].weights[l],n=m.index,m=m.weight,p=a.vertices[n],n=u[n],o.x=p.position.x,o.y=p.position.y,o.z=p.position.z,t[k].skinningMatrix.multiplyVector3(o),n.position.x+=o.x*m,n.position.y+=o.y*
m,n.position.z+=o.z*m;a.morphTargets.push({name:"target_"+f,vertices:u})}}}function g(a){var c=new THREE.Object3D,b,f,h;c.name=a.id||"";c.matrixAutoUpdate=!1;c.matrix=a.matrix;for(h=0;h<a.controllers.length;h++){var k=aa[a.controllers[h].url];switch(k.type){case "skin":if(ba[k.skin.source]){var l=new v;l.url=k.skin.source;l.instance_material=a.controllers[h].instance_material;a.geometries.push(l);b=a.controllers[h]}else if(aa[k.skin.source]&&(f=k=aa[k.skin.source],k.morph&&ba[k.morph.source]))l=new v,
l.url=k.morph.source,l.instance_material=a.controllers[h].instance_material,a.geometries.push(l);break;case "morph":if(ba[k.morph.source])l=new v,l.url=k.morph.source,l.instance_material=a.controllers[h].instance_material,a.geometries.push(l),f=a.controllers[h];console.log("ColladaLoader: Morph-controller partially supported.")}}for(h=0;h<a.geometries.length;h++){var k=a.geometries[h],l=k.instance_material,k=ba[k.url],m={},n=0,o;if(k&&k.mesh&&k.mesh.primitives){if(c.name.length==0)c.name=k.id;if(l)for(j=
0;j<l.length;j++){o=l[j];var p=ga[fa[o.target].instance_effect.url].shader;p.material.opacity=!p.material.opacity?1:p.material.opacity;o=m[o.symbol]=p.material;n++}l=o||new THREE.MeshLambertMaterial({color:14540253,shading:THREE.FlatShading});k=k.mesh.geometry3js;if(n>1){l=new THREE.MeshFaceMaterial;for(j=0;j<k.faces.length;j++)n=k.faces[j],n.materials=[m[n.daeMaterial]]}if(b!==void 0)e(k,b),l.morphTargets=!0,l=new THREE.SkinnedMesh(k,l),l.skeleton=b.skeleton,l.skinController=aa[b.url],l.skinInstanceController=
b,l.name="skin_"+ea.length,ea.push(l);else if(f!==void 0){m=k;n=f instanceof t?aa[f.url]:f;if(!n||!n.morph)console.log("could not find morph controller!");else{n=n.morph;for(p=0;p<n.targets.length;p++){var u=ba[n.targets[p]];if(u.mesh&&u.mesh.primitives&&u.mesh.primitives.length)u=u.mesh.primitives[0].geometry,u.vertices.length===m.vertices.length&&m.morphTargets.push({name:"target_1",vertices:u.vertices})}m.morphTargets.push({name:"target_Z",vertices:m.vertices})}l.morphTargets=!0;l=new THREE.Mesh(k,
l);l.name="morph_"+da.length;da.push(l)}else l=new THREE.Mesh(k,l);c.add(l)}}for(h=0;h<a.nodes.length;h++)c.add(g(a.nodes[h],a));return c}function h(){this.init_from=this.id=""}function f(){this.type=this.name=this.id="";this.morph=this.skin=null}function k(){this.weights=this.targets=this.source=this.method=null}function l(){this.source="";this.bindShapeMatrix=null;this.invBindMatrices=[];this.joints=[];this.weights=[]}function m(){this.name=this.id="";this.nodes=[];this.scene=new THREE.Object3D}
function n(){this.sid=this.name=this.id="";this.nodes=[];this.controllers=[];this.transforms=[];this.geometries=[];this.channels=[];this.matrix=new THREE.Matrix4}function o(){this.type=this.sid="";this.data=[];this.matrix=new THREE.Matrix4}function t(){this.url="";this.skeleton=[];this.instance_material=[]}function u(){this.target=this.symbol=""}function v(){this.url="";this.instance_material=[]}function y(){this.id="";this.mesh=null}function p(a){this.geometry=a.id;this.primitives=[];this.geometry3js=
this.vertices=null}function z(){}function w(){this.material="";this.count=0;this.inputs=[];this.vcount=null;this.p=[];this.geometry=new THREE.Geometry}function x(){this.source="";this.stride=this.count=0;this.params=[]}function A(){this.input={}}function D(){this.semantic="";this.offset=0;this.source="";this.set=0}function B(a){this.id=a;this.type=null}function E(){this.name=this.id="";this.instance_effect=null}function I(){this.color=new THREE.Color(0);this.color.setRGB(Math.random(),Math.random(),
Math.random());this.color.a=1;this.texcoord=this.texture=null}function H(a,c){this.type=a;this.effect=c;this.material=null}function J(a){this.effect=a;this.format=this.init_from=null}function C(a){this.effect=a;this.mipfilter=this.magfilter=this.minfilter=this.wrap_t=this.wrap_s=this.source=null}function F(){this.name=this.id="";this.sampler=this.surface=this.shader=null}function K(){this.url=""}function M(){this.name=this.id="";this.source={};this.sampler=[];this.channel=[]}function N(a){this.animation=
a;this.target=this.source="";this.member=this.arrIndices=this.arrSyntax=this.dotSyntax=this.sid=null}function L(a){this.id="";this.animation=a;this.inputs=[];this.endTime=this.startTime=this.interpolation=this.output=this.input=null;this.duration=0}function O(a){var c=a.getAttribute("id");if(X[c]!=void 0)return X[c];X[c]=(new B(c)).parse(a);return X[c]}function G(a){if(a=="dae")return"http://www.collada.org/2005/11/COLLADASchema";return null}function S(a){for(var a=U(a).split(/\s+/),c=[],b=0;b<a.length;b++)c.push(parseFloat(a[b]));
return c}function P(a){for(var a=U(a).split(/\s+/),c=[],b=0;b<a.length;b++)c.push(parseInt(a[b],10));return c}function U(a){return a.replace(/^\s+/,"").replace(/\s+$/,"")}function V(a,c,b){return a.hasAttribute(c)?parseInt(a.getAttribute(c),10):b}function T(a,c){if(a===void 0){for(var b="0.";b.length<c+2;)b+="0";return b}c=c||2;b=a.toString().split(".");for(b[1]=b.length>1?b[1].substr(0,c):"0";b[1].length<c;)b[1]+="0";return b.join(".")}function R(a,c){var b="";b+=T(a.x,c)+",";b+=T(a.y,c)+",";b+=
T(a.z,c);return b}var Q=null,Z=null,W,$=null,X={},Y={},ca={},aa={},ba={},fa={},ga={},ha,ja,da,ea,ka=THREE.SmoothShading;h.prototype.parse=function(a){this.id=a.getAttribute("id");for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeName=="init_from")this.init_from=b.textContent}return this};f.prototype.parse=function(a){this.id=a.getAttribute("id");this.name=a.getAttribute("name");this.type="none";for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];switch(b.nodeName){case "skin":this.skin=
(new l).parse(b);this.type=b.nodeName;break;case "morph":this.morph=(new k).parse(b),this.type=b.nodeName}}return this};k.prototype.parse=function(a){var c={},b=[],e;this.method=a.getAttribute("method");this.source=a.getAttribute("source").replace(/^#/,"");for(e=0;e<a.childNodes.length;e++){var f=a.childNodes[e];if(f.nodeType==1)switch(f.nodeName){case "source":f=(new B).parse(f);c[f.id]=f;break;case "targets":b=this.parseInputs(f);break;default:console.log(f.nodeName)}}for(e=0;e<b.length;e++)switch(a=
b[e],f=c[a.source],a.semantic){case "MORPH_TARGET":this.targets=f.read();break;case "MORPH_WEIGHT":this.weights=f.read()}return this};k.prototype.parseInputs=function(a){for(var c=[],b=0;b<a.childNodes.length;b++){var e=a.childNodes[b];if(e.nodeType==1)switch(e.nodeName){case "input":c.push((new D).parse(e))}}return c};l.prototype.parse=function(a){var c={},b,e;this.source=a.getAttribute("source").replace(/^#/,"");this.invBindMatrices=[];this.joints=[];this.weights=[];for(var f=0;f<a.childNodes.length;f++){var h=
a.childNodes[f];if(h.nodeType==1)switch(h.nodeName){case "bind_shape_matrix":h=S(h.textContent);this.bindShapeMatrix=new THREE.Matrix4;this.bindShapeMatrix.set(h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],h[8],h[9],h[10],h[11],h[12],h[13],h[14],h[15]);break;case "source":h=(new B).parse(h);c[h.id]=h;break;case "joints":b=h;break;case "vertex_weights":e=h;break;default:console.log(h.nodeName)}}this.parseJoints(b,c);this.parseWeights(e,c);return this};l.prototype.parseJoints=function(a,c){for(var b=0;b<
a.childNodes.length;b++){var e=a.childNodes[b];if(e.nodeType==1)switch(e.nodeName){case "input":var e=(new D).parse(e),f=c[e.source];if(e.semantic=="JOINT")this.joints=f.read();else if(e.semantic=="INV_BIND_MATRIX")this.invBindMatrices=f.read()}}};l.prototype.parseWeights=function(a,c){for(var b,e,f=[],h=0;h<a.childNodes.length;h++){var g=a.childNodes[h];if(g.nodeType==1)switch(g.nodeName){case "input":f.push((new D).parse(g));break;case "v":b=P(g.textContent);break;case "vcount":e=P(g.textContent)}}for(h=
g=0;h<e.length;h++){for(var k=e[h],l=[],m=0;m<k;m++){for(var n={},o=0;o<f.length;o++){var p=f[o],t=b[g+p.offset];switch(p.semantic){case "JOINT":n.joint=t;break;case "WEIGHT":n.weight=c[p.source].data[t]}}l.push(n);g+=f.length}for(m=0;m<l.length;m++)l[m].index=h;this.weights.push(l)}};m.prototype.getChildById=function(a,c){for(var b=0;b<this.nodes.length;b++){var e=this.nodes[b].getChildById(a,c);if(e)return e}return null};m.prototype.getChildBySid=function(a,c){for(var b=0;b<this.nodes.length;b++){var e=
this.nodes[b].getChildBySid(a,c);if(e)return e}return null};m.prototype.parse=function(a){this.id=a.getAttribute("id");this.name=a.getAttribute("name");this.nodes=[];for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "node":this.nodes.push((new n).parse(b))}}return this};n.prototype.getChannelForTransform=function(a){for(var c=0;c<this.channels.length;c++){var b=this.channels[c],e=b.target.split("/");e.shift();var f=e.shift(),h=f.indexOf(".")>=0,
g=f.indexOf("(")>=0,k;if(h)e=f.split("."),f=e.shift(),e.shift();else if(g){k=f.split("(");f=k.shift();for(e=0;e<k.length;e++)k[e]=parseInt(k[e].replace(/\)/,""))}if(f==a)return b.info={sid:f,dotSyntax:h,arrSyntax:g,arrIndices:k},b}return null};n.prototype.getChildById=function(a,c){if(this.id==a)return this;if(c)for(var b=0;b<this.nodes.length;b++){var e=this.nodes[b].getChildById(a,c);if(e)return e}return null};n.prototype.getChildBySid=function(a,c){if(this.sid==a)return this;if(c)for(var b=0;b<
this.nodes.length;b++){var e=this.nodes[b].getChildBySid(a,c);if(e)return e}return null};n.prototype.getTransformBySid=function(a){for(var c=0;c<this.transforms.length;c++)if(this.transforms[c].sid==a)return this.transforms[c];return null};n.prototype.parse=function(a){var c;this.id=a.getAttribute("id");this.sid=a.getAttribute("sid");this.name=a.getAttribute("name");this.type=a.getAttribute("type");this.type=this.type=="JOINT"?this.type:"NODE";this.nodes=[];this.transforms=[];this.geometries=[];this.controllers=
[];this.matrix=new THREE.Matrix4;for(var b=0;b<a.childNodes.length;b++)if(c=a.childNodes[b],c.nodeType==1)switch(c.nodeName){case "node":this.nodes.push((new n).parse(c));break;case "instance_camera":break;case "instance_controller":this.controllers.push((new t).parse(c));break;case "instance_geometry":this.geometries.push((new v).parse(c));break;case "instance_light":break;case "instance_node":c=c.getAttribute("url").replace(/^#/,"");(c=Q.evaluate(".//dae:library_nodes//dae:node[@id='"+c+"']",Q,
G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null).iterateNext())&&this.nodes.push((new n).parse(c));break;case "rotate":case "translate":case "scale":case "matrix":case "lookat":case "skew":this.transforms.push((new o).parse(c));break;case "extra":break;default:console.log(c.nodeName)}a=[];b=1E6;c=-1E6;for(var e in ca)for(var f=ca[e],h=0;h<f.channel.length;h++){var g=f.channel[h],k=f.sampler[h];e=g.target.split("/")[0];if(e==this.id)k.create(),g.sampler=k,b=Math.min(b,k.startTime),c=Math.max(c,k.endTime),
a.push(g)}if(a.length)this.startTime=b,this.endTime=c;if((this.channels=a)&&this.channels.length){e=1E7;for(i=0;i<this.channels.length;i++){a=this.channels[i].sampler;for(b=0;b<a.input.length-1;b++)e=Math.min(e,a.input[b+1]-a.input[b])}b=[];for(a=this.startTime;a<this.endTime;a+=e){c=a;for(var f={},l=h=void 0,h=0;h<this.channels.length;h++)l=this.channels[h],f[l.sid]=l;g=new THREE.Matrix4;for(h=0;h<this.transforms.length;h++)if(k=this.transforms[h],l=f[k.sid],l!==void 0){for(var m=l.sampler,p,l=0;l<
m.input.length-1;l++)if(m.input[l+1]>c){p=m.output[l];break}g=p!==void 0?p instanceof THREE.Matrix4?g.multiply(g,p):g.multiply(g,k.matrix):g.multiply(g,k.matrix)}else g=g.multiply(g,k.matrix);c=g;b.push({time:a,pos:[c.n14,c.n24,c.n34],rotq:[0,0,0,1],scl:[1,1,1]})}this.keys=b}this.updateMatrix();return this};n.prototype.updateMatrix=function(){this.matrix.identity();for(var a=0;a<this.transforms.length;a++)this.matrix.multiply(this.matrix,this.transforms[a].matrix)};o.prototype.parse=function(a){this.sid=
a.getAttribute("sid");this.type=a.nodeName;this.data=S(a.textContent);this.updateMatrix();return this};o.prototype.updateMatrix=function(){var a=0;this.matrix.identity();switch(this.type){case "matrix":this.matrix.set(this.data[0],this.data[1],this.data[2],this.data[3],this.data[4],this.data[5],this.data[6],this.data[7],this.data[8],this.data[9],this.data[10],this.data[11],this.data[12],this.data[13],this.data[14],this.data[15]);break;case "translate":this.matrix.setTranslation(this.data[0],this.data[1],
this.data[2]);break;case "rotate":a=this.data[3]*(Math.PI/180);this.matrix.setRotationAxis(new THREE.Vector3(this.data[0],this.data[1],this.data[2]),a);break;case "scale":this.matrix.setScale(this.data[0],this.data[1],this.data[2])}return this.matrix};t.prototype.parse=function(a){this.url=a.getAttribute("url").replace(/^#/,"");this.skeleton=[];this.instance_material=[];for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "skeleton":this.skeleton.push(b.textContent.replace(/^#/,
""));break;case "bind_material":if(b=Q.evaluate(".//dae:instance_material",b,G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null))for(var e=b.iterateNext();e;)this.instance_material.push((new u).parse(e)),e=b.iterateNext()}}return this};u.prototype.parse=function(a){this.symbol=a.getAttribute("symbol");this.target=a.getAttribute("target").replace(/^#/,"");return this};v.prototype.parse=function(a){this.url=a.getAttribute("url").replace(/^#/,"");this.instance_material=[];for(var c=0;c<a.childNodes.length;c++){var b=
a.childNodes[c];if(b.nodeType==1&&b.nodeName=="bind_material"){if(a=Q.evaluate(".//dae:instance_material",b,G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null))for(c=a.iterateNext();c;)this.instance_material.push((new u).parse(c)),c=a.iterateNext();break}}return this};y.prototype.parse=function(a){this.id=a.getAttribute("id");for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];switch(b.nodeName){case "mesh":this.mesh=(new p(this)).parse(b)}}return this};p.prototype.parse=function(a){function c(a,
b){var e=R(a.position);f[e]===void 0&&(f[e]={v:a,index:b});return f[e]}this.primitives=[];var b;for(b=0;b<a.childNodes.length;b++){var e=a.childNodes[b];switch(e.nodeName){case "source":O(e);break;case "vertices":this.vertices=(new A).parse(e);break;case "triangles":this.primitives.push((new w).parse(e));break;case "polygons":console.warn("polygon holes not yet supported!");case "polylist":this.primitives.push((new z).parse(e))}}var f={};this.geometry3js=new THREE.Geometry;e=X[this.vertices.input.POSITION.source].data;
for(a=b=0;b<e.length;b+=3,a++){var h=new THREE.Vertex(new THREE.Vector3(e[b],e[b+1],e[b+2]));c(h,a);this.geometry3js.vertices.push(h)}for(b=0;b<this.primitives.length;b++)primitive=this.primitives[b],primitive.setVertices(this.vertices),this.handlePrimitive(primitive,this.geometry3js,f);this.geometry3js.computeCentroids();this.geometry3js.computeFaceNormals();this.geometry3js.computeVertexNormals();this.geometry3js.computeBoundingBox();return this};p.prototype.handlePrimitive=function(a,c,b){var e=
0,f,h,g=a.p,k=a.inputs,l,m,n,o=0,p=3,t=[];for(f=0;f<k.length;f++)switch(l=k[f],l.semantic){case "TEXCOORD":t.push(l.set)}for(;e<g.length;){var u=[],v=[],y={},w=[];a.vcount&&(p=a.vcount[o++]);for(f=0;f<p;f++)for(h=0;h<k.length;h++)switch(l=k[h],source=X[l.source],m=g[e+f*k.length+l.offset],numParams=source.accessor.params.length,n=m*numParams,l.semantic){case "VERTEX":l=R(c.vertices[m].position);u.push(b[l].index);break;case "NORMAL":v.push(new THREE.Vector3(source.data[n],source.data[n+1],source.data[n+
2]));break;case "TEXCOORD":y[l.set]===void 0&&(y[l.set]=[]);y[l.set].push(new THREE.UV(source.data[n],source.data[n+1]));break;case "COLOR":w.push((new THREE.Color).setRGB(source.data[n],source.data[n+1],source.data[n+2]))}var x;p==3?x=new THREE.Face3(u[0],u[1],u[2],[v[0],v[1],v[2]],w.length?w:new THREE.Color):p==4&&(x=new THREE.Face4(u[0],u[1],u[2],u[3],[v[0],v[1],v[2],v[3]],w.length?w:new THREE.Color));x.daeMaterial=a.material;c.faces.push(x);for(h=0;h<t.length;h++)f=y[t[h]],c.faceVertexUvs[h].push([f[0],
f[1],f[2]]);e+=k.length*p}};z.prototype=new w;z.prototype.constructor=z;w.prototype.setVertices=function(a){for(var c=0;c<this.inputs.length;c++)if(this.inputs[c].source==a.id)this.inputs[c].source=a.input.POSITION.source};w.prototype.parse=function(a){this.inputs=[];this.material=a.getAttribute("material");this.count=V(a,"count",0);for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];switch(b.nodeName){case "input":this.inputs.push((new D).parse(a.childNodes[c]));break;case "vcount":this.vcount=
P(b.textContent);break;case "p":this.p=P(b.textContent)}}return this};x.prototype.parse=function(a){this.params=[];this.source=a.getAttribute("source");this.count=V(a,"count",0);this.stride=V(a,"stride",0);for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeName=="param"){var e={};e.name=b.getAttribute("name");e.type=b.getAttribute("type");this.params.push(e)}}return this};A.prototype.parse=function(a){this.id=a.getAttribute("id");for(var c=0;c<a.childNodes.length;c++)a.childNodes[c].nodeName==
"input"&&(input=(new D).parse(a.childNodes[c]),this.input[input.semantic]=input);return this};D.prototype.parse=function(a){this.semantic=a.getAttribute("semantic");this.source=a.getAttribute("source").replace(/^#/,"");this.set=V(a,"set",-1);this.offset=V(a,"offset",0);if(this.semantic=="TEXCOORD"&&this.set<0)this.set=0;return this};B.prototype.parse=function(a){this.id=a.getAttribute("id");for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];switch(b.nodeName){case "bool_array":for(var e=
U(b.textContent).split(/\s+/),f=[],h=0;h<e.length;h++)f.push(e[h]=="true"||e[h]=="1"?!0:!1);this.data=f;this.type=b.nodeName;break;case "float_array":this.data=S(b.textContent);this.type=b.nodeName;break;case "int_array":this.data=P(b.textContent);this.type=b.nodeName;break;case "IDREF_array":case "Name_array":this.data=U(b.textContent).split(/\s+/);this.type=b.nodeName;break;case "technique_common":for(e=0;e<b.childNodes.length;e++)if(b.childNodes[e].nodeName=="accessor"){this.accessor=(new x).parse(b.childNodes[e]);
break}}}return this};B.prototype.read=function(){var a=[],c=this.accessor.params[0];switch(c.type){case "IDREF":case "Name":case "name":case "float":return this.data;case "float4x4":for(c=0;c<this.data.length;c+=16){var b=this.data.slice(c,c+16),e=new THREE.Matrix4;e.set(b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8],b[9],b[10],b[11],b[12],b[13],b[14],b[15]);a.push(e)}break;default:console.log("ColladaLoader: Source: Read dont know how to read "+c.type+".")}return a};E.prototype.parse=function(a){this.id=
a.getAttribute("id");this.name=a.getAttribute("name");for(var c=0;c<a.childNodes.length;c++)if(a.childNodes[c].nodeName=="instance_effect"){this.instance_effect=(new K).parse(a.childNodes[c]);break}return this};I.prototype.isColor=function(){return this.texture==null};I.prototype.isTexture=function(){return this.texture!=null};I.prototype.parse=function(a){for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "color":b=S(b.textContent);this.color=new THREE.Color(0);
this.color.setRGB(b[0],b[1],b[2]);this.color.a=b[3];break;case "texture":this.texture=b.getAttribute("texture"),this.texcoord=b.getAttribute("texcoord")}}return this};H.prototype.parse=function(a){for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "ambient":case "emission":case "diffuse":case "specular":case "transparent":this[b.nodeName]=(new I).parse(b);break;case "shininess":case "reflectivity":case "transparency":var e;e=Q.evaluate(".//dae:float",
b,G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);for(var f=e.iterateNext(),h=[];f;)h.push(f),f=e.iterateNext();e=h;e.length>0&&(this[b.nodeName]=parseFloat(e[0].textContent))}}this.create();return this};H.prototype.create=function(){var a={},c=this.transparency!==void 0&&this.transparency<1,b;for(b in this)switch(b){case "ambient":case "emission":case "diffuse":case "specular":var e=this[b];if(e instanceof I)if(e.isTexture()){if(this.effect.sampler&&this.effect.surface&&this.effect.sampler.source==
this.effect.surface.sid&&(e=Y[this.effect.surface.init_from]))a.map=THREE.ImageUtils.loadTexture(ja+e.init_from),a.map.wrapS=THREE.RepeatWrapping,a.map.wrapT=THREE.RepeatWrapping,a.map.repeat.x=1,a.map.repeat.y=-1}else b=="diffuse"?a.color=e.color.getHex():c||(a[b]=e.color.getHex());break;case "shininess":case "reflectivity":a[b]=this[b];break;case "transparency":if(c)a.transparent=!0,a.opacity=this[b],c=!0}a.shading=ka;return this.material=new THREE.MeshLambertMaterial(a)};J.prototype.parse=function(a){for(var c=
0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "init_from":this.init_from=b.textContent;break;case "format":this.format=b.textContent;break;default:console.log("unhandled Surface prop: "+b.nodeName)}}return this};C.prototype.parse=function(a){for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "source":this.source=b.textContent;break;case "minfilter":this.minfilter=b.textContent;break;case "magfilter":this.magfilter=
b.textContent;break;case "mipfilter":this.mipfilter=b.textContent;break;case "wrap_s":this.wrap_s=b.textContent;break;case "wrap_t":this.wrap_t=b.textContent;break;default:console.log("unhandled Sampler2D prop: "+b.nodeName)}}return this};F.prototype.create=function(){if(this.shader==null)return null};F.prototype.parse=function(a){this.id=a.getAttribute("id");this.name=a.getAttribute("name");this.shader=null;for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "profile_COMMON":this.parseTechnique(this.parseProfileCOMMON(b))}}return this};
F.prototype.parseNewparam=function(a){for(var c=a.getAttribute("sid"),b=0;b<a.childNodes.length;b++){var e=a.childNodes[b];if(e.nodeType==1)switch(e.nodeName){case "surface":this.surface=(new J(this)).parse(e);this.surface.sid=c;break;case "sampler2D":this.sampler=(new C(this)).parse(e);this.sampler.sid=c;break;case "extra":break;default:console.log(e.nodeName)}}};F.prototype.parseProfileCOMMON=function(a){for(var c,b=0;b<a.childNodes.length;b++){var e=a.childNodes[b];if(e.nodeType==1)switch(e.nodeName){case "profile_COMMON":this.parseProfileCOMMON(e);
break;case "technique":c=e;break;case "newparam":this.parseNewparam(e);break;case "extra":break;default:console.log(e.nodeName)}}return c};F.prototype.parseTechnique=function(a){for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "lambert":case "blinn":case "phong":this.shader=(new H(b.nodeName,this)).parse(b)}}};K.prototype.parse=function(a){this.url=a.getAttribute("url").replace(/^#/,"");return this};M.prototype.parse=function(a){this.id=a.getAttribute("id");
this.name=a.getAttribute("name");this.source={};for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "source":b=(new B).parse(b);this.source[b.id]=b;break;case "sampler":this.sampler.push((new L(this)).parse(b));break;case "channel":this.channel.push((new N(this)).parse(b))}}return this};N.prototype.parse=function(a){this.source=a.getAttribute("source").replace(/^#/,"");this.target=a.getAttribute("target");var c=this.target.split("/");c.shift();var a=
c.shift(),b=a.indexOf(".")>=0,e=a.indexOf("(")>=0,f,h;if(b)c=a.split("."),a=c.shift(),h=c.shift();else if(e){f=a.split("(");a=f.shift();for(c=0;c<f.length;c++)f[c]=parseInt(f[c].replace(/\)/,""))}this.sid=a;this.dotSyntax=b;this.arrSyntax=e;this.arrIndices=f;this.member=h;return this};L.prototype.parse=function(a){this.id=a.getAttribute("id");this.inputs=[];for(var c=0;c<a.childNodes.length;c++){var b=a.childNodes[c];if(b.nodeType==1)switch(b.nodeName){case "input":this.inputs.push((new D).parse(b))}}return this};
L.prototype.create=function(){for(var a=0;a<this.inputs.length;a++){var c=this.inputs[a],b=this.animation.source[c.source];switch(c.semantic){case "INPUT":this.input=b.read();break;case "OUTPUT":this.output=b.read();break;case "INTERPOLATION":this.interpolation=b.read();break;case "IN_TANGENT":break;case "OUT_TANGENT":break;default:console.log(c.semantic)}}this.duration=this.endTime=this.startTime=0;if(this.input.length){this.startTime=1E8;this.endTime=-1E8;for(a=0;a<this.input.length;a++)this.startTime=
Math.min(this.startTime,this.input[a]),this.endTime=Math.max(this.endTime,this.input[a]);this.duration=this.endTime-this.startTime}};return{load:function(c,e){if(document.implementation&&document.implementation.createDocument){document.implementation.createDocument("http://www.collada.org/2005/11/COLLADASchema","COLLADA",null);c+="?rnd="+Math.random();var k=new XMLHttpRequest;k.overrideMimeType&&k.overrideMimeType("text/xml");k.onreadystatechange=function(){if(k.readyState==4&&(k.status==0||k.status==
200)){$=e;var l,n=c;Q=k.responseXML;l=$;n!==void 0&&(n=n.split("/"),n.pop(),ja=n.length<1?"":n.join("/")+"/");Y=a("//dae:library_images/dae:image",h,"image");fa=a("//dae:library_materials/dae:material",E,"material");ga=a("//dae:library_effects/dae:effect",F,"effect");ba=a("//dae:library_geometries/dae:geometry",y,"geometry");aa=a("//dae:library_controllers/dae:controller",f,"controller");ca=a("//dae:library_animations/dae:animation",M,"animation");ha=a(".//dae:library_visual_scenes/dae:visual_scene",
m,"visual_scene");da=[];ea=[];(n=Q.evaluate(".//dae:scene/dae:instance_visual_scene",Q,G,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null).iterateNext())?(n=n.getAttribute("url").replace(/^#/,""),W=ha[n]):W=null;Z=new THREE.Object3D;for(n=0;n<W.nodes.length;n++)Z.add(g(W.nodes[n]));b();for(var o in ca);o={scene:Z,morphs:da,skins:ea,dae:{images:Y,materials:fa,effects:ga,geometries:ba,controllers:aa,animations:ca,visualScenes:ha,scene:W}};l&&l(o)}};k.open("GET",c,!0);k.send(null)}else alert("Don't know how to parse XML!")},
setPreferredShading:function(a){ka=a},applySkin:e,geometries:ba}};THREE.JSONLoader=function(a){THREE.Loader.call(this,a)};THREE.JSONLoader.prototype=new THREE.Loader;THREE.JSONLoader.prototype.constructor=THREE.JSONLoader;THREE.JSONLoader.prototype.supr=THREE.Loader.prototype;
THREE.JSONLoader.prototype.load=function(a){var b=this,c=a.model,e=a.callback,g=a.texture_path?a.texture_path:this.extractUrlbase(c),a=new Worker(c);a.onmessage=function(a){b.createModel(a.data,e,g);b.onLoadComplete()};this.onLoadStart();a.postMessage((new Date).getTime())};
THREE.JSONLoader.prototype.createModel=function(a,b,c){var e=new THREE.Geometry,g=a.scale!==void 0?1/a.scale:1;this.init_materials(e,a.materials,c);(function(c){if(a.version===void 0||a.version!=2)console.error("Deprecated file format.");else{var b,g,l,m,n,o,t,u,v,y,p,z,w,x,A=a.faces;o=a.vertices;var D=a.normals,B=a.colors,E=0;for(b=0;b<a.uvs.length;b++)a.uvs[b].length&&E++;for(b=0;b<E;b++)e.faceUvs[b]=[],e.faceVertexUvs[b]=[];m=0;for(n=o.length;m<n;)t=new THREE.Vertex,t.position.x=o[m++]*c,t.position.y=
o[m++]*c,t.position.z=o[m++]*c,e.vertices.push(t);m=0;for(n=A.length;m<n;){c=A[m++];o=c&1;l=c&2;b=c&4;g=c&8;u=c&16;t=c&32;y=c&64;c&=128;o?(p=new THREE.Face4,p.a=A[m++],p.b=A[m++],p.c=A[m++],p.d=A[m++],o=4):(p=new THREE.Face3,p.a=A[m++],p.b=A[m++],p.c=A[m++],o=3);if(l)l=A[m++],p.materials=e.materials[l];l=e.faces.length;if(b)for(b=0;b<E;b++)z=a.uvs[b],v=A[m++],x=z[v*2],v=z[v*2+1],e.faceUvs[b][l]=new THREE.UV(x,v);if(g)for(b=0;b<E;b++){z=a.uvs[b];w=[];for(g=0;g<o;g++)v=A[m++],x=z[v*2],v=z[v*2+1],w[g]=
new THREE.UV(x,v);e.faceVertexUvs[b][l]=w}if(u)u=A[m++]*3,g=new THREE.Vector3,g.x=D[u++],g.y=D[u++],g.z=D[u],p.normal=g;if(t)for(b=0;b<o;b++)u=A[m++]*3,g=new THREE.Vector3,g.x=D[u++],g.y=D[u++],g.z=D[u],p.vertexNormals.push(g);if(y)t=A[m++],t=new THREE.Color(B[t]),p.color=t;if(c)for(b=0;b<o;b++)t=A[m++],t=new THREE.Color(B[t]),p.vertexColors.push(t);e.faces.push(p)}}})(g);(function(){var c,b,g,l;if(a.skinWeights){c=0;for(b=a.skinWeights.length;c<b;c+=2)g=a.skinWeights[c],l=a.skinWeights[c+1],e.skinWeights.push(new THREE.Vector4(g,
l,0,0))}if(a.skinIndices){c=0;for(b=a.skinIndices.length;c<b;c+=2)g=a.skinIndices[c],l=a.skinIndices[c+1],e.skinIndices.push(new THREE.Vector4(g,l,0,0))}e.bones=a.bones;e.animation=a.animation})();(function(c){if(a.morphTargets!==void 0){var b,g,l,m,n,o,t,u,v;b=0;for(g=a.morphTargets.length;b<g;b++){e.morphTargets[b]={};e.morphTargets[b].name=a.morphTargets[b].name;e.morphTargets[b].vertices=[];u=e.morphTargets[b].vertices;v=a.morphTargets[b].vertices;l=0;for(m=v.length;l<m;l+=3)n=v[l]*c,o=v[l+1]*
c,t=v[l+2]*c,u.push(new THREE.Vertex(new THREE.Vector3(n,o,t)))}}if(a.morphColors!==void 0){b=0;for(g=a.morphColors.length;b<g;b++){e.morphColors[b]={};e.morphColors[b].name=a.morphColors[b].name;e.morphColors[b].colors=[];m=e.morphColors[b].colors;n=a.morphColors[b].colors;c=0;for(l=n.length;c<l;c+=3)o=new THREE.Color(16755200),o.setRGB(n[c],n[c+1],n[c+2]),m.push(o)}}})(g);e.computeCentroids();e.computeFaceNormals();this.hasNormals(e)&&e.computeTangents();b(e)};
THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){}};
THREE.SceneLoader.prototype={load:function(a,b){var c=this,e=new Worker(a);e.postMessage(0);var g=THREE.Loader.prototype.extractUrlbase(a);e.onmessage=function(a){function e(a,c){return c=="relativeToHTML"?a:g+"/"+a}function k(){for(u in F.objects)if(!G.objects[u])if(w=F.objects[u],w.geometry!==void 0){if(B=G.geometries[w.geometry]){var a=!1;J=[];for(P=0;P<w.materials.length;P++)J[P]=G.materials[w.materials[P]],a=J[P]instanceof THREE.ShaderMaterial;a&&B.computeTangents();x=w.position;r=w.rotation;
q=w.quaternion;s=w.scale;q=0;J.length==0&&(J[0]=new THREE.MeshFaceMaterial);J.length>1&&(J=[new THREE.MeshFaceMaterial]);object=new THREE.Mesh(B,J);object.name=u;object.position.set(x[0],x[1],x[2]);q?(object.quaternion.set(q[0],q[1],q[2],q[3]),object.useQuaternion=!0):object.rotation.set(r[0],r[1],r[2]);object.scale.set(s[0],s[1],s[2]);object.visible=w.visible;G.scene.add(object);G.objects[u]=object;w.meshCollider&&(a=THREE.CollisionUtils.MeshColliderWBox(object),G.scene.collisions.colliders.push(a));
if(w.castsShadow)a=new THREE.ShadowVolume(B),G.scene.add(a),a.position=object.position,a.rotation=object.rotation,a.scale=object.scale;w.trigger&&w.trigger.toLowerCase()!="none"&&(a={type:w.trigger,object:w},G.triggers[object.name]=a)}}else x=w.position,r=w.rotation,q=w.quaternion,s=w.scale,q=0,object=new THREE.Object3D,object.name=u,object.position.set(x[0],x[1],x[2]),q?(object.quaternion.set(q[0],q[1],q[2],q[3]),object.useQuaternion=!0):object.rotation.set(r[0],r[1],r[2]),object.scale.set(s[0],
s[1],s[2]),object.visible=w.visible!==void 0?w.visible:!1,G.scene.add(object),G.objects[u]=object,G.empties[u]=object,w.trigger&&w.trigger.toLowerCase()!="none"&&(a={type:w.trigger,object:w},G.triggers[object.name]=a)}function l(a){return function(b){G.geometries[a]=b;k();M-=1;c.onLoadComplete();n()}}function m(a){return function(c){G.geometries[a]=c}}function n(){c.callbackProgress({totalModels:L,totalTextures:O,loadedModels:L-M,loadedTextures:O-N},G);c.onLoadProgress();M==0&&N==0&&b(G)}var o,t,
u,v,y,p,z,w,x,A,D,B,E,I,H,J,C,F,K,M,N,L,O,G;F=a.data;H=new THREE.BinaryLoader;K=new THREE.JSONLoader;N=M=0;G={scene:new THREE.Scene,geometries:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},triggers:{},empties:{}};a=!1;for(u in F.objects)if(w=F.objects[u],w.meshCollider){a=!0;break}if(a)G.scene.collisions=new THREE.CollisionSystem;if(F.transform){a=F.transform.position;A=F.transform.rotation;var S=F.transform.scale;a&&G.scene.position.set(a[0],a[1],a[2]);A&&G.scene.rotation.set(A[0],
A[1],A[2]);S&&G.scene.scale.set(S[0],S[1],S[2]);(a||A||S)&&G.scene.updateMatrix()}a=function(){N-=1;n();c.onLoadComplete()};for(y in F.cameras)A=F.cameras[y],A.type=="perspective"?E=new THREE.PerspectiveCamera(A.fov,A.aspect,A.near,A.far):A.type=="ortho"&&(E=new THREE.OrthographicCamera(A.left,A.right,A.top,A.bottom,A.near,A.far)),x=A.position,A=A.target,E.position.set(x[0],x[1],x[2]),E.target=new THREE.Vector3(A[0],A[1],A[2]),G.cameras[y]=E;for(v in F.lights)y=F.lights[v],E=y.color!==void 0?y.color:
16777215,A=y.intensity!==void 0?y.intensity:1,y.type=="directional"?(x=y.direction,C=new THREE.DirectionalLight(E,A),C.position.set(x[0],x[1],x[2]),C.position.normalize()):y.type=="point"?(x=y.position,d=y.distance,C=new THREE.PointLight(E,A,d),C.position.set(x[0],x[1],x[2])):y.type=="ambient"&&(C=new THREE.AmbientLight(E)),G.scene.add(C),G.lights[v]=C;for(p in F.fogs)v=F.fogs[p],v.type=="linear"?I=new THREE.Fog(0,v.near,v.far):v.type=="exp2"&&(I=new THREE.FogExp2(0,v.density)),A=v.color,I.color.setRGB(A[0],
A[1],A[2]),G.fogs[p]=I;if(G.cameras&&F.defaults.camera)G.currentCamera=G.cameras[F.defaults.camera];if(G.fogs&&F.defaults.fog)G.scene.fog=G.fogs[F.defaults.fog];A=F.defaults.bgcolor;G.bgColor=new THREE.Color;G.bgColor.setRGB(A[0],A[1],A[2]);G.bgColorAlpha=F.defaults.bgalpha;for(o in F.geometries)if(p=F.geometries[o],p.type=="bin_mesh"||p.type=="ascii_mesh")M+=1,c.onLoadStart();L=M;for(o in F.geometries)p=F.geometries[o],p.type=="cube"?(B=new THREE.CubeGeometry(p.width,p.height,p.depth,p.segmentsWidth,
p.segmentsHeight,p.segmentsDepth,null,p.flipped,p.sides),G.geometries[o]=B):p.type=="plane"?(B=new THREE.PlaneGeometry(p.width,p.height,p.segmentsWidth,p.segmentsHeight),G.geometries[o]=B):p.type=="sphere"?(B=new THREE.SphereGeometry(p.radius,p.segmentsWidth,p.segmentsHeight),G.geometries[o]=B):p.type=="cylinder"?(B=new THREE.CylinderGeometry(p.topRad,p.botRad,p.height,p.radSegs,p.heightSegs),G.geometries[o]=B):p.type=="torus"?(B=new THREE.TorusGeometry(p.radius,p.tube,p.segmentsR,p.segmentsT),G.geometries[o]=
B):p.type=="icosahedron"?(B=new THREE.IcosahedronGeometry(p.subdivisions),G.geometries[o]=B):p.type=="bin_mesh"?H.load({model:e(p.url,F.urlBaseType),callback:l(o)}):p.type=="ascii_mesh"?K.load({model:e(p.url,F.urlBaseType),callback:l(o)}):p.type=="embedded_mesh"&&(p=F.embeds[p.id])&&K.createModel(p,m(o),"");for(z in F.textures)if(o=F.textures[z],o.url instanceof Array){N+=o.url.length;for(H=0;H<o.url.length;H++)c.onLoadStart()}else N+=1,c.onLoadStart();O=N;for(z in F.textures){o=F.textures[z];if(o.mapping!=
void 0&&THREE[o.mapping]!=void 0)o.mapping=new THREE[o.mapping];if(o.url instanceof Array){H=[];for(var P=0;P<o.url.length;P++)H[P]=e(o.url[P],F.urlBaseType);H=THREE.ImageUtils.loadTextureCube(H,o.mapping,a)}else{H=THREE.ImageUtils.loadTexture(e(o.url,F.urlBaseType),o.mapping,a);if(THREE[o.minFilter]!=void 0)H.minFilter=THREE[o.minFilter];if(THREE[o.magFilter]!=void 0)H.magFilter=THREE[o.magFilter];if(o.repeat){H.repeat.set(o.repeat[0],o.repeat[1]);if(o.repeat[0]!=1)H.wrapS=THREE.RepeatWrapping;if(o.repeat[1]!=
1)H.wrapT=THREE.RepeatWrapping}o.offset&&H.offset.set(o.offset[0],o.offset[1]);if(o.wrap){K={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(K[o.wrap[0]]!==void 0)H.wrapS=K[o.wrap[0]];if(K[o.wrap[1]]!==void 0)H.wrapT=K[o.wrap[1]]}}G.textures[z]=H}for(t in F.materials){z=F.materials[t];for(D in z.parameters)if(D=="envMap"||D=="map"||D=="lightMap")z.parameters[D]=G.textures[z.parameters[D]];else if(D=="shading")z.parameters[D]=z.parameters[D]=="flat"?THREE.FlatShading:THREE.SmoothShading;
else if(D=="blending")z.parameters[D]=THREE[z.parameters[D]]?THREE[z.parameters[D]]:THREE.NormalBlending;else if(D=="combine")z.parameters[D]=z.parameters[D]=="MixOperation"?THREE.MixOperation:THREE.MultiplyOperation;else if(D=="vertexColors")if(z.parameters[D]=="face")z.parameters[D]=THREE.FaceColors;else if(z.parameters[D])z.parameters[D]=THREE.VertexColors;if(z.parameters.opacity!==void 0&&z.parameters.opacity<1)z.parameters.transparent=!0;if(z.parameters.normalMap){o=THREE.ShaderUtils.lib.normal;
a=THREE.UniformsUtils.clone(o.uniforms);H=z.parameters.color;K=z.parameters.specular;p=z.parameters.ambient;I=z.parameters.shininess;a.tNormal.texture=G.textures[z.parameters.normalMap];if(z.parameters.normalMapFactor)a.uNormalScale.value=z.parameters.normalMapFactor;if(z.parameters.map)a.tDiffuse.texture=z.parameters.map,a.enableDiffuse.value=!0;if(z.parameters.lightMap)a.tAO.texture=z.parameters.lightMap,a.enableAO.value=!0;if(z.parameters.specularMap)a.tSpecular.texture=G.textures[z.parameters.specularMap],
a.enableSpecular.value=!0;a.uDiffuseColor.value.setHex(H);a.uSpecularColor.value.setHex(K);a.uAmbientColor.value.setHex(p);a.uShininess.value=I;if(z.parameters.opacity)a.uOpacity.value=z.parameters.opacity;z=new THREE.ShaderMaterial({fragmentShader:o.fragmentShader,vertexShader:o.vertexShader,uniforms:a,lights:!0,fog:!0})}else z=new THREE[z.type](z.parameters);G.materials[t]=z}k();c.callbackSync(G)}},constructor:THREE.SceneLoader};THREE.UTF8Loader=function(){};THREE.UTF8Loader.prototype=new THREE.UTF8Loader;
THREE.UTF8Loader.prototype.constructor=THREE.UTF8Loader;
THREE.UTF8Loader.prototype.load=function(a){var b=new XMLHttpRequest,c=a.model,e=a.callback,g=a.scale!==void 0?a.scale:1,h=a.offsetX!==void 0?a.offsetX:0,f=a.offsetY!==void 0?a.offsetY:0,k=a.offsetZ!==void 0?a.offsetZ:0;b.onreadystatechange=function(){b.readyState==4?b.status==200||b.status==0?THREE.UTF8Loader.prototype.createModel(b.responseText,e,g,h,f,k):alert("Couldn't load ["+c+"] ["+b.status+"]"):b.readyState!=3&&b.readyState==2&&b.getResponseHeader("Content-Length")};b.open("GET",c,!0);b.send(null)};
THREE.UTF8Loader.prototype.decompressMesh=function(a){var b=a.charCodeAt(0);b>=57344&&(b-=2048);b++;for(var c=new Float32Array(8*b),e=1,g=0;g<8;g++){for(var h=0,f=0;f<b;++f){var k=a.charCodeAt(f+e);h+=k>>1^-(k&1);c[8*f+g]=h}e+=b}b=a.length-e;h=new Uint16Array(b);for(g=f=0;g<b;g++)k=a.charCodeAt(g+e),h[g]=f-k,k==0&&f++;return[c,h]};
THREE.UTF8Loader.prototype.createModel=function(a,b,c,e,g,h){var f=function(){var b=this;b.materials=[];THREE.Geometry.call(this);var f=THREE.UTF8Loader.prototype.decompressMesh(a),m=[],n=[];(function(a,f,l){for(var m,n,p,z=a.length;l<z;l+=f)m=a[l],n=a[l+1],p=a[l+2],m=m/16383*c,n=n/16383*c,p=p/16383*c,m+=e,n+=g,p+=h,b.vertices.push(new THREE.Vertex(new THREE.Vector3(m,n,p)))})(f[0],8,0);(function(a,c,b){for(var e,f,g=a.length;b<g;b+=c)e=a[b],f=a[b+1],e/=1023,f/=1023,n.push(e,1-f)})(f[0],8,3);(function(a,
c,b){for(var e,f,g,h=a.length;b<h;b+=c)e=a[b],f=a[b+1],g=a[b+2],e=(e-512)/511,f=(f-512)/511,g=(g-512)/511,m.push(e,f,g)})(f[0],8,5);(function(a){var c,e,f,g,h,l,w,x,A,D=a.length;for(c=0;c<D;c+=3){e=a[c];f=a[c+1];g=a[c+2];h=b;x=e;A=f;l=g;w=e;var B=f,E=g,I=h.materials[0],H=m[B*3],J=m[B*3+1],B=m[B*3+2],C=m[E*3],F=m[E*3+1],E=m[E*3+2];w=new THREE.Vector3(m[w*3],m[w*3+1],m[w*3+2]);B=new THREE.Vector3(H,J,B);E=new THREE.Vector3(C,F,E);h.faces.push(new THREE.Face3(x,A,l,[w,B,E],null,I));h=n[e*2];e=n[e*2+
1];l=n[f*2];w=n[f*2+1];x=n[g*2];A=n[g*2+1];g=b.faceVertexUvs[0];f=l;l=w;w=[];w.push(new THREE.UV(h,e));w.push(new THREE.UV(f,l));w.push(new THREE.UV(x,A));g.push(w)}})(f[1]);this.computeCentroids();this.computeFaceNormals()};f.prototype=new THREE.Geometry;f.prototype.constructor=f;b(new f)};
THREE.Axes=function(){THREE.Object3D.call(this);var a=new THREE.Geometry;a.vertices.push(new THREE.Vertex);a.vertices.push(new THREE.Vertex(new THREE.Vector3(0,100,0)));var b=new THREE.CylinderGeometry(0,5,25,5,1),c=new THREE.Line(a,new THREE.LineBasicMaterial({color:16711680}));c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:16711680}));c.position.x=100;c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:65280}));this.add(c);
c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:65280}));c.position.y=100;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:255}));c.rotation.x=Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:255}));c.position.z=100;c.rotation.x=Math.PI/2;this.add(c)};THREE.Axes.prototype=new THREE.Object3D;THREE.Axes.prototype.constructor=THREE.Axes;
THREE.MarchingCubes=function(a,b){THREE.Object3D.call(this);this.materials=b instanceof Array?b:[b];this.init=function(a){this.isolation=80;this.size=a;this.size2=this.size*this.size;this.size3=this.size2*this.size;this.halfsize=this.size/2;this.delta=2/this.size;this.yd=this.size;this.zd=this.size2;this.field=new Float32Array(this.size3);this.normal_cache=new Float32Array(this.size3*3);this.vlist=new Float32Array(36);this.nlist=new Float32Array(36);this.firstDraw=!0;this.maxCount=4096;this.count=
0;this.hasNormal=this.hasPos=!1;this.positionArray=new Float32Array(this.maxCount*3);this.normalArray=new Float32Array(this.maxCount*3)};this.lerp=function(a,b,g){return a+(b-a)*g};this.VIntX=function(a,b,g,h,f,k,l,m,n,o){f=(f-n)/(o-n);n=this.normal_cache;b[h]=k+f*this.delta;b[h+1]=l;b[h+2]=m;g[h]=this.lerp(n[a],n[a+3],f);g[h+1]=this.lerp(n[a+1],n[a+4],f);g[h+2]=this.lerp(n[a+2],n[a+5],f)};this.VIntY=function(a,b,g,h,f,k,l,m,n,o){f=(f-n)/(o-n);n=this.normal_cache;b[h]=k;b[h+1]=l+f*this.delta;b[h+
2]=m;b=a+this.yd*3;g[h]=this.lerp(n[a],n[b],f);g[h+1]=this.lerp(n[a+1],n[b+1],f);g[h+2]=this.lerp(n[a+2],n[b+2],f)};this.VIntZ=function(a,b,g,h,f,k,l,m,n,o){f=(f-n)/(o-n);n=this.normal_cache;b[h]=k;b[h+1]=l;b[h+2]=m+f*this.delta;b=a+this.zd*3;g[h]=this.lerp(n[a],n[b],f);g[h+1]=this.lerp(n[a+1],n[b+1],f);g[h+2]=this.lerp(n[a+2],n[b+2],f)};this.compNorm=function(a){var b=a*3;this.normal_cache[b]==0&&(this.normal_cache[b]=this.field[a-1]-this.field[a+1],this.normal_cache[b+1]=this.field[a-this.yd]-this.field[a+
this.yd],this.normal_cache[b+2]=this.field[a-this.zd]-this.field[a+this.zd])};this.polygonize=function(a,b,g,h,f,k){var l=h+1,m=h+this.yd,n=h+this.zd,o=l+this.yd,t=l+this.zd,u=h+this.yd+this.zd,v=l+this.yd+this.zd,y=0,p=this.field[h],z=this.field[l],w=this.field[m],x=this.field[o],A=this.field[n],D=this.field[t],B=this.field[u],E=this.field[v];p<f&&(y|=1);z<f&&(y|=2);w<f&&(y|=8);x<f&&(y|=4);A<f&&(y|=16);D<f&&(y|=32);B<f&&(y|=128);E<f&&(y|=64);var I=THREE.edgeTable[y];if(I==0)return 0;var H=this.delta,
J=a+H,C=b+H,H=g+H;I&1&&(this.compNorm(h),this.compNorm(l),this.VIntX(h*3,this.vlist,this.nlist,0,f,a,b,g,p,z));I&2&&(this.compNorm(l),this.compNorm(o),this.VIntY(l*3,this.vlist,this.nlist,3,f,J,b,g,z,x));I&4&&(this.compNorm(m),this.compNorm(o),this.VIntX(m*3,this.vlist,this.nlist,6,f,a,C,g,w,x));I&8&&(this.compNorm(h),this.compNorm(m),this.VIntY(h*3,this.vlist,this.nlist,9,f,a,b,g,p,w));I&16&&(this.compNorm(n),this.compNorm(t),this.VIntX(n*3,this.vlist,this.nlist,12,f,a,b,H,A,D));I&32&&(this.compNorm(t),
this.compNorm(v),this.VIntY(t*3,this.vlist,this.nlist,15,f,J,b,H,D,E));I&64&&(this.compNorm(u),this.compNorm(v),this.VIntX(u*3,this.vlist,this.nlist,18,f,a,C,H,B,E));I&128&&(this.compNorm(n),this.compNorm(u),this.VIntY(n*3,this.vlist,this.nlist,21,f,a,b,H,A,B));I&256&&(this.compNorm(h),this.compNorm(n),this.VIntZ(h*3,this.vlist,this.nlist,24,f,a,b,g,p,A));I&512&&(this.compNorm(l),this.compNorm(t),this.VIntZ(l*3,this.vlist,this.nlist,27,f,J,b,g,z,D));I&1024&&(this.compNorm(o),this.compNorm(v),this.VIntZ(o*
3,this.vlist,this.nlist,30,f,J,C,g,x,E));I&2048&&(this.compNorm(m),this.compNorm(u),this.VIntZ(m*3,this.vlist,this.nlist,33,f,a,C,g,w,B));y<<=4;for(f=h=0;THREE.triTable[y+f]!=-1;)a=y+f,b=a+1,g=a+2,this.posnormtriv(this.vlist,this.nlist,3*THREE.triTable[a],3*THREE.triTable[b],3*THREE.triTable[g],k),f+=3,h++;return h};this.posnormtriv=function(a,b,g,h,f,k){var l=this.count*3;this.positionArray[l]=a[g];this.positionArray[l+1]=a[g+1];this.positionArray[l+2]=a[g+2];this.positionArray[l+3]=a[h];this.positionArray[l+
4]=a[h+1];this.positionArray[l+5]=a[h+2];this.positionArray[l+6]=a[f];this.positionArray[l+7]=a[f+1];this.positionArray[l+8]=a[f+2];this.normalArray[l]=b[g];this.normalArray[l+1]=b[g+1];this.normalArray[l+2]=b[g+2];this.normalArray[l+3]=b[h];this.normalArray[l+4]=b[h+1];this.normalArray[l+5]=b[h+2];this.normalArray[l+6]=b[f];this.normalArray[l+7]=b[f+1];this.normalArray[l+8]=b[f+2];this.hasNormal=this.hasPos=!0;this.count+=3;this.count>=this.maxCount-3&&k(this)};this.begin=function(){this.count=0;
this.hasNormal=this.hasPos=!1};this.end=function(a){if(this.count!=0){for(var b=this.count*3;b<this.positionArray.length;b++)this.positionArray[b]=0;a(this)}};this.addBall=function(a,b,g,h,f){var k=this.size*Math.sqrt(h/f),l=g*this.size,m=b*this.size,n=a*this.size,o=Math.floor(l-k);o<1&&(o=1);l=Math.floor(l+k);l>this.size-1&&(l=this.size-1);var t=Math.floor(m-k);t<1&&(t=1);m=Math.floor(m+k);m>this.size-1&&(m=this.size-1);var u=Math.floor(n-k);u<1&&(u=1);k=Math.floor(n+k);k>this.size-1&&(k=this.size-
1);for(var v,y,p,z,w,x;o<l;o++){n=this.size2*o;y=o/this.size-g;w=y*y;for(y=t;y<m;y++){p=n+this.size*y;v=y/this.size-b;x=v*v;for(v=u;v<k;v++)z=v/this.size-a,z=h/(1.0E-6+z*z+x+w)-f,z>0&&(this.field[p+v]+=z)}}};this.addPlaneX=function(a,b){var g,h,f,k,l,m=this.size,n=this.yd,o=this.zd,t=this.field,u=m*Math.sqrt(a/b);u>m&&(u=m);for(g=0;g<u;g++)if(h=g/m,h*=h,k=a/(1.0E-4+h)-b,k>0)for(h=0;h<m;h++){l=g+h*n;for(f=0;f<m;f++)t[o*f+l]+=k}};this.addPlaneY=function(a,b){var g,h,f,k,l,m,n=this.size,o=this.yd,t=
this.zd,u=this.field,v=n*Math.sqrt(a/b);v>n&&(v=n);for(h=0;h<v;h++)if(g=h/n,g*=g,k=a/(1.0E-4+g)-b,k>0){l=h*o;for(g=0;g<n;g++){m=l+g;for(f=0;f<n;f++)u[t*f+m]+=k}}};this.addPlaneZ=function(a,b){var g,h,f,k,l,m;size=this.size;yd=this.yd;zd=this.zd;field=this.field;dist=size*Math.sqrt(a/b);dist>size&&(dist=size);for(f=0;f<dist;f++)if(g=f/size,g*=g,k=a/(1.0E-4+g)-b,k>0){l=zd*f;for(h=0;h<size;h++){m=l+h*yd;for(g=0;g<size;g++)field[m+g]+=k}}};this.reset=function(){var a;for(a=0;a<this.size3;a++)this.normal_cache[a*
3]=0,this.field[a]=0};this.render=function(a){this.begin();var b,g,h,f,k,l,m,n,o,t=this.size-2;for(f=1;f<t;f++){o=this.size2*f;m=(f-this.halfsize)/this.halfsize;for(h=1;h<t;h++){n=o+this.size*h;l=(h-this.halfsize)/this.halfsize;for(g=1;g<t;g++)k=(g-this.halfsize)/this.halfsize,b=n+g,this.polygonize(k,l,m,b,this.isolation,a)}}this.end(a)};this.generateGeometry=function(){var a=0,b=new THREE.Geometry,g=[];this.render(function(h){var f,k,l,m,n,o,t,u;for(f=0;f<h.count;f++)t=f*3,n=t+1,u=t+2,k=h.positionArray[t],
l=h.positionArray[n],m=h.positionArray[u],o=new THREE.Vector3(k,l,m),k=h.normalArray[t],l=h.normalArray[n],m=h.normalArray[u],t=new THREE.Vector3(k,l,m),t.normalize(),n=new THREE.Vertex(o),b.vertices.push(n),g.push(t);nfaces=h.count/3;for(f=0;f<nfaces;f++)t=(a+f)*3,n=t+1,u=t+2,o=g[t],k=g[n],l=g[u],t=new THREE.Face3(t,n,u,[o,k,l]),b.faces.push(t);a+=nfaces;h.count=0});return b};this.init(a)};THREE.MarchingCubes.prototype=new THREE.Object3D;THREE.MarchingCubes.prototype.constructor=THREE.MarchingCubes;
THREE.edgeTable=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,
1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,
419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]);
THREE.triTable=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,
-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,
8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,
-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,
5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,
-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,
10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,
6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,
8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,
2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,
-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,
-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,
-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,
-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,
2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,
4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);THREE.PlaneCollider=function(a,b){this.point=a;this.normal=b};THREE.SphereCollider=function(a,b){this.center=a;this.radius=b;this.radiusSq=b*b};THREE.BoxCollider=function(a,b){this.min=a;this.max=b;this.dynamic=!0;this.normal=new THREE.Vector3};
THREE.MeshCollider=function(a,b){this.mesh=a;this.box=b;this.numFaces=this.mesh.geometry.faces.length;this.normal=new THREE.Vector3};THREE.CollisionSystem=function(){this.collisionNormal=new THREE.Vector3;this.colliders=[];this.hits=[]};THREE.Collisions=new THREE.CollisionSystem;THREE.CollisionSystem.prototype.merge=function(a){Array.prototype.push.apply(this.colliders,a.colliders);Array.prototype.push.apply(this.hits,a.hits)};
THREE.CollisionSystem.prototype.rayCastAll=function(a){a.direction.normalize();this.hits.length=0;var b,c,e,g,h=0;b=0;for(c=this.colliders.length;b<c;b++)if(g=this.colliders[b],e=this.rayCast(a,g),e<Number.MAX_VALUE)g.distance=e,e>h?this.hits.push(g):this.hits.unshift(g),h=e;return this.hits};
THREE.CollisionSystem.prototype.rayCastNearest=function(a){var b=this.rayCastAll(a);if(b.length==0)return null;for(var c=0;b[c]instanceof THREE.MeshCollider;){var e=this.rayMesh(a,b[c]);if(e.dist<Number.MAX_VALUE){b[c].distance=e.dist;b[c].faceIndex=e.faceIndex;break}c++}if(c>b.length)return null;return b[c]};
THREE.CollisionSystem.prototype.rayCast=function(a,b){if(b instanceof THREE.PlaneCollider)return this.rayPlane(a,b);else if(b instanceof THREE.SphereCollider)return this.raySphere(a,b);else if(b instanceof THREE.BoxCollider)return this.rayBox(a,b);else if(b instanceof THREE.MeshCollider&&b.box)return this.rayBox(a,b.box)};
THREE.CollisionSystem.prototype.rayMesh=function(a,b){for(var c=this.makeRayLocal(a,b.mesh),e=Number.MAX_VALUE,g,h=0;h<b.numFaces;h++){var f=b.mesh.geometry.faces[h],k=b.mesh.geometry.vertices[f.a].position,l=b.mesh.geometry.vertices[f.b].position,m=b.mesh.geometry.vertices[f.c].position,n=f instanceof THREE.Face4?b.mesh.geometry.vertices[f.d].position:null;f instanceof THREE.Face3?(f=this.rayTriangle(c,k,l,m,e,this.collisionNormal,b.mesh),f<e&&(e=f,g=h,b.normal.copy(this.collisionNormal),b.normal.normalize())):
f instanceof THREE.Face4&&(f=this.rayTriangle(c,k,l,n,e,this.collisionNormal,b.mesh),f<e&&(e=f,g=h,b.normal.copy(this.collisionNormal),b.normal.normalize()),f=this.rayTriangle(c,l,m,n,e,this.collisionNormal,b.mesh),f<e&&(e=f,g=h,b.normal.copy(this.collisionNormal),b.normal.normalize()))}return{dist:e,faceIndex:g}};
THREE.CollisionSystem.prototype.rayTriangle=function(a,b,c,e,g,h,f){var k=THREE.CollisionSystem.__v1,l=THREE.CollisionSystem.__v2;h.set(0,0,0);k.sub(c,b);l.sub(e,c);h.cross(k,l);k=h.dot(a.direction);if(!(k<0))if(f.doubleSided||f.flipSided)h.multiplyScalar(-1),k*=-1;else return Number.MAX_VALUE;f=h.dot(b)-h.dot(a.origin);if(!(f<=0))return Number.MAX_VALUE;if(!(f>=k*g))return Number.MAX_VALUE;f/=k;k=THREE.CollisionSystem.__v3;k.copy(a.direction);k.multiplyScalar(f);k.addSelf(a.origin);Math.abs(h.x)>
Math.abs(h.y)?Math.abs(h.x)>Math.abs(h.z)?(a=k.y-b.y,h=c.y-b.y,g=e.y-b.y,k=k.z-b.z,c=c.z-b.z,e=e.z-b.z):(a=k.x-b.x,h=c.x-b.x,g=e.x-b.x,k=k.y-b.y,c=c.y-b.y,e=e.y-b.y):Math.abs(h.y)>Math.abs(h.z)?(a=k.x-b.x,h=c.x-b.x,g=e.x-b.x,k=k.z-b.z,c=c.z-b.z,e=e.z-b.z):(a=k.x-b.x,h=c.x-b.x,g=e.x-b.x,k=k.y-b.y,c=c.y-b.y,e=e.y-b.y);b=h*e-c*g;if(b==0)return Number.MAX_VALUE;b=1/b;e=(a*e-k*g)*b;if(!(e>=0))return Number.MAX_VALUE;b*=h*k-c*a;if(!(b>=0))return Number.MAX_VALUE;if(!(1-e-b>=0))return Number.MAX_VALUE;return f};
THREE.CollisionSystem.prototype.makeRayLocal=function(a,b){var c=THREE.CollisionSystem.__m;THREE.Matrix4.makeInvert(b.matrixWorld,c);var e=THREE.CollisionSystem.__r;e.origin.copy(a.origin);e.direction.copy(a.direction);c.multiplyVector3(e.origin);c.rotateAxis(e.direction);e.direction.normalize();return e};
THREE.CollisionSystem.prototype.rayBox=function(a,b){var c;b.dynamic&&b.mesh&&b.mesh.matrixWorld?c=this.makeRayLocal(a,b.mesh):(c=THREE.CollisionSystem.__r,c.origin.copy(a.origin),c.direction.copy(a.direction));var e=0,g=0,h=0,f=0,k=0,l=0,m=!0;c.origin.x<b.min.x?(e=b.min.x-c.origin.x,e/=c.direction.x,m=!1,f=-1):c.origin.x>b.max.x&&(e=b.max.x-c.origin.x,e/=c.direction.x,m=!1,f=1);c.origin.y<b.min.y?(g=b.min.y-c.origin.y,g/=c.direction.y,m=!1,k=-1):c.origin.y>b.max.y&&(g=b.max.y-c.origin.y,g/=c.direction.y,
m=!1,k=1);c.origin.z<b.min.z?(h=b.min.z-c.origin.z,h/=c.direction.z,m=!1,l=-1):c.origin.z>b.max.z&&(h=b.max.z-c.origin.z,h/=c.direction.z,m=!1,l=1);if(m)return-1;m=0;g>e&&(m=1,e=g);h>e&&(m=2,e=h);switch(m){case 0:k=c.origin.y+c.direction.y*e;if(k<b.min.y||k>b.max.y)return Number.MAX_VALUE;c=c.origin.z+c.direction.z*e;if(c<b.min.z||c>b.max.z)return Number.MAX_VALUE;b.normal.set(f,0,0);break;case 1:f=c.origin.x+c.direction.x*e;if(f<b.min.x||f>b.max.x)return Number.MAX_VALUE;c=c.origin.z+c.direction.z*
e;if(c<b.min.z||c>b.max.z)return Number.MAX_VALUE;b.normal.set(0,k,0);break;case 2:f=c.origin.x+c.direction.x*e;if(f<b.min.x||f>b.max.x)return Number.MAX_VALUE;k=c.origin.y+c.direction.y*e;if(k<b.min.y||k>b.max.y)return Number.MAX_VALUE;b.normal.set(0,0,l)}return e};THREE.CollisionSystem.prototype.rayPlane=function(a,b){var c=a.direction.dot(b.normal),e=b.point.dot(b.normal);if(c<0)c=(e-a.origin.dot(b.normal))/c;else return Number.MAX_VALUE;return c>0?c:Number.MAX_VALUE};
THREE.CollisionSystem.prototype.raySphere=function(a,b){var c=b.center.clone().subSelf(a.origin);if(c.lengthSq<b.radiusSq)return-1;var e=c.dot(a.direction.clone());if(e<=0)return Number.MAX_VALUE;c=b.radiusSq-(c.lengthSq()-e*e);if(c>=0)return Math.abs(e)-Math.sqrt(c);return Number.MAX_VALUE};THREE.CollisionSystem.__v1=new THREE.Vector3;THREE.CollisionSystem.__v2=new THREE.Vector3;THREE.CollisionSystem.__v3=new THREE.Vector3;THREE.CollisionSystem.__nr=new THREE.Vector3;THREE.CollisionSystem.__m=new THREE.Matrix4;
THREE.CollisionSystem.__r=new THREE.Ray;THREE.CollisionUtils={};THREE.CollisionUtils.MeshOBB=function(a){a.geometry.computeBoundingBox();var b=a.geometry.boundingBox,c=new THREE.Vector3(b.x[0],b.y[0],b.z[0]),b=new THREE.Vector3(b.x[1],b.y[1],b.z[1]),c=new THREE.BoxCollider(c,b);c.mesh=a;return c};THREE.CollisionUtils.MeshAABB=function(a){var b=THREE.CollisionUtils.MeshOBB(a);b.min.addSelf(a.position);b.max.addSelf(a.position);b.dynamic=!1;return b};
THREE.CollisionUtils.MeshColliderWBox=function(a){return new THREE.MeshCollider(a,THREE.CollisionUtils.MeshOBB(a))};
if(THREE.WebGLRenderer)THREE.AnaglyphWebGLRenderer=function(a){THREE.WebGLRenderer.call(this,a);var b=this,c=this.setSize,e=this.render,g=new THREE.PerspectiveCamera,h=new THREE.PerspectiveCamera,f=new THREE.Matrix4,k=new THREE.Matrix4,l,m,n;g.matrixAutoUpdate=h.matrixAutoUpdate=!1;var a={minFilter:THREE.LinearFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat},o=new THREE.WebGLRenderTarget(512,512,a),t=new THREE.WebGLRenderTarget(512,512,a),u=new THREE.PerspectiveCamera(53,1,1,1E4);u.position.z=
2;_material=new THREE.ShaderMaterial({uniforms:{mapLeft:{type:"t",value:0,texture:o},mapRight:{type:"t",value:1,texture:t}},vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = vec2( uv.x, 1.0 - uv.y );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform sampler2D mapLeft;\nuniform sampler2D mapRight;\nvarying vec2 vUv;\nvoid main() {\nvec4 colorL, colorR;\nvec2 uv = vUv;\ncolorL = texture2D( mapLeft, uv );\ncolorR = texture2D( mapRight, uv );\ngl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;\n}"});
var v=new THREE.Scene;v.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),_material));this.setSize=function(a,e){c.call(b,a,e);o.width=a;o.height=e;t.width=a;t.height=e};this.render=function(a,c){c.update(null,!0);if(l!==c.aspect||m!==c.near||n!==c.fov){l=c.aspect;m=c.near;n=c.fov;var z=c.projectionMatrix.clone(),w=125/30*0.5,x=w*m/125,A=m*Math.tan(n*Math.PI/360),D;f.n14=w;k.n14=-w;w=-A*l+x;D=A*l+x;z.n11=2*m/(D-w);z.n13=(D+w)/(D-w);g.projectionMatrix=z.clone();w=-A*l-x;D=A*l-x;z.n11=2*m/(D-w);z.n13=
(D+w)/(D-w);h.projectionMatrix=z.clone()}g.matrix=c.matrixWorld.clone().multiplySelf(k);g.update(null,!0);g.position.copy(c.position);g.near=m;g.far=c.far;e.call(b,a,g,o,!0);h.matrix=c.matrixWorld.clone().multiplySelf(f);h.update(null,!0);h.position.copy(c.position);h.near=m;h.far=c.far;e.call(b,a,h,t,!0);e.call(b,v,u)}};
if(THREE.WebGLRenderer)THREE.CrosseyedWebGLRenderer=function(a){THREE.WebGLRenderer.call(this,a);this.autoClear=!1;var b=this,c=this.setSize,e=this.render,g,h,f=new THREE.PerspectiveCamera;f.target=new THREE.Vector3(0,0,0);var k=new THREE.PerspectiveCamera;k.target=new THREE.Vector3(0,0,0);b.separation=10;if(a&&a.separation!==void 0)b.separation=a.separation;this.setSize=function(a,e){c.call(b,a,e);g=a/2;h=e};this.render=function(a,c){this.clear();f.fov=c.fov;f.aspect=0.5*c.aspect;f.near=c.near;f.far=
c.far;f.updateProjectionMatrix();f.position.copy(c.position);f.target.copy(c.target);f.translateX(b.separation);f.lookAt(f.target);k.projectionMatrix=f.projectionMatrix;k.position.copy(c.position);k.target.copy(c.target);k.translateX(-b.separation);k.lookAt(k.target);this.setViewport(0,0,g,h);e.call(b,a,f);this.setViewport(g,0,g,h);e.call(b,a,k,!1)}};
/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

  window.requestAnimationFrame = ( function() {

    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

      window.setTimeout( callback, 1000 / 60 );

    };

  } )();

}
var UNIVERSE = UNIVERSE || {};

UNIVERSE.Core3D = function(container) {
    // Variables used to draw the 3D elements
    var camera, projector, renderer, w, h;
	this.scene = null;
    var vector, animate;
	var light;

    var overRenderer;

    // Constants for zooming, rotation, etc.
    var curZoomSpeed = 0;

    var mouse = {
        x : 0,
        y : 0
    }, mouseOnDown = {
        x : 0,
        y : 0
    };
    var rotation = {
        x : 0,
        y : 0
    }, target = {
        x : Math.PI * 3 / 2,
        y : Math.PI / 6.0
    }, targetOnDown = {
        x : 0,
        y : 0
    };

    // set initial distance
    var distance = 50000, distanceTarget = 50000;
    var PI_HALF = Math.PI / 2;

    var maxZoom = 500000;
    var minZoom = 10000;

    var drawnObjects = new Array();

    var resizeTimeout = null;
	var controls;

    function init() {
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;

        setupRenderer();

        // Field of View (View Angle)
        // Ratio between width and height, has to match aspect of CanvasRenderer
        // Near, Far
        camera = new THREE.PerspectiveCamera(30, w / h, 1, 1000000);

        camera.position.z = distance;
        vector = new THREE.Vector3();

        // Scene into which the earth and other objects are displayed
        scene = new THREE.Scene();

        addEventListeners();

		light = new THREE.DirectionalLight( 0xffffff, 0);
		light.position.set( 0, 0, 0 ).normalize();
		scene.add( light );
		// 
		// var ambientLight = new THREE.AmbientLight( 0x000000 );
		// scene.add( ambientLight );

		// Use the controller to control the camera, but only when over the container
		controls = new UniverseTrackballControls( camera, container );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.5;
		controls.panSpeed = 0.2;

		controls.noZoom = false;
		controls.noPan = false;

		// This controls how much inertia the movement has.  Set Damping to higher to
		// stop the movement sooner.  Setting staticMoving to TRUE turns off all inertia
		controls.staticMoving = false;
		controls.dynamicDampingFactor = 0.10;

		controls.minDistance = minZoom;
		controls.maxDistance = maxZoom;

		controls.keys = [ 65, 83, 68 ];

		
        animate();
    }

    function setupRenderer() {
        projector = new THREE.Projector();
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.autoClear = false;
        renderer.setClearColorHex(0x000000, 0.0);
        renderer.setSize(w, h);

        renderer.domElement.style.position = 'absolute';

        container.appendChild(renderer.domElement);
    }

    function addEventListeners() {
        // Add event listeners for rotating, zooming, etc.

        //container.addEventListener('mousedown', onMouseDown, false);
        
        //document.addEventListener('keydown', onDocumentKeyDown, false);

        window.addEventListener('resize', onWindowResize, false);
		
		/*
        container.addEventListener('mouseover', function() {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function() {
            overRenderer = false;
        }, false);
		*/
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
		
		
        //zoom(curZoomSpeed);
		
		// Handle any external zooming or snap-to events
        //console.log("target: " + JSON.stringify(target));
		
		/*
        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.3;

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
        //camera.lookAt(scene.position);
*/
        scaleDrawnObjects();
		
		controls.update();
        renderer.clear();
        renderer.render(scene, camera);
    }

    function scaleDrawnObjects() {
        for(var i in drawnObjects) {
            if(drawnObjects[i].scale == true) {
                var objectPosition = drawnObjects[i].shape.position;
                var xDiff = objectPosition.x - camera.position.x;
                var yDiff = objectPosition.y - camera.position.y;
                var zDiff = objectPosition.z - camera.position.z;
                var distanceFromCamera = Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
                var scaleFactor = distanceFromCamera / (6371 * 7);
                drawnObjects[i].shape.scale.x = drawnObjects[i].shape.scale.y = drawnObjects[i].shape.scale.z = scaleFactor;
            }
        }
    }

    // Stock Behaviors like rotating and zooming
    function onMouseDown(event) {
        event.preventDefault();

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('mouseout', onMouseOut, false);

        mouseOnDown.x = -event.clientX;
        mouseOnDown.y = event.clientY;

        targetOnDown.x = target.x;
        targetOnDown.y = target.y;

        container.style.cursor = 'move';
    }

    function onMouseMove(event) {
        mouse.x = -event.clientX;
        mouse.y = event.clientY;

        var zoomDamp = distance / (35000);

        target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

        target.y = target.y > PI_HALF ? PI_HALF : target.y;
        target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
    }

    function onMouseUp(event) {
        event.preventDefault();

        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
        container.style.cursor = 'auto';
    }

    function onMouseOut(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }



    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 38:
                zoom(3200);
                event.preventDefault();
                break;
            case 40:
                zoom(-3200);
                event.preventDefault();
                break;
        }
    }

    function onWindowResize(event) {
        // so right now this event was fired when the entire window was resized,
        // but the individual dom elements haven't been resized yet. We will wait
        // a bit then execute the actual resize code so we can use the updated
        // element sizes.
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resize();
        }, 250);

    }

    function resize() {
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
		controls.screen.width = w;
		controls.screen.height = h;
    }

    function zoom(delta) {
		// Extend the THREE.TrackballControls functionality by setting internal zoom variables
		// Remember that this is called in the context of the window and not the UNIVERSE object, so 
		// we have to provide the context to the controls object
		console.log("In Zoom: "+delta);
		controls.setZoom(delta);

        //distanceTarget -= delta;
        //distanceTarget = distanceTarget > maxZoom ? maxZoom : distanceTarget;
        //distanceTarget = distanceTarget < minZoom ? minZoom : distanceTarget;
    }

    // Priviledged Methods
    this.draw = function(id, shape, scale) {
        if(drawnObjects[id] == undefined) {
            if(shape != undefined) {
				scene.add(shape);
			}
            drawnObjects[id] = {
                shape : shape,
                scale : scale
            };
        }
    }
	
    this.showObject = function(id, isShown) {
        // if object exists in drawnObjects then add back to scene
        if (drawnObjects[id] != undefined) {
            if(isShown) {
                scene.add(drawnObjects[id].shape);
            }
            else {
                scene.remove(drawnObjects[id].shape);
            }
        }
    }
    
    this.removeObject = function(id) {
        if(drawnObjects[id] != undefined) {
			if(drawnObjects[id].shape != undefined) {
				scene.remove(drawnObjects[id].shape);
			}
            delete drawnObjects[id];
        }
    }
    
    this.removeAllObjects = function() {
        for(var i in drawnObjects) {
			if(drawnObject[id].shape != undefined) {
				scene.remove(drawnObjects[i].shape);
			}
        }
        drawnObjects = new Array();
    }
	
    this.getObjectPosition = function(id) {
        if(drawnObjects[id] == undefined) {
            return undefined;
        }
        return drawnObjects[id].shape.position;
    }
	
    this.moveCameraTo = function(position_vector) {
        // This method converts a position into the rotation coordinate system used to move the camera
        // The target.x parameter is the rotation angle from the positive Z axis
        // target.y is the rotation angle away from the z-x plane

        // sets the distance from the center of the scene the camera will end up
        distanceTarget = position_vector.length();

/*

	    
	    
        // unit vectors along the z and y axis
        var zAxisVector = new THREE.Vector3(0,0,1);
        var yAxisVector = new THREE.Vector3(0,1,0);
	    
        // vector that removes the y component of the target vector for purpose of calculating the angle
        // between it the input position_vector and the y-z plane
        var positionY0Vector = new THREE.Vector3();
        positionY0Vector.copy(position_vector);
        
        // set the y to zero and normalize to unit length
        positionY0Vector.y = 0;
        positionY0Vector.normalize();
        
        //normalize the position_vector to unit length
        position_vector.normalize();
	    
        // calculates the angle between the positive y axis and the input position vector
        // then subtract this from 90 degrees to shift it to be from the z-x plane
        var y = (Math.PI/2) - Math.acos(yAxisVector.dot(position_vector));
	    
        // calculate the angle between the input vector projected on the z-x plane and the z-axis
        var x = Math.acos(zAxisVector.dot(positionY0Vector));
	    
        // since the above calculation will return between 0 and 180 degrees, invert it if we're in the
        // negative x direction
        if(positionY0Vector.x < 0) {
            x = -x;
        }
	    
        // set it to zero if NaN
        target.y = isNaN(y) ? 0 : y;
        target.x = isNaN(x) ? 0 : x;

*/
/*
		// Set the camera position to where it needs to go
		// This may fight with the controller object....not sure
        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
*/
        //var distance += (distanceTarget - distance) * 0.3;

/*
        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
  */
 		position_vector.multiplyScalar(1.3);
  		camera.position.copy(position_vector);
        camera.lookAt(scene.position);

	    
    }
    
    
    this.addRotationToCameraTarget = function(xRotation, yRotation) {
        if(xRotation != undefined) {
            target.x += xRotation;
        }
        
        if(yRotation != undefined) {
            target.y += yRotation;
        }
    }

	this.updateLight = function(position, intensity) {
		light.position = position;
		light.intensity = intensity;
	}
	
    init();

    return this;

};
var UNIVERSE = UNIVERSE || {};

/** 
	A graphics object to be drawn in the Universe
	@constructor
	@param {string} id - Identifier for the object to be referenced later
	@param {string} objectName - A name for the object if different than id.  Set to the id if not defined
	@param {function} updateFunction - A function(elapsedTime) that gets called each time the Universe time changes
	@param {function} drawFunction - A function that should call Universe.draw with the object's model
 */

UNIVERSE.GraphicsObject = function(id, modelName, currentLocation, updateFunction, drawFunction) {
	if(id == undefined)
	{ 
		return undefined;
	}
	this.id = id;
	this.modelName = modelName || id;
	this.currentLocation = currentLocation;
	this.update = updateFunction;
	this.draw = drawFunction;
}

UNIVERSE.GraphicsObject.prototype = {
	constructor: UNIVERSE.GraphicsObject,
	
	set: function ( id, modelName, currentLocation, updateFunction, drawFunction ) {

		this.id = id;
		this.modelName = modelName;
		this.currentLocation = currentLocation;
		this.update = updateFunction;
		this.draw = drawFunction;

		return this;
	},
}
var UNIVERSE = UNIVERSE || {};

UNIVERSE.ObjectLibrary = function() {
    var objects = new Array();
    var numberOfElements = 0;

    // adds a mesh object to the object library
    // id -> unique id of the object
    // url -> url used to retrieve the json of the model
    // material -> material to apply to the model's geometry
    this.addGeometryObjectFromUrl = function(id, url, callback) {
        // if we have already loaded an onject with this id, return
        if (objects[id] != undefined) {
            callback();
            return;
        }
        
        // Have to do this to avoid a race condition and avoid requesting it every time
        objects[id] = "loading";

        // use a JSON loader to load the mesh from JSON
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load({
            model : url,
            callback : function(geometry) {
                //var mesh = new THREE.Mesh(geometry, material);
                
                // add the object to our list of objects
                objects[id] = geometry;
                //numberOfElements++;
                //console.log("objects after add: " + JSON.stringify(objects));
                //console.log("numberOfElements after add: " + JSON.stringify(numberOfElements))

                // execute the callback
                callback();
            }
        });
        
    }

    // gets an object from the library based on the given id
    this.getObjectById = function(id, callback) {
        //console.log("number of elements: " + numberOfElements);
        var object = objects[id];
        var objectLib = this;
        if(object == "loading") {
            setTimeout(function() {objectLib.getObjectById(id, callback)}, 1000)
        }
        else if (object == null)
            throw "Tried to retrieve object [" + id + "] from object library but didn't exist";
        else
            callback(object);
    }
    
    this.setObject = function(id, object) {
        objects[id] = object;
    }
}
var UNIVERSE = UNIVERSE || {};

UNIVERSE.UniverseController = function(theRefreshRate) {
    var graphicsObjects = new Array();

    // Timeout that runs the animation, will be cleared when paused
    var refreshTimeout;

    // number of milliseconds between calls to update() (frame rate / refresh rate)
    var refreshRate = theRefreshRate || 30;

    // the last time we called update() in ms since jsDate epoch
    var lastUpdateMs = 0;

    function update() {
        // determine how much time has elapsed since update has last been called
        var nowMs = (new Date()).getTime();
        var elapsedTime = nowMs - lastUpdateMs;
        // save now as the last time we've updated
        lastUpdateMs = nowMs;
        // causes terrible performance... only enable if needed for debugging!
        // logger.debug("now [" + nowMs + "] elapsed ms [" + elapsedTime + "]");
        // update and draw all graphics objects
        for(var i in graphicsObjects) {
            graphicsObjects[i].update(elapsedTime);
            graphicsObjects[i].draw();
        }

        // call update() again in a certain number of milliseconds
        refreshTimeout = setTimeout(function() {
            update();
        }, refreshRate);
    }

    this.updateOnce =function() {
        for(var i in graphicsObjects) {
            graphicsObjects[i].update(null);
            graphicsObjects[i].draw();
        }
    }

    // id
    // objectName
    // updateFunction
    this.addGraphicsObject = function(graphicsObject) {
        graphicsObjects[graphicsObject.id] = graphicsObject;
        //this.updateOnce();
    }
    
    this.removeGraphicsObject = function(id) {
        delete graphicsObjects[id];
    }

    this.play = function() {
        // set our last update time to now since this is the first update
        lastUpdateMs = (new Date()).getTime();
        update();
    };

    this.pause = function() {
        clearTimeout(refreshTimeout);
    };
    
    this.removeAllGraphicsObjects = function () {
        graphicsObjects = new Array();
    }
    
    this.getGraphicsObjects = function() {
        return graphicsObjects;
    }

	this.getGraphicsObjectById = function(id) {
		return graphicsObjects[id];
	}
};

UNIVERSE.UniverseController.prototype.changeRefreshRate = function(rateInMilliseconds) {
    this.refreshRate = rateInMilliseconds;
}
/**
 *   Slight modification from the THREE.TrackballControls
 *   in order to access the zoom controls externally 
 */

/*

*/

UniverseTrackballControls = function ( object, domElement ) {

	var _this = this,
	STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
	this.radius = ( this.screen.width + this.screen.height ) / 4;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3( 0, 0, 0 );

	var _keyPressed = false,
	_state = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();


	// methods
	this.setZoom = function(delta)
	{
		//console.log("setZoom called with: " + delta)
		_zoomStart.y = 0;
		_zoomEnd.y = -1 * (delta/50000);
	}	

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function( clientX, clientY ) {

		return new THREE.Vector2(
			( clientX - _this.screen.offsetLeft ) / _this.radius * 0.5,
			( clientY - _this.screen.offsetTop ) / _this.radius * 0.5
		);

	};

	this.getMouseProjectionOnBall = function( clientX, clientY ) {

		var mouseOnBall = new THREE.Vector3(
			( clientX - _this.screen.width * 0.5 - _this.screen.offsetLeft ) / _this.radius,
			( _this.screen.height * 0.5 + _this.screen.offsetTop - clientY ) / _this.radius,
			0.0
		);

		var length = mouseOnBall.length();

		if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye.copy( _this.object.position ).subSelf( _this.target );

		var projection = _this.object.up.clone().setLength( mouseOnBall.y );
		projection.addSelf( _this.object.up.clone().crossSelf( _eye ).setLength( mouseOnBall.x ) );
		projection.addSelf( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = ( new THREE.Vector3() ).cross( _rotateStart, _rotateEnd ).normalize(),
				quaternion = new THREE.Quaternion();

			angle *= _this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			quaternion.multiplyVector3( _eye );
			quaternion.multiplyVector3( _this.object.up );

			quaternion.multiplyVector3( _rotateEnd );

			if ( _this.staticMoving ) {

				_rotateStart = _rotateEnd;

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
				quaternion.multiplyVector3( _rotateStart );

			}

		}

	};

	this.zoomCamera = function() {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			_eye.multiplyScalar( factor );

			if ( _this.staticMoving ) {

				_zoomStart = _zoomEnd;

			} else {

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	this.panCamera = function() {

		var mouseChange = _panEnd.clone().subSelf( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

			var pan = _eye.clone().crossSelf( _this.object.up ).setLength( mouseChange.x );
			pan.addSelf( _this.object.up.clone().setLength( mouseChange.y ) );

			_this.object.position.addSelf( pan );
			_this.target.addSelf( pan );

			if ( _this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.addSelf( mouseChange.sub( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function() {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _this.object.position.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.setLength( _this.maxDistance );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.add( _this.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function() {

		_eye.copy( _this.object.position ).subSelf( this.target );

		if ( !_this.noRotate ) {

			_this.rotateCamera();

		}
		
		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.add( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

	};


	// listeners

    function onMouseWheel(event) {
        event.preventDefault();
        _this.setZoom(event.wheelDeltaY);
        return false;
    }
    
    function onMouseWheelFF(event) {
        event.preventDefault();
        var delta = event.detail? event.detail*(-120) : event.wheelDelta
        _this.setZoom(delta);
        return false;
    }



	function keydown( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {

			_state = STATE.PAN;

		}

		if ( _state !== STATE.NONE ) {

			_keyPressed = true;

		}

	};

	function keyup( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			_state = STATE.NONE;

		}

	};

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

			if ( _state === STATE.ROTATE && !_this.noRotate ) {

				_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

			} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

				_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			} else if ( !this.noPan ) {

				_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			}

		}

	};

	function mousemove( event ) {

		if ( ! _this.enabled ) return;

		if ( _keyPressed ) {

			_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );
			_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			_keyPressed = false;

		}

		if ( _state === STATE.NONE ) {

			return;

		} else if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );
			//console.log("_zoomStart:" + _zoomStart.y + "   _zoomEnd:" + _zoomEnd.y);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		}

	};

	function mouseup( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', mousemove, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mouseup', mouseup, false );
        
	this.domElement.addEventListener('mousewheel', onMouseWheel, false);
    this.domElement.addEventListener('DOMMouseScroll', onMouseWheelFF, false);
		
	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

};
/**
	Universe.js Classes
*/
var UNIVERSE = UNIVERSE || {};

/** 
	A simple Universe for drawing 3D modeling and simulation using WebGL
	@constructor
	@param {Date} time - The current universe time
	@param {double} refreshRate - The refresh rate for the universe in milliseconds
	@param {DOMElement} container - the container where the Universe will be drawn
 */
UNIVERSE.Universe = function(time, refreshRate, container) {
    var controller = new UNIVERSE.UniverseController(refreshRate);
    var core = new UNIVERSE.Core3D(container);
    var objectLibrary = new UNIVERSE.ObjectLibrary();

    // options

    var currentUniverseTime = time;
    var playbackSpeed = 1;

    /**
		function to call when we have a new state object
		@private
	*/
    var stateChangedCallback = function() {
    };

    // milliseconds between updating our state object that we broadcast
    // to any listeners
    var timeBetweenStateUpdatesMs = 1000;

    // timeout for updating state
    var updateStateTimeout;

    var universe = this;

    // OBJECT LIBRARY DEFAULTS
    
    objectLibrary.setObject("default_geometry", new THREE.Geometry());
    objectLibrary.setObject("default_material", new THREE.MeshFaceMaterial());

    // PRIVATE METHODS
    
    /**
		fires a state changed event to the callback
		@private
	*/
    function fireStateChanged(state) {
        if(stateChangedCallback != null) {
            stateChangedCallback(state);
        }
    }

	/**
		adds an object that updates the currentUniverseTime using the playback speed
		@private
	*/
    function addSimStateObject() {
        controller.addGraphicsObject({
            id : "simState",
            objectName : "simState",
            update : function(elapsedTime) {
				if(elapsedTime != null) {
					currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed * elapsedTime);
				}
            },
            draw : function() {
            }
        });
    }

	/**
		gets called at our state update interfal and fires the state change callback
		@private
	*/
    function updateState() {
        //create our state object and notify our listener
        var universe = this;
        var state = {};
        state.currentUniverseTime = new Date(currentUniverseTime);

        fireStateChanged(state);

        // call update() again in a certain number of milliseconds
        updateStateTimeout = setTimeout(function() {
            updateState();
        }, timeBetweenStateUpdatesMs);
    }
    
    // PROTECTED METHODS (API METHODS)
    
	/**
		Start playback for the universe
		@public
		@param {date} startTime
		@param {double} newPlaybackSpeed
		@param {function} newStateChangedCallback
	 */
    this.play = function(startTime, newPlaybackSpeed, newStateChangedCallback) {
		if(startTime != undefined) {
			currentUniverseTime = new Date(startTime);
		}
 		if(newPlaybackSpeed != undefined) {
			playbackSpeed = newPlaybackSpeed;
	 	}
        
		if(newStateChangedCallback != undefined) {
			stateChangedCallback = newStateChangedCallback;
		}
        
        // update state our first time
        updateState();

        controller.play();
    };

    /**
		Pause playback for the universe
		@public
	*/
    this.pause = function() {
        clearTimeout(updateStateTimeout);
        controller.pause();
    };

	/**
		Set the playback speed for the Universe
		@public
	    @param {Double} speed
	 */
    this.setPlaybackSpeed = function(speed) {
        playbackSpeed = speed;
    }

	/**
		Set the current time of the Universe
		@public
	    @param {Date} newUniverseTime
	 */
    this.setCurrentUniverseTime = function(newUniverseTime) {
        currentUniverseTime = new Date(newUniverseTime);
        controller.updateOnce();
    }

	/**
		Get the current time of the Universe
		@public
	*/
    this.getCurrentUniverseTime = function() {
        return currentUniverseTime;
    }

    /**
    	Add a geometry to the universe with an ID and url to retrieve the model's geometry
		@public
		@param {string} modelId
		@param {string} modelUrl - URL for the THREE.js format geometry model
		@param {function} callback - callback function that gets called when the geometry is done loading
	*/
    this.addJsonGeometryModel = function(modelId, modelUrl, callback) {
        if (modelId != undefined){
            objectLibrary.addGeometryObjectFromUrl(modelId, modelUrl, callback);
        } else {
            callback();
        }
    };

	/**
    	Add an object to the universe
		@public
		@param {UNIVERSE.GraphicsObject} object
	*/
	this.addObject = function(object) {
		controller.addGraphicsObject(object);
	}
	
	/**
    	Draws an object in the Universe
		@public
		@param {string} id - identifier for the object
		@param {THREE.Mesh} mesh - THREE.js mesh for the object
		@param {boolean} isScale - specifies whether the object should be scaled to always be the same as the camera moves
	*/
	this.draw = function(id, mesh, isScale) {
		core.draw(id, mesh, isScale);
	}
	
	/**
    	Removes an object from the Universe
		@public
		@param {string} id - identifier for the object
	*/
	this.unDraw = function(id) {
		core.removeObject(id);
	}
	
	/**
    	Add an object to the Universe.js object pipeline.  
		This is useful for storing things that take up GPU memory like geometries so you can reuse them.
		@public
		@param {string} id - identifier for the object
		@param {Object} object - any object you want to store for later retrieval
	*/
	this.setObjectInLibrary = function(id, object) {
		objectLibrary.setObject(id, object);
	}
	
	/**
    	Retrieves an object from the Universe.js object pipeline
		@public
		@param {string} id - identifier for the object
		@param {function} callback - method to be called with the retrieved object
	*/
	this.getObjectFromLibraryById = function(id, callback) {
		objectLibrary.getObjectById(id, callback);
	}
	
	/**
		Remove an object completely from the Universe
		@public
		@param {string} id - identifier for the object
	*/
    this.removeObject = function(id) {
        controller.removeGraphicsObject(id);
        core.removeObject(id);
    }

	/**
		Snap the Universe's camera to be directly behind an object
		@public
		@param {string} id - identifier for the object
	*/
    this.snapToObject = function(id) {
        // get the object's position and copy it into a vector
        var position = core.getObjectPosition(id);
        if(position != undefined) {
            var vector = new THREE.Vector3();
            vector.copy(position);
    
            // move the point the camera will be at out a bit so we are behind the object
            vector.multiplyScalar(1.4);
    
            // tell the core to move to the vector
            core.moveCameraTo(vector);
        }
        else {
			// Object is not added to the core so not doing anything
        }
    }
    
    this.addRotationToCamera = function(xRotation, yRotation) {
        core.addRotationToCameraTarget(xRotation, yRotation);
    }

	/**
		Remove all objects from the Universe
		@public
	*/
    this.removeAll = function() {
        core.removeAllObjects();
        controller.removeAllGraphicsObjects();
    }
    
	/**
		Get all of the objects currently in the Universe
		@public
	*/
    this.getGraphicsObjects = function() {
        return controller.getGraphicsObjects();
    }

	/**
		Get a graphics object by its id
		@public
		@param {string} id
	*/
	this.getGraphicsObjectById = function(id) {
		return controller.getGraphicsObjectById(id);
	}
	
	/**
		@ignore
	*/
    this.updateObject = function(id, propertyName, propertyValue) {
        // TODO: Implement or delete
    }

	this.updateOnce = function() {
		controller.updateOnce();
	}

	/**
		Toggle whether an object is visible in the Universe
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled - whether the object is visible or not
	*/
	this.showObject = function(id, isEnabled) {
		core.showObject(id, isEnabled);
	}
	
	this.updateLight = function(x, y, z, intensity) {
		core.updateLight(new THREE.Vector3(x, y, z), intensity);
	}

	/**
		Basic setup method, needs to be called after all objects are removed from the Universe
		@public
	*/
    this.setup = function() {
        addSimStateObject();
    }

    this.setup();
};
