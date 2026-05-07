export const GROCERY = [
  {
    category: 'PROTEINS',
    items: [
      { id: 'g1', name: 'Chicken Breasts — Family Pack (~4 lbs)', note: 'Kirkwood brand · bake Sunday, use all week', cost: 11.00, protein: '~38g per 6oz' },
      { id: 'g2', name: 'Ground Beef 96/4 — 3 lbs',              note: 'Tacos Mon · stir-fry Thu',                  cost: 14.00, protein: '~26g per 4oz' },
      { id: 'g3', name: 'Ribeye Steaks — x2',                    note: 'Fresh cook Tue or Sat treat',               cost: 16.00, protein: '~42g per steak' },
      { id: 'g4', name: 'Eggs — 18 count',                       note: 'Scrambles, hard-boiled, breakfast-for-dinner', cost: 5.50, protein: '6g per egg' },
      { id: 'g5', name: 'Greek Yogurt Plain — 32oz',             note: 'Friendly Farms · breakfast or post-workout', cost: 3.50,  protein: '~17g per cup' },
      { id: 'g6', name: 'Cottage Cheese — 24oz',                 note: 'Friendly Farms · nighttime snack',          cost: 3.00,  protein: '~25g per cup' },
    ]
  },
  {
    category: 'CARBS & STARCHES',
    items: [
      { id: 'g7',  name: 'White Jasmine Rice — Large Bag', note: 'Cook 2 cups dry Sunday',              cost: 4.50, protein: null },
      { id: 'g8',  name: 'Russet Potatoes — 5 lb bag',    note: 'Air fry Sunday, refill midweek',       cost: 4.00, protein: null },
      { id: 'g9',  name: 'Tortillas (flour, 10-pack)',    note: 'Taco Monday, breakfast wraps',          cost: 2.50, protein: null },
      { id: 'g10', name: 'English Muffins',               note: 'Egg sandwiches, grab-and-go breakfast', cost: 2.50, protein: null },
    ]
  },
  {
    category: 'PRODUCE',
    items: [
      { id: 'g11', name: 'Asparagus — 2 bunches',        note: 'Roast Sunday, sides Mon–Wed',   cost: 5.00, protein: null },
      { id: 'g12', name: 'Bananas',                      note: 'Pre-run fuel, breakfast add-on', cost: 1.79, protein: null },
      { id: 'g13', name: 'Apples or Grapes — on sale',  note: 'Snack rotation',                 cost: 3.50, protein: null },
    ]
  },
  {
    category: 'FROZEN & PANTRY',
    items: [
      { id: 'g14', name: 'Frozen Broccoli — 2 bags',              note: 'Stir-fry Thu, microwave sides any night',      cost: 4.00, protein: null },
      { id: 'g15', name: 'Canned Black Beans — x2',               note: 'Cheap protein/fiber add to tacos or bowls',    cost: 1.50, protein: '~7g per ½ cup' },
      { id: 'g16', name: 'Shredded Cheddar or Mexican Blend',     note: 'Tacos, eggs, versatile topper',                cost: 3.00, protein: null },
    ]
  },
  {
    category: 'PANTRY STAPLES',
    staples: true,
    items: [
      { id: 'g17', name: 'Olive Oil — 500ml',  note: 'Roasting, air frying, cast iron', cost: 4.99, protein: null },
      { id: 'g18', name: 'Garlic Powder',      note: 'Season everything',               cost: 1.99, protein: null },
      { id: 'g19', name: 'Paprika',            note: 'Chicken rub, potatoes',           cost: 1.99, protein: null },
      { id: 'g20', name: 'Onion Powder',       note: 'Ground beef, stir-fry',           cost: 1.99, protein: null },
      { id: 'g21', name: 'Salt & Pepper',      note: 'Every single meal',               cost: 2.50, protein: null },
      { id: 'g22', name: 'Soy Sauce',          note: 'Stir-fry Thu, marinade for steak', cost: 1.99, protein: null },
      { id: 'g23', name: 'Salsa — jar',        note: 'Tacos Mon, eggs, versatile',      cost: 2.49, protein: null },
    ]
  }
]

export const BUDGET_TARGET = 100
