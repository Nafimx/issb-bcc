/* ppdt-scenes.js — 40 deliberately ambiguous PPDT pictures, drawn as inline SVG.
   Figures are silhouettes only: age, sex, mood and action must be inferred, which
   is exactly the point of the test. Rendered greyscale + blurred by the page CSS.
   No external images, so the drill works offline and carries no copyright risk. */
(function (global) {
  "use strict";

  const W = 600, H = 400;

  /* ---------- primitives ---------- */
  // Human silhouette. pose: stand | walk | run | sit | point | lie | carry | kneel | raise
  function person(x, y, s, pose, tone) {
    s = s || 1;
    tone = tone || "#3b3b3b";
    const g = (inner) =>
      '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + tone + '">' + inner + "</g>";
    const head = '<circle cx="0" cy="-46" r="7.5"/>';
    switch (pose) {
      case "walk":
        return g(head +
          '<path d="M0 -38 q6 10 4 22 l-2 10 -6 0 -2 -12 -4 12 -6 -1 6 -20 z"/>' +
          '<path d="M-2 -16 l-7 18 -5 -2 5 -18z M2 -16 l8 17 -5 3 -8 -18z"/>' +
          '<path d="M-1 -34 l-11 12 3 4 12 -10z M1 -34 l11 9 -3 5 -12 -8z"/>');
      case "run":
        return g('<circle cx="3" cy="-46" r="7.5"/>' +
          '<path d="M3 -38 q7 9 3 21 l-3 9 -7 -1 2 -13 -6 10 -6 -3 8 -17z"/>' +
          '<path d="M-2 -14 l-13 14 -5 -4 12 -16z M4 -14 l12 12 -5 5 -13 -12z"/>' +
          '<path d="M2 -34 l14 4 -1 6 -15 -3z M0 -33 l-14 -3 -2 6 15 4z"/>');
      case "sit":
        return g('<circle cx="0" cy="-40" r="7.5"/>' +
          '<path d="M0 -33 q6 8 5 18 l-11 0 -3 -16z"/>' +
          '<path d="M-6 -15 l16 0 0 6 -16 0z M8 -15 l2 16 -6 0 -2 -16z"/>' +
          '<path d="M-1 -30 l-9 8 3 5 9 -7z"/>');
      case "kneel":
        return g('<circle cx="0" cy="-38" r="7.5"/>' +
          '<path d="M0 -31 q6 9 4 18 l-10 0 -3 -16z"/>' +
          '<path d="M-8 -13 l16 0 1 5 -18 0z M6 -13 l3 8 -6 2 -3 -10z"/>');
      case "point":
        return g(head +
          '<path d="M0 -38 q6 10 5 22 l-2 16 -6 0 -1 -14 -3 14 -6 0 3 -22z"/>' +
          '<path d="M2 -35 l20 -8 2 5 -21 8z M-2 -34 l-10 12 4 4 10 -11z"/>');
      case "raise":
        return g(head +
          '<path d="M0 -38 q6 10 5 22 l-2 16 -6 0 -1 -14 -3 14 -6 0 3 -22z"/>' +
          '<path d="M2 -37 l7 -20 5 2 -6 20z M-3 -36 l-8 14 4 3 8 -13z"/>');
      case "lie":
        return g('<circle cx="-26" cy="0" r="7.5"/>' +
          '<path d="M-20 -5 q18 -3 34 2 l14 2 0 7 -18 1 q-16 3 -30 -1z"/>' +
          '<path d="M4 4 l20 5 -1 5 -21 -5z"/>');
      case "carry":
        return g(head +
          '<path d="M0 -38 q7 10 5 22 l-2 16 -6 0 -1 -14 -3 14 -6 0 3 -22z"/>' +
          '<path d="M2 -34 l16 6 -2 5 -16 -5z"/>' +
          '<rect x="14" y="-32" width="16" height="14" rx="2"/>');
      default: // stand
        return g(head +
          '<path d="M0 -38 q6 10 5 22 l-2 16 -6 0 -1 -14 -3 14 -6 0 3 -22z"/>' +
          '<path d="M2 -35 l9 14 -4 3 -10 -13z M-2 -35 l-9 14 4 3 10 -13z"/>');
    }
  }

  const tree = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#4a4a4a">' +
    '<rect x="-4" y="-40" width="8" height="42"/>' +
    '<ellipse cx="0" cy="-52" rx="30" ry="26"/><ellipse cx="-20" cy="-38" rx="18" ry="14"/>' +
    '<ellipse cx="22" cy="-40" rx="17" ry="13"/></g>';

  const palm = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#4a4a4a">' +
    '<path d="M-3 0 q4 -30 1 -56 l6 0 q3 26 -1 56z"/>' +
    '<path d="M2 -56 q22 -8 34 4 q-20 -2 -34 4z M2 -56 q-22 -8 -34 4 q20 -2 34 4z' +
    'M2 -58 q10 -22 30 -20 q-20 6 -28 22z M2 -58 q-10 -22 -30 -20 q20 6 28 22z"/></g>';

  const hut = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#454545">' +
    '<rect x="-34" y="-34" width="68" height="34"/>' +
    '<path d="M-46 -34 L0 -64 L46 -34z"/>' +
    '<rect x="-10" y="-22" width="20" height="22" fill="#2a2a2a"/></g>';

  const boat = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#3f3f3f">' +
    '<path d="M-52 0 q52 16 104 0 l-10 10 q-42 10 -84 0z"/>' +
    '<rect x="-2" y="-46" width="4" height="46"/><path d="M2 -44 l30 40 -30 0z"/></g>';

  const truck = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#3f3f3f">' +
    '<rect x="-50" y="-34" width="62" height="28" rx="3"/>' +
    '<path d="M12 -30 l22 0 12 14 0 10 -34 0z"/>' +
    '<circle cx="-30" cy="-2" r="9"/><circle cx="30" cy="-2" r="9"/></g>';

  const flagpole = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#454545">' +
    '<rect x="-2" y="-92" width="4" height="92"/><path d="M2 -90 l44 12 -44 12z"/></g>';

  const gate = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#464646">' +
    '<rect x="-56" y="-70" width="12" height="70"/><rect x="44" y="-70" width="12" height="70"/>' +
    '<rect x="-56" y="-80" width="112" height="12"/></g>';

  const table = (x, y, s) =>
    '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="#454545">' +
    '<rect x="-46" y="-18" width="92" height="7"/><rect x="-40" y="-11" width="5" height="18"/>' +
    '<rect x="35" y="-11" width="5" height="18"/></g>';

  const hills = (base, tone) =>
    '<path d="M0 ' + base + ' q90 -80 170 -10 q60 -60 140 -6 q70 -54 150 4 q60 -30 140 12 L600 ' +
    H + ' L0 ' + H + 'z" fill="' + (tone || "#555") + '"/>';

  const river = (y) =>
    '<path d="M0 ' + y + ' q150 26 300 6 q150 -20 300 10 L600 ' + H + ' L0 ' + H + 'z" fill="#6a6a6a"/>';

  const road = () =>
    '<path d="M250 200 L350 200 L470 400 L120 400z" fill="#5e5e5e"/>' +
    '<path d="M296 220 l8 0 -2 24 -8 0z M290 270 l12 0 -3 30 -12 0z M282 320 l16 0 -5 44 -18 0z" fill="#8a8a8a"/>';

  const crowd = (x, y, n, s) => {
    let out = "";
    for (let i = 0; i < n; i++) {
      const dx = x + i * 22 * (s || 1) + (i % 2 ? 5 : -4);
      out += person(dx, y + (i % 3) * 3, (s || 1) * (i % 2 ? 0.95 : 1.05), i % 4 === 0 ? "raise" : "stand", "#3d3d3d");
    }
    return out;
  };

  const smoke = (x, y) =>
    '<g fill="#7d7d7d" opacity=".75"><circle cx="' + x + '" cy="' + y + '" r="18"/>' +
    '<circle cx="' + (x + 20) + '" cy="' + (y - 20) + '" r="14"/>' +
    '<circle cx="' + (x - 16) + '" cy="' + (y - 24) + '" r="12"/></g>';

  /* Every scene: sky, ground, then its own content. */
  function frame(inner, groundY) {
    groundY = groundY || 250;
    return (
      '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#d8d8d8"/><stop offset="100%" stop-color="#a9a9a9"/></linearGradient>' +
      '<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#8f8f8f"/><stop offset="100%" stop-color="#6f6f6f"/></linearGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#sky)"/>' +
      '<rect y="' + groundY + '" width="' + W + '" height="' + (H - groundY) + '" fill="url(#gnd)"/>' +
      inner + "</svg>"
    );
  }

  /* ---------- the 40 scenes ---------- */
  const SCENES = [
    { id: 1, hint: "figure alone by a river", svg: () => frame(hills(230) + river(258) + tree(70, 262, 1) + person(300, 268, 1.5, "stand"), 230) },
    { id: 2, hint: "two figures near a boat", svg: () => frame(river(240) + boat(200, 300, 1) + person(330, 300, 1.4, "point") + person(390, 302, 1.3, "stand"), 235) },
    { id: 3, hint: "group around a table", svg: () => frame(table(300, 300, 1.5) + person(210, 300, 1.2, "sit") + person(300, 296, 1.2, "stand") + person(400, 300, 1.2, "sit"), 250) },
    { id: 4, hint: "figure on a road at dusk", svg: () => frame(road() + person(300, 330, 1.7, "walk") + tree(90, 260, .8) + tree(520, 258, .9), 200) },
    { id: 5, hint: "crowd at a gate", svg: () => frame(gate(300, 280, 1.2) + crowd(200, 320, 6, .9), 250) },
    { id: 6, hint: "figure climbing a hill", svg: () => frame(hills(210, "#5f5f5f") + person(360, 250, 1.3, "kneel") + person(300, 300, 1.4, "walk"), 210) },
    { id: 7, hint: "person lying, another kneeling", svg: () => frame(person(300, 330, 1.6, "lie") + person(390, 330, 1.5, "kneel") + tree(120, 300, 1), 240) },
    { id: 8, hint: "figures near a truck", svg: () => frame(truck(360, 320, 1.1) + person(180, 322, 1.4, "carry") + person(250, 322, 1.3, "walk"), 240) },
    { id: 9, hint: "flag being raised", svg: () => frame(flagpole(320, 300, 1.2) + person(280, 300, 1.3, "raise") + crowd(120, 305, 4, .8), 250) },
    { id: 10, hint: "two figures arguing or discussing", svg: () => frame(person(240, 310, 1.6, "point") + person(360, 310, 1.6, "stand") + hut(500, 300, .8), 245) },
    { id: 11, hint: "figure writing at a desk", svg: () => frame(table(300, 300, 1.4) + person(300, 292, 1.3, "sit") + tree(520, 280, .6), 250) },
    { id: 12, hint: "running figure, others watching", svg: () => frame(person(250, 320, 1.7, "run") + crowd(380, 322, 4, .8), 245) },
    { id: 13, hint: "village hut with figures", svg: () => frame(hut(200, 300, 1.1) + person(340, 305, 1.4, "stand") + person(400, 307, 1.2, "carry") + palm(520, 300, .9), 245) },
    { id: 14, hint: "figure by a fire or smoke", svg: () => frame(smoke(420, 190) + person(300, 310, 1.5, "point") + person(360, 312, 1.3, "stand") + hut(140, 305, .8), 245) },
    { id: 15, hint: "group crossing water", svg: () => frame(river(230) + person(220, 300, 1.3, "walk") + person(300, 305, 1.3, "carry") + person(370, 300, 1.2, "walk"), 230) },
    { id: 16, hint: "figure pointing towards distance", svg: () => frame(hills(220) + person(200, 310, 1.6, "point") + person(280, 312, 1.4, "stand") + person(340, 314, 1.3, "stand"), 235) },
    { id: 17, hint: "seated group listening to one standing", svg: () => frame(person(300, 285, 1.4, "stand") + person(180, 320, 1.2, "sit") + person(250, 322, 1.2, "sit") + person(380, 322, 1.2, "sit") + person(450, 320, 1.2, "sit"), 250) },
    { id: 18, hint: "figure at a window of a building", svg: () => frame('<rect x="120" y="150" width="360" height="150" fill="#5a5a5a"/><rect x="170" y="185" width="60" height="60" fill="#2f2f2f"/><rect x="370" y="185" width="60" height="60" fill="#2f2f2f"/>' + person(200, 245, 1, "stand") + person(300, 330, 1.4, "walk"), 250) },
    { id: 19, hint: "night patrol", svg: () => frame('<rect width="600" height="400" fill="#6b6b6b" opacity=".45"/>' + person(220, 320, 1.4, "walk") + person(300, 322, 1.4, "walk") + person(380, 320, 1.4, "walk") + tree(520, 300, .9), 240) },
    { id: 20, hint: "figure helping another up a slope", svg: () => frame(hills(215, "#606060") + person(300, 285, 1.4, "point") + person(340, 305, 1.3, "kneel"), 215) },
    { id: 21, hint: "crowded market", svg: () => frame(hut(120, 290, .8) + hut(480, 292, .8) + crowd(180, 318, 8, .85), 245) },
    { id: 22, hint: "cyclist and pedestrian on a road", svg: () => frame(road() + '<g transform="translate(220,320)" fill="#3f3f3f"><circle cx="-16" cy="0" r="14" fill="none" stroke="#3f3f3f" stroke-width="4"/><circle cx="18" cy="0" r="14" fill="none" stroke="#3f3f3f" stroke-width="4"/><path d="M-16 0 L2 -18 L18 0 M2 -18 l-6 -10"/></g>' + person(220, 300, 1.1, "sit") + person(400, 330, 1.5, "walk"), 210) },
    { id: 23, hint: "figures carrying a load together", svg: () => frame(person(240, 320, 1.4, "carry") + person(330, 320, 1.4, "carry") + '<rect x="255" y="278" width="70" height="10" fill="#3f3f3f"/>' + tree(520, 300, .9), 245) },
    { id: 24, hint: "single figure looking at the sea", svg: () => frame(river(215) + person(300, 300, 1.6, "stand") + palm(90, 300, 1), 215) },
    { id: 25, hint: "figures with a fallen tree across a path", svg: () => frame(road() + '<rect x="200" y="300" width="230" height="14" rx="6" fill="#454545" transform="rotate(-8 315 307)"/>' + person(230, 340, 1.4, "kneel") + person(400, 336, 1.4, "point"), 210) },
    { id: 26, hint: "one figure addressing a small group", svg: () => frame(person(180, 305, 1.6, "raise") + crowd(300, 315, 5, .9), 245) },
    { id: 27, hint: "figure on a bridge", svg: () => frame(river(250) + '<rect x="120" y="238" width="360" height="12" fill="#4d4d4d"/><rect x="150" y="250" width="8" height="40" fill="#4d4d4d"/><rect x="440" y="250" width="8" height="40" fill="#4d4d4d"/>' + person(300, 238, 1.3, "walk"), 245) },
    { id: 28, hint: "two figures shaking hands", svg: () => frame(person(255, 315, 1.6, "point") + '<g transform="scale(-1,1) translate(-345,0)">' + person(0, 315, 1.6, "point") + "</g>" + hut(500, 300, .7), 245) },
    { id: 29, hint: "figure studying alone at night", svg: () => frame('<rect width="600" height="400" fill="#6b6b6b" opacity=".4"/>' + table(300, 305, 1.4) + person(300, 296, 1.3, "sit") + '<circle cx="360" cy="286" r="12" fill="#c9c9c9" opacity=".8"/>', 250) },
    { id: 30, hint: "rescue from water", svg: () => frame(river(220) + boat(160, 290, .9) + person(180, 288, 1.1, "point") + person(340, 300, 1.2, "raise") + person(400, 305, 1, "stand"), 220) },
    { id: 31, hint: "figures at a checkpoint", svg: () => frame(gate(180, 290, .9) + truck(430, 320, 1) + person(280, 320, 1.4, "raise") + person(340, 322, 1.3, "stand"), 245) },
    { id: 32, hint: "child-sized figure with adult figure", svg: () => frame(person(280, 320, 1.6, "stand") + person(340, 320, .95, "stand") + tree(120, 300, 1) + hut(500, 300, .7), 245) },
    { id: 33, hint: "group planting or digging", svg: () => frame(person(220, 320, 1.3, "kneel") + person(300, 322, 1.3, "kneel") + person(390, 315, 1.4, "stand") + tree(520, 300, .8), 250) },
    { id: 34, hint: "figure blocked by a wall", svg: () => frame('<rect x="330" y="200" width="24" height="120" fill="#4d4d4d"/><rect x="330" y="200" width="200" height="14" fill="#4d4d4d"/>' + person(250, 320, 1.6, "raise") + person(300, 322, 1.3, "stand"), 245) },
    { id: 35, hint: "figures around a broken vehicle", svg: () => frame(road() + truck(320, 330, 1.1) + person(200, 335, 1.4, "kneel") + person(430, 332, 1.3, "point"), 210) },
    { id: 36, hint: "figure on a rooftop", svg: () => frame('<rect x="150" y="230" width="300" height="120" fill="#5a5a5a"/><rect x="150" y="222" width="300" height="12" fill="#4a4a4a"/>' + person(300, 222, 1.2, "point") + person(200, 330, 1.2, "stand"), 250) },
    { id: 37, hint: "queue of figures waiting", svg: () => frame(hut(480, 295, .9) + person(180, 320, 1.3, "stand") + person(240, 321, 1.3, "stand") + person(300, 320, 1.3, "carry") + person(360, 322, 1.3, "stand"), 248) },
    { id: 38, hint: "figure training on an obstacle", svg: () => frame('<rect x="240" y="250" width="10" height="80" fill="#4a4a4a"/><rect x="380" y="250" width="10" height="80" fill="#4a4a4a"/><rect x="240" y="250" width="150" height="9" fill="#4a4a4a"/>' + person(300, 250, 1.2, "raise") + person(470, 325, 1.3, "stand"), 250) },
    { id: 39, hint: "figures in heavy rain", svg: () => frame('<g stroke="#c4c4c4" stroke-width="2" opacity=".55">' + Array.from({ length: 40 }, (_, i) => '<line x1="' + (i * 16) + '" y1="' + ((i * 37) % 200) + '" x2="' + (i * 16 - 10) + '" y2="' + (((i * 37) % 200) + 40) + '"/>').join("") + "</g>" + person(260, 325, 1.4, "walk") + person(340, 327, 1.3, "carry") + tree(520, 300, .8), 245) },
    { id: 40, hint: "lone figure facing a crowd", svg: () => frame(person(150, 320, 1.7, "stand") + crowd(300, 322, 6, .9), 245) },
  ];

  global.PPDT_SCENES = SCENES;
})(window);
