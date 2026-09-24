import { drawHeatChart, drawHistoryChart } from "./charts.js";
import { createHumanScene } from "./humanModel.js?v=procedural-runner";
import {
  athletes,
  createSimulation,
  describeEnvironmentLoop,
  describeEnvironmentState,
  describeState,
  summarizeEnvironment,
} from "./simulation.js";

const athleteSummary = document.querySelector("#athlete-summary");
const playToggle = document.querySelector("#play-toggle");
const resetButton = document.querySelector("#reset-button");
const speedRange = document.querySelector("#speed-range");
const speedValue = document.querySelector("#speed-value");
const motionRange = document.querySelector("#motion-range");
const motionValue = document.querySelector("#motion-value");
const feedbackToggle = document.querySelector("#feedback-toggle");
const feedbackIntensity = document.querySelector("#feedback-intensity");
const feedbackIntensityValue = document.querySelector("#feedback-intensity-value");
const feedbackResponsiveness = document.querySelector("#feedback-responsiveness");
const feedbackResponsivenessValue = document.querySelector("#feedback-responsiveness-value");
const segmentList = document.querySelector("#segment-list");
const phasePill = document.querySelector("#phase-pill");
const metricGrid = document.querySelector("#metric-grid");
const environmentStateGrid = document.querySelector("#environment-state-grid");
const environmentGrid = document.querySelector("#environment-grid");
const metricTemplate = document.querySelector("#metric-template");
const historyChart = document.querySelector("#history-chart");
const heatChart = document.querySelector("#heat-chart");
const environmentAssetStatus = document.querySelector("#environment-asset-status");

const envTemperature = document.querySelector("#env-temperature");
const envHumidity = document.querySelector("#env-humidity");
const envWind = document.querySelector("#env-wind");
const envAir = document.querySelector("#env-air");
const envAltitude = document.querySelector("#env-altitude");
const envSolar = document.querySelector("#env-solar");
const envPrecipitation = document.querySelector("#env-precipitation");
const envGrade = document.querySelector("#env-grade");

const envTemperatureValue = document.querySelector("#env-temperature-value");
const envHumidityValue = document.querySelector("#env-humidity-value");
const envWindValue = document.querySelector("#env-wind-value");
const envAirValue = document.querySelector("#env-air-value");
const envAltitudeValue = document.querySelector("#env-altitude-value");
const envSolarValue = document.querySelector("#env-solar-value");
const envPrecipitationValue = document.querySelector("#env-precipitation-value");
const envGradeValue = document.querySelector("#env-grade-value");

const humanHydration = document.querySelector("#human-hydration");
const humanFatigue = document.querySelector("#human-fatigue");
const humanGlycogen = document.querySelector("#human-glycogen");
const humanCoreBias = document.querySelector("#human-core-bias");
const humanHydrationValue = document.querySelector("#human-hydration-value");
const humanFatigueValue = document.querySelector("#human-fatigue-value");
const humanGlycogenValue = document.querySelector("#human-glycogen-value");
const humanCoreBiasValue = document.querySelector("#human-core-bias-value");

const heroFields = {
  coreTemp: document.querySelector("#core-temp-value"),
  cognition: document.querySelector("#cognition-value"),
  endurance: document.querySelector("#endurance-value"),
};

const simulation = createSimulation(athletes[0]);
const humanScene = createHumanScene(document.querySelector("#scene-root"));

let isPlaying = false;
let playbackSpeed = 1;
let motionScale = 1;
let motionClock = 0;
let lastFrame = performance.now();
const layerState = { skin: true, neural: true, joints: true, skeleton: true };

function activeAthlete() {
  return athletes[0];
}

function renderMetricCards(container, metrics) {
  container.innerHTML = "";
  metrics.forEach((metric) => {
    const fragment = metricTemplate.content.cloneNode(true);
    fragment.querySelector(".metric-label").textContent = metric.label;
    fragment.querySelector(".metric-value").textContent = metric.value;
    fragment.querySelector(".metric-detail").textContent = metric.detail;
    container.append(fragment);
  });
}

function renderAthleteSummary(simState) {
  athleteSummary.textContent = `${simState.athlete.sport}: ${simState.athlete.summary}`;
}

function renderEnvironmentAssetStatus() {
  const status = humanScene.getEnvironmentStatus();
  environmentAssetStatus.textContent = status.label;
  environmentAssetStatus.dataset.state = status.state;
}

function renderSegments(simState) {
  segmentList.innerHTML = "";
  simState.athlete.segments.forEach((segment, index) => {
    const currentFlag = index === simState.phaseIndex;
    const adjustedTemp = currentFlag ? simState.environment?.temperature?.toFixed(0) : segment.temperature.toFixed(0);
    const adjustedWorkload = currentFlag ? Math.round((simState.environment?.workload ?? segment.workload) * 100) : Math.round(segment.workload * 100);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `segment-card${currentFlag ? " active" : ""}`;
    card.setAttribute("aria-pressed", String(currentFlag));
    card.innerHTML = `
      <h4>${segment.name}</h4>
      <p>${segment.label} · ${adjustedTemp} C · workload ${adjustedWorkload}%</p>
      <p>${segment.description}</p>
    `;
    card.addEventListener("click", () => {
      simulation.setPhase(index);
      renderAll();
    });
    segmentList.append(card);
  });
}

function renderHero(simState) {
  heroFields.coreTemp.textContent = `${simState.coreTemp.toFixed(1)} C`;
  heroFields.cognition.textContent = `${Math.round(simState.cognition * 100)}`;
  heroFields.endurance.textContent = `${Math.round(simState.endurance * 100)}`;
}

