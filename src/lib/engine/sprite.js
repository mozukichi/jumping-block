import { T, world } from "../timeline/timeline-monad.js"

const INITIAL_SPRITE = { image: null, x: 0, y: 0, z: 0, alpha: 1.0 }

const Sprite = ({ image, x, y, z, alpha } = INITIAL_SPRITE, timeFunction) =>
  (world.now = T(self => {
    image.sync(image => {
      self.now = { image, x, y, z, alpha }
    })

    if (timeFunction) {
      timeFunction(self)
    }
  }))

export { Sprite }
