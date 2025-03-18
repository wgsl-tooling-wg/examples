import package::fullscreen_quad::{fullscreen_quad, QuadVertex};

struct Uniforms { time: f32 }

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> QuadVertex {
    return fullscreen_quad(vertex_index);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
    let center = vec2f(-1.75,0);
    let size = 3.0 * pow(2, -uniforms.time * 0.5);
    let coord = uv * 2.0 - 1.0;

    let mandelbrotEscaped = package::mandelbrot::mandelbrot(
        center + coord * size
    );

    @if(DEBUG)
    let color = random_wgsl::sinRand(vec2f(mandelbrotEscaped)); 
    @if(!DEBUG)
    let color = mandelbrotEscaped;
    return vec4(vec3f(color), 1.0);
}