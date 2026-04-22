import type { DatasetCellAction, DatasetCellCallbackArgs } from "@/application/domain"

export const reportActions4505: DatasetCellAction[] = [
  {
    key: 2,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "190010818301"
    },
  },
  {
    key: 1,
    validator: (args: DatasetCellCallbackArgs) => {
      const { rowIndex, cell, includeFirstRow } = args
      const index: number = Number.parseInt(cell, 10)
      if (Number.isNaN(index)) return false
      const isValid: boolean = includeFirstRow ? index === rowIndex + 1 : index === rowIndex
      return index >= 1 && isValid
    },
    parser: (args: DatasetCellCallbackArgs) => {
      const { rowIndex, includeFirstRow } = args
      const index = includeFirstRow ? rowIndex + 1 : rowIndex
      return index.toString()
    },
  },
  {
    key: 14,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args
      const isMale = isGenderMale(args)
      return isMale ? "0" : cell
    },
  },
  {
    key: 15,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 17,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 26,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 39,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 41,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 47,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 74,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 115,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 116,
    parser: (_item) => {
      return "0"
    },
  },
  {
    key: 16,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age > 60 ? "21" : "0"
    },
  },
  {
    key: 20,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "21"
    },
  },
  {
    key: 21,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "21"
    },
  },
  {
    key: 25,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "21"
    },
  },
  {
    key: 22,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isMale = isGenderMale(args)
      return age >= 40 && isMale ? "21" : "0"
    },
  },
  {
    key: 64,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isMale = isGenderMale(args)
      return age >= 40 && isMale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 109,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isMale = isGenderMale(args)
      return age >= 40 && isMale ? "998" : "0"
    },
  },
  {
    key: 23,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 35,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 59,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 60,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 61,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 79,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 81,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 83,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "21" : "0"
    },
  },
  {
    key: 56,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 58,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 78,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 80,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 82,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 33,
    parser: (args: DatasetCellCallbackArgs) => {
      const isPregnant = isPersonPregnant(args)
      return isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 24,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 && age <= 75 ? "21" : "0"
    },
  },
  {
    key: 36,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 && age <= 75 ? "21" : "0"
    },
  },
  {
    key: 66,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 && age <= 75 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 67,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 && age <= 75 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 27,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 3 && age <= 10 ? "21" : "0"
    },
  },
  {
    key: 28,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 3 && age <= 10 ? "21" : "0"
    },
  },
  {
    key: 62,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 3 && age <= 10 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 37,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "21" : "0"
    },
  },
  {
    key: 38,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "21" : "0"
    },
  },
  {
    key: 48,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "21" : "0"
    },
  },
  {
    key: 65,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 69,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 75,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 30 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 40,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age <= 12 ? "21" : "0"
    },
  },
  {
    key: 63,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age <= 12 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 42,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 ? "21" : "0"
    },
  },
  {
    key: 110,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 50 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 43,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args

      const age = getAge(args)
      if (age < 8) {
        return cell?.trim() ? cell : "21"
      }

      return "0"
    },
  },
  {
    key: 44,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args

      const age = getAge(args)
      if (age < 8) {
        return cell?.trim() ? cell : "21"
      }

      return "0"
    },
  },
  {
    key: 45,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args

      const age = getAge(args)
      if (age < 8) {
        return cell?.trim() ? cell : "21"
      }

      return "0"
    },
  },
  {
    key: 46,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args

      const age = getAge(args)
      if (age < 8) {
        return cell?.trim() ? cell : "21"
      }

      return "0"
    },
  },
  {
    key: 49,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && age <= 59 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 50,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && age <= 59 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 53,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 10 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 54,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 10 && age <= 59 ? "21" : "0"
    },
  },
  {
    key: 55,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 10 && age <= 59 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 51,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age < 7 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 52,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args
      return cell?.trim() ? cell : "1800-01-01"
    },
  },
  {
    key: 57,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "998" : "0"
    },
  },
  {
    key: 92,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "998" : "0"
    },
  },
  {
    key: 95,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "998" : "0"
    },
  },
  {
    key: 98,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "998" : "0"
    },
  },
  {
    key: 107,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "998" : "0"
    },
  },
  {
    key: 105,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 72,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 106,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 111,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 118,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      const isPregnant = isPersonPregnant(args)
      return age >= 29 || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 68,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "1845-01-01"
    },
  },
  {
    key: 108,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "1845-01-01"
    },
  },
  {
    key: 70,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      if (age < 6) return "0"
      return age >= 6 && age < 27 ? "21" : "0"
    },
  },
  {
    key: 71,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      return age >= 24 && age <= 60 ? "21" : "0"
    },
  },
  {
    key: 77,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      return age >= 24 && age < 60 ? "21" : "0"
    },
  },
  {
    key: 76,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      if (age < 6) return "1845-01-01"
      return age >= 6 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 102,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getMonthsOfLife(args)
      return age >= 6 ? "21" : "0"
    },
  },
  {
    key: 84,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 7 ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 85,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getDaysOfLife(args)
      return age <= 7 ? "21" : "0"
    },
  },
  {
    key: 86,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "21" : "0"
    },
  },
  {
    key: 88,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "21" : "0"
    },
  },
  {
    key: 94,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "21" : "0"
    },
  },
  {
    key: 87,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 91,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 93,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 89,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "999" : "0"
    },
  },
  {
    key: 90,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 10 && isFemale ? "999" : "0"
    },
  },
  {
    key: 96,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 35 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 99,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 35 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 100,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 35 && isFemale ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 97,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 35 && isFemale ? "21" : "0"
    },
  },
  {
    key: 101,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      return age >= 35 && isFemale ? "21" : "0"
    },
  },
  {
    key: 103,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      const isPregnant = isPersonPregnant(args)
      return (age >= 10 && age < 18 && isFemale) || isPregnant ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 104,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      const isFemale = !isGenderMale(args)
      const isPregnant = isPersonPregnant(args)
      return (age >= 10 && age < 18 && isFemale) || isPregnant ? "998" : "0"
    },
  },
  {
    key: 112,
    parser: (args: DatasetCellCallbackArgs) => {
      const isRespiratorySymptomatic = isRespiratorySymptomaticPatient(args)
      return isRespiratorySymptomatic ? "1800-01-01" : "1845-01-01"
    },
  },
  {
    key: 113,
    parser: (args: DatasetCellCallbackArgs) => {
      const isRespiratorySymptomatic = isRespiratorySymptomaticPatient(args)
      return isRespiratorySymptomatic ? "21" : "4"
    },
  },
  {
    key: 114,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 18 ? "21" : "0"
    },
  },
  {
    key: 117,
    parser: (args: DatasetCellCallbackArgs) => {
      const age = getAge(args)
      return age >= 18 ? "21" : "0"
    },
  },
  {
    key: 34,
    parser: (_args: DatasetCellCallbackArgs) => {
      return "170"
    },
  },
  {
    key: 73,
    parser: (args: DatasetCellCallbackArgs) => {
      const { row, cell } = args
      const psa = row[109]
      return psa === "998" ? "1800-01-01" : cell
    },
  },
  {
    key: 30,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args
      const age = getAge(args)
      const currentWeight: number = Math.round((Number.parseFloat(cell) || 0) * 100) / 100

      if (age >= 5 && age <= 12 && currentWeight < 9) {
        return "9"
      }

      if (age >= 13 && age <= 17 && currentWeight < 30) {
        return "30"
      }

      if (age >= 18 && currentWeight < 36) {
        return "36"
      }

      return cell
    },
  },
  {
    key: 32,
    parser: (args: DatasetCellCallbackArgs) => {
      const { cell } = args
      const age = getAge(args)
      const tall: number = Number.parseFloat(cell) || 0

      if (age >= 2 && age <= 4 && tall < 70) {
        return "70"
      }

      if (age >= 5 && age <= 12 && tall < 80) {
        return "80"
      }

      if (age >= 13 && age <= 17 && tall < 130) {
        return "130"
      }

      if (age >= 18 && tall < 130) {
        return "130"
      }

      return cell
    },
  },
]

