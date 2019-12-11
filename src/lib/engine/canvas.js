import { T, world } from "../timeline/timeline-monad.js"

const Canvas = ({ id }) =>
  (world.now = T(self => {
    addEventListener("DOMContentLoaded", () => {
      const canvas = document.getElementById(id)
      self.now = { canvas: canvas, ctx: canvas.getContext("2d") }
    })
  }))

export { Canvas }
