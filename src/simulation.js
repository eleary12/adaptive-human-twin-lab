const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const formatSigned = (value, digits = 0) => `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;

export const athletes = [
  {
    id: "rower",
    name: "Elite Rower",
    sport: "Rowing",
    summary: "Power-endurance build with broad shoulders, dense leg drive, and strong cold resilience for long force cycles.",
    scene: "water",
    physiology: {
      bodyScale: 1.03,
      torsoScale: 1.15,
      shoulderScale: 1.18,
      hipScale: 1.02,
      armScale: 1.02,
      legScale: 0.98,
      aerobicBase: 0.84,
      explosiveBase: 0.66,
      heatTolerance: 0.64,
      coldTolerance: 0.8,
      recovery: 0.72,
      hydrationEfficiency: 0.72,
      workloadCapacity: 0.86,
      mentalResilience: 0.78,
      defaultVelocity: 0.24,
      animationMode: "row",
    },
    segments: [
      {
        name: "Snow Row Session",
        label: "Cold / Snow",
        description: "Freezing air, snow flurries, and intermittent gusts reduce dexterity while preserving heat strain.",
        duration: 72,
        temperature: -4,
        humidity: 0.7,
        airQuality: 0.92,
        altitude: 120,
        workload: 0.72,
        cognitiveDemand: 0.42,
        wind: 0.72,
        solarLoad: 0.12,
        precipitationType: "snow",
        precipitationIntensity: 0.78,
        terrainGrade: 0,
        surfaceTemp: -2,
        surfaceFriction: 0.62,
      },
      {
        name: "Autumn River Pace",
        label: "Fall",
        description: "Cool air and steady water conditions support sustained aerobic output.",
        duration: 76,
        temperature: 11,
        humidity: 0.54,
        airQuality: 0.96,
        altitude: 120,
        workload: 0.78,
        cognitiveDemand: 0.48,
        wind: 0.28,
        solarLoad: 0.3,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0,
        surfaceTemp: 13,
        surfaceFriction: 0.76,
      },
      {
        name: "Summer Heat Piece",
        label: "Summer / Hot",
        description: "Hot sun and reflected heat from the water raise hydration and thermoregulation pressure.",
        duration: 70,
        temperature: 34,
        humidity: 0.62,
        airQuality: 0.9,
        altitude: 120,
        workload: 0.82,
        cognitiveDemand: 0.52,
        wind: 0.14,
        solarLoad: 0.86,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0,
        surfaceTemp: 36,
        surfaceFriction: 0.74,
      },
    ],
  },
  {
    id: "runner",
    name: "Long-Distance Runner",
    sport: "Endurance Running",
    summary: "Lean, high-aerobic profile with efficient thermal regulation and long stride economy across varied terrain.",
    scene: "trail",
    physiology: {
      bodyScale: 0.98,
      torsoScale: 0.96,
      shoulderScale: 0.92,
      hipScale: 0.96,
      armScale: 0.97,
      legScale: 1.08,
      aerobicBase: 0.93,
      explosiveBase: 0.48,
      heatTolerance: 0.76,
      coldTolerance: 0.62,
      recovery: 0.8,
      hydrationEfficiency: 0.78,
      workloadCapacity: 0.88,
      mentalResilience: 0.84,
      defaultVelocity: 0.34,
      animationMode: "distance",
    },
    segments: [
      {
        name: "Desert Run",
        label: "Desert",
        description: "High radiant heat and dry air elevate cardiovascular drift and hydration loss.",
        duration: 78,
        temperature: 38,
        humidity: 0.18,
        airQuality: 0.87,
        altitude: 420,
        workload: 0.74,
        cognitiveDemand: 0.44,
        wind: 0.18,
        solarLoad: 0.94,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0.04,
        surfaceTemp: 44,
        surfaceFriction: 0.82,
      },
      {
        name: "Mountain Traverse",
        label: "Mountain",
        description: "Altitude and grade amplify oxygen demand and pacing decisions.",
        duration: 84,
        temperature: 12,
        humidity: 0.38,
        airQuality: 0.93,
        altitude: 2850,
        workload: 0.8,
        cognitiveDemand: 0.54,
        wind: 0.42,
        solarLoad: 0.42,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0.18,
        surfaceTemp: 11,
        surfaceFriction: 0.68,
      },
      {
        name: "Humid Flat Course",
        label: "Flat / Humid",
        description: "Stable terrain improves mechanics while humidity suppresses cooling efficiency.",
        duration: 82,
        temperature: 28,
        humidity: 0.84,
        airQuality: 0.89,
        altitude: 90,
        workload: 0.7,
        cognitiveDemand: 0.38,
        wind: 0.12,
        solarLoad: 0.48,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0.01,
        surfaceTemp: 31,
        surfaceFriction: 0.8,
      },
    ],
  },
  {
    id: "sprinter",
    name: "Track Sprinter",
    sport: "Sprint Track",
    summary: "Explosive lower-body profile with high mechanical output, sharper fatigue spikes, and track-specific acceleration posture.",
    scene: "track",
    physiology: {
      bodyScale: 1.01,
      torsoScale: 1.02,
      shoulderScale: 1.06,
      hipScale: 1.04,
      armScale: 1.02,
      legScale: 1.02,
      aerobicBase: 0.58,
      explosiveBase: 0.95,
      heatTolerance: 0.61,
      coldTolerance: 0.58,
      recovery: 0.65,
      hydrationEfficiency: 0.68,
      workloadCapacity: 0.92,
      mentalResilience: 0.72,
      defaultVelocity: 0.5,
      animationMode: "sprint",
    },
    segments: [
      {
        name: "Wet Track Intervals",
        label: "Rain",
        description: "Rain adds traction uncertainty and elevates coordination demand during explosive steps.",
        duration: 56,
        temperature: 16,
        humidity: 0.92,
        airQuality: 0.94,
        altitude: 70,
        workload: 0.9,
        cognitiveDemand: 0.62,
        wind: 0.36,
        solarLoad: 0.14,
        precipitationType: "rain",
        precipitationIntensity: 0.82,
        terrainGrade: 0,
        surfaceTemp: 18,
        surfaceFriction: 0.52,
      },
      {
        name: "Summer Lane Repeats",
        label: "Hot Summer",
        description: "Hot track surface and sun exposure intensify heat accumulation between efforts.",
        duration: 54,
        temperature: 35,
        humidity: 0.58,
        airQuality: 0.91,
        altitude: 70,
        workload: 0.94,
        cognitiveDemand: 0.56,
        wind: 0.1,
        solarLoad: 0.9,
        precipitationType: "none",
        precipitationIntensity: 0,
        terrainGrade: 0,
        surfaceTemp: 43,
        surfaceFriction: 0.78,
      },
      {
        name: "Winter Speed Session",
        label: "Winter",
        description: "Cold muscles and dense air raise warm-up needs and joint stiffness during top-end velocity work.",
        duration: 58,
        temperature: 3,
        humidity: 0.48,
        airQuality: 0.96,
        altitude: 70,
        workload: 0.88,
        cognitiveDemand: 0.52,
        wind: 0.28,
        solarLoad: 0.18,
        precipitationType: "snow",
        precipitationIntensity: 0.18,
        terrainGrade: 0,
        surfaceTemp: 1,
        surfaceFriction: 0.64,
      },
    ],
  },
];

const defaultHeatZones = () => ({
  head: 0.42,
  torso: 0.46,
  leftArm: 0.38,
  rightArm: 0.38,
  leftLeg: 0.34,
  rightLeg: 0.34,
});

const defaultEnvironmentControls = () => ({
  temperatureShift: 0,
  humidityShift: 0,
  windShift: 0,
  airQualityShift: 0,
  altitudeShift: 0,
  solarShift: 0,
  precipitationShift: 0,
  gradeShift: 0,
});

const defaultHumanControls = () => ({
  hydrationTarget: 1,
  fatigueTarget: 0.08,
  glycogenTarget: 1,
  coreTempBias: 0,
});

const initialState = (athlete) => ({
  time: 0,
  phaseIndex: 0,
  phaseElapsed: 0,
  coreTemp: 36.95,
  skinTemp: 33.4,
  hydration: 1,
  glycogen: 1,
  oxygen: 1,
  fatigue: athlete.physiology.explosiveBase > 0.8 ? 0.1 : 0.06,
  mentalLoad: 0.16,
  cognition: 1,
  physical: 1,
  endurance: 1,
  velocity: athlete.physiology.defaultVelocity,
  stability: 1,
  gaitPhase: 0,
  history: [],
  heatZones: defaultHeatZones(),
  controller: {
    cooling: 0,
    pacing: 0,
    hydration: 0,
    oxygenation: 0,
    guidance: 0,
  },
  environment: null,
});

export function createSimulation(athlete) {
  let activeAthlete = athlete;
  let state = initialState(athlete);
  let modifiers = {
    workloadBias: 0,
    cognitiveBias: 0,
    hydrationSupport: 0,
  };
  let feedback = {
    enabled: true,
    intensity: 0.65,
    responsiveness: 0.55,
  };
  let environmentControls = defaultEnvironmentControls();
  let humanControls = defaultHumanControls();

  const getCurrentSegment = () => activeAthlete.segments[state.phaseIndex];

  const pushHistory = () => {
    state.history.push({
      time: state.time,
      cognition: state.cognition,
      physical: state.physical,
      endurance: state.endurance,
      coreTemp: state.coreTemp,
      hydration: state.hydration,
      ambientTemp: state.environment?.temperature ?? getCurrentSegment().temperature,
      workload: state.environment?.workload ?? getCurrentSegment().workload,
    });
    if (state.history.length > 240) state.history.shift();
  };

  const updateHeatZones = (env) => {
    const physiology = activeAthlete.physiology;
    const heatStress = clamp((state.coreTemp - (36.6 + physiology.heatTolerance * 0.25)) / 3.1, 0, 1);
    const coldStress = clamp((33.6 + physiology.coldTolerance * 0.5 - state.skinTemp) / 9.5, 0, 1);
    const workloadBoost = env.workload * (0.14 + physiology.workloadCapacity * 0.08);
    const armSwing = state.velocity * 0.16;
    const legLoad = env.workload * (0.12 + physiology.explosiveBase * 0.08);
    state.heatZones = {
      head: clamp(0.38 + heatStress * 0.44 + state.mentalLoad * 0.22 - coldStress * 0.08, 0, 1),
      torso: clamp(0.42 + heatStress * 0.56 + workloadBoost, 0, 1),
      leftArm: clamp(0.3 + heatStress * 0.26 + armSwing, 0, 1),
      rightArm: clamp(0.3 + heatStress * 0.26 + armSwing, 0, 1),
      leftLeg: clamp(0.28 + heatStress * 0.2 + legLoad - coldStress * 0.12, 0, 1),
      rightLeg: clamp(0.28 + heatStress * 0.2 + legLoad - coldStress * 0.12, 0, 1),
    };
  };

  const advanceSegment = () => {
    const segment = getCurrentSegment();
    if (state.phaseElapsed < segment.duration) return;
    state.phaseElapsed = 0;
    state.phaseIndex = (state.phaseIndex + 1) % activeAthlete.segments.length;
  };

  const applyHumanTargets = (deltaSeconds) => {
    const blend = clamp(deltaSeconds * 0.18, 0, 1);
    state.hydration = lerp(state.hydration, humanControls.hydrationTarget, blend);
    state.fatigue = lerp(state.fatigue, humanControls.fatigueTarget, blend * 0.55);
    state.glycogen = lerp(state.glycogen, humanControls.glycogenTarget, blend * 0.4);
    state.coreTemp += humanControls.coreTempBias * deltaSeconds * 0.03;
  };

  const updateController = (env, deltaSeconds) => {
    const physiology = activeAthlete.physiology;
    const nextTargets = feedback.enabled
      ? {
          cooling: clamp(
            (state.coreTemp - (37.35 + physiology.heatTolerance * 0.18)) * 0.72 +
              (1 - state.hydration) * 0.48 +
              env.solarLoad * 0.14 +
              env.surfaceTemp * 0.002,
            0,
            1
          ),
          pacing: clamp(
            (1 - state.endurance) * 0.74 +
              (1 - state.physical) * 0.4 +
              env.workload * 0.1 +
              env.terrainGrade * 0.8 +
              (1 - physiology.recovery) * 0.08,
            0,
            1
          ),
          hydration: clamp(
            (0.9 - state.hydration) * 1.4 +
              (env.temperature - 24) * 0.016 +
              env.precipitationIntensity * 0.03 +
              (1 - physiology.hydrationEfficiency) * 0.22,
            0,
            1
          ),
          oxygenation: clamp((0.93 - state.oxygen) * 1.42 + (1 - env.airQuality) * 0.4 + env.altitude / 9000, 0, 1),
          guidance: clamp(
            (0.92 - state.cognition) * 1.14 +
              state.mentalLoad * (0.14 + (1 - physiology.mentalResilience) * 0.18),
            0,
            1
          ),
        }
      : {
          cooling: 0,
          pacing: 0,
          hydration: 0,
          oxygenation: 0,
          guidance: 0,
        };

    const blend = clamp(deltaSeconds * (0.5 + feedback.responsiveness * 1.8), 0, 1);
    Object.keys(state.controller).forEach((key) => {
      state.controller[key] = lerp(state.controller[key], nextTargets[key] * feedback.intensity, blend);
    });
  };

  const computeEnvironment = (baseEnv) => {
    const { cooling, pacing, hydration, oxygenation, guidance } = state.controller;
    const precipitationIntensity = clamp(baseEnv.precipitationIntensity + environmentControls.precipitationShift - cooling * 0.08, 0, 1);
    const temperature = clamp(baseEnv.temperature + environmentControls.temperatureShift - cooling * 6.5, -25, 50);
    const precipitationType =
      precipitationIntensity < 0.05
        ? "none"
        : baseEnv.precipitationType === "none"
          ? temperature <= 1
            ? "snow"
            : "rain"
          : baseEnv.precipitationType;
    const humidity = clamp(baseEnv.humidity + environmentControls.humidityShift - cooling * 0.08 + hydration * 0.05, 0.05, 0.98);
    const wind = clamp(baseEnv.wind + environmentControls.windShift + cooling * 0.38, 0, 1);
    const solarLoad = clamp(baseEnv.solarLoad + environmentControls.solarShift - cooling * 0.24, 0, 1);
    const airQuality = clamp(baseEnv.airQuality + environmentControls.airQualityShift + oxygenation * 0.42, 0.08, 1);
    const altitude = clamp(baseEnv.altitude + environmentControls.altitudeShift, 0, 6000);
    const terrainGrade = clamp(baseEnv.terrainGrade + environmentControls.gradeShift, -0.05, 0.35);
    const workload = clamp(baseEnv.workload + modifiers.workloadBias - pacing * 0.28 + terrainGrade * 0.22, 0.05, 1);
    const cognitiveDemand = clamp(
      baseEnv.cognitiveDemand + modifiers.cognitiveBias - guidance * 0.18 - pacing * 0.06 + precipitationIntensity * 0.06,
      0.05,
      1
    );
    const hydrationRelief = clamp(modifiers.hydrationSupport + hydration * 0.28, -0.2, 0.6);
    const surfaceTemp = clamp(baseEnv.surfaceTemp + environmentControls.temperatureShift * 1.1 + solarLoad * 8 - precipitationIntensity * 4, -20, 60);
    const frictionDrop = precipitationType === "rain" ? 0.18 : precipitationType === "snow" ? 0.22 : 0;
    const surfaceFriction = clamp(baseEnv.surfaceFriction - frictionDrop * precipitationIntensity - Math.max(0, surfaceTemp - 35) * 0.004, 0.35, 0.92);

    state.environment = {
      ...baseEnv,
      precipitationType,
      temperature,
      humidity,
      wind,
      solarLoad,
      airQuality,
      altitude,
      terrainGrade,
      workload,
      cognitiveDemand,
      hydrationRelief,
      precipitationIntensity,
      surfaceTemp,
      surfaceFriction,
      deltas: {
        temperature: temperature - baseEnv.temperature,
        airQuality: airQuality - baseEnv.airQuality,
        workload: workload - baseEnv.workload,
        cognitiveDemand: cognitiveDemand - baseEnv.cognitiveDemand,
      },
    };
    return state.environment;
  };

  return {
    getState() {
      const segment = getCurrentSegment();
      computeEnvironment(segment);
      return {
        ...state,
        athlete: activeAthlete,
        scenario: activeAthlete,
        segment,
        baseSegment: segment,
        modifiers: { ...modifiers },
        feedback: { ...feedback },
        environmentControls: { ...environmentControls },
        humanControls: { ...humanControls },
      };
    },

    setAthlete(nextAthlete) {
      activeAthlete = nextAthlete;
      state = initialState(nextAthlete);
      humanControls = {
        ...defaultHumanControls(),
        fatigueTarget: nextAthlete.physiology.explosiveBase > 0.8 ? 0.1 : 0.06,
      };
      pushHistory();
    },

    setModifiers(nextModifiers) {
      modifiers = { ...modifiers, ...nextModifiers };
    },

    setFeedback(nextFeedback) {
      feedback = { ...feedback, ...nextFeedback };
    },

    setEnvironmentControls(nextControls) {
      environmentControls = { ...environmentControls, ...nextControls };
    },

    setHumanControls(nextControls) {
      humanControls = { ...humanControls, ...nextControls };
    },

    setPhase(phaseIndex) {
      const nextIndex = Math.min(activeAthlete.segments.length - 1, Math.max(0, Number(phaseIndex) || 0));
      state.phaseIndex = nextIndex;
      state.phaseElapsed = 0;
      state.environment = null;
      pushHistory();
    },

    reset() {
      state = initialState(activeAthlete);
      pushHistory();
    },

    tick(deltaSeconds) {
      const physiology = activeAthlete.physiology;
      applyHumanTargets(deltaSeconds);
      const baseEnv = getCurrentSegment();
      updateController(baseEnv, deltaSeconds);
      const env = computeEnvironment(baseEnv);
      const heatGain =
        (env.temperature - 22) * (0.0022 + (1 - physiology.heatTolerance) * 0.0008) +
        env.humidity * 0.005 +
        env.solarLoad * 0.006 +
        env.surfaceTemp * 0.0009 +
        env.workload * (0.006 + physiology.explosiveBase * 0.003) -
        env.wind * (0.003 + physiology.coldTolerance * 0.001);
      const coolingDrive = clamp((state.coreTemp - 36.95) * (0.012 + physiology.heatTolerance * 0.004), -0.02, 0.028);
      const skinPull = (env.temperature - state.skinTemp) * 0.01 + heatGain * 0.58;
      const altitudePenalty = clamp(env.altitude / 4300, 0, 1) * 0.0085;
      const airQualityPenalty = clamp(1 - env.airQuality, 0, 1) * 0.01;
      const tractionPenalty = clamp((0.72 - env.surfaceFriction) / 0.32, 0, 1);
      const weatherPenalty = env.precipitationIntensity * (env.precipitationType === "snow" ? 0.08 : 0.05);
      const dehydrationRate =
        (0.0028 +
          env.temperature * 0.00005 +
          env.workload * 0.0046 +
          (1 - physiology.hydrationEfficiency) * 0.0018 -
          env.hydrationRelief * 0.006) *
        deltaSeconds;
      const glycogenBurn = (0.0021 + env.workload * (0.0032 + physiology.explosiveBase * 0.0026) + env.terrainGrade * 0.003) * deltaSeconds;
      const fatigueGain =
        (0.0022 +
          env.workload * (0.0044 + physiology.explosiveBase * 0.0024) +
          env.cognitiveDemand * 0.0018 +
          altitudePenalty +
          airQualityPenalty +
          tractionPenalty * 0.004 +
          weatherPenalty -
          physiology.recovery * 0.0012) *
        deltaSeconds;
      const mentalGain =
        (0.0018 +
          env.cognitiveDemand * 0.0056 +
          airQualityPenalty * 0.6 +
          altitudePenalty * 0.48 +
          tractionPenalty * 0.003 +
          weatherPenalty * 0.5 -
          physiology.mentalResilience * 0.0009) *
        deltaSeconds;

      state.time += deltaSeconds;
      state.phaseElapsed += deltaSeconds;
      state.gaitPhase += deltaSeconds * (1.1 + env.workload * 1.7);
      state.coreTemp = clamp(state.coreTemp + heatGain * deltaSeconds - coolingDrive * deltaSeconds, 35, 40.6);
      state.skinTemp = clamp(state.skinTemp + skinPull * deltaSeconds, 25, 39.5);
      state.hydration = clamp(state.hydration - dehydrationRate, 0.38, 1);
      state.glycogen = clamp(state.glycogen - glycogenBurn, 0.18, 1);
      state.oxygen = clamp(
        1 - env.altitude / (6900 + physiology.aerobicBase * 700) - (1 - env.airQuality) * 0.18 + physiology.aerobicBase * 0.04,
        0.46,
        1
      );
      state.fatigue = clamp(state.fatigue + fatigueGain, 0, 1);
      state.mentalLoad = clamp(state.mentalLoad + mentalGain, 0, 1);

      const heatPenalty = clamp((state.coreTemp - (37.55 + physiology.heatTolerance * 0.2)) / 2.2, 0, 1);
      const coldPenalty = clamp((31.4 + physiology.coldTolerance * 0.5 - state.skinTemp) / 5.8, 0, 1);
      const hydrationPenalty = clamp((0.76 - state.hydration) / 0.36, 0, 1);
      const fuelPenalty = clamp((0.56 - state.glycogen) / 0.36, 0, 1);

      state.cognition = clamp(
        1 -
          state.mentalLoad * 0.5 -
          heatPenalty * 0.2 -
          altitudePenalty * 4.8 -
          airQualityPenalty * 5.8 -
          weatherPenalty * 0.35 -
          hydrationPenalty * 0.16 +
          physiology.mentalResilience * 0.08,
        0,
        1
      );
      state.physical = clamp(
        1 -
          state.fatigue * 0.5 -
          heatPenalty * (0.18 + (1 - physiology.heatTolerance) * 0.08) -
          coldPenalty * (0.12 + (1 - physiology.coldTolerance) * 0.08) -
          hydrationPenalty * 0.2 -
          fuelPenalty * 0.18 -
          tractionPenalty * 0.14 +
          physiology.workloadCapacity * 0.07,
        0,
        1
      );
      state.endurance = clamp(
        1 -
          state.fatigue * 0.4 -
          hydrationPenalty * 0.24 -
          fuelPenalty * 0.26 -
          altitudePenalty * (3.6 - physiology.aerobicBase * 1.3) -
          weatherPenalty * 0.18 +
          physiology.aerobicBase * 0.16,
        0,
        1
      );

      const velocityBias = physiology.animationMode === "row" ? 0.2 : physiology.animationMode === "distance" ? 0.28 : 0.42;
      state.velocity = clamp(velocityBias + env.workload * (0.22 + physiology.explosiveBase * 0.24) - state.fatigue * 0.18, 0.12, 0.78);
      state.stability = clamp(
        1 -
          state.mentalLoad * 0.18 -
          altitudePenalty * 2.2 -
          tractionPenalty * 0.22 -
          (physiology.animationMode === "sprint" ? (1 - env.airQuality) * 0.06 : 0),
        0.45,
        1
      );

      updateHeatZones(env);
      advanceSegment();
      pushHistory();
    },
  };
}

export function describeState(simState) {
  const env = simState.environment ?? simState.segment;
  const athlete = simState.athlete;
  const risk =
    simState.coreTemp > 38.7 || simState.hydration < 0.62 || simState.cognition < 0.52
      ? "Elevated strain"
      : simState.physical < 0.68 || simState.endurance < 0.68
        ? "Moderate stress"
        : "Stable response";
  return [
    {
      label: "Cognitive Performance",
      value: `${Math.round(simState.cognition * 100)}`,
      detail: `${athlete.sport} model under ${simState.segment.label.toLowerCase()} demand with mental load ${Math.round(simState.mentalLoad * 100)}.`,
    },
    {
      label: "Physical Performance",
      value: `${Math.round(simState.physical * 100)}`,
      detail: `Workload ${Math.round(env.workload * 100)}% with fatigue ${Math.round(simState.fatigue * 100)}.`,
    },
    {
      label: "Endurance Capacity",
      value: `${Math.round(simState.endurance * 100)}`,
      detail: `Hydration ${Math.round(simState.hydration * 100)}% and glycogen ${Math.round(simState.glycogen * 100)}%.`,
    },
    {
      label: "Oxygen Efficiency",
      value: `${Math.round(simState.oxygen * 100)}%`,
      detail: `Altitude ${env.altitude.toFixed(0)} m with air quality ${Math.round(env.airQuality * 100)}%.`,
    },
    {
      label: "Thermal State",
      value: `${simState.coreTemp.toFixed(1)} C`,
      detail: `Skin ${simState.skinTemp.toFixed(1)} C in ${simState.segment.label.toLowerCase()} conditions.`,
    },
    {
      label: "Operational Status",
      value: risk,
      detail: `Stability ${Math.round(simState.stability * 100)} / 100 during ${athlete.name.toLowerCase()} motion.`,
    },
  ];
}

export function describeEnvironmentState(simState) {
  const env = simState.environment ?? simState.segment;
  return [
    {
      label: "Air",
      value: `${env.temperature.toFixed(0)} C`,
      detail: `Humidity ${Math.round(env.humidity * 100)}% with wind ${Math.round(env.wind * 100)}%.`,
    },
    {
      label: "Terrain",
      value: `${Math.round(env.terrainGrade * 100)}%`,
      detail: `Altitude ${Math.round(env.altitude)} m and surface friction ${env.surfaceFriction.toFixed(2)}.`,
    },
    {
      label: "Weather",
      value: `${env.precipitationType === "none" ? "Clear" : env.precipitationType}`,
      detail: `Precipitation intensity ${Math.round(env.precipitationIntensity * 100)}% and solar load ${Math.round(env.solarLoad * 100)}%.`,
    },
    {
      label: "Surface",
      value: `${env.surfaceTemp.toFixed(0)} C`,
      detail: `Ground or water-contact state influences traction and thermal exchange.`,
    },
  ];
}

export function describeEnvironmentLoop(simState) {
  const env = simState.environment ?? simState.segment;
  const base = simState.baseSegment ?? simState.segment;
  return [
    {
      label: "Thermal Control",
      value: `${env.temperature.toFixed(0)} C`,
      detail: `${formatSigned(env.deltas?.temperature ?? 0, 1)} C from baseline ${base.label.toLowerCase()} condition.`,
    },
    {
      label: "Task Pacing",
      value: `${Math.round(env.workload * 100)}%`,
      detail: `${formatSigned((env.deltas?.workload ?? 0) * 100)} pts from athlete workload target.`,
    },
    {
      label: "Air Support",
      value: `${Math.round(env.airQuality * 100)}%`,
      detail: `${formatSigned((env.airQuality - base.airQuality) * 100)} pts air quality correction.`,
    },
    {
      label: "Guidance Relief",
      value: `${Math.round(env.cognitiveDemand * 100)}%`,
      detail: `${formatSigned((env.cognitiveDemand - base.cognitiveDemand) * 100)} pts decision-pressure adjustment.`,
    },
  ];
}

export function summarizeEnvironment(simState) {
  const segment = simState.segment;
  const env = simState.environment ?? simState.segment;
  return {
    progress: clamp(simState.phaseElapsed / segment.duration, 0, 1),
    temperature: `${env.temperature.toFixed(0)} C`,
    humidity: `${Math.round(env.humidity * 100)}%`,
    airQuality: `${Math.round(env.airQuality * 100)}%`,
    altitude: `${Math.round(env.altitude)} m`,
    workload: `${Math.round(env.workload * 100)}%`,
    cognitive: `${Math.round(env.cognitiveDemand * 100)}%`,
  };
}

export function mixColorStops(value) {
  const stops = [
    { t: 0, rgb: [59, 130, 246] },
    { t: 0.34, rgb: [67, 183, 209] },
    { t: 0.55, rgb: [127, 224, 157] },
    { t: 0.74, rgb: [247, 191, 76] },
    { t: 1, rgb: [255, 92, 92] },
  ];
  for (let index = 1; index < stops.length; index += 1) {
    const current = stops[index];
    const previous = stops[index - 1];
    if (value <= current.t) {
      const localT = (value - previous.t) / (current.t - previous.t);
      const rgb = previous.rgb.map((channel, channelIndex) => Math.round(lerp(channel, current.rgb[channelIndex], localT)));
      return `rgb(${rgb.join(", ")})`;
    }
  }
  return "rgb(255, 92, 92)";
}
