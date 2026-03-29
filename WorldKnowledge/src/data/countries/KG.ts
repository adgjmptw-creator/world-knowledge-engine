/**
 * キルギスタン（Kyrgyzstan）
 */
import { country } from '../countryFactory';

export const KG = country(
  'KG', 'Kyrgyzstan',
  ['Kyrgyzstan', '吉尔吉斯斯坦', '吉爾吉斯斯坦', 'किर्गिज़स्तान', 'Kirguistán', 'Quirguistão', 'Kyrgyzstan', 'キルギスタン', 'قيرغيزستان', 'Kirghizistan', 'Kirgisistan', '키르기스스탄', 'Kırgızistan', 'Кыргызстан'],
  'きるぎすたん', '🇰🇬', 'central_asia', 3,
  'Bishkek',
  ['Bishkek', '比什凯克', '比什凱克', 'बिश्केक', 'Biskek', 'Bishkek', 'Bishkek', 'ビシュケク', 'بيشكيك', 'Bichkek', 'Bischkek', '비슈케크', 'Bişkek', 'Бишкек'],
  {
    en: [
      'Kyrgyzstan has beautiful mountain lakes, and the biggest one, Issyk-Kul, is so large it never freezes even in winter.',
      'The Epic of Manas is a very long and famous story from Kyrgyzstan, so long it would take weeks to read the whole thing aloud.',
    ],
    'zh-CN': ['吉尔吉斯斯坦有美丽的山中湖泊，其中最大的伊塞克湖非常大，就算在冬天也不会结冰。', '《玛纳斯史诗》是吉尔吉斯斯坦非常著名的长篇故事，长得要花好几个星期才能大声读完。'],
    'zh-TW': ['吉爾吉斯斯坦有美麗的山中湖泊，其中最大的伊塞克湖非常大，就算在冬天也不會結冰。', '《瑪納斯史詩》是吉爾吉斯斯坦非常著名的長篇故事，長得要花好幾個星期才能大聲讀完。'],
    hi: ['किर्गिज़स्तान में खूबसूरत पहाड़ी झीलें हैं, और सबसे बड़ी झील इस्सिक-कुल इतनी बड़ी है कि सर्दियों में भी कभी जमती नहीं।', 'मानस महाकाव्य किर्गिज़स्तान की एक बहुत लंबी और मशहूर कहानी है, इतनी लंबी कि इसे पूरा जोर से पढ़ने में हफ्तों लग जाएंगे।'],
    es: ['Kirguistán tiene hermosos lagos de montaña, y el más grande, Issyk-Kul, es tan grande que nunca se congela ni en invierno.', 'La Epopeya de Manas es una historia muy larga y famosa de Kirguistán, tan larga que llevaría semanas leerla en voz alta completa.'],
    'pt-BR': ['O Quirguistão tem belos lagos de montanha, e o maior deles, Issyk-Kul, é tão grande que nunca congela mesmo no inverno.', 'A Epopeia de Manas é uma história muito longa e famosa do Quirguistão, tão longa que levaria semanas para ser lida em voz alta.'],
    id: ['Kyrgyzstan memiliki danau-danau pegunungan yang indah, dan yang terbesar, Issyk-Kul, sangat besar sehingga tidak pernah membeku meski di musim dingin.', 'Epik Manas adalah cerita yang sangat panjang dan terkenal dari Kyrgyzstan, begitu panjang sehingga butuh berminggu-minggu untuk membacanya dengan keras.'],
    ja: [
      'キルギスタンには美(うつく)しい山(やま)の湖(みずうみ)がたくさんあり、一番(いちばん)大(おお)きなイシク・クル湖(こ)は冬(ふゆ)でも凍(こお)りません。',
      'マナス叙事詩(じょじし)はキルギスタンのとても長(なが)くて有名(ゆうめい)なお話(はなし)で、全部(ぜんぶ)声(こえ)に出(だ)して読(よ)むと何週間(なんしゅうかん)もかかります。',
    ],
    ar: ['تمتلك قيرغيزستان بحيرات جبلية جميلة، وأكبرها إيسيك كول كبيرة جداً لدرجة أنها لا تتجمد حتى في الشتاء.', 'ملحمة ماناس قصة طويلة جداً ومشهورة من قيرغيزستان، وهي طويلة لدرجة أن قراءتها بصوت عالٍ تستغرق أسابيع.'],
    fr: ['Le Kirghizistan possède de beaux lacs de montagne, et le plus grand, l\'Issyk-Koul, est si vaste qu\'il ne gèle jamais même en hiver.', 'L\'Épopée de Manas est une très longue et célèbre histoire du Kirghizistan, si longue qu\'il faudrait des semaines pour la lire à voix haute en entier.'],
    de: ['Kirgisistan hat wunderschöne Gebirgsseen, und der größte, der Issyk-Kul, ist so groß, dass er selbst im Winter nie zufriert.', 'Das Epos von Manas ist eine sehr lange und berühmte Geschichte aus Kirgisistan, so lang, dass es Wochen dauern würde, sie laut vorzulesen.'],
    ko: ['키르기스스탄에는 아름다운 산속 호수들이 있고, 가장 큰 이식쿨 호수는 너무 커서 겨울에도 얼지 않아요.', '마나스 서사시는 키르기스스탄의 매우 길고 유명한 이야기로, 전부 소리 내어 읽으려면 몇 주가 걸릴 정도예요.'],
    tr: ['Kırgızistan\'ın güzel dağ gölleri var ve en büyüğü olan Issık Göl, kışın bile hiç donmayacak kadar büyük.', 'Manas Destanı, Kırgızistan\'dan gelen çok uzun ve ünlü bir hikayedir; o kadar uzun ki tamamını sesli okumak haftalar alır.'],
    ru: ['В Кыргызстане есть красивые горные озёра, а самое большое из них — Иссык-Куль — такое большое, что не замерзает даже зимой.', 'Эпос «Манас» — очень длинная и знаменитая история из Кыргызстана, настолько длинная, что на её чтение вслух ушли бы недели.'],
  }
);
