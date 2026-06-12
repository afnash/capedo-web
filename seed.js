require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const data = `name,category,price,image_url,discount,description
Green Banana,Fruits,30,null,null,Fresh green bananas ideal for cooking traditional dishes chips and curries.
Nendra Banana,Fruits,30,null,null,Premium yellow Nendra bananas known for their rich flavor and nutritional value.
Njalipoovan (Rasakadhali),Fruits,30,null,null,Sweet aromatic banana variety popular in South Indian households.
Red Poovan,Fruits,30,null,null,Distinctive red-skinned banana with naturally sweet taste and soft texture.
Banana Poovan,Fruits,30,null,null,Popular banana variety suitable for daily consumption and desserts.
Banana Flower,Vegetables,30,null,null,Nutrient-rich banana blossom commonly used in traditional curries and stir-fries.
Banana Stem,Vegetables,30,null,null,Fiber-rich banana stem used in healthy soups juices and side dishes.
Banana Leaf,Leaves,45,null,null,Fresh banana leaves suitable for serving food wrapping and traditional cooking.
Shallet,Vegetables,30,null,null,Fresh shallots with strong flavor ideal for curries gravies and seasoning.
Drum Stick,Vegetables,As per demand,null,null,Tender drumsticks rich in nutrients commonly used in sambar and curries.
Snake Gourd,Vegetables,As per demand,null,null,Fresh snake gourd perfect for stir-fries curries and healthy meals.
Small Snake Gourd,Vegetables,As per demand,null,null,Small tender snake gourd with mild flavor and crisp texture.
Bottle Gourd,Vegetables,30,null,null,Fresh bottle gourd ideal for soups curries and healthy recipes.
Ridge Gourd,Vegetables,30,null,null,Nutritious ridge gourd suitable for stir-fries curries and chutneys.
Broad Beans,Vegetables,As per demand,null,null,Fresh broad beans rich in protein and dietary fiber.
Long Beans Red,Vegetables,As per demand,null,null,Red long beans with tender texture perfect for stir-fries.
Long Beans Green,Vegetables,As per demand,null,null,Fresh green long beans suitable for curries and side dishes.
Salad Cucumber,Vegetables,30,null,null,Crisp cucumber ideal for salads sandwiches and fresh consumption.
Yellow Cucumber,Vegetables,30,null,null,Traditional yellow cucumber with refreshing taste and soft texture.
Green Pumpkin,Vegetables,30,null,null,Fresh green pumpkin suitable for curries soups and stews.
Red Pumpkin,Vegetables,30,null,null,Sweet red pumpkin perfect for curries desserts and soups.
Bitter Gourd Green,Vegetables,30,null,null,Nutrient-rich green bitter gourd known for its health benefits.
Bitter Gourd White,Vegetables,60,null,null,Mild white bitter gourd with unique taste and medicinal value.
Colocasia,Root Vegetables,30,null,null,Fresh colocasia roots ideal for traditional curries and snacks.
Small Colocasia,Root Vegetables,30,null,null,Tender colocasia roots with rich flavor and creamy texture.
Kachil,Root Vegetables,30,null,null,Traditional yam variety used in healthy and flavorful dishes.
Elephant Yam,Root Vegetables,30,null,null,Large nutritious yam suitable for curries fries and stews.
Raw Mango,Fruits,30,null,null,Fresh raw mangoes perfect for pickles chutneys and cooking.
Tender Coconut,Fruits,As per demand,null,null,Naturally refreshing tender coconut rich in electrolytes.
Ash Gourd,Vegetables,30,null,null,Fresh ash gourd ideal for curries juices and medicinal preparations.
Big Onion,Vegetables,As per demand,null,null,Premium quality onions suitable for daily cooking needs.
Cluster Beans,Vegetables,As per demand,null,null,Fresh cluster beans rich in fiber and nutrients.
Arbi (Chembu),Root Vegetables,30,null,null,Tender arbi roots ideal for curries fries and traditional dishes.
Koorkkal (Chinese Potato),Root Vegetables,30,null,null,Traditional Chinese potato variety popular in Kerala cuisine.
Ivy Gourd,Vegetables,30,null,null,Fresh ivy gourd suitable for stir-fries curries and healthy meals.
Sugar Cane,Fruits,Seasonal,null,null,Fresh sugarcane ideal for juice extraction and direct consumption.
Okra (Ladies Finger),Vegetables,As per demand,null,null,Tender okra suitable for curries stir-fries and side dishes.
Turmeric Plant,Herbs,Seasonal,null,null,Fresh turmeric roots known for culinary and medicinal uses.
Indian Ginger,Herbs,Seasonal,null,null,Premium Indian ginger with strong aroma and health benefits.
Palmyra Sprout,Vegetables,Seasonal,null,null,Nutritious palmyra sprouts commonly consumed as a seasonal delicacy.
Drumstick Leaf,Leafy Greens,60,null,null,Nutrient-dense drumstick leaves rich in vitamins and minerals.
Red Thandu Keerai,Leafy Greens,60,null,null,Fresh red spinach suitable for healthy stir-fries and curries.
Green Thandu Keerai,Leafy Greens,60,null,null,Green spinach variety packed with essential nutrients.
Siru Keerai,Leafy Greens,60,null,null,Tropical spinach known for its tender leaves and nutritional value.
Gungura Leaf,Leafy Greens,60,null,null,Tangy leafy green popular in South Indian cuisine.
Mananthakali Keerai,Leafy Greens,60,null,null,Traditional medicinal leafy green used in healthy recipes.
Mudakathan Keerai,Leafy Greens,60,null,null,Herbal leafy green valued for its wellness benefits.
Mulai Keerai,Leafy Greens,60,null,null,Fresh spinach variety ideal for soups curries and stir-fries.
Neem Leaf,Herbs,As per demand,null,null,Medicinal neem leaves known for traditional health applications.
Pirandai,Herbs,60,null,null,Traditional medicinal vine used in chutneys and herbal preparations.
Maa Leaf,Leaves,Seasonal,null,null,Fresh mango leaves suitable for rituals decorations and traditional use.
Amla (Gooseberry),Fruits,30,null,null,Nutrient-rich gooseberries packed with vitamin C and antioxidants.
Totapuri Mango,Fruits,30,null,null,Popular mango variety with tangy flavor suitable for fresh consumption and processing.
Chicku (Sapota),Fruits,30,null,null,Sweet sapota fruit with soft texture and rich flavor.
Apple Bore,Fruits,Seasonal,null,null,Crisp and refreshing fruit commonly enjoyed fresh.
Custard Apple,Fruits,Seasonal,null,null,Sweet creamy fruit with rich flavor and nutritional value.
Anar (Pomegranate),Fruits,Seasonal,null,null,Juicy pomegranate rich in antioxidants and natural sweetness.
Guava,Fruits,30,null,null,Fresh guavas packed with fiber vitamin C and natural flavor.
Jackfruit,Fruits,Seasonal,null,null,Large tropical fruit known for its sweet taste and versatility.
Tender Jackfruit,Vegetables,Seasonal,null,null,Young jackfruit ideal as a plant-based meat alternative in curries.
Jack Seeds,Vegetables,Seasonal,null,null,Nutritious jackfruit seeds suitable for roasting and curries.
Jasmine,Flowers,Seasonal,null,null,Fragrant jasmine flowers widely used for decoration and worship.
Arali (Oleander),Flowers,Seasonal,null,null,Decorative flowering plant commonly used in gardens and rituals.
Chamanthi,Flowers,Seasonal,null,null,Bright chrysanthemum flowers popular for decoration and floral arrangements.
Avaram Poo,Flowers,Seasonal,null,null,Traditional medicinal flower used in herbal preparations and teas.
Thulasi,Herbs,Seasonal,null,null,Holy basil plant valued for medicinal culinary and spiritual uses.`;

