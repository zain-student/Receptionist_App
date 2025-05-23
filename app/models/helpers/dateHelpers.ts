import moment from 'moment';

import {
  differenceInCalendarYears,
  differenceInYears,
  intervalToDuration,
  parse,
  isValid
} from 'date-fns';

export function ageCalculator(dateOfBirth: string) {
  let months = moment().diff(dateOfBirth, 'months');
  if (months > 12) {
    const year =
      (months - (months % 12)) / 12 ? (months - (months % 12)) / 12 + 'Y ' : '';
    const month = months % 12 ? (months % 12) + 'M' : '';
    return year + month;
  } else {
    return months ? months + 'M' : '';
  }
}

function parseDOB(dob) {
  if (!dob) return null;

  // First, try to parse dd/MM/yyyy hh:mm:s a format
  let parsed = parse(dob, 'dd/MM/yyyy hh:mm:s a', new Date());
  if (isValid(parsed)) return parsed;

  // Then try native Date fallback (for ISO strings)
  parsed = new Date(dob);
  if (isValid(parsed)) return parsed;

  return null;
}

export function calculateFullAge(dob) {
  try {
    const birthDate = parseDOB(dob);
    if (!birthDate) return 'N/A';

    const { years, months } = intervalToDuration({
      start: birthDate,
      end: new Date(),
    });

    return `${years}Y ${months}M`;
  } catch (e) {
    return 'N/A';
  }
}
// export function calculateFullAge(dob) {
//   try {
//     const birthDate = parse(dob, 'dd/MM/yyyy hh:mm:s a', new Date());
//     const {years, months, days} = intervalToDuration({
//       start: birthDate,
//       end: new Date(),
//     });
//     return years + 'Y' + months + 'M';
//   } catch (e) {
//     return 18 + 'Y' + 10 + 'M';
//   }
// }
