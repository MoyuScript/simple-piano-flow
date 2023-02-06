import React from 'react'
import classNames from 'classnames'

function Layer({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={classNames('absolute top-0 left-0', className)} {...props}>
      {children}
    </div>
  )
}

export default React.forwardRef(Layer)
