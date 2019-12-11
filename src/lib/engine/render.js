import { withLatestFrom } from "../timeline/with-latest-from.js"
import { combineLatest } from "../timeline/combine-latest.js"

const Render = ({ tick, canvas, entities }) =>
  withLatestFrom(tick, combineLatest(canvas, entities))
    .sync(([_, [canvas, entities]]) => [canvas, entities])
    .sync(renderEntities)

const renderEntities = ([canvas, entities]) => {
  const cv = canvas.canvas
  const ctx = canvas.ctx
  const orderedEntities = entities.sort((e1, e2) => e1.z - e2.z)
  ctx.clearRect(0, 0, cv.width, cv.height)
  orderedEntities.forEach(entity => {
    ctx.globalAlpha = entity.alpha
    ctx.drawImage(entity.image, entity.x, entity.y)
  })
}

export { Render }
