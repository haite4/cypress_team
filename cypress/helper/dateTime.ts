import { param } from "node_modules/cypress/types/jquery"

class DateTime {
  getDaysinMonth(gap: number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + gap, 0).getDate();
  }

  getRandomDate(startDate: number, endDate: number) {
    return Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;
  }

  formatDateRangeIntl(startDate: Date, endDate: Date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const startFormatted = formatter.format(startDate);
    const endFormatted = formatter.format(endDate);

    return `${startFormatted} - ${endFormatted}`;
  }

  /**
   * Generate randomDate in current month and next month, and generate full date in current month and in next month
   * @param maxDayInCurrentMonth - Number of days in current month
   * @param maxDayInNextMonth - Number of days in the next month
   * @param randomStartDate - Generate random date in current month
   * @param randomEndDate - Generate random date in the next  month
   * @param startFullDate - Generate fullDate with random start date
   * @param endFullDate - Generate endFullDate with random end date
   * @return The datetime, startDate, endDate, startFullDate, endFulldate
   */

  getSpecificDate() {
    const now = new Date();
    const maxDayInCurrentMonth = this.getDaysinMonth(1);
    const maxDayInNextMonth = this.getDaysinMonth(2);
    const randomStartDate = this.getRandomDate(
      now.getDate(),
      maxDayInCurrentMonth
    );
    const randomEndDate = this.getRandomDate(now.getDate(), maxDayInNextMonth);
    const startFullDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      randomStartDate
    );
    const endFullDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      randomEndDate
    );
    return {
      randomStartDate,
      randomEndDate,
      startFullDate,
      endFullDate,
    };
  }
}

export default new DateTime()