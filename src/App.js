import * as THREE from "three";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./App.css";
import { Suspense, useRef } from "react";

const WaveShaderMaterial = shaderMaterial(
  // Uniform   /* vec3 color = mix(texture, uColor, effect); */
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(),
    uMouseDirection: new THREE.Vector2(),
    uMouseVelocity: new THREE.Vector2(),
    uPrevMousePosition: new THREE.Vector2(),
  },
  // Vertex shader
  glsl`
    precision mediump float;

    varying vec2 vUv;
    varying vec3 pos;


    uniform float uTime;


    void main() {
      vUv = uv;
      
      vec3 pos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  glsl`
    precision mediump float;

    uniform vec2 uMouse;
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    uniform vec2 uMouseDirection; // Direction of mouse movement
    uniform vec2 uMouseVelocity; // Velocity of mouse movement
    uniform vec2 uPrevMousePosition;

    varying vec2 vUv;

    mat2 rotate2d(float _angle, float v){
      return mat2(cos(_angle * v * v),-sin(_angle),
                  sin(_angle),cos(_angle * v));
    }


    void main() {

      #define M_PI 3.1415926535897932384626433832795

      vec2 displacement = (vUv - uMouse) * 2.0; 
      float velocityP = ((abs(uMouseVelocity.x) + abs(uMouseVelocity.y)) / 2.);

      float distanceF = distance(vUv, uMouse);
      float effect = smoothstep(min(velocityP * 0.04, 0.4), 0.0, distanceF); 

      float p1 = 0.001;

      float px2 = 0.4;
      float py2 = 0.5;

      float px = 0.7;
      float py = 0.7;

      
      
      /* Проба с матрицами */
      
     /*  vec2 st = vUv;

      st -= vec2(0.5);
      if (vUv.x > 0.5) {
        st = rotate2d( sin(uTime * 0.1)) * st;
      } else {
        st = rotate2d( -cos(uTime * 0.1 - M_PI/ 2.)) * st;
      }

      st += vec2(0.5); */

      /* ----------------- */
      


      /* Проба с матрицами 2 */
       
      /* vec2 st = vUv;

      st -= vec2(0.5);

      float d = (vUv.x - px) * (py2 - py) - (vUv.y - py) * (px2 - px);

      if (d < 0.) {
        st = rotate2d( sin(uTime * 0.2)) * st;
      } else {
        st = rotate2d( -cos(uTime * 0.2 - M_PI/ 2.)) * st;
      }

      st += vec2(0.5);  */

      /* ----------------- */

      
      
      /* Проба с матрицами 3  */
      
      /* vec2 st = vUv;

      st -= vec2(0.5);

      float d = (vUv.x - uMouse.x) * (uPrevMousePosition.y - uMouse.y) - (vUv.y - uMouse.y) * (uPrevMousePosition.x - uMouse.x);

      if (d < 0.) {
        st = rotate2d( sin(uTime * 0.2)) * st;
      } else {
        st = rotate2d( -cos(uTime * 0.2 - M_PI/ 2.)) * st;
      }

      st += vec2(0.5); */

      /* ----------------- */


      /* Матрица + мышка */

      vec2 st = vUv;

      if (distanceF < 0.2) {
        st -= vec2(0.5);

        float d = (vUv.x - uMouse.x) * (uPrevMousePosition.y - uMouse.y) - (vUv.y - uMouse.y) * (uPrevMousePosition.x - uMouse.x);
  
        float angle = velocityP - st.y * st.x * velocityP;
        angle *= 1. - distanceF / 0.2;
        
        if (d < 0.) {
          st = rotate2d( sin(-angle), velocityP) * st;
        } else {
          st = rotate2d( -cos(-angle - M_PI/ 2.), velocityP) * st;
        }
  
        st += vec2(0.5);
      }

   

      /* --------------- */


/*       float r = distance(vUv, vec2(px, py));
      float a = acos((py - vUv.y + smoothstep(0., 1., abs(sin(uTime))* 0.01)) / r);

      float b = 1.;

      if (vUv.x > px) {
        a = -a;
        b = -1.;
      }

      float a2 = M_PI/2.;

      float x = r * cos(a + a2 - b * abs(sin(uTime)) * 0.1 * smoothstep(0., 1., r)) + px;
      float y = -r * sin(a + a2 - b * abs(sin(uTime)) * 0.1 * smoothstep(0., 1., r)) + py;

      vec2 nCoord = vec2(x, y); */

      vec4 texture = texture2D(uTexture, st);

      gl_FragColor = vec4(texture);
    }
  `
);

extend({ WaveShaderMaterial });

const Wave = () => {
  const { viewport } = useThree();
  const ref = useRef();
  const prevMousePosition = useRef([0, 0]);

  const currentMousePosition = [0, 0];

  useFrame((state, delta) => {
    const mouse = state.pointer;

    const lerp = (a, b, t) => {
      return (b - a) * t + a;
    };

    currentMousePosition[0] = lerp(currentMousePosition[0], mouse.x, 0.1);
    currentMousePosition[1] = lerp(currentMousePosition[1], mouse.y, 0.1);

    const direction = [
      currentMousePosition[0] - mouse.x,
      currentMousePosition[1] - mouse.y,
    ];

    //console.log(ref.current.uMouse);

    ref.current.uMouseDirection.set(direction[0], direction[1]);

    ref.current.uMouseVelocity.x = direction[0];
    ref.current.uMouseVelocity.y = direction[1];

    ref.current.uPrevMousePosition.x = 0.5 * (prevMousePosition.current[0] + 1);
    ref.current.uPrevMousePosition.y = 0.5 * (prevMousePosition.current[1] + 1);

    // Update previous mouse position
    //console.log(ref.current.uMouseVelocity);

    prevMousePosition.current = currentMousePosition;

    ref.current.uTime = state.clock.getElapsedTime();
    ref.current.uMouse.x = 0.5 * (mouse.x + 1);
    ref.current.uMouse.y = 0.5 * (mouse.y + 1);
    //ref.current.uMouse.x = 0.5 * (currentMousePosition[0] + 1);
    //ref.current.uMouse.y = 0.5 * (currentMousePosition[1] + 1);
  });

  const [image] = useLoader(THREE.TextureLoader, ["sam.png"]);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 16, 16]} />
      <waveShaderMaterial
        ref={ref}
        uColor={"hotpink"}
        uTexture={image}
        uMouse
        uMouseDirection
        uMouseVelocity
        uPrevMousePosition
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas orthographic camera={{ zoom: 10, near: 0.1, far: 200 }}>
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  );
};

function App() {
  return <Scene />;
}

export default App;

/* 

      float noiseFreq = 0.5;
      float noiseAmp = 0.15;

      vec3 fpos = pos;

      vec3 noisePos = vec3(fpos.x * noiseFreq + uTime, fpos.y, fpos.y);
      fpos.z += snoise3(noisePos) * noiseAmp;
      float vWave = fpos.z * 2.0;


      float distanceF = distance(vUv, uMouse);
      float effect = smoothstep(0.1, 0.0, distanceF);

      float wave = vWave * effect;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;

*/
