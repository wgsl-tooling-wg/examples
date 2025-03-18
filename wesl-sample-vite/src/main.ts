/// <reference types="wesl-plugin/suffixes" />
import { link } from "wesl";
import mainWesl from "../shaders/main.wesl?link";

const app = document.getElementById("app")!;
const canvas = document.createElement("canvas");
canvas.style.width = "90vmin";
canvas.style.height = "90vmin";
app.append(canvas);

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice()!;
if (device === undefined) {
  app.append(document.createTextNode("WebGPU not available!"));
  throw new Error("WebGPU not available");
}

const linked = await link({ ...mainWesl, conditions: { DEBUG: false } });
const shader = linked.createShaderModule(device, {});
const context = canvas.getContext("webgpu")!;

const devicePixelRatio = window.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device,
  format: presentationFormat,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: {
    module: shader,
    entryPoint: "vs_main",
  },
  fragment: {
    module: shader,
    entryPoint: "fs_main",
    targets: [{ format: presentationFormat }],
  },
  primitive: {
    topology: "triangle-list",
  },
});

const uniforms = device.createBuffer({
  size: 4,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [
    {
      binding: 0,
      resource: {
        buffer: uniforms,
      },
    },
  ],
});

const startTime = Date.now();

function render() {
  const elapsed = (Date.now() - startTime) / 1000;
  device.queue.writeBuffer(uniforms, 0, new Float32Array([elapsed]));
  const encoder = device.createCommandEncoder();
  const passEncoder = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: [0, 0, 0, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.setPipeline(pipeline);
  passEncoder.draw(6); // for the fullscreen quad
  passEncoder.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
