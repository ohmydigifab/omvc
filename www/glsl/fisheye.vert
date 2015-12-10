
varying   vec4 vTexCoord;


void main(void){
    vTexCoord = vec4(position,1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}