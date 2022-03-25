const request = require('request')
const Cheerio = require('cheerio')
const { first } = require('cheerio/lib/api/traversing')
const { ProductDetails } = require('./dbschema')

async function GetProductData () {
  try {
    let Keys = ['site', 'Title', 'OfferPrice', 'FirstPrice', 'Rating', 'Image']

    const SNAPDEAL_URL =
      'https://www.snapdeal.com/search?keyword=shoes&sort=rlvncy'

    const AMAZONE_URL = 'https://www.amazon.in/s?k=IPHONE'
    request(AMAZONE_URL, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = Cheerio.load(html)
        const amazonItem = $('div.s-result-item.s-widget-spacing-small')

        let KeyIdx
        amazonItem.each(async (index, element) => {
          const DataObj = {}
          KeyIdx = 0
          if (index <= 3) {
            DataObj[Keys[KeyIdx]] = 'AMAZON'
            KeyIdx++
            const amazonTitle = $(element)
              .find('.a-size-medium')
              .first()
              .text()

            DataObj[Keys[KeyIdx]] = amazonTitle
            KeyIdx++
            const OfferPrice = $(element)
              .find('.a-price-whole')
              .first()
              .text()

            DataObj[Keys[KeyIdx]] = OfferPrice
            KeyIdx++
            const FirstPrice = $(element)
              .find('span.a-text-price [aria-hidden="true"]')
              .first()
              .text()

            DataObj[Keys[KeyIdx]] = FirstPrice
            KeyIdx++

            var ProductStar = $(element)
              .find('i.a-icon-star-small')
              .first()
              .text()
            ProductStar = ProductStar.split(' ')
            ProductStar = Math.floor(ProductStar[0])

            DataObj[Keys[KeyIdx]] = ProductStar
            KeyIdx++

            const ProductImage = $(element)
              .find('img.s-image')
              .attr('src')

            DataObj[Keys[KeyIdx]] = ProductImage
            KeyIdx++

            const Data = await ProductDetails.create(DataObj)
          }
        })
      }
    })

    request(SNAPDEAL_URL, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = Cheerio.load(html)
        const SnapDealItem = $('div.product-tuple-listing.js-tuple')
        SnapDealItem.each(async (index, element) => {
          let snapIdx = 0
          if (index <= 3) {
            var SnapDealObj = {}
            SnapDealObj[Keys[snapIdx]] = 'SNAP_DEAL'
            snapIdx++
            const SnapTitle = $(element)
              .find('p.product-title ')
              .first()
              .text()
            SnapDealObj[Keys[snapIdx]] = SnapTitle
            snapIdx++
            const snapOfferPrice = $(element)
              .find('span.product-price')
              .first()
              .text()
            SnapDealObj[Keys[snapIdx]] = snapOfferPrice
            snapIdx++
            const SnapFirstPrice = $(element)
              .find('span.product-desc-price')
              .first()
              .text()
            SnapDealObj[Keys[snapIdx]] = SnapFirstPrice
            snapIdx++

            
            const SnapProductStar = 5

            SnapDealObj[Keys[snapIdx]] = SnapProductStar
            snapIdx++
            const SnapImage = $(element)
              .find('img.product-image')
              .attr('src')
            SnapDealObj[Keys[snapIdx]] = SnapImage
            snapIdx++

            const Data = await ProductDetails.create(SnapDealObj)
          }
        })
      }
    })

    
    return PRODUCTDATA
  } catch (error) {
    console.log('ERROR!!!!', error)
  }
}
module.exports = GetProductData
