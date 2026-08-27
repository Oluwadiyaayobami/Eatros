/**
 * Simulates backend availability logic for a vendor store.
 * 
 * @param {Object} vendor - The vendor object containing schedule and temporaryClosure status
 * @returns {Object} { status: "open"|"closed"|"temporarily_unavailable", isOpen: boolean, opensAt: string|null, closesAt: string|null }
 */
export const getVendorAvailability = (vendor) => {
  if (!vendor || !vendor.schedule) {
    return { status: "closed", isOpen: false, opensAt: null, closesAt: null };
  }

  if (vendor.isTemporarilyClosed) {
    return { status: "temporarily_unavailable", isOpen: false, opensAt: null, closesAt: null };
  }

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const currentDay = daysOfWeek[now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const todaySchedule = vendor.schedule[currentDay];

  if (!todaySchedule || !todaySchedule.isOpen) {
    // Find next open day
    let nextOpenDayIndex = (now.getDay() + 1) % 7;
    let nextOpenTime = null;
    let nextOpenDayName = null;

    for (let i = 0; i < 7; i++) {
      const checkDay = daysOfWeek[nextOpenDayIndex];
      if (vendor.schedule[checkDay] && vendor.schedule[checkDay].isOpen) {
        nextOpenTime = vendor.schedule[checkDay].open;
        nextOpenDayName = checkDay;
        break;
      }
      nextOpenDayIndex = (nextOpenDayIndex + 1) % 7;
    }

    return { 
      status: "closed", 
      isOpen: false, 
      opensAt: nextOpenTime, 
      nextOpenDay: nextOpenDayName,
      closesAt: null 
    };
  }

  const { open, close } = todaySchedule;

  if (currentTime >= open && currentTime < close) {
    return { 
      status: "open", 
      isOpen: true, 
      opensAt: null, 
      closesAt: close 
    };
  }

  // If before opening time today
  if (currentTime < open) {
    return {
      status: "closed",
      isOpen: false,
      opensAt: open,
      closesAt: null
    }
  }

  // If after closing time today, find tomorrow or next open day
  let nextOpenDayIndex = (now.getDay() + 1) % 7;
  let nextOpenTime = null;
  for (let i = 0; i < 7; i++) {
    const checkDay = daysOfWeek[nextOpenDayIndex];
    if (vendor.schedule[checkDay] && vendor.schedule[checkDay].isOpen) {
      nextOpenTime = vendor.schedule[checkDay].open;
      break;
    }
    nextOpenDayIndex = (nextOpenDayIndex + 1) % 7;
  }

  return {
    status: "closed",
    isOpen: false,
    opensAt: nextOpenTime,
    closesAt: null
  }
};
