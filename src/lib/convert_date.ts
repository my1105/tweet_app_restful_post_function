/**
 * convert a string in a format compatible with a SQLite datetime to a `Date` object
 * @param sqlDateTimeString
 * @returns JS Date
 */
export const deserializeFromSQLiteDateTimeString = (
  sqlDateTimeString: string,
): Date | undefined => {
  if (!isValidDateTimeString(sqlDateTimeString)) {
    return undefined;
  }

  const [sqlDatePart, sqlTimePart] = sqlDateTimeString.split(" ");
  const [yearString, monthString, dayString] = sqlDatePart.split("-");
  const [hourString, minutesString, secondsPart] = sqlTimePart.split(":");
  const [secondsString, millisecondsString] = secondsPart.split(".");
  const [year, month, day, hour, minutes, seconds, milliseconds] = [
    yearString,
    monthString,
    dayString,
    hourString,
    minutesString,
    secondsString,
    millisecondsString,
  ].map(value => Number(value));
  return new Date(
    Date.UTC(year, month - 1, day, hour, minutes, seconds, milliseconds),
  );
};

/**
 * convert a `Date` object to a string in a format compatible with a SQLite datetime.
 * @param date
 * @returns sqlDateTimeString
 */
export const serializeToSQLiteDateTimeString = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = digits(date.getUTCMonth() + 1, 2);
  const day = digits(date.getUTCDate(), 2);
  const hour = digits(date.getUTCHours(), 2);
  const minute = digits(date.getUTCMinutes(), 2);
  const second = digits(date.getUTCSeconds(), 2);
  const ms = digits(date.getUTCMilliseconds(), 3);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`;
};

export const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = digits(date.getUTCMonth() + 1, 2);
  const day = digits(date.getUTCDate(), 2);
  const hour = digits(date.getUTCHours(), 2);
  const minute = digits(date.getUTCMinutes(), 2);
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

const digits = (num: number, length: number): string => {
  return `${num}`.padStart(length, "0");
};

const isValidDateTimeString = (str: string): boolean => {
  return /[1-9]?[0-9]+-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]\.[0-9]+/.test(
    str,
  );
};