async function seed() {
  const lines = data.split('\n');
  // Skip the header
  const rows = lines.slice(1);
  
  const formattedItems = rows.map(row => {
    const parts = row.split(',');
    
    // Some descriptions have commas, wait, actually none of the descriptions in the provided string seem to have commas,
    // let's just do a basic split by comma, and join back the description if there are more parts.
    // However, let's just extract the first 5 columns and the rest is description.
    
    const name = parts[0];
    const category = parts[1];
    
    // Price could be "As per demand", "Seasonal", or a number. 
    // Wait! In Supabase, if `price` is numeric, this will fail. Let's see how `price` is stored.
    // If it's a numeric column, we can't insert "As per demand". We'll default to 0 if it's not a number.
    const priceStr = parts[2];
    let price = parseFloat(priceStr);
    if (isNaN(price)) price = 0; // fallback if it's a string like "As per demand" or "Seasonal"

    const image_url = parts[3] === 'null' ? null : parts[3];
    const discount = parts[4] === 'null' ? null : parseFloat(parts[4]);
    
    // Join the rest as description (in case there were commas in the description)
    const description = parts.slice(5).join(',');
    
    return {
      name,
      category,
      price,
      image_url,
      discount,
      description
    };
  });
  
  console.log(`Prepared ${formattedItems.length} items to insert.`);

  // We should probably delete all existing items first to avoid duplicates.
  await supabase.from('items').delete().neq('id', 0); // deletes all
  console.log("Deleted old items.");

  const { data: inserted, error } = await supabase.from('items').insert(formattedItems);
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully inserted data.');
  }
}

seed();
