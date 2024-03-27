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

      float p1 = 0.001;

      float px = 0.7;
      float py = 0.7;


      float r = distance(vUv, vec2(px, py));
      float a = acos((py - vUv.y + smoothstep(0., 1., abs(sin(uTime))* 0.01)) / r);

      float b = 1.;

      if (vUv.x > px) {
        a = -a;
        b = -1.;
      }

      float a2 = M_PI/2.;

      float x = r * cos(a + a2 - b * abs(sin(uTime)) * 0.1 * smoothstep(0., 1., r)) + px;
      float y = -r * sin(a + a2 - b * abs(sin(uTime)) * 0.1 * smoothstep(0., 1., r)) + py;

      vec2 nCoord = vec2(x, y);

      vec4 texture = texture2D(uTexture, nCoord);

      gl_FragColor = vec4(texture);
    }