export const tiers = [
  { name: 'Bronze', min: 0, next: 500 },
  { name: 'Silver', min: 500, next: 1200 },
  { name: 'Gold', min: 1200, next: 2200 },
  { name: 'Diamond', min: 2200, next: 3800 },
  { name: 'Elite', min: 3800, next: 5000 }
]
export function getTier(points:number){
  const tier = [...tiers].reverse().find(t => points >= t.min) || tiers[0]
  const pct = Math.min(100, Math.round(((points-tier.min)/(tier.next-tier.min))*100))
  return { ...tier, pct }
}
