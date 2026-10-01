/* Real, supplied artwork — never regenerate. Vite resolves each import to a URL. */
import bg from './scenes/scene01-bg.jpg';
import rupi from './characters/rupi-scene01.webp';
import robot from './characters/robot-scene01.webp';
import coin from './scenes/scene01-coin.webp';
import air1 from './scenes/airship-1.webp';
import air2 from './scenes/airship-2.webp';
import home from './scenes/home-world.jpg';
import hrupi from './characters/rupi-home.webp';
import s2bg from './scenes/s02-market.jpg';
import s2farmer from './characters/s02-farmer.webp';
import s2milk from './characters/s02-milkseller.webp';
import s2kids from './characters/s02-kids.webp';
import s3bg from './scenes/s03-market.jpg';
import s3farmer from './characters/s03-farmer.webp';
import s3milk from './characters/s03-milkseller.webp';
import s3kids from './characters/s03-kids.webp';
import s3bot2 from './characters/s03-robot.webp';
import p5bg from './environments/village-market.jpg';
import p6can from './scenes/milk-can.webp';
import p6wheat from './scenes/wheat.jpg';
import card01 from './scenes/card-01.jpg';
import card02 from './scenes/card-02.jpg';
import card03 from './scenes/card-03.jpg';
import card04 from './scenes/card-04.jpg';
import card05 from './scenes/card-05.jpg';
import card06 from './scenes/card-06.jpg';
import card07 from './scenes/card-07.jpg';
import card08 from './scenes/card-08.jpg';
import card09 from './scenes/card-09.jpg';
import card10 from './scenes/card-10.jpg';
import card11 from './scenes/card-11.jpg';
import card12 from './scenes/card-12.jpg';
import card13 from './scenes/card-13.jpg';
import card14 from './scenes/card-14.jpg';
import card15 from './scenes/card-15.jpg';
import card16 from './scenes/card-16.jpg';
import card17 from './scenes/card-17.jpg';
import card18 from './scenes/card-18.jpg';
import coin1F from './currency/coins/rupee-1-front.webp';
import coin1B from './currency/coins/rupee-1-back.webp';
import coin2F from './currency/coins/rupee-2-front.webp';
import coin2B from './currency/coins/rupee-2-back.webp';
import coin5F from './currency/coins/rupee-5-front.webp';
import coin5B from './currency/coins/rupee-5-back.webp';
import coin10F from './currency/coins/rupee-10-front.webp';
import coin10B from './currency/coins/rupee-10-back.webp';
import coin20F from './currency/coins/coin-20-front.webp';   /* supplied ₹20 reference: silver ring, gold centre */
import coin20B from './currency/coins/coin-20-back.webp';
import note10F from './currency/notes/rupee-10-front.jpg';
import note10B from './currency/notes/rupee-10-back.jpg';
import note20F from './currency/notes/rupee-20-front.jpg';
import note20B from './currency/notes/rupee-20-back.jpg';
import note50F from './currency/notes/rupee-50-front.jpg';
import note50B from './currency/notes/rupee-50-back.jpg';
import note100F from './currency/notes/rupee-100-front.jpg';
import note100B from './currency/notes/rupee-100-back.jpg';
import note200F from './currency/notes/rupee-200-front.jpg';
import note200B from './currency/notes/rupee-200-back.jpg';
import note500F from './currency/notes/rupee-500-front.jpg';
import note500B from './currency/notes/rupee-500-back.jpg';
import ch_rupi from './characters/rupi.webp';
import ch_robot from './characters/robot.webp';
import ch_boy from './characters/boy.webp';
import ch_girl from './characters/girl.webp';
import ch_farmer from './characters/farmer.webp';
import ch_milk from './characters/milk.webp';
import env_world from './environments/world.jpg';
import env_market from './environments/market.jpg';
import env_shop from './environments/shop.jpg';
import env_supermarket from './environments/supermarket.jpg';
import env_canteen from './environments/canteen.jpg';
import env_farm from './environments/farm.jpg';
import env_village from './environments/village.jpg';
import env_cointable from './environments/cointable.jpg';
import env_notedisplay from './environments/notedisplay.jpg';
import env_gamearea from './environments/gamearea.jpg';
import env_classroom from './environments/classroom.jpg';
import env_celebration from './environments/celebration.jpg';

const A = {
  BG: bg,
  RUPI: rupi,
  ROBOT: robot,
  COIN: coin,
  AIR1: air1,
  AIR2: air2,
  HOME: home,
  HRUPI: hrupi,
  S2BG: s2bg,
  S2FARMER: s2farmer,
  S2MILK: s2milk,
  S2KIDS: s2kids,
  S3BG: s3bg,
  S3FARMER: s3farmer,
  S3MILK: s3milk,
  S3KIDS: s3kids,
  S3BOT2: s3bot2,
  P5BG: p5bg,
  P6CAN: p6can,
  P6WHEAT: p6wheat,
  THUMBS: [card01, card02, card03, card04, card05, card06, card07, card08, card09, card10, card11, card12, card13, card14, card15, card16, card17, card18],
  COINF: [coin1F, coin2F, coin5F, coin10F, coin20F],
  COINB: [coin1B, coin2B, coin5B, coin10B, coin20B],
  NOTEF: [note10F, note20F, note50F, note100F, note200F, note500F],
  NOTEB: [note10B, note20B, note50B, note100B, note200B, note500B],
  CH: { rupi: ch_rupi, robot: ch_robot, boy: ch_boy, girl: ch_girl, farmer: ch_farmer, milk: ch_milk },
  ENV: { world: env_world, market: env_market, shop: env_shop, supermarket: env_supermarket, canteen: env_canteen, farm: env_farm, village: env_village, cointable: env_cointable, notedisplay: env_notedisplay, gamearea: env_gamearea, classroom: env_classroom, celebration: env_celebration },
};
export default A;

export { A };
