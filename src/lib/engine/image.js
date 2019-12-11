import { T, world } from "../timeline/timeline-monad.js"

const Image = src =>
  (world.now = T(self => {
    const image = document.createElement("img")
    image.src = src
    image.addEventListener("load", () => {
      self.now = image
    })
  }))

export { Image }
