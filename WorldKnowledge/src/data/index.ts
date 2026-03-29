/**
 * World Knowledge Engine — 国データ統合インデックス
 *
 * 1国1ファイルの国データを統合し、
 * presenceScoreの降順でソートした全国リストを提供する。
 * アプリ全体でこのモジュール経由で国データにアクセスする。
 */

import { CountryData } from '../types';

// === 全国データのインポート ===
import { AD } from './countries/AD';
import { AE } from './countries/AE';
import { AF } from './countries/AF';
import { AG } from './countries/AG';
import { AL } from './countries/AL';
import { AM } from './countries/AM';
import { AO } from './countries/AO';
import { AR } from './countries/AR';
import { AT } from './countries/AT';
import { AU } from './countries/AU';
import { AZ } from './countries/AZ';
import { BA } from './countries/BA';
import { BB } from './countries/BB';
import { BD } from './countries/BD';
import { BE } from './countries/BE';
import { BF } from './countries/BF';
import { BG } from './countries/BG';
import { BH } from './countries/BH';
import { BI } from './countries/BI';
import { BJ } from './countries/BJ';
import { BN } from './countries/BN';
import { BO } from './countries/BO';
import { BR } from './countries/BR';
import { BS } from './countries/BS';
import { BT } from './countries/BT';
import { BW } from './countries/BW';
import { BY } from './countries/BY';
import { BZ } from './countries/BZ';
import { CA } from './countries/CA';
import { CD } from './countries/CD';
import { CF } from './countries/CF';
import { CG } from './countries/CG';
import { CH } from './countries/CH';
import { CI } from './countries/CI';
import { CL } from './countries/CL';
import { CM } from './countries/CM';
import { CN } from './countries/CN';
import { CO } from './countries/CO';
import { CR } from './countries/CR';
import { CU } from './countries/CU';
import { CV } from './countries/CV';
import { CY } from './countries/CY';
import { CZ } from './countries/CZ';
import { DE } from './countries/DE';
import { DJ } from './countries/DJ';
import { DK } from './countries/DK';
import { DM } from './countries/DM';
import { DO } from './countries/DO';
import { DZ } from './countries/DZ';
import { EC } from './countries/EC';
import { EE } from './countries/EE';
import { EG } from './countries/EG';
import { ER } from './countries/ER';
import { ES } from './countries/ES';
import { ET } from './countries/ET';
import { FI } from './countries/FI';
import { FJ } from './countries/FJ';
import { FM } from './countries/FM';
import { FR } from './countries/FR';
import { GA } from './countries/GA';
import { GB } from './countries/GB';
import { GD } from './countries/GD';
import { GE } from './countries/GE';
import { GH } from './countries/GH';
import { GM } from './countries/GM';
import { GN } from './countries/GN';
import { GQ } from './countries/GQ';
import { GR } from './countries/GR';
import { GT } from './countries/GT';
import { GW } from './countries/GW';
import { GY } from './countries/GY';
import { HN } from './countries/HN';
import { HR } from './countries/HR';
import { HT } from './countries/HT';
import { HU } from './countries/HU';
import { ID } from './countries/ID';
import { IE } from './countries/IE';
import { IL } from './countries/IL';
import { IN } from './countries/IN';
import { IQ } from './countries/IQ';
import { IR } from './countries/IR';
import { IS } from './countries/IS';
import { IT } from './countries/IT';
import { JM } from './countries/JM';
import { JO } from './countries/JO';
import { JP } from './countries/JP';
import { KE } from './countries/KE';
import { KG } from './countries/KG';
import { KH } from './countries/KH';
import { KI } from './countries/KI';
import { KM } from './countries/KM';
import { KN } from './countries/KN';
import { KP } from './countries/KP';
import { KR } from './countries/KR';
import { KW } from './countries/KW';
import { KZ } from './countries/KZ';
import { LA } from './countries/LA';
import { LB } from './countries/LB';
import { LC } from './countries/LC';
import { LI } from './countries/LI';
import { LK } from './countries/LK';
import { LR } from './countries/LR';
import { LS } from './countries/LS';
import { LT } from './countries/LT';
import { LU } from './countries/LU';
import { LV } from './countries/LV';
import { LY } from './countries/LY';
import { MA } from './countries/MA';
import { MC } from './countries/MC';
import { MD } from './countries/MD';
import { ME } from './countries/ME';
import { MG } from './countries/MG';
import { MH } from './countries/MH';
import { MK } from './countries/MK';
import { ML } from './countries/ML';
import { MM } from './countries/MM';
import { MN } from './countries/MN';
import { MR } from './countries/MR';
import { MT } from './countries/MT';
import { MU } from './countries/MU';
import { MV } from './countries/MV';
import { MW } from './countries/MW';
import { MX } from './countries/MX';
import { MY } from './countries/MY';
import { MZ } from './countries/MZ';
import { NA } from './countries/NA';
import { NE } from './countries/NE';
import { NG } from './countries/NG';
import { NI } from './countries/NI';
import { NL } from './countries/NL';
import { NO } from './countries/NO';
import { NP } from './countries/NP';
import { NR } from './countries/NR';
import { NZ } from './countries/NZ';
import { OM } from './countries/OM';
import { PA } from './countries/PA';
import { PE } from './countries/PE';
import { PG } from './countries/PG';
import { PH } from './countries/PH';
import { PK } from './countries/PK';
import { PL } from './countries/PL';
import { PT } from './countries/PT';
import { PW } from './countries/PW';
import { PY } from './countries/PY';
import { QA } from './countries/QA';
import { RO } from './countries/RO';
import { RS } from './countries/RS';
import { RU } from './countries/RU';
import { RW } from './countries/RW';
import { SA } from './countries/SA';
import { SB } from './countries/SB';
import { SC } from './countries/SC';
import { SD } from './countries/SD';
import { SE } from './countries/SE';
import { SG } from './countries/SG';
import { SI } from './countries/SI';
import { SK } from './countries/SK';
import { SL } from './countries/SL';
import { SM } from './countries/SM';
import { SN } from './countries/SN';
import { SO } from './countries/SO';
import { SR } from './countries/SR';
import { SS } from './countries/SS';
import { ST } from './countries/ST';
import { SV } from './countries/SV';
import { SY } from './countries/SY';
import { SZ } from './countries/SZ';
import { TD } from './countries/TD';
import { TG } from './countries/TG';
import { TH } from './countries/TH';
import { TJ } from './countries/TJ';
import { TL } from './countries/TL';
import { TM } from './countries/TM';
import { TN } from './countries/TN';
import { TO } from './countries/TO';
import { TR } from './countries/TR';
import { TT } from './countries/TT';
import { TV } from './countries/TV';
import { TZ } from './countries/TZ';
import { UA } from './countries/UA';
import { UG } from './countries/UG';
import { US } from './countries/US';
import { UY } from './countries/UY';
import { UZ } from './countries/UZ';
import { VA } from './countries/VA';
import { VC } from './countries/VC';
import { VE } from './countries/VE';
import { VN } from './countries/VN';
import { VU } from './countries/VU';
import { WS } from './countries/WS';
import { YE } from './countries/YE';
import { ZA } from './countries/ZA';
import { ZM } from './countries/ZM';
import { ZW } from './countries/ZW';

