import React, { useMemo } from 'react'
import forms from 'modules/forms'
import date from 'modules/date'
import cx from 'classnames'

import Bone from '../../Bone/Bone'
import Icon from '../../Icon/Icon'
import Text from '../../Text/Text'
import ButtonBase from '../../ButtonBase/ButtonBase'

import Day from './Day/Day'
import { useDays, getDate } from './util'

import s from './Calendar.module.scss'


export type CalendarProps = {
  className?: string
  field: Forms.Field<string>
  minDate?: string
  maxDate?: string
  onChange?: () => void
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { className, field, minDate, maxDate, onChange } = props

  const { value: selectedDay } = forms.useFieldValue(field)
  const { days, title, weekDays, yearMonth, weeksOffset, weeksCount, isLocaleFetching, setMonth } = useDays({
    field,
    animationDuration: 350,
  })

  const minimalDate = useMemo(() => getDate(minDate), [ minDate ])
  const maximalDate = useMemo(() => getDate(maxDate), [ maxDate ])

  const [ firstDayOfMonth, lastDayOfMonth ] = useMemo(() => {
    const yearMonthDate = date.time(yearMonth, 'YYYY-MM')

    return [
      yearMonthDate.startOf('month'),
      yearMonthDate.endOf('month'),
    ]
  }, [ yearMonth ])

  const isLeftButtonDisabled = useMemo(() => {
    if (minimalDate) {
      return !firstDayOfMonth.isAfter(minimalDate)
    }
  }, [ firstDayOfMonth, minimalDate ])

  const isRightButtonDisabled = useMemo(() => {
    if (maximalDate) {
      return !lastDayOfMonth.isBefore(maximalDate)
    }
  }, [ lastDayOfMonth, maximalDate ])

  return (
    <div className={cx(className, 'w-[224px]')}>
      <div className="flex items-center">
        <ButtonBase
          className={cx('rounded-4', {
            'opacity-10': isLeftButtonDisabled,
          })}
          disabled={isLeftButtonDisabled}
          onClick={() => setMonth(-1)}
        >
          <Icon
            name="arrow/left"
            size={20}
            color="dark"
          />
        </ButtonBase>
        {
          isLocaleFetching ? (
            <div className="flex-1 flex items-center justify-center">
              <Bone
                className="rounded-4"
                w={126}
                h={24}
              />
            </div>
          ) : (
            <Text
              className="flex-1 text-center capitalize"
              message={title}
              size="t16m"
              color="dark"
            />
          )
        }
        <ButtonBase
          className={cx('rounded-4', {
            'opacity-10': isRightButtonDisabled,
          })}
          disabled={isRightButtonDisabled}
          onClick={() => setMonth(1)}
        >
          <Icon
            name="arrow/right"
            size={20}
            color="dark"
          />
        </ButtonBase>
      </div>
      <div className={cx('grid text-center opacity-80 mt-8 capitalize', s.grid)}>
        {
          weekDays.map((weekDay) => (
            isLocaleFetching ? (
              <div
                key={weekDay}
                className="flex items-center justify-center"
              >
                <Bone
                  className="rounded-4"
                  w={20}
                  h={20}
                  delay={1}
                />
              </div>
            ) : (
              <Text
                key={weekDay}
                className="py-4"
                message={weekDay}
                size="t16m"
                color="primary"
              />
            )
          ))
        }
      </div>
      <div
        className={cx('relative transition-height duration-350', {
          'overflow-hidden': weeksOffset !== 0,
        })}
        style={{
          height: `${weeksCount * 32}px`,
        }}
      >
        <div
          className={cx('grid text-center', s.grid, {
            'transition-transform duration-350': weeksOffset,
          })}
          style={{
            transform: `translateY(${weeksOffset * 32}px)`,
            marginTop: weeksOffset > 0 ? `-${weeksOffset * 32}px` : '0',
          }}
        >
          {
            days.map((day) => {
              const dayDate = getDate(day.fullDate) as Date.Time

              return (
                <Day
                  key={day.fullDate}
                  title={day.date}
                  isActive={day.yearMonth === yearMonth}
                  isDisabled={(
                    minimalDate?.isAfter(dayDate.endOf('day'))
                    || maximalDate?.isBefore(dayDate.startOf('day'))
                  )}
                  isSelected={day.fullDate === selectedDay}
                  onClick={() => {
                    field.setValue(day.fullDate)

                    if (typeof onChange === 'function') {
                      onChange()
                    }
                  }}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}


export default React.memo(Calendar)
