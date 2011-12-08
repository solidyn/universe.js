var SSI=SSI||{};SSI.Core3D=function(z){var o,t,C,A,B,L;var d,H;var f;var k=0;var v={x:0,y:0},s={x:0,y:0};var u={x:0,y:0},a={x:Math.PI*3/2,y:Math.PI/6},m={x:0,y:0};var q=50000,y=50000;var p=Math.PI/2;var j=500000;var i=10000;var D=new Array();var c=null;function I(){B=z.offsetWidth||window.innerWidth;L=z.offsetHeight||window.innerHeight;J();o=new THREE.PerspectiveCamera(30,B/L,1,1000000);o.position.z=q;d=new THREE.Vector3();t=new THREE.Scene();r();H()}function J(){C=new THREE.Projector();A=new THREE.WebGLRenderer({antialias:true});A.autoClear=false;A.setClearColorHex(0,0);A.setSize(B,L);A.domElement.style.position="absolute";z.appendChild(A.domElement)}function r(){z.addEventListener("mousedown",K,false);z.addEventListener("mousewheel",E,false);z.addEventListener("DOMMouseScroll",F,false);document.addEventListener("keydown",N,false);window.addEventListener("resize",g,false);z.addEventListener("mouseover",function(){f=true},false);z.addEventListener("mouseout",function(){f=false},false)}function H(){requestAnimationFrame(H);x()}function x(){G(k);u.x+=(a.x-u.x)*0.1;u.y+=(a.y-u.y)*0.1;q+=(y-q)*0.3;o.position.x=q*Math.sin(u.x)*Math.cos(u.y);o.position.y=q*Math.sin(u.y);o.position.z=q*Math.cos(u.x)*Math.cos(u.y);o.lookAt(t.position);d.copy(o.position);l();A.clear();A.render(t,o)}function l(){for(var O in D){if(D[O].scale==true){var R=D[O].shape.position;var S=R.x-o.position.x;var P=R.y-o.position.y;var h=R.z-o.position.z;var w=Math.sqrt(S*S+P*P+h*h);var Q=w/(6371*7);D[O].shape.scale.x=D[O].shape.scale.y=D[O].shape.scale.z=Q}}}function K(h){h.preventDefault();z.addEventListener("mousemove",b,false);z.addEventListener("mouseup",M,false);z.addEventListener("mouseout",e,false);s.x=-h.clientX;s.y=h.clientY;m.x=a.x;m.y=a.y;z.style.cursor="move"}function b(h){v.x=-h.clientX;v.y=h.clientY;var w=q/(35000);a.x=m.x+(v.x-s.x)*0.005*w;a.y=m.y+(v.y-s.y)*0.005*w;a.y=a.y>p?p:a.y;a.y=a.y<-p?-p:a.y}function M(h){h.preventDefault();z.removeEventListener("mousemove",b,false);z.removeEventListener("mouseup",M,false);z.removeEventListener("mouseout",e,false);z.style.cursor="auto"}function e(h){z.removeEventListener("mousemove",b,false);z.removeEventListener("mouseup",M,false);z.removeEventListener("mouseout",e,false)}function E(h){h.preventDefault();if(f){G(h.wheelDeltaY*(10))}return false}function F(h){h.preventDefault();if(f){var w=h.detail?h.detail*(-120):h.wheelDelta;G(w*(10))}return false}function N(h){switch(h.keyCode){case 38:G(3200);h.preventDefault();break;case 40:G(-3200);h.preventDefault();break}}function g(h){clearTimeout(c);c=setTimeout(function(){n()},250)}function n(){logger.debug("resize");B=z.offsetWidth||window.innerWidth;L=z.offsetHeight||window.innerHeight;o.aspect=B/L;o.updateProjectionMatrix();A.setSize(B,L)}function G(h){y-=h;y=y>j?j:y;y=y<i?i:y}this.draw=function(O,h,w){if(D[O]==undefined){logger.debug(" adding and drawing: "+O);t.add(h);D[O]={shape:h,scale:w}}};this.showObject=function(w,h){if(D[w]!=undefined){if(h){logger.debug("adding shape back to scene for id "+w);t.add(D[w].shape)}else{logger.debug("removing object from scene with id: "+w);t.remove(D[w].shape)}}};this.removeObject=function(h){if(D[h]!=undefined){t.remove(D[h].shape);delete D[h]}};this.removeAllObjects=function(){for(var h in D){t.remove(D[h].shape)}D=new Array()};this.getObjectPosition=function(h){if(D[h]==undefined){return undefined}return D[h].shape.position};this.moveCameraTo=function(O){logger.debug("Moving camera to: "+JSON.stringify(O));y=O.length();var w=new THREE.Vector3(0,0,1);var Q=new THREE.Vector3(0,1,0);var P=new THREE.Vector3();P.copy(O);P.y=0;P.normalize();O.normalize();var R=(Math.PI/2)-Math.acos(Q.dot(O));var h=Math.acos(w.dot(P));if(P.x<0){h=-h}a.y=isNaN(R)?0:R;a.x=isNaN(h)?0:h;logger.debug("target: "+JSON.stringify(a))};I();return this};var SSI=SSI||{};SSI.ObjectLibrary=function(){var a=new Array();var b=0;this.addGeometryObjectFromUrl=function(f,d,e){logger.debug("Adding mesh object to library; id: ["+f+"] url: ["+d+"]");if(a[f]!=undefined){logger.debug("Object with id ["+f+"] already exists so not adding");e();return}a[f]="loading";var c=new THREE.JSONLoader();c.load({model:d,callback:function(g){a[f]=g;e()}})};this.getObjectById=function(f,e){logger.debug("Retrieving object with id ["+f+"] from library");var c=a[f];var d=this;if(c=="loading"){setTimeout(function(){d.getObjectById(f,e)},1000)}else{if(c==null){throw"Tried to retrieve object ["+f+"] from object library but didn't exist"}else{e(c)}}};this.setObject=function(d,c){a[d]=c}};var SSI=SSI||{};SSI.Universe=function(e,k){var m=new SSI.UniverseController({});var t=new SSI.Core3D(k);var l=new SSI.ObjectLibrary();var f=6371;var h=e.currentUniverseTime;var i=1;var j=function(){};var p=1000;var d;var o=this;var a=new THREE.Vector3(0,0,0);l.setObject("default_geometry",new THREE.Geometry());l.setObject("default_material",new THREE.MeshFaceMaterial());l.setObject("default_ground_object_geometry",new THREE.SphereGeometry(300,20,10));l.setObject("default_ground_object_material",new THREE.MeshLambertMaterial({color:52224}));l.setObject("default_ground_track_material",new THREE.MeshBasicMaterial({color:13369344,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending}));l.setObject("default_sensor_projection_material",new THREE.MeshBasicMaterial({color:16755200,transparent:true,blending:THREE.AdditiveBlending,overdraw:true,opacity:0.15}));l.setObject("default_orbit_line_material",new THREE.LineBasicMaterial({color:10027008,opacity:1}));l.setObject("default_ground_object_tracing_line_material",new THREE.LineBasicMaterial({color:39168,opacity:1}));var n=undefined;function s(u){if(j!=null){j(u)}}function q(){m.addGraphicsObject({id:"simState",objectName:"simState",update:function(u){h.setTime(h.getTime()+i*u)},draw:function(){}})}function c(){var v=this;var u={};u.currentUniverseTime=new Date(h);s(u);d=setTimeout(function(){c()},p)}this.play=function(u){h=new Date(u.startTime);i=u.playbackSpeed;j=u.stateChangedCallback;logger.debug("Universe.play() called with time ["+h+"], speed: ["+i+"]");c();m.play()};this.pause=function(){clearTimeout(d);m.pause()};this.setPlaybackSpeed=function(u){i=u};this.setCurrentUniverseTime=function(u){h=new Date(u);m.updateOnce()};this.getCurrentUniverseTime=function(){return h};this.addEarth=function(B){var A=40,y=30;var z=new THREE.SphereGeometry(f,A,y);var w={uniforms:{texture:{type:"t",value:0,texture:null}},vertexShader:["varying vec3 vNormal;","varying vec2 vUv;","void main() {","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","vNormal = normalize( normalMatrix * normal );","vUv = uv;","}"].join("\n"),fragmentShader:["uniform sampler2D texture;","varying vec3 vNormal;","varying vec2 vUv;","void main() {","vec3 diffuse = texture2D( texture, vUv ).xyz;","float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );","vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );","gl_FragColor = vec4( diffuse + atmosphere, 1.0 );","}"].join("\n")};var u=THREE.UniformsUtils.clone(w.uniforms);u.texture.texture=THREE.ImageUtils.loadTexture(B.image);var v=new THREE.ShaderMaterial({uniforms:u,vertexShader:w.vertexShader,fragmentShader:w.fragmentShader});var x=new THREE.Mesh(z,v);m.addGraphicsObject({id:"earth",objectName:"earth",update:function(C){var D=CoordinateConversionTools.convertTimeToGMST(h);x.rotation.y=D*(2*Math.PI/360)},draw:function(){t.draw(this.id,x,false)}})};this.addMoon=function(D){var A=40,u=30;var v=1737.1;var C={x:-360680.9359251,y:-42332.8629642,z:-30945.6526294,x_dot:0.1634206,y_dot:-1.0634127,z_dot:0.0412856,epoch:D.epoch};var z=new THREE.SphereGeometry(v,A,u);var x={uniforms:{texture:{type:"t",value:0,texture:null}},vertexShader:["varying vec3 vNormal;","varying vec2 vUv;","void main() {","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","vNormal = normalize( normalMatrix * normal );","vUv = uv;","}"].join("\n"),fragmentShader:["uniform sampler2D texture;","varying vec3 vNormal;","varying vec2 vUv;","void main() {","vec3 diffuse = texture2D( texture, vUv ).xyz;","float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );","vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );","gl_FragColor = vec4( diffuse + atmosphere, 1.0 );","}"].join("\n")};var B=THREE.UniformsUtils.clone(x.uniforms);B.texture.texture=THREE.ImageUtils.loadTexture(D.image);var y=new THREE.ShaderMaterial({uniforms:B,vertexShader:x.vertexShader,fragmentShader:x.fragmentShader});var w=new THREE.Mesh(z,y);m.addGraphicsObject({id:"moon",objectName:"moon",stateVector:C,update:function(E){var H=new ECICoordinates(this.stateVector.x,this.stateVector.y,this.stateVector.z,this.stateVector.x_dot,this.stateVector.y_dot,this.stateVector.z_dot);var I=new Date(o.getCurrentUniverseTime());var E=(I.getTime()-this.stateVector.epoch.getTime())/1000;var G=OrbitPropagator.propagateOrbit(H,E,100,this.stateVector.epoch);var F=b({x:G.x,y:G.y,z:G.z});w.position={x:F.x,y:F.y,z:F.z}},draw:function(){t.draw(this.id,w,false)}})};this.addJsonGeometryModel=function(w,u,v){logger.debug("Adding mesh model to universe; id: ["+w+"] url: ["+u+"]");if(w!=undefined){l.addGeometryObjectFromUrl(w,u,v)}else{v()}};this.addSpaceObject=function(w){var v,u;l.getObjectById(w.modelId,function(x){v=x;l.getObjectById("default_material",function(y){u=y;v.applyMatrix(new THREE.Matrix4().setRotationFromEuler(new THREE.Vector3(0,Math.PI,0)));var z=new THREE.Mesh(v,u);m.addGraphicsObject({id:w.id,objectName:w.objectName,update:function(A){var B=b(w.propagator());if(B!=undefined){z.position.set(B.x,B.y,B.z);z.lookAt(a)}},draw:function(){t.draw(this.id,z,false);o.showModelForId(w.showVehicle,this.id)}});o.addPropogationLineForObject(w);o.showOrbitLineForObject(w.showPropogationLine,w.id);o.addGroundTrackPointForObject(w);o.showGroundTrackForId(w.showGroundTrackPoint,w.id);o.addSensorProjection(w);o.showSensorProjectionForId(w.showSensorProjections,w.id);o.addClosestGroundObjectTracingLine(w)})})};this.addGroundObject=function(v){var x,u,w;if(!v.modelId){v.modelId="default_ground_object_geometry";w="default_ground_object_material"}else{w="default_material"}l.getObjectById(v.modelId,function(y){x=y;l.getObjectById(w,function(A){u=A;x.applyMatrix(new THREE.Matrix4().setRotationFromEuler(new THREE.Vector3(Math.PI/2,Math.PI,0)));var z=new THREE.Mesh(x,u);m.addGraphicsObject({id:v.id,objectName:v.objectName,currentLocation:undefined,update:function(D){var C=b(v.propagator());z.position.set(C.x,C.y,C.z);this.currentLocation={x:C.x,y:C.y,z:C.z};var B=new THREE.Vector3(C.x,C.y,C.z);B.multiplyScalar(1.4);z.lookAt(B)},draw:function(){t.draw(this.id,z,true)}})})})};this.addPropogationLineForObject=function(v){var w,u;w=new THREE.Geometry();l.getObjectById("default_orbit_line_material",function(B){u=B;var D=new Date(h);var z=1440;for(var A=0;A<z;A+=5){var C=b(v.propagator(D,false));if(C!=undefined){var y=new THREE.Vector3(C.x,C.y,C.z);w.vertices.push(new THREE.Vertex(y))}D.setMinutes(D.getMinutes()+5)}var x=new THREE.Line(w,u);m.addGraphicsObject({id:v.id+"_propogation",objectName:v.objectName,update:function(E){},draw:function(){t.draw(this.id,x,false)}})})};this.addGroundTrackPointForObject=function(v){var w,u;l.getObjectById("default_ground_object_geometry",function(x){w=x;l.getObjectById("default_ground_track_material",function(z){u=z;var y=new THREE.Mesh(w,u);m.addGraphicsObject({id:v.id+"_groundPoint",objectName:v.objectName,update:function(B){var C=b(v.propagator(undefined,false));if(C!=undefined){var A=new THREE.Vector3(C.x,C.y,C.z);A.multiplyScalar(f/A.length());y.position.copy(A)}},draw:function(){t.draw(this.id,y,true)}})})})};this.addSensorProjection=function(x){var y,v;var B=b(x.propagator(undefined,false));if(B!=undefined){var u=1;y=new SensorPatternGeometry(u);var z=new THREE.Vector3(B.x,B.y,B.z);var w=z.length()-f;var A=0.15;l.getObjectById("default_sensor_projection_material",function(C){v=C;var D=new THREE.Mesh(y,v);D.doubleSided=true;m.addGraphicsObject({id:x.id+"_sensorProjection",objectName:x.objectName,update:function(F){var G=b(x.propagator(undefined,false));if(G!=undefined){var E=new THREE.Vector3(G.x,G.y,G.z);D.position.copy(E);D.scale.z=E.length()-f+200;D.scale.x=D.scale.y=D.scale.z*A;var H=new THREE.Vector3(0,0,0);D.lookAt(H)}},draw:function(){t.draw(this.id,D,false)}})})}};this.addClosestGroundObjectTracingLine=function(v){var w,u;l.getObjectById("default_ground_object_tracing_line_material",function(y){u=y;var x=undefined;m.addGraphicsObject({id:v.id+"_controlLine",objectName:v.objectName,update:function(A){var D=b(v.propagator(undefined,false));var C=g(D);if(C!=undefined){w=new THREE.Geometry();var z=new THREE.Vector3(D.x,D.y,D.z);w.vertices.push(new THREE.Vertex(z));var B=new THREE.Vector3(C.currentLocation.x,C.currentLocation.y,C.currentLocation.z);w.vertices.push(new THREE.Vertex(B));x=new THREE.Line(w,u)}},draw:function(){t.removeObject(this.id);if(x!=undefined){t.draw(this.id,x,false);if(n!=undefined){o.showControlLineForId(n,v.id)}else{o.showControlLineForId(v.showControlLine,v.id)}}}})})};function g(u){var v=new THREE.Vector3(u.x,u.y,u.z);v.multiplyScalar(f/v.length());return r(v)}function r(x){var v=m.getGraphicsObjects();var A=undefined;var y=undefined;for(var w in v){if(v[w].currentLocation!=undefined){var u=new THREE.Vector3(v[w].currentLocation.x,v[w].currentLocation.y,v[w].currentLocation.z);var z=u.distanceTo(x);if(A==undefined||z<A){y=v[w];A=z}}}return y}this.showAllOrbitLines=function(w){var u=m.getGraphicsObjects();for(var v in u){if(u[v].id.indexOf("_propogation")!=-1){t.showObject(u[v].id,w)}}};this.showOrbitLineForObject=function(u,v){logger.debug("in show orbit lines "+u);t.showObject(v+"_propogation",u)};this.showModelForId=function(u,v){logger.debug("show/hiding vehicle model "+u);t.showObject(v,u)};this.showAllGroundTracks=function(w){var u=m.getGraphicsObjects();for(var v in u){if(u[v].id.indexOf("_groundPoint")!=-1){t.showObject(u[v].id,w)}}};this.showGroundTrackForId=function(u,v){logger.debug("show/hiding groundTrack, isEnabled: "+u+" id: "+v);t.showObject(v+"_groundPoint",u)};this.showAllSensorProjections=function(w){var u=m.getGraphicsObjects();for(var v in u){if(u[v].id.indexOf("_sensorProjection")!=-1){t.showObject(u[v].id,w)}}};this.showSensorProjectionForId=function(u,v){t.showObject(v+"_sensorProjection",u)};this.showAllControlLines=function(w){n=w;var u=m.getGraphicsObjects();for(var v in u){if(u[v].id.indexOf("_controlLine")!=-1){t.showObject(u[v].id,w)}}};this.showControlLineForId=function(u,v){t.showObject(v+"_controlLine",u)};this.removeObject=function(u){m.removeGraphicsObject(u);t.removeObject(u)};this.snapToObject=function(w){var u=t.getObjectPosition(w);if(u!=undefined){var v=new THREE.Vector3();v.copy(u);v.multiplyScalar(1.4);t.moveCameraTo(v)}else{logger.debug(w+" not added to the core")}};function b(u){if(u==undefined){return undefined}return{x:-u.x,y:u.z,z:u.y}}this.removeAll=function(){this.removeAllExceptEarthAndMoon()};this.removeAllExceptEarthAndMoon=function(){var u=m.getGraphicsObjects();for(var v in u){if(u[v].id!="earth"&&u[v].id!="moon"){t.removeObject(u[v].id);m.removeGraphicsObject(u[v].id)}}};this.getGraphicsObjects=function(){return m.getGraphicsObjects()};this.updateObject=function(w,v,u){};this.setup=function(){this.removeAllExceptEarthAndMoon();q()};this.setup()};var SSI=SSI||{};SSI.UniverseController=function(c){var b=new Array();var e;var d=c.refreshRate||30;var a=0;function f(){var j=(new Date()).getTime();var g=j-a;a=j;for(var h in b){b[h].update(g);b[h].draw()}e=setTimeout(function(){f()},d)}this.updateOnce=function(){for(var g in b){b[g].update(null);b[g].draw()}};this.addGraphicsObject=function(g){b[g.id]=g;this.updateOnce()};this.removeGraphicsObject=function(g){delete b[g]};this.play=function(){a=(new Date()).getTime();f()};this.pause=function(){clearTimeout(e)};this.removeAllGraphicsObjects=function(){b=new Array()};this.getGraphicsObjects=function(){return b}};SSI.UniverseController.prototype.changeRefreshRate=function(a){this.refreshRate=a};