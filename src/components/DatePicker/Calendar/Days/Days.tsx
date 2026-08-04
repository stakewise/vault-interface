import React from 'react'
import cx from 'classnames'

import Text from '../../../Text/Text'
import Bone from '../../../Bone/Bone'

import Cell from '../Cell/Cell'
import { getDate } from '../util'

import s from './Days.module.scss'


type DayItem = {
  date: string
  fullDate: string
  yearMonth: string
}

type DaysProps = {
  days: DayItem[]
  weekDays: string[]
  yearMonth: string
  selectedDay?: string
  isLocaleFetching: boolean
  minimalDate: Date.Time | null
  maximalDate: Date.Time | null
  onSelect: (fullDate: string) => void
}

const Days: React.FC<DaysProps> = (props) => {
  const { days, weekDays, yearMonth, selectedDay, isLocaleFetching, minimalDate, maximalDate, onSelect } = props

  return (
    <>
      <div className={cx('grid text-center font-medium opacity-80 mt-8 capitalize', s.grid)}>
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
                size="md"
                color="primary"
              />
            )
          ))
        }
      </div>
      <div className={cx('grid text-center', s.grid)}>
        {
          days.map((day) => {
            const dayDate = getDate(day.fullDate) as Date.Time

            return (
              <Cell
                key={day.fullDate}
                title={day.date}
                isActive={day.yearMonth === yearMonth}
                isDisabled={(
                  minimalDate?.isAfter(dayDate.endOf('day'))
                  || maximalDate?.isBefore(dayDate.startOf('day'))
                )}
                isSelected={day.fullDate === selectedDay}
                onClick={() => onSelect(day.fullDate)}
              />
            )
          })
        }
      </div>
    </>
  )
}


export default React.memo(Days)
