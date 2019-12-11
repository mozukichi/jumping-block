import { T, world } from "./lib/timeline/timeline-monad.js"
import { Canvas } from "./lib/engine/canvas.js"
import { tick } from "./lib/engine/tick.js"
import { combineLatest } from "./lib/timeline/combine-latest.js"
import { withLatestFrom } from "./lib/timeline/with-latest-from.js"

const SCREEN_WIDTH = 1024
const SCREEN_HEIGHT = 576
const BLOCK_INTERVAL = 2000
const BLOCK_WIDTH = 100
const BLOCK_UNIT_HEIGHT = 50
const BLOCK_HEIGHT_RANGE_MIN = 1
const BLOCK_HEIGHT_RANGE_MAX = 3
const BLOCK_POS_Y_RANGE_MIN = 0
const BLOCK_POS_Y_RANGE_MAX = 5
const MARGIN_RATE = 0.2
const BLOCK_SPEED = 100

const rand = (start, end) =>
  Math.floor(Math.random() * (end - start + 1)) + start

const canvas = Canvas({ id: "canvas" })

const generateBlock = (world.now = T(self => {
  const generate = () => {
    self.now = 0
    setTimeout(generate, BLOCK_INTERVAL)
  }
  setTimeout(generate, BLOCK_INTERVAL)
}))

const colideBlock = (block1, block2) => {
  return (
    block1.x <= block2.x + block2.width && block1.x + block1.width >= block2.x
  )
}

const blocks = (world.now = T(self => {
  self.now = []

  generateBlock.sync(() => {
    if (self.now.length > 10) {
      return
    }
    const dir = rand(0, 1)
    const width = BLOCK_WIDTH
    const height =
      BLOCK_UNIT_HEIGHT * rand(BLOCK_HEIGHT_RANGE_MIN, BLOCK_HEIGHT_RANGE_MAX)
    const margin = Math.floor(SCREEN_HEIGHT * MARGIN_RATE)
    self.now = self.now.concat({
      id: performance.now(),
      x: dir == 0 ? -width : SCREEN_WIDTH,
      y:
        margin +
        BLOCK_UNIT_HEIGHT * rand(BLOCK_POS_Y_RANGE_MIN, BLOCK_POS_Y_RANGE_MAX),
      dir: dir == 0 ? 1 : -1,
      width,
      height,
      freeze: false
    })
  })

  tick.sync(delta => {
    self.now = self.now
      .map(block => ({
        ...block,
        x: block.freeze ? block.x : block.x + BLOCK_SPEED * delta * block.dir
      }))
      .map(block => ({
        ...block,
        freeze: (block => {
          return self.now.some(target =>
            block.id !== target.id ? colideBlock(block, target) : false
          )
        })(block)
      }))
      .filter(
        block =>
          (block.dir == -1 && block.x + block.width > 0) ||
          (block.dir == 1 && block.x < SCREEN_WIDTH)
      )
  })
}))

withLatestFrom(tick, combineLatest(canvas, blocks)).sync(
  ([, [canvas, blocks]]) => {
    const cv = canvas.canvas
    const ctx = canvas.ctx
    ctx.clearRect(0, 0, cv.width, cv.height)
    ctx.fillStyle = "blue"
    ctx.strokeStyle = "white"
    blocks.forEach(block => {
      ctx.fillStyle = "steelblue"
      ctx.fillRect(block.x, 0, block.width, SCREEN_HEIGHT)
      ctx.fillStyle = "blue"
      ctx.fillRect(block.x, block.y, block.width, block.height)
      ctx.strokeRect(block.x, block.y, block.width, block.height)
    })
  }
)
