
varying vec4 vTexCoord;
uniform bool flipX;
uniform bool flipY;
uniform sampler2D texture;

const float PI = 3.1415926535;

void main(void){
    float pitch = atan(vTexCoord.y, vTexCoord.x);
    float n = length(vTexCoord.xy);
    float roll = atan(n, vTexCoord.z);
    float r = 1.05 * roll / PI;
    float u = r * cos(pitch) + 0.5;
    float v = r * sin(pitch) + 0.5;
    if(r > 0.5){
	    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    }
    else
    {
	    if(flipX){
	    	u = 1.0 - u;
	    }
	    if(flipY){
	    	v = 1.0 - v;
	    }
	    gl_FragColor = texture2D(texture, vec2(u, v));
	}
}