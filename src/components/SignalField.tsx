import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function SignalField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const phase = useRef(0);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0,
      height = 0,
      frame = 0,
      visible = true;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const parent = canvas.parentElement!;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const draw = () => {
      const clock = phase.current;
      ctx.clearRect(0, 0, width, height);
      const rows = width < 600 ? 28 : 40;
      for (let row = 0; row < rows; row++) {
        const depth = row / rows;
        const step = width < 600 ? 12 : 13;
        ctx.beginPath();
        for (let x = -40; x < width + 40; x += step) {
          const wave =
            Math.sin(x * 0.0045 + depth * 4.3 - clock) * (28 + depth * 66) +
            Math.sin(x * 0.008 + depth * 7 + clock * 0.55) * 12;
          let y = height * 0.51 + depth * depth * height * 0.4 + wave;
          const dx = x - pointer.x,
            dy = y - pointer.y,
            distance = Math.hypot(dx, dy);
          if (distance < 200 && !reduced.matches)
            y +=
              Math.cos(((distance / 200) * Math.PI) / 2) *
              Math.sin(distance * 0.035 - clock * 4) *
              29;
          const fade = Math.max(0.04, Math.min(1, (x / width - 0.12) * 1.6));
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          ctx.fillStyle = `rgba(139,216,222,${(0.13 + depth * 0.38) * fade})`;
          ctx.fillRect(x, y, depth > 0.75 ? 1.65 : 1, depth > 0.75 ? 1.65 : 1);
        }
        ctx.strokeStyle = `rgba(101,193,206,${0.035 + depth * 0.025})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    };
    let previous = 0;
    const animate = (timestamp: number) => {
      phase.current += previous
        ? Math.min(timestamp - previous, 40) * 0.00024
        : 0;
      previous = timestamp;
      draw();
      frame = requestAnimationFrame(animate);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden) {
        draw();
        if (!paused && !reduced.matches) frame = requestAnimationFrame(animate);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    intersection.observe(canvas);
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    resize();
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
      observer.disconnect();
      intersection.disconnect();
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, [paused]);
  return (
    <>
      <canvas ref={ref} className="signal-field" aria-hidden="true" />
      <button
        className="motion-control"
        onClick={() => setPaused((p) => !p)}
        aria-label={
          paused
            ? "Play ambient wave animation"
            : "Pause ambient wave animation"
        }
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
        <span>{paused ? "Motion paused" : "A field in motion"}</span>
      </button>
    </>
  );
}
