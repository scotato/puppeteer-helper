const puppeteer = require('puppeteer')
const Promise = require('bluebird')

const devices = {
  desktop: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  laptop: { width: 1280, height: 800, deviceScaleFactor: 2 },
  tabletHorizontal: { width: 1024, height: 768, deviceScaleFactor: 2 },
  tabletVertical: { width: 768, height: 1024, deviceScaleFactor: 2 },
  phoneExtraLarge: { width: 414, height: 896, deviceScaleFactor: 3 },
  phoneLarge: { width: 375, height: 812, deviceScaleFactor: 3 },
  phoneMedium: { width: 375, height: 667, deviceScaleFactor: 3 },
  phoneSmall: { width: 320, height: 568, deviceScaleFactor: 3 },
}

const deviceScreenshots = async (domain, path, browser) =>
  await Promise.all(Object.keys(devices).map(async device =>
    deviceScreenshot(domain, path, device, browser)
  ))

const deviceScreenshot = async (domain, path, device, browser) => {
  const page = await browser.newPage()
  const id = path.replace('/', '-')
  const url = `${domain}/${path}`

  await page.setViewport(devices[device])
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.screenshot({path: `screenshots/${id}-${device}.png`})
}

const getScreenshots = async (domain, paths, device) => {
  const browser = await puppeteer.launch()
  const query = paths.map(async path => await deviceScreenshot(domain, path, device, browser))
  
  await Promise.all(query).then(async () => {
    console.log('done')
    await browser.close()
  }).catch(console.log)
}

const getDeviceScreenshots = async (domain, paths) => {
  const browser = await puppeteer.launch()
  const query = paths.map(async path => await deviceScreenshots(domain, path, browser))
  
  await Promise.all(query).then(async () => {
    console.log('done')
    await browser.close()
  }).catch(console.log)
}

getScreenshots('https://goldilocks.design', [
  'posts',
  'posts/whats-up',
  'projects',
  'projects/wavy',
  'tools/react',
  'settings'
], 'laptop')
