import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import puppeteer from 'puppeteer'

const badges = [
  ['American Business', 'american-business'],
  ['American Cultures', 'american-cultures'],
  ['American Heritage', 'american-heritage'],
  ['American Indian Culture', 'american-indian-culture'],
  ['American Labor', 'american-labor'],
  ['Animal Science', 'animal-science'],
  ['Animation', 'animation'],
  ['Archaeology', 'archaeology'],
  ['Archery', 'archery'],
  ['Architecture', 'architecture'],
  ['Art', 'art'],
  ['Artificial Intelligence', 'artificial-intelligence'],
  ['Astronomy', 'astronomy'],
  ['Athletics', 'athletics'],
  ['Automotive Maintenance', 'automotive-maintenance'],
  ['Aviation', 'aviation'],
  ['Backpacking', 'backpacking'],
  ['Basketry', 'basketry'],
  ['Bird Study', 'bird-study'],
  ['Bugling', 'bugling'],
  ['Camping', 'camping'],
  ['Canoeing', 'canoeing'],
  ['Chemistry', 'chemistry'],
  ['Chess', 'chess'],
  ['Citizenship in Society', 'citizenship-in-society'],
  ['Citizenship in the Community', 'citizenship-in-the-community'],
  ['Citizenship in the Nation', 'citizenship-in-the-nation'],
  ['Citizenship in the World', 'citizenship-in-the-world'],
  ['Climbing', 'climbing'],
  ['Coin Collecting', 'coin-collecting'],
  ['Collections', 'collections'],
  ['Communication', 'communication'],
  ['Composite Materials', 'composite-materials'],
  ['Cooking', 'cooking'],
  ['Crime Prevention', 'crime-prevention'],
  ['Cybersecurity', 'cybersecurity'],
  ['Cycling', 'cycling'],
  ['Dentistry', 'dentistry'],
  ['Digital Technology', 'digital-technology'],
  ['Disabilities Awareness', 'disabilities-awareness'],
  ['Dog Care', 'dog-care'],
  ['Drafting', 'drafting'],
  ['Electricity', 'electricity'],
  ['Electronics', 'electronics'],
  ['Emergency Preparedness', 'emergency-preparedness'],
  ['Energy', 'energy'],
  ['Engineering', 'engineering'],
  ['Entrepreneurship', 'entrepreneurship'],
  ['Environmental Science', 'environmental-science'],
  ['Exploration', 'exploration'],
  ['Family Life', 'family-life'],
  ['Farm Mechanics', 'farm-mechanics'],
  ['Fingerprinting', 'fingerprinting'],
  ['Fire Safety', 'fire-safety'],
  ['First Aid', 'first-aid'],
  ['Fish & Wildlife Management', 'fish-wildlife-management'],
  ['Fishing', 'fishing'],
  ['Fly Fishing', 'fly-fishing'],
  ['Forestry', 'forestry'],
  ['Game Design', 'game-design'],
  ['Gardening', 'gardening'],
  ['Genealogy', 'genealogy'],
  ['Geocaching', 'geocaching'],
  ['Geology', 'geology'],
  ['Golf', 'golf'],
  ['Graphic Arts', 'graphic-arts'],
  ['Health Care Professions', 'health-care-professions'],
  ['Hiking', 'hiking'],
  ['Home Repairs', 'home-repairs'],
  ['Horsemanship', 'horsemanship'],
  ['Insect Study', 'insect-study'],
  ['Inventing', 'inventing'],
  ['Journalism', 'journalism'],
  ['Kayaking', 'kayaking'],
  ['Landscape Architecture', 'landscape-architecture'],
  ['Law', 'law'],
  ['Leatherwork', 'leatherwork'],
  ['Lifesaving', 'lifesaving'],
  ['Mammal Study', 'mammal-study'],
  ['Metalwork', 'metalwork'],
  ['Mining in Society', 'mining-in-society'],
  ['Model Design and Building', 'model-design-and-building'],
  ['Motorboating', 'motorboating'],
  ['Moviemaking', 'moviemaking'],
  ['Multisport', 'multisport'],
  ['Music', 'music'],
  ['Nature', 'nature'],
  ['Nuclear Science', 'nuclear-science'],
  ['Oceanography', 'oceanography'],
  ['Orienteering', 'orienteering'],
  ['Painting', 'painting'],
  ['Personal Fitness', 'personal-fitness'],
  ['Personal Management', 'personal-management'],
  ['Pets', 'pets'],
  ['Photography', 'photography'],
  ['Pioneering', 'pioneering'],
  ['Plant Science', 'plant-science'],
  ['Plumbing', 'plumbing'],
  ['Pottery', 'pottery'],
  ['Programming', 'programming'],
  ['Public Health', 'public-health'],
  ['Public Speaking', 'public-speaking'],
  ['Pulp and Paper', 'pulp-and-paper'],
  ['Radio', 'radio'],
  ['Railroading', 'railroading'],
  ['Reading', 'reading'],
  ['Reptile and Amphibian Study', 'reptile-and-amphibian-study'],
  ['Rifle Shooting', 'rifle-shooting'],
  ['Robotics', 'robotics'],
  ['Rowing', 'rowing'],
  ['Safety', 'safety'],
  ['Salesmanship', 'salesmanship'],
  ['Scholarship', 'scholarship'],
  ['Scouting Heritage', 'scouting-heritage'],
  ['Scuba Diving', 'scuba-diving'],
  ['Sculpture', 'sculpture'],
  ['Search and Rescue', 'search-and-rescue'],
  ['Shotgun Shooting', 'shotgun-shooting'],
  ['Signs, Signals, and Codes', 'signs-signals-and-codes'],
  ['Skating', 'skating'],
  ['Small-Boat Sailing', 'small-boat-sailing'],
  ['Snow Sports', 'snow-sports'],
  ['Soil and Water Conservation', 'soil-and-water-conservation'],
  ['Space Exploration', 'space-exploration'],
  ['Sports', 'sports'],
  ['Stamp Collecting', 'stamp-collecting'],
  ['Surveying', 'surveying'],
  ['Sustainability', 'sustainability'],
  ['Swimming', 'swimming'],
  ['Textile', 'textile'],
  ['Theater', 'theater'],
  ['Traffic Safety', 'traffic-safety'],
  ['Truck Transportation', 'truck-transportation'],
  ['Veterinary Medicine', 'veterinary-medicine'],
  ['Water Sports', 'water-sports'],
  ['Weather', 'weather'],
  ['Welding', 'welding'],
  ['Whitewater', 'whitewater'],
  ['Wilderness Survival', 'wilderness-survival'],
  ['Wood Carving', 'wood-carving'],
  ['Woodwork', 'woodwork'],
]

