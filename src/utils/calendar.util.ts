import dayjs from 'dayjs';
import type { Shift } from '../store/types';

/**
 * Generates a Google Calendar add event URL for a shift
 * @param shift The shift to add
 * @returns URL string
 */
export const generateGoogleCalendarUrl = (shift: Shift): string => {
  const start = dayjs(`${shift.date}T${shift.startTime}`);
  // If no end time, assume 1 hour duration for the calendar event
  let end = shift.endTime
    ? dayjs(`${shift.date}T${shift.endTime}`)
    : start.add(1, 'hour');

  // Handle shift spanning midnight
  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  const formatGCalDate = (d: dayjs.Dayjs) => d.format('YYYYMMDDTHHmmss');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Work Shift: ${shift.venue}`,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    location: shift.venue,
    details: `Shift at ${shift.venue}. Hourly rate: €${shift.hourlyRate}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an ICS file content for a shift
 * @param shift The shift to add
 * @returns ICS file content as string
 */
export const generateIcsContent = (shift: Shift): string => {
  const start = dayjs(`${shift.date}T${shift.startTime}`);
  let end = shift.endTime
    ? dayjs(`${shift.date}T${shift.endTime}`)
    : start.add(1, 'hour');

  if (end.isBefore(start)) {
    end = end.add(1, 'day');
  }

  const formatIcsDate = (d: dayjs.Dayjs) => d.format('YYYYMMDDTHHmmss');
  const now = dayjs().format('YYYYMMDDTHHmmss');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Waiter Shift Tracker//EN',
    'BEGIN:VEVENT',
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:Work Shift: ${shift.venue}`,
    `LOCATION:${shift.venue}`,
    `DESCRIPTION:Shift at ${shift.venue}. Hourly rate: €${shift.hourlyRate}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

/**
 * Downloads a string as an ICS file
 * @param content ICS content string
 * @param filename Filename without extension
 */
export const downloadIcsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
