const db = require('../../database/models')

exports.getYearlyStatistics = async (req, res) => {
  const reservations = await db.Reservation.findAll({ where: { machineId: req.query.id } });
  const groups = reservations.reduce((groups, reservation) => {
    const date = reservation.start_date.getMonth();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push((reservation.end_date.getTime()-reservation.start_date.getTime())/60000);
    return groups;
  }, {});

  const groupArrays = Object.keys(groups).map((date) => {
    let amountOfMinutes = 0;
    groups[date].forEach(minutes=>{
      amountOfMinutes+=minutes
    })
    return {
      date,
      time: amountOfMinutes
    };
  });

  res.send(groupArrays)
}

exports.getPersonalStatistics = async (req, res) => {
  console.log(req.query)
  const reservations = await db.Reservation.findAll({ where: { employeeId: req.query.id } });
  res.send(reservations)
}