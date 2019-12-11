import { T, world } from "./timeline-monad.js"

const withLatestFrom = (source, secondSource) =>
  (world.now = T(self => {
    source.sync(v => {
      if (secondSource.now != undefined) {
        self.now = [v, secondSource.now]
      }
    })
  }))

export { withLatestFrom }
