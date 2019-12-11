import { T, world } from "../timeline/timeline-monad.js"

const tick = (world.now = T(self => {
  let lastTime = null
  const frame = time => {
    requestAnimationFrame(frame)
    const delta = lastTime == null ? 0 : (time - lastTime) / 1000
    lastTime = time
    self.now = delta
  }
  requestAnimationFrame(frame)
}))

export { tick }
