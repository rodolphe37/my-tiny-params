/**
 * Fabrique les icônes et le logo de l'application à partir de design/ :
 *  - icon-192.png / icon-512.png : design/icone.png, tel quel (coins arrondis transparents) ;
 *  - icon-maskable-512.png : le dessin réduit au centre d'un fond qui le prolonge (les masques ronds d'Android rognent les bords) ;
 *  - apple-touch-icon.png (180 px) : carré plein, iOS arrondit lui-même les coins ;
 *  - favicon.png (64 px) ;
 *  - brand/logo-240.png : design/logo.png réduit pour l'en-tête (affiché ~120 px de large, écrans 2x).
 * Réduction par moyenne de surface (aucune dépendance native). À relancer si le design change : `npm run icons`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';

const root = new URL('..', import.meta.url).pathname;
const icon = PNG.sync.read(readFileSync(join(root, 'design/icone.png')));
const logo = PNG.sync.read(readFileSync(join(root, 'design/logo.png')));
mkdirSync(join(root, 'public/icons'), { recursive: true });
mkdirSync(join(root, 'public/brand'), { recursive: true });

/** Réduit une image à w × h par moyenne pondérée des pixels couverts (alpha pré-multiplié). */
function resize(img, w, h = w) {
  const out = new PNG({ width: w, height: h });
  const kx = img.width / w, ky = img.height / h;
  for (let oy = 0; oy < h; oy++) {
    for (let ox = 0; ox < w; ox++) {
      const sx0 = ox * kx, sx1 = sx0 + kx, sy0 = oy * ky, sy1 = sy0 + ky;
      let r = 0, g = 0, b = 0, a = 0, wsum = 0;
      for (let py = Math.floor(sy0); py < Math.ceil(sy1); py++) {
        const wy = Math.min(py + 1, sy1) - Math.max(py, sy0);
        for (let px = Math.floor(sx0); px < Math.ceil(sx1); px++) {
          const wt = wy * (Math.min(px + 1, sx1) - Math.max(px, sx0));
          const i = (img.width * py + px) << 2;
          const al = img.data[i + 3] / 255;
          r += img.data[i] * al * wt; g += img.data[i + 1] * al * wt; b += img.data[i + 2] * al * wt; a += al * wt; wsum += wt;
        }
      }
      const o = (w * oy + ox) << 2;
      out.data[o] = a ? r / a : 0; out.data[o + 1] = a ? g / a : 0; out.data[o + 2] = a ? b / a : 0;
      out.data[o + 3] = Math.round((a / wsum) * 255);
    }
  }
  return out;
}

/** Fond de l'icône : le bleu nuit du dessin, qui s'assombrit vers les bords. */
function backdrop(size) {
  const out = new PNG({ width: size, height: size });
  const c = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = Math.min(1, Math.hypot(x - c, y - c) / (size * 0.7));
      const i = (size * y + x) << 2;
      out.data[i] = Math.round(12 + (4 - 12) * t); out.data[i + 1] = Math.round(24 + (10 - 24) * t); out.data[i + 2] = Math.round(118 + (60 - 118) * t); out.data[i + 3] = 255;
    }
  }
  return out;
}

function paste(dst, src, ox, oy) {
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const s = (src.width * y + x) << 2, d = (dst.width * (y + oy) + (x + ox)) << 2, a = src.data[s + 3] / 255;
      for (let c = 0; c < 3; c++) dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      dst.data[d + 3] = 255;
    }
  }
}

const save = (img, path) => writeFileSync(join(root, path), PNG.sync.write(img));

save(resize(icon, 192), 'public/icons/icon-192.png');
save(resize(icon, 512), 'public/icons/icon-512.png');

const apple = backdrop(180);
paste(apple, resize(icon, 180), 0, 0);
save(apple, 'public/icons/apple-touch-icon.png');

const maskable = backdrop(512);
const inner = Math.round(512 * 0.8);
paste(maskable, resize(icon, inner), Math.round((512 - inner) / 2), Math.round((512 - inner) / 2));
save(maskable, 'public/icons/icon-maskable-512.png');

save(resize(icon, 64), 'public/favicon.png');
save(resize(logo, 240, Math.round((240 * logo.height) / logo.width)), 'public/brand/logo-240.png');
console.log('Icônes et logo écrits dans public/ (icons/*, favicon.png, brand/logo-240.png).');
