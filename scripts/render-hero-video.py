"""Procedural amber particle-river loop for the webhani hero.

Every motion term is periodic in the loop length T (integer frequencies only),
so frame N == frame 0 and the video loops seamlessly.
Usage: python3 -I render.py <out_dir> [width height fps seconds]
"""

import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(sys.argv[1])
W, H, FPS, SECONDS = (int(v) for v in (sys.argv[2:6] or (1280, 720, 24, 10)))
FRAMES = FPS * SECONDS
TAU = 2 * math.pi
rng = np.random.default_rng(20261017)

BG = np.array([15, 15, 15], np.float32) / 255  # --dark-bg #0f0f0f
AMBER = np.array(
    [[251, 191, 36], [245, 158, 11], [217, 119, 6], [255, 236, 200]], np.float32
) / 255


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


def make_layer(n, spread, size_px, bright, blur, k_speed):
    v0 = rng.random(n)
    return {
        "v0": v0,
        "lat": rng.normal(0, 1, n) * spread,  # lateral offset from river center
        "wob_a": rng.random(n) * spread * 0.35,
        "wob_m": rng.integers(1, 3, n),
        "ph": rng.random(n) * TAU,
        "tw_m": rng.integers(1, 4, n),
        "col": AMBER[rng.choice(4, n, p=[0.35, 0.35, 0.2, 0.1])],
        "bright": bright * (0.4 + 0.6 * rng.random(n)),
        "size": size_px,
        "blur": blur,
        "k": k_speed,
    }


# river layers: far = many tiny sharp, mid = glow, near = few large bokeh
LAYERS = [
    make_layer(5200, 0.055, 1, 0.55, 0, 1),
    make_layer(900, 0.075, 2, 0.9, 2, 1),
    make_layer(70, 0.11, 3, 1.6, 9, 1),
]
DUST = {
    "x": rng.random(700),
    "y": rng.random(700),
    "r": rng.random(700) * 0.012,
    "ph": rng.random(700) * TAU,
    "m": rng.integers(1, 3, 700),
    "b": 0.12 + 0.25 * rng.random(700),
}

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# soft amber haze behind the river + vignette, matching the CSS hero glow
haze = np.exp(-(((xx / W - 0.72) / 0.22) ** 2 + ((yy / H - 0.45) / 0.55) ** 2))
vignette = 1 - 0.55 * (((xx / W - 0.6) ** 2 + (yy / H - 0.5) ** 2) / 0.5)
BASE = BG[None, None] * np.clip(vignette, 0.4, 1)[..., None] + (
    haze[..., None] * np.array([0.22, 0.12, 0.02], np.float32) * 0.35
)


def river_x(v, t):
    """River center (0..1) as a function of height param v and loop time t."""
    return 0.72 + 0.07 * np.sin(TAU * (0.8 * v + 0.15)) + 0.012 * np.sin(TAU * (t + v))


def splat(img, x, y, col, amp, size):
    xi = np.floor(x * W).astype(int)
    yi = np.floor(y * H).astype(int)
    # drop off-screen points (clipping would pile them up on the edge rows)
    on = (xi >= 0) & (xi < W - size) & (yi >= 0) & (yi < H - size)
    xi, yi, val = xi[on], yi[on], (col * amp[:, None])[on]
    for dx in range(size):
        for dy in range(size):
            np.add.at(img, (yi + dy, xi + dx), val)


def render(frame):
    t = frame / FRAMES  # 0..1, periodic
    out = BASE.copy()
    for L in LAYERS:
        v = (L["v0"] + L["k"] * t) % 1.0  # bottom -> top, wraps exactly at t=1
        y = 1.05 - v * 1.1
        x = river_x(v, t) + L["lat"] * (0.6 + 0.8 * v) + L["wob_a"] * np.sin(TAU * L["wob_m"] * t + L["ph"])
        env = np.sin(math.pi * v) ** 0.7  # fade at both ends -> no pop on wrap
        tw = 0.65 + 0.35 * np.sin(TAU * L["tw_m"] * t + L["ph"])
        layer = np.zeros((H, W, 3), np.float32)
        splat(layer, x, y, L["col"], L["bright"] * env * tw, L["size"])
        out += box_blur(layer, L["blur"]) * (1.0 + L["blur"] * 0.9)
    D = DUST
    dx = D["x"] + D["r"] * np.cos(TAU * D["m"] * t + D["ph"])
    dy = D["y"] + D["r"] * np.sin(TAU * D["m"] * t + D["ph"])
    dust = np.zeros((H, W, 3), np.float32)
    splat(dust, dx % 1, dy % 1, AMBER[3], D["b"] * (0.6 + 0.4 * np.sin(TAU * t + D["ph"])), 1)
    out += box_blur(dust, 1)
    out = 1 - np.exp(-out * 1.5)  # soft tone-map keeps highlights from clipping
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for f in range(FRAMES):
        render(f).save(OUT / f"f{f:04d}.png")
        if f % 24 == 0:
            print("frame", f, flush=True)
    # loop check: the frame after the last must equal frame 0
    a = np.asarray(render(FRAMES), np.int16)
    b = np.asarray(Image.open(OUT / "f0000.png"), np.int16)
    print("loop max diff:", int(np.abs(a - b).max()))
