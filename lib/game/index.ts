// 闯关游戏模块统一出口（Galgame 攻略玩法）

export {
  initialGameState,
  evaluateFavor,
  statsToRadar,
  pushUnique,
  clamp,
  type GameState,
  type ScoreLevel,
  type SubjectTrack,
  type TeacherMood,
  type RadarAxis,
  type FavorGrade,
} from "./state";
export {
  GAME_STAGES,
  TOTAL_STAGES,
  type GameStage,
  type GameOption,
} from "./stages";
export { ENDINGS, pickEnding, type GameEnding } from "./endings";
export { pickReaction, type Reaction } from "./roast-lines";

import type { GameState } from "./state";
import type { GameOption } from "./stages";

/** 应用一个选择，返回新的不可变状态 */
export function applyChoice(state: GameState, option: GameOption): GameState {
  return option.apply(state);
}
