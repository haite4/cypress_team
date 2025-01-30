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
      month: "numeric",
      day: "numeric",
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
   * @param startProposalDate - The full date that starting of the proposal from the next day
   * @param endProposalDate -  The full Date of the ending proposal
   * @param startTenderDate - The full Date that starting from endProposalDate
   * @param endTenderDate -  The full Date of the end tender date.
   * @return The datetime, startDate, endDate, startFullDate, endFulldate, startProposalDate, endProposalDate, startTenderDate, endTenderDate
   */

  getSpecificDate(
    proposeDurationDays = 7,
    tenderStartOffsetDays = 3,
    tenderDurationDays = 5
  ) {
    const now = new Date();
    const maxDayInCurrentMonth = this.getDaysinMonth(0);
    const maxDayInNextMonth = this.getDaysinMonth(2);
    const randomStartDate = this.getRandomDate(
      now.getDate(),
      maxDayInCurrentMonth
    );
    const randomEndDate = this.getRandomDate(1, maxDayInNextMonth);
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

    const startProposalDate = new Date(
      now.getUTCFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const endProposalDate = new Date(startProposalDate);
    endProposalDate.setDate(startProposalDate.getDate() + proposeDurationDays);

    const startTenderDate = new Date(endProposalDate);
    startTenderDate.setDate(endProposalDate.getDate() + tenderStartOffsetDays);

    const endTenderDate = new Date(startTenderDate);
    endTenderDate.setDate(startTenderDate.getDate() + tenderDurationDays);

    return {
      randomStartDate,
      randomEndDate,
      startFullDate,
      endFullDate,
      startProposalDate,
      endProposalDate,
      startTenderDate,
      endTenderDate,
    };
  }
}

export default new DateTime();
