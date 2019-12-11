import { T, world } from "../timeline/timeline-monad.js"
import { withLatestFrom } from "../timeline/with-latest-from.js"
import { tick } from "./tick.js"

const Time = (time = 0, timeFunction) =>
  (world.now = T(self => {
    const enabled = T(self => {
      self.now = false

      if (time != 0) {
        elapsedTime.sync(({ elapsedTime }) => {
          if (elapsedTime >= time) {
            self.now = false
          }
          console.log(elapsedTime)
        })
      }
    })

    const elapsedTime = T(self => {
      withLatestFrom(tick, enabled).sync(([delta, enabled]) => {
        const elapsedTime =
          time == 0
            ? self.now.elapsedTime + delta
            : Math.min(self.now.elapsedTime + delta, time)
        if (enabled) {
          self.now = { elapsedTime: elapsedTime, delta: delta }
        }
      })
      enabled.sync(enabled => {
        if (enabled) {
          self.now = { elapsedTime: 0, delta: 0 }
        }
      })
      self.now = { elapsedTime: 0, delta: 0 }
    })

    elapsedTime.sync(time => {
      self.now = time
    })

    world.now = enabled
    world.now = elapsedTime

    self.now = 0

    if (timeFunction) {
      timeFunction(enabled)
    }
  }))

export { Time }
