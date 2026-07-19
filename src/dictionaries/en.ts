// Mirrors id.ts. Typed against it, so a missing key is a compile error.

// Type Imports
import type { Dictionary } from './index'

const en: Dictionary = {
  meta: {
    title: 'Kopi Teduh Roastery — Coffee from Poso, Central Sulawesi',
    description:
      'A specialty coffee roastery in Poso, Central Sulawesi. Arabica and robusta from the Lore highlands, roasted fresh every week.'
  },
  nav: {
    home: 'Home',
    shop: 'Collection',
    about: 'About',
    brew: 'Brewing',
    contact: 'Contact',
    cart: 'Cart'
  },
  home: {
    heroTitle: 'Coffee from land that lies in shade.',
    heroLede:
      'Arabica and robusta from the Lore highlands of Poso. Shade-grown, picked ripe, roasted fresh every week.',
    heroCta: 'View Collection',
    featuredTitle: 'Featured Lots',
    featuredLede: 'Three coffees that best express the character of our highlands.',
    storyTitle: 'From Poso, nowhere else',
    allProducts: 'View all coffees'
  },
  shop: {
    title: 'Fresh-roasted beans from the Poso highlands.',
    lede: 'Single-origin arabica and robusta from the Lore, Besoa and Tojo gardens — roasted fresh every week. Ready for espresso or manual brew, ground to match your setup.',
    empty: 'No coffees available yet.',
    filterAll: 'All',
    filterArabica: 'Arabica',
    filterRobusta: 'Robusta'
  },
  product: {
    origin: 'Origin',
    altitude: 'Altitude',
    varietal: 'Varietal',
    process: 'Process',
    roast: 'Roast',
    producer: 'Producer',
    partnerSince: 'Partners since',
    tastingNotes: 'Tasting Notes',
    weight: 'Size',
    grind: 'Grind',
    qty: 'Quantity',
    addToCart: 'Add to Cart',
    added: 'Added',
    outOfStock: 'Out of stock',
    back: 'Back to collection'
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty.',
    emptyCta: 'Start shopping',
    item: 'item',
    items: 'items',
    subtotal: 'Subtotal',
    total: 'Total',
    note: 'Note for us',
    notePlaceholder: 'Address, special requests, or anything else…',
    checkout: 'Order via WhatsApp',
    checkoutHint: 'Your order opens in WhatsApp. Shipping and payment are arranged there.',
    remove: 'Remove',
    shippingNote: 'Shipping calculated separately'
  },
  cartMenu: {
    emptyTitle: 'Your Cart Is Empty',
    emptyLede: 'Start browsing and find the coffee you are after.',
    emptyCta: 'Browse Coffees',
    viewCart: 'View Cart',
    more: 'more items'
  },
  legal: {
    heading: 'Information',
    guide: 'Shopping Guide',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    updated: 'Last updated'
  },
  process: {
    WASHED: 'Full Washed',
    NATURAL: 'Natural',
    HONEY: 'Honey',
    WINE: 'Wine',
    WET_HULLED: 'Wet Hulled'
  },
  roast: {
    LIGHT: 'Light',
    MEDIUM_LIGHT: 'Medium Light',
    MEDIUM: 'Medium',
    MEDIUM_DARK: 'Medium Dark',
    DARK: 'Dark'
  },
  species: {
    ARABICA: 'Arabica',
    ROBUSTA: 'Robusta'
  },
  contact: {
    title: 'Contact Us',
    address: 'Address',
    hours: 'Opening Hours',
    phone: 'Phone',
    email: 'Email',
    emailUs: 'Email us',
    whatsapp: 'Chat on WhatsApp'
  },
  common: {
    langLabel: 'Language',
    menu: 'Menu',
    close: 'Close',
    loading: 'Loading…'
  }
}

export default en
