import { T, world } from "./timeline-monad.js"

const combineLatest = (...timelines) =>
  (world.now = T(self => {
    const tls = timelines[0].constructor == Array ? timelines[0] : timelines
    tls.forEach(timeline => {
      timeline.sync(v => {
        const newValue = timelines.map(t => (t === timeline ? v : t.now))
        if (newValue.every(v => v != undefined)) {
          self.now = newValue
        }
      })
    })
  }))

export { combineLatest }