const outputDir = path.join('public', 'badges')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

function downloadBinary(url, dest, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'))
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        return downloadBinary(res.headers.location, dest, redirectCount + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
      file.on('error', err => {
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        reject(err)
      })
    }).on('error', err => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      reject(err)
    })
  })
}

async function getBadgeImageUrl(page, slug) {
  await page.goto(`https://www.scouting.org/merit-badges/${slug}/`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  })

  const imageUrl = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
    for (const img of imgs) {
      const src = img.src || ''
      if (
        src.includes('merit') ||
        src.includes('badge') ||
        src.includes('filestore')
      ) {
        if (
          !src.includes('logo') &&
          !src.includes('icon') &&
          !src.includes('scouting-america') &&
          (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.webp'))
        ) {
          return src
        }
      }
    }

    // fallback: find largest image on page that isn't a logo
    let best = null
    let bestSize = 0
    for (const img of imgs) {
      const src = img.src || ''
      if (
        !src.includes('logo') &&
        !src.includes('icon') &&
        !src.includes('scouting-america') &&
        !src.includes('banner') &&
        (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.webp'))
      ) {
        const size = (img.naturalWidth || 0) * (img.naturalHeight || 0)
        if (size > bestSize) {
          bestSize = size
          best = src
        }
      }
    }
    return best
  })

  return imageUrl
}

async function run() {
  const failed = []

  console.log('Launching browser...')
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  for (const [name, slug] of badges) {
    const dest = path.join(outputDir, `${slug}.jpg`)

    if (fs.existsSync(dest)) {
      console.log(`✓ skip: ${name}`)
      continue
    }

    try {
      const imageUrl = await getBadgeImageUrl(page, slug)
      if (!imageUrl) {
        console.log(`✗ no image: ${name}`)
        failed.push(name)
        continue
      }
      await downloadBinary(imageUrl, dest)
      console.log(`✓ ${name}`)
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`)
      failed.push(name)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  await browser.close()

  console.log('\n--- Done ---')
  if (failed.length > 0) {
    console.log(`\nFailed (${failed.length}):`)
    failed.forEach(n => console.log(`  - ${n}`))
  } else {
    console.log('All badges downloaded.')
  }
}

run()