function renderEnvironmentLabel(simState) {
  const envSummary = summarizeEnvironment(simState);
  phasePill.textContent = `${simState.athlete.name} · ${simState.segment.label} · ${Math.round(envSummary.progress * 100)}%`;
}

function renderAll() {
  const simState = simulation.getState();
  renderAthleteSummary(simState);
  renderEnvironmentAssetStatus();
  renderSegments(simState);
  renderMetricCards(metricGrid, describeState(simState));
  renderMetricCards(environmentStateGrid, describeEnvironmentState(simState));
  renderMetricCards(environmentGrid, describeEnvironmentLoop(simState));
  renderHero(simState);
  renderEnvironmentLabel(simState);
  drawHistoryChart(historyChart, simState.history);
  drawHeatChart(heatChart, simState.heatZones);
  humanScene.render({ ...simState, motionTime: motionClock }, layerState);
}

function syncModifiers() {
  simulation.setModifiers({
    workloadBias: 0,
    cognitiveBias: 0,
    hydrationSupport: 0,
  });
}

function syncFeedback() {
  const intensity = Number(feedbackIntensity.value);
  const responsiveness = Number(feedbackResponsiveness.value);
  feedbackIntensityValue.textContent = intensity.toFixed(2);
  feedbackResponsivenessValue.textContent = responsiveness.toFixed(2);
  simulation.setFeedback({ enabled: feedbackToggle.checked, intensity, responsiveness });
}

function syncEnvironment() {
  const next = {
    temperatureShift: Number(envTemperature.value),
    humidityShift: Number(envHumidity.value),
    windShift: Number(envWind.value),
    airQualityShift: Number(envAir.value),
    altitudeShift: Number(envAltitude.value),
    solarShift: Number(envSolar.value),
    precipitationShift: Number(envPrecipitation.value),
    gradeShift: Number(envGrade.value),
  };
  envTemperatureValue.textContent = `${next.temperatureShift} C`;
  envHumidityValue.textContent = `${Math.round(next.humidityShift * 100)}%`;
  envWindValue.textContent = `${Math.round(next.windShift * 100)}%`;
  envAirValue.textContent = `${Math.round(next.airQualityShift * 100)}%`;
  envAltitudeValue.textContent = `${Math.round(next.altitudeShift)} m`;
  envSolarValue.textContent = `${Math.round(next.solarShift * 100)}%`;
  envPrecipitationValue.textContent = `${Math.round(next.precipitationShift * 100)}%`;
  envGradeValue.textContent = `${Math.round(next.gradeShift * 100)}%`;
  simulation.setEnvironmentControls(next);
}

function syncHuman() {
  const next = {
    hydrationTarget: Number(humanHydration.value),
    fatigueTarget: Number(humanFatigue.value),
    glycogenTarget: Number(humanGlycogen.value),
    coreTempBias: Number(humanCoreBias.value),
  };
  humanHydrationValue.textContent = `${Math.round(next.hydrationTarget * 100)}%`;
  humanFatigueValue.textContent = `${Math.round(next.fatigueTarget * 100)}%`;
  humanGlycogenValue.textContent = `${Math.round(next.glycogenTarget * 100)}%`;
  humanCoreBiasValue.textContent = `${next.coreTempBias.toFixed(1)} C`;
  simulation.setHumanControls(next);
}

function syncPlayback() {
  playbackSpeed = Number(speedRange.value);
  motionScale = Number(motionRange.value);
  speedValue.textContent = `${playbackSpeed.toFixed(1)}x`;
  motionValue.textContent = `${motionScale.toFixed(2)}x`;
}

function setAthleteDefaults(athlete) {
  humanFatigue.value = athlete.physiology.explosiveBase > 0.8 ? "0.10" : "0.06";
  humanHydration.value = "1";
  humanGlycogen.value = "1";
  humanCoreBias.value = "0";
  humanScene.setActiveAthlete(athlete.id);
}

function animationLoop(now) {
  const elapsed = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  if (isPlaying) {
    simulation.tick(elapsed * 22 * playbackSpeed);
    motionClock += elapsed * motionScale;
  }
  renderAll();
  requestAnimationFrame(animationLoop);
}

playToggle.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playToggle.textContent = isPlaying ? "Pause test" : "Start test";
});

resetButton.addEventListener("click", () => {
  isPlaying = false;
  playToggle.textContent = "Start test";
  simulation.reset();
  motionClock = 0;
  syncModifiers();
  syncFeedback();
  syncEnvironment();
  syncHuman();
  renderAll();
});

[speedRange, motionRange].forEach((input) => {
  input.addEventListener("input", () => {
    syncPlayback();
    renderAll();
  });
});

[envTemperature, envHumidity, envWind, envAir, envAltitude, envSolar, envPrecipitation, envGrade].forEach((input) => {
  input.addEventListener("input", () => {
    syncEnvironment();
    renderAll();
  });
});

[humanHydration, humanFatigue, humanGlycogen, humanCoreBias].forEach((input) => {
  input.addEventListener("input", () => {
    syncHuman();
    renderAll();
  });
});

[feedbackToggle, feedbackIntensity, feedbackResponsiveness].forEach((input) => {
  input.addEventListener("input", () => {
    syncFeedback();
    renderAll();
  });
});

setAthleteDefaults(athletes[0]);
simulation.reset();
syncPlayback();
syncModifiers();
syncFeedback();
syncEnvironment();
syncHuman();
renderAll();
humanScene.loadBuiltInHuman(athletes).then(() => renderAll());
requestAnimationFrame(animationLoop);
