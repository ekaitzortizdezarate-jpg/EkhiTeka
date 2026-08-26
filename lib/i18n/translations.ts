export type Language = 'eu' | 'es' | 'en' | 'fr';

export interface TranslationDict {
  brand_name: string;
  brand_tagline: string;
  brand_subtitle: string;
  top_refrigerated_shipping: string;
  top_custom_orders: string;
  top_store_pickup: string;

  // Nav
  nav_shop: string;
  nav_cart: string;
  nav_orders: string;
  nav_my_products: string;
  nav_chats: string;
  nav_admin: string;
  nav_login: string;
  nav_register: string;
  nav_profile: string;
  nav_logout: string;
  nav_gourmet_gifts: string;
  nav_gourmet_gifts_line1: string;
  nav_gourmet_gifts_line2: string;
  nav_tastings_experiences: string;
  nav_tastings_line1: string;
  nav_tastings_line2: string;
  nav_corporate_gifts: string;
  nav_corporate_line1: string;
  nav_corporate_line2: string;
  nav_events: string;
  nav_add_product: string;
  nav_add_product_line1: string;
  nav_add_product_line2: string;
  nav_explore_selection: string;
  nav_your_account: string;

  // Categories & Grid
  cat_all: string;
  cat_queso: string;
  cat_atun: string;
  cat_salazon: string;
  cat_jildas: string;
  cat_cerveza: string;
  cat_txakoli: string;
  cat_sidra: string;
  cat_new_badge: string;
  cat_explore: string;
  cat_section_title: string;
  sub_quesos: string;
  sub_atun: string;
  sub_salazones: string;
  sub_gildas: string;
  sub_cerveza: string;
  sub_txakoli: string;
  sub_sidra: string;

  // Product Card & Details
  prod_price: string;
  prod_unit: string;
  prod_kg: string;
  prod_pack: string;
  prod_bottle: string;
  prod_can: string;
  prod_jar: string;
  prod_origin: string;
  prod_stock: string;
  prod_unlimited: string;
  prod_add_to_cart: string;
  prod_added: string;
  prod_ask_artisan: string;
  prod_consult_product: string;
  prod_details: string;
  prod_search_placeholder: string;
  prod_no_results: string;
  prod_sort_by: string;
  prod_sort_name_asc: string;
  prod_sort_name_desc: string;
  prod_sort_price_asc: string;
  prod_sort_price_desc: string;
  prod_showing: string;
  prod_sold_out: string;
  prod_last_units: string;
  prod_available: string;
  prod_availability: string;
  prod_format_label: string;
  prod_weight_label: string;
  prod_price_per_seat: string;
  prod_vat_included: string;
  prod_doubt_title: string;
  prod_doubt_desc: string;
  prod_ask_btn: string;
  prod_guarantee_cold: string;
  prod_guarantee_pickup: string;
  prod_guarantee_km0: string;
  prod_related_subtitle: string;
  prod_related_title: string;
  prod_back_to_selection: string;

  // Events & Tastings
  event_seats: string;
  event_seat: string;
  event_seats_available: string;
  event_capacity_full: string;
  event_last_seats: string;
  event_reserve_seat: string;
  event_seats_added: string;
  event_upcoming_title: string;
  event_upcoming_subtitle: string;
  event_catalog_title: string;
  event_catalog_subtitle: string;
  event_home_catalog_title: string;
  event_home_catalog_subtitle: string;
  event_store_catalog_title: string;
  event_store_catalog_subtitle: string;

  // Home Pillars & Banners
  home_hero_badge: string;
  home_hero_title: string;
  home_hero_subtitle: string;
  home_hero_desc: string;
  home_explore_btn: string;
  home_gourmet_gifts_btn: string;
  home_pillars_badge: string;
  home_pillars_title: string;
  home_pillars_desc: string;
  home_card1_badge: string;
  home_card1_sub: string;
  home_card1_title: string;
  home_card1_desc: string;
  home_card1_btn: string;
  home_card2_badge: string;
  home_card2_sub: string;
  home_card2_title: string;
  home_card2_desc: string;
  home_card2_btn: string;
  home_card3_badge: string;
  home_card3_sub: string;
  home_card3_title: string;
  home_card3_desc: string;
  home_card3_btn: string;
  home_card4_badge: string;
  home_card4_sub: string;
  home_card4_title: string;
  home_card4_desc: string;
  home_card4_btn: string;

  // Experience Banners (Home)
  exp_banner_badge: string;
  exp_banner_title: string;
  exp_b1_title: string;
  exp_b1_desc: string;
  exp_b1_btn: string;
  exp_b2_title: string;
  exp_b2_desc: string;
  exp_b2_btn: string;
  exp_b3_title: string;
  exp_b3_desc: string;
  exp_b3_btn: string;

  // Experiences Page (Cards & Banners)
  exp_hero_badge: string;
  exp_hero_title: string;
  exp_hero_title_highlight: string;
  exp_hero_desc: string;
  exp_home_tasting_title: string;
  exp_home_tasting_badge: string;
  exp_home_tasting_desc: string;
  exp_home_tasting_btn: string;
  exp_store_tasting_title: string;
  exp_store_tasting_badge: string;
  exp_store_tasting_desc: string;
  exp_store_tasting_btn: string;
  exp_wedding_title: string;
  exp_wedding_badge: string;
  exp_wedding_desc: string;
  exp_wedding_btn: string;
  exp_raclette_title: string;
  exp_raclette_badge: string;
  exp_raclette_desc: string;
  exp_raclette_btn: string;

  // Gourmet Gifts Page
  gifts_hero_badge: string;
  gifts_hero_title: string;
  gifts_hero_title_highlight: string;
  gifts_hero_desc: string;
  gifts_whatsapp_btn: string;
  gifts_card1_title: string;
  gifts_card1_desc: string;
  gifts_card1_feature: string;
  gifts_card2_title: string;
  gifts_card2_desc: string;
  gifts_card2_feature: string;
  gifts_card3_title: string;
  gifts_card3_desc: string;
  gifts_card3_feature: string;
  gifts_catalog_badge: string;
  gifts_catalog_title: string;

  // Corporate Gifts Page
  corp_hero_badge: string;
  corp_hero_title: string;
  corp_hero_title_highlight: string;
  corp_hero_desc: string;
  corp_whatsapp_btn: string;
  corp_card1_title: string;
  corp_card1_desc: string;
  corp_card2_title: string;
  corp_card2_desc: string;
  corp_card3_title: string;
  corp_card3_desc: string;
  corp_logistics_badge: string;
  corp_logistics_title: string;
  corp_logistics_desc: string;
  corp_logistics_feat1: string;
  corp_logistics_feat2: string;
  corp_logistics_feat3: string;

  // Customer Reviews
  reviews_badge: string;
  reviews_title: string;
  reviews_subtitle: string;
  reviews_verified_buyer: string;
  rev1_comment: string;
  rev1_date: string;
  rev2_comment: string;
  rev2_date: string;
  rev3_comment: string;
  rev3_date: string;

  // Cart & Checkout
  cart_title: string;
  cart_empty: string;
  cart_empty_sub: string;
  cart_explore_btn: string;
  cart_subtotal: string;
  cart_total: string;
  cart_checkout: string;
  cart_remove: string;
  cart_quantity: string;
  cart_continue_shopping: string;
  deliv_choose_mode: string;
  deliv_home: string;
  deliv_home_desc: string;
  deliv_store_pickup: string;
  deliv_store_pickup_desc: string;
  deliv_shipping_address: string;
  deliv_shipping_notes: string;
  deliv_pickup_time: string;
  deliv_pickup_address: string;
  deliv_confirm_order: string;
  deliv_order_success: string;
  deliv_order_success_desc: string;

  // Orders & Statuses
  orders_title: string;
  orders_title_seller: string;
  orders_subtitle_buyer: string;
  orders_subtitle_seller: string;
  orders_status: string;
  orders_pending: string;
  orders_confirmed: string;
  orders_preparing: string;
  orders_ready_delivery: string;
  orders_delivered: string;
  orders_cancelled: string;
  orders_change_status: string;
  orders_cancel_order: string;
  orders_cancel_reason: string;
  orders_chat_with_buyer: string;
  orders_chat_with_seller: string;
  orders_no_orders: string;
  orders_no_orders_seller: string;
  orders_no_orders_seller_sub: string;
  orders_products_label: string;
  orders_products_to_prepare: string;
  orders_purchase_date: string;
  orders_date_time: string;
  orders_order_number: string;
  orders_total_to_charge: string;
  orders_new_status: string;
  orders_mark_seen: string;
  orders_client_label: string;
  orders_qty_label: string;

  status_confirm: string;
  status_preparing: string;
  status_ready: string;
  status_delivered: string;

  // Seller Dashboard
  seller_new_product: string;
  seller_edit_product: string;
  seller_product_name: string;
  seller_product_desc: string;
  seller_product_price: string;
  seller_product_category: string;
  seller_product_format: string;
  seller_product_origin: string;
  seller_product_stock: string;
  seller_product_image: string;
  seller_save_product: string;
  seller_delete_product: string;
  seller_product_deleted: string;
  seller_events_title: string;
  seller_events_subtitle: string;
  seller_events_edit_btn: string;
  seller_events_reserved: string;
  seller_events_available: string;
  seller_events_collected: string;
  seller_events_attendees_title: string;
  seller_events_no_events: string;
  seller_events_no_events_desc: string;
  seller_events_col_buyer: string;
  seller_events_col_contact: string;
  seller_events_col_seats: string;
  seller_events_col_date: string;
  seller_events_col_total: string;
  seller_events_col_actions: string;

  // Chat
  chat_title: string;
  chat_type_message: string;
  chat_send: string;
  chat_about_product: string;
  chat_about_order: string;
  chat_no_messages: string;
  chat_conversations: string;

  // Roles & Auth
  role_buyer: string;
  role_seller: string;
  role_admin: string;
  auth_email: string;
  auth_password: string;
  auth_full_name: string;
  auth_phone: string;
  auth_town: string;
  auth_have_account: string;
  auth_no_account: string;

  // Legal & Cookies
  legal_terms: string;
  legal_privacy: string;
  legal_cookies: string;
  legal_notice: string;
  cookie_text: string;
  cookie_accept: string;
  cookie_reject: string;
  cookie_settings: string;

  // Footer
  footer_club_title: string;
  footer_club_subtitle: string;
  footer_club_desc: string;
  footer_join_whatsapp: string;
  footer_cheese_desc: string;
  footer_delivery_desc: string;
  footer_pickup_desc: string;
  footer_categories: string;
  footer_experiences: string;
  footer_legal: string;
  footer_schedule_title: string;
  footer_schedule_weekdays: string;
  footer_schedule_saturday: string;
  footer_copyright: string;
  footer_tagline: string;
  footer_exp_tasting: string;
  footer_exp_weddings: string;
  footer_exp_gifts: string;
  footer_exp_consult: string;

  // Shop Hero
  shop_specialty: string;
  shop_hero_title: string;
  shop_hero_desc: string;
  shop_see_cheeses: string;
  shop_whatsapp_orders: string;
  shop_visit_title: string;
  shop_visit_subtitle: string;
  shop_visit_desc: string;
  shop_visit_contact: string;

  // Common
  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_edit: string;
  common_back: string;
  common_loading: string;
  common_success: string;
  common_error: string;
  common_theme_light: string;
  common_theme_dark: string;
  common_theme_system: string;
  common_select_language: string;
}

export const LOCALE_MAP: Record<Language, string> = {
  eu: 'eu',
  es: 'es-ES',
  en: 'en-GB',
  fr: 'fr-FR',
};

