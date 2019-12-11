/*
MIT License

Copyright (c) 2019 Ken OKABE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//the timeline property `now` means
//time-index of the current time
// on the timeline from now until the future / next - now
const right = a => b => b
const Events = () =>
  (observers => ({
    register: f => (observers[observers.length] = f),
    trigger: val => right(observers.map(f => f(val)))(val)
  }))([])
const world = {
  set now(timeline) {
    timeline.timeFunction(timeline)
  }
}
const T = (Events => (timeFunction = () => {}) =>
  (currentVal => {
    //immutable in the frozen universe
    const timeline = (ev => ({
      type: "timeline-monad",
      timeFunction: timeFunction,
      get now() {
        return currentVal
      },
      set now(val) {
        currentVal = val
        currentVal === undefined ? undefined : ev.trigger(currentVal)
      },
      sync: (ev => f =>
        (world.now = T(self =>
          right(
            ev.register(val =>
              (newVal =>
                // RightIdentity: join = TTX => TX
                newVal !== undefined && newVal.type === timeline.type
                  ? newVal.sync(val => (self.now = val))
                  : (self.now = newVal))(f(val))
            )
          )((timeline.now = timeline.now))
        )))(ev)
    }))(Events())
    return timeline
  })(undefined))(Events)
export { T, world }
