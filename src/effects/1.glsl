precision mediump float;

    uniform vec2 uMouse;
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    uniform vec2 uMouseDirection; // Direction of mouse movement
    uniform vec2 uMouseVelocity; // Velocity of mouse movement
    uniform vec2 uPrevMousePosition;

    varying vec2 vUv;


    void main() {

      #define M_PI 3.1415926535897932384626433832795

      vec2 displacement = (vUv - uMouse) * 2.0; 
      float velocityP = ((abs(uMouseVelocity.x) + abs(uMouseVelocity.y)) / 2.) * 0.1 ;

      float distanceF = distance(vUv, uMouse);
      float effect = smoothstep(min(velocityP * 0.04, 0.4), 0.0, distanceF); 


      float r = distance(vUv, uMouse);
      float a = acos((1. - vUv.y - uMouse.y) / r);

      float d = (vUv.x - uMouse.x) * (uPrevMousePosition.y - uMouse.y) - (vUv.y - uMouse.y) * (uPrevMousePosition.x - uMouse.x);

      if (d < 0.) {
        a = -a;
      }

      float a2 = M_PI/2.;

      float x = r * cos(a * r + a2)  + uMouse.x;
      float y = -r * sin(a * r + a2) + uMouse.y;

      vec2 nCoord = vec2(x, y);

      vec4 texture = texture2D(uTexture, nCoord);

      gl_FragColor = vec4(texture);
    }