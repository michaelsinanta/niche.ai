export interface ScoreResult {
  extraversion: number;
  agreeableness: number;
  conscientousness: number;
  emotionalRange: number;
  openness: number;
  conservation: number;
  opennessToChange: number;
  hedonism: number;
  selfEnhancement: number;
  selfTranscendence: number;
}

export const calculateScore = (ratings: number[]): ScoreResult => {
  const extraversion =
    20 +
    (ratings[0] -
      ratings[5] +
      ratings[10] -
      ratings[15] +
      ratings[20] -
      ratings[25] +
      ratings[30] -
      ratings[35] +
      ratings[40] -
      ratings[45]);
  const agreeableness =
    14 -
    (ratings[1] -
      ratings[6] +
      ratings[11] -
      ratings[16] +
      ratings[21] -
      ratings[26] +
      ratings[31] -
      ratings[36] +
      ratings[41] +
      ratings[46]);
  const conscientousness =
    14 +
    (ratings[2] -
      ratings[7] +
      ratings[12] -
      ratings[17] +
      ratings[22] -
      ratings[27] +
      ratings[32] -
      ratings[37] +
      ratings[42] +
      ratings[47]);
  const emotionalRange =
    38 -
    (ratings[3] -
      ratings[8] +
      ratings[13] -
      ratings[18] +
      ratings[23] -
      ratings[28] -
      ratings[33] -
      ratings[38] -
      ratings[43] -
      ratings[48]);
  const openness =
    8 +
    (ratings[4] -
      ratings[9] +
      ratings[14] -
      ratings[19] +
      ratings[24] -
      ratings[29] +
      ratings[34] +
      ratings[39] +
      ratings[44] +
      ratings[49]);

  const universalism = (ratings[51] + ratings[56] + ratings[67]) / 3;
  const benevolence = (ratings[60] + ratings[66]) / 2;
  const conformity = (ratings[55] + ratings[64]) / 2;
  const tradition = (ratings[58] + ratings[68]) / 2;
  const security = (ratings[53] + ratings[65]) / 2;
  const power = (ratings[52] + ratings[63]) / 2;
  const achievement = (ratings[54] + ratings[62]) / 2;
  const hedonism = (ratings[59] + ratings[70]) / 2;
  const stimulation = (ratings[57] + ratings[69]) / 2;
  const selfDirection = (ratings[50] + ratings[61]) / 2;

  const conservation = (security + conformity + tradition) / 3;
  const opennessToChange = (selfDirection + stimulation) / 2;
  const selfEnhancement = (achievement + power) / 2;
  const selfTranscendence = (benevolence + universalism) / 2;

  const normalize = (score: number, min: number, max: number) => (score - min) / (max - min);

  const normalizedExtraversion = normalize(extraversion, -30, 70);
  const normalizedAgreeableness = normalize(agreeableness, -36, 64);
  const normalizedConscientousness = normalize(conscientousness, -36, 64);
  const normalizedEmotionalRange = normalize(emotionalRange, -12, 88);
  const normalizedOpenness = normalize(openness, -42, 58);
  const normalizedConservation = normalize(conservation, 1, 5);
  const normalizedOpennessToChange = normalize(opennessToChange, 1, 5);
  const normalizedSelfEnhancement = normalize(selfEnhancement, 1, 5);
  const normalizedSelfTranscendence = normalize(selfTranscendence, 1, 5);
  const normalizedHedonism = normalize(hedonism, 1, 6);

  return {
    extraversion: normalizedExtraversion,
    agreeableness: normalizedAgreeableness,
    conscientousness: normalizedConscientousness,
    emotionalRange: normalizedEmotionalRange,
    openness: normalizedOpenness,
    conservation: normalizedConservation,
    opennessToChange: normalizedOpennessToChange,
    hedonism: normalizedHedonism,
    selfEnhancement: normalizedSelfEnhancement,
    selfTranscendence: normalizedSelfTranscendence,
  };
};
