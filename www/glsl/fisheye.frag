
varying vec4      vTexCoord;
uniform bool flipY;
uniform sampler2D texture;

const float PI = 3.1415926535;

void main(void){
    float phi = atan(vTexCoord.y, vTexCoord.x);
    float n = length(vTexCoord.xy);
    float r = atan(n, vTexCoord.z) / PI;
    float u = r * cos(phi) + 0.5;
    float v = r * sin(phi) + 0.5;
    
    if(flipY){
    	v = 1.0 - v;
    }
    gl_FragColor = texture2D(texture, vec2(u, v));
}