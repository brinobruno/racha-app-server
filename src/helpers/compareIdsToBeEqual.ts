import { HttpError } from '../errors/customException'

interface ICompareIds {
  secondId: string | undefined
  firstId: string | undefined
}

// Compare two IDs to be the same
export function compareIdsToBeEqual({ firstId, secondId }: ICompareIds) {
  if (firstId !== secondId) {
    throw new HttpError(
      401,
      'Permission denied, ID from user does not match team user_id ',
    )
  }
}
