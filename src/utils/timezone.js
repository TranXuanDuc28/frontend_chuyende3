// Frontend timezone utilities for Vietnam timezone (UTC+7)

/**
 * Convert datetime-local input value to Vietnam timezone ISO string
 * @param {string} datetimeLocalValue - Value from datetime-local input (YYYY-MM-DDTHH:MM)
 * @returns {string} - ISO string in Vietnam timezone
 */
export function toVietnamISOString(datetimeLocalValue) {
  if (!datetimeLocalValue) return null;
  // datetime-local value is interpreted as LOCAL time by the browser.
  // To persist consistently, store it as a UTC ISO string without any manual offset math.
  // This avoids double-applying offsets and keeps round-trips stable.
  return new Date(datetimeLocalValue).toISOString();
}

/**
 * Convert Vietnam timezone ISO string to datetime-local input value
 * @param {string} vietnamISOString - ISO string from backend
 * @returns {string} - Value for datetime-local input
 */
export function fromVietnamISOString(vietnamISOString) {
  if (!vietnamISOString) return '';
  // The datetime-local input expects a local time string in the form YYYY-MM-DDTHH:mm
  // Build that using local time components (NOT toISOString which is UTC).
  const d = new Date(vietnamISOString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format date to Vietnam timezone string for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} - Formatted date string
 */
export function formatVietnamTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  const d = new Date(date);
  // Use Intl with Asia/Ho_Chi_Minh to avoid manual offset math
  const tz = 'Asia/Ho_Chi_Minh';

  const two = (n) => String(n).padStart(2, '0');
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(d).reduce((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});

  const yyyy = parts.year;
  const mm = parts.month;
  const dd = parts.day;
  const HH = two(parts.hour);
  const MM = two(parts.minute);
  const SS = two(parts.second);

  switch (format) {
    case 'YYYY-MM-DD HH:mm:ss':
      return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
    case 'YYYY-MM-DD':
      return `${yyyy}-${mm}-${dd}`;
    case 'HH:mm:ss':
      return `${HH}:${MM}:${SS}`;
    case 'MM/DD/YYYY': {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    }
    case 'DD/MM/YYYY': {
      return new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    }
    default:
      return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
  }
}

/**
 * Get current time in Vietnam timezone
 * @returns {Date} - Current time in Vietnam timezone
 */
export function getVietnamNow() {
  const now = new Date();
  const vietnamOffset = 7 * 60; // 420 minutes
  return new Date(now.getTime() + (vietnamOffset * 60 * 1000));
}

/**
 * Add time to a date in Vietnam timezone
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit ('minutes', 'hours', 'days')
 * @returns {Date} - New date
 */
export function addVietnamTime(date, amount, unit) {
  const baseDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamTime = new Date(baseDate.getTime() + (vietnamOffset * 60 * 1000));
  
  let newTime;
  switch (unit) {
    case 'minutes':
      newTime = new Date(vietnamTime.getTime() + (amount * 60 * 1000));
      break;
    case 'hours':
      newTime = new Date(vietnamTime.getTime() + (amount * 60 * 60 * 1000));
      break;
    case 'days':
      newTime = new Date(vietnamTime.getTime() + (amount * 24 * 60 * 60 * 1000));
      break;
    default:
      newTime = vietnamTime;
  }
  
  return newTime;
}

/**
 * Subtract time from a date in Vietnam timezone
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit ('minutes', 'hours', 'days')
 * @returns {Date} - New date
 */
export function subtractVietnamTime(date, amount, unit) {
  const baseDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamTime = new Date(baseDate.getTime() + (vietnamOffset * 60 * 1000));
  
  let newTime;
  switch (unit) {
    case 'minutes':
      newTime = new Date(vietnamTime.getTime() - (amount * 60 * 1000));
      break;
    case 'hours':
      newTime = new Date(vietnamTime.getTime() - (amount * 60 * 60 * 1000));
      break;
    case 'days':
      newTime = new Date(vietnamTime.getTime() - (amount * 24 * 60 * 60 * 1000));
      break;
    default:
      newTime = vietnamTime;
  }
  
  return newTime;
}

/**
 * Check if a date is in the past (Vietnam timezone)
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export function isPastVietnamTime(date) {
  if (!date) return false;
  
  const checkDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamCheckTime = new Date(checkDate.getTime() + (vietnamOffset * 60 * 1000));
  
  return vietnamCheckTime < getVietnamNow();
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export function getRelativeVietnamTime(date) {
  if (!date) return '';
  
  const checkDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamCheckTime = new Date(checkDate.getTime() + (vietnamOffset * 60 * 1000));
  const now = getVietnamNow();
  
  const diffMs = vietnamCheckTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMs < 0) {
    // Past
    if (Math.abs(diffMinutes) < 60) {
      return `${Math.abs(diffMinutes)} minutes ago`;
    } else if (Math.abs(diffHours) < 24) {
      return `${Math.abs(diffHours)} hours ago`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  } else {
    // Future
    if (diffMinutes < 60) {
      return `in ${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `in ${diffHours} hours`;
    } else {
      return `in ${diffDays} days`;
    }
  }
}
