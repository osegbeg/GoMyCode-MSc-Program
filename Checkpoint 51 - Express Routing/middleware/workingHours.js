function workingHoursMiddleware(req, res, next) {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hour = now.getHours(); // 0 - 23

  const isWeekday = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 9 && hour < 17;

  if (isWeekday && isWorkingHour) {
    return next();
  }

  return res.status(403).render("closed", {
    title: "Closed - Outside Working Hours",
    currentTime: now.toLocaleString("en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
}

module.exports = workingHoursMiddleware;