import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, isSameDay, isSameMonth,
  isAfter, isBefore, format,
} from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import '../styles/DatePicker.css'

const WEEKDAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

interface DatePickerProps {
  isOpen: boolean
  checkIn: Date
  checkOut: Date
  onConfirm: (checkIn: Date, checkOut: Date) => void
  onClose: () => void
}

function getMonthDays(month: Date): (Date | null)[] {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const firstWeekStart = startOfWeek(start, { weekStartsOn: 1 })
  const lastWeekEnd = endOfWeek(end, { weekStartsOn: 1 })

  const days: (Date | null)[] = []
  let current = firstWeekStart

  while (current <= lastWeekEnd) {
    days.push(isSameMonth(current, month) ? new Date(current) : null)
    current = addDays(current, 1)
  }

  return days
}

function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  return isAfter(day, start) && isBefore(day, end)
}

const DatePicker = ({ isOpen, checkIn, checkOut, onConfirm, onClose }: DatePickerProps) => {
  const [tempCheckIn, setTempCheckIn] = useState<Date | null>(checkIn)
  const [tempCheckOut, setTempCheckOut] = useState<Date | null>(checkOut)
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)
  const [baseMonth, setBaseMonth] = useState(startOfMonth(checkIn))

  useEffect(() => {
    if (isOpen) {
      setTempCheckIn(checkIn)
      setTempCheckOut(checkOut)
      setSelectingCheckOut(false)
      setBaseMonth(startOfMonth(checkIn))
    }
  }, [isOpen, checkIn, checkOut])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const monthTabs = useMemo(() => {
    const tabs = []
    for (let i = 0; i < 12; i++) {
      tabs.push(addMonths(today, i))
    }
    return tabs
  }, [today])

  const month1Days = useMemo(() => getMonthDays(baseMonth), [baseMonth])
  const month2 = useMemo(() => addMonths(baseMonth, 1), [baseMonth])
  const month2Days = useMemo(() => getMonthDays(month2), [month2])

  const handleDayClick = useCallback((day: Date) => {
    if (isBefore(day, today)) return

    if (!selectingCheckOut || !tempCheckIn) {
      setTempCheckIn(day)
      setTempCheckOut(null)
      setSelectingCheckOut(true)
    } else {
      if (isBefore(day, tempCheckIn) || isSameDay(day, tempCheckIn)) {
        setTempCheckIn(day)
        setTempCheckOut(null)
      } else {
        setTempCheckOut(day)
        setSelectingCheckOut(false)
      }
    }
  }, [selectingCheckOut, tempCheckIn, today])

  const handleConfirm = () => {
    if (tempCheckIn && tempCheckOut) {
      onConfirm(tempCheckIn, tempCheckOut)
    }
  }

  const handleCancel = () => {
    setTempCheckIn(checkIn)
    setTempCheckOut(checkOut)
    setSelectingCheckOut(false)
    onClose()
  }

  const handleTabClick = (month: Date) => {
    setBaseMonth(startOfMonth(month))
  }

  const getDayClass = (day: Date | null) => {
    if (!day) return 'cal-day empty'
    const classes = ['cal-day']

    if (isBefore(day, today)) {
      classes.push('disabled')
      return classes.join(' ')
    }

    if (tempCheckIn && isSameDay(day, tempCheckIn)) classes.push('selected check-in')
    if (tempCheckOut && isSameDay(day, tempCheckOut)) classes.push('selected check-out')
    if (isInRange(day, tempCheckIn, tempCheckOut)) classes.push('in-range')
    if (isSameDay(day, today)) classes.push('today')

    return classes.join(' ')
  }

  if (!isOpen) return null

  const formatMonthTitle = (date: Date) =>
    format(date, 'LLLL yyyy', { locale: ru }).replace(/^./, c => c.toUpperCase())

  const formatTabLabel = (date: Date) => {
    const m = format(date, 'LLL', { locale: ru }).replace(/^./, c => c.toUpperCase())
    const y = format(date, 'yyyy')
    return { m, y }
  }

  const renderMonth = (days: (Date | null)[], month: Date) => (
    <div className="cal-month">
      <h3 className="cal-month-title">{formatMonthTitle(month)}</h3>
      <div className="cal-weekdays">
        {WEEKDAYS.map(d => <span key={d} className="cal-weekday">{d}</span>)}
      </div>
      <div className="cal-grid">
        {days.map((day, i) => (
          <button
            key={i}
            className={getDayClass(day)}
            onClick={() => day && handleDayClick(day)}
            disabled={!day || isBefore(day, today)}
            type="button"
          >
            {day ? day.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="dpm-overlay" onClick={handleCancel}>
      <div className="dpm-modal" onClick={e => e.stopPropagation()}>
        <div className="dpm-header">
          <h2>Выбрать даты</h2>
          <button className="dpm-close" onClick={handleCancel} type="button">×</button>
        </div>

        <div className="dpm-status">
          {!tempCheckIn && 'Выберите дату заселения'}
          {tempCheckIn && !tempCheckOut && 'Выберите дату выезда'}
          {tempCheckIn && tempCheckOut && (
            <>
              {format(tempCheckIn, 'd MMM', { locale: ru })}
              {' → '}
              {format(tempCheckOut, 'd MMM', { locale: ru })}
            </>
          )}
        </div>

        <div className="dpm-tabs">
          {monthTabs.map((tab, i) => {
            const { m, y } = formatTabLabel(tab)
            const isActive = isSameMonth(tab, baseMonth)
            return (
              <button
                key={i}
                className={`dpm-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
                type="button"
              >
                <span className="dpm-tab-month">{m}</span>
                <span className="dpm-tab-year">{y}</span>
              </button>
            )
          })}
        </div>

        <div className="dpm-calendars">
          {renderMonth(month1Days, baseMonth)}
          {renderMonth(month2Days, month2)}
        </div>

        <div className="dpm-footer">
          <button className="dpm-btn-done" onClick={handleConfirm} disabled={!tempCheckIn || !tempCheckOut} type="button">
            Готово
          </button>
          <button className="dpm-btn-cancel" onClick={handleCancel} type="button">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

export default DatePicker
