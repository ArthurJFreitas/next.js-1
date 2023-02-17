import { createNextDescribe } from 'e2e-utils'
import { check } from 'next-test-utils'

createNextDescribe(
  'instrumentation-hook',
  {
    files: __dirname,
  },
  ({ next, isNextDev }) => {
    it('should run the instrumentation hook', async () => {
      await next.render('/')
      const stdout = await next.cliOutput
      console.log(stdout)
      expect(stdout).toInclude('instrumentation hook')
    })
    it('should not overlap with a instrumentation page', async () => {
      const page = await next.render('/instrumentation')
      expect(page).toContain('Hello')
    })
    it('should run the edge instrumentation compiled version with the edge runtime', async () => {
      await next.render('/edge')
      const stdout = await next.cliOutput
      console.log(stdout)
      expect(stdout).toInclude('instrumentation hook on the edge')
    })
    if (isNextDev) {
      it('should reload the server when the instrumentation hook changes', async () => {
        await next.render('/')
        await next.patchFile(
          './instrumentation.js',
          `export function register() {console.log('toast')}`
        )
        await check(() => next.cliOutput, /toast/)
      })
    }
  }
)