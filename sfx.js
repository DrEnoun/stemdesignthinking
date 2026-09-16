/* Bunyi kesan ringkas untuk slaid Design Thinking — dijana Web Audio, tiada fail audio luar. */
(function () {
  var ctx = null;

  function ac() {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) ctx = new C();
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  }

  function tone(opts) {
    var c = ac();
    if (!c) return;
    var t = c.currentTime + (opts.at || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = opts.type || 'sine';
    o.frequency.setValueAtTime(opts.f, t);
    if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + opts.dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(opts.vol || 0.18, t + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0008, t + opts.dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + opts.dur + 0.03);
  }

  function burst(at, dur, vol, freq, q) {
    var c = ac();
    if (!c) return;
    var t = c.currentTime + at;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource();
    src.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq || 1600;
    bp.Q.value = q || 0.9;
    var g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(c.destination);
    src.start(t);
    src.stop(t + dur);
  }

  var SFX = {
    click: function () {
      tone({ f: 660, dur: 0.07, type: 'triangle', vol: 0.12 });
    },
    flip: function () {
      tone({ f: 420, to: 760, dur: 0.14, type: 'triangle', vol: 0.13 });
    },
    correct: function () {
      [523.25, 659.25, 783.99].forEach(function (f, i) {
        tone({ f: f, dur: 0.18, at: i * 0.075, type: 'triangle', vol: 0.16 });
      });
    },
    wrong: function () {
      tone({ f: 300, to: 150, dur: 0.22, type: 'sawtooth', vol: 0.14 });
      tone({ f: 200, to: 110, dur: 0.3, at: 0.16, type: 'square', vol: 0.1 });
    },
    win: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone({ f: f, dur: 0.24, at: i * 0.09, type: 'triangle', vol: 0.17 });
      });
      tone({ f: 1318.5, dur: 0.5, at: 0.42, type: 'sine', vol: 0.14 });
      for (var i = 0; i < 26; i++) {
        var at = 0.3 + Math.random() * 1.05;
        burst(at, 0.05 + Math.random() * 0.05, 0.05 + Math.random() * 0.05, 1200 + Math.random() * 2400, 1.1);
      }
    },
    whoosh: function () {
      tone({ f: 180, to: 900, dur: 0.5, type: 'sine', vol: 0.12 });
      burst(0, 0.5, 0.05, 900, 0.7);
    }
  };

  window.DTSFX = SFX;
})();
