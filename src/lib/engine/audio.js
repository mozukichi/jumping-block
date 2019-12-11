import { T, world } from "../timeline/timeline-monad.js"

const context = new AudioContext()

const Audio = src =>
  (world.now = T(self => {
    fetch(src)
      .then(response => response.arrayBuffer())
      .then(data => context.decodeAudioData(data))
      .then(buf => (self.now = buf))
  }))

const PlayAudio = timeFunction =>
  (world.now = T(self => {
    if (timeFunction) {
      timeFunction(self)
    }

    self.sync(buf => {
      const source = context.createBufferSource()
      source.buffer = buf
      source.connect(context.destination)
      source.start(0)
    })
  }))

export { Audio, PlayAudio }
