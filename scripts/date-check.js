export const todayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  var mm = today.getMonth() + 1;
  var dd = today.getDate();
    
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
    
  return dd + '.' + mm + '.' + yyyy;
};

export const dateIsExpired = (date, id) => {
  return timeLeft(date, id).daysLeft <= 0;
};

export const dateToNumber = (date) => {
  const dateArray = date.split('.');
  const dateNumber = Date.parse(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] );
  return dateNumber
};

export const getMonth = (date) => {
  const dateArray = date.split('.');
  return dateArray[1] - 1
};

export const getYear = (date) => {
  const dateArray = date.split('.');
  return dateArray[2]
};

export const timeLeft = (date, id) => {
  const taskDate = dateToNumber(date);
  const currentDate = Date.now();
  const timeLeft = taskDate - currentDate;
  const limit = taskDate - id;
  const percentage = timeLeft / (limit / 100);
  const daysLeft = Math.ceil(timeLeft / 1000 / 60 / 60 / 24);

  return {percentage: percentage, daysLeft: daysLeft}
};

export const getPreviousMonth = (year, month) => {
  let previousYear = year;
  let previousMonth = month;
  if(month == 0) {
    previousYear -= 1;
    previousMonth = 11;
  }
  else previousMonth -= 1;
  return {year: previousYear, month: previousMonth}
};

export const getNextMonth = (year, month) => {
  let nextYear = year;
  let nextMonth = month;
  if(month == 11) {
    nextYear += 1;
    nextMonth = 0;
  }
  else nextMonth += 1;
  return {year: nextYear, month: nextMonth}
};