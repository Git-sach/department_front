export class DateFormater {
  private static dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  private static dateFormatterShort = new Intl.DateTimeFormat('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  /**
   * Ex: 01/01/2023
   */
  public static dateFormatedString(date: Date): string {
    return this.dateFormatter.format(date);
  }

  /**
   * Ex: 01/01/23
   */
  public static dateFormatedShortString(date: Date): string {
    return this.dateFormatterShort.format(date);
  }

  /**
   * Ex: 2022-12-01
   */
  public static dateFormaterApiString(date: Date): string {
    return this.dateFormatter.format(date).split('/').reverse().join('-');
  }
}
