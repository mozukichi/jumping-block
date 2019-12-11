import { T, world } from "../timeline/timeline-monad.js"
import { withLatestFrom } from "../timeline/with-latest-from.js"
import { Time } from "./time.js"

const Tween = (
  { start, end, time, func, repeat = false, reverse = false },
  enabled
) =>
  (world.now = T(self => {
    console.assert(enabled != null)
    const increase = end - start > 0

    const elapsedTime = T(self => {
      self.now = 0

      const frame = Time(
        repeat ? 0 : reverse ? time * 2 : time,
        timeEnabled => {
          enabled.sync(enabled => {
            timeEnabled.now = enabled
          })
        }
      )

      enabled.sync(enabled => {
        if (enabled) {
          self.now = 0
        }
      })

      withLatestFrom(frame, positive).sync(([frame, positive]) => {
        const ratio = Math.min(Math.max(self.now / time, 0), 1)
        if (positive) {
          self.now = Math.min(Math.max(self.now + frame.delta, 0), 1)
        } else {
          self.now = Math.min(Math.max(self.now - frame.delta, 0), 1)
        }
        if (!reverse && repeat && ratio >= 1) {
          self.now = 0
        }
      })
    })

    const positive = T(self => {
      self.now = end - increase ? true : false

      elapsedTime.sync(elapsedTime => {
        const ratio = Math.min(Math.max(elapsedTime / time, 0), 1)
        if (self.now && reverse && ratio >= 1) {
          self.now = false
        } else if (!self.now && repeat && ratio <= 0) {
          self.now = true
        }
      })

      enabled.sync(enabled => {
        if (enabled) {
          self.now = true
        }
      })
    })

    elapsedTime.sync(elapsedTime => {
      const ratio = Math.min(Math.max(elapsedTime / time, 0), 1)
      self.now = func(start, end, ratio)
    })

    self.now = start
    world.now = enabled
    world.now = elapsedTime
    world.now = positive
  }))

const LINEAR_TWEEN_FUNC = (start, end, ratio) => start + (end - start) * ratio
const QUBIC_EASE_TWEEN_FUNC = (start, end, ratio) => {
  const t1 = ratio * 2
  const t2 = t1 - 2
  return t1 < 1
    ? (end / 2) * t1 * t1 * t1 + start
    : (end / 2) * (t2 * t2 * t2 + 2) + start
}

export { Tween, LINEAR_TWEEN_FUNC, QUBIC_EASE_TWEEN_FUNC }
