import type { BusinessCategory } from '@/types'

export const businesses: BusinessCategory[] = [
  { cat: 'Food & Drink', icon: 'utensils', items: ['Bakery', 'Bar', 'Bar & Grill', 'Cafe', 'Candy Store', 'Coffee shop', 'Delicatessen', 'Dessert Shop', 'Fast Food Restaurant', 'Ice Cream Shop', 'Pizzeria', 'Restaurant', 'Winery'] },
  { cat: 'Beauty & Personal Care', icon: 'scissors', items: ['Barber', 'Beauty Salon', 'Hair Salon', 'Nail Salon', 'Skin Care & Makeup', 'Massage Therapy', 'Cosmetic & Beauty Supply', 'Tattoo & Piercing'] },
  { cat: 'Pet Services', icon: 'paw', items: ['Pet Groomer', 'Veterinarian', 'Pet Store'] },
  { cat: 'Everyday Retail', icon: 'shopping-bag', items: ['Convenience Store', 'Grocery Store', 'Pharmacy', 'Health Food Store', 'Liquor Store', 'Butcher Shop'] },
  { cat: 'Fashion & Accessories', icon: 'shirt', items: ["Men's Clothing", "Women's Clothing", 'Clothing Store', 'Shoe Store', 'Bridal Shop', 'Jewelry Store', 'Eyewear Store', 'Fashion Boutique', 'Fashion Accessories', "Children's Clothing"] },
  { cat: 'Home & Hardware', icon: 'hammer', items: ['Home Goods', 'Home Improvement', 'Furniture Store', 'Hardware Store', 'Building Supply', 'Lighting Store', 'Nursery & Gardening'] },
  { cat: 'Electronics', icon: 'laptop', items: ['Electronics Store', 'Mobile Phone Store', 'Computer Store'] },
  { cat: 'Gifts, Books & Hobbies', icon: 'gift', items: ['Flower Shop', 'Arts & Crafts Store', 'Bookstore', 'Toy Store'] },
  { cat: 'Auto & Vehicle Retail', icon: 'car', items: ['Car Dealer', 'Vehicle Dealer'] },
  { cat: 'Sports & Recreation', icon: 'dumbbell', items: ['Dance Studio', 'Gym', 'Sporting Goods', 'Martial Arts Club', 'Pilates Studio', 'Bike Store', 'Sports Club & League', 'Swimming Pool', 'Yoga Studio'] },
  { cat: 'Arts & Entertainment', icon: 'palette', items: ['Art Gallery', 'Dance Club', 'Museum', 'Music Venue', 'Theatre Venue'] },
  { cat: 'Health Care', icon: 'heart-pulse', items: ['Counseling & Mental Health', 'Dentist', 'Doctor', 'Medical Center', 'Naturopathic Holistic', 'Optometrist', 'Physical Therapy', 'Psychotherapist', 'Spa'] },
]

const competitorMap: Record<string, string[]> = {
  'Bakery': ['Bakery', 'Cafe', 'Coffee shop', 'Dessert Shop'],
  'Cafe': ['Cafe', 'Coffee shop', 'Bakery', 'Restaurant'],
  'Coffee shop': ['Coffee shop', 'Cafe', 'Bakery'],
  'Restaurant': ['Restaurant', 'Bar & Grill', 'Cafe', 'Fast Food Restaurant'],
  'Bar': ['Bar', 'Bar & Grill', 'Restaurant', 'Winery'],
  'Hair Salon': ['Hair Salon', 'Beauty Salon', 'Barber'],
  'Barber': ['Barber', 'Hair Salon'],
  'Nail Salon': ['Nail Salon', 'Beauty Salon', 'Hair Salon'],
  'Beauty Salon': ['Beauty Salon', 'Hair Salon', 'Nail Salon', 'Skin Care & Makeup'],
  'Pharmacy': ['Pharmacy', 'Health Food Store', 'Convenience Store'],
  'Grocery Store': ['Grocery Store', 'Convenience Store', 'Butcher Shop', 'Health Food Store'],
  'Gym': ['Gym', 'Pilates Studio', 'Yoga Studio', 'Martial Arts Club'],
  'Yoga Studio': ['Yoga Studio', 'Pilates Studio', 'Gym', 'Dance Studio'],
  'Dentist': ['Dentist', 'Doctor', 'Medical Center'],
  'Spa': ['Spa', 'Massage Therapy', 'Beauty Salon'],
}

export function smartCompetitorsFor(business: string, category: string): string[] {
  if (competitorMap[business]) return competitorMap[business]
  const cat = businesses.find(b => b.cat === category)
  if (!cat) return [business]
  return [business, ...cat.items.filter(i => i !== business).slice(0, 2)]
}