export const translations: Record<Language, TranslationDict> = {
  eu: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Gourmet Denda & Artisau Produktuak',
    brand_subtitle: 'Gaztak, hegaluzea, gatzadurak, gildak, garagardo artisaua, txakolina eta sagardo hautatua.',
    top_refrigerated_shipping: 'Bidalpen hoztua 24/48h penintsulan',
    top_custom_orders: 'Eskari bereziak eta aholkularitza',
    top_store_pickup: 'Dendan jasotzeko aukera',

    nav_shop: 'Denda',
    nav_cart: 'Saskia',
    nav_orders: 'Eskaerak',
    nav_my_products: 'Nire Produktuak',
    nav_chats: 'Mezuak',
    nav_admin: 'Admin',
    nav_login: 'Hasi Saioa',
    nav_register: 'Erregistratu',
    nav_profile: 'Profila',
    nav_logout: 'Itxi Saioa',
    nav_gourmet_gifts: 'Opari Gourmetak',
    nav_gourmet_gifts_line1: 'Opari',
    nav_gourmet_gifts_line2: 'Gourmetak',
    nav_tastings_experiences: 'Dastaketak & Esperientziak',
    nav_tastings_line1: 'Dastaketak &',
    nav_tastings_line2: 'Esperientziak',
    nav_corporate_gifts: 'Enpresa Opariak',
    nav_corporate_line1: 'Enpresa',
    nav_corporate_line2: 'Opariak',
    nav_events: 'Ekitaldiak',
    nav_add_product: 'Gehitu Produktua',
    nav_add_product_line1: 'Gehitu',
    nav_add_product_line2: 'Produktua',
    nav_explore_selection: 'Arakatu Hautaketa',
    nav_your_account: 'Zure Kontua',

    cat_all: 'Guztiak',
    cat_queso: 'Gazta',
    cat_atun: 'Hegaluzea',
    cat_salazon: 'Gatzadura',
    cat_jildas: 'Gildak',
    cat_cerveza: 'Garagardo artisaua',
    cat_txakoli: 'Txakolina',
    cat_sidra: 'Sagardoa',
    cat_new_badge: 'Berritasuna',
    cat_explore: 'Arakatu atala',
    cat_section_title: 'EkhiTeka Hautaketaren Kategoriak',
    sub_quesos: 'Artisau & Afinatuak',
    sub_atun: 'Kantauri Kostaldea',
    sub_salazones: 'Antxoak & Gatzadurak',
    sub_gildas: 'Gildak & Ozpinetakoak',
    sub_cerveza: 'Garagardo Bereziak',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Euskal Sagardoa',

    prod_price: 'Prezioa',
    prod_unit: 'unitate',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'botila',
    prod_can: 'lata',
    prod_jar: 'potoa',
    prod_origin: 'Jatorria',
    prod_stock: 'Stocka',
    prod_unlimited: 'Mugagabea',
    prod_add_to_cart: 'Gehitu saskira',
    prod_added: 'Gehituta',
    prod_ask_artisan: 'Galdetu artisauari',
    prod_consult_product: 'Produktu honi buruzko kontsulta',
    prod_details: 'Xehetasunak',
    prod_search_placeholder: 'Bilatu gazta, hegaluzea, txakolina...',
    prod_no_results: 'Ez da produkturik aurkitu',
    prod_sort_by: 'Ordenatu',
    prod_sort_name_asc: 'Izena (A-Z)',
    prod_sort_name_desc: 'Izena (Z-A)',
    prod_sort_price_asc: 'Prezioa (baxuena lehenik)',
    prod_sort_price_desc: 'Prezioa (altuena lehenik)',
    prod_showing: 'produktu erabilgarri erakusten',
    prod_sold_out: 'Agortuta',
    prod_last_units: 'Azken unitateak!',
    prod_available: 'Eskuragarri',
    prod_availability: 'Eskuragarritasuna:',
    prod_format_label: 'Formatua',
    prod_weight_label: 'Pisua',
    prod_price_per_seat: '/ lekua',
    prod_vat_included: 'BEZ barne',
    prod_doubt_title: 'Produktu honi buruzko zalantzarik duzu?',
    prod_doubt_desc: 'Kontsultatu zuzenean gure gazta maisu eta adituekin.',
    prod_ask_btn: 'Galdetu',
    prod_guarantee_cold: 'Hotz bermatua 24/48h',
    prod_guarantee_pickup: 'Jasotzea Lekeition',
    prod_guarantee_km0: 'Artisau kalitatea km0',
    prod_related_subtitle: 'Afinatzailearen gomendioak',
    prod_related_title: 'Zuretzat interesgarria izan daiteke',
    prod_back_to_selection: 'Itzuli hautaketara',

    event_seats: 'leku',
    event_seat: 'leku',
    event_seats_available: 'leku libre',
    event_capacity_full: 'Leku guztiak beteta (Agortuta)',
    event_last_seats: 'Azken lekuak!',
    event_reserve_seat: 'Erreserbatu Lekua',
    event_seats_added: 'Lekua gehituta',
    event_upcoming_title: 'Dastaketa Presentzialen Hurrengo Ekitaldiak',
    event_upcoming_subtitle: 'Leku mugatuak · Lekeitioko erdigunean',
    event_catalog_title: 'Eskuragarri dauden Dastaketak eta Esperientziak',
    event_catalog_subtitle: 'Dastaketak dendan eta etxerako kit-ak',
    event_home_catalog_title: 'Etxerako Dastaketa Kit-ak',
    event_home_catalog_subtitle: 'Kit-ak eta pack-ak etxera eramateko',
    event_store_catalog_title: 'Dendako Dastaketak Eskuragarri',
    event_store_catalog_subtitle: 'Presentziala Lekeition',

    home_hero_badge: 'Gaztategi Gourmet & Gune Gastronomikoa',
    home_hero_title: 'Egile-gaztak & Esperientziak Lekeition',
    home_hero_subtitle: 'Egile-gaztak & Esperientziak Lekeition',
    home_hero_desc: 'Gazta berezien artisau afinatzea, Kantauri itsasoko altxorrak eta hautatutako maridajeak. Ezagutu gure online denda, opari saskiak eta neurrira egindako esperientziak Bizkaiaren bihotzean.',
    home_explore_btn: 'Arakatu Online Denda',
    home_gourmet_gifts_btn: 'Opari Gourmetak',
    home_pillars_badge: 'Gure Etxea · EkhiTeka Unibertsoa',
    home_pillars_title: 'Ezagutu Gure Atalak',
    home_pillars_desc: 'Hautatu bilatzen duzun esperientzia eta utzi gure artisau afinatzeak gidatzen.',
    home_card1_badge: 'Online & Bidalketa',
    home_card1_sub: 'Katalogo Osoa',
    home_card1_title: 'Denda Gourmet',
    home_card1_desc: 'Gazta afinatuak, Kantauriko hegaluzea, gatzadurak, artisau gildak, txakolina, sagardoa eta egile-garagardoa.',
    home_card1_btn: 'Sartu Dendara',
    home_card2_badge: 'Oparitzeko',
    home_card2_sub: 'Xehetasunak & Saskiak',
    home_card2_title: 'Opari Gourmetak',
    home_card2_desc: 'Pertsonalizatutako saski gourmetak, etxerako dastaketa kit-ak eta opari txartel birtual zein fisikoak.',
    home_card2_btn: 'Ikusi Opari Aukerak',
    home_card3_badge: 'Sentsoriala',
    home_card3_sub: 'Dendan & Ekitaldietan',
    home_card3_title: 'Dastaketak & Esperientziak',
    home_card3_desc: 'Dastaketak etxean, aurrez aurreko dastaketak Lekeitioko dendan, ezkontzetarako mahaiak eta raclette mailegua.',
    home_card3_btn: 'Ezagutu Esperientziak',
    home_card4_badge: 'Korporatiboa',
    home_card4_sub: 'Taldeak & Bezeroak',
    home_card4_title: 'Enpresa Opariak',
    home_card4_desc: 'Teambuilding gastronomikoa, egile-gabonetako saskiak eta neurrira egindako enpresa xehetasunak.',
    home_card4_btn: 'Ikusi Enpresa Zerbitzuak',

    exp_banner_badge: 'Hemen gauzak gertatzen dira...',
    exp_banner_title: 'Dastaketak, Ekitaldiak & EkhiTeka Esperientziak',
    exp_b1_title: 'Dastaketa Presentzialak & Tailerrak',
    exp_b1_desc: 'Ikasi nazioarteko eta tokiko artisau gaztak dastatzen, sagardo naturalekin, txakolinekin eta egile-ardoekin uztartuta Lekeition.',
    exp_b1_btn: 'Kontsultatu Hurrengo Datak',
    exp_b2_title: 'Gazta Mahaiak Ezkontza & Festetarako',
    exp_b2_desc: 'Cheese Corner ikusgarriak prestatzen ditugu lore jangarriekin, artisau ogiekin eta uztartzeekin zure ospakizunerako.',
    exp_b2_btn: 'Eskatu Ekitaldi Aurrekontua',
    exp_b3_title: 'Gourmet Saskiak & Enpresa Opariak',
    exp_b3_desc: 'Kaxa gastronomiko esklusiboak diseinatzen ditugu ontzi premiumarekin, kaligrafia oharrekin eta hautatutako gaztekin.',
    exp_b3_btn: 'Konfiguratu Saskia Neurrirako',

    exp_hero_badge: 'Esperientzia Gastronomikoak',
    exp_hero_title: 'Dastaketak &',
    exp_hero_title_highlight: 'Esperientziak',
    exp_hero_desc: 'Ezagutu artisau gaztaren artea gure dastaketa gidatuen, ospakizunetarako ekitaldien eta Lekeition zein zuk aukeratutako lekuan gozatzeko zerbitzu esklusiboen bidez.',
    exp_home_tasting_title: 'Dastaketak Etxean',
    exp_home_tasting_badge: 'Zure erritmoan',
    exp_home_tasting_desc: 'Bihur zaitez anfitrioi gure dastaketa-kit osoekin: 6 gazta afinatu intentsitatearen arabera sailkatuta, artisau maridajeak, dastaketa-mantel ilustratua eta fitxa azalpenak.',
    exp_home_tasting_btn: 'Eskatu Kit-a Etxerako',
    exp_store_tasting_title: 'Dastaketak Dendan',
    exp_store_tasting_badge: 'Presentziala Lekeition',
    exp_store_tasting_desc: 'Esperientzia presentzial esklusiboak Lekeitioko gure gaztategian (Gamarra Kalea 4). Gure gazta-maistruek gidatuta talde txikietan, egile-piezak eta Bizkaiko txakolina dastatuz.',
    exp_store_tasting_btn: 'Ikusi Datak & Erreserbatu Lekua',
    exp_wedding_title: 'Ezkontzetarako Mahaia',
    exp_wedding_badge: 'Ezkontzak & Ekitaldiak',
    exp_wedding_desc: 'Gazta-mahai ikusgarriak sortzen ditugu ezkontzetako kokteletarako eta ospakizunetarako. Diseinu monumentalekin, fruitu freskoekin, fruitu lehorrekin eta ogi artisauekin.',
    exp_wedding_btn: 'Eskatu Aurrekontua Ezkontzetarako',
    exp_raclette_title: 'Raclette Mailegua',
    exp_raclette_badge: 'Alokairua & Pack-a',
    exp_raclette_desc: 'Suitzar raclette makina profesionala mailegatzen dizugu, raclette gazta afinatu moztuarekin, txarkuteria artisauarekin eta patatekin, ekipamenduaz kezkatu gabe goza dezazun.',
    exp_raclette_btn: 'Kontsultatu Raclette Eskuragarritasuna',

    gifts_hero_badge: 'Oparitzeko Hautaketa Esklusiboa',
    gifts_hero_title: 'Opari',
    gifts_hero_title_highlight: 'Gourmetak',
    gifts_hero_desc: 'Harritu neurrira egindako artisau saskiekin, gazta afinatuen estutxeekin, egile-maridajeekin eta une ahaztezinetarako opari txartelekin.',
    gifts_whatsapp_btn: 'Eskari Pertsonalizatua WhatsApp Bidez',
    gifts_card1_title: 'Gourmet Saskiak Neurrirako',
    gifts_card1_desc: 'Artisau saskiak diseinatzen ditugu zati afinatuak, Kantauriko kontserbak, txakolina eta euskal gozoak konbinatuz zure aurrekontuaren arabera.',
    gifts_card1_feature: 'Bidalpen hoztua dedikatoria txartelarekin',
    gifts_card2_title: 'Dastaketa & Maridaje Pack-ak',
    gifts_card2_desc: 'Ireki eta gozatzeko prestatutako estutxe tematikoak: gazta hautaketak intentsitatearen arabera artisau marmeladekin, intxaurrekin eta pikuekin.',
    gifts_card2_feature: 'Aurkezpena egurrezko kaxa prémiumean',
    gifts_card3_title: 'Opari Txartelak & Dastaketak',
    gifts_card3_desc: 'Opari aproposa beren gazta gogokoenak aukera ditzaten edo Lekeitioko gure dendan dastaketa gidatu batez goza dezaten.',
    gifts_card3_feature: 'Baliozkoa online eta denda fisikoan',
    gifts_catalog_badge: 'Bidalpenerako edo jasotzeko eskuragarri',
    gifts_catalog_title: 'Oparitzeko Prest dauden Saskiak & Pack-ak',

    corp_hero_badge: 'Enpresa Irtenbideak & Gabonetako Loteak',
    corp_hero_title: 'Enpresa',
    corp_hero_title_highlight: 'Opariak',
    corp_hero_desc: 'Eskerrak eman zure talde eta bezeroen konfiantzagatik lote gastronomiko artisauekin, enpresa xehetasun pertsonalizatuekin eta dastaketa esklusiboekin.',
    corp_whatsapp_btn: 'Eskatu Enpresa Aurrekontua WhatsApp Bidez',
    corp_card1_title: 'Gabonetako Loteak eta Saskiak',
    corp_card1_desc: 'Tartekaririk gabeko konposizio premiumak: afinatzailearen gaztak, ezkur-urdaiazpiko iberikoak, Kantauriko gatzadurak eta maridaje bereziak faktura zehatzarekin.',
    corp_card2_title: 'Dastaketa Pribatuak & Team Building',
    corp_card2_desc: 'Enpresa ekitaldiak eta talde jarduera gidatuak antolatzen ditugu Lekeitioko gure gaztategian edo zure enpresaren egoitzan.',
    corp_card3_title: 'Pertsonalizazioa Zure Markarekin',
    corp_card3_desc: 'Faja pertsonalizatuak, zure enpresaren logotipoa duten txartelak eta hartzaile bakoitzarentzako mezu korporatibo dedikatuak sartzen ditugu.',
    corp_logistics_badge: 'EkhiTeka Konpromisoa',
    corp_logistics_title: 'Logistika Bikaina eta Bidalpen Anitzak',
    corp_logistics_desc: 'Langile edo bezeroen hainbat helbidetara 24/48 ordutan bidaltzeko kudeaketa osoaz arduratzen gara trazabilitate osoarekin.',
    corp_logistics_feat1: 'Bidalpen indibidualak langile bakoitzari',
    corp_logistics_feat2: 'Garraio hoztu homologatua',
    corp_logistics_feat3: 'Fakturazio zehatza BEZ bananduta',

    reviews_badge: 'Konfiantza & Gastronomia Pasioa',
    reviews_title: 'Gure Bezeroen Iritziak',
    reviews_subtitle: 'Gure hautaketa probatu duten gazta-zaleek diotena',
    reviews_verified_buyer: 'Erosle egiaztatua',
    rev1_comment: 'Gaztak benetako zoramena dira. Afinatze perfektua eta bidalketa hoztua 24 ordutan iritsi zen ezin hobeto. Bizkaiko gaztategirik onena.',
    rev1_date: 'Duela 3 egun',
    rev2_comment: 'Urtebetetze baterako gazta eta kontserba taula bat eskatu nuen eta gonbidatu guztiak txundituta geratu ziren. Tratu gertukoa eta aholkua bikaina.',
    rev2_date: 'Duela astebete',
    rev3_comment: 'Hilero erosten dut gazta eta antxoa hautaketa. Ontzi termikoak produktua fresko mantentzen du denda fisikoan egongo bazina bezala.',
    rev3_date: 'Duela 2 aste',

    cart_title: 'Zure Saskia',
    cart_empty: 'Saskia hutsik dago',
    cart_empty_sub: 'Arakatu gure produktu gourmetak eta gehitu zure gogokoenak.',
    cart_explore_btn: 'Ikusi Produktuak',
    cart_subtotal: 'Azpitotusa',
    cart_total: 'Guztira',
    cart_checkout: 'Bideratu Eskaera',
    cart_remove: 'Kendu',
    cart_quantity: 'Kopurua',
    cart_continue_shopping: 'Jarraitu Erosketak',
    deliv_choose_mode: 'Aukeratu jasotzeko modua',
    deliv_home: 'Etxera bidaltzea',
    deliv_home_desc: 'Garraio hoztuan zure atean 24-48 ordutan',
    deliv_store_pickup: 'Dendan jasotzea',
    deliv_store_pickup_desc: 'Gure saltokian jaso ordutegi barruan',
    deliv_shipping_address: 'Bidalketa helbidea',
    deliv_shipping_notes: 'Bidalketarako oharrak (ordutegia, atezaina...)',
    deliv_pickup_time: 'Jasotzeko gutxi gorabeherako ordua',
    deliv_pickup_address: 'Dendaren helbidea: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Berretsi eta Bidali Eskaera',
    deliv_order_success: 'Eskaera ongi burutu da!',
    deliv_order_success_desc: 'Saltzaileak zure eskaera jaso du eta prestatzen hasiko da.',

    orders_title: 'Nire Eskaerak',
    orders_title_seller: 'Eskaerak Kudeatu',
    orders_subtitle_buyer: 'Zure erosketen jarraipena, produktuak eta egoera.',
    orders_subtitle_seller: 'Bezeroaren eskaerak kudeatu, egoera eguneratu eta produktuak prestatu.',
    orders_status: 'Egoera',
    orders_pending: 'Balioztatzeko',
    orders_confirmed: 'Balioztatuta',
    orders_preparing: 'Prestatzen',
    orders_ready_delivery: 'Banatzeko prest',
    orders_delivered: 'Entregatuta',
    orders_cancelled: 'Ezeztatuta',
    orders_change_status: 'Aldatu egoera',
    orders_cancel_order: 'Ezeztatu eskaera',
    orders_cancel_reason: 'Ezeztatze arrazoia',
    orders_chat_with_buyer: 'Hitz egin bezeroarekin',
    orders_chat_with_seller: 'Hitz egin saltzailearekin',
    orders_no_orders: 'Ez duzu eskaerarik oraindik',
    orders_no_orders_seller: 'Ez dago eskaerarik oraindik',
    orders_no_orders_seller_sub: 'Bezeroek egindako eskaerak automatikoki agertuko dira hemen.',
    orders_products_label: 'Eskaerako Produktuak',
    orders_products_to_prepare: 'Prestatzeko Produktuak',
    orders_purchase_date: 'Erosketa data',
    orders_date_time: 'Data eta ordua',
    orders_order_number: 'Eskaera:',
    orders_total_to_charge: 'Kobratzekoa:',
    orders_new_status: 'Egoera berria! Zure eskaera aldatu da:',
    orders_mark_seen: 'Ikusia markatu',
    orders_client_label: 'Bezeroa',
    orders_qty_label: 'Kantitatea',

    status_confirm: 'Baieztatu',
    status_preparing: 'Prestatzen',
    status_ready: 'Prest',
    status_delivered: 'Entregatuta',

    seller_new_product: 'Gehitu Produktu Berria',
    seller_edit_product: 'Editatu Produktua',
    seller_product_name: 'Produktuaren Izena',
    seller_product_desc: 'Deskribapena eta ezaugarriak',
    seller_product_price: 'Prezioa (€)',
    seller_product_category: 'Kategoria',
    seller_product_format: 'Formatua / Aurkezpena',
    seller_product_origin: 'Jatorria (Herria/Eskualdea)',
    seller_product_stock: 'Stock erabilgarria',
    seller_product_image: 'Produktuaren Argazkia',
    seller_save_product: 'Gorde Produktua',
    seller_delete_product: 'Ezabatu Produktua',
    seller_product_deleted: 'Produktua ezabatu da',

    seller_events_title: 'Dastaketa Presentzialak Dendan',
    seller_events_subtitle: 'Aforoa, aldagaien edizioa eta bertaratuen kudeaketa Lekeitioko dastaketetan.',
    seller_events_edit_btn: 'Editatu Dastaketa',
    seller_events_reserved: 'Erreserbatuta',
    seller_events_available: 'Libre',
    seller_events_collected: 'Bilketa',
    seller_events_attendees_title: 'Dastaketako Partaideak',
    seller_events_no_events: 'Ez duzu dastaketa presentzialik sortu oraindik',
    seller_events_no_events_desc: 'Argitaratu dastaketa presentzial bat Lekeitioko dendan goiko menutik.',
    seller_events_col_buyer: 'Eroslea',
    seller_events_col_contact: 'Kontaktua',
    seller_events_col_seats: 'Lekuak',
    seller_events_col_date: 'Erosketa Data',
    seller_events_col_total: 'Guztira',
    seller_events_col_actions: 'Ekintzak',

    chat_title: 'Txatak eta Mezuak',
    chat_type_message: 'Idatzi mezu bat hemen...',
    chat_send: 'Bidali',
    chat_about_product: 'Produktu honi buruz',
    chat_about_order: 'Eskaera honi buruz',
    chat_no_messages: 'Ez dago mezurik oraindik',
    chat_conversations: 'Elkarrizketak',

    role_buyer: 'Bezeroa / Eroslea',
    role_seller: 'Ekoizlea / Saltzailea',
    role_admin: 'Administratzailea',
    auth_email: 'Helbide elektronikoa',
    auth_password: 'Pasahitza',
    auth_full_name: 'Izen-abizenak edo Dendaren Izena',
    auth_phone: 'Telefonoa',
    auth_town: 'Herria / Hiria',
    auth_have_account: 'Dagoeneko kontua duzu? Hasi saioa',
    auth_no_account: 'Ez duzu konturik? Erregistratu hemen',

    legal_terms: 'Erabilera Baldintzak',
    legal_privacy: 'Pribatutasun Politika',
    legal_cookies: 'Cookien Politika',
    legal_notice: 'Lege Oharra',
    cookie_text: 'Gure webguneak cookieak erabiltzen ditu nabigazio esperientzia onena eskaintzeko.',
    cookie_accept: 'Onartu Guztiak',
    cookie_reject: 'Ukatu',
    cookie_settings: 'Konfiguratu',

    footer_club_title: 'Gazta Onaren Lagunen Kluba',
    footer_club_subtitle: 'EkhiTekako nobedadeetan eguneratuta egon nahi al duzu?',
    footer_club_desc: 'Denboraldiko gazta berriak, Lekeition egindako cata esklusiboak eta lote mugatuak besteen aurretik.',
    footer_join_whatsapp: 'WhatsApp bidez sartu',
    footer_cheese_desc: 'Afilatutako gaztak, kantabriar gatzadurak eta eskuz hautatutako artisau kontserbak.',
    footer_delivery_desc: 'Hotz-katea bermatuta 24/48 ordutan, produktu bakoitza bere puntuan irits dadin.',
    footer_pickup_desc: 'Eskatu online eta jaso prestatuta itxaron gabe gure Lekeitioko gaztaterian.',
    footer_categories: 'Kategoriak',
    footer_experiences: 'Esperientziak',
    footer_legal: 'Informazio Legala',
    footer_schedule_title: 'Dendaren Ordutegia:',
    footer_schedule_weekdays: 'Al-Os: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Larunbatak: 10:30 - 15:00',
    footer_copyright: 'Eskubide guztiak erreserbatuak.',
    footer_tagline: 'Artisau inspirazioa & km0 afinatzea · Lekeitio',
    footer_exp_tasting: 'Cata presentzialak Lekeition',
    footer_exp_weddings: 'Ezkontzarako gazta-mahaiak',
    footer_exp_gifts: 'Saskiak eta Opari Gourmetak',
    footer_exp_consult: 'Kontsultak Gazta Maisuarekin',

    shop_specialty: 'Gure Espezialitatea',
    shop_hero_title: 'Gaztak eta opari gastronomikoak Lekeition',
    shop_hero_desc: 'Egileak sinatutako gaztak, Kantabriako altxorrak eta hautatutako marinadak. Lekeitioko zapore benetakoa opari eta gozatzeko.',
    shop_see_cheeses: 'GURE GAZTAK IKUSI',
    shop_whatsapp_orders: 'WhatsApp bidez eskaerak',
    shop_visit_title: 'Gure Gaztategia & Gourmet Gunea',
    shop_visit_subtitle: 'Bisitatu Lekeition · Km0',
    shop_visit_desc: 'Gure webgunean aukeraketa bat ikusten duzu, gure Lekeitioko gaztaterian dena duzu: 80 baino gehiago erreferentzia artisau gazta, Kantabriako kontserbak eta gure gazta maisuek emandako aholkularitza pertsonalizatua.',
    shop_visit_contact: 'Kontaktatu Dendarekin',

    common_save: 'Gorde',
    common_cancel: 'Utzi',
    common_delete: 'Ezabatu',
    common_edit: 'Editatu',
    common_back: 'Itzuli',
    common_loading: 'Kargatzen...',
    common_success: 'Eragiketa ondo burutu da',
    common_error: 'Errorea gertatu da',
    common_theme_light: 'Argia',
    common_theme_dark: 'Iluna',
    common_theme_system: 'Sistema',
    common_select_language: 'Hizkuntza hautatu',
  },

  es: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Tienda Gourmet & Productos Artesanos',
    brand_subtitle: 'Quesos de autor, bonito del norte, salazones, gildas, cerveza artesanal, txakoli y sidra selecta.',
    top_refrigerated_shipping: 'Envío refrigerado 24/48h en península',
    top_custom_orders: 'Encargos a medida y asesoramiento gourmet',
    top_store_pickup: 'Recogida gratuita en tienda',

    nav_shop: 'Tienda',
    nav_cart: 'Cesta',
    nav_orders: 'Pedidos',
    nav_my_products: 'Mis Productos',
    nav_chats: 'Mensajes',
    nav_admin: 'Admin',
    nav_login: 'Iniciar Sesión',
    nav_register: 'Registrarse',
    nav_profile: 'Perfil',
    nav_logout: 'Cerrar Sesión',
    nav_gourmet_gifts: 'Regalos Gourmet',
    nav_gourmet_gifts_line1: 'Regalos',
    nav_gourmet_gifts_line2: 'Gourmet',
    nav_tastings_experiences: 'Catas & Experiencias',
    nav_tastings_line1: 'Catas &',
    nav_tastings_line2: 'Experiencias',
    nav_corporate_gifts: 'Regalos de Empresa',
    nav_corporate_line1: 'Regalos de',
    nav_corporate_line2: 'Empresa',
    nav_events: 'Eventos',
    nav_add_product: 'Añadir Producto',
    nav_add_product_line1: 'Añadir',
    nav_add_product_line2: 'Producto',
    nav_explore_selection: 'Explorar Selección',
    nav_your_account: 'Tu Cuenta',

    cat_all: 'Todos',
    cat_queso: 'Queso',
    cat_atun: 'Atún y Bonito',
    cat_salazon: 'Salazón y Anchoas',
    cat_jildas: 'Gildas y Encurtidos',
    cat_cerveza: 'Cerveza artesanal',
    cat_txakoli: 'Txakoli',
    cat_sidra: 'Sidra',
    cat_new_badge: 'Novedad',
    cat_explore: 'Explorar sección',
    cat_section_title: 'Categorías Selección EkhiTeka',
    sub_quesos: 'Artesanos & Afinados',
    sub_atun: 'Cantábrico Costera',
    sub_salazones: 'Anchoas & Salazón',
    sub_gildas: 'Gildas & Encurtidos',
    sub_cerveza: 'Craft & Especiales',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Euskal Sagardoa',

    prod_price: 'Precio',
    prod_unit: 'ud',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'botella',
    prod_can: 'lata',
    prod_jar: 'tarro',
    prod_origin: 'Origen',
    prod_stock: 'Stock',
    prod_unlimited: 'Ilimitado',
    prod_add_to_cart: 'Añadir a la cesta',
    prod_added: 'Añadido',
    prod_ask_artisan: 'Preguntar al artesano',
    prod_consult_product: 'Consulta sobre este producto',
    prod_details: 'Detalles',
    prod_search_placeholder: 'Buscar quesos, bonito, gildas, txakoli...',
    prod_no_results: 'No se encontraron productos',
    prod_sort_by: 'Ordenar',
    prod_sort_name_asc: 'Nombre (A-Z)',
    prod_sort_name_desc: 'Nombre (Z-A)',
    prod_sort_price_asc: 'Precio (menor a mayor)',
    prod_sort_price_desc: 'Precio (mayor a menor)',
    prod_showing: 'productos disponibles',
    prod_sold_out: 'Agotado',
    prod_last_units: '¡Últimas unidades!',
    prod_available: 'Disponible',
    prod_availability: 'Disponibilidad:',
    prod_format_label: 'Formato',
    prod_weight_label: 'Peso',
    prod_price_per_seat: '/ plaza',
    prod_vat_included: 'IVA incl.',
    prod_doubt_title: '¿Tienes alguna duda sobre este producto?',
    prod_doubt_desc: 'Consulta directamente con nuestros afinadores y expertos.',
    prod_ask_btn: 'Preguntar',
    prod_guarantee_cold: 'Frío garantizado 24/48h',
    prod_guarantee_pickup: 'Recogida en Lekeitio',
    prod_guarantee_km0: 'Calidad artesanal km0',
    prod_related_subtitle: 'Recomendaciones del afinador',
    prod_related_title: 'También te puede interesar',
    prod_back_to_selection: 'Volver a la selección',

    event_seats: 'plazas',
    event_seat: 'plaza',
    event_seats_available: 'plazas disponibles',
    event_capacity_full: 'Aforo Completo (Sin Plazas)',
    event_last_seats: '¡Últimas plazas!',
    event_reserve_seat: 'Reservar Plaza(s)',
    event_seats_added: 'Plaza(s) Añadida(s)',
    event_upcoming_title: 'Próximos Eventos de Catas Presenciales',
    event_upcoming_subtitle: 'Plazas limitadas · Lekeitio Centro',
    event_catalog_title: 'Catas & Experiencias Disponibles',
    event_catalog_subtitle: 'Catas en tienda & Kits para casa',
    event_home_catalog_title: 'Kits de Catas en Casa Disponibles',
    event_home_catalog_subtitle: 'Kits & Packs para llevar',
    event_store_catalog_title: 'Catas en Tienda Disponibles',
    event_store_catalog_subtitle: 'Presencial en Lekeitio',

    home_hero_badge: 'Quesería Gourmet & Espacio Gastronómico',
    home_hero_title: 'Quesos de autor & Experiencias en Lekeitio',
    home_hero_subtitle: 'Quesos de autor & Experiencias en Lekeitio',
    home_hero_desc: 'Afinado artesanal de quesos singulares, tesoros del Cantábrico y maridajes selectos. Descubre nuestra tienda online, cestas de regalo y experiencias a medida en el corazón de Bizkaia.',
    home_explore_btn: 'Explorar Tienda Online',
    home_gourmet_gifts_btn: 'Regalos Gourmet',
    home_pillars_badge: 'Nuestra Casa · El Universo EkhiTeka',
    home_pillars_title: 'Descubre Nuestras Secciones',
    home_pillars_desc: 'Selecciona la experiencia que buscas y déjate guiar por nuestro afinado artesanal.',
    home_card1_badge: 'Online & Envío',
    home_card1_sub: 'Catálogo Completo',
    home_card1_title: 'Tienda Gourmet',
    home_card1_desc: 'Quesos afinados, bonito del Cantábrico, salazones, gildas artesanas, txakoli, sidra y cerveza de autor.',
    home_card1_btn: 'Entrar a la Tienda',
    home_card2_badge: 'Para Regalar',
    home_card2_sub: 'Detalles & Cestas',
    home_card2_title: 'Regalos Gourmet',
    home_card2_desc: 'Cestas gourmet personalizadas, kits de cata para casa y tarjetas regalo virtuales o físicas.',
    home_card2_btn: 'Ver Opciones de Regalo',
    home_card3_badge: 'Sensorial',
    home_card3_sub: 'En Tienda & Eventos',
    home_card3_title: 'Catas & Experiencias',
    home_card3_desc: 'Catas en casa, catas presenciales en tienda de Lekeitio, mesas para bodas y préstamo de raclette.',
    home_card3_btn: 'Descubrir Experiencias',
    home_card4_badge: 'Corporativo',
    home_card4_sub: 'Equipos & Clientes',
    home_card4_title: 'Regalos de Empresa',
    home_card4_desc: 'Teambuilding gastronómico, cestas de navidad de autor y detalles corporativos a medida.',
    home_card4_btn: 'Ver Servicios de Empresa',

    exp_banner_badge: 'Aquí pasan cosas...',
    exp_banner_title: 'Catas, Eventos & Experiencias EkhiTeka',
    exp_b1_title: 'Catas Presenciales & Talleres',
    exp_b1_desc: 'Aprende a degustar quesos artesanales internacionales y locales, maridados con sidras naturales, txakolis y vinos de autor en Lekeitio.',
    exp_b1_btn: 'Consultar Próximas Fechas',
    exp_b2_title: 'Mesas de Quesos para Bodas & Fiestas',
    exp_b2_desc: 'Montamos impresionantes Cheese Corners personalizados con flores comestibles, panes artesanos y maridajes para tu celebración.',
    exp_b2_btn: 'Pedir Presupuesto Evento',
    exp_b3_title: 'Cestas Gourmet & Regalos de Empresa',
    exp_b3_desc: 'Diseñamos cajas gastronómicas exclusivas con embalaje premium, notas caligráficas y la mejor selección de quesos afinados y salazones.',
    exp_b3_btn: 'Configurar Cesta a Medida',

    exp_hero_badge: 'Experiencias Gastronómicas',
    exp_hero_title: 'Catas &',
    exp_hero_title_highlight: 'Experiencias',
    exp_hero_desc: 'Descubre el arte del queso artesano a través de nuestras catas guiadas, eventos para celebraciones y servicios exclusivos para disfrutar en Lekeitio o donde tú elijas.',
    exp_home_tasting_title: 'Catas en Casa',
    exp_home_tasting_badge: 'A tu ritmo',
    exp_home_tasting_desc: 'Conviértete en anfitrión con nuestros kits completos de cata: selección de 6 quesos afinados clasificados por intensidades, maridajes artesanos de acompañamiento, mantel de cata ilustrado y fichas explicativas con notas de cata y maridajes.',
    exp_home_tasting_btn: 'Solicitar Kit para Casa',
    exp_store_tasting_title: 'Catas en la Tienda',
    exp_store_tasting_badge: 'Presencial en Lekeitio',
    exp_store_tasting_desc: 'Experiencias presenciales exclusivas en nuestra quesería de Lekeitio (Gamarra Kalea 4). Guiadas por nuestros afinadores queseros en grupos reducidos, probando piezas de autor, txakoli de Bizkaia y maridajes singulares.',
    exp_store_tasting_btn: 'Ver Fechas & Reservar Plaza',
    exp_wedding_title: 'Mesa para Bodas',
    exp_wedding_badge: 'Bodas & Eventos',
    exp_wedding_desc: 'Creamos mesas de quesos espectaculares para cócteles de bodas y celebraciones. Diseños monumentales con frutas frescas, frutos secos, panes artesanos, confituras y una selección afinada que dejará impresionados a todos los invitados.',
    exp_wedding_btn: 'Pedir Presupuesto para Bodas',
    exp_raclette_title: 'Préstamo de Raclette',
    exp_raclette_badge: 'Alquiler & Pack',
    exp_raclette_desc: 'Te prestamos la máquina profesional de raclette tradicional suiza junto con el queso de raclette afinado cortado a la perfección, embutidos artesanos y patatas para que disfrutes de una velada única sin preocuparte por el equipamiento.',
    exp_raclette_btn: 'Consultar Disponibilidad de Raclette',

    gifts_hero_badge: 'Selección Exclusiva para Regalar',
    gifts_hero_title: 'Regalos',
    gifts_hero_title_highlight: 'Gourmet',
    gifts_hero_desc: 'Sorprende con cestas artesanales a medida, estuches de quesos afinados, maridajes de autor y tarjetas regalo para ocasiones inolvidables.',
    gifts_whatsapp_btn: 'Encargo Personalizado por WhatsApp',
    gifts_card1_title: 'Cestas Gourmet a Medida',
    gifts_card1_desc: 'Diseñamos cestas artesanales combinando cuñas afinadas, conservas selectas del Cantábrico, txakoli y dulces vascos según tu presupuesto.',
    gifts_card1_feature: 'Envío refrigerado con tarjeta dedicatoria',
    gifts_card2_title: 'Packs Degustación & Maridaje',
    gifts_card2_desc: 'Estuches temáticos preparados para abrir y disfrutar: selecciones de quesos por intensidad con confituras artesanas, nueces y picos gourmet.',
    gifts_card2_feature: 'Presentación en caja prémium de madera',
    gifts_card3_title: 'Tarjetas & Catas de Regalo',
    gifts_card3_desc: 'El obsequio perfecto para que elijan sus quesos preferidos o disfruten de una cata guiada presencial en nuestra quesería de Lekeitio.',
    gifts_card3_feature: 'Válido online y en tienda física',
    gifts_catalog_badge: 'Disponibles para envío o recogida',
    gifts_catalog_title: 'Cestas & Packs Listos para Regalar',

    corp_hero_badge: 'Soluciones Corporativas & Lotes Navideños',
    corp_hero_title: 'Regalos de',
    corp_hero_title_highlight: 'Empresa',
    corp_hero_desc: 'Agradece la confianza de tu equipo y clientes con lotes gastronómicos artesanos, detalles corporativos personalizados y experiencias de cata exclusivas.',
    corp_whatsapp_btn: 'Pedir Presupuesto Corporativo por WhatsApp',
    corp_card1_title: 'Lotes y Cestas de Navidad',
    corp_card1_desc: 'Composiciones prémium sin intermediarios: quesos de afinador, embutidos ibéricos de bellota, salazones del Cantábrico y maridajes singulares con factura desglosada.',
    corp_card2_title: 'Catas Privadas & Team Building',
    corp_card2_desc: 'Organizamos eventos de empresa y actividades de equipo guiadas en nuestra quesería de Lekeitio o en la sede de tu empresa.',
    corp_card3_title: 'Personalización con tu Marca',
    corp_card3_desc: 'Incluimos fajas personalizadas, tarjetas con el logotipo de tu empresa y mensajes corporativos dedicados para cada destinatario.',
    corp_logistics_badge: 'Compromiso EkhiTeka',
    corp_logistics_title: 'Logística Impecable y Envíos Múltiples',
    corp_logistics_desc: 'Nos encargamos de toda la gestión de envíos a múltiples domicilios de empleados o clientes en 24/48 horas con trazabilidad total.',
    corp_logistics_feat1: 'Envíos individuales a cada empleado',
    corp_logistics_feat2: 'Transporte refrigerado homologado',
    corp_logistics_feat3: 'Facturación detallada con IVA desglosado',

    reviews_badge: 'Confianza & Pasión Gastronómica',
    reviews_title: 'Opiniones de Nuestros Clientes',
    reviews_subtitle: 'Lo que dicen los amantes del buen queso que ya han probado nuestra selección',
    reviews_verified_buyer: 'Comprador verificado',
    rev1_comment: 'Los quesos son una auténtica locura. El afinado perfecto y el envío refrigerado llegó impecable en 24h. La mejor quesería de Bizkaia con diferencia.',
    rev1_date: 'Hace 3 días',
    rev2_comment: 'Encargué una tabla de quesos y conservas para un cumpleaños y todos los invitados quedaron fascinados. El trato cercano y la recomendación por WhatsApp un 10.',
    rev2_date: 'Hace 1 semana',
    rev3_comment: 'Compro la selección de quesos y anchoas todos los meses. El empaquetado térmico mantiene el producto fresco como si estuvieras en la tienda física.',
    rev3_date: 'Hace 2 semanas',

    cart_title: 'Tu Cesta',
    cart_empty: 'Tu cesta está vacía',
    cart_empty_sub: 'Explora nuestra selección gourmet y añade tus productos preferidos.',
    cart_explore_btn: 'Explorar Tienda',
    cart_subtotal: 'Subtotal',
    cart_total: 'Total',
    cart_checkout: 'Tramitar Pedido',
    cart_remove: 'Eliminar',
    cart_quantity: 'Cantidad',
    cart_continue_shopping: 'Seguir Comprando',
    deliv_choose_mode: 'Elige cómo recibir tu pedido',
    deliv_home: 'Envío a domicilio',
    deliv_home_desc: 'Transporte refrigerado en tu puerta en 24-48 horas',
    deliv_store_pickup: 'Recogida en tienda',
    deliv_store_pickup_desc: 'Pasa a recoger tu pedido preparado en nuestro local',
    deliv_shipping_address: 'Dirección de entrega',
    deliv_shipping_notes: 'Notas de entrega (horario preferente, portería...)',
    deliv_pickup_time: 'Hora aproximada de recogida',
    deliv_pickup_address: 'Dirección de la tienda: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmar y Realizar Pedido',
    deliv_order_success: '¡Pedido realizado con éxito!',
    deliv_order_success_desc: 'El artesano ha recibido tu pedido y comenzará a prepararlo.',

    orders_title: 'Mis Pedidos',
    orders_title_seller: 'Gestión de Pedidos',
    orders_subtitle_buyer: 'Seguimiento, detalles de productos y estado de tus compras gourmet.',
    orders_subtitle_seller: 'Gestiona pedidos de clientes, actualiza estados y revisa los productos encargados.',
    orders_status: 'Estado',
    orders_pending: 'Por validar',
    orders_confirmed: 'Validado',
    orders_preparing: 'En preparación',
    orders_ready_delivery: 'Listo para entrega',
    orders_delivered: 'Entregado',
    orders_cancelled: 'Cancelado',
    orders_change_status: 'Cambiar estado',
    orders_cancel_order: 'Cancelar pedido',
    orders_cancel_reason: 'Motivo de cancelación',
    orders_chat_with_buyer: 'Chat con el cliente',
    orders_chat_with_seller: 'Chat con el artesano',
    orders_no_orders: 'No tienes pedidos aún',
    orders_no_orders_seller: 'No hay pedidos recibidos todavía',
    orders_no_orders_seller_sub: 'Los nuevos pedidos de tus clientes aparecerán aquí automáticamente.',
    orders_products_label: 'Productos del Pedido',
    orders_products_to_prepare: 'Productos a Preparar',
    orders_purchase_date: 'Fecha de Compra',
    orders_date_time: 'Fecha y Hora',
    orders_order_number: 'Pedido:',
    orders_total_to_charge: 'Total a cobrar:',
    orders_new_status: '¡Novedad! El estado de tu pedido ha cambiado a:',
    orders_mark_seen: 'Marcar como Visto',
    orders_client_label: 'Cliente',
    orders_qty_label: 'Cantidad',

    status_confirm: 'Confirmar',
    status_preparing: 'Preparando',
    status_ready: 'Listo Entrega',
    status_delivered: 'Entregado',

    seller_new_product: 'Añadir Producto Gourmet',
    seller_edit_product: 'Editar Producto',
    seller_product_name: 'Nombre del Producto',
    seller_product_desc: 'Descripción y notas de cata',
    seller_product_price: 'Precio (€)',
    seller_product_category: 'Categoría',
    seller_product_format: 'Formato / Presentación',
    seller_product_origin: 'Origen (Localidad/Denominación)',
    seller_product_stock: 'Stock disponible',
    seller_product_image: 'Fotografía del Producto',
    seller_save_product: 'Guardar Producto',
    seller_delete_product: 'Eliminar Producto',
    seller_product_deleted: 'Producto eliminado correctamente',

    seller_events_title: 'Catas Presenciales en Tienda',
    seller_events_subtitle: 'Control de aforo, edición de variables y gestión de asistentes para catas en Lekeitio.',
    seller_events_edit_btn: 'Editar Cata',
    seller_events_reserved: 'Reservadas',
    seller_events_available: 'Disponibles',
    seller_events_collected: 'Recaudado',
    seller_events_attendees_title: 'Participantes de la Cata',
    seller_events_no_events: 'No tienes catas presenciales creadas todavía',
    seller_events_no_events_desc: 'Publica una cata presencial en la tienda de Lekeitio desde el menú superior para gestionar aforo, plazas y asistentes.',
    seller_events_col_buyer: 'Comprador',
    seller_events_col_contact: 'Contacto',
    seller_events_col_seats: 'Plazas',
    seller_events_col_date: 'Fecha Compra',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Acciones',

    chat_title: 'Mensajes & Asesoramiento',
    chat_type_message: 'Escribe tu mensaje aquí...',
    chat_send: 'Enviar',
    chat_about_product: 'Sobre este producto',
    chat_about_order: 'Sobre este pedido',
    chat_no_messages: 'No hay mensajes aún',
    chat_conversations: 'Conversaciones',

    role_buyer: 'Comprador / Gourmet',
    role_seller: 'Productor / Vendedor',
    role_admin: 'Administrador',
    auth_email: 'Correo electrónico',
    auth_password: 'Contraseña',
    auth_full_name: 'Nombre completo o Nombre de la Tienda',
    auth_phone: 'Teléfono de contacto',
    auth_town: 'Localidad / Ciudad',
    auth_have_account: '¿Ya tienes cuenta? Inicia sesión',
    auth_no_account: '¿No tienes cuenta? Regístrate aquí',

    legal_terms: 'Términos de Uso',
    legal_privacy: 'Política de Privacidad',
    legal_cookies: 'Política de Cookies',
    legal_notice: 'Aviso Legal',
    cookie_text: 'Utilizamos cookies para garantizar la mejor experiencia gastronómica en nuestra tienda.',
    cookie_accept: 'Aceptar Todas',
    cookie_reject: 'Rechazar',
    cookie_settings: 'Configurar',

    footer_club_title: 'Club de Amigos del Buen Queso',
    footer_club_subtitle: '¿Quieres estar al día de las novedades de EkhiTeka?',
    footer_club_desc: 'Nuevas llegadas de quesos de temporada, catas exclusivas en Lekeitio y lotes limitados antes que nadie.',
    footer_join_whatsapp: 'Unirme por WhatsApp',
    footer_cheese_desc: 'Quesos afinados, salazones del cantábrico y conservas artesanales seleccionadas una a una.',
    footer_delivery_desc: 'Cadena de frío garantizada 24/48 horas para que cada producto llegue en su punto óptimo.',
    footer_pickup_desc: 'Haz tu pedido online y recógelo preparado sin esperas en nuestra quesería de Lekeitio.',
    footer_categories: 'Categorías',
    footer_experiences: 'Experiencias',
    footer_legal: 'Información Legal',
    footer_schedule_title: 'Horario de Tienda:',
    footer_schedule_weekdays: 'Lun-Vie: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Sábados: 10:30 - 15:00',
    footer_copyright: 'Todos los derechos reservados.',
    footer_tagline: 'Inspiración artesana & afinado km0 · Lekeitio',
    footer_exp_tasting: 'Catas Presenciales Lekeitio',
    footer_exp_weddings: 'Mesas de Queso para Bodas',
    footer_exp_gifts: 'Cestas y Regalos Gourmet',
    footer_exp_consult: 'Consultas con el Maestro Quesero',

    shop_specialty: 'Nuestra Especialidad',
    shop_hero_title: 'Quesos y regalos gastronómicos en Lekeitio',
    shop_hero_desc: 'Quesos afinados de autor, tesoros del Cantábrico y maridajes selectos. El sabor auténtico de Lekeitio para regalar y disfrutar.',
    shop_see_cheeses: 'VER NUESTROS QUESOS',
    shop_whatsapp_orders: 'Encargos por WhatsApp',
    shop_visit_title: 'Nuestra Quesería & Espacio Gourmet',
    shop_visit_subtitle: 'Visítanos en Lekeitio · Km0',
    shop_visit_desc: 'En nuestra web ves una selección, en nuestra quesería de Lekeitio lo tienes todo: más de 80 referencias de quesos artesanos afinados, conservas selectas del Cantábrico y el asesoramiento personalizado de nuestros maestros queseros.',
    shop_visit_contact: 'Contactar con la Tienda',

    common_save: 'Guardar',
    common_cancel: 'Cancelar',
    common_delete: 'Eliminar',
    common_edit: 'Editar',
    common_back: 'Volver',
    common_loading: 'Cargando...',
    common_success: 'Acción completada con éxito',
    common_error: 'Ha ocurrido un error',
    common_theme_light: 'Claro',
    common_theme_dark: 'Oscuro',
    common_theme_system: 'Auto',
    common_select_language: 'Seleccionar Idioma',
  },

  en: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Gourmet Store & Artisan Delicacies',
    brand_subtitle: 'Artisan cheeses, white tuna, salted anchovies, gildas, craft beer, txakoli wine and Basque cider.',
    top_refrigerated_shipping: 'Refrigerated 24/48h shipping in mainland',
    top_custom_orders: 'Custom gourmet gifts & expert advice',
    top_store_pickup: 'Free in-store pickup',

    nav_shop: 'Shop',
    nav_cart: 'Cart',
    nav_orders: 'Orders',
    nav_my_products: 'My Products',
    nav_chats: 'Messages',
    nav_admin: 'Admin',
    nav_login: 'Sign In',
    nav_register: 'Sign Up',
    nav_profile: 'Profile',
    nav_logout: 'Log Out',
    nav_gourmet_gifts: 'Gourmet Gifts',
    nav_gourmet_gifts_line1: 'Gourmet',
    nav_gourmet_gifts_line2: 'Gifts',
    nav_tastings_experiences: 'Tastings & Experiences',
    nav_tastings_line1: 'Tastings &',
    nav_tastings_line2: 'Experiences',
    nav_corporate_gifts: 'Corporate Gifts',
    nav_corporate_line1: 'Corporate',
    nav_corporate_line2: 'Gifts',
    nav_events: 'Events',
    nav_add_product: 'Add Product',
    nav_add_product_line1: 'Add',
    nav_add_product_line2: 'Product',
    nav_explore_selection: 'Explore Selection',
    nav_your_account: 'Your Account',

    cat_all: 'All',
    cat_queso: 'Cheese',
    cat_atun: 'White Tuna',
    cat_salazon: 'Salted Fish',
    cat_jildas: 'Gildas & Pickles',
    cat_cerveza: 'Craft Beer',
    cat_txakoli: 'Txakoli Wine',
    cat_sidra: 'Natural Cider',
    cat_new_badge: 'New',
    cat_explore: 'Explore category',
    cat_section_title: 'EkhiTeka Selection Categories',
    sub_quesos: 'Artisan & Aged',
    sub_atun: 'Cantabrian Tuna',
    sub_salazones: 'Anchovies & Salted Fish',
    sub_gildas: 'Gildas & Pickles',
    sub_cerveza: 'Craft & Specials',
    sub_txakoli: 'Bizkaiko Txakolina',
    sub_sidra: 'Basque Cider',

    prod_price: 'Price',
    prod_unit: 'unit',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'bottle',
    prod_can: 'can',
    prod_jar: 'jar',
    prod_origin: 'Origin',
    prod_stock: 'Stock',
    prod_unlimited: 'Unlimited',
    prod_add_to_cart: 'Add to Cart',
    prod_added: 'Added',
    prod_ask_artisan: 'Ask Artisan',
    prod_consult_product: 'Inquiry about this item',
    prod_details: 'Details',
    prod_search_placeholder: 'Search cheeses, tuna, wine, beer...',
    prod_no_results: 'No products found',
    prod_sort_by: 'Sort by',
    prod_sort_name_asc: 'Name (A-Z)',
    prod_sort_name_desc: 'Name (Z-A)',
    prod_sort_price_asc: 'Price (Lowest first)',
    prod_sort_price_desc: 'Price (Highest first)',
    prod_showing: 'products available',
    prod_sold_out: 'Sold Out',
    prod_last_units: 'Last units available!',
    prod_available: 'Available',
    prod_availability: 'Availability:',
    prod_format_label: 'Format',
    prod_weight_label: 'Weight',
    prod_price_per_seat: '/ seat',
    prod_vat_included: 'VAT included',
    prod_doubt_title: 'Do you have questions about this product?',
    prod_doubt_desc: 'Ask directly our master cheesemongers and experts.',
    prod_ask_btn: 'Ask',
    prod_guarantee_cold: 'Cold chain 24/48h',
    prod_guarantee_pickup: 'Pickup in Lekeitio',
    prod_guarantee_km0: 'Artisan km0 quality',
    prod_related_subtitle: 'Cheesemonger Recommendations',
    prod_related_title: 'You Might Also Like',
    prod_back_to_selection: 'Back to selection',

    event_seats: 'seats',
    event_seat: 'seat',
    event_seats_available: 'seats available',
    event_capacity_full: 'Full Capacity (Sold Out)',
    event_last_seats: 'Last seats available!',
    event_reserve_seat: 'Book Seat(s)',
    event_seats_added: 'Seat(s) Added',
    event_upcoming_title: 'Upcoming In-Person Tastings',
    event_upcoming_subtitle: 'Limited seats · Central Lekeitio',
    event_catalog_title: 'Available Tastings & Experiences',
    event_catalog_subtitle: 'In-store tastings & kits for home',
    event_home_catalog_title: 'Home Tasting Kits Available',
    event_home_catalog_subtitle: 'Kits & Tasting packs to take home',
    event_store_catalog_title: 'In-Store Tastings Available',
    event_store_catalog_subtitle: 'In-person in Lekeitio',

    home_hero_badge: 'Gourmet Cheesemonger & Gastro Space',
    home_hero_title: 'Author Cheeses & Experiences in Lekeitio',
    home_hero_subtitle: 'Author Cheeses & Experiences in Lekeitio',
    home_hero_desc: 'Artisan cheese ageing, Cantabrian treasures and curated pairings. Explore our online store, gift hampers and custom experiences in the heart of Biscay.',
    home_explore_btn: 'Explore Online Shop',
    home_gourmet_gifts_btn: 'Gourmet Gifts',
    home_pillars_badge: 'Our House · EkhiTeka Universe',
    home_pillars_title: 'Discover Our Sections',
    home_pillars_desc: 'Choose your preferred experience and let our artisan ageing guide you.',
    home_card1_badge: 'Online & Shipping',
    home_card1_sub: 'Full Catalogue',
    home_card1_title: 'Gourmet Shop',
    home_card1_desc: 'Aged cheeses, Cantabrian white tuna, salted anchovies, artisan gildas, txakoli, cider and craft beer.',
    home_card1_btn: 'Enter Shop',
    home_card2_badge: 'For Gifting',
    home_card2_sub: 'Gifts & Hampers',
    home_card2_title: 'Gourmet Gifts',
    home_card2_desc: 'Bespoke gourmet hampers, home tasting kits and virtual or physical gift cards.',
    home_card2_btn: 'View Gift Options',
    home_card3_badge: 'Sensory',
    home_card3_sub: 'In-Store & Events',
    home_card3_title: 'Tastings & Experiences',
    home_card3_desc: 'Home tasting kits, in-person tastings in Lekeitio, wedding tables and raclette machine rental.',
    home_card3_btn: 'Discover Experiences',
    home_card4_badge: 'Corporate',
    home_card4_sub: 'Teams & Clients',
    home_card4_title: 'Corporate Gifts',
    home_card4_desc: 'Gourmet team-building, artisan Christmas hampers and bespoke corporate delicacies.',
    home_card4_btn: 'View Corporate Services',

    exp_banner_badge: 'Things happen here...',
    exp_banner_title: 'Tastings, Events & EkhiTeka Experiences',
    exp_b1_title: 'In-Person Tastings & Workshops',
    exp_b1_desc: 'Learn how to taste local and international artisan cheeses paired with natural cider, txakoli and author wines in Lekeitio.',
    exp_b1_btn: 'Check Upcoming Dates',
    exp_b2_title: 'Cheese Boards for Weddings & Parties',
    exp_b2_desc: 'We set up impressive bespoke Cheese Corners with edible flowers, artisan breads and pairings for your event.',
    exp_b2_btn: 'Request Event Quote',
    exp_b3_title: 'Gourmet Hampers & Corporate Gifts',
    exp_b3_desc: 'Exclusive gastronomic boxes with premium packaging, calligraphic notes and the finest cheeses.',
    exp_b3_btn: 'Configure Custom Hamper',

    exp_hero_badge: 'Gourmet Experiences',
    exp_hero_title: 'Tastings &',
    exp_hero_title_highlight: 'Experiences',
    exp_hero_desc: 'Discover the craft of artisan cheese through our guided tastings, celebration events and bespoke services to enjoy in Lekeitio or wherever you choose.',
    exp_home_tasting_title: 'Tastings at Home',
    exp_home_tasting_badge: 'At your own pace',
    exp_home_tasting_desc: 'Host your own tasting with our complete kits: selection of 6 aged artisan cheeses classified by intensity, artisanal pairings, illustrated tasting placemat and tasting notes.',
    exp_home_tasting_btn: 'Order Home Tasting Kit',
    exp_store_tasting_title: 'In-Store Tastings',
    exp_store_tasting_badge: 'In-person in Lekeitio',
    exp_store_tasting_desc: 'Exclusive in-person experiences in our Lekeitio cheesemonger (Gamarra Kalea 4). Guided by master cheesemongers in small groups with author cheeses and Basque txakoli.',
    exp_store_tasting_btn: 'View Dates & Book Seat',
    exp_wedding_title: 'Wedding Cheese Tables',
    exp_wedding_badge: 'Weddings & Events',
    exp_wedding_desc: 'We design stunning cheese tables for wedding cocktails and private events. Monumental layouts with fresh fruit, nuts, artisan breads, chutneys and a refined cheese selection.',
    exp_wedding_btn: 'Request Wedding Quote',
    exp_raclette_title: 'Raclette Hire',
    exp_raclette_badge: 'Hire & Pack',
    exp_raclette_desc: 'We lend you the traditional Swiss raclette machine along with pre-sliced aged raclette cheese, artisan cured meats and potatoes for an unforgettable evening without equipment hassle.',
    exp_raclette_btn: 'Check Raclette Availability',

    gifts_hero_badge: 'Exclusive Gifting Selection',
    gifts_hero_title: 'Gourmet',
    gifts_hero_title_highlight: 'Gifts',
    gifts_hero_desc: 'Surprise loved ones with bespoke artisan hampers, aged cheese boxes, gourmet pairings and gift cards for unforgettable occasions.',
    gifts_whatsapp_btn: 'Custom Order via WhatsApp',
    gifts_card1_title: 'Bespoke Gourmet Hampers',
    gifts_card1_desc: 'We create custom hampers combining aged wedges, Cantabrian preserves, txakoli wine and Basque sweets tailored to your budget.',
    gifts_card1_feature: 'Refrigerated delivery with custom gift note',
    gifts_card2_title: 'Tasting & Pairing Packs',
    gifts_card2_desc: 'Themed gift boxes ready to open and enjoy: selections of cheeses classified by intensity with jams, nuts and picos.',
    gifts_card2_feature: 'Delivered in a premium wooden box',
    gifts_card3_title: 'Gift Cards & Tasting Vouchers',
    gifts_card3_desc: 'The perfect gift so they can pick their favourite cheeses or enjoy a guided in-person tasting in our Lekeitio shop.',
    gifts_card3_feature: 'Valid online and in our store',
    gifts_catalog_badge: 'Available for delivery or pickup',
    gifts_catalog_title: 'Hampers & Packs Ready for Gifting',

    corp_hero_badge: 'Corporate Solutions & Christmas Hampers',
    corp_hero_title: 'Corporate',
    corp_hero_title_highlight: 'Gifts',
    corp_hero_desc: 'Reward your team and clients with artisan gastronomic packs, personalised corporate gifts and exclusive tasting events.',
    corp_whatsapp_btn: 'Request Corporate Quote via WhatsApp',
    corp_card1_title: 'Christmas Hampers & Boxes',
    corp_card1_desc: 'Direct premium compositions: aged cheeses, acorn-fed Iberian ham, Cantabrian salted fish and pairings with itemised invoice.',
    corp_card2_title: 'Private Tastings & Team Building',
    corp_card2_desc: 'We organise corporate events and team-building tasting activities in our Lekeitio shop or at your office.',
    corp_card3_title: 'Branding Customisation',
    corp_card3_desc: 'We include custom sleeves, cards with your company logo and dedicated corporate messages for each recipient.',
    corp_logistics_badge: 'EkhiTeka Commitment',
    corp_logistics_title: 'Flawless Logistics & Multi-Address Shipping',
    corp_logistics_desc: 'We handle shipments to individual employee or client addresses in 24/48 hours with full temperature tracking.',
    corp_logistics_feat1: 'Individual shipping to each employee',
    corp_logistics_feat2: 'Certified refrigerated transport',
    corp_logistics_feat3: 'Itemised invoice with VAT breakdown',

    reviews_badge: 'Trust & Gastronomic Passion',
    reviews_title: 'What Our Customers Say',
    reviews_subtitle: 'Feedback from cheese lovers who have tasted our artisan selection',
    reviews_verified_buyer: 'Verified Buyer',
    rev1_comment: 'The cheeses are absolutely incredible. Perfect ageing and refrigerated shipping arrived in 24h. By far the best cheesemonger in Biscay.',
    rev1_date: '3 days ago',
    rev2_comment: 'I ordered a cheese and preserve board for a birthday and every guest was delighted. Friendly service and top WhatsApp advice.',
    rev2_date: '1 week ago',
    rev3_comment: 'I order the cheese and anchovy selection every month. The thermal packaging keeps everything as fresh as visiting the shop.',
    rev3_date: '2 weeks ago',

    cart_title: 'Your Cart',
    cart_empty: 'Your cart is empty',
    cart_empty_sub: 'Explore our gourmet selection and add your favourite delicacies.',
    cart_explore_btn: 'Browse Shop',
    cart_subtotal: 'Subtotal',
    cart_total: 'Total',
    cart_checkout: 'Proceed to Checkout',
    cart_remove: 'Remove',
    cart_quantity: 'Quantity',
    cart_continue_shopping: 'Continue Shopping',
    deliv_choose_mode: 'Choose delivery method',
    deliv_home: 'Home Delivery',
    deliv_home_desc: 'Refrigerated delivery to your doorstep in 24-48 hours',
    deliv_store_pickup: 'Store Pickup',
    deliv_store_pickup_desc: 'Pick up your prepared order directly at our store',
    deliv_shipping_address: 'Shipping Address',
    deliv_shipping_notes: 'Delivery notes (preferred time, building instructions...)',
    deliv_pickup_time: 'Estimated pickup time',
    deliv_pickup_address: 'Store Address: Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirm & Place Order',
    deliv_order_success: 'Order placed successfully!',
    deliv_order_success_desc: 'The artisan has received your order and is preparing it.',

    orders_title: 'My Orders',
    orders_title_seller: 'Order Management',
    orders_subtitle_buyer: 'Track your purchases, product details and order status.',
    orders_subtitle_seller: 'Manage customer orders, update statuses and review items.',
    orders_status: 'Status',
    orders_pending: 'Pending Validation',
    orders_confirmed: 'Confirmed',
    orders_preparing: 'Preparing',
    orders_ready_delivery: 'Ready for Pickup/Delivery',
    orders_delivered: 'Delivered',
    orders_cancelled: 'Cancelled',
    orders_change_status: 'Change status',
    orders_cancel_order: 'Cancel order',
    orders_cancel_reason: 'Cancellation reason',
    orders_chat_with_buyer: 'Chat with Buyer',
    orders_chat_with_seller: 'Chat with Artisan',
    orders_no_orders: 'You have no orders yet',
    orders_no_orders_seller: 'No orders received yet',
    orders_no_orders_seller_sub: 'New customer orders will appear here automatically.',
    orders_products_label: 'Order Items',
    orders_products_to_prepare: 'Items to Prepare',
    orders_purchase_date: 'Purchase Date',
    orders_date_time: 'Date & Time',
    orders_order_number: 'Order:',
    orders_total_to_charge: 'Total to charge:',
    orders_new_status: 'Update! Your order status changed to:',
    orders_mark_seen: 'Mark as Seen',
    orders_client_label: 'Customer',
    orders_qty_label: 'Quantity',

    status_confirm: 'Confirm',
    status_preparing: 'Preparing',
    status_ready: 'Ready',
    status_delivered: 'Delivered',

    seller_new_product: 'Add Gourmet Product',
    seller_edit_product: 'Edit Product',
    seller_product_name: 'Product Name',
    seller_product_desc: 'Description & Tasting Notes',
    seller_product_price: 'Price (€)',
    seller_product_category: 'Category',
    seller_product_format: 'Format / Presentation',
    seller_product_origin: 'Origin / Region',
    seller_product_stock: 'Available Stock',
    seller_product_image: 'Product Photo',
    seller_save_product: 'Save Product',
    seller_delete_product: 'Delete Product',
    seller_product_deleted: 'Product deleted successfully',

    seller_events_title: 'In-Store In-Person Tastings',
    seller_events_subtitle: 'Capacity control, variables edition and attendee management for tastings in Lekeitio.',
    seller_events_edit_btn: 'Edit Tasting',
    seller_events_reserved: 'Booked',
    seller_events_available: 'Available',
    seller_events_collected: 'Collected',
    seller_events_attendees_title: 'Tasting Attendees',
    seller_events_no_events: 'You have no in-person tastings created yet',
    seller_events_no_events_desc: 'Publish an in-person tasting in our Lekeitio shop from the top menu to manage capacity and attendees.',
    seller_events_col_buyer: 'Buyer',
    seller_events_col_contact: 'Contact',
    seller_events_col_seats: 'Seats',
    seller_events_col_date: 'Purchase Date',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Actions',

    chat_title: 'Messages & Support',
    chat_type_message: 'Type your message here...',
    chat_send: 'Send',
    chat_about_product: 'About this item',
    chat_about_order: 'About this order',
    chat_no_messages: 'No messages yet',
    chat_conversations: 'Conversations',

    role_buyer: 'Buyer / Gourmet',
    role_seller: 'Artisan / Seller',
    role_admin: 'Administrator',
    auth_email: 'Email address',
    auth_password: 'Password',
    auth_full_name: 'Full Name / Store Name',
    auth_phone: 'Contact Phone',
    auth_town: 'City / Town',
    auth_have_account: 'Already have an account? Sign in',
    auth_no_account: "Don't have an account? Register here",

    legal_terms: 'Terms of Service',
    legal_privacy: 'Privacy Policy',
    legal_cookies: 'Cookie Policy',
    legal_notice: 'Legal Notice',
    cookie_text: 'We use cookies to ensure you get the best gourmet shopping experience.',
    cookie_accept: 'Accept All',
    cookie_reject: 'Decline',
    cookie_settings: 'Preferences',

    footer_club_title: 'Friends of Good Cheese Club',
    footer_club_subtitle: 'Want to stay up to date with EkhiTeka news?',
    footer_club_desc: 'Seasonal cheese arrivals, exclusive tastings in Lekeitio and limited batches — before anyone else.',
    footer_join_whatsapp: 'Join via WhatsApp',
    footer_cheese_desc: 'Aged artisan cheeses, Cantabrian salted fish and hand-picked preserves.',
    footer_delivery_desc: 'Cold chain guaranteed 24/48 hours so every product arrives in perfect condition.',
    footer_pickup_desc: 'Order online and collect your prepared order with no wait at our Lekeitio cheesemonger.',
    footer_categories: 'Categories',
    footer_experiences: 'Experiences',
    footer_legal: 'Legal Information',
    footer_schedule_title: 'Store Hours:',
    footer_schedule_weekdays: 'Mon-Fri: 10:00 - 14:30 | 17:00 - 20:30',
    footer_schedule_saturday: 'Saturdays: 10:30 - 15:00',
    footer_copyright: 'All rights reserved.',
    footer_tagline: 'Artisan inspiration & km0 ageing · Lekeitio',
    footer_exp_tasting: 'In-Person Tastings Lekeitio',
    footer_exp_weddings: 'Cheese Boards for Weddings',
    footer_exp_gifts: 'Gourmet Hampers & Gifts',
    footer_exp_consult: 'Consult the Master Cheesemonger',

    shop_specialty: 'Our Speciality',
    shop_hero_title: 'Artisan cheeses & gourmet gifts in Lekeitio',
    shop_hero_desc: 'Author-aged cheeses, Cantabrian treasures and curated pairings. The authentic taste of Lekeitio to gift and enjoy.',
    shop_see_cheeses: 'SEE OUR CHEESES',
    shop_whatsapp_orders: 'Custom Orders via WhatsApp',
    shop_visit_title: 'Our Cheesemonger & Gourmet Space',
    shop_visit_subtitle: 'Visit us in Lekeitio · Km0',
    shop_visit_desc: 'Our website shows a selection, but our Lekeitio shop has it all: over 80 references of aged artisan cheeses, Cantabrian preserved fish and personalised advice from our master cheesemongers.',
    shop_visit_contact: 'Contact the Shop',

    common_save: 'Save',
    common_cancel: 'Cancel',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_back: 'Back',
    common_loading: 'Loading...',
    common_success: 'Completed successfully',
    common_error: 'An error occurred',
    common_theme_light: 'Light',
    common_theme_dark: 'Dark',
    common_theme_system: 'Auto',
    common_select_language: 'Select Language',
  },

  fr: {
    brand_name: 'EkhiTeka',
    brand_tagline: 'Épicerie Fine & Produits Artisanaux',
    brand_subtitle: 'Fromages fermiers, thon blanc, salaisons, gildas, bière artisanale, vin txakoli et cidre basque.',
    top_refrigerated_shipping: 'Livraison réfrigérée 24/48h',
    top_custom_orders: 'Coffrets sur mesure et conseils d\'experts',
    top_store_pickup: 'Retrait gratuit en boutique',

    nav_shop: 'Boutique',
    nav_cart: 'Panier',
    nav_orders: 'Commandes',
    nav_my_products: 'Mes Produits',
    nav_chats: 'Messages',
    nav_admin: 'Admin',
    nav_login: 'Connexion',
    nav_register: 'Inscription',
    nav_profile: 'Profil',
    nav_logout: 'Déconnexion',
    nav_gourmet_gifts: 'Cadeaux Gourmets',
    nav_gourmet_gifts_line1: 'Cadeaux',
    nav_gourmet_gifts_line2: 'Gourmets',
    nav_tastings_experiences: 'Dégustations & Expériences',
    nav_tastings_line1: 'Dégustations &',
    nav_tastings_line2: 'Expériences',
    nav_corporate_gifts: 'Cadeaux d\'Entreprise',
    nav_corporate_line1: 'Cadeaux',
    nav_corporate_line2: 'd\'Entreprise',
    nav_events: 'Événements',
    nav_add_product: 'Ajouter un Produit',
    nav_add_product_line1: 'Ajouter',
    nav_add_product_line2: 'Produit',
    nav_explore_selection: 'Explorer la Sélection',
    nav_your_account: 'Votre Compte',

    cat_all: 'Tous',
    cat_queso: 'Fromage',
    cat_atun: 'Thon blanc',
    cat_salazon: 'Salaisons',
    cat_jildas: 'Gildas & Condiments',
    cat_cerveza: 'Bière artisanale',
    cat_txakoli: 'Vin Txakoli',
    cat_sidra: 'Cidre naturel',
    cat_new_badge: 'Nouveau',
    cat_explore: 'Explorer la catégorie',
    cat_section_title: 'Catégories Sélection EkhiTeka',
    sub_quesos: 'Fermiers & Affinés',
    sub_atun: 'Thon Cantabrique',
    sub_salazones: 'Anchois & Salaisons',
    sub_gildas: 'Gildas & Condiments',
    sub_cerveza: 'Craft & Spéciales',
    sub_txakoli: 'Vin Txakoli Basque',
    sub_sidra: 'Cidre du Pays Basque',

    prod_price: 'Prix',
    prod_unit: 'pièce',
    prod_kg: 'kg',
    prod_pack: 'pack',
    prod_bottle: 'bouteille',
    prod_can: 'boîte',
    prod_jar: 'bocal',
    prod_origin: 'Origine',
    prod_stock: 'Stock',
    prod_unlimited: 'Illimité',
    prod_add_to_cart: 'Ajouter au panier',
    prod_added: 'Ajouté',
    prod_ask_artisan: 'Contacter l\'artisan',
    prod_consult_product: 'Question sur ce produit',
    prod_details: 'Détails',
    prod_search_placeholder: 'Rechercher fromages, thon, vins...',
    prod_no_results: 'Aucun produit trouvé',
    prod_sort_by: 'Trier par',
    prod_sort_name_asc: 'Nom (A-Z)',
    prod_sort_name_desc: 'Nom (Z-A)',
    prod_sort_price_asc: 'Prix (croissant)',
    prod_sort_price_desc: 'Prix (décroissant)',
    prod_showing: 'produits disponibles',
    prod_sold_out: 'Épuisé',
    prod_last_units: 'Dernières unités !',
    prod_available: 'Disponible',
    prod_availability: 'Disponibilité :',
    prod_format_label: 'Format',
    prod_weight_label: 'Poids',
    prod_price_per_seat: '/ place',
    prod_vat_included: 'TTC',
    prod_doubt_title: 'Une question sur ce produit ?',
    prod_doubt_desc: 'Consultez directement nos maîtres affineurs et experts.',
    prod_ask_btn: 'Demander',
    prod_guarantee_cold: 'Froid garanti 24/48h',
    prod_guarantee_pickup: 'Retrait à Lekeitio',
    prod_guarantee_km0: 'Qualité artisanale km0',
    prod_related_subtitle: 'Recommandations de l\'affineur',
    prod_related_title: 'Vous pourriez aussi aimer',
    prod_back_to_selection: 'Retour à la sélection',

    event_seats: 'places',
    event_seat: 'place',
    event_seats_available: 'places disponibles',
    event_capacity_full: 'Complet (Plus de places)',
    event_last_seats: 'Dernières places !',
    event_reserve_seat: 'Réserver Place(s)',
    event_seats_added: 'Place(s) Ajoutée(s)',
    event_upcoming_title: 'Prochains Événements de Dégustation en Boutique',
    event_upcoming_subtitle: 'Places limitées · Centre de Lekeitio',
    event_catalog_title: 'Dégustations & Expériences Disponibles',
    event_catalog_subtitle: 'Dégustations en boutique et kits à emporter',
    event_home_catalog_title: 'Kits de Dégustation à Domicile',
    event_home_catalog_subtitle: 'Kits & Packs de dégustation à emporter',
    event_store_catalog_title: 'Dégustations en Boutique Disponibles',
    event_store_catalog_subtitle: 'En présentiel à Lekeitio',

    home_hero_badge: 'Fromagerie Fine & Espace Gourmand',
    home_hero_title: 'Fromages d\'Auteur & Dégustations à Lekeitio',
    home_hero_subtitle: 'Fromages d\'Auteur & Dégustations à Lekeitio',
    home_hero_desc: 'Affinage artisanal de fromages uniques, trésors du Cantabrique et accords fins. Découvrez notre boutique en ligne, coffrets cadeaux et expériences au cœur de Biscaye.',
    home_explore_btn: 'Explorer la Boutique',
    home_gourmet_gifts_btn: 'Cadeaux Gourmets',
    home_pillars_badge: 'Notre Maison · L\'Univers EkhiTeka',
    home_pillars_title: 'Découvrez Nos Univers',
    home_pillars_desc: 'Choisissez l\'expérience souhaitée et laissez-vous guider par notre savoir-faire.',
    home_card1_badge: 'En Ligne & Livraison',
    home_card1_sub: 'Catalogue Complet',
    home_card1_title: 'Boutique Fine',
    home_card1_desc: 'Fromages affinés, thon blanc, anchois, gildas artisanales, vin txakoli, cidre et bières basques.',
    home_card1_btn: 'Entrer dans la Boutique',
    home_card2_badge: 'À Offrir',
    home_card2_sub: 'Coffrets & Paniers',
    home_card2_title: 'Cadeaux Gourmets',
    home_card2_desc: 'Paniers gourmets sur mesure, kits de dégustation à domicile et cartes cadeaux.',
    home_card2_btn: 'Voir les Idées Cadeaux',
    home_card3_badge: 'Sensoriel',
    home_card3_sub: 'En Boutique & Événements',
    home_card3_title: 'Dégustations & Ateliers',
    home_card3_desc: 'Kits à la maison, dégustations guidées en boutique à Lekeitio, buffets de mariage et prêt d\'appareil à raclette.',
    home_card3_btn: 'Découvrir les Expériences',
    home_card4_badge: 'Entreprises',
    home_card4_sub: 'Équipes & Clients',
    home_card4_title: 'Cadeaux d\'Entreprise',
    home_card4_desc: 'Team building gourmand, coffrets de Noël artisanaux et attentions d\'entreprise sur mesure.',
    home_card4_btn: 'Voir les Offres Pro',

    exp_banner_badge: 'Ici il se passe des choses...',
    exp_banner_title: 'Dégustations, Événements & Expériences EkhiTeka',
    exp_b1_title: 'Dégustations Présentielles & Ateliers',
    exp_b1_desc: 'Apprenez à déguster des fromages fermiers locaux et internationaux, associés aux cidres naturels et txakolis à Lekeitio.',
    exp_b1_btn: 'Consulter les Prochaines Dates',
    exp_b2_title: 'Buffets Fromages de Mariage & Fêtes',
    exp_b2_desc: 'Nous créons des Cheese Corners personnalisés avec fleurs comestibles, pains et confitures pour votre événement.',
    exp_b2_btn: 'Demander un Devis Événement',
    exp_b3_title: 'Paniers Gourmets & Cadeaux d\'Entreprise',
    exp_b3_desc: 'Coffrets gastronomiques exclusifs avec emballage soigné, cartes calligraphiées et sélection affinée.',
    exp_b3_btn: 'Composer un Panier sur Mesure',

    exp_hero_badge: 'Expériences Gastronomiques',
    exp_hero_title: 'Dégustations &',
    exp_hero_title_highlight: 'Expériences',
    exp_hero_desc: 'Découvrez l\'art du fromage fermier à travers nos dégustations guidées, événements de célébration et services exclusifs à Lekeitio ou au lieu de votre choix.',
    exp_home_tasting_title: 'Dégustations à la Maison',
    exp_home_tasting_badge: 'À votre rythme',
    exp_home_tasting_desc: 'Devenez l\'hôte idéal grâce à nos kits complets : sélection de 6 fromages affinés par intensités, accords artisanaux, set de table illustré et fiches de dégustation explicatives.',
    exp_home_tasting_btn: 'Commander Kit à Domicile',
    exp_store_tasting_title: 'Dégustations en Boutique',
    exp_store_tasting_badge: 'En présentiel à Lekeitio',
    exp_store_tasting_desc: 'Expériences présentielles exclusives dans notre fromagerie de Lekeitio (Gamarra Kalea 4). Guidées par nos maîtres affineurs en petits groupes avec txakoli de Biscaye.',
    exp_store_tasting_btn: 'Voir les Dates & Réserver',
    exp_wedding_title: 'Buffets Fromages de Mariage',
    exp_wedding_badge: 'Mariages & Événements',
    exp_wedding_desc: 'Nous créons des buffets de fromages spectaculaires pour cocktails de mariage et fêtes. Mises en scène monumentales avec fruits frais, fruits secs, pains et confitures artisanales.',
    exp_wedding_btn: 'Demander un Devis Mariage',
    exp_raclette_title: 'Prêt d\'Appareil à Raclette',
    exp_raclette_badge: 'Location & Pack',
    exp_raclette_desc: 'Nous vous prêtons l\'appareil traditionnel suisse professionnel avec le fromage à raclette affiné prédécoupé, charcuteries et pommes de terre pour une soirée conviviale sans contrainte.',
    exp_raclette_btn: 'Consulter la Disponibilité Raclette',

    gifts_hero_badge: 'Sélection Exclusive à Offrir',
    gifts_hero_title: 'Cadeaux',
    gifts_hero_title_highlight: 'Gourmets',
    gifts_hero_desc: 'Surprenez avec des paniers artisanaux sur mesure, coffrets de fromages affinés, accords d\'auteur et cartes cadeaux pour des moments inoubliables.',
    gifts_whatsapp_btn: 'Commande Sur Mesure sur WhatsApp',
    gifts_card1_title: 'Paniers Gourmets Sur Mesure',
    gifts_card1_desc: 'Nous composons des paniers combinant fromages affinés, conserves du Cantabrique, txakoli et douceurs basques selon votre budget.',
    gifts_card1_feature: 'Livraison réfrigérée avec carte personnalisée',
    gifts_card2_title: 'Coffrets Dégustation & Accords',
    gifts_card2_desc: 'Coffrets prêts à déguster : sélections de fromages par intensité avec confitures artisanales, noix et crackers fins.',
    gifts_card2_feature: 'Présentation dans une boîte en bois prémium',
    gifts_card3_title: 'Cartes Cadeaux & Dégustations',
    gifts_card3_desc: 'Le cadeau parfait pour choisir leurs fromages préférés ou vivre une dégustation guidée en boutique à Lekeitio.',
    gifts_card3_feature: 'Valable en ligne et en boutique',
    gifts_catalog_badge: 'Disponibles pour livraison ou retrait',
    gifts_catalog_title: 'Paniers & Coffrets Prêts à Offrir',

    corp_hero_badge: 'Offres Entreprises & Paniers de Fêtes',
    corp_hero_title: 'Cadeaux',
    corp_hero_title_highlight: 'd\'Entreprise',
    corp_hero_desc: 'Remerciez vos équipes et clients avec des paniers artisanaux, des cadeaux d\'affaires sur mesure et des dégustations privées.',
    corp_whatsapp_btn: 'Devis Entreprise par WhatsApp',
    corp_card1_title: 'Coffrets et Paniers de Noël',
    corp_card1_desc: 'Compositions sans intermédiaires : fromages d\'affineur, charcuterie ibérique, salaisons du Cantabrique et facture détaillée.',
    corp_card2_title: 'Dégustations Privées & Team Building',
    corp_card2_desc: 'Nous organisons vos événements d\'équipe guidés dans notre fromagerie à Lekeitio ou dans vos locaux.',
    corp_card3_title: 'Personnalisation à Vos Couleurs',
    corp_card3_desc: 'Nous intégrons des bandeaux personnalisés, des cartes avec le logo de votre entreprise et des messages dédiés.',
    corp_logistics_badge: 'Engagement EkhiTeka',
    corp_logistics_title: 'Logistique Soignée & Multi-Adresses',
    corp_logistics_desc: 'Nous gérons les expéditions individuelles vers les domiciles de vos collaborateurs en 24/48h avec suivi garanti.',
    corp_logistics_feat1: 'Envois individuels à chaque salarié',
    corp_logistics_feat2: 'Transport frigorifique certifié',
    corp_logistics_feat3: 'Facturation claire avec TVA détaillée',

    reviews_badge: 'Confiance & Passion Gastronomique',
    reviews_title: 'Avis de Nos Clients',
    reviews_subtitle: 'Ce que disent les amateurs de bon fromage ayant testé notre sélection',
    reviews_verified_buyer: 'Acheteur vérifié',
    rev1_comment: 'Les fromages sont extraordinaires. Affinage缩peccable et colis frais reçu en 24h. De loin la meilleure fromagerie de Biscaye.',
    rev1_date: 'Il y a 3 jours',
    rev2_comment: 'J\'ai commandé un plateau pour un anniversaire, les invités étaient conquis. Accueil chaleureux et conseils parfaits sur WhatsApp.',
    rev2_date: 'Il y a 1 semaine',
    rev3_comment: 'Je commande ma sélection tous les mois. L\'emballage thermique garde le produit aussi frais qu\'en boutique.',
    rev3_date: 'Il y a 2 semaines',

    cart_title: 'Votre Panier',
    cart_empty: 'Votre panier est vide',
    cart_empty_sub: 'Découvrez nos délices gourmets et composez votre sélection.',
    cart_explore_btn: 'Voir la boutique',
    cart_subtotal: 'Sous-total',
    cart_total: 'Total',
    cart_checkout: 'Valider la commande',
    cart_remove: 'Supprimer',
    cart_quantity: 'Quantité',
    cart_continue_shopping: 'Continuer les Achats',
    deliv_choose_mode: 'Mode de réception',
    deliv_home: 'Livraison à domicile',
    deliv_home_desc: 'Colis réfrigéré livré à votre porte en 24-48h',
    deliv_store_pickup: 'Retrait en boutique',
    deliv_store_pickup_desc: 'Récupérez votre commande prête dans notre magasin',
    deliv_shipping_address: 'Adresse de livraison',
    deliv_shipping_notes: 'Instructions de livraison (digicode, créneau...)',
    deliv_pickup_time: 'Heure de retrait estimée',
    deliv_pickup_address: 'Adresse boutique : Gamarra Kalea 4, Lekeitio',
    deliv_confirm_order: 'Confirmer la commande',
    deliv_order_success: 'Commande validée avec succès !',
    deliv_order_success_desc: 'L\'artisan a reçu votre commande et prépare vos produits.',

    orders_title: 'Mes Commandes',
    orders_title_seller: 'Gestion des Commandes',
    orders_subtitle_buyer: 'Suivez vos achats, les détails des produits et le statut de vos commandes.',
    orders_subtitle_seller: 'Gérez les commandes clients, mettez à jour les statuts et préparez les articles.',
    orders_status: 'Statut',
    orders_pending: 'À valider',
    orders_confirmed: 'Validée',
    orders_preparing: 'En préparation',
    orders_ready_delivery: 'Prête pour retrait/livraison',
    orders_delivered: 'Livrée',
    orders_cancelled: 'Annulée',
    orders_change_status: 'Changer le statut',
    orders_cancel_order: 'Annuler la commande',
    orders_cancel_reason: 'Motif d\'annulation',
    orders_chat_with_buyer: 'Chat avec le client',
    orders_chat_with_seller: 'Chat avec l\'artisan',
    orders_no_orders: 'Vous n\'avez aucune commande pour le moment',
    orders_no_orders_seller: 'Aucune commande reçue pour le moment',
    orders_no_orders_seller_sub: 'Les nouvelles commandes de vos clients apparaîtront ici automatiquement.',
    orders_products_label: 'Articles de la commande',
    orders_products_to_prepare: 'Articles à préparer',
    orders_purchase_date: 'Date d\'achat',
    orders_date_time: 'Date & Heure',
    orders_order_number: 'Commande :',
    orders_total_to_charge: 'Total à encaisser :',
    orders_new_status: 'Mise à jour ! Le statut de votre commande a changé :',
    orders_mark_seen: 'Marquer comme lu',
    orders_client_label: 'Client',
    orders_qty_label: 'Quantité',

    status_confirm: 'Confirmer',
    status_preparing: 'En préparation',
    status_ready: 'Prête',
    status_delivered: 'Livrée',

    seller_new_product: 'Ajouter un Produit Gourmet',
    seller_edit_product: 'Modifier le Produit',
    seller_product_name: 'Nom du Produit',
    seller_product_desc: 'Description et notes de dégustation',
    seller_product_price: 'Prix (€)',
    seller_product_category: 'Catégorie',
    seller_product_format: 'Format / Présentation',
    seller_product_origin: 'Origine / Terroir',
    seller_product_stock: 'Stock disponible',
    seller_product_image: 'Photo du Produit',
    seller_save_product: 'Enregistrer le Produit',
    seller_delete_product: 'Supprimer le Produit',
    seller_product_deleted: 'Produit supprimé avec succès',

    seller_events_title: 'Dégustations en Boutique',
    seller_events_subtitle: 'Contrôle de jauge, modification des variables et gestion des inscrits à Lekeitio.',
    seller_events_edit_btn: 'Modifier la Dégustation',
    seller_events_reserved: 'Réservées',
    seller_events_available: 'Disponibles',
    seller_events_collected: 'Encaissé',
    seller_events_attendees_title: 'Participants à la Dégustation',
    seller_events_no_events: 'Vous n\'avez pas encore créé de dégustation en boutique',
    seller_events_no_events_desc: 'Publiez une dégustation en boutique depuis le menu supérieur pour gérer la jauge et les réservations.',
    seller_events_col_buyer: 'Acheteur',
    seller_events_col_contact: 'Contact',
    seller_events_col_seats: 'Places',
    seller_events_col_date: 'Date d\'Achat',
    seller_events_col_total: 'Total',
    seller_events_col_actions: 'Actions',

    chat_title: 'Messagerie & Conseils',
    chat_type_message: 'Écrivez votre message ici...',
    chat_send: 'Envoyer',
    chat_about_product: 'À propos de cet article',
    chat_about_order: 'À propos de cette commande',
    chat_no_messages: 'Aucun message pour le moment',
    chat_conversations: 'Conversations',

    role_buyer: 'Client / Gourmet',
    role_seller: 'Artisan / Vendeur',
    role_admin: 'Administrateur',
    auth_email: 'Adresse e-mail',
    auth_password: 'Mot de passe',
    auth_full_name: 'Nom complet ou Nom de la boutique',
    auth_phone: 'Téléphone de contact',
    auth_town: 'Ville / Commune',
    auth_have_account: 'Vous avez déjà un compte ? Connectez-vous',
    auth_no_account: 'Pas encore de compte ? Inscrivez-vous',

    legal_terms: 'Conditions Générales',
    legal_privacy: 'Politique de Confidentialité',
    legal_cookies: 'Politique de Cookies',
    legal_notice: 'Mentions Légales',
    cookie_text: 'Nous utilisons des cookies pour vous garantir la meilleure expérience gastronomique.',
    cookie_accept: 'Tout Accepter',
    cookie_reject: 'Refuser',
    cookie_settings: 'Personnaliser',

    footer_club_title: 'Club des Amis du Bon Fromage',
    footer_club_subtitle: 'Vous souhaitez rester informé des actualités d\'EkhiTeka ?',
    footer_club_desc: 'Nouvelles arrivées de fromages de saison, dégustations exclusives à Lekeitio et lots limités avant tout le monde.',
    footer_join_whatsapp: 'Rejoindre par WhatsApp',
    footer_cheese_desc: 'Fromages affinés, poissons salés du Cantabrique et conserves artisanales sélectionnées à la main.',
    footer_delivery_desc: 'Chaîne du froid garantie 24/48h pour que chaque produit arrive dans son état optimal.',
    footer_pickup_desc: 'Commandez en ligne et récupérez votre commande prête sans attente dans notre fromagerie de Lekeitio.',
    footer_categories: 'Catégories',
    footer_experiences: 'Expériences',
    footer_legal: 'Informations Légales',
    footer_schedule_title: 'Horaires boutique :',
    footer_schedule_weekdays: 'Lun-Ven : 10h00 - 14h30 | 17h00 - 20h30',
    footer_schedule_saturday: 'Samedis : 10h30 - 15h00',
    footer_copyright: 'Tous droits réservés.',
    footer_tagline: 'Inspiration artisanale & affinage km0 · Lekeitio',
    footer_exp_tasting: 'Dégustations en Présentiel Lekeitio',
    footer_exp_weddings: 'Plateaux de Fromages pour Mariages',
    footer_exp_gifts: 'Paniers et Cadeaux Gourmets',
    footer_exp_consult: 'Consultations avec le Maître Fromager',

    shop_specialty: 'Notre Spécialité',
    shop_hero_title: 'Fromages et cadeaux gastronomiques à Lekeitio',
    shop_hero_desc: 'Fromages affinés d\'auteur, trésors du Cantabrique et accords sélectionnés. La saveur authentique de Lekeitio à offrir et à savourer.',
    shop_see_cheeses: 'VOIR NOS FROMAGES',
    shop_whatsapp_orders: 'Commandes sur WhatsApp',
    shop_visit_title: 'Notre Fromagerie & Espace Gourmet',
    shop_visit_subtitle: 'Venez nous rendre visite à Lekeitio · Km0',
    shop_visit_desc: 'Sur notre site vous voyez une sélection, dans notre fromagerie de Lekeitio vous trouvez tout : plus de 80 références de fromages artisanaux affinés, conserves du Cantabrique et conseils personnalisés de nos maîtres fromagers.',
    shop_visit_contact: 'Contacter la Boutique',

    common_save: 'Enregistrer',
    common_cancel: 'Annuler',
    common_delete: 'Supprimer',
    common_edit: 'Modifier',
    common_back: 'Retour',
    common_loading: 'Chargement...',
    common_success: 'Opération réussie',
    common_error: 'Une erreur est survenue',
    common_theme_light: 'Clair',
    common_theme_dark: 'Sombre',
    common_theme_system: 'Auto',
    common_select_language: 'Choisir la langue',
  },
};
