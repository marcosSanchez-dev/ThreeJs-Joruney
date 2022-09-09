
 uniform mat4 projectionMatrix;
 uniform mat4 viewMatrix;
 uniform mat4 modelMatrix;
 uniform vec2 uFrequency;
 uniform float uTime;

attribute vec3 position;
//attribute float aRandom;
attribute vec2 uv; //Este nombre se usa como default en threeJS

//varying float vRandom;
varying vec2 vUV;
varying float vElevation;

/*
float a = 1.0;
int b = 2;
float c = a + float(b);
*/

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    //Modificas la geometria y haces Waves en ella:
    //modelPosition += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
    //modelPosition += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    //modelPosition.z = aRandom * 0.1;

    float elevation = sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
    elevation += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;

    modelPosition.z = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    //vRandom = aRandom;
    vUV = uv;
    vElevation = elevation;
}