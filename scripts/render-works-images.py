"""Procedural Works card images in the hero's palette (dark bg + amber).

One abstract motif per work. Cards render at ~2:1 (desktop) down to ~1.2:1
(mobile, object-cover crops the sides), so every motif stays inside the safe
zone: 12-68% of the height (above the caption) and the middle 60% of the width.
Usage: python3 -I render-works-images.py <out_dir> [width height]
"""

import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

OUT = Path(sys.argv[1])
W, H = (int(v) for v in (sys.argv[2:4] or (1600, 800)))
SS = 2  # supersampling for anti-aliased line art
TAU = 2 * math.pi

BG = np.array([15, 15, 15], np.float32) / 255  # --dark-bg #0f0f0f
AMBER = np.array([251, 191, 36], np.float32) / 255
AMBER_DEEP = np.array([217, 119, 6], np.float32) / 255
CREAM = np.array([255, 236, 200], np.float32) / 255
CX, CY = 0.5, 0.4  # motif center (fraction of W, H)


def box_blur(img, r):
    """Approximate gaussian: three separable box passes (r in px)."""
    if r < 1:
        return img
    k = 2 * r + 1
    for _ in range(3):
        for axis in (0, 1):
            pad = [(0, 0)] * img.ndim
            pad[axis] = (r + 1, r)
            c = np.cumsum(np.pad(img, pad, mode="edge"), axis=axis)
            hi = np.take(c, np.arange(k, k + img.shape[axis]), axis=axis)
            lo = np.take(c, np.arange(0, img.shape[axis]), axis=axis)
            img = (hi - lo) / k
    return img


def base():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    haze = np.exp(-(((xx / W - CX) / 0.35) ** 2 + ((yy / H - CY) / 0.45) ** 2))
    vignette = np.clip(1 - 0.6 * ((xx / W - 0.5) ** 2 + (yy / H - 0.5) ** 2) / 0.5, 0.4, 1)
    return BG * vignette[..., None] + haze[..., None] * AMBER_DEEP * 0.12


class Canvas:
    """Supersampled grayscale sketch layers, composited as amber light."""

    def __init__(self):
        self.layers = []  # (PIL L image, color, gain, glow radius)

    def new(self, color=AMBER, gain=1.0, glow=6):
        img = Image.new("L", (W * SS, H * SS), 0)
        self.layers.append((img, color, gain, glow))
        return ImageDraw.Draw(img)

    def render(self, rng):
        out = base()
        for img, color, gain, glow in self.layers:
            m = np.asarray(img.resize((W, H), Image.LANCZOS), np.float32)[..., None] / 255
            out = out + m * color * gain + box_blur(m, glow) * color * gain * 1.6
        # faint dust so every card shares the hero's texture
        n = 500
        dust = np.zeros((H, W, 1), np.float32)
        np.add.at(dust, (rng.integers(0, H, n), rng.integers(0, W, n)), (0.1 + 0.3 * rng.random(n))[:, None])
        out = out + box_blur(dust, 1) * CREAM
        out = 1 - np.exp(-out * 1.5)  # soft tone-map, same as the hero
        return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def px(x, y):
    return (x * W * SS, y * H * SS)


def dot(d, x, y, r):
    cx, cy = px(x, y)
    rr = r * SS
    d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)


def cloud(rng):
    """Cloud infrastructure: an evenly spaced node mesh filling a cloud silhouette."""
    c = Canvas()
    # silhouette in pixel space (fractions of H) so lobes stay round at any aspect
    lobes = [(-0.28, 0.06, 0.17), (-0.07, -0.08, 0.25), (0.17, -0.02, 0.2), (0.33, 0.08, 0.13)]
    bottom = 0.2
    pts = []
    for _ in range(20000):  # dart throwing -> even spacing
        x, y = rng.uniform(-0.5, 0.5), rng.uniform(-0.35, bottom)
        inside = any(math.hypot(x - lx, y - ly) < r for lx, ly, r in lobes)
        if inside and all(math.hypot(x - a, y - b) > 0.045 for a, b in pts):
            pts.append((x, y))
    scr = np.array(pts)
    k = 0.8  # fit the silhouette into the safe zone
    to_frac = [(CX + k * x * H / W, CY + k * y) for x, y in pts]
    lines = c.new(gain=0.35, glow=3)
    for i, p in enumerate(scr):
        dist = np.hypot(*(scr - p).T)
        for j in np.argsort(dist)[1:4]:
            if dist[j] < 0.09:
                lines.line([px(*to_frac[i]), px(*to_frac[j])], fill=255, width=2 * SS)
    nodes = c.new(color=CREAM, gain=0.9, glow=8)
    for x, y in to_frac:
        dot(nodes, x, y, rng.choice([2.5, 4, 6], p=[0.6, 0.3, 0.1]))
    return c


