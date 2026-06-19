import React from 'react'
import cx from 'classnames'

import Bone from '../../../Bone/Bone'
import Icon from '../../../Icon/Icon'
import Text from '../../../Text/Text'
import ButtonBase from '../../../ButtonBase/ButtonBase'


type HeaderProps = {
  title: string
  isLocaleFetching: boolean
  isTitleDisabled: boolean
  isLeftDisabled?: boolean
  isRightDisabled?: boolean
  onPrev: () => void
  onNext: () => void
  onTitleClick: () => void
}

const Header: React.FC<HeaderProps> = (props) => {
  const { title, isLocaleFetching, isTitleDisabled, isLeftDisabled, isRightDisabled, onPrev, onNext, onTitleClick } = props

  return (
    <div className="flex items-center">
      <ButtonBase
        className={cx('rounded-4', {
          'opacity-10': isLeftDisabled,
        })}
        disabled={isLeftDisabled}
        onClick={onPrev}
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
          <ButtonBase
            className={cx('flex-1 rounded-4 p-4 transition-colors', {
              'hover:bg-dark/5': !isTitleDisabled,
            })}
            disabled={isTitleDisabled}
            onClick={onTitleClick}
          >
            <Text
              className="text-center capitalize w-full"
              message={title}
              size="t16m"
              color="dark"
            />
          </ButtonBase>
        )
      }
      <ButtonBase
        className={cx('rounded-4', {
          'opacity-10': isRightDisabled,
        })}
        disabled={isRightDisabled}
        onClick={onNext}
      >
        <Icon
          name="arrow/right"
          size={20}
          color="dark"
        />
      </ButtonBase>
    </div>
  )
}


export default React.memo(Header)
