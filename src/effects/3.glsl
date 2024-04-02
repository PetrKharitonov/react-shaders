 vec2 st = vUv;

      float a = atan(st.x,st.y)+M_PI;

      float s = cos(floor(.5+a/distanceF)*distanceF-distanceF)*length(st);

      if (distanceF < 0.4) {
        st -= vec2(0.5);

        float d = (vUv.x - uMouse.x) * (uPrevMousePosition.y - uMouse.y) - (vUv.y - uMouse.y) * (uPrevMousePosition.x - uMouse.x);
  
        float angle = velocityP - st.y * st.x * velocityP;
        angle *= (1. - distanceF / 0.4) * s * 10.;
        

        if (d < 0.) {
          st = rotate2d( sin(-angle), velocityP) * st;
        } else {
          st = rotate2d( -cos(angle - M_PI/ 2.), velocityP) * st;
        }
  
        st += vec2(0.5);
      }