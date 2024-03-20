const moment = require('moment');

function getAttendanceForTimeInterval(attendanceHistory, interval) {
  const currentDate = moment();
  let filteredAttendance = [];
  switch(interval) {
    case 'week':
      filteredAttendance = attendanceHistory.filter(record => moment(record.date).isSame(currentDate, 'week'));
      break;
    case 'month':
      filteredAttendance = attendanceHistory.filter(record => moment(record.date).isSame(currentDate, 'month'));
      break;
    case 'year':
      filteredAttendance = attendanceHistory.filter(record => moment(record.date).isSame(currentDate, 'year'));
      break;
    default:
      break;
  }
  return filteredAttendance;
}

module.exports = {
  getAttendanceForTimeInterval
};