def ec(rng):
    """EC site: an isometric grid of product tiles, a few lit up."""
    c = Canvas()
    outline = c.new(gain=0.45, glow=3)
    lit = c.new(color=AMBER, gain=0.55, glow=14)
    cols, rows = 5, 5
    s = 0.075  # tile half-diagonal, fraction of H
    for i in range(cols):
        for j in range(rows):
            # isometric projection of tile (i, j), centered on (CX, CY)
            u = (i - j) * s * H / W
            v = (i + j - (cols + rows - 2) / 2) * s * 0.5
            hw, hh = s * 0.9 * H / W, s * 0.9 * 0.5
            cx, cy = CX + u, CY + v
            quad = [px(cx, cy - hh), px(cx + hw, cy), px(cx, cy + hh), px(cx - hw, cy)]
            if rng.random() < 0.22:
                lit.polygon(quad, fill=255)
            else:
                outline.polygon(quad, outline=255, width=2 * SS)
    return c


def system(rng):
    """Business system: three tiers of blocks joined by orthogonal data paths."""
    c = Canvas()
    paths = c.new(gain=0.35, glow=3)
    blocks = c.new(gain=0.5, glow=4)
    packets = c.new(color=CREAM, gain=1.0, glow=8)
    tiers = [(-0.22, 3), (0.0, 4), (0.22, 2)]
    centers = [[(CX + dx, CY + (k - (n - 1) / 2) * 0.13) for k in range(n)] for dx, n in tiers]
    bw, bh = 0.035, 0.045
    for a, b in zip(centers, centers[1:]):
        for (x0, y0) in a:
            for (x1, y1) in b:
                if rng.random() < 0.55:
                    xm = (x0 + x1) / 2
                    route = [px(x0 + bw, y0), px(xm, y0), px(xm, y1), px(x1 - bw, y1)]
                    paths.line(route, fill=255, width=2 * SS, joint="curve")
                    # a data packet somewhere on the route
                    t = rng.random()
                    x, y = (x0 + bw + (xm - x0 - bw) * t * 2, y0) if t < 0.5 else (xm, y0 + (y1 - y0) * (t - 0.5) * 2)
                    dot(packets, x, y, 4)
    for tier in centers:
        for (x, y) in tier:
            blocks.rounded_rectangle([px(x - bw, y - bh), px(x + bw, y + bh)], radius=8 * SS, outline=255, width=3 * SS)
    return c


def ai_chatbot(rng):
    """AI chatbot: a particle swarm condensing into a bright core."""
    c = Canvas()
    swarm = c.new(gain=0.7, glow=2)
    core = c.new(color=CREAM, gain=1.0, glow=22)
    rings = c.new(gain=0.4, glow=3)
    sx = 1.4 * H / W  # radius is in H units; widen into a soft ellipse
    for _ in range(1800):
        r = 0.26 * rng.random() ** 0.6
        th = rng.random() * TAU
        # three-fold ripple so the swarm reads as structured, not noise
        r *= 1 + 0.12 * math.sin(3 * th + r * 30)
        dot(swarm, CX + r * math.cos(th) * sx, CY + r * math.sin(th), rng.choice([1, 1.5, 2.5], p=[0.7, 0.25, 0.05]))
    dot(core, CX, CY, 22)
    for r in (0.11, 0.19):
        x0, y0 = px(CX - r * sx, CY - r)
        x1, y1 = px(CX + r * sx, CY + r)
        rings.ellipse((x0, y0, x1, y1), outline=255, width=2 * SS)
    return c


WORKS = {"cloud": cloud, "ec": ec, "system": system, "ai-chatbot": ai_chatbot}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, motif in WORKS.items():
        rng = np.random.default_rng(20261017)
        motif(rng).render(rng).save(OUT / f"{name}.png")
        print("rendered", name, flush=True)
