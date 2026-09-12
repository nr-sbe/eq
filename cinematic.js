/* Offline cinematic presentation: carved armor, animated cloth, HDR glow. */
(()=>{
 const T=THREE;
 class CinematicView{
  constructor(renderer,scene,camera){
   this.renderer=renderer;this.scene=scene;this.camera=camera;
   this.target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType});
   this.a=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false});this.b=this.a.clone();
   this.screen=new T.Scene();this.ortho=new T.OrthographicCamera(-1,1,1,-1,0,1);
   const vertexShader='varying vec2 uv0;void main(){uv0=uv;gl_Position=vec4(position.xy,0.,1.);}';
   this.blur=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{map:{value:null},stepUV:{value:new T.Vector2()},extract:{value:0}},vertexShader,fragmentShader:`varying vec2 uv0;uniform sampler2D map;uniform vec2 stepUV;uniform float extract;
    vec3 sampleAt(vec2 p){vec3 c=texture2D(map,p).rgb;float l=max(c.r,max(c.g,c.b));return mix(c,c*smoothstep(.9,1.8,l),extract);}
    void main(){vec3 c=sampleAt(uv0)*.227027;c+=(sampleAt(uv0+stepUV*1.384615)+sampleAt(uv0-stepUV*1.384615))*.316216;c+=(sampleAt(uv0+stepUV*3.230769)+sampleAt(uv0-stepUV*3.230769))*.070270;gl_FragColor=vec4(c,1.);}`});
   this.composite=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{map:{value:this.target.texture},glow:{value:this.a.texture},strength:{value:.48},time:{value:0},pulse:{value:0}},vertexShader,fragmentShader:`varying vec2 uv0;uniform sampler2D map;uniform sampler2D glow;uniform float strength,time,pulse;
    void main(){vec3 c=texture2D(map,uv0).rgb+texture2D(glow,uv0).rgb*strength;
    c*=1.08+pulse*.08;c=clamp((c*(2.51*c+.03))/(c*(2.43*c+.59)+.14),0.,1.);
    float v=smoothstep(.85,.22,distance(uv0,vec2(.5)));c*=.79+.21*v;
    float grain=fract(sin(dot(uv0+fract(time)*.01,vec2(12.9898,78.233)))*43758.5453)-.5;c+=grain*.011;
    gl_FragColor=vec4(c,1.);
    #include <colorspace_fragment>
    }`});
   this.quad=new T.Mesh(new T.PlaneGeometry(2,2),this.composite);this.screen.add(this.quad);
  }
  resize(){const v=new T.Vector2();this.renderer.getDrawingBufferSize(v);this.target.setSize(v.x,v.y);this.a.setSize(Math.max(1,v.x>>2),Math.max(1,v.y>>2));this.b.setSize(this.a.width,this.a.height);}
  render(time,gentle,pulse){const r=this.renderer;r.setRenderTarget(this.target);r.render(this.scene,this.camera);this.quad.material=this.blur;
   this.blur.uniforms.map.value=this.target.texture;this.blur.uniforms.extract.value=1;this.blur.uniforms.stepUV.value.set(1/this.a.width,0);r.setRenderTarget(this.b);r.render(this.screen,this.ortho);
   this.blur.uniforms.map.value=this.b.texture;this.blur.uniforms.extract.value=0;this.blur.uniforms.stepUV.value.set(0,1/this.a.height);r.setRenderTarget(this.a);r.render(this.screen,this.ortho);
   this.quad.material=this.composite;this.composite.uniforms.strength.value=gentle?.2:.5;this.composite.uniforms.time.value=time;this.composite.uniforms.pulse.value=pulse;r.setRenderTarget(null);r.render(this.screen,this.ortho);
  }
 }
 window.CinematicView=CinematicView;
})();
