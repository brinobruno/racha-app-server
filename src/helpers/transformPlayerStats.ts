import { PlayerStats } from '../modules/players/players.schemas'
import { calculateOverall } from './calculateOverall'

export function transformPlayerStats(
  playerStats: PlayerStats,
  overall: number | undefined,
  isDefenderOrAttacker: boolean,
): PlayerStats {
  try {
    if (overall) {
      return Object.fromEntries(
        Object.entries(playerStats).map(([key, value]) => [key, overall]),
      )
    }

    const transformedStats = { ...playerStats }

    const calculatedOverall = calculateOverall(
      playerStats,
      isDefenderOrAttacker,
    )

    transformedStats.overall = calculatedOverall

    return transformedStats
  } catch (error) {
    throw new Error()
  }
}
