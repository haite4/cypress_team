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

  calculateAllDates(
    proposeDurationDays = 7,
    tenderStartOffsetDays = 3,
    tenderDurationDays = 5
  ) {
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

    const startProposalDate = new Date(
        now.getUTCFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );
    const endProposalDate = new Date(startProposalDate)
    endProposalDate.setDate(startProposalDate.getDate() + proposeDurationDays)

    const startTenderDate = new Date(endProposalDate)
    startTenderDate.setDate(endProposalDate.getDate() + tenderStartOffsetDays)


    const endTenderDate = new Date(startTenderDate)
    endTenderDate.setDate(startTenderDate.getDate() + tenderDurationDays)


    return {
      randomStartDate,
      randomEndDate,
      startFullDate,
      endFullDate,
      startProposalDate,
      endProposalDate,
      startTenderDate,
      endTenderDate
    };
  }
}

export default new DateTime();
