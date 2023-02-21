import { Constants } from '../constants'
import { PlayerStats } from '../modules/players/players.schemas'

export function calculateOverall(
  playerStats: PlayerStats,
  isDefenderOrAttacker: boolean,
): number {
  let totalStatsSum = 0
  let divisor = Constants.DEFENDER_OR_ATTACKER_DIVISOR

  if (!isDefenderOrAttacker) {
    divisor = Constants.NOT_DEFENDER_OR_ATTACKER_DIVISOR
  }

  try {
    for (const key in playerStats) {
      if (Object.prototype.hasOwnProperty.call(playerStats, key)) {
        const value = playerStats[key]
        if (typeof value === 'number') {
          totalStatsSum += value
        }
      }
    }

    return Number((totalStatsSum / divisor).toFixed(0))
  } catch (error) {
    throw new Error()
  }
}