/** 全国データ配列 */
const ALL_COUNTRY_DATA: CountryData[] = [
  AD,
  AE,
  AF,
  AG,
  AL,
  AM,
  AO,
  AR,
  AT,
  AU,
  AZ,
  BA,
  BB,
  BD,
  BE,
  BF,
  BG,
  BH,
  BI,
  BJ,
  BN,
  BO,
  BR,
  BS,
  BT,
  BW,
  BY,
  BZ,
  CA,
  CD,
  CF,
  CG,
  CH,
  CI,
  CL,
  CM,
  CN,
  CO,
  CR,
  CU,
  CV,
  CY,
  CZ,
  DE,
  DJ,
  DK,
  DM,
  DO,
  DZ,
  EC,
  EE,
  EG,
  ER,
  ES,
  ET,
  FI,
  FJ,
  FM,
  FR,
  GA,
  GB,
  GD,
  GE,
  GH,
  GM,
  GN,
  GQ,
  GR,
  GT,
  GW,
  GY,
  HN,
  HR,
  HT,
  HU,
  ID,
  IE,
  IL,
  IN,
  IQ,
  IR,
  IS,
  IT,
  JM,
  JO,
  JP,
  KE,
  KG,
  KH,
  KI,
  KM,
  KN,
  KP,
  KR,
  KW,
  KZ,
  LA,
  LB,
  LC,
  LI,
  LK,
  LR,
  LS,
  LT,
  LU,
  LV,
  LY,
  MA,
  MC,
  MD,
  ME,
  MG,
  MH,
  MK,
  ML,
  MM,
  MN,
  MR,
  MT,
  MU,
  MV,
  MW,
  MX,
  MY,
  MZ,
  NA,
  NE,
  NG,
  NI,
  NL,
  NO,
  NP,
  NR,
  NZ,
  OM,
  PA,
  PE,
  PG,
  PH,
  PK,
  PL,
  PT,
  PW,
  PY,
  QA,
  RO,
  RS,
  RU,
  RW,
  SA,
  SB,
  SC,
  SD,
  SE,
  SG,
  SI,
  SK,
  SL,
  SM,
  SN,
  SO,
  SR,
  SS,
  ST,
  SV,
  SY,
  SZ,
  TD,
  TG,
  TH,
  TJ,
  TL,
  TM,
  TN,
  TO,
  TR,
  TT,
  TV,
  TZ,
  UA,
  UG,
  US,
  UY,
  UZ,
  VA,
  VC,
  VE,
  VN,
  VU,
  WS,
  YE,
  ZA,
  ZM,
  ZW
];

/** キャッシュ済みソート結果 */
let _sorted: CountryData[] | null = null;

/** 全国データを取得する（presenceScore降順） */
export function getAllCountries(): CountryData[] {
  if (!_sorted) {
    _sorted = [...ALL_COUNTRY_DATA].sort((a, b) => b.presenceScore - a.presenceScore);
  }
  return _sorted;
}

/** 国IDから国データを検索する */
export function getCountryById(id: string): CountryData | undefined {
  return getAllCountries().find(c => c.id === id);
}

/** 地域別の国リストを取得する */
export function getCountriesByRegion(regionId: string): CountryData[] {
  return getAllCountries().filter(c => c.region === regionId);
}

/** 全国数を取得する */
export function getTotalCountryCount(): number {
  return getAllCountries().length;
}
