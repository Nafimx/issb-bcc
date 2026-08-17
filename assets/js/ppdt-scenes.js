/* ppdt-scenes.js — 40 PPDT pictures drawn as inline SVG.
   Style follows the real board slides: rough ink line-art of ordinary people
   on a photocopied sheet, deliberately ambiguous. The page renders them
   greyscale + blurred, so only shapes, posture and grouping survive — the
   cadet must infer age, sex, mood and action. No external images. */
(function (global) {
  "use strict";

  const W = 640, H = 440;
  const INK = "#232323";
  const PAPER = "#e9e6de";
  const SKIN = "#d8d3c8";
  const CLOTH = "#f3f1eb";
  const DARK = "#3d3d3d";

  /* deterministic wobble so the strokes look drawn, not printed */
  function wob(seed) {
    let a = seed * 9301 + 49297;
    return () => {
      a = (a * 9301 + 49297) % 233280;
      return (a / 233280 - 0.5) * 2;
    };
  }

  const S = (o) =>
    'stroke="' + INK + '" stroke-width="' + (o || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"';

  const line = (x1, y1, x2, y2, w) =>
    '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ' + S(w) + "/>";

  const poly = (pts, fill, w) =>
    '<polyline points="' + pts.map((p) => p[0] + "," + p[1]).join(" ") + '" fill="' + (fill || "none") + '" ' + S(w) + "/>";

  const rect = (x, y, w, h, fill, sw) =>
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (fill || "none") + '" ' + S(sw) + "/>";

  /* hatch shading, clipped to the shape it belongs to */
  let uid = 0;
  function hatchLines(x, y, w, h, gap) {
    let out = '<g stroke="' + INK + '" stroke-width="1.2" opacity=".5">';
    for (let i = -h; i < w + h; i += (gap || 7))
      out += '<line x1="' + (x + i) + '" y1="' + y + '" x2="' + (x + i + h) + '" y2="' + (y + h) + '"/>';
    return out + '</g>';
  }
  function hatch(x, y, w, h, gap) {
    const id = 'h' + (++uid);
    return '<clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/></clipPath>' +
      '<g clip-path="url(#' + id + ')">' + hatchLines(x, y, w, h, gap) + '</g>';
  }
  /* hatch inside an arbitrary path */
  function hatchIn(d, x, y, w, h, gap) {
    const id = 'p' + (++uid);
    return '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
      '<g clip-path="url(#' + id + ')">' + hatchLines(x, y, w, h, gap) + '</g>';
  }

  /* ---------------- the figure ----------------
     Limbs are tapered closed outlines rather than stick strokes, shoulders
     slope, the waist narrows and every point carries a little jitter, so the
     result reads as a rough pencil drawing instead of a diagram.
     x = centre, y = ground line, h = full standing height.
     pose: stand walk run talk listen point sit sitHead write kneel carry raise plead
     opt:  {dress:"skirt"|"trousers", hair:"long"|"short"|"cap", turn:1|-1, beard:true} */

  /* tapered limb: a chain of joints with a width at each joint */
  function limb(pts, widths, fill) {
    const left = [], right = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[Math.min(i + 1, pts.length - 1)];
      const r = pts[Math.max(i - 1, 0)];
      let dx = q[0] - r[0], dy = q[1] - r[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const w = widths[i] / 2;
      left.push([p[0] + nx * w, p[1] + ny * w]);
      right.push([p[0] - nx * w, p[1] - ny * w]);
    }
    const end = pts[pts.length - 1], we = widths[widths.length - 1] / 2;
    const d =
      "M" + left.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") +
      " A" + we.toFixed(1) + " " + we.toFixed(1) + " 0 0 1 " +
      right[right.length - 1][0].toFixed(1) + " " + right[right.length - 1][1].toFixed(1) +
      " L" + right.slice().reverse().map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + "z";
    return '<path d="' + d + '" fill="' + (fill || CLOTH) + '" ' + S(2.2) + "/>";
  }

  const shoe = (p, dir, s) =>
    '<path d="M' + (p[0] - s * 0.5) + " " + (p[1] - s * 0.5) +
    " q" + s * 0.2 + " " + s * 0.9 + " " + s * 1.5 * dir + " " + s * 0.55 +
    " l0 " + s * 0.45 + " l-" + s * 1.9 + ' 0z" fill="' + DARK + '" ' + S(1.8) + "/>";

  function head(cx, cy, r, opt, t) {
    opt = opt || {};
    const oval = '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + r * 0.86 + '" ry="' + r + '" fill="' + SKIN + '" ' + S(2.2) + "/>";
    let hair;
    if (opt.hair === "long") {
      hair = '<path d="M' + (cx - r * 1.02) + " " + (cy + r * 0.15) +
        " q-" + r * 0.15 + " -" + r * 1.5 + " " + r * 1.05 + " -" + r * 1.45 +
        " q" + r * 1.2 + " -" + r * 0.05 + " " + r * 1.05 + " " + r * 1.5 +
        " q" + r * 0.2 + " " + r * 1.5 + " -" + r * 0.1 + " " + r * 2.1 +
        " l-" + r * 0.55 + " -" + r * 0.35 +
        " q-" + r * 0.2 + " -" + r * 0.9 + " -" + r * 0.35 + " -" + r * 1.25 +
        " l-" + r * 1.1 + " 0" +
        " q-" + r * 0.2 + " " + r * 0.4 + " -" + r * 0.35 + " " + r * 1.3 +
        " l-" + r * 0.55 + ' 0.3z" fill="' + INK + '"/>';
    } else if (opt.hair === "cap") {
      hair = '<path d="M' + (cx - r * 1.05) + " " + (cy - r * 0.15) +
        " q0 -" + r * 1.15 + " " + r * 1.05 + " -" + r * 1.15 +
        " q" + r * 1.05 + " 0 " + r * 1.05 + " " + r * 1.15 +
        " l" + r * 0.75 * t + " " + r * 0.28 + " l-" + r * 2.85 + ' 0z" fill="' + INK + '"/>';
    } else {
      hair = '<path d="M' + (cx - r * 0.92) + " " + (cy - r * 0.1) +
        " q" + r * 0.1 + " -" + r * 1.15 + " " + r * 0.95 + " -" + r * 1.12 +
        " q" + r * 0.95 + " 0 " + r * 0.92 + " " + r * 1.05 +
        " q-" + r * 0.35 + " -" + r * 0.55 + " -" + r * 0.95 + " -" + r * 0.5 +
        " q-" + r * 0.55 + " " + r * 0.05 + " -" + r * 0.92 + ' 0.6z" fill="' + INK + '"/>';
    }
    const brow = '<path d="M' + (cx + r * 0.15 * t) + " " + (cy - r * 0.15) + " l" + r * 0.38 * t + ' 0.5" ' + S(1.5) + "/>";
    const nose = '<path d="M' + (cx + r * 0.62 * t) + " " + (cy - r * 0.05) + " l" + r * 0.16 * t + " " + r * 0.32 +
      " l" + (-r * 0.2 * t) + ' 0.4" fill="none" ' + S(1.4) + "/>";
    const beard = opt.beard
      ? '<path d="M' + (cx - r * 0.72) + " " + (cy + r * 0.25) +
        " q" + r * 0.72 + " " + r * 1.15 + " " + r * 1.44 + " 0" +
        " q-" + r * 0.2 + " " + r * 0.55 + " -" + r * 0.72 + ' 0.55z" fill="' + DARK + '" ' + S(1.6) + "/>"
      : "";
    const mouth = '<path d="M' + (cx + r * 0.05 * t) + " " + (cy + r * 0.42) + " q" + r * 0.22 * t + " " + r * 0.16 + " " + r * 0.42 * t + ' -0.05" fill="none" ' + S(1.4) + "/>";
    return oval + beard + hair + brow + nose + mouth;
  }

  function figSeated(x, y, h, variant, opt) {
    opt = opt || {};
    const t = opt.turn === -1 ? -1 : 1;
    const X = (u) => x + u * h * t, Y = (u) => y + u * h;
    const seat = Y(-0.29);
    const hip = [X(-0.04), seat];
    const knee = [X(0.21), seat - h * 0.005];
    const foot = [X(0.235), y - h * 0.02];
    const shoulder = [X(-0.06), seat - h * 0.3];
    const headC = [X(-0.035), seat - h * 0.43];
    const r = h * 0.082;
    const cloth = opt.darkShirt ? DARK : CLOTH;

    const dTorso =
      "M" + (shoulder[0] - h * 0.085 * t) + " " + (shoulder[1] + h * 0.01) +
      " q" + h * 0.085 * t + " -" + h * 0.035 + " " + h * 0.175 * t + " 0" +
      " q" + h * 0.03 * t + " " + h * 0.16 + " " + h * 0.02 * t + " " + h * 0.29 +
      " l" + (-h * 0.2 * t) + " 0" +
      " q" + (-h * 0.02 * t) + " -" + h * 0.15 + " 0 -" + h * 0.29 + "z";

    let arm;
    if (variant === "head")
      arm = limb([shoulder, [X(0.1), seat - h * 0.2], [X(0.015), headC[1] + r * 0.5]], [h * 0.06, h * 0.05, h * 0.038], cloth);
    else if (variant === "write")
      arm = limb([shoulder, [X(0.11), seat - h * 0.21], [X(0.29), seat - h * 0.14]], [h * 0.06, h * 0.05, h * 0.032], cloth);
    else
      arm = limb([shoulder, [X(0.12), seat - h * 0.17], [X(0.2), seat - h * 0.04]], [h * 0.06, h * 0.05, h * 0.034], cloth);

    const lean = variant === "head" ? ' transform="rotate(' + 11 * t + " " + hip[0] + " " + hip[1] + ')"' : "";

    return "<g" + lean + ">" +
      limb([hip, knee], [h * 0.115, h * 0.085], cloth) +
      limb([knee, foot], [h * 0.08, h * 0.055], cloth) +
      shoe(foot, t, h * 0.05) +
      '<path d="' + dTorso + '" fill="' + cloth + '" ' + S(2.4) + "/>" +
      (opt.darkShirt ? "" : hatchIn(dTorso, shoulder[0] - h * 0.14, shoulder[1], h * 0.3, h * 0.32, 9)) +
      arm +
      limb([[headC[0], headC[1] + r * 0.8], [shoulder[0], shoulder[1] - h * 0.005]], [h * 0.05, h * 0.07], SKIN) +
      head(headC[0], headC[1], r, opt, t) +
      "</g>";
  }

  function fig(x, y, h, pose, opt) {
    opt = opt || {};
    if (pose === "sit") return figSeated(x, y, h, "sit", opt);
    if (pose === "write") return figSeated(x, y, h, "write", opt);
    if (pose === "sitHead") return figSeated(x, y, h, "head", opt);

    const t = opt.turn === -1 ? -1 : 1;
    const skirt = opt.dress === "skirt";
    const cloth = opt.darkShirt ? DARK : CLOTH;
    const j = wob(Math.round(x + y + h));
    const P = (ux, uy) => [x + ux * h * t + j() * 1.1, y + uy * h + j() * 1.1];

    const r = h * 0.082;
    const headC = P(0, -0.9);
    const shL = P(-0.115, -0.755), shR = P(0.115, -0.755);
    const hipL = P(-0.085, -0.47), hipR = P(0.085, -0.47);
    const AW = [h * 0.062, h * 0.05, h * 0.036];   // shoulder → elbow → hand
    const LW = [h * 0.115, h * 0.085, h * 0.06];   // hip → knee → foot
    // feet are fixed once: the shoe and the leg must land on the same point
    const fL = P(-0.09, -0.015), fR = P(0.09, -0.015);
    const sfL = P(-0.065, -0.012), sfR = P(0.065, -0.012);   // narrower stance under a skirt

    let arms = "", legs = "", extra = "";
    const arm = (a, b, c) => limb([a, b, c], AW, cloth);

    switch (pose) {
      case "talk":
        arms = arm(shL, P(-0.175, -0.63), P(-0.115, -0.52)) + arm(shR, P(0.195, -0.66), P(0.3, -0.72));
        break;
      case "listen":
        arms = arm(shL, P(-0.17, -0.63), P(-0.03, -0.575)) + arm(shR, P(0.17, -0.63), P(0.04, -0.555));
        break;
      case "point":
        arms = arm(shL, P(-0.16, -0.63), P(-0.1, -0.5)) + arm(shR, P(0.21, -0.73), P(0.37, -0.755));
        break;
      case "raise":
        arms = arm(shL, P(-0.16, -0.63), P(-0.11, -0.5)) + arm(shR, P(0.17, -0.87), P(0.145, -1.04));
        break;
      case "plead":
        arms = arm(shL, P(-0.19, -0.68), P(-0.065, -0.64)) + arm(shR, P(0.19, -0.68), P(0.065, -0.64));
        break;
      case "carry":
        extra = rect(x - h * 0.115, y - h * 0.635, h * 0.23, h * 0.145, CLOTH, 2.4) +
                hatch(x - h * 0.115, y - h * 0.635, h * 0.23, h * 0.145, 8);
        arms = arm(shL, P(-0.165, -0.66), P(-0.06, -0.6)) + arm(shR, P(0.165, -0.66), P(0.06, -0.6));
        break;
      default:
        arms = arm(shL, P(-0.155, -0.63), P(-0.15, -0.485)) + arm(shR, P(0.155, -0.63), P(0.15, -0.485));
    }

    if (pose === "kneel") {
      const knee = P(-0.09, -0.17), foot = P(0.17, -0.02);
      legs = limb([hipL, knee, foot], LW, cloth) +
             limb([hipR, P(0.1, -0.2), P(0.07, -0.01)], LW, cloth) + shoe(P(0.07, -0.01), t, h * 0.05);
    } else if (skirt) {
      const dSkirt =
        "M" + (x - h * 0.125 * t) + " " + (y - h * 0.52) +
        " q" + h * 0.125 * t + " -" + h * 0.03 + " " + h * 0.25 * t + " 0" +
        " q" + h * 0.05 * t + " " + h * 0.22 + " " + h * 0.075 * t + " " + h * 0.4 +
        " q" + (-h * 0.2 * t) + " " + h * 0.045 + " " + (-h * 0.4 * t) + " 0" +
        " q" + h * 0.025 * t + " -" + h * 0.18 + " " + h * 0.075 * t + " -" + h * 0.4 + "z";
      legs = '<path d="' + dSkirt + '" fill="' + CLOTH + '" ' + S(2.4) + "/>" +
             hatchIn(dSkirt, x - h * 0.24, y - h * 0.52, h * 0.48, h * 0.45, 11) +
             limb([P(-0.06, -0.13), sfL], [h * 0.05, h * 0.042], SKIN) +
             limb([P(0.06, -0.13), sfR], [h * 0.05, h * 0.042], SKIN) +
             shoe(sfL, -1, h * 0.042) + shoe(sfR, 1, h * 0.042);
    } else if (pose === "walk" || pose === "run") {
      const sp = pose === "run" ? 0.19 : 0.115;
      const wL = P(-sp, -0.015), wR = P(sp, -0.015);
      legs = limb([hipL, P(-sp * 0.5, -0.24), wL], LW, cloth) +
             limb([hipR, P(sp * 0.6, -0.23), wR], LW, cloth) +
             shoe(wL, -1, h * 0.05) + shoe(wR, 1, h * 0.05);
    } else {
      legs = limb([hipL, P(-0.085, -0.24), fL], LW, cloth) +
             limb([hipR, P(0.085, -0.24), fR], LW, cloth) +
             shoe(fL, -1, h * 0.05) + shoe(fR, 1, h * 0.05);
    }

    // torso: sloping shoulders, narrow waist, flared hem
    const dTorso =
      "M" + shL[0] + " " + shL[1] +
      " q" + h * 0.115 * t + " -" + h * 0.055 + " " + h * 0.23 * t + " 0" +
      " q" + h * 0.01 * t + " " + h * 0.1 + " -" + h * 0.02 * t + " " + h * 0.16 +
      " q" + h * 0.015 * t + " " + h * 0.06 + " " + h * 0.005 * t + " " + h * 0.13 +
      " l" + (-h * 0.2 * t) + " 0" +
      " q0 -" + h * 0.07 + " " + h * 0.005 * t + " -" + h * 0.13 +
      " q" + (-h * 0.03 * t) + " -" + h * 0.06 + " " + (-h * 0.02 * t) + " -" + h * 0.16 + "z";

    const collar = '<path d="M' + (headC[0] - h * 0.045 * t) + " " + (shL[1] + h * 0.012) +
      " l" + h * 0.045 * t + " " + h * 0.045 + " l" + h * 0.045 * t + " -" + h * 0.045 + '" fill="none" ' + S(1.8) + "/>";

    return "<g>" + legs +
      '<path d="' + dTorso + '" fill="' + cloth + '" ' + S(2.5) + "/>" +
      (opt.darkShirt ? "" : hatchIn(dTorso, x - h * 0.14, y - h * 0.76, h * 0.3, h * 0.3, 9)) +
      arms + extra + collar +
      limb([[headC[0], headC[1] + r * 0.75], [headC[0], shL[1] + h * 0.005]], [h * 0.05, h * 0.075], SKIN) +
      head(headC[0], headC[1], r, opt, t) +
      "</g>";
  }

  /* a person lying down — head on a pillow at the left, blanket over the body */
  function lying(x, y, len) {
    const hr = len * 0.085;                       // head radius
    const bodyTop = y - len * 0.1;
    const dBlanket =
      "M" + (x + len * 0.2) + " " + bodyTop +
      " L" + (x + len) + " " + (y - len * 0.06) +
      " L" + (x + len) + " " + y +
      " L" + (x + len * 0.2) + " " + y + "z";
    return "<g>" +
      // pillow
      '<path d="M' + (x - len * 0.06) + " " + (y - len * 0.02) +
      " q" + len * 0.02 + " -" + len * 0.2 + " " + len * 0.26 + " -" + len * 0.16 +
      " l0 " + len * 0.18 + 'z" fill="' + CLOTH + '" ' + S(2.4) + "/>" +
      // head + hair
      '<circle cx="' + (x + len * 0.13) + '" cy="' + (y - len * 0.2) + '" r="' + hr + '" fill="' + SKIN + '" ' + S(2.4) + "/>" +
      '<path d="M' + (x + len * 0.13 - hr) + " " + (y - len * 0.2 - hr * 0.3) +
      " a" + hr + " " + hr + " 0 0 1 " + hr * 2 + " 0 l0 -" + hr * 0.7 + " l-" + hr * 2 + ' 0z" fill="' + INK + '"/>' +
      // blanket
      '<path d="' + dBlanket + '" fill="' + CLOTH + '" ' + S(2.6) + "/>" +
      hatchIn(dBlanket, x + len * 0.2, bodyTop, len * 0.8, len * 0.12, 9) +
      // arm resting on the blanket
      poly([[x + len * 0.3, y - len * 0.07], [x + len * 0.5, y - len * 0.11]], null, len * 0.03) +
      "</g>";
  }

  /* ---------------- props ---------------- */
  const room = (wallY, opt) => {
    opt = opt || {};
    return rect(0, 0, W, wallY, "#e4e0d7", 0) +
      line(0, wallY, W, wallY, 2.6) +
      (opt.corner ? line(opt.corner, 0, opt.corner, wallY, 2.2) : "") +
      (opt.window
        ? rect(opt.window, 40, 120, 95, "#f4f2ec") + line(opt.window + 60, 40, opt.window + 60, 135, 1.8) +
          line(opt.window, 88, opt.window + 120, 88, 1.8)
        : "") +
      (opt.frame
        ? rect(opt.frame, 48, 74, 60, "#f4f2ec") +
          '<circle cx="' + (opt.frame + 37) + '" cy="' + 72 + '" r="11" fill="' + SKIN + '" ' + S(1.8) + "/>" +
          '<path d="M' + (opt.frame + 18) + " 108 q19 -22 38 0z" + '" fill="' + CLOTH + '" ' + S(1.8) + "/>"
        : "");
  };

  const bed = (x, y, w) =>
    rect(x - 14, y - 128, 16, 128, CLOTH, 2.8) +          // headboard
    rect(x + w - 2, y - 96, 16, 96, CLOTH, 2.8) +         // footboard
    rect(x, y - 62, w, 30, CLOTH, 2.8) +                  // mattress
    line(x + 4, y - 32, x + 4, y, 3) + line(x + w - 6, y - 32, x + w - 6, y, 3);

  const table = (x, y, w, h) =>
    rect(x, y - h, w, 9, CLOTH, 2.6) +
    line(x + 8, y - h + 9, x + 12, y, 3) +
    line(x + w - 8, y - h + 9, x + w - 12, y, 3);

  const chair = (x, y, s, back) =>
    rect(x, y - 34 * s, 44 * s, 7 * s, CLOTH, 2.4) +
    (back ? rect(x + (back < 0 ? 0 : 37 * s), y - 82 * s, 7 * s, 50 * s, CLOTH, 2.4) : "") +
    line(x + 4 * s, y - 27 * s, x + 4 * s, y, 2.6) +
    line(x + 40 * s, y - 27 * s, x + 40 * s, y, 2.6);

  const lamp = (x, y) =>
    '<path d="M' + (x - 26) + " " + (y - 46) + " l10 -34 l32 0 l10 34z" + '" fill="' + CLOTH + '" ' + S(2.4) + "/>" +
    hatch(x - 22, y - 78, 44, 30, 7) +
    line(x, y - 46, x, y - 10, 3) +
    '<path d="M' + (x - 16) + " " + y + " q16 -12 32 0z" + '" fill="' + CLOTH + '" ' + S(2.2) + "/>";

  const tree = (x, y, s) =>
    line(x, y, x, y - 66 * s, 6) +
    line(x, y - 40 * s, x - 22 * s, y - 62 * s, 4) +
    line(x, y - 46 * s, x + 20 * s, y - 66 * s, 4) +
    '<g fill="' + CLOTH + '" ' + S(2.6) + '>' +
    '<ellipse cx="' + x + '" cy="' + (y - 104 * s) + '" rx="' + 54 * s + '" ry="' + 40 * s + '"/>' +
    '<ellipse cx="' + (x - 40 * s) + '" cy="' + (y - 80 * s) + '" rx="' + 30 * s + '" ry="' + 24 * s + '"/>' +
    '<ellipse cx="' + (x + 42 * s) + '" cy="' + (y - 82 * s) + '" rx="' + 28 * s + '" ry="' + 22 * s + '"/>' +
    "</g>" +
    hatch(x - 20 * s, y - 128 * s, 74 * s, 44 * s, 9);

  const hut = (x, y, s) =>
    rect(x - 60 * s, y - 66 * s, 120 * s, 66 * s, CLOTH, 2.6) +
    '<path d="M' + (x - 78 * s) + " " + (y - 66 * s) + " L" + x + " " + (y - 116 * s) + " L" + (x + 78 * s) + " " + (y - 66 * s) + 'z" fill="' + CLOTH + '" ' + S(2.6) + "/>" +
    hatchIn('M' + (x - 78 * s) + ' ' + (y - 66 * s) + ' L' + x + ' ' + (y - 116 * s) + ' L' + (x + 78 * s) + ' ' + (y - 66 * s) + 'z', x - 78 * s, y - 116 * s, 156 * s, 50 * s, 9) +
    rect(x - 16 * s, y - 44 * s, 32 * s, 44 * s, "#cfcabf", 2.2);

  const doorway = (x, y, s) =>
    rect(x, y - 150 * s, 82 * s, 150 * s, "#dedad1", 2.6) +
    line(x + 68 * s, y - 140 * s, x + 68 * s, y - 10 * s, 2);

  const cycle = (x, y, s) =>
    '<g fill="none" ' + S(2.6) + '><circle cx="' + (x - 30 * s) + '" cy="' + y + '" r="' + 26 * s + '"/>' +
    '<circle cx="' + (x + 34 * s) + '" cy="' + y + '" r="' + 26 * s + '"/>' +
    '<path d="M' + (x - 30 * s) + " " + y + " L" + (x - 2 * s) + " " + (y - 34 * s) + " L" + (x + 34 * s) + " " + y +
    " M" + (x - 2 * s) + " " + (y - 34 * s) + " l-" + 20 * s + " -" + 14 * s + '"/></g>';

  const cart = (x, y, s) =>
    rect(x - 60 * s, y - 46 * s, 120 * s, 26 * s, CLOTH, 2.6) +
    '<circle cx="' + (x - 32 * s) + '" cy="' + (y - 8 * s) + '" r="' + 16 * s + '" fill="none" ' + S(2.6) + "/>" +
    '<circle cx="' + (x + 32 * s) + '" cy="' + (y - 8 * s) + '" r="' + 16 * s + '" fill="none" ' + S(2.6) + "/>";

  const boat = (x, y, s) =>
    '<path d="M' + (x - 80 * s) + " " + y + " q" + 80 * s + " " + 30 * s + " " + 160 * s + " 0" +
    " l-" + 16 * s + " " + 16 * s + " q-" + 64 * s + " " + 16 * s + " -" + 128 * s + ' 0z" fill="' + CLOTH + '" ' + S(2.6) + "/>";

  const water = (y) =>
    '<g stroke="' + INK + '" stroke-width="1.6" opacity=".65" fill="none">' +
    Array.from({ length: 7 }, (_, i) =>
      '<path d="M' + (20 + (i % 3) * 40) + " " + (y + i * 16) + ' q30 -9 60 0 q30 9 60 0 q30 -9 60 0"/>').join("") +
    "</g>";

  const road = () =>
    '<path d="M250 210 L360 210 L520 440 L90 440z" fill="#ded9d0" ' + S(2.4) + "/>" +
    '<g stroke="' + INK + '" stroke-width="3" opacity=".7">' +
    '<line x1="303" y1="228" x2="303" y2="256"/><line x1="299" y1="286" x2="299" y2="326"/>' +
    '<line x1="293" y1="356" x2="293" y2="412"/></g>';

  const fence = (y) =>
    '<g ' + S(2.2) + ">" + Array.from({ length: 9 }, (_, i) =>
      '<line x1="' + (30 + i * 72) + '" y1="' + y + '" x2="' + (30 + i * 72) + '" y2="' + (y - 46) + '"/>').join("") +
    '<line x1="20" y1="' + (y - 30) + '" x2="620" y2="' + (y - 30) + '"/></g>';

  const crowd = (x, y, n, h) => {
    let out = "";
    for (let i = 0; i < n; i++) {
      out += fig(x + i * h * 0.42, y + (i % 2) * 4, h * (i % 2 ? 0.94 : 1.04),
        i % 3 === 0 ? "talk" : "stand",
        { hair: i % 3 === 1 ? "long" : "short", dress: i % 3 === 1 ? "skirt" : "trousers", turn: i % 2 ? -1 : 1, darkShirt: i % 4 === 0 });
    }
    return out;
  };

  const papers = (x, y) =>
    '<g ' + S(1.8) + ' fill="' + CLOTH + '">' +
    '<rect x="' + x + '" y="' + y + '" width="34" height="24" transform="rotate(-8 ' + x + " " + y + ')"/>' +
    '<rect x="' + (x + 40) + '" y="' + (y + 6) + '" width="34" height="24" transform="rotate(6 ' + (x + 40) + " " + (y + 6) + ')"/>' +
    "</g>";

  /* photocopy grain + a soft vignette, laid over every scene */
  const GRAIN =
    '<rect width="' + W + '" height="' + H + '" filter="url(#gr)" opacity=".38"/>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#vig)"/>';

  function frame(inner, groundY) {
    groundY = groundY == null ? 300 : groundY;
    return (
      '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      "<defs>" +
      '<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>' +
      '<feColorMatrix type="saturate" values="0"/></filter>' +
      '<radialGradient id="vig" cx="50%" cy="45%" r="75%">' +
      '<stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".22"/>' +
      "</radialGradient>" +
      "</defs>" +
      '<rect width="' + W + '" height="' + H + '" fill="' + PAPER + '"/>' +
      inner +
      GRAIN +
      "</svg>"
    // A mirrored figure (turn:-1) can make an already-negative number follow a
    // literal "-" in a path, giving "l--52.8". The intended value is the double
    // negation, so collapse the pair. Nothing else in this markup contains "--".
    ).replace(/--/g, "");
  }

  const outdoor = (groundY, bg) =>
    '<rect y="' + groundY + '" width="' + W + '" height="' + (H - groundY) + '" fill="#ddd8ce"/>' +
    (bg || "") + line(0, groundY, W, groundY, 2.2);

  /* ---------------- the 40 pictures ---------------- */
  const SCENES = [
    { id: 1, hint: "two people talking outdoors",
      svg: () => frame(outdoor(330, tree(70, 300, 1.1) + hut(560, 300, .8)) +
        fig(250, 380, 277, "talk", { hair: "short", darkShirt: true }) +
        fig(360, 382, 271, "listen", { hair: "long", dress: "skirt", turn: -1 })) },

    { id: 2, hint: "man beside a sick person in bed",
      svg: () => frame(room(330, { frame: 400, window: 40 }) +
        bed(300, 415, 300) + lying(306, 380, 290) +
        fig(180, 415, 304, "stand", { hair: "short", beard: true }) +
        table(300, 400, 90, 96) + lamp(345, 304), 330) },

    { id: 3, hint: "family group at a table",
      svg: () => frame(room(330, { corner: 520 }) + table(180, 400, 300, 120) +
        fig(150, 415, 271, "write", { hair: "short", turn: 1 }) +
        fig(300, 415, 264, "sit", { hair: "long", dress: "skirt", turn: -1 }) +
        fig(420, 415, 251, "sit", { hair: "short", turn: -1 }) + papers(240, 288), 330) },

    { id: 4, hint: "person sitting alone, head in hand",
      svg: () => frame(room(330, { corner: 120, frame: 470 }) +
        chair(285, 400, 1.6, -1) + fig(320, 415, 284, "sitHead", { hair: "short", turn: -1 }), 330) },

    { id: 5, hint: "group of young men around a table",
      svg: () => frame(room(325) + table(150, 400, 350, 128) +
        fig(120, 415, 264, "sit", { hair: "short", darkShirt: true }) +
        fig(275, 415, 257, "sit", { hair: "short", turn: -1 }) +
        fig(380, 415, 244, "sit", { hair: "short", turn: -1 }) +
        fig(500, 415, 264, "talk", { hair: "cap", turn: -1 }) + papers(300, 280), 325) },

    { id: 6, hint: "figure helping someone who has fallen",
      svg: () => frame(outdoor(330, tree(560, 300, 1)) +
        lying(200, 410, 210) + fig(370, 415, 284, "kneel", { hair: "short" }) +
        fig(470, 415, 271, "point", { hair: "short", turn: -1 })) },

    { id: 7, hint: "student at a desk with a lamp",
      svg: () => frame(room(330, { window: 430 }) + table(190, 400, 250, 120) +
        fig(250, 415, 271, "write", { hair: "short" }) + lamp(400, 282) + papers(300, 268), 330) },

    { id: 8, hint: "two figures in front of a house door",
      svg: () => frame(room(330, { corner: 70 }) + doorway(430, 400, 1) +
        fig(230, 415, 284, "talk", { hair: "short" }) +
        fig(340, 415, 271, "listen", { hair: "long", dress: "skirt", turn: -1 }), 330) },

    { id: 9, hint: "crowd listening to one person",
      svg: () => frame(outdoor(335, hut(90, 310, .7)) +
        fig(180, 415, 297, "raise", { hair: "short", darkShirt: true }) + crowd(300, 402, 6, 228)) },

    { id: 10, hint: "people near a river with a boat",
      svg: () => frame(outdoor(250, "") + water(258) + boat(200, 330, 1) +
        fig(150, 322, 251, "point", { hair: "short" }) +
        fig(430, 415, 284, "stand", { hair: "long", dress: "skirt", turn: -1 }) +
        fig(510, 415, 271, "carry", { hair: "short", turn: -1 })) },

    { id: 11, hint: "figure walking alone on a road",
      svg: () => frame(outdoor(210, tree(80, 250, .8) + tree(560, 246, .9)) + road() +
        fig(300, 415, 304, "walk", { hair: "short" })) },

    { id: 12, hint: "elderly person and a young one",
      svg: () => frame(room(330, { frame: 90 }) + chair(430, 400, 1.5, 1) +
        fig(240, 415, 297, "talk", { hair: "short" }) +
        fig(455, 415, 271, "sit", { hair: "short", beard: true, turn: -1 }), 330) },

    { id: 13, hint: "villagers carrying loads",
      svg: () => frame(outdoor(330, hut(520, 300, .9) + tree(60, 300, .9)) +
        fig(190, 415, 277, "carry", { hair: "short" }) +
        fig(300, 415, 264, "carry", { hair: "long", dress: "skirt" }) +
        fig(400, 415, 257, "walk", { hair: "short" })) },

    { id: 14, hint: "two figures arguing at a table",
      svg: () => frame(room(325) + table(200, 400, 240, 120) +
        fig(170, 415, 284, "point", { hair: "short", darkShirt: true }) +
        fig(470, 415, 277, "talk", { hair: "short", turn: -1 }), 325) },

    { id: 15, hint: "family at home in the evening",
      svg: () => frame(room(330, { window: 60, frame: 470 }) +
        chair(240, 400, 1.5, -1) +
        fig(275, 415, 264, "sit", { hair: "long", dress: "skirt", turn: -1 }) +
        fig(400, 415, 290, "talk", { hair: "short", beard: true, turn: -1 }) +
        fig(500, 415, 185, "stand", { hair: "short", turn: -1 }), 330) },

    { id: 16, hint: "figure pointing towards the distance",
      svg: () => frame(outdoor(280, tree(590, 280, .9)) +
        fig(200, 415, 297, "point", { hair: "short" }) +
        fig(300, 415, 277, "stand", { hair: "short", turn: -1 }) +
        fig(380, 415, 271, "listen", { hair: "long", dress: "skirt", turn: -1 })) },

    { id: 17, hint: "class or meeting, one standing",
      svg: () => frame(room(325, { corner: 560 }) +
        fig(150, 415, 297, "talk", { hair: "short" }) +
        chair(280, 400, 1.3, -1) + chair(390, 400, 1.3, -1) + chair(500, 400, 1.3, -1) +
        fig(310, 415, 257, "sit", { hair: "short", turn: -1 }) +
        fig(420, 415, 251, "sit", { hair: "long", dress: "skirt", turn: -1 }) +
        fig(528, 415, 257, "sit", { hair: "short", turn: -1 }), 325) },

    { id: 18, hint: "person at a window looking out",
      svg: () => frame(room(335, { window: 250 }) +
        fig(310, 415, 297, "stand", { hair: "long", dress: "skirt", turn: -1 }) +
        chair(120, 400, 1.4, 1), 335) },

    { id: 19, hint: "night scene, figures with a lamp",
      svg: () => frame('<rect width="' + W + '" height="' + H + '" fill="#cfcbc2"/>' + outdoor(300, hut(540, 300, .8)) +
        hatch(0, 0, W, 300, 12) +
        fig(230, 415, 284, "carry", { hair: "short" }) +
        fig(330, 415, 271, "walk", { hair: "short", turn: -1 }) + lamp(430, 330)) },

    { id: 20, hint: "figure helping another up a slope",
      svg: () => frame(outdoor(330, '<path d="M0 300 q160 -110 330 -40 q140 -60 310 10 L640 440 L0 440z" fill="#d8d3c9" ' + S(2.2) + "/>") +
        fig(300, 330, 264, "point", { hair: "short" }) +
        fig(390, 370, 257, "kneel", { hair: "short", turn: -1 })) },

    { id: 21, hint: "busy market",
      svg: () => frame(outdoor(330, hut(80, 300, .8) + hut(560, 302, .8)) + cart(300, 400, 1) + crowd(160, 402, 7, 222)) },

    { id: 22, hint: "cyclist and a pedestrian",
      svg: () => frame(outdoor(220, tree(70, 260, .8)) + road() + cycle(230, 380, 1.1) +
        fig(226, 356, 238, "sit", { hair: "short" }) + fig(430, 415, 284, "walk", { hair: "short", turn: -1 })) },

    { id: 23, hint: "two figures lifting something together",
      svg: () => frame(outdoor(330, tree(590, 300, .9)) +
        fig(250, 415, 284, "carry", { hair: "short" }) +
        fig(390, 415, 284, "carry", { hair: "short", turn: -1 }) +
        rect(285, 322, 70, 26, CLOTH, 2.4)) },

    { id: 24, hint: "person alone at the waterside",
      svg: () => frame(outdoor(230, "") + water(240) +
        fig(300, 415, 304, "stand", { hair: "long", dress: "skirt", turn: -1 }) + tree(80, 300, .9)) },

    { id: 25, hint: "obstruction on a road, people gathered",
      svg: () => frame(outdoor(220, tree(600, 250, .8)) + road() +
        '<rect x="200" y="300" width="250" height="20" rx="8" fill="' + CLOTH + '" ' + S(2.4) + ' transform="rotate(-9 325 310)"/>' +
        fig(210, 415, 271, "kneel", { hair: "short" }) + fig(420, 415, 284, "point", { hair: "short", turn: -1 })) },

    { id: 26, hint: "one person addressing a small group",
      svg: () => frame(room(330, { corner: 100 }) +
        fig(180, 415, 304, "raise", { hair: "short", darkShirt: true }) + crowd(300, 402, 5, 234), 330) },

    { id: 27, hint: "figure on a bridge over water",
      svg: () => frame(outdoor(250, "") + water(300) +
        rect(90, 240, 460, 14, CLOTH, 2.6) + line(140, 254, 140, 300, 3) + line(500, 254, 500, 300, 3) +
        fig(300, 240, 251, "walk", { hair: "short" })) },

    { id: 28, hint: "two figures greeting each other",
      svg: () => frame(outdoor(330, hut(560, 300, .8) + tree(70, 300, .9)) +
        fig(255, 415, 284, "point", { hair: "short" }) +
        fig(370, 415, 284, "point", { hair: "short", turn: -1, darkShirt: true })) },

    { id: 29, hint: "someone studying late at night",
      svg: () => frame(room(330, { window: 470 }) + hatch(0, 0, W, 300, 11) +
        table(180, 400, 260, 120) + fig(240, 415, 271, "write", { hair: "long", dress: "skirt" }) +
        lamp(400, 282) + papers(300, 268), 330) },

    { id: 30, hint: "rescue at the waterside",
      svg: () => frame(outdoor(240, "") + water(250) + boat(170, 320, .9) +
        fig(170, 312, 231, "point", { hair: "short" }) +
        fig(390, 415, 264, "raise", { hair: "short", turn: -1 }) +
        fig(470, 415, 257, "kneel", { hair: "short", turn: -1 })) },

    { id: 31, hint: "people stopped at a gate",
      svg: () => frame(outdoor(330, "") + fence(300) + doorway(60, 400, .9) + cart(470, 400, 1) +
        fig(280, 415, 290, "raise", { hair: "cap", darkShirt: true }) +
        fig(360, 415, 277, "talk", { hair: "short", turn: -1 })) },

    { id: 32, hint: "an adult and a child",
      svg: () => frame(outdoor(330, tree(90, 300, 1) + hut(560, 300, .7)) +
        fig(280, 415, 304, "stand", { hair: "short" }) +
        fig(370, 415, 185, "talk", { hair: "short", turn: -1 })) },

    { id: 33, hint: "people working in a field",
      svg: () => frame(outdoor(330, tree(600, 300, .8)) + fence(304) +
        fig(200, 415, 257, "kneel", { hair: "short" }) +
        fig(320, 415, 251, "kneel", { hair: "long", dress: "skirt" }) +
        fig(430, 415, 277, "carry", { hair: "short", turn: -1 })) },

    { id: 34, hint: "figure stopped by a wall",
      svg: () => frame(outdoor(330, "") +
        rect(360, 150, 28, 160, "#d5d0c6", 2.6) + rect(360, 150, 230, 16, "#d5d0c6", 2.6) +
        fig(240, 415, 297, "raise", { hair: "short" }) + fig(310, 415, 271, "stand", { hair: "short", turn: -1 })) },

    { id: 35, hint: "people around a broken cart",
      svg: () => frame(outdoor(230, tree(80, 270, .8)) + road() + cart(330, 410, 1.2) +
        fig(200, 415, 277, "kneel", { hair: "short" }) + fig(450, 415, 277, "point", { hair: "short", turn: -1 })) },

    { id: 36, hint: "figure on a rooftop or high place",
      svg: () => frame(outdoor(320, "") +
        rect(150, 230, 330, 96, "#d9d4ca", 2.6) + line(150, 222, 480, 222, 3) +
        fig(300, 222, 251, "point", { hair: "short" }) + fig(120, 415, 264, "stand", { hair: "short", turn: -1 })) },

    { id: 37, hint: "a queue of people waiting",
      svg: () => frame(outdoor(330, hut(560, 300, .9)) +
        fig(170, 415, 271, "stand", { hair: "short" }) +
        fig(250, 415, 264, "listen", { hair: "long", dress: "skirt" }) +
        fig(330, 415, 271, "carry", { hair: "short" }) +
        fig(410, 415, 257, "stand", { hair: "cap" })) },

    { id: 38, hint: "training on an obstacle",
      svg: () => frame(outdoor(330, "") +
        line(230, 200, 230, 310, 4) + line(410, 200, 410, 310, 4) + line(230, 200, 410, 200, 4) +
        fig(320, 300, 264, "raise", { hair: "short" }) + fig(500, 415, 271, "stand", { hair: "cap", turn: -1 })) },

    { id: 39, hint: "people caught in heavy rain",
      svg: () => frame(outdoor(330, tree(600, 300, .8)) +
        '<g stroke="' + INK + '" stroke-width="1.5" opacity=".5">' +
        Array.from({ length: 44 }, (_, i) =>
          '<line x1="' + (i * 15) + '" y1="' + ((i * 41) % 230) + '" x2="' + (i * 15 - 14) + '" y2="' + (((i * 41) % 230) + 52) + '"/>').join("") +
        "</g>" +
        fig(250, 415, 277, "walk", { hair: "short" }) +
        fig(360, 415, 264, "carry", { hair: "long", dress: "skirt", turn: -1 })) },

    { id: 40, hint: "one figure facing a group",
      svg: () => frame(outdoor(330, hut(60, 300, .7)) +
        fig(180, 415, 304, "stand", { hair: "short", darkShirt: true }) + crowd(320, 402, 5, 234)) },
  ];

  global.PPDT_SCENES = SCENES;
})(window);
