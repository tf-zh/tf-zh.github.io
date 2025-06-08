/**
 * Created by jiangzhixiong on 2025/06/06
 */
import React from 'react'
import { FC } from 'react'

export interface PoseNetProps {
}

const componentName = "poseNet"
const PoseNet: FC<PoseNetProps> = (props) => {
  const {
  } = props

  return (
    <div className={componentName}>
      PoseNet
    </div>
  )
}

export default PoseNet
