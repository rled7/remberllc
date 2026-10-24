import { mkdir, access, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const source = fileURLToPath(new URL('assets-source/sneaker-original.glb', root));
const output = fileURLToPath(new URL('public/models/sneaker.glb', root));
await mkdir(new URL('assets-source/', root), { recursive: true });
try { await access(source); } catch {
  const response = await fetch('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb');
  if (!response.ok) throw new Error(`Source model download failed: ${response.status}`);
  await writeFile(source, new Uint8Array(await response.arrayBuffer()));
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const document = await io.read(source);
for (const extension of document.getRoot().listExtensionsUsed()) {
  if (extension.extensionName === 'KHR_materials_variants') extension.dispose();
}
// NOVO renders its four colors with a uniform, so the baked color variants are unused.
for (const material of document.getRoot().listMaterials()) material.setBaseColorTexture(null);
await document.transform(dedup(), prune(), textureCompress({ encoder: sharp, resize: [1024, 1024], targetFormat: 'webp', lossless: true }));
await io.write(output, document);
const before = (await stat(source)).size;
const after = (await stat(output)).size;
const report = { originalBytes: before, optimizedBytes: after, reductionPercent: Number(((1 - after / before) * 100).toFixed(1)), maximumTextureDimension: 1024, source: 'Materials Variants Shoe, © 2021 Shopify, CC BY 4.0', operations: ['remove unused material variants', 'remove unused baked base color textures', 'deduplicate and prune', 'resize retained surface maps to at most 1024px', 'lossless WebP compression of retained maps'] };
await writeFile(new URL('assets-source/optimization.json', root), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