function getAge(args: DatasetCellCallbackArgs): number {
  const { row } = args

  const birthDateString: string = row[9] // YYYY-MM-DD
  const birthDate = new Date(birthDateString)

  const currentDate = getLastDayOfPreviousMonth()
  const age = currentDate.getFullYear() - birthDate.getFullYear()

  return age
}

function getDaysOfLife(args: DatasetCellCallbackArgs): number {
  const { row } = args

  const birthDateString: string = row[9] // YYYY-MM-DD
  const birthDate = new Date(birthDateString)

  const currentDate = getLastDayOfPreviousMonth()
  const diffInMilliseconds = currentDate.getTime() - birthDate.getTime()
  const daysOfLife = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return daysOfLife
}

function getMonthsOfLife(args: DatasetCellCallbackArgs): number {
  const { row } = args

  const birthDateString: string = row[9] // YYYY-MM-DD
  const birthDate = new Date(birthDateString)

  const currentDate = getLastDayOfPreviousMonth()

  // Calcular diferencia en años
  const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear()

  // Calcular diferencia en meses
  let monthsDiff = currentDate.getMonth() - birthDate.getMonth()

  // Si el día actual es menor que el día del cumpleaños, restar un mes
  if (currentDate.getDate() < birthDate.getDate()) {
    monthsDiff--
  }

  // Total de meses = años * 12 + meses ajustados
  const monthsOfLife = yearsDiff * 12 + monthsDiff

  return monthsOfLife
}

// TODO: ajustar
function getLastDayOfPreviousMonth() {
  return new Date(2025, 9, 0)
}

function getGender(args: DatasetCellCallbackArgs): string {
  const { row } = args
  const gender: string = row[10]
  return gender
}

function isGenderMale(args: DatasetCellCallbackArgs): boolean {
  const gender: string = getGender(args)
  return gender === "M"
}

function isPersonPregnant(args: DatasetCellCallbackArgs): boolean {
  const { row } = args
  const pregnant: string = row[14]
  return pregnant === "1"
}

function isRespiratorySymptomaticPatient(args: DatasetCellCallbackArgs): boolean {
  const { row } = args
  const respiratorySymptomaticPatient: string = row[18]
  return respiratorySymptomaticPatient === "1"
}
