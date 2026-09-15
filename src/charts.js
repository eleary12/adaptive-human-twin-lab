import { mixColorStops } from "./simulation.js";

function setupCanvas(canvas) {
  const context = canvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.width;
  const height = (canvas.clientWidth || canvas.width) * (canvas.height / canvas.width);

  canvas.width = width * scale;
  canvas.height = height * scale;
  context.setTransform(scale, 0, 0, scale, 0, 0);

  return {
    context,
    width,
    height,
  };
}

export function drawHistoryChart(canvas, history) {
  const { context, width, height } = setupCanvas(canvas);
  context.clearRect(0, 0, width, height);

  const inset = { top: 18, right: 18, bottom: 26, left: 36 };
  const plotWidth = width - inset.left - inset.right;
  const plotHeight = height - inset.top - inset.bottom;

  context.strokeStyle = "rgba(255,255,255,0.08)";
  context.lineWidth = 1;
  for (let index = 0; index <= 4; index += 1) {
    const y = inset.top + (plotHeight / 4) * index;
    context.beginPath();
    context.moveTo(inset.left, y);
    context.lineTo(width - inset.right, y);
    context.stroke();
  }

  const series = [
    { key: "cognition", color: "#7ce6c1" },
    { key: "physical", color: "#59c9ff" },
    { key: "endurance", color: "#f8b45d" },
  ];

  series.forEach(({ key, color }) => {
    context.strokeStyle = color;
    context.lineWidth = 2.2;
    context.beginPath();
    history.forEach((point, index) => {
      const x = inset.left + (index / Math.max(history.length - 1, 1)) * plotWidth;
      const y = inset.top + (1 - point[key]) * plotHeight;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  });

  context.fillStyle = "rgba(234,245,242,0.7)";
  context.font = '12px "Space Grotesk", sans-serif';
  context.fillText("100", 10, inset.top + 4);
  context.fillText("50", 16, inset.top + plotHeight / 2 + 4);
  context.fillText("0", 20, inset.top + plotHeight + 4);

  const labels = [
    { text: "Cognition", color: "#7ce6c1", x: inset.left },
    { text: "Physical", color: "#59c9ff", x: inset.left + 110 },
    { text: "Endurance", color: "#f8b45d", x: inset.left + 200 },
  ];

  labels.forEach(({ text, color, x }) => {
    context.fillStyle = color;
    context.fillRect(x, height - 16, 10, 10);
    context.fillStyle = "rgba(234,245,242,0.82)";
    context.fillText(text, x + 16, height - 7);
  });
}

export function drawHeatChart(canvas, heatZones) {
  const { context, width, height } = setupCanvas(canvas);
  context.clearRect(0, 0, width, height);

  const zones = [
    ["Head", heatZones.head],
    ["Torso", heatZones.torso],
    ["L Arm", heatZones.leftArm],
    ["R Arm", heatZones.rightArm],
    ["L Leg", heatZones.leftLeg],
    ["R Leg", heatZones.rightLeg],
  ];

  const gap = 12;
  const chartWidth = width - 40;
  const barWidth = (chartWidth - gap * (zones.length - 1)) / zones.length;
  const baseline = height - 30;
  const maxHeight = height - 56;

  zones.forEach(([label, value], index) => {
    const x = 20 + index * (barWidth + gap);
    const barHeight = value * maxHeight;
    const y = baseline - barHeight;

    context.fillStyle = mixColorStops(value);
    context.fillRect(x, y, barWidth, barHeight);

    context.fillStyle = "rgba(234,245,242,0.78)";
    context.font = '11px "Space Grotesk", sans-serif';
    context.fillText(label, x, height - 10);
    context.fillText(`${Math.round(value * 100)}`, x, y - 8);
  });
}
