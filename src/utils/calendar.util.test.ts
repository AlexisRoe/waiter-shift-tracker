import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Shift } from '../store/types';
import { downloadIcsFile, generateGoogleCalendarUrl, generateIcsContent } from './calendar.util';

const baseShift = (): Shift => ({
  id: 'shift-1',
  date: '2026-05-15',
  startTime: '18:00',
  endTime: '23:00',
  companyId: 'co-1',
  venue: 'Test Café',
  hourlyRate: 14,
  tips: 12,
});

describe('generateGoogleCalendarUrl', () => {
  it('returns a Google Calendar URL with encoded shift details', () => {
    const url = generateGoogleCalendarUrl(baseShift());
    expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    const parsed = new URL(url);
    expect(parsed.searchParams.get('action')).toBe('TEMPLATE');
    expect(parsed.searchParams.get('text')).toContain('Test Café');
    expect(parsed.searchParams.get('location')).toBe('Test Café');
    expect(parsed.searchParams.get('dates')).toMatch(/^\d{8}T\d{6}\/\d{8}T\d{6}$/);
  });

  it('uses a one-hour window when end time is missing', () => {
    const shift: Shift = { ...baseShift(), endTime: undefined };
    const url = generateGoogleCalendarUrl(shift);
    const datesRaw = new URL(url).searchParams.get('dates');
    if (datesRaw === null) {
      throw new Error('expected dates query param');
    }
    const [start, end] = datesRaw.split('/');
    expect(start).toBeTruthy();
    expect(end).toBeTruthy();
    expect(start).not.toBe(end);
  });

  it('extends the end date when the shift crosses midnight', () => {
    const shift: Shift = {
      ...baseShift(),
      startTime: '22:00',
      endTime: '02:00',
    };
    const datesRaw = new URL(generateGoogleCalendarUrl(shift)).searchParams.get('dates');
    if (datesRaw === null) {
      throw new Error('expected dates query param');
    }
    const [startRaw, endRaw] = datesRaw.split('/');
    const startDay = startRaw.slice(0, 8);
    const endDay = endRaw.slice(0, 8);
    expect(endDay > startDay).toBe(true);
  });
});

describe('generateIcsContent', () => {
  it('produces a valid VCALENDAR block with CRLF line endings', () => {
    const ics = generateIcsContent(baseShift());
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics.endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('SUMMARY:Work Shift: Test Café');
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}/);
  });
});

describe('downloadIcsFile', () => {
  const originalCreate = document.createElement.bind(document);

  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a blob link, triggers download, and removes the link', () => {
    const click = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor;
      return originalCreate(tag);
    });

    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);

    downloadIcsFile('ICS-BODY', 'export-name');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('export-name.ics');
    expect(click).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